const pool = require('../config/db')

async function listAttendance({ studentId, date } = {}) {
  let query = 'SELECT id, student_id, date, status FROM attendance WHERE 1=1'
  const params = []
  if (studentId) {
    params.push(studentId)
    query += ` AND student_id = $${params.length}`
  }
  if (date) {
    params.push(date)
    query += ` AND date = $${params.length}`
  }
  query += ' ORDER BY date DESC, id DESC'
  const { rows } = await pool.query(query, params)
  return rows
}

async function createAttendance({ studentId, date, status }) {
  const { rows } = await pool.query(
    `INSERT INTO attendance (student_id, date, status)
     VALUES ($1, $2, $3)
     RETURNING id, student_id, date, status`,
    [studentId, date, status],
  )
  return rows[0]
}

module.exports = { listAttendance, createAttendance }
