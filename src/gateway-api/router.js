const router = require('express').Router()

const { findData } = require('./gateway-controller')

router.get('/:apikey', (req, res) => {
  return findData(req, res)
})

module.exports = router
