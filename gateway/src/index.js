const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();

app.use(cors())
app.use(express.json());

app.use('/customer', proxy('http://localhost:8002'))
app.use('/shopping', proxy('http://localhost:8004'))
app.use('/', proxy('http://localhost:8003'))

app.listen(8000, () => {
	console.log('Gateway is listening on http://localhost:8000')
})