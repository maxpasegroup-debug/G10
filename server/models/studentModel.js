const pool = require('../config/db')

async function listStudents({ classId } = {}) {
  let query = 'SELECT id, name, photo, subject, class_id FROM students WHERE 1=1'
  const params = []
  if (classId != null && Number.isFinite(Number(classId))) {
    params.push(Number(classId))
    query += ` AND class_id = $${params.length}`
  }
  query += ' ORDER BY id'
  const { rows } = await pool.query(query, params)
  return rows
}

async function getStudentById(id) {
  const { rows } = await pool.query(
    'SELECT id, name, photo, subject, class_id FROM students WHERE id = $1',
    [id],
  )
  return rows[0] || null
}

async function createStudent({ name, photo, subject, classId = null }) {
  const { rows } = await pool.query(
    `INSERT INTO students (name, photo, subject, class_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, photo, subject, class_id`,
    [name, photo, subject, classId],
  )
  return rows[0]
}

async function updateStudent(id, patch) {
  const cur = await getStudentById(id)
  if (!cur) return null
  const name = patch.name !== undefined ? patch.name : cur.name
  const photo = patch.photo !== undefined ? patch.photo : cur.photo
  const subject = patch.subject !== undefined ? patch.subject : cur.subject
  let classId = cur.class_id
  if (patch.class_id !== undefined) {
    const raw = patch.class_id
    if (raw === null || raw === '') classId = null
    else classId = Number(raw)
  } else if (patch.classId !== undefined) {
    const raw = patch.classId
    if (raw === null || raw === '') classId = null
    else classId = Number(raw)
  }
  const { rows } = await pool.query(
    `UPDATE students SET name = $2, photo = $3, subject = $4, class_id = $5
     WHERE id = $1
     RETURNING id, name, photo, subject, class_id`,
    [id, name, photo, subject, classId],
  )
  return rows[0] || null
}

module.exports = { listStudents, getStudentById, createStudent, updateStudent }
