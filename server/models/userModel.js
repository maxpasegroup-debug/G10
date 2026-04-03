const pool = require('../config/db')

async function findByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email])
  return rows[0] || null
}

async function createUser({ name, email, passwordHash, role }) {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name, email, passwordHash, role],
  )
  return rows[0]
}

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
    [id],
  )
  return rows[0] || null
}

async function listUsers() {
  const { rows } = await pool.query(
    'SELECT id, name, email, role, created_at FROM users ORDER BY id ASC',
  )
  return rows
}

async function deleteUser(id) {
  const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id])
  return rowCount > 0
}

module.exports = { findByEmail, createUser, findById, listUsers, deleteUser }
