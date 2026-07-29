const express = require('express');
const router = express.Router();
const c = require('../controllers/reportsController');

router.get('/summary', c.getSummary);
router.get('/attribution', c.getAttribution);
router.get('/revenue', c.getRevenueByService);
router.get('/monthly', c.getMonthlySnapshot);

module.exports = router;
