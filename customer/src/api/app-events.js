const CustomerService = require('../services/customer-service');

/*
	TODO: Add try catch
*/
module.exports = (app) => {
	const service = new CustomerService()

	app.use('/app-events', async (req, res, next) => {
		console.log('========== Customer service Received Event ==========')
		const { payload } = req.body;

		await service.SubscribeEvents(payload)
		
		return res.status(200).json(payload)
	})
}