const dotEnv = require('dotenv')

const env = process.env.NODE_ENV | 'prod'

if (env !== 'prod') {
  const configFile = `./.env.${process.env.NODE_ENV}`
  dotEnv.config({ path: configFile })
} else {
  dotEnv.config()
}

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET
}
