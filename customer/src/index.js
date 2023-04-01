const express = require('express');
const { PORT } = require('./config');
const { databaseConnection } = require('./database');
const expressApp = require('./express-app');

const StartServer = async() => {

    const app = express();
    
    await databaseConnection();
    
    await expressApp(app);


		app.use((error, req, res, next) => {
			const statusCode = error.statusCode || 500
			const data = error.data || error.message

			return res.status(statusCode).json({
				error: true,
				status: statusCode,
				message: data
			})
		})

    app.listen(PORT, () => {
        console.log(`listening to port ${PORT}`);
    })
    .on('error', (err) => {
        console.log(err);
        process.exit();
    })
}

StartServer();