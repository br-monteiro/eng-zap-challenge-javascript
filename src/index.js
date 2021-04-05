const express = require('express')
const app = express()

app.use(express.urlencoded())
app.use(express.json())

app.use('/api/v1', require('./gateway-api/router'))

module.exports = app
