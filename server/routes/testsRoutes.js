const express = require('express')
const testsListController = require('../controllers/testsListController')
const { asyncHandler } = require('../middleware/asyncHandler')

const router = express.Router()

router.get('/', asyncHandler(testsListController.list))

module.exports = router
