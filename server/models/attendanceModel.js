const pool = require('../config/db')

async function listAttendance({ studentId, classId, date } = {}) {
  const params = []
  let query

  if (classId != null && Number.isFinite(Number(classId))) {
    params.push(Number(classId))
    query = `
      SELECT a.id, a.student_id, a.date, a.status
      FROM attendance a
      INNER JOIN students s ON s.id = a.student_id
      WHERE s.class_id = $1`
    if (studentId != null && Number.isFinite(Number(studentId))) {
      params.push(Number(studentId))
      query += ` AND a.student_id = $2`
    }
    if (date) {
      params.push(date)
      query += ` AND a.date = $${params.length}`
    }
  } else {
    query = 'SELECT id, student_id, date, status FROM attendance WHERE 1=1'
    if (studentId != null && Number.isFinite(Number(studentId))) {
      params.push(Number(studentId))
      query += ` AND student_id = $${params.length}`
    }
    if (date) {
      params.push(date)
      query += ` AND date = $${params.length}`
    }
  }

  query += ' ORDER BY date DESC, id DESC'
  const { rows } = await pool.query(query, params)
  return rows
}

async function createAttendance({ studentId, date, status }) {
  await pool.query(
    `DELETE FROM attendance WHERE student_id = $1 AND date = $2`,
    [studentId, date],
  )
  const { rows } = await pool.query(
    `INSERT INTO attendance (student_id, date, status)
     VALUES ($1, $2, $3)
     RETURNING id, student_id, date, status`,
    [studentId, date, status],
  )
  return rows[0]
}

module.exports = { listAttendance, createAttendance }
