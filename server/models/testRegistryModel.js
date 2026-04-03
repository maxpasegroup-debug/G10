const pool = require('../config/db')

async function findBySlug(slug) {
  const { rows } = await pool.query(
    `SELECT id, name, slug, created_at
     FROM tests
     WHERE slug = $1
     LIMIT 1`,
    [slug],
  )
  return rows[0] || null
}

async function listAll() {
  const { rows } = await pool.query(
    `SELECT id, name, slug, created_at
     FROM tests
     ORDER BY name ASC`,
  )
  return rows
}

module.exports = { findBySlug, listAll }
