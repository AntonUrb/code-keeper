const { Sequelize } = require('sequelize');

const test = () => {
    console.log(process.env.DB_INVENTORY_NAME)
    console.log(process.env.DB_INVENTORY_UNAME)
    console.log(process.env.DB_INVENTORY_PASSW)
    console.log(process.env.DB_INVENTORY_PORT)
    console.log(process.env.DB_INVENTORY_HOST)
}

//const sequelize = new Sequelize('postgres://postgres:abcd1234@localhost:5432/postgres')
//const sequelize = new Sequelize(`postgres://${process.env.DB_UNAME}:${process.env.DB_PW}@${process.env.DB_INVENTORY_HOST}:5432/movies`) // DONT USE FOR PROD!!!!!!!!!!
const sequelize = new Sequelize(process.env.DB_INVENTORY_NAME, process.env.DB_INVENTORY_UNAME, process.env.DB_INVENTORY_PASSW, {
    host: process.env.DB_INVENTORY_HOST,
    dialect: 'postgres',
    port: process.env.DB_INVENTORY_PORT,
    define: {
        timestamps: false
    }   //Change to your database dialect
});

module.exports = {
    sequelize,
    test,
};
