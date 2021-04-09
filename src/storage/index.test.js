const assert = require('assert')
const LRUCache = require('../lru-cache')
const { getData, getFilter, getCollection, getCache, setData, setFilter } = require('./index')
const storage = require('./storage')

describe('storage - index', () => {
  const APIKEY = 'OLX-TEST'
  let item = {}

  beforeEach(() => {
    item = { id: 'ABCDEF' }
    storage.storage = {}
    storage.filters = {}
  })

  describe('#setData', () => {
    it('insert an item into storage', () => {
      assert.strictEqual('abcdef', setData(APIKEY, item))
      assert.deepStrictEqual(storage.storage['olx-test'].abcdef, item)
    })

    it('throws an Error when the APIKey parameter is invalid', () => {
      assert.throws(() => setData(undefined, item), Error)
      assert.throws(() => setData('', item), Error)
      assert.throws(() => setData(true, item), Error)
      assert.throws(() => setData([], item), Error)
      assert.throws(() => setData({}, item), Error)
      assert.throws(() => setData(123, item), Error)

      assert.deepStrictEqual(storage.storage, {})
    })

    it('throws an Error when the item parameter is invalid', () => {
      assert.throws(() => setData(APIKEY), Error)
      assert.throws(() => setData(APIKEY, undefined), Error)
      assert.throws(() => setData(APIKEY, ''), Error)
      assert.throws(() => setData(APIKEY, []), Error)
      assert.throws(() => setData(APIKEY, {}), Error)
      assert.throws(() => setData(APIKEY, true), Error)

      assert.deepStrictEqual(storage.storage, {})
    })
  })

  describe('#setFilter', () => {
    it('insert a filter into storage', () => {
      setFilter(APIKEY, 'MY-TEST', 'ABCDEF', 123)
      setFilter(APIKEY, 'other-filter', 'ABCDEF', 123)

      const expected = {
        'olx-test': {
          'my-test': {
            123: (new Set()).add('abcdef')
          },
          'other-filter': {
            123: (new Set()).add('abcdef')
          }
        }
      }

      assert.deepStrictEqual(storage.filters, expected)
    })

    it('throws an Error when the APIKey parameter is invalid', () => {
      assert.throws(() => setFilter(undefined, 'MY-TEST', 'ABCDEF', 123), Error)
      assert.throws(() => setFilter('', 'MY-TEST', 'ABCDEF', 123), Error)
      assert.throws(() => setFilter(true, 'MY-TEST', 'ABCDEF', 123), Error)
      assert.throws(() => setFilter([], 'MY-TEST', 'ABCDEF', 123), Error)
      assert.throws(() => setFilter({}, 'MY-TEST', 'ABCDEF', 123), Error)
      assert.throws(() => setFilter(123, 'MY-TEST', 'ABCDEF', 123), Error)

      assert.deepStrictEqual(storage.filters, {})
    })

    it('throws an Error when the filterName parameter is invalid', () => {
      assert.throws(() => setFilter(APIKEY, undefined, 'ABCDEF', 123), Error)
      assert.throws(() => setFilter(APIKEY, null, 'ABCDEF', 123), Error)
      assert.throws(() => setFilter(APIKEY, '', 'ABCDEF', 123), Error)
      assert.throws(() => setFilter(APIKEY, 123, 'ABCDEF', 123), Error)
      assert.throws(() => setFilter(APIKEY, false, 'ABCDEF', 123), Error)
      assert.throws(() => setFilter(APIKEY, [], 'ABCDEF', 123), Error)
      assert.throws(() => setFilter(APIKEY, {}, 'ABCDEF', 123), Error)

      assert.deepStrictEqual(storage.filters, {})
    })

    it('throws an Error when the dataId parameter is invalid', () => {
      assert.throws(() => setFilter(APIKEY, 'MY-TEST', undefined, 123), Error)
      assert.throws(() => setFilter(APIKEY, 'MY-TEST', '', 123), Error)
      assert.throws(() => setFilter(APIKEY, 'MY-TEST', null, 123), Error)
      assert.throws(() => setFilter(APIKEY, 'MY-TEST', 0, 123), Error)
      assert.throws(() => setFilter(APIKEY, 'MY-TEST', false, 123), Error)

      assert.deepStrictEqual(storage.filters, {})
    })
  })

  describe('#getData', () => {
    it('returns an item from storage according APIKey and dataId', () => {
      setData(APIKEY, item)

      assert.deepStrictEqual(getData(APIKEY, 'ABCDEF'), item)
    })

    it('returns null when the APIKey is not associated into storage', () => {
      assert.deepStrictEqual(getData('', 'abcdef'), null)
      assert.deepStrictEqual(getData('other', 'abcdef'), null)
      assert.deepStrictEqual(getData(undefined, 'abcdef'), null)
    })

    it('returns null when the dataId is not associated to item', () => {
      assert.deepStrictEqual(getData(APIKEY, 'whatever'), null)
      assert.deepStrictEqual(getData(APIKEY, null), null)
      assert.deepStrictEqual(getData(APIKEY, undefined), null)
    })
  })

  describe('#getFilter', () => {
    it('returns a Set Object according filter name', () => {
      setFilter(APIKEY, 'MY-TEST', 'ABCDEF', 123)
      setFilter(APIKEY, 'MY-TEST', 'ABCDEF', 456)
      setFilter(APIKEY, 'MY-TEST', 'ABCDEF', 777)
      setFilter(APIKEY, 'MY-TEST', 'GHIJKL', 777)

      const expected = new Set().add('abcdef')
      const expectedMulti = new Set().add('abcdef').add('ghijkl')

      assert.deepStrictEqual(getFilter(APIKEY, 'MY-TEST', 123), expected)
      assert.deepStrictEqual(getFilter(APIKEY, 'MY-TEST', 456), expected)
      assert.deepStrictEqual(getFilter(APIKEY, 'MY-TEST', 777), expectedMulti)
    })

    it('returns null when there is no values associated to filter', () => {
      assert.deepStrictEqual(getFilter(APIKEY, 'MY-TEST', 123), null)
    })
  })

  describe('#getCollection', () => {
    it('returns the data collection associated with the APIKey', () => {
      setData(APIKEY, { id: 'abc' })
      setData(APIKEY, { id: 'efg' })
      setData(APIKEY, { id: 'olx' })

      const expected = {
        abc: { id: 'abc' },
        efg: { id: 'efg' },
        olx: { id: 'olx' }
      }

      assert.deepStrictEqual(getCollection(APIKEY), expected)
    })

    it('returns null when there is no collection associated with APIKey', () => {
      assert.strictEqual(getCollection('sei-la'), null)
    })

    it('throws an Error when the APIKey parameter is invalid', () => {
      assert.throws(() => getCollection(), Error)
      assert.throws(() => getCollection(''), Error)
      assert.throws(() => getCollection(undefined), Error)
      assert.throws(() => getCollection(null), Error)
      assert.throws(() => getCollection(0), Error)
      assert.throws(() => getCollection({}), Error)
      assert.throws(() => getCollection([]), Error)
      assert.throws(() => getCollection(true), Error)
    })
  })

  describe('#getCache', () => {
    it('returns an instance of LRUCache', () => {
      assert.strictEqual(getCache() instanceof LRUCache, true)
    })
  })
})
