const assert = require('assert')

const ErrorLog = require('./error-log')

describe('logger - debug-log', () => {
  const bole = {}
  let logger = {}
  let outputLog

  beforeEach(() => {
    bole.error = (message, info) => {
      outputLog = `${message}#${JSON.stringify(info)}`
    }

    logger = new ErrorLog(bole)
  })

  it('throws an Error when instanciates without the log engine reference', () => {
    assert.throws(() => new ErrorLog(), Error)
  })

  it('returns true when the log type "error" was executed', async () => {
    assert.strictEqual(await logger.log('error', 'test', {}), true)
  })

  it('returns false when the log type is not "error"', async () => {
    assert.strictEqual(await logger.log('whatever', 'test', {}), false)
  })

  it('returns the outputLog equals the parameters values', async () => {
    const expected = 'this is a log message#{"details":true}'

    await logger.log('error', 'this is a log message', { details: true })

    assert.strictEqual(outputLog, expected)
  })
})
