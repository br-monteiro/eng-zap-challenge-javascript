const storage = {
  'viva-real': true,
  zap: true
}

/**
 * @param { Request } req
 * @returns { Promise }
 */
async function query (req) {
  return storage[req.params.apikey] || false
}

module.exports = query
