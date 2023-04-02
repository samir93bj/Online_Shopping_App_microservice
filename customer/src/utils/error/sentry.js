const Sentry = require("@sentry/node");
const _ = require("@sentry/tracing");
const config = require("../../config/index")
const { AuthorizeError, BadRequestError,  NotFoundError } = require("../../utils/error/app-errors")

module.exports = (app) => {
	Sentry.init({
		dsn: config.SENTRY_DNS,
		tracesSampleRate: 1.0,
	});

	console.log(config.SENTRY_DNS);

	app.use((error, req, res, next) => {
		let reportError = true;

		[AuthorizeError, BadRequestError, NotFoundError].forEach((typeOfError) => {
			if (error instanceof typeOfError) reportError = false;
		})

		console.log(reportError, error)
		if (reportError) Sentry.captureException(error);

		const statusCode = error.statusCode || 500
		const data = error.data || error.message

		return res.status(statusCode).json({
			error: true,
			status: statusCode,
			message: data
		})
	})
};