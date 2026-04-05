const express = require('express')
const performanceController = require('../controllers/performanceController')
const { verifyToken } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/asyncHandler')
const { requireTeacherOrAdmin } = require('../middleware/requireTeacherOrAdmin')

const router = express.Router()

router.use(verifyToken)

router.get('/', asyncHandler(performanceController.list))
router.post('/', requireTeacherOrAdmin, asyncHandler(performanceController.create))

module.exports = router
