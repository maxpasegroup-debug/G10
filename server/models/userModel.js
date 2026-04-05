const pool = require('../config/db')

async function findByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email])
  return rows[0] || null
}

/** Login by mobile: exact email match first, then match when stored email is a phone (digits only). */
async function findByLoginMobile(raw) {
  const trimmed = String(raw || '').trim()
  if (!trimmed) return null
  const { rows: exact } = await pool.query(
    'SELECT * FROM users WHERE lower(trim(email)) = lower(trim($1))',
    [trimmed],
  )
  if (exact[0]) return exact[0]
  const digitsOnly = trimmed.replace(/\D/g, '')
  if (digitsOnly.length < 10) return null
  const { rows } = await pool.query(
    `SELECT * FROM users
     WHERE regexp_replace(coalesce(email, ''), '[^0-9]', '', 'g') = $1`,
    [digitsOnly],
  )
  return rows[0] || null
}

/**
 * Login identifier: email (contains @) → case-insensitive email match; otherwise mobile-style lookup.
 */
async function findByEmailOrMobile(raw) {
  const trimmed = String(raw || '').trim()
  if (!trimmed) return null
  if (trimmed.includes('@')) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE lower(trim(email)) = lower(trim($1))',
      [trimmed],
    )
    return rows[0] || null
  }
  return findByLoginMobile(trimmed)
}

/** Create or update admin user (Railway seed). */
async function upsertAdminUser({ email, passwordHash, name }) {
  const normalized = String(email || '').trim().toLowerCase()
  if (!normalized) {
    throw new Error('Admin email is required')
  }
  const { rows: found } = await pool.query(
    'SELECT id FROM users WHERE lower(trim(email)) = $1',
    [normalized],
  )
  if (found[0]) {
    await pool.query(
      `UPDATE users
       SET password = $2, role = 'admin', name = coalesce(nullif(trim($3), ''), name)
       WHERE id = $1`,
      [found[0].id, passwordHash, name || null],
    )
    return
  }
  await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, 'admin')`,
    [name || 'Administrator', normalized, passwordHash],
  )
}

async function createUser({ name, email, passwordHash, role, studentId = null }) {
  const sid =
    studentId != null && Number.isFinite(Number(studentId)) ? Math.floor(Number(studentId)) : null
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password, role, student_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, role, student_id, created_at`,
    [name, email, passwordHash, role, sid],
  )
  return rows[0]
}

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT id, name, email, role, student_id, created_at FROM users WHERE id = $1',
    [id],
  )
  return rows[0] || null
}

async function listUsers() {
  const { rows } = await pool.query(
    'SELECT id, name, email, role, student_id, created_at FROM users ORDER BY id ASC',
  )
  return rows
}

/** Public faculty list: teachers only, no secrets. Columns exist after migration 009. */
async function listPublicTeachers() {
  const { rows } = await pool.query(
    `SELECT id, name, title, bio, photo_url
     FROM users
     WHERE role = 'teacher' AND name IS NOT NULL AND trim(name) <> ''
     ORDER BY id ASC`,
  )
  return rows
}

async function deleteUser(id) {
  const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id])
  return rowCount > 0
}

module.exports = {
  findByEmail,
  findByLoginMobile,
  findByEmailOrMobile,
  upsertAdminUser,
  createUser,
  findById,
  listUsers,
  deleteUser,
  listPublicTeachers,
}
