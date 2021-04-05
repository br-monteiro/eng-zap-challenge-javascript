const logger = require('../logger')('gateway-api/gateway-controller')

const { buildResponsePattern } = require('../utils')
const query = require('../query')

/**
 * @param { Request } req
 * @param { Response } res
 * @returns { Response }
 */
async function findData(req, res) {
  const queryResult = await query(req)

  if (!queryResult) {
    logger.log('error', 'APIKey not found')
    const response = buildResponsePattern('error', 'APIKey not found')

    return res.status(404).send(response)
  }

  return res.send(buildResponsePattern('success', '', queryResult))
}

module.exports = {
  findData
}
