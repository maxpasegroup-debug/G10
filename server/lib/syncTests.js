const pool = require('../config/db')
const { TESTS } = require('./testsConfig')

/**
 * Upsert all tests from config (self-healing registry). No-op without DATABASE_URL.
 */
async function syncTests() {
  if (!process.env.DATABASE_URL) {
    return
  }
  for (const test of TESTS) {
    await pool.query(
      `INSERT INTO tests (name, slug)
       VALUES ($1, $2)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name`,
      [test.name, test.slug],
    )
  }
}

module.exports = { syncTests }
