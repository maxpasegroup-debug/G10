const performanceModel = require('../models/performanceModel')

async function list(req, res) {
  const studentId = req.query.student_id ?? req.query.studentId
  const classId = req.query.class_id ?? req.query.classId
  const rows = await performanceModel.listPerformance({
    studentId: studentId != null && studentId !== '' ? Number(studentId) : undefined,
    classId: classId != null && classId !== '' ? Number(classId) : undefined,
  })
  res.json({ success: true, data: rows })
}

async function create(req, res) {
  const studentId = req.body.studentId ?? req.body.student_id
  const { score, remarks } = req.body
  if (!studentId || !score) {
    const err = new Error('studentId and score are required')
    err.status = 400
    throw err
  }
  const row = await performanceModel.createPerformance({
    studentId: Number(studentId),
    score: String(score),
    remarks: remarks || null,
  })
  res.status(201).json({ success: true, data: row })
}

module.exports = { list, create }
