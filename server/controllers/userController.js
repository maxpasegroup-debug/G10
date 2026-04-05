const bcrypt = require('bcrypt')
const studentModel = require('../models/studentModel')
const userModel = require('../models/userModel')

const SALT_ROUNDS = 10
const ALLOWED_ROLES = ['student', 'parent', 'teacher', 'admin']

async function list(req, res) {
  const users = await userModel.listUsers()
  res.json({ success: true, data: users })
}

async function create(req, res) {
  const { name, email, password, role, student_id: studentIdRaw } = req.body
  if (!email || !password) {
    const err = new Error('Email and password are required')
    err.status = 400
    throw err
  }
  const r = String(role || 'student').toLowerCase()
  if (!ALLOWED_ROLES.includes(r)) {
    const err = new Error(`role must be one of: ${ALLOWED_ROLES.join(', ')}`)
    err.status = 400
    throw err
  }

  const existing = await userModel.findByEmail(email.trim())
  if (existing) {
    const err = new Error('Email already registered')
    err.status = 409
    throw err
  }

  let studentId = null
  if (['student', 'parent'].includes(r) && studentIdRaw != null && studentIdRaw !== '') {
    const sid = Number(studentIdRaw)
    if (!Number.isFinite(sid) || sid <= 0) {
      const err = new Error('student_id must be a positive integer')
      err.status = 400
      throw err
    }
    const student = await studentModel.getStudentById(sid)
    if (!student) {
      const err = new Error('Student not found for student_id')
      err.status = 400
      throw err
    }
    studentId = sid
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
  const user = await userModel.createUser({
    name: name?.trim() || null,
    email: email.trim(),
    passwordHash,
    role: r,
    studentId,
  })

  res.status(201).json({ success: true, data: { user } })
}

async function remove(req, res) {
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) {
    const err = new Error('Invalid user id')
    err.status = 400
    throw err
  }
  if (Number(id) === Number(req.user.id)) {
    const err = new Error('You cannot delete your own account')
    err.status = 400
    throw err
  }
  const deleted = await userModel.deleteUser(id)
  if (!deleted) {
    const err = new Error('User not found')
    err.status = 404
    throw err
  }
  res.json({ success: true, data: { id } })
}

module.exports = { list, create, remove }
