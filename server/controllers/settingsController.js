const settingsModel = require('../models/settingsModel')

async function getPublic(req, res) {
  const row = await settingsModel.getPublicSettings()
  if (!row) {
    const err = new Error('Site settings not configured')
    err.status = 503
    throw err
  }
  res.json({ success: true, data: row })
}

async function update(req, res) {
  const {
    academy_name,
    email,
    phone,
    address,
    map_embed_url,
    home_hero_title,
    home_hero_subtitle,
    about_text,
    contact_intro,
    admissions_message,
  } = req.body
  const row = await settingsModel.updateSettings({
    academy_name,
    email,
    phone,
    address,
    map_embed_url,
    home_hero_title,
    home_hero_subtitle,
    about_text,
    contact_intro,
    admissions_message,
  })
  if (!row) {
    const err = new Error('Site settings not configured')
    err.status = 503
    throw err
  }
  res.json({ success: true, data: row })
}

module.exports = { getPublic, update }
