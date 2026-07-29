const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(a || '');
  const bufB = Buffer.from(b || '');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// Requires a valid JWT (issued by POST /api/auth/login) in the Authorization header.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

// Same as requireAuth, but also accepts a shared secret via x-cron-secret —
// for the daily reminders job, which is triggered by an external scheduler, not a logged-in user.
function requireAuthOrCron(req, res, next) {
  const cronSecret = req.headers['x-cron-secret'];
  if (process.env.CRON_SECRET && timingSafeEqual(cronSecret, process.env.CRON_SECRET)) {
    return next();
  }
  return requireAuth(req, res, next);
}

module.exports = { requireAuth, requireAuthOrCron, timingSafeEqual };
