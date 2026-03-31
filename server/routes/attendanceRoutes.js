const express = require('express')
const attendanceController = require('../controllers/attendanceController')
const { verifyToken } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/asyncHandler')

const router = express.Router()

router.use(verifyToken)

router.get('/', asyncHandler(attendanceController.list))
router.post('/', asyncHandler(attendanceController.create))

module.exports = router
