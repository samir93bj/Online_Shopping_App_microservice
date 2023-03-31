const express = require('express');
const cors = require('cors');

const app = express();
const router = express.Router()

app.use(express.json());
app.use(cors)
app.use(router)

router.get('/', async (req, res) => {
	res.status(200).json({
		message: 'Product Service: Success up server'
	})	
})

app.listen(8005, () => {
	console.log('Customer is listening on http://localhost:8005')
})