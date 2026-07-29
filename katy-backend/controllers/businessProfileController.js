const pool = require('../config/db');

// GET /api/business-profile
exports.getProfile = async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM business_profile WHERE id = 1`);
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/business-profile — for filling in the still-pending fields over time
exports.updateProfile = async (req, res) => {
  const allowedFields = [
    'primary_contact_name','contact_email','business_type','years_in_business',
    'rental_services','buy_sell_services','renovation_services','titling_services',
    'agent_sourcing_services','lead_sources','lead_intake_methods','required_lead_fields',
    'preferred_contact_method','active_listings_approx','properties_managed_approx',
    'works_with_agents','agent_count_reported'
  ];
  const updates = [];
  const values = [];
  allowedFields.forEach((f) => {
    if (req.body[f] !== undefined) { values.push(req.body[f]); updates.push(`${f} = $${values.length}`); }
  });
  if (!updates.length) return res.status(400).json({ error: 'No fields to update' });

  try {
    const { rows } = await pool.query(
      `UPDATE business_profile SET ${updates.join(', ')}, updated_at = now() WHERE id = 1 RETURNING *`,
      values
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
