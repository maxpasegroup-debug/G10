const express = require('express')
const galleryController = require('../controllers/galleryController')
const { verifyToken } = require('../middleware/auth')
const { requireAdmin } = require('../middleware/requireAdmin')
const { asyncHandler } = require('../middleware/asyncHandler')
const { uploadGalleryImage } = require('../middleware/uploadGallery')

const router = express.Router()

router.get('/files/:id', asyncHandler(galleryController.serveFileById))
router.get('/', asyncHandler(galleryController.listPublic))

router.post(
  '/upload',
  verifyToken,
  requireAdmin,
  uploadGalleryImage,
  asyncHandler(galleryController.uploadFile),
)

router.post('/', verifyToken, requireAdmin, asyncHandler(galleryController.createFromBody))

router.delete('/:id', verifyToken, requireAdmin, asyncHandler(galleryController.remove))

module.exports = router
