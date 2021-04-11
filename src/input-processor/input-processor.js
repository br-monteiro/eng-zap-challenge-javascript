const SetDataVivaReal = require('./handlers/set-data-viva-real')
const SetDataZap = require('./handlers/set-data-zap')
const SetFilters = require('./handlers/set-filters')
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
    const serFiltersVivaReal = new SetFilters()
    const serFiltersZap = new SetFilters()

    validateSchema
      .setNext(validateLatLon)
      .setNext(setDataVivaReal)
      .setNext(serFiltersVivaReal)
      .setNext(setDataZap)
      .setNext(serFiltersZap)

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
