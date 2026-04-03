const express = require('express')
const userController = require('../controllers/userController')
const { verifyToken } = require('../middleware/auth')
const { requireAdmin } = require('../middleware/requireAdmin')
const { asyncHandler } = require('../middleware/asyncHandler')

const router = express.Router()

router.use(verifyToken)
router.use(requireAdmin)

router.get('/', asyncHandler(userController.list))
router.post('/', asyncHandler(userController.create))
router.delete('/:id', asyncHandler(userController.remove))

module.exports = router
