const pool = require('../config/db');

// POST /api/properties/:id/renovation-jobs
exports.createForProperty = async (req, res) => {
  const { lead_id, scope, project_fee, materials_estimate, started_at } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO renovation_jobs (property_id, lead_id, scope, project_fee, materials_estimate, started_at)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [req.params.id, lead_id || null, scope || null, project_fee || null, materials_estimate || null, started_at || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/properties/renovation-jobs/:id
exports.update = async (req, res) => {
  const fields = ['scope', 'project_fee', 'materials_estimate', 'status', 'started_at', 'completed_at'];
  const updates = [];
  const values = [];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) { values.push(req.body[f]); updates.push(`${f} = $${values.length}`); }
  });
  if (!updates.length) return res.status(400).json({ error: 'No fields to update' });
  values.push(req.params.id);

  try {
    const { rows } = await pool.query(
      `UPDATE renovation_jobs SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`,
      values
    );
    if (!rows.length) return res.status(404).json({ error: 'Renovation job not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
