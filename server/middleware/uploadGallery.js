const fs = require('fs')
const path = require('path')
const multer = require('multer')

const uploadsDir = path.join(__dirname, '..', 'uploads', 'gallery')

function ensureDir() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureDir()
    cb(null, uploadsDir)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').slice(0, 8).replace(/[^.a-zA-Z0-9]/g, '') || '.bin'
    const base = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    cb(null, `${base}${ext}`)
  },
})

function fileFilter(_req, file, cb) {
  if (file.mimetype && file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image uploads are allowed'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
})

function uploadGalleryImage(req, res, next) {
  upload.single('image')(req, res, (err) => {
    if (err) {
      err.status = 400
      return next(err)
    }
    next()
  })
}

module.exports = { uploadGalleryImage, uploadsDir }
