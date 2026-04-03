const pool = require('../config/db')

async function createEnquiry({ name, phone, course, age }) {
  const { rows } = await pool.query(
    `INSERT INTO enquiries (name, phone, course, age)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, phone, course, age, created_at`,
    [name, phone, course, age ?? null],
  )
  return rows[0]
}

async function listEnquiries() {
  const { rows } = await pool.query(
    'SELECT id, name, phone, course, age, created_at FROM enquiries ORDER BY created_at DESC, id DESC',
  )
  return rows
}

module.exports = { createEnquiry, listEnquiries }
