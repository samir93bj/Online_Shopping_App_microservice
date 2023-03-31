const express = require('express');

const app = express();
app.use(express.json());

const router = express.Router()
app.use(router)

router.get('/', async (req, res) => {
	res.status(200).json({
		message: 'Shopping Service: Success up server'
	})	
})

app.listen(8004, () => {
	console.log('Customer is listening on http://localhost:8004')
})