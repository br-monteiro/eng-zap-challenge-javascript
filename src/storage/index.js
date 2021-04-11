const dataStorage = require('./storage')
const { normalizeStr } = require('../utils')

/**
 * Save item on storage obejct
 * @param { string } apikey - The apikey value
 * @param { InputData } data - The data to be saved
 * @returns { string } - The id of data value
 */
function setData (apikey, data) {
  if (!apikey || typeof apikey !== 'string') {
    throw new Error('The APIKey is required')
  }

  if (!data || (data && !data.id)) {
    throw new Error('The data value is invalid')
  }

  const normId = normalizeStr(data.id)
  const normAPIKey = normalizeStr(apikey)

  if (!dataStorage.storage[normAPIKey]) {
    dataStorage.storage[normAPIKey] = {}
  }

  dataStorage.storage[normAPIKey][normId] = data

  return normId
}

/**
 * Add new item into filters storage
 * @param { string } apikey - The apikey value
 * @param { string } filterName - The filter name
 * @param { string } dataId - The id of data
 * @param { * } value - The value of filter
 */
function setFilter (apikey, filterName, dataId, value) {
  if (!apikey || typeof apikey !== 'string') {
    throw new Error('The APIKey is required')
  }

  if (!filterName || typeof filterName !== 'string') {
    throw new Error('The FilterName is required')
  }

  if (!dataId) {
    throw new Error('The dataId must to be a truthy value')
  }

  const normDataId = normalizeStr(dataId)
  const normAPIKey = normalizeStr(apikey)
  const normFilterName = normalizeStr(filterName)
  const normValue = normalizeStr(value)

  if (!dataStorage.filters[normAPIKey]) {
    dataStorage.filters[normAPIKey] = {}
  }

  if (!dataStorage.filters[normAPIKey][normFilterName]) {
    dataStorage.filters[normAPIKey][normFilterName] = {}
  }

  if (!dataStorage.filters[normAPIKey][normFilterName][normValue]) {
    dataStorage.filters[normAPIKey][normFilterName][normValue] = new Set()
  }

  dataStorage.filters[normAPIKey][normFilterName][normValue].add(normDataId)
}

/**
 * Returns the Set Object with ids of items. Otherwise, returns null
 * @param { string } apikey - The APIKey of the filter
 * @param { string } filterName - The name of the filter
 * @param { string } value - The value of the filter
 * @returns { Set<string> | null }
 */
function getFilter (apikey, filterName, value) {
  try {
    const normAPIKey = normalizeStr(apikey)
    const normFilterName = normalizeStr(filterName)
    const normValue = normalizeStr(decodeURIComponent(value))
    const filter = dataStorage.filters[normAPIKey][normFilterName][normValue]

    return filter !== undefined ? filter : null
  } catch (_) {
    return null
  }
}

/**
 * Returns the item from storage according id
 * @param { string } apikey - The APIKey of item
 * @param { string } dataId - The ID of item
 * @returns { Object | null }
 */
function getData (apikey, dataId) {
  try {
    const normAPIKey = normalizeStr(apikey)
    const normDataId = normalizeStr(dataId)
    const item = dataStorage.storage[normAPIKey][normDataId]

    return item !== undefined ? item : null
  } catch (_) {
    return null
  }
}

/**
 * Returns all items of APIKey from storage. Otherwise returns null
 * @param { string } apikey - The APIKey of item
 * @returns { Object | null }
 */
function getCollection (apikey) {
  if (!apikey || typeof apikey !== 'string') {
    throw new Error('The APIKey is required')
  }

  const normAPIKey = normalizeStr(apikey)
  const collection = dataStorage.storage[normAPIKey]

  return collection !== undefined ? collection : null
}

/**
 * Returns the LRU Cache instance
 * @returns { import('../lru-cache') }
 */
function getCache () {
  return dataStorage.cache
}

/**
 * Remove the reference of the item in filter storage
 * @param { string } apikey - The apikey value
 * @param { string } filterName - The filter name
 * @param { string } dataId - The id of data
 * @param { * } value - The value of filter
 */
function removeFilter (apikey, filterName, dataId, value) {
  if (!apikey || typeof apikey !== 'string') {
    throw new Error('The APIKey is required')
  }

  if (!filterName || typeof filterName !== 'string') {
    throw new Error('The FilterName is required')
  }

  if (!dataId) {
    throw new Error('The dataId must to be a truthy value')
  }

  const normDataId = normalizeStr(dataId)
  const normAPIKey = normalizeStr(apikey)
  const normFilterName = normalizeStr(filterName)

  if (
    dataStorage.filters[normAPIKey] &&
    dataStorage.filters[normAPIKey][normFilterName]
  ) {
    const normValue = normalizeStr(value)
    const normValueNumber = Number(normValue)

    if (dataStorage.filters[normAPIKey][normFilterName][normValueNumber]) {
      return dataStorage.filters[normAPIKey][normFilterName][normValueNumber].delete(normDataId)
    } else if (dataStorage.filters[normAPIKey][normFilterName][normValue]) {
      return dataStorage.filters[normAPIKey][normFilterName][normValue].delete(normDataId)
    }
  }

  return false
}

module.exports = {
  setData,
  setFilter,
  getFilter,
  getData,
  getCache,
  getCollection,
  removeFilter
}
