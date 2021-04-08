const logger = require('../logger')('schema-validator/schema-validator')

class SchemaValidator {
  constructor (engine) {
    if (!engine) {
      logger.log('error', 'Validation engine not informed')

      throw new Error('Validation engine not informed')
    }
    /**
     * @type { Ajv }
     */
    this._engine = engine
  }

  /**
   * Check if the input is compatible with the schema
   * @param { Object } input - The entry to be validate
   * @param { Object } schema - The schema used to validate the entry
   * @returns { boolean }
   */
  validate (input, schema) {
    try {
      return this._engine.compile(schema)(input)
    } catch (error) {
      logger.log('error', 'Input incompatible with the scheme', error)

      return false
    }
  }
}

module.exports = SchemaValidator
