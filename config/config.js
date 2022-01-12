require('dotenv').config();
module.exports = {
  development: {
    username: 'root',
    password: null,
    database: 'scholar_development',
    host: '127.0.0.1',
    dialect: 'mysql',
    operatorsAliases: false
  },
  test: {
    username: 'root',
    password: null,
    database: 'scholar_test',
    host: '127.0.0.1',
    dialect: 'mysql',
    operatorsAliases: false
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    operatorsAliases: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
