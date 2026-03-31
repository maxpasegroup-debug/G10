/**
 * Global error handler — must be registered after all routes.
 */
function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  if (process.env.NODE_ENV !== 'production') {
    console.error(err)
  }

  res.status(status).json({
    success: false,
    error: message,
  })
}

module.exports = { errorHandler }
