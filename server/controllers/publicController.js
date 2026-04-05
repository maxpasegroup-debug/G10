const classModel = require('../models/classModel')
const userModel = require('../models/userModel')

async function listClasses(_req, res) {
  const classes = await classModel.listClasses()
  const data = classes.map((c) => ({
    id: c.id,
    name: c.name,
    subject: c.subject,
    studio: c.studio,
    is_live: c.is_live,
  }))
  res.json({ success: true, data })
}

async function listTeachers(_req, res) {
  const teachers = await userModel.listPublicTeachers()
  res.json({ success: true, data: teachers })
}

module.exports = { listClasses, listTeachers }
