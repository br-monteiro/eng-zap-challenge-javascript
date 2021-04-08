const assert = require('assert')
const Ajv = require('ajv')

const SchemaValidator = require('./schema-validator')

describe.only('schema-validator', () => {
  /**
   * @type { SchemaValidator }
   */
  let schemaValidator = {}

  beforeEach(() => {
    schemaValidator = new SchemaValidator({
      compile: (schema) => {
        return (input) => {
          return typeof schema === 'object' && typeof input === 'object'
        }
      }
    })
  })

  it('returns true when the entries are an Object', () => {
    assert.strictEqual(true, schemaValidator.validate({}, {}))
    assert.strictEqual(true, schemaValidator.validate([], []))
  })

  it('returns true when the entries are invalid', () => {
    assert.strictEqual(false, schemaValidator.validate({}, undefined))
    assert.strictEqual(false, schemaValidator.validate({}, false))
    assert.strictEqual(false, schemaValidator.validate({}, 123))
    assert.strictEqual(false, schemaValidator.validate(undefined, {}))
    assert.strictEqual(false, schemaValidator.validate(false, {}))
    assert.strictEqual(false, schemaValidator.validate(123, {}))
  })

  it('throws an Error when the validation engine is not informed', () => {
    assert.throws(() => new SchemaValidator(), Error)
  })

  it('returns true when the input is validated according to the schema', () => {
    const validation = new SchemaValidator(new Ajv())

    const input = {
      test: true,
      OLX: 'awesome',
      num: 123,
      pattern: '21-10-1991'
    }

    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'boolean'
        },
        OLX: {
          type: 'string'
        },
        num: {
          type: 'integer'
        },
        pattern: {
          type: 'string',
          pattern: '^[0-9]{2}-[0-9]{2}-[0-9]{4}$'
        }
      }
    }

    assert.strictEqual(true, validation.validate(input, schema))
  })
})
