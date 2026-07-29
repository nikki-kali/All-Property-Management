// index.js — Katy Property Solutions API
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const leadsRoutes = require('./routes/leads');
const propertiesRoutes = require('./routes/properties');
const tenantsRoutes = require('./routes/tenants');
const agentsRoutes = require('./routes/agents');
const reportsRoutes = require('./routes/reports');
const proposalsRoutes = require('./routes/proposals');
const remindersRoutes = require('./routes/reminders');
const publicRoutes = require('./routes/public');
const businessProfileRoutes = require('./routes/businessProfile');
const { requireAuth, requireAuthOrCron } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

// Admin CRM API (Phase 1: Katy-only, gated by requireAuth)
app.use('/api/leads', requireAuth, leadsRoutes);
app.use('/api/properties', requireAuth, propertiesRoutes);
app.use('/api/tenants', requireAuth, tenantsRoutes);
app.use('/api/agents', requireAuth, agentsRoutes);
app.use('/api/reports', requireAuth, reportsRoutes);
app.use('/api/proposals', requireAuth, proposalsRoutes);
app.use('/api/reminders', requireAuthOrCron, remindersRoutes);

// business-profile is unauthenticated at the GET level (read by the public site's
// social-proof sections) — the write path is gated inside routes/businessProfile.js instead.
app.use('/api/business-profile', businessProfileRoutes);

// Public website API (lead capture, published listings)
app.use('/api/public', publicRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Katy API running on port ${PORT}`));

module.exports = app;
