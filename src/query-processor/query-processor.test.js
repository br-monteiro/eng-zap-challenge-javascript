const assert = require('assert')
const QueryProcessor = require('./query-processor')

const mockRequest = {
  params: {
    apikey: 'olx-test',
    test: 'yes'
  },
  query: {
    page: '2',
    perPage: '100',
    filter: {
      abc: '1',
      efg: ['2', '3']
    }
  }
}

describe('query-processor', () => {
  /**
   * @type { QueryProcessor }
   */
  let queryProcessor = {}

  beforeEach(() => {
    queryProcessor = new QueryProcessor(mockRequest)
  })

  describe('#constructor', () => {
    it('throws an Error when try to instantiate with an invalid Request object', () => {
      assert.throws(() => new QueryProcessor(), Error)
      assert.throws(() => new QueryProcessor({}), Error)
      assert.throws(() => new QueryProcessor([]), Error)
      assert.throws(() => new QueryProcessor(null), Error)
    })
  })

  describe('#getFilters', () => {
    it('returns all filters according Request object', () => {
      const expected = [
        { key: 'abc', value: '1' },
        { key: 'efg', value: '2' },
        { key: 'efg', value: '3' }
      ]

      assert.deepStrictEqual(queryProcessor.getFilters(), expected)
    })

    it('returns an empety array when there is no filter', () => {
      queryProcessor._query = {}

      assert.deepStrictEqual(queryProcessor.getFilters(), [])
    })
  })

  describe('#getQueryParam', () => {
    it('returns the value of query parameters', () => {
      const expected = {
        abc: '1',
        efg: ['2', '3']
      }

      assert.strictEqual(queryProcessor.getQueryParam('page'), '2')
      assert.strictEqual(queryProcessor.getQueryParam('perPage'), '100')
      assert.deepStrictEqual(queryProcessor.getQueryParam('filter'), expected)
    })

    it('returns null when the query param informed there is no associated value', () => {
      assert.strictEqual(queryProcessor.getQueryParam('whatever'), null)
      assert.strictEqual(queryProcessor.getQueryParam('test'), null)
    })
  })

  describe('#getParam', () => {
    it('returns the value of query', () => {
      assert.strictEqual(queryProcessor.getParam('apikey'), 'olx-test')
      assert.strictEqual(queryProcessor.getParam('test'), 'yes')
    })

    it('returns null when the query value informed there is no associated value', () => {
      assert.strictEqual(queryProcessor.getParam('whatever'), null)
      assert.strictEqual(queryProcessor.getParam('abc'), null)
    })
  })

  describe('#getCacheKey', () => {
    let pagination = {}

    beforeEach(() => {
      pagination = {
        page: 7,
        perPage: 33
      }
    })

    it('returns the value used as key of the cache according parameters', () => {
      const filters = {
        regular: [
          { key: 'a', value: '111' },
          { key: 'b', value: '222' }
        ],
        reverse: [
          { key: 'a', value: '222' },
          { key: 'b', value: '111' }
        ]
      }

      assert.strictEqual(queryProcessor.getCacheKey('olx', filters.regular, pagination), 'olx733a111b222')
      assert.strictEqual(queryProcessor.getCacheKey('olx', filters.reverse, pagination), 'olx733a222b111')
    })

    it('returns the value used as key of the cache without filters', () => {
      assert.strictEqual(queryProcessor.getCacheKey('OLX', [], pagination), 'olx733')
    })

    it('returns the value used as key of the cache without filters and pagination', () => {
      assert.strictEqual(queryProcessor.getCacheKey('OLX'), 'olx')
    })

    it('returns an empty string when there is no parameters informed', () => {
      assert.strictEqual(queryProcessor.getCacheKey(''), '')
    })
  })
})
