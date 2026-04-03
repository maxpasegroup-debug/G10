const attendanceModel = require('../models/attendanceModel')

async function list(req, res) {
  const studentId = req.query.student_id ?? req.query.studentId
  const classId = req.query.class_id ?? req.query.classId
  const { date } = req.query
  const rows = await attendanceModel.listAttendance({
    studentId: studentId != null && studentId !== '' ? Number(studentId) : undefined,
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
  res.status(201).json({ success: true, data: row })
}

module.exports = { list, create }
