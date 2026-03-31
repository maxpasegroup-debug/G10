const attendanceModel = require('../models/attendanceModel')

async function list(req, res) {
  const { studentId, date } = req.query
  const rows = await attendanceModel.listAttendance({
    studentId: studentId ? Number(studentId) : undefined,
    date: date || undefined,
  })
  res.json({ success: true, data: rows })
}

async function create(req, res) {
  const { studentId, date, status } = req.body
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
