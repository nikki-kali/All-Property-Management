const pool = require('../config/db');

exports.getTenants = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.*, p.title AS property_title, p.address AS property_address
       FROM tenants t JOIN properties p ON p.id = t.property_id
       ORDER BY t.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTenantById = async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM tenants WHERE id = $1`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Tenant not found' });
    const { rows: payments } = await pool.query(
      `SELECT * FROM payments WHERE tenant_id = $1 ORDER BY due_date DESC`, [req.params.id]
    );
    res.json({ ...rows[0], payments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTenant = async (req, res) => {
  const { full_name, phone, email, property_id, lease_start, lease_end, monthly_rate, due_day_of_month, grace_period_days } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO tenants (full_name, phone, email, property_id, lease_start, lease_end, monthly_rate, due_day_of_month, grace_period_days)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [full_name, phone, email, property_id, lease_start, lease_end, monthly_rate, due_day_of_month, grace_period_days || 0]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/tenants/:id/payments — log a payment
exports.logPayment = async (req, res) => {
  const { amount, due_date, paid_date, method, status, receipt_url } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO payments (tenant_id, amount, due_date, paid_date, method, status, receipt_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [req.params.id, amount, due_date, paid_date || null, method || null, status || 'pending', receipt_url || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/tenants/late — tenants with a payment currently past grace period
exports.getLatePayments = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT t.id AS tenant_id, t.full_name, p.*
      FROM payments p
      JOIN tenants t ON t.id = p.tenant_id
      WHERE p.status != 'paid'
        AND p.due_date + (COALESCE(t.grace_period_days, 0) * INTERVAL '1 day') < CURRENT_DATE
      ORDER BY p.due_date ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/tenants/renewals?days=90 — tenants whose lease ends within the given window.
// Dates are computed here in JS (rather than with CURRENT_DATE + INTERVAL) so this works
// identically against Postgres and the local SQLite fallback without needing a translateSql rule.
exports.getUpcomingRenewals = async (req, res) => {
  const days = Number(req.query.days) || 90;
  const today = new Date();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + days);
  const toISODate = (d) => d.toISOString().slice(0, 10);

  try {
    const { rows } = await pool.query(
      `SELECT t.*, p.title AS property_title, p.address AS property_address
       FROM tenants t JOIN properties p ON p.id = t.property_id
       WHERE t.lease_end IS NOT NULL AND t.lease_end BETWEEN $1 AND $2
       ORDER BY t.lease_end ASC`,
      [toISODate(today), toISODate(cutoff)]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
