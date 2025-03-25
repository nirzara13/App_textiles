// config/config.cjs
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "textile_app",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "textile_app",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    port: process.env.DB_PORT || 3306
  },
  test: {
    username: process.env.DB_USERNAME || "textile_app", 
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME_TEST || "textile_app_test",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    logging: false
  },
  production: {
    username: process.env.DB_USERNAME || "textile_app",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME_PROD || "textile_app_production",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    logging: false
  }
};