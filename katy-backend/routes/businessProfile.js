const express = require('express');
const router = express.Router();
const c = require('../controllers/businessProfileController');
const { requireAuth } = require('../middleware/auth');

// GET is public — the public marketing site reads company stats (years in business,
// properties managed, etc.) from this for its social-proof sections.
router.get('/', c.getProfile);
router.patch('/', requireAuth, c.updateProfile);

module.exports = router;
