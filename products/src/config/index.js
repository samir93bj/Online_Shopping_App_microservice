const dotEnv = require("dotenv");

let env = process.env.NODE_ENV | 'prod'

if (env === "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
	MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
	EXCHANGE_NAME: 'ONLINE_SHOPPING',
	SHOPPING_BINDING_KEY: 'SHOPPIN_SERVICE',
	CUSTOMER_BINDING_KEY: 'CUSTOMER_SERVICE',
};
