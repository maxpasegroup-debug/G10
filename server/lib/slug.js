function normalizeSlug(slug) {
  return String(slug ?? '').trim().toLowerCase()
}

module.exports = { normalizeSlug }
