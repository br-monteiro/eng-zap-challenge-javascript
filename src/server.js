#!/usr/bin/env node
require('dotenv').config()

const logger = require('./logger')('server')
const app = require('./index')

logger.info('server process starting')

app.listen(process.env.PORT, async error => {
  if (error) {
    logger.error('unable to listen for connections', error)
    process.exit(10)
  }

  logger.info(`server is listening on port ${process.env.PORT}`)
})
