const performanceModel = require('../models/performanceModel')

async function list(req, res) {
  const { studentId } = req.query
  const rows = await performanceModel.listPerformance({
    studentId: studentId ? Number(studentId) : undefined,
  })
  res.json({ success: true, data: rows })
}

async function create(req, res) {
  const { studentId, score, remarks } = req.body
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
