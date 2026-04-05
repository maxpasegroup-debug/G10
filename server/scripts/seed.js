/**
 * Upsert admin user from env (run on Railway after deploy or locally).
 *
 *   SEED_ADMIN_EMAIL   (default: admin@g10amr.com)
 *   SEED_ADMIN_PASSWORD (required to seed; omit to skip)
 *
 * Usage: npm run seed --prefix server
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

const bcrypt = require('bcrypt')
const pool = require('../config/db')
const userModel = require('../models/userModel')

const SALT_ROUNDS = 10

const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@g10amr.com'
const adminPassword = process.env.SEED_ADMIN_PASSWORD

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('[seed] DATABASE_URL is required')
    process.exit(1)
  }
  if (!adminPassword) {
    console.warn('[seed] SEED_ADMIN_PASSWORD not set — skipping admin upsert')
    process.exit(0)
  }

  const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS)
  await userModel.upsertAdminUser({
    email: adminEmail,
    passwordHash,
    name: 'Administrator',
  })
  console.log('[seed] Admin upserted:', adminEmail.trim().toLowerCase())
}

main()
  .catch((e) => {
    console.error('[seed]', e)
    process.exit(1)
  })
  .finally(() => pool.end())
