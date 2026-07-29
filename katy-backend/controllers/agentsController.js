const pool = require('../config/db');

exports.getAgents = async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM agents ORDER BY created_at DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAgent = async (req, res) => {
  const { full_name, email, phone, coverage_area } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO agents (full_name, email, phone, coverage_area) VALUES ($1,$2,$3,$4) RETURNING *`,
      [full_name, email, phone, coverage_area]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/agents/:id/status — e.g. approve an applicant → triggers onboarding email (see proposals route)
exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE agents SET status = $1, onboarded_at = ${status === 'active' ? 'now()' : 'onboarded_at'} WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Agent not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/agents/:id/referrals — leads this agent submitted
exports.getReferrals = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM leads WHERE agent_id = $1 ORDER BY created_at DESC`, [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/agents/:id/commissions
exports.getCommissions = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM commissions WHERE agent_id = $1 ORDER BY created_at DESC`, [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/agents/:id/commissions
exports.addCommission = async (req, res) => {
  const { lead_id, service, amount } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO commissions (agent_id, lead_id, service, amount) VALUES ($1,$2,$3,$4) RETURNING *`,
      [req.params.id, lead_id || null, service || null, amount]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/commissions/:id/release
exports.releaseCommission = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE commissions SET status = 'released', released_at = now() WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Commission not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
