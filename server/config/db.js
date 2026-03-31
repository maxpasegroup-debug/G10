const { Pool } = require('pg')

const connectionString = process.env.DATABASE_URL

const poolConfig = {
  connectionString,
}

// Railway / managed Postgres typically require SSL; local Docker often does not.
if (connectionString && !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1')) {
  poolConfig.ssl = {
    rejectUnauthorized: false,
  }
}

const pool = new Pool(poolConfig)

module.exports = pool
