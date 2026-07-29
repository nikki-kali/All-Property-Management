const express = require('express');
const router = express.Router();
const c = require('../controllers/agentsController');

router.get('/', c.getAgents);
router.post('/', c.createAgent);
router.patch('/:id/status', c.updateStatus);
router.get('/:id/referrals', c.getReferrals);
router.get('/:id/commissions', c.getCommissions);
router.post('/:id/commissions', c.addCommission);
router.patch('/commissions/:id/release', c.releaseCommission);

module.exports = router;
