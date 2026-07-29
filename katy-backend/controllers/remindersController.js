const pool = require('../config/db');
const { sendEmail } = require('../services/brevoService');
const fs = require('fs');
const path = require('path');

// Each value = (due_date - today) in days. E.g. due_7d fires when due_date is
// 7 days in the future; late_3d fires when due_date was 3 days in the past.
const OFFSET_DAYS = {
  due_7d: 7,
  due_3d: 3,
  due_1d: 1,
  due_today: 0,
  late_3d: -3,
};

function renderReminderEmail({ tenant_name, property_address, amount, due_date, is_late }) {
  const templatePath = path.join(__dirname, '..', 'templates', 'rental-reminder.html');
  let html = fs.readFileSync(templatePath, 'utf8');
  html = html
    .replace(/{{tenant_name}}/g, tenant_name)
    .replace(/{{property_address}}/g, property_address)
    .replace(/{{amount}}/g, amount)
    .replace(/{{due_date}}/g, due_date)
    .replace(/{{late_notice}}/g, is_late ? 'This payment is now past the grace period.' : '');
  return html;
}

// This is meant to be called by a daily cron job (e.g. Render cron or Supabase scheduled function).
// GET /api/reminders/run
exports.runDailyReminders = async (req, res) => {
  const results = [];

  try {
    for (const [reminderType, offset] of Object.entries(OFFSET_DAYS)) {
      const { rows: payments } = await pool.query(
        `SELECT p.*, t.full_name AS tenant_name, t.email AS tenant_email, t.reminder_schedule,
                pr.address AS property_address
         FROM payments p
         JOIN tenants t ON t.id = p.tenant_id
         JOIN properties pr ON pr.id = t.property_id
         WHERE p.due_date = (CURRENT_DATE + ($1 * INTERVAL '1 day'))::date
           AND p.status != 'paid'
           AND $2 = ANY(t.reminder_schedule)
           AND NOT EXISTS (
             SELECT 1 FROM reminder_log rl
             WHERE rl.payment_id = p.id AND rl.reminder_type = $2
           )`,
        [offset, reminderType]
      );

      for (const payment of payments) {
        if (!payment.tenant_email) continue;

        const html = renderReminderEmail({
          tenant_name: payment.tenant_name,
          property_address: payment.property_address,
          amount: payment.amount,
          due_date: payment.due_date,
          is_late: reminderType === 'late_3d',
        });

        await sendEmail({
          to: payment.tenant_email,
          toName: payment.tenant_name,
          subject:
            reminderType === 'late_3d'
              ? 'Late Payment Notice — Katy Property Solutions'
              : 'Rent Payment Reminder — Katy Property Solutions',
          htmlContent: html,
        });

        await pool.query(
          `INSERT INTO reminder_log (tenant_id, payment_id, reminder_type, channel) VALUES ($1,$2,$3,'email')`,
          [payment.tenant_id, payment.id, reminderType]
        );

        if (reminderType === 'late_3d') {
          await pool.query(`UPDATE payments SET status = 'late' WHERE id = $1`, [payment.id]);
        }

        results.push({ tenant: payment.tenant_name, type: reminderType });
      }
    }

    res.json({ sent: results.length, details: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
