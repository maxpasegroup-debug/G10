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
const PORT = process.env.PORT || 5000

app.set('trust proxy', 1)

// Debug logger
app.use((req, _res, next) => {
  console.log('Incoming request:', req.method, req.url)
  next()
})

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

// Root + health
app.get('/', (_req, res) => {
  res.send('API is running 🚀')
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', route: 'health working' })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/performance', performanceRoutes)
app.use('/api/classes', classesRoutes)

// 404 handler last
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    path: req.originalUrl,
  })
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
