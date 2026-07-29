const express = require('express');
const router = express.Router();
const c = require('../controllers/proposalsController');

router.post('/send', c.sendProposal);
router.post('/agent-welcome', c.sendAgentWelcome);

module.exports = router;
