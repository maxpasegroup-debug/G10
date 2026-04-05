const fs = require('fs')
const fsProm = require('fs/promises')
const path = require('path')
const galleryModel = require('../models/galleryModel')

const UPLOAD_PUBLIC_PREFIX = '/uploads/gallery'

function tryUnlinkUploadedFile(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return
  if (!imageUrl.startsWith(`${UPLOAD_PUBLIC_PREFIX}/`)) return
  const relative = imageUrl.replace(/^\//, '')
  const fp = path.join(__dirname, '..', relative)
  const uploadsRoot = path.join(__dirname, '..', 'uploads')
  if (!fp.startsWith(uploadsRoot)) return
  fs.unlink(fp, () => {})
}

async function listPublic(req, res) {
  const rows = await galleryModel.listGalleryPublic()
  res.json({ success: true, data: rows })
}

/** Public read for a published gallery row (no JWT; <img> friendly). */
async function serveFileById(req, res) {
  const id = Number(req.params.id)
  if (!Number.isFinite(id) || id <= 0) {
    const err = new Error('Invalid id')
    err.status = 400
    throw err
  }
  const row = await galleryModel.getGalleryItemById(id)
  if (!row?.image_url) {
    const err = new Error('Not found')
    err.status = 404
    throw err
  }
  const imageUrl = String(row.image_url).trim()
  if (!imageUrl.startsWith(`${UPLOAD_PUBLIC_PREFIX}/`)) {
    const err = new Error('Not found')
    err.status = 404
    throw err
  }
  const relative = imageUrl.replace(/^\//, '')
  const abs = path.join(__dirname, '..', relative)
  const uploadsRoot = path.resolve(path.join(__dirname, '..', 'uploads'))
  const resolved = path.resolve(abs)
  if (!resolved.startsWith(uploadsRoot + path.sep) && resolved !== uploadsRoot) {
    return res.status(403).json({ success: false, error: 'Forbidden' })
  }
  let st
  try {
    st = await fsProm.stat(resolved)
  } catch {
    const err = new Error('Not found')
    err.status = 404
    throw err
  }
  if (!st.isFile()) {
    const err = new Error('Not found')
    err.status = 404
    throw err
  }
  await new Promise((resolve, reject) => {
    res.sendFile(resolved, (e) => {
      if (e) {
        if (!res.headersSent) res.status(500).json({ success: false, error: 'Could not send file' })
        reject(e)
        return
      }
      resolve()
    })
  })
}

async function createFromBody(req, res) {
  const { imageUrl, image_url: image_url_snake, caption, category, sortOrder, sort_order } = req.body
  const url = (imageUrl ?? image_url_snake ?? '').trim()
  if (!url) {
    const err = new Error('imageUrl is required')
    err.status = 400
    throw err
  }
  const row = await galleryModel.createGalleryItem({
    imageUrl: url,
    caption,
    category,
    sortOrder: sortOrder ?? sort_order,
  })
  res.status(201).json({ success: true, data: row })
}

async function uploadFile(req, res) {
  if (!req.file?.filename) {
    const err = new Error('Image file is required')
    err.status = 400
    throw err
  }
  const { caption, category, sortOrder, sort_order } = req.body
  const imageUrl = `${UPLOAD_PUBLIC_PREFIX}/${req.file.filename}`
  const row = await galleryModel.createGalleryItem({
    imageUrl,
    caption,
    category,
    sortOrder: sortOrder ?? sort_order,
  })
  res.status(201).json({ success: true, data: row })
}

async function remove(req, res) {
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) {
    const err = new Error('Invalid id')
    err.status = 400
    throw err
  }
  const deleted = await galleryModel.deleteGalleryItem(id)
  if (!deleted) {
    const err = new Error('Gallery item not found')
    err.status = 404
    throw err
  }
  tryUnlinkUploadedFile(deleted.image_url)
  res.json({ success: true, data: { id: deleted.id } })
}

module.exports = { listPublic, serveFileById, createFromBody, uploadFile, remove }
