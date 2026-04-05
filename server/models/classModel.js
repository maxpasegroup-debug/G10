const pool = require('../config/db')

function normalizeMeetingLink(raw) {
  if (raw == null || raw === '') return null
  const t = String(raw).trim()
  return t === '' ? null : t
}

async function listClasses() {
  const { rows } = await pool.query(
    'SELECT id, name, subject, studio, is_live, meeting_link FROM classes ORDER BY id',
  )
  return rows
}

async function getClassById(id) {
  const { rows } = await pool.query(
    'SELECT id, name, subject, studio, is_live, meeting_link FROM classes WHERE id = $1',
    [id],
  )
  return rows[0] || null
}

async function createClass({ name, subject, studio, isLive = false, meetingLink = null }) {
  const link = normalizeMeetingLink(meetingLink)
  const { rows } = await pool.query(
    `INSERT INTO classes (name, subject, studio, is_live, meeting_link)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, subject, studio, is_live, meeting_link`,
    [name, subject, studio, isLive, link],
  )
  return rows[0]
}

async function updateClass(id, patch) {
  const existing = await getClassById(id)
  if (!existing) return null

  const name =
    patch.name !== undefined ? String(patch.name).trim() : existing.name
  const subject =
    patch.subject !== undefined
      ? patch.subject == null || String(patch.subject).trim() === ''
        ? null
        : String(patch.subject).trim()
      : existing.subject
  const studio =
    patch.studio !== undefined
      ? patch.studio == null || String(patch.studio).trim() === ''
        ? null
        : String(patch.studio).trim()
      : existing.studio
  const is_live =
    patch.isLive !== undefined ? Boolean(patch.isLive) : existing.is_live
  const meeting_link =
    patch.meetingLink !== undefined
      ? normalizeMeetingLink(patch.meetingLink)
      : existing.meeting_link

  const { rows } = await pool.query(
    `UPDATE classes
     SET name = $1, subject = $2, studio = $3, is_live = $4, meeting_link = $5
     WHERE id = $6
     RETURNING id, name, subject, studio, is_live, meeting_link`,
    [name, subject, studio, is_live, meeting_link, id],
  )
  return rows[0]
}

async function deleteClass(id) {
  const { rowCount } = await pool.query('DELETE FROM classes WHERE id = $1', [id])
  return rowCount > 0
}

module.exports = { listClasses, getClassById, createClass, updateClass, deleteClass }
