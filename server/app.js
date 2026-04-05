require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const { buildCorsOptions, validateProductionCors } = require('./middleware/corsConfig')
const { apiLimiter } = require('./middleware/rateLimits')
const { errorHandler } = require('./middleware/errorHandler')

validateProductionCors()

const authRoutes = require('./routes/authRoutes')
const studentRoutes = require('./routes/studentRoutes')
const attendanceRoutes = require('./routes/attendanceRoutes')
const performanceRoutes = require('./routes/performanceRoutes')
const classesRoutes = require('./routes/classesRoutes')
const testsRoutes = require('./routes/testsRoutes')
const submitTestRoutes = require('./routes/submitTestRoutes')
const userRoutes = require('./routes/userRoutes')
const settingsRoutes = require('./routes/settingsRoutes')
const galleryRoutes = require('./routes/galleryRoutes')
const enquiryRoutes = require('./routes/enquiryRoutes')
const publicRoutes = require('./routes/publicRoutes')
const uploadsController = require('./controllers/uploadsController')
const { verifyToken } = require('./middleware/auth')

const app = express()

app.set('trust proxy', 1)

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
)
app.use(cors(buildCorsOptions()))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(apiLimiter())

app.use('/api/uploads', verifyToken, uploadsController.serve)

app.get('/', (_req, res) => {
  res.type('text/plain').send('ok')
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', route: 'health working' })
})

app.use('/api/auth', authRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/public', publicRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/enquiries', enquiryRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/performance', performanceRoutes)
app.use('/api/classes', classesRoutes)
app.use('/api/tests', testsRoutes)
app.use('/api/submit-test', submitTestRoutes)
app.use('/api/users', userRoutes)

app.use((req, res) => {
  const isProd = process.env.NODE_ENV === 'production'
  res.status(404).json({
    success: false,
    error: 'Not found',
    ...(isProd ? {} : { path: req.originalUrl }),
  })
})

app.use(errorHandler)

module.exports = app
