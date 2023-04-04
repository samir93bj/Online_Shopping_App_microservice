const Sentry = require('@sentry/node')
const config = require('../../config/index')
const { AuthorizeError, BadRequestError } = require('../../utils/error/app-errors')

module.exports = (app) => {
  Sentry.init({
    dsn: config.SENTRY_DNS,
    tracesSampleRate: 1.0
  })

  app.use((error, req, res, next) => {
    let reportError = true;

    [AuthorizeError, BadRequestError].forEach((typeOfError) => {
      if (error instanceof typeOfError) reportError = false
    })

    if (reportError) Sentry.captureException(error)

    const statusCode = error.statusCode || 500
    const data = error.data || error.message

    return res.status(statusCode).json({
      error: true,
      status: statusCode,
      message: data
    })
  })
}
