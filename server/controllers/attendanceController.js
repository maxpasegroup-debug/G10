const attendanceModel = require('../models/attendanceModel')
const activityLogModel = require('../models/activityLogModel')
const { resolveListStudentScope } = require('../lib/studentAccessGuard')

async function list(req, res) {
  const qSid = req.query.student_id ?? req.query.studentId
  const studentId = resolveListStudentScope(req, qSid)
  const classId = req.query.class_id ?? req.query.classId
  const { date } = req.query
  const rows = await attendanceModel.listAttendance({
    studentId,
    classId: classId != null && classId !== '' ? Number(classId) : undefined,
    date: date || undefined,
  })
  res.json({ success: true, data: rows })
}

async function create(req, res) {
  const studentId = req.body.studentId ?? req.body.student_id
  const { date, status } = req.body
  if (!studentId || !date || !status) {
    const err = new Error('studentId, date, and status are required')
    err.status = 400
    throw err
  }
  const row = await attendanceModel.createAttendance({
    studentId: Number(studentId),
    date,
    status,
  })
  void activityLogModel.recordAction(req.user?.id, 'Attendance saved', {
    attendance_id: row.id,
    student_id: row.student_id,
    date: row.date,
    status: row.status,
  })
  res.status(201).json({ success: true, data: row })
}

module.exports = { list, create }
