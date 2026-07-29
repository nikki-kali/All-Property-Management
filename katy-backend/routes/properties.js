const express = require('express');
const router = express.Router();
const c = require('../controllers/propertiesController');
const renovationJobs = require('../controllers/renovationJobsController');
const titlingJobs = require('../controllers/titlingJobsController');

router.get('/', c.getProperties);
router.get('/:id', c.getPropertyById);
router.post('/', c.createProperty);
router.patch('/:id', c.updateProperty);
router.post('/:id/photos', c.addPhoto);

router.post('/:id/renovation-jobs', renovationJobs.createForProperty);
router.patch('/renovation-jobs/:id', renovationJobs.update);

router.post('/:id/titling-jobs', titlingJobs.createForProperty);
router.patch('/titling-jobs/:id', titlingJobs.update);
router.patch('/titling-jobs/:id/checklist', titlingJobs.updateChecklist);

module.exports = router;
