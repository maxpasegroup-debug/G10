const express = require('express')
const studentController = require('../controllers/studentController')
const { verifyToken } = require('../middleware/auth')
const { requireAdmin } = require('../middleware/requireAdmin')
const { asyncHandler } = require('../middleware/asyncHandler')

const router = express.Router()

router.use(verifyToken)

router.get('/', asyncHandler(studentController.list))
router.post('/', requireAdmin, asyncHandler(studentController.create))
router.get('/:id', asyncHandler(studentController.getById))
router.patch('/:id', requireAdmin, asyncHandler(studentController.update))

module.exports = router
