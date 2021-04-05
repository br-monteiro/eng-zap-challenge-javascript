#!/usr/bin/env node
require('dotenv').config()

const logger = require('./logger')('server')
const app = require('./index')

logger.log('info', 'server process starting')

app.listen(process.env.PORT, async error => {
  if (error) {
    logger.log('error', 'unable to listen for connections', error)
    process.exit(10)
  }

  logger.log('info', `server is listening on port ${process.env.PORT}`)
})
