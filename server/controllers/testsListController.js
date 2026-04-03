const { syncTests } = require('../lib/syncTests')
const testRegistryModel = require('../models/testRegistryModel')

async function list(_req, res) {
  await syncTests()
  const rows = await testRegistryModel.listAll()
  res.json({ success: true, data: rows })
}

module.exports = { list }
