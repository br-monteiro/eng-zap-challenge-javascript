const assert = require('assert')

const DebugLog = require('./debug-log')

describe('logger - debug-log', () => {
  const bole = {}
  let logger = {}
  let outputLog

  beforeEach(() => {
    bole.debug = (message, info) => {
      outputLog = `${message}#${JSON.stringify(info)}`
    }

    logger = new DebugLog(bole)
  })

  it('throws an Error when instantiates without the log engine reference', () => {
    assert.throws(() => new DebugLog(), Error)
  })

  it('returns true when the log type "debug" was executed', async () => {
    assert.strictEqual(await logger.log('debug', 'test', {}), true)
  })

  it('returns false when the log type is not "debug"', async () => {
    assert.strictEqual(await logger.log('whatever', 'test', {}), false)
  })

  it('returns the outputLog equals the parameters values', async () => {
    const expected = 'this is a log message#{"details":true}'

    await logger.log('debug', 'this is a log message', { details: true })

    assert.strictEqual(outputLog, expected)
  })
})
