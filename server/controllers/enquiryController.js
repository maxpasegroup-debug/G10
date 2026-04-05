const enquiryModel = require('../models/enquiryModel')

async function create(req, res) {
  const { name, phone, course, message, age } = req.body
  const nameTrim = String(name ?? '').trim()
  const phoneTrim = String(phone ?? '').trim()
  const courseTrim = course != null && String(course).trim() !== '' ? String(course).trim() : null
  const messageTrim = message != null && String(message).trim() !== '' ? String(message).trim() : null

  if (!nameTrim || !phoneTrim) {
    const err = new Error('Name and phone are required')
    err.status = 400
    throw err
  }
  if (!courseTrim && !messageTrim) {
    const err = new Error('Either course or message is required')
    err.status = 400
    throw err
  }

  const row = await enquiryModel.createEnquiry({
    name: nameTrim,
    phone: phoneTrim,
    course: courseTrim ?? 'Contact',
    message: messageTrim,
    age: age != null && age !== '' ? String(age).trim() : null,
  })
  res.status(201).json({ success: true, data: row })
}

async function list(req, res) {
  const rows = await enquiryModel.listEnquiries()
  res.json({ success: true, data: rows })
}

module.exports = { create, list }
