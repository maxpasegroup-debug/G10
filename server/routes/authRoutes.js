const express = require('express')
const authController = require('../controllers/authController')
const { verifyToken } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/asyncHandler')
const { authLimiter } = require('../middleware/rateLimits')

const router = express.Router()

router.use(authLimiter())

router.post('/register', asyncHandler(authController.register))
router.post('/login', asyncHandler(authController.login))
router.get('/me', verifyToken, asyncHandler(authController.me))

module.exports = router
