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

  it('returns the outputLog equals the parameters values', async () => {
    const expected = 'this is a log message#{"details":true}'

    await logger.log('this is a log message', { details: true })

    assert.strictEqual(outputLog, expected)
  })
})
