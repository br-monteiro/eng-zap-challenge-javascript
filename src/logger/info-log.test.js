const assert = require('assert')

const WarninLog = require('./warning-log')

describe('logger - warning-log', () => {
  const bole = {}
  let logger = {}
  let outputLog

  beforeEach(() => {
    bole.warn = (message, info) => {
      outputLog = `${message}#${JSON.stringify(info)}`
    }

    logger = new WarninLog(bole)
  })

  it('throws an Error when instantiates without the log engine reference', () => {
    assert.throws(() => new WarninLog(), Error)
  })

  it('returns true when the log type "warning" was executed', async () => {
    assert.strictEqual(await logger.log('warning', 'test', {}), true)
  })

  it('returns false when the log type is not "warning"', async () => {
    assert.strictEqual(await logger.log('whatever', 'test', {}), false)
  })

  it('returns the outputLog equals the parameters values', async () => {
    const expected = 'this is a log message#{"details":true}'

    await logger.log('warning', 'this is a log message', { details: true })

    assert.strictEqual(outputLog, expected)
  })
})
