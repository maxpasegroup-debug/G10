const studentModel = require('../models/studentModel')

async function list(req, res) {
  const students = await studentModel.listStudents()
  res.json({ success: true, data: students })
}

async function getById(req, res) {
  const student = await studentModel.getStudentById(Number(req.params.id))
  if (!student) {
    const err = new Error('Student not found')
    err.status = 404
    throw err
  }
  res.json({ success: true, data: student })
}

async function create(req, res) {
  const { name, photo, subject } = req.body
  if (!name) {
    const err = new Error('Name is required')
    err.status = 400
    throw err
  }
  const student = await studentModel.createStudent({
    name,
    photo: photo || null,
    subject: subject || null,
  })
  res.status(201).json({ success: true, data: student })
}

module.exports = { list, getById, create }
