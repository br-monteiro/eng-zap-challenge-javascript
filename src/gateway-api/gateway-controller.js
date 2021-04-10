const logger = require('../logger')('gateway-api/gateway-controller')

const { buildResponsePattern, buildPaginationSettings } = require('../utils')
const { processSource } = require('../data-requester')
const { validator } = require('../schema-validator')
const sourceUrlSchema = require('../schemes/source-url.json')
const QueryProcessor = require('../query-processor')

/**
 * @param { Request } req
 * @param { Response } res
 * @returns { Response }
 */
async function findData (req, res) {
  const qp = new QueryProcessor(req)
  const apikey = qp.getParam('apikey')
  const filters = qp.getFilters()
  const pagination = buildPaginationSettings(req)
  const queryResult = qp.getResult(apikey, filters, pagination)

  if (!queryResult) {
    logger.log('error', 'results not found')
    const response = buildResponsePattern('error', 'results not found')

    return res.status(404).send(response)
  }

  return res.send(buildResponsePattern('success', '', queryResult))
}

/**
 * @param { Request } req
 * @param { Response } res
 * @returns { Response }
 */
async function processInputData (req, res) {
  if (!validator.validate(req.body, sourceUrlSchema)) {
    logger.log('error', 'schema violation', validator.getErrors())
    const response = buildResponsePattern('error', 'schema violation', { errors: validator.getErrors() })

    return res.status(400).send(response)
  }

  const url = req.body.sourceUrl

  processSource(url).then(() => {
    logger.log('info', 'source processed')
  })

  return res.send(buildResponsePattern('success', `queue started at ${new Date()}`))
}

module.exports = {
  findData,
  processInputData
}
