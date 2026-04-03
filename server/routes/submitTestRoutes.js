const express = require('express')
const submitTestController = require('../controllers/submitTestController')
const { asyncHandler } = require('../middleware/asyncHandler')

const router = express.Router()

router.post('/', asyncHandler(submitTestController.submitTest))

module.exports = router
