const CustomerService = require('../services/customer-service');

/*
	TODO: Add try catch
*/
module.exports = (app) => {
	const service = new CustomerService()

	app.use('/app-events', async (req, res, next) => {
		const { payload } = req.body;

		await service.SubscribeEvents(payload)

		console.log('========== Customer service Received Event ==========')
		return res.status(200).json(payload)
	})
}