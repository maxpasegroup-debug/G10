const classModel = require('../models/classModel')
const activityLogModel = require('../models/activityLogModel')

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
  const { name, subject, studio, isLive, meetingLink } = req.body
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
    meetingLink,
  })
  void activityLogModel.recordAction(req.user?.id, 'Class created', {
    class_id: row.id,
    name: row.name,
    subject: row.subject ?? '',
  })
  res.status(201).json({ success: true, data: row })
}

async function update(req, res) {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id < 1) {
    const err = new Error('Invalid class id')
    err.status = 400
    throw err
  }
  const { name, subject, studio, isLive, meetingLink } = req.body
  if (name !== undefined && String(name).trim() === '') {
    const err = new Error('Name cannot be empty')
    err.status = 400
    throw err
  }
  const row = await classModel.updateClass(id, { name, subject, studio, isLive, meetingLink })
  if (!row) {
    const err = new Error('Class not found')
    err.status = 404
    throw err
  }
  void activityLogModel.recordAction(req.user?.id, 'Class updated', {
    class_id: row.id,
    name: row.name,
    subject: row.subject ?? '',
  })
  res.json({ success: true, data: row })
}

async function destroy(req, res) {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id < 1) {
    const err = new Error('Invalid class id')
    err.status = 400
    throw err
  }
  const existing = await classModel.getClassById(id)
  if (!existing) {
    const err = new Error('Class not found')
    err.status = 404
    throw err
  }
  await classModel.deleteClass(id)
  void activityLogModel.recordAction(req.user?.id, 'Class deleted', {
    class_id: id,
    name: existing.name,
  })
  res.json({ success: true, data: { id } })
}

module.exports = { list, getById, create, update, destroy }
