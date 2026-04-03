/**
 * CORS: production allows only listed origins.
 * Sources (merged, de-duplicated):
 *   - CORS_ORIGIN — comma-separated origins (skip if set to * alone; * is ignored so FRONTEND_URL can still apply)
 *   - FRONTEND_URL — single origin (common on Railway / Vercel for the SPA URL)
 *   - CLIENT_URL — optional second frontend
 *
 * Dev: CORS_ORIGIN unset or * → permissive; comma-separated list → restrict.
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

/** Normalize to scheme + host (no path, no trailing slash) to match browser `Origin`. */
function normalizeOrigin(raw) {
  if (raw == null) return null
  let s = String(raw).trim()
  if (!s) return null
  s = s.replace(/\/+$/, '')
  if (!/^https?:\/\//i.test(s)) {
    s = `https://${s}`
  }
  try {
    const u = new URL(s)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
    return `${u.protocol}//${u.host}`
  } catch {
    return null
  }
}

function collectProductionOrigins() {
  const list = []
  const seen = new Set()

  const corsRaw = process.env.CORS_ORIGIN
  if (corsRaw != null && String(corsRaw).trim() !== '' && String(corsRaw).trim() !== '*') {
    const parts = parseAllowedOrigins(corsRaw)
    if (parts) {
      for (const o of parts) {
        const n = normalizeOrigin(o)
        if (n && !seen.has(n)) {
          seen.add(n)
          list.push(n)
        }
      }
    }
  }

  for (const key of ['FRONTEND_URL', 'CLIENT_URL']) {
    const n = normalizeOrigin(process.env[key])
    if (n && !seen.has(n)) {
      seen.add(n)
      list.push(n)
    }
  }

  return list.length ? list : null
}

function validateProductionCors() {
  const isProd = process.env.NODE_ENV === 'production'
  if (!isProd) return

  const corsOnlyStar =
    process.env.CORS_ORIGIN != null &&
    String(process.env.CORS_ORIGIN).trim() === '*' &&
    !process.env.FRONTEND_URL &&
    !process.env.CLIENT_URL

  const list = collectProductionOrigins()
  if (!list || list.length === 0) {
    if (corsOnlyStar) {
      console.error(
        '[security] CORS_ORIGIN=* is not allowed in production when no other origin is set.\n' +
          'Fix: set FRONTEND_URL=https://your-frontend-host (Railway/Vercel) or CORS_ORIGIN=https://your-frontend-host',
      )
    } else {
      console.error(
        '[security] Production needs at least one allowed browser origin. Set either:\n' +
          '  FRONTEND_URL=https://your-spa.example.com   (recommended for split deploys)\n' +
          '  CORS_ORIGIN=https://a.com,https://b.com     (comma-separated)\n' +
          'Optional: CLIENT_URL=… for a second frontend.',
      )
    }
    process.exit(1)
  }
}

function buildCorsOptions() {
  const isProd = process.env.NODE_ENV === 'production'

  if (isProd) {
    const list = collectProductionOrigins()
    if (!list || list.length === 0) {
      return { origin: false, credentials: true }
    }
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

  const list = parseAllowedOrigins(process.env.CORS_ORIGIN)
  if (list && list.length) {
    const normalized = list.map(normalizeOrigin).filter(Boolean)
    if (normalized.length) {
      return { origin: normalized, credentials: true }
    }
  }

  return { origin: true, credentials: true }
}

module.exports = { buildCorsOptions, validateProductionCors }
