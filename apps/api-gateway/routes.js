const express = require('express')
const router = express.Router()
const proxy = require('./proxy')
const rabbitMQConnection = require('./rabbitmq.js')

// Inventory proxy
router.use('/api/movies', proxy.movie)

// Billing
router.use('/api/billing', async (req, res) => {
    rabbitMQConnection.sendMessage(process.env.QUEUE_NAME, req, res)
})

module.exports = router;