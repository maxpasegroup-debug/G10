const classModel = require('../models/classModel')

async function list(req, res) {
  const classes = await classModel.listClasses()
  res.json({ success: true, data: classes })
}

async function getById(req, res) {
  const row = await classModel.getClassById(Number(req.params.id))
  if (!row) {
    const err = new Error('Class not found')
    err.status = 404
    throw err
  }
  res.json({ success: true, data: row })
}

async function create(req, res) {
  const { name, subject, studio, isLive } = req.body
  if (!name) {
    const err = new Error('Name is required')
    err.status = 400
    throw err
  }
  const row = await classModel.createClass({
    name,
    subject: subject || null,
    studio: studio || null,
    isLive: Boolean(isLive),
  })
  res.status(201).json({ success: true, data: row })
}

module.exports = { list, getById, create }
