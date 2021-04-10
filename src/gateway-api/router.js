const router = require('express').Router()

const { findData, processInputData } = require('./gateway-controller')

router.get('/:apikey', findData)

router.post('/load', processInputData)

module.exports = router
