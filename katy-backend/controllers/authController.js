const jwt = require('jsonwebtoken');
const { timingSafeEqual } = require('../middleware/auth');

// POST /api/auth/login — single admin user for Phase 1 (Katy only), credentials from env.
exports.login = (req, res) => {
  const { email, password } = req.body;

  const validEmail = email === process.env.ADMIN_EMAIL;
  const validPassword = timingSafeEqual(password, process.env.ADMIN_PASSWORD);

  if (!validEmail || !validPassword) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, email });
};

// GET /api/auth/me — used by the frontend to validate a stored token on load.
exports.me = (req, res) => {
  res.json({ email: req.user.email });
};
