const classModel = require('../models/classModel')
const userModel = require('../models/userModel')

async function listClasses(_req, res) {
  const classes = await classModel.listClasses()
  res.json({ success: true, data: classes })
}

async function listTeachers(_req, res) {
  const teachers = await userModel.listPublicTeachers()
  res.json({ success: true, data: teachers })
}

module.exports = { listClasses, listTeachers }
