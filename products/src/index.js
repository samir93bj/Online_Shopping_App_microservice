const express = require('express');

const app = express();
const router = express.Router()

app.use(express.json());

app.use(router)

router.get('/', async (req, res) => {
	res.status(200).json({
		message: 'Product Service: Success up server'
	})	
})

app.listen(8003, () => {
	console.log('Customer is listening on http://localhost:8003')
})