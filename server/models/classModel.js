const pool = require('../config/db')

async function listClasses() {
  const { rows } = await pool.query(
    'SELECT id, name, subject, studio, is_live FROM classes ORDER BY id',
  )
  return rows
}

async function getClassById(id) {
  const { rows } = await pool.query(
    'SELECT id, name, subject, studio, is_live FROM classes WHERE id = $1',
    [id],
  )
  return rows[0] || null
}

async function createClass({ name, subject, studio, isLive = false }) {
  const { rows } = await pool.query(
    `INSERT INTO classes (name, subject, studio, is_live)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, subject, studio, is_live`,
    [name, subject, studio, isLive],
  )
  return rows[0]
}

module.exports = { listClasses, getClassById, createClass }
