const pool = require('../config/db');
const { renderTemplate } = require('../services/templateRenderer');
const { sendEmail } = require('../services/brevoService');

const SUBJECT_MAP = {
  rentals: 'Your Rental Proposal — Katy Property Solutions',
  buy_sell: 'Your Property Proposal — Katy Property Solutions',
  renovations: 'Your Renovation Proposal — Katy Property Solutions',
  titling: 'Your Titling Service Proposal — Katy Property Solutions',
  agents: 'Welcome — Katy Property Solutions Agent Network',
};

// POST /api/proposals/send
// body: { lead_id, variables: { ...template-specific fields } }
exports.sendProposal = async (req, res) => {
  const { lead_id, variables = {} } = req.body;

  try {
    const { rows } = await pool.query(
      `SELECT l.*, c.full_name AS client_name, c.email AS client_email
       FROM leads l JOIN clients c ON c.id = l.client_id
       WHERE l.id = $1`,
      [lead_id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Lead not found' });
    const lead = rows[0];

    if (!lead.client_email) {
      return res.status(400).json({ error: 'Lead has no client email on file' });
    }

    const html = renderTemplate(lead.service, {
      client_name: lead.client_name,
      proposal_date: new Date().toLocaleDateString('en-PH'),
      ...variables,
    });

    await sendEmail({
      to: lead.client_email,
      toName: lead.client_name,
      subject: SUBJECT_MAP[lead.service],
      htmlContent: html,
    });

    await pool.query(
      `UPDATE leads SET stage = 'proposal_sent', proposal_sent_at = now(), proposal_template = $1, updated_at = now()
       WHERE id = $2`,
      [lead.service, lead_id]
    );

    await pool.query(
      `INSERT INTO lead_activity (lead_id, activity_type, content) VALUES ($1,'proposal_sent',$2)`,
      [lead_id, `Proposal sent to ${lead.client_email}`]
    );

    res.json({ success: true, sentTo: lead.client_email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/proposals/agent-welcome — agent onboarding proposal (Section 8)
exports.sendAgentWelcome = async (req, res) => {
  const { agent_id, variables = {} } = req.body;

  try {
    const { rows } = await pool.query(`SELECT * FROM agents WHERE id = $1`, [agent_id]);
    if (!rows.length) return res.status(404).json({ error: 'Agent not found' });
    const agent = rows[0];

    const html = renderTemplate('agents', {
      applicant_name: agent.full_name,
      coverage_area: agent.coverage_area,
      proposal_date: new Date().toLocaleDateString('en-PH'),
      ...variables,
    });

    await sendEmail({
      to: agent.email,
      toName: agent.full_name,
      subject: SUBJECT_MAP.agents,
      htmlContent: html,
    });

    res.json({ success: true, sentTo: agent.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
