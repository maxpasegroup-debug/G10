require('dotenv').config()

if (process.env.NODE_ENV === 'production' && !String(process.env.JWT_SECRET || '').trim()) {
  console.error('JWT_SECRET missing')
  process.exit(1)
}

const app = require('./app')
const { syncTests } = require('./lib/syncTests')

const PORT = process.env.PORT || 5000

async function start() {
  try {
    await syncTests()
  } catch {
    /* registry optional */
  }
  app.listen(PORT)
}

start()
