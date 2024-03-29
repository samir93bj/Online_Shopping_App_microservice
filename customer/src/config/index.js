const dotEnv = require("dotenv");

let env = process.env.NODE_ENV | 'prod'

if (env !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
	console.log(configFile)
  dotEnv.config({ path: configFile });

} else {
  dotEnv.config();
}

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
	SENTRY_DNS: process.env.SENTRY_DNS,
	MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
	EXCHANGE_NAME: 'ONLINE_SHOPPING',
	SHOPPING_BINDING_KEY: 'SHOPPING_SERVICE',
	CUSTOMER_BINDING_KEY: 'CUSTOMER_SERVICE',
	QUEUE_NAME: 'CUSTOMER_QUEUE'
};
