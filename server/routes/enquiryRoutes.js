const express = require('express')
const enquiryController = require('../controllers/enquiryController')
const { verifyToken } = require('../middleware/auth')
const { requireAdmin } = require('../middleware/requireAdmin')
const { asyncHandler } = require('../middleware/asyncHandler')

const router = express.Router()

router.post('/', asyncHandler(enquiryController.create))

router.get('/', verifyToken, requireAdmin, asyncHandler(enquiryController.list))

module.exports = router
