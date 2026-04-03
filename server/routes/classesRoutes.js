const express = require('express')
const classesController = require('../controllers/classesController')
const { verifyToken } = require('../middleware/auth')
const { requireAdmin } = require('../middleware/requireAdmin')
const { asyncHandler } = require('../middleware/asyncHandler')

const router = express.Router()

router.use(verifyToken)

router.get('/', asyncHandler(classesController.list))
router.get('/:id', asyncHandler(classesController.getById))
router.post('/', requireAdmin, asyncHandler(classesController.create))

module.exports = router
