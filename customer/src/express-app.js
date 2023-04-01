const express = require('express');
const cors  = require('cors');
const { customer, appEvent } = require('./api');
const errorHandler = require('./api/middlewares/error')
const errorHandlerSentry = require('./utils/error/sentry')

module.exports = async (app) => {

    app.use(express.json({ limit: '1mb'}));
    app.use(express.urlencoded({ extended: true, limit: '1mb'}));
    app.use(cors());
    app.use(express.static(__dirname + '/public'))
		// Listen to Events
		appEvent(app)

    //api
    customer(app);

    // error handling
		errorHandlerSentry(app)
}