require('dotenv').config()

const LRUCache = require('../lru-cache')

/**
 * @type { DataStorage }
 */
module.exports = {
  storage: {},
  filters: {},
  cache: new LRUCache(Number(process.env.LRU_CACHE_CAPACITY) || 100)
}
