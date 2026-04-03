const enquiryModel = require('../models/enquiryModel')

async function create(req, res) {
  const { name, phone, course, age } = req.body
  if (!name || !phone || !course) {
    const err = new Error('Name, phone, and course are required')
    err.status = 400
    throw err
  }
  const row = await enquiryModel.createEnquiry({
    name: String(name).trim(),
    phone: String(phone).trim(),
    course: String(course).trim(),
    age: age != null && age !== '' ? String(age).trim() : null,
  })
  res.status(201).json({ success: true, data: row })
}

async function list(req, res) {
  const rows = await enquiryModel.listEnquiries()
  res.json({ success: true, data: rows })
}

module.exports = { create, list }
