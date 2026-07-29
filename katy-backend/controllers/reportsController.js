const pool = require('../config/db');

exports.getSummary = async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM v_dashboard_summary`);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAttribution = async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM v_lead_source_attribution`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRevenueByService = async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM v_revenue_by_service`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/reports/monthly?month=2026-07
exports.getMonthlySnapshot = async (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  try {
    const { rows } = await pool.query(
      `SELECT service, stage, COUNT(*) AS count
       FROM leads
       WHERE to_char(created_at, 'YYYY-MM') = $1
       GROUP BY service, stage
       ORDER BY service`,
      [month]
    );
    res.json({ month, breakdown: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
