/**
 * CORS: in production, only listed origins (CORS_ORIGIN) are allowed.
 * Dev: CORS_ORIGIN unset or * → permissive; comma-separated list → restrict to those origins.
 */

function parseAllowedOrigins(raw) {
  if (raw == null || String(raw).trim() === '') return null
  const t = String(raw).trim()
  if (t === '*') return null
  return t
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function validateProductionCors() {
  const isProd = process.env.NODE_ENV === 'production'
  if (!isProd) return
  const list = parseAllowedOrigins(process.env.CORS_ORIGIN)
  if (!list || list.length === 0) {
    console.error(
      '[security] NODE_ENV=production requires CORS_ORIGIN to one or more explicit origins (comma-separated). Wildcard * is not allowed.',
    )
    process.exit(1)
  }
}

function buildCorsOptions() {
  const isProd = process.env.NODE_ENV === 'production'
  const list = parseAllowedOrigins(process.env.CORS_ORIGIN)

  if (isProd && list && list.length) {
    return {
      origin(origin, callback) {
        if (!origin) {
          return callback(null, true)
        }
        if (list.includes(origin)) {
          return callback(null, true)
        }
        return callback(null, false)
      },
      credentials: true,
    }
  }

  if (list && list.length) {
    return { origin: list, credentials: true }
  }

  return { origin: true, credentials: true }
}

module.exports = { buildCorsOptions, validateProductionCors }
