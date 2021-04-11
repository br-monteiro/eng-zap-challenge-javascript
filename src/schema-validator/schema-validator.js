const logger = require('../logger')('schema-validator/schema-validator')

class SchemaValidator {
  constructor (engine) {
    if (!engine) {
      logger.error('Validation engine not informed')

      throw new Error('Validation engine not informed')
    }
    /**
     * @type { Ajv }
     */
    this._engine = engine
    this._errors = []
  }

  /**
   * Returns an array with errors
   * @returns { Array }
   */
  getErrors () {
    return this._errors
  }

  /**
   * Check if the input is compatible with the schema
   * @param { Object } input - The entry to be validate
   * @param { Object } schema - The schema used to validate the entry
   * @returns { boolean }
   */
  validate (input, schema) {
    try {
      const validate = this._engine.compile(schema)
      const isValid = validate(input)

      if (!isValid && Array.isArray(validate.errors)) {
        this._errors = validate.errors
      }

      return isValid
    } catch (error) {
      logger.error('Input incompatible with the scheme', error)

      return false
    }
  }
}

module.exports = SchemaValidator
