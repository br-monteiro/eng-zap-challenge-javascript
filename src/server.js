#!/usr/bin/env node
require('dotenv').config()

const logger = require('./logger')('server')
const app = require('./index')
const port = process.env.PORT || 3000

logger.info('server process starting')

app.listen(port, async error => {
  if (error) {
    logger.error('unable to listen for connections', error)
    process.exit(10)
  }

  logger.info(`server is listening on port ${port}`)
})
