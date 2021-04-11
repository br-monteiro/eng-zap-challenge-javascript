const { getFilter, getData, getCache, getCollection } = require('../storage')
const { normalizeStr, intersection, chunkArray } = require('../utils')

class QueryProcessor {
  /**
   * @param { Request } request
   */
  constructor (request) {
    if (
      !request ||
      (request && !request.query) ||
      (request && !request.params)
    ) {
      throw new Error('The request object is required')
    }

    this._query = request.query
    this._params = request.params
  }

  /**
   * Returns an array of FilterDetail
   * @returns { Array<FilterDetail> }
   */
  getFilters () {
    const filter = this._query.filter || {}

    return Object.keys(filter)
      .reduce((filters, key) => {
        const param = filter[key]

        if (Array.isArray(param)) {
          const result = Array
            .from(new Set(param))
            .map(value => ({ key, value }))

          filters = filters.concat(result)
        } else {
          filters.push({
            key,
            value: param
          })
        }

        return filters
      }, [])
  }

  /**
   * Returns the value of the associated index on targetObject. Otherwise returns null
   * @param { * } index - The index of value in object
   * @param { * } targetObject - The object used as target
   * @returns { * | null }
   */
  _abstractGetValue (index, targetObject = {}) {
    try {
      return targetObject[index] || null
    } catch (_) {
      return null
    }
  }

  /**
   * Returns the value of parameter from query. Otherwise returns null
   * @param { * } paramName - The query parameter name
   * @returns { * | null }
   */
  getQueryParam (paramName) {
    return this._abstractGetValue(paramName, this._query)
  }

  /**
   * Returns the value of parameter from params Object. Otherwise returns null
   * @param { * } paramName - The parameter name
   * @returns { * | null }
   */
  getParam (paramName) {
    return this._abstractGetValue(paramName, this._params)
  }

  /**
   * Returns the string used as key of cache
   * @param { string } apikey - The APIKey of storage
   * @param { Array<FilterDetail> } filters - The filters apply on process
   * @param { PaginationSettings } pagination
   * @return { string }
   */
  getCacheKey (apikey, filters, pagination) {
    const page = (pagination && pagination.page) || ''
    const perPage = (pagination && pagination.perPage) || ''
    const preffix = normalizeStr(`${(apikey || '')}${page}${perPage}`)

    return preffix + (Array.isArray(filters) ? filters : [])
      .reduce((acc, filter) => {
        acc.push(`${filter.key}${filter.value}`)

        return acc
      }, [])
      .sort()
      .join('')
  }

  /**
   * Returns the items from the storage according the parameters
   * @param { string } apikey - The APIKey of storage
   * @param { Array<FilterDetail> } filters - The filters apply on process
   * @param { PaginationSettings } pagination - The pagination settings
   * @returns { QueryResult | null }
   */
  getResult (apikey, filters, pagination) {
    const normAPIKey = normalizeStr(apikey)
    const cacheKey = this.getCacheKey(normAPIKey, filters, pagination)
    const resultFromCache = getCache().get(cacheKey)

    if (resultFromCache) return resultFromCache

    if (!filters.length) {
      const collection = getCollection(normAPIKey)

      if (!collection) return null

      const result = this._buildQueryResult(Object.values(collection), pagination)

      getCache().put(cacheKey, result)

      return result
    } else {
      const filtersSet = filters.reduce((setOfIds, filter, index) => {
        const filterCollection = getFilter(normAPIKey, filter.key, filter.value)

        if (filterCollection) {
          setOfIds = index === 0 ? filterCollection : intersection(setOfIds, filterCollection)
        }

        return setOfIds
      }, new Set())

      if (!filtersSet.size) return null

      const collection = []

      for (const id of filtersSet.keys()) {
        const item = getData(normAPIKey, id)

        if (item) collection.push(item)
      }

      if (!collection.length) return null

      const result = this._buildQueryResult(collection, pagination)

      getCache().put(cacheKey, result)

      return result
    }
  }

  /**
   * Build the QueryResult object
   * @param { Array<InputData> } collection - The collection of items from storage
   * @param { PaginationSettings } pagination - The pagination settings
   * @returns { QueryResult }
   */
  _buildQueryResult (collection, pagination) {
    const chunks = chunkArray(collection, pagination.perPage)
    const page = pagination.page <= chunks.length ? pagination.page : chunks.length
    const index = page - 1
    const listings = chunks[index]

    return {
      pageNumber: page,
      pageSize: listings.length,
      totalCount: chunks.length,
      listings
    }
  }
}

module.exports = QueryProcessor
