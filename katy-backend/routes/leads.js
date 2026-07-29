const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leadsController');

router.get('/', leadsController.getLeads);
router.get('/:id', leadsController.getLeadById);
router.post('/', leadsController.createLead);
router.patch('/:id/stage', leadsController.updateStage);
router.post('/:id/notes', leadsController.addNote);

module.exports = router;
