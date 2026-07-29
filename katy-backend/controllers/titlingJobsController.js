const pool = require('../config/db');

// POST /api/properties/:id/titling-jobs
exports.createForProperty = async (req, res) => {
  const { lead_id, service_type, govt_fees, timeline_days, checklist } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO titling_jobs (property_id, lead_id, service_type, govt_fees, timeline_days, checklist)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [
        req.params.id,
        lead_id || null,
        service_type || null,
        govt_fees || null,
        timeline_days || null,
        JSON.stringify(Array.isArray(checklist) ? checklist : []),
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/properties/titling-jobs/:id
exports.update = async (req, res) => {
  const fields = ['service_type', 'govt_fees', 'timeline_days', 'milestone'];
  const updates = [];
  const values = [];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) { values.push(req.body[f]); updates.push(`${f} = $${values.length}`); }
  });
  if (!updates.length) return res.status(400).json({ error: 'No fields to update' });
  values.push(req.params.id);

  try {
    const { rows } = await pool.query(
      `UPDATE titling_jobs SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`,
      values
    );
    if (!rows.length) return res.status(404).json({ error: 'Titling job not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/properties/titling-jobs/:id/checklist — replaces the full checklist array
exports.updateChecklist = async (req, res) => {
  const { checklist } = req.body;
  if (!Array.isArray(checklist)) return res.status(400).json({ error: 'checklist must be an array' });

  try {
    const { rows } = await pool.query(
      `UPDATE titling_jobs SET checklist = $1 WHERE id = $2 RETURNING *`,
      [JSON.stringify(checklist), req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Titling job not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
