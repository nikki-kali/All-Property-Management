const pool = require('../config/db');

// GET /api/leads?service=&stage=
exports.getLeads = async (req, res) => {
  const { service, stage } = req.query;
  const conditions = [];
  const values = [];

  if (service) { values.push(service); conditions.push(`service = $${values.length}`); }
  if (stage) { values.push(stage); conditions.push(`stage = $${values.length}`); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const { rows } = await pool.query(
      `SELECT l.*, c.full_name AS client_name, c.email AS client_email, c.phone AS client_phone
       FROM leads l
       LEFT JOIN clients c ON c.id = l.client_id
       ${where}
       ORDER BY l.created_at DESC`,
      values
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/leads/:id
exports.getLeadById = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT l.*, c.full_name AS client_name, c.email AS client_email, c.phone AS client_phone
       FROM leads l LEFT JOIN clients c ON c.id = l.client_id
       WHERE l.id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Lead not found' });

    const { rows: activity } = await pool.query(
      `SELECT * FROM lead_activity WHERE lead_id = $1 ORDER BY created_at DESC`,
      [req.params.id]
    );
    res.json({ ...rows[0], activity });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/leads  — used by public site lead forms (auto-tagged by service)
exports.createLead = async (req, res) => {
  const { full_name, email, phone, service, source_page, property_id, notes,
          budget, move_in_date, current_address, preferred_contact_method } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const clientResult = await client.query(
      `INSERT INTO clients (full_name, email, phone, notes) VALUES ($1,$2,$3,$4) RETURNING id`,
      [full_name, email, phone, notes || null]
    );
    const clientId = clientResult.rows[0].id;

    const leadResult = await client.query(
      `INSERT INTO leads (client_id, service, source_page, property_id, budget, move_in_date, current_address, preferred_contact_method)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [clientId, service, source_page || null, property_id || null,
       budget || null, move_in_date || null, current_address || null, preferred_contact_method || null]
    );

    await client.query(
      `INSERT INTO lead_activity (lead_id, activity_type, content) VALUES ($1,'note','Lead created from public inquiry form')`,
      [leadResult.rows[0].id]
    );

    await client.query('COMMIT');
    res.status(201).json(leadResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// PATCH /api/leads/:id/stage
exports.updateStage = async (req, res) => {
  const { stage } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE leads SET stage = $1, updated_at = now() WHERE id = $2 RETURNING *`,
      [stage, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Lead not found' });

    await pool.query(
      `INSERT INTO lead_activity (lead_id, activity_type, content) VALUES ($1,'stage_change',$2)`,
      [req.params.id, `Stage changed to ${stage}`]
    );

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/leads/:id/notes
exports.addNote = async (req, res) => {
  const { content } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO lead_activity (lead_id, activity_type, content) VALUES ($1,'note',$2) RETURNING *`,
      [req.params.id, content]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
