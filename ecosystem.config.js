require('dotenv').config()

const {
  HOST,
  PORT,
  APP_KEYS,
  API_TOKEN_SALT,
  ADMIN_JWT_SECRET,
  JWT_SECRET,

  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_SSL,
} = process.env

module.exports = {
  apps: [
    {
      name: 'sample-strapi-app',
      script: 'npm',
      args: 'run start',
      instances: '1',
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        HOST,
        PORT,
        APP_KEYS,
        API_TOKEN_SALT,
        ADMIN_JWT_SECRET,
        JWT_SECRET,

        DATABASE_HOST,
        DATABASE_PORT,
        DATABASE_NAME,
        DATABASE_USERNAME,
        DATABASE_PASSWORD,
        DATABASE_SSL,
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
  ],
}
