const pool = require('../config/db')

async function createEnquiry({ name, phone, course, message, age }) {
  const { rows } = await pool.query(
    `INSERT INTO enquiries (name, phone, course, message, age)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, phone, course, message, age, created_at`,
    [name, phone, course, message ?? null, age ?? null],
  )
  return rows[0]
}

async function listEnquiries() {
  const { rows } = await pool.query(
    'SELECT id, name, phone, course, message, age, created_at FROM enquiries ORDER BY created_at DESC, id DESC',
  )
  return rows
}

module.exports = { createEnquiry, listEnquiries }
