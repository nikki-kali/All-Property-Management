const express = require('express');
const router = express.Router();
const c = require('../controllers/remindersController');

// Intended to be triggered by a daily cron job (Render Cron Job or Supabase Scheduled Function)
router.get('/run', c.runDailyReminders);

module.exports = router;
