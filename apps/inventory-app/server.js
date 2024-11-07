require('dotenv').config()
const express = require("express")
const {sequelize} = require("./app/config/database.js")
const app = express();
app.use(express.json());
app.use(express.urlencoded())

const {test} = require('./app/config/database.js')

const routes = require("./app/routes/Routes.js");

app.use("/api/movies", routes)
// Sync the database
test()
sequelize.sync().then(() => {
    console.log('Database synced!');
    app.listen(process.env.INVENTORY_PORT, async () => {
        console.log(`Server is running on: ${process.env.INVENTORY_HOST}${process.env.INVENTORY_PORT}`)
    })
});
