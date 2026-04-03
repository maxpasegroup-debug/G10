const pool = require('../config/db')

async function listPerformance({ studentId, classId } = {}) {
  const params = []
  let query

  if (classId != null && Number.isFinite(Number(classId))) {
    params.push(Number(classId))
    query = `
      SELECT p.id, p.student_id, p.score, p.remarks, p.created_at
      FROM performance p
      INNER JOIN students s ON s.id = p.student_id
      WHERE s.class_id = $1`
    if (studentId != null && Number.isFinite(Number(studentId))) {
      params.push(Number(studentId))
      query += ` AND p.student_id = $2`
    }
  } else {
    query = 'SELECT id, student_id, score, remarks, created_at FROM performance WHERE 1=1'
    if (studentId != null && Number.isFinite(Number(studentId))) {
      params.push(Number(studentId))
      query += ` AND student_id = $${params.length}`
    }
  }

  query += ' ORDER BY created_at ASC'
  const { rows } = await pool.query(query, params)
  return rows
}

async function createPerformance({ studentId, score, remarks }) {
  const { rows } = await pool.query(
    `INSERT INTO performance (student_id, score, remarks)
     VALUES ($1, $2, $3)
     RETURNING id, student_id, score, remarks, created_at`,
    [studentId, score, remarks],
  )
  return rows[0]
}

module.exports = { listPerformance, createPerformance }
