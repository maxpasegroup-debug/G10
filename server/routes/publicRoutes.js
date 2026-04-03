const express = require('express')
const publicController = require('../controllers/publicController')
const { asyncHandler } = require('../middleware/asyncHandler')

const router = express.Router()

router.get('/classes', asyncHandler(publicController.listClasses))
router.get('/teachers', asyncHandler(publicController.listTeachers))

module.exports = router
