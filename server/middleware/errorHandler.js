/**
 * Global error handler — must be registered after all routes.
 * In production, never expose internal details for server errors (5xx).
 */
function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500
  const isProd = process.env.NODE_ENV === 'production'
  const genericMessage = 'Something went wrong. Please try again later.'

  let message = err.message || 'Internal Server Error'
  if (isProd && status >= 500) {
    message = genericMessage
  }

  res.status(status).json({
    success: false,
    error: message,
  })
}

module.exports = { errorHandler }
