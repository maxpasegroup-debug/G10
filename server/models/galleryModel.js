const pool = require('../config/db')

const ALLOWED_CATEGORIES = new Set(['classes', 'performances', 'studio'])

function normalizeCategory(raw) {
  const c = String(raw || 'classes').toLowerCase()
  return ALLOWED_CATEGORIES.has(c) ? c : 'classes'
}

async function listGalleryPublic() {
  const { rows } = await pool.query(
    `SELECT id, image_url, caption, category, sort_order, created_at
     FROM gallery_items
     ORDER BY sort_order ASC, id DESC`,
  )
  return rows
}

async function createGalleryItem({ imageUrl, caption, category, sortOrder }) {
  const { rows } = await pool.query(
    `INSERT INTO gallery_items (image_url, caption, category, sort_order)
     VALUES ($1, $2, $3, $4)
     RETURNING id, image_url, caption, category, sort_order, created_at`,
    [
      imageUrl,
      String(caption || '').trim() || 'Photo',
      normalizeCategory(category),
      Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 0,
    ],
  )
  return rows[0]
}

async function getGalleryItemById(id) {
  const { rows } = await pool.query(
    'SELECT id, image_url, caption, category, sort_order, created_at FROM gallery_items WHERE id = $1',
    [id],
  )
  return rows[0] || null
}

async function deleteGalleryItem(id) {
  const { rows } = await pool.query(
    'DELETE FROM gallery_items WHERE id = $1 RETURNING id, image_url',
    [id],
  )
  return rows[0] || null
}

module.exports = {
  listGalleryPublic,
  createGalleryItem,
  getGalleryItemById,
  deleteGalleryItem,
  normalizeCategory,
  ALLOWED_CATEGORIES,
}
