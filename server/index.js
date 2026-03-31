require('dotenv').config()

const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

const { errorHandler } = require('./middleware/errorHandler')

const authRoutes = require('./routes/authRoutes')
const studentRoutes = require('./routes/studentRoutes')
const attendanceRoutes = require('./routes/attendanceRoutes')
const performanceRoutes = require('./routes/performanceRoutes')
const classesRoutes = require('./routes/classesRoutes')

const app = express()
const port = process.env.PORT || 5000

app.set('trust proxy', 1)

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'music-academy-api' })
})

app.use('/auth', authRoutes)
app.use('/students', studentRoutes)
app.use('/attendance', attendanceRoutes)
app.use('/performance', performanceRoutes)
app.use('/classes', classesRoutes)

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Not found' })
})

app.use(errorHandler)

app.listen(port, () => {
  console.log(`API listening on port ${port}`)
})
