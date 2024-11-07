require('dotenv').config()
const express = require('express')
const sequelize = require("./app/config/database.js")
const rabbitmq = require('./rabbitmq.js')
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.json());
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

sequelize.sync().then(async () => {
    console.log('Database synced!');
    app.listen(process.env.BILLING_PORT, async () => {
        console.log(`Server is running on port ${process.env.BILLING_PORT}`)
        await delay(10000)
        rabbitmq.connect(`amqp://${process.env.QUEUE_UNAME}:${process.env.QUEUE_PASSW}@${process.env.QUEUE_HOST}:${process.env.QUEUE_PORT}`).then(() => {
            console.log('Connected to queue')
            rabbitmq.receiveMessages(process.env.QUEUE_NAME)
        })
    })
});

process.on('SIGINT', () => {
    console.log('Closing RabbitMQ connection...');
    rabbitmq.close();
    process.exit(0);
});