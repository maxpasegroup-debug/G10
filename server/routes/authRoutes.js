const express = require('express')
const authController = require('../controllers/authController')
const { verifyToken } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/asyncHandler')

const router = express.Router()

router.post('/register', asyncHandler(authController.register))
router.post('/login', asyncHandler(authController.login))
router.get('/me', verifyToken, asyncHandler(authController.me))

module.exports = router
