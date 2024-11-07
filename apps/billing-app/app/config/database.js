const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('postgres://postgres:abcd1234@localhost:5432/postgres') // DONT USE FOR PROD!!!!!!!!!!
const sequelize = new Sequelize(process.env.DB_BILLING_NAME, process.env.DB_BILLING_UNAME, process.env.DB_BILLING_PASSW, {
  host: process.env.DB_BILLING_HOST,
  dialect: 'postgres',
  port: process.env.DB_BILLING_PORT,
  define: {
    timestamps: false
  }   //Change to your database dialect
});

module.exports = sequelize;