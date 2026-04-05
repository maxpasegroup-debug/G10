const LINKED_PORTAL_ROLES = new Set(['student', 'parent'])

function linkedStudentId(user) {
  if (!user) return null
  const sid = user.student_id
  if (sid == null) return null
  const n = Number(sid)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : null
}

function isElevatedRole(role) {
  const r = String(role || '').toLowerCase()
  return r === 'admin' || r === 'teacher'
}

/**
 * Student/parent may only access their linked student. Admin/teacher: no-op.
 * @param {import('express').Request} req
 * @param {number} targetStudentId
 */
function assertOwnStudentOrElevated(req, targetStudentId) {
  const role = String(req.user?.role || '').toLowerCase()
  if (isElevatedRole(role)) return
  if (!LINKED_PORTAL_ROLES.has(role)) {
    const e = new Error('Forbidden')
    e.status = 403
    throw e
  }
  const mine = linkedStudentId(req.user)
  if (mine == null || targetStudentId !== mine) {
    const e = new Error('Forbidden')
    e.status = 403
    throw e
  }
}

/**
 * For GET list endpoints with optional query student_id.
 * Returns numeric studentId filter for the query, or undefined when admin/teacher request all rows.
 * Student/parent: always scoped to linked id; mismatching query → 403.
 */
function resolveListStudentScope(req, queryStudentIdRaw) {
  const role = String(req.user?.role || '').toLowerCase()
  if (isElevatedRole(role)) {
    if (queryStudentIdRaw == null || queryStudentIdRaw === '') return undefined
    const n = Number(queryStudentIdRaw)
    return Number.isFinite(n) ? n : undefined
  }
  if (!LINKED_PORTAL_ROLES.has(role)) {
    const e = new Error('Forbidden')
    e.status = 403
    throw e
  }
  const mine = linkedStudentId(req.user)
  if (mine == null) {
    const e = new Error('Forbidden')
    e.status = 403
    throw e
  }
  if (queryStudentIdRaw != null && queryStudentIdRaw !== '') {
    const q = Number(queryStudentIdRaw)
    if (!Number.isFinite(q) || q !== mine) {
      const e = new Error('Forbidden')
      e.status = 403
      throw e
    }
  }
  return mine
}

module.exports = {
  linkedStudentId,
  assertOwnStudentOrElevated,
  resolveListStudentScope,
  LINKED_PORTAL_ROLES,
}
