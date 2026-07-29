const express = require('express');
const router = express.Router();
const c = require('../controllers/publicController');

router.get('/properties', c.getPublishedProperties);
router.get('/renovations', c.getRenovationPortfolio);
router.post('/inquiry', c.submitInquiry);
router.post('/agent-application', c.submitAgentApplication);

module.exports = router;
