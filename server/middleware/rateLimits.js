const rateLimit = require('express-rate-limit')

/** Applied to most API routes (skips lightweight health checks). */
function apiLimiter() {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX_PER_WINDOW) || 300,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) =>
      req.path === '/' ||
      req.path === '/api/health' ||
      (typeof req.path === 'string' &&
        (req.path.startsWith('/api/auth') || req.path.startsWith('/uploads/'))),
    handler: (_req, res) => {
      res.status(429).json({ success: false, error: 'Too many requests, please try again later.' })
    },
  })
}

/** Stricter limit for authentication endpoints. */
function authLimiter() {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.AUTH_RATE_LIMIT_MAX_PER_WINDOW) || 30,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({ success: false, error: 'Too many attempts, try again later.' })
    },
  })
}

module.exports = { apiLimiter, authLimiter }
