/* eslint-disable n/no-path-concat */
const express = require('express')
const cors = require('cors')
const { shopping } = require('./api')
const errorHandlerSentry = require('./utils/error/sentry')

module.exports = async (app) => {
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: true, limit: '1mb' }))
  app.use(cors())
  app.use(express.static(__dirname + '/public'))

  // api
  shopping(app)

  // error handling
  errorHandlerSentry(app)
}
