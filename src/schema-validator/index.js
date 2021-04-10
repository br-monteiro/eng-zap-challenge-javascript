const Ajv = require('ajv')
const SchemaValidator = require('./schema-validator')

exports.validator = new SchemaValidator(new Ajv({ allErrors: true }))
