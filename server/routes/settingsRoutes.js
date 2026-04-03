const express = require('express')
const settingsController = require('../controllers/settingsController')
const { verifyToken } = require('../middleware/auth')
const { requireAdmin } = require('../middleware/requireAdmin')
const { asyncHandler } = require('../middleware/asyncHandler')

const router = express.Router()

router.get('/', asyncHandler(settingsController.getPublic))
router.put('/', verifyToken, requireAdmin, asyncHandler(settingsController.update))

module.exports = router
