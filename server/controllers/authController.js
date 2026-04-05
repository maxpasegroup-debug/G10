const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

const SALT_ROUNDS = 10

async function register(req, res) {
  const { name, email, password, role } = req.body
  if (!email || !password) {
    const err = new Error('Email and password are required')
    err.status = 400
    throw err
  }

  const existing = await userModel.findByEmail(email)
  if (existing) {
    const err = new Error('Email already registered')
    err.status = 409
    throw err
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
  const publicRoles = ['student', 'parent', 'teacher']
  const requested = String(role || 'student').toLowerCase()
  const safeRole = publicRoles.includes(requested) ? requested : 'student'

  const user = await userModel.createUser({
    name: name || null,
    email,
    passwordHash,
    role: safeRole,
  })

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      student_id: user.student_id ?? null,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  )

  res.status(201).json({
    success: true,
    data: { user, token },
  })
}

async function login(req, res) {
  const identifier = String(
    req.body.identifier ?? req.body.email ?? req.body.mobile ?? '',
  ).trim()
  const { password } = req.body
  if (!identifier || !password) {
    const err = new Error('Mobile or email and password are required')
    err.status = 400
    throw err
  }

  const user = await userModel.findByEmailOrMobile(identifier)
  if (!user) {
    const err = new Error('Invalid credentials')
    err.status = 401
    throw err
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    const err = new Error('Invalid credentials')
    err.status = 401
    throw err
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      student_id: user.student_id ?? null,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  )

  const { password: _p, ...safeUser } = user
  res.json({
    success: true,
    data: { user: safeUser, token },
  })
}

async function me(req, res) {
  const user = await userModel.findById(req.user.id)
  if (!user) {
    const err = new Error('User not found')
    err.status = 404
    throw err
  }
  res.json({ success: true, data: { user } })
}

module.exports = { register, login, me }
