const express = require('express')
const performanceController = require('../controllers/performanceController')
const { verifyToken } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/asyncHandler')

const router = express.Router()

router.use(verifyToken)

router.get('/', asyncHandler(performanceController.list))
router.post('/', asyncHandler(performanceController.create))

module.exports = router
