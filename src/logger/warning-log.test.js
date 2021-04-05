const assert = require('assert')

const InfoLog = require('./info-log')

describe('logger - info-log', () => {
  const bole = {}
  let logger = {}
  let outputLog

  beforeEach(() => {
    bole.info = (message, info) => {
      outputLog = `${message}#${JSON.stringify(info)}`
    }

    logger = new InfoLog(bole)
  })

  it('throws an Error when instantiates without the log engine reference', () => {
    assert.throws(() => new InfoLog(), Error)
  })

  it('returns true when the log type "info" was executed', async () => {
    assert.strictEqual(await logger.log('info', 'test', {}), true)
  })

  it('returns false when the log type is not "info"', async () => {
    assert.strictEqual(await logger.log('whatever', 'test', {}), false)
  })

  it('returns the outputLog equals the parameters values', async () => {
    const expected = 'this is a log message#{"details":true}'

    await logger.log('info', 'this is a log message', { details: true })

    assert.strictEqual(outputLog, expected)
  })
})
