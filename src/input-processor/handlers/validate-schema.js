const AbstractHandler = require('./abstract-handler')
const { validator } = require('../../schema-validator')
const schema = require('../../schemes/input-schema.json')

class ValidateSchema extends AbstractHandler {
  /**
   * @param { InputData } data - The data object
   * @return { AbstractHandler }
   */
  handle (data) {
    const isValid = validator.validate(data, schema)

    if (!isValid) {
      return null
    }

    return super.handle(data)
  }
}

module.exports = ValidateSchema
