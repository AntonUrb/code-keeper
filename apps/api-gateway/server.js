require('dotenv').config()
const express = require('express')
const router = require('./routes')
const rabbitMQConnection = require('./rabbitmq.js')
const app = express();
app.use(express.json())
app.use(express.urlencoded())

app.use('/', router)

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.listen(process.env.GATEWAY_PORT, process.env.GATEWAY_HOST, async () => {
    console.log(`Server is running on port ${process.env.GATEWAY_HOST}:${process.env.GATEWAY_PORT}`)
    await delay(10000)
    rabbitMQConnection.connect(`amqp://${process.env.QUEUE_UNAME}:${process.env.QUEUE_PASSW}@${process.env.QUEUE_HOST}:${process.env.QUEUE_PORT}`).then(console.log('Connected to queue'))
})

process.on('SIGINT', () => {    
    console.log('Closing RabbitMQ connection...');
    rabbitMQConnection.close();
    process.exit(0);
});