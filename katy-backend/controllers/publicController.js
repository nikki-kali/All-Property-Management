const pool = require('../config/db');

// GET /api/public/properties?type=rentals|buy_sell&status=available
// Only ever returns published listings.
exports.getPublishedProperties = async (req, res) => {
  const { rental_term, status } = req.query;
  const conditions = ['is_published = true'];
  const values = [];
  // 'flexible' properties can go either way, so they satisfy both the
  // long_term and short_term tabs on the public Rentals page rather than
  // needing a rental_term value that picks one over the other.
  if (rental_term) { values.push(rental_term); conditions.push(`rental_term IN ($${values.length}, 'flexible')`); }
  if (status) { values.push(status); conditions.push(`status = $${values.length}`); }

  try {
    const { rows } = await pool.query(
      `SELECT id, title, address, property_type, size_sqm, status, rental_term, rate, description,
         (SELECT url FROM property_photos WHERE property_id = properties.id ORDER BY sort_order LIMIT 1) AS photo_url
       FROM properties
       WHERE ${conditions.join(' AND ')}
       ORDER BY created_at DESC`,
      values
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/public/renovations — published before/after portfolio
exports.getRenovationPortfolio = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT pp.id AS photo_id, rj.id AS job_id, rj.scope, p.title, pp.url, pp.before_after
      FROM renovation_jobs rj
      JOIN properties p ON p.id = rj.property_id
      JOIN property_photos pp ON pp.property_id = p.id AND pp.is_before_after = true
      WHERE rj.status = 'complete'
      ORDER BY rj.completed_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/public/inquiry — the shared lead form used on all 5 landing pages + homepage
// This is the single entry point that feeds the CRM lead inbox (Section 5.1)
exports.submitInquiry = async (req, res) => {
  const { full_name, email, phone, service, message, source_page, property_id,
          budget, move_in_date, current_address, preferred_contact_method } = req.body;

  if (!full_name || !email || !service) {
    return res.status(400).json({ error: 'full_name, email, and service are required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const clientResult = await client.query(
      `INSERT INTO clients (full_name, email, phone, notes) VALUES ($1,$2,$3,$4) RETURNING id`,
      [full_name, email, phone || null, message || null]
    );

    const leadResult = await client.query(
      `INSERT INTO leads (client_id, service, source_page, property_id, budget, move_in_date, current_address, preferred_contact_method)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [clientResult.rows[0].id, service, source_page || null, property_id || null,
       budget || null, move_in_date || null, current_address || null, preferred_contact_method || null]
    );

    await client.query(
      `INSERT INTO lead_activity (lead_id, activity_type, content)
       VALUES ($1,'note',$2)`,
      [leadResult.rows[0].id, message ? `Inquiry message: ${message}` : 'Inquiry submitted from website']
    );

    await client.query('COMMIT');
    res.status(201).json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// POST /api/public/agent-application — the /agents page application form
exports.submitAgentApplication = async (req, res) => {
  const { full_name, email, phone, coverage_area } = req.body;
  if (!full_name || !email) {
    return res.status(400).json({ error: 'full_name and email are required' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO agents (full_name, email, phone, coverage_area, status)
       VALUES ($1,$2,$3,$4,'applied') RETURNING *`,
      [full_name, email, phone || null, coverage_area || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
