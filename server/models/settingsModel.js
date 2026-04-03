const pool = require('../config/db')

const ALLOWED_KEYS = [
  'academy_name',
  'email',
  'phone',
  'address',
  'map_embed_url',
  'home_hero_title',
  'home_hero_subtitle',
  'about_text',
  'contact_intro',
  'admissions_message',
]

async function getPublicSettings() {
  const { rows } = await pool.query(
    `SELECT ${ALLOWED_KEYS.join(', ')} FROM site_settings WHERE id = 1`,
  )
  return rows[0] || null
}

async function updateSettings(patch) {
  const entries = Object.entries(patch).filter(
    ([k, v]) => ALLOWED_KEYS.includes(k) && v !== undefined,
  )
  if (entries.length === 0) {
    return getPublicSettings()
  }
  const sets = []
  const values = []
  entries.forEach(([key, val], idx) => {
    sets.push(`${key} = $${idx + 1}`)
    values.push(val)
  })
  values.push(1)
  const { rows } = await pool.query(
    `UPDATE site_settings SET ${sets.join(', ')} WHERE id = $${values.length}
     RETURNING ${ALLOWED_KEYS.join(', ')}`,
    values,
  )
  return rows[0] || null
}

module.exports = { getPublicSettings, updateSettings }
