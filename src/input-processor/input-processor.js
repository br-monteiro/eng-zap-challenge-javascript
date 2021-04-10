const SetDataVivaReal = require('./handlers/set-data-viva-real')
const SetDataZap = require('./handlers/set-data-zap')
const ValidateLatLon = require('./handlers/validate-lat-lon')
const ValidateSchema = require('./handlers/validate-schema')

class InputProcessor {
  constructor () {
    this._headHandler = this._setUp()
  }

  _setUp () {
    const validateSchema = new ValidateSchema()
    const validateLatLon = new ValidateLatLon()
    const setDataVivaReal = new SetDataVivaReal()
    const setDataZap = new SetDataZap()

    validateSchema
      .setNext(validateLatLon)
      .setNext(setDataVivaReal)
      .setNext(setDataZap)

    return validateSchema
  }

  /**
   * Process the input data and save on storage
   * @param { InputData } data - Data to be processed
   */
  run (data) {
    this._headHandler.handle(data)
  }
}

module.exports = InputProcessor
