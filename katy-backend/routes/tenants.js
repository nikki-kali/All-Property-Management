const express = require('express');
const router = express.Router();
const c = require('../controllers/tenantsController');

router.get('/', c.getTenants);
router.get('/late', c.getLatePayments);
router.get('/renewals', c.getUpcomingRenewals);
router.get('/:id', c.getTenantById);
router.post('/', c.createTenant);
router.post('/:id/payments', c.logPayment);

module.exports = router;
