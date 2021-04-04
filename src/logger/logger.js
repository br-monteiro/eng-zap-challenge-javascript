const bole = require('bole')
const fs = require('fs')

const DebugLog = require('./debug-log')
const InfoLog = require('./info-log')
const WarningLog = require('./warning-log')
const ErrorLog = require('./error-log')

bole.output([
  { level: 'debug', stream: fs.createWriteStream('app.log') },
  { level: 'info', stream: process.stdout },
])

class Logger {
  constructor(context) {
    if (!context || typeof context !== 'string') {
      throw new Error('The context of log is required')
    }

    this.setLogEngine(bole(context))
    this.setUp()
  }

  setLogEngine(logEngine) {
    if (!logEngine) {
      throw new Error('The log Engine is falsy')
    }
    /**
     * @type { import('bole') }
     */
    this.logEngine = logEngine

    return this
  }

  setUp() {
    this.debug = new DebugLog(this.logEngine)
    this.info = new InfoLog(this.logEngine)
    this.warning = new WarningLog(this.logEngine)
    this.error = new ErrorLog(this.logEngine)
  }

  /**
   * @param { LogType } type - The type of log
   * @param { string } message - The message of log
   * @param { Object } info - The object with more details about log
   */
  log(type, message = '', info = {}) {
    this.debug.log(type, message, info)
    this.info.log(type, message, info)
    this.warning.log(type, message, info)
    this.error.log(type, message, info)
  }
}

module.exports = Logger
