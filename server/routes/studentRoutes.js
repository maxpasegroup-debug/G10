const express = require('express')
const studentController = require('../controllers/studentController')
const { verifyToken } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/asyncHandler')

const router = express.Router()

router.use(verifyToken)

router.get('/', asyncHandler(studentController.list))
router.get('/:id', asyncHandler(studentController.getById))
router.post('/', asyncHandler(studentController.create))

module.exports = router
