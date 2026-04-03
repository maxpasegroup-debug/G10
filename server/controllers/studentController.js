const studentModel = require('../models/studentModel')

async function list(req, res) {
  const classId = req.query.class_id ?? req.query.classId
  const students = await studentModel.listStudents({
    classId: classId != null && classId !== '' ? Number(classId) : undefined,
  })
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
  const { name, photo, subject, class_id: classIdBody, classId } = req.body
  if (!name) {
    const err = new Error('Name is required')
    err.status = 400
    throw err
  }
  const rawClass = classIdBody ?? classId
  const classIdNum =
    rawClass != null && rawClass !== ''
      ? Number(rawClass)
      : null
  const student = await studentModel.createStudent({
    name,
    photo: photo || null,
    subject: subject || null,
    classId: Number.isFinite(classIdNum) ? classIdNum : null,
  })
  res.status(201).json({ success: true, data: student })
}

async function update(req, res) {
  const id = Number(req.params.id)
  const { name, photo, subject, class_id, classId } = req.body
  const student = await studentModel.updateStudent(id, {
    name,
    photo,
    subject,
    class_id: class_id ?? classId,
  })
  if (!student) {
    const err = new Error('Student not found')
    err.status = 404
    throw err
  }
  res.json({ success: true, data: student })
}

module.exports = { list, getById, create, update }
