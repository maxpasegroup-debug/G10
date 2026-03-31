const pool = require('../config/db')

async function listPerformance({ studentId } = {}) {
  let query = 'SELECT id, student_id, score, remarks, created_at FROM performance WHERE 1=1'
  const params = []
  if (studentId) {
    params.push(studentId)
    query += ` AND student_id = $${params.length}`
  }
  query += ' ORDER BY created_at DESC'
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
