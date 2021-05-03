const SetDataEdinho = require('./handlers/set-data-edinho')
const SetDataHtr = require('./handlers/set-data-htr')
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
    const setDataEdinho = new SetDataEdinho()
    const setDataHtr = new SetDataHtr()
    const serFiltersEdinho = new SetFilters()
    const serFiltersHtr = new SetFilters()

    validateSchema
      .setNext(validateLatLon)
      .setNext(setDataEdinho)
      .setNext(serFiltersEdinho)
      .setNext(setDataHtr)
      .setNext(serFiltersHtr)

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
