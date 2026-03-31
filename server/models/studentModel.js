const pool = require('../config/db')

async function listStudents() {
  const { rows } = await pool.query(
    'SELECT id, name, photo, subject FROM students ORDER BY id',
  )
  return rows
}

async function getStudentById(id) {
  const { rows } = await pool.query(
    'SELECT id, name, photo, subject FROM students WHERE id = $1',
    [id],
  )
  return rows[0] || null
}

async function createStudent({ name, photo, subject }) {
  const { rows } = await pool.query(
    `INSERT INTO students (name, photo, subject)
     VALUES ($1, $2, $3)
     RETURNING id, name, photo, subject`,
    [name, photo, subject],
  )
  return rows[0]
}

module.exports = { listStudents, getStudentById, createStudent }
