const pool = require('../config/db')

/**
 * Append short key=value context for debugging (values truncated).
 * @param {string} label - e.g. "Student added"
 * @param {Record<string, string | number | null | undefined>} [details]
 */
function formatAction(label, details = {}) {
  const parts = Object.entries(details)
    .filter(([, v]) => v != null && String(v).trim() !== '')
    .map(([k, v]) => `${k}=${String(v).trim().slice(0, 240)}`)
  return parts.length ? `${label} | ${parts.join(', ')}` : label
}

/**
 * Best-effort audit log; swallows errors so API responses are unaffected.
 * @param {number | null | undefined} userId
 * @param {string} label
 * @param {Record<string, string | number | null | undefined>} [details]
 */
async function recordAction(userId, label, details) {
  const action = details && Object.keys(details).length ? formatAction(label, details) : label
  try {
    await pool.query(`INSERT INTO activity_logs (action, user_id) VALUES ($1, $2)`, [
      action,
      userId != null && Number.isFinite(Number(userId)) ? Number(userId) : null,
    ])
  } catch (e) {
    console.error('[activity_logs] insert failed:', e.message)
  }
}

module.exports = { recordAction, formatAction }
