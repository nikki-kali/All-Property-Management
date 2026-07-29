const pool = require('../config/db');

exports.getProperties = async (req, res) => {
  const { status, published } = req.query;
  const conditions = [];
  const values = [];
  if (status) { values.push(status); conditions.push(`status = $${values.length}`); }
  if (published !== undefined) { values.push(published === 'true'); conditions.push(`is_published = $${values.length}`); }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const { rows } = await pool.query(
      `SELECT * FROM properties ${where} ORDER BY created_at DESC`, values
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM properties WHERE id = $1`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Property not found' });
    const { rows: photos } = await pool.query(
      `SELECT * FROM property_photos WHERE property_id = $1 ORDER BY sort_order`, [req.params.id]
    );
    const { rows: renovationJobs } = await pool.query(
      `SELECT * FROM renovation_jobs WHERE property_id = $1 ORDER BY started_at DESC`, [req.params.id]
    );
    const { rows: titlingJobs } = await pool.query(
      `SELECT * FROM titling_jobs WHERE property_id = $1`, [req.params.id]
    );
    res.json({ ...rows[0], photos, renovation_jobs: renovationJobs, titling_jobs: titlingJobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProperty = async (req, res) => {
  const { title, address, property_type, size_sqm, rental_term, rate, description } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO properties (title, address, property_type, size_sqm, rental_term, rate, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, address, property_type, size_sqm, rental_term || null, rate, description]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProperty = async (req, res) => {
  const fields = ['title','address','property_type','size_sqm','status','rental_term','rate','is_published','description'];
  const updates = [];
  const values = [];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) { values.push(req.body[f]); updates.push(`${f} = $${values.length}`); }
  });
  if (!updates.length) return res.status(400).json({ error: 'No fields to update' });
  values.push(req.params.id);

  try {
    const { rows } = await pool.query(
      `UPDATE properties SET ${updates.join(', ')}, updated_at = now() WHERE id = $${values.length} RETURNING *`,
      values
    );
    if (!rows.length) return res.status(404).json({ error: 'Property not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addPhoto = async (req, res) => {
  const { url, is_before_after, before_after, sort_order } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO property_photos (property_id, url, is_before_after, before_after, sort_order)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [req.params.id, url, !!is_before_after, before_after || null, sort_order || 0]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
