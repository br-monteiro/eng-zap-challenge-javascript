const assert = require('assert')
const bole = require('bole')

const LRUCache = require('./lru-cache')

bole.reset()

describe('lru-cache - lru-cache', () => {
  /**
   * @type { LRUCache }
   */
  let cache

  beforeEach(() => {
    cache = new LRUCache(2)
  })

  context('io operations', () => {
    it("returns size 0 when there's no data on cache", () => {
      assert.strictEqual(0, cache.size)
    })

    it('returns the value inserted into cache', () => {
      cache.put('one', 1)
      assert.strictEqual(1, cache.get('one'))
      assert.strictEqual(1, cache.size)
    })

    it("returns null if the key there's no associated value", () => {
      cache.put('one', 1)
      assert.strictEqual(null, cache.get('other'))
      assert.strictEqual(1, cache.size)
    })

    it('remove the least recently used', () => {
      cache.put('one', 1)
      cache.put('two', 2)
      cache.put('three', 3)

      assert.strictEqual(null, cache.get('one'))
      assert.strictEqual(2, cache.get('two'))
      assert.strictEqual(3, cache.get('three'))
      assert.strictEqual(2, cache.size)
    })

    it('updates a value of an existing key', () => {
      cache.put('one', 1)
      cache.put('two', 2)

      assert.strictEqual(1, cache.get('one'))
      assert.strictEqual(2, cache.get('two'))
      assert.strictEqual(2, cache.size)

      cache.put('one', 1.77)

      assert.strictEqual(1.77, cache.get('one'))
      assert.strictEqual(2, cache.get('two'))
      assert.strictEqual(2, cache.size)
    })
  })

  context('constructor', () => {
    describe('throws an Error when try to instantiates an LRU Cache without valid capacity', () => {
      it('without parameter', () => {
        assert.throws(() => new LRUCache(), Error)
      })

      it('parameter is not a integer more than zero', () => {
        assert.throws(() => new LRUCache(1.5), Error)
        assert.throws(() => new LRUCache(null), Error)
        assert.throws(() => new LRUCache(false), Error)
        assert.throws(() => new LRUCache(true), Error)
        assert.throws(() => new LRUCache(undefined), Error)
        assert.throws(() => new LRUCache({}), Error)
        assert.throws(() => new LRUCache([]), Error)
        assert.throws(() => new LRUCache(0), Error)
      })
    })
  })

  context('put new values', () => {
    it('throws an Error when try to save a data with key null', () => {
      assert.throws(() => cache.put(null, 0), Error)
    })

    it('throws an Error when try to save a data with key undefined', () => {
      assert.throws(() => cache.put(undefined, 0), Error)
    })

    it('throws an Error when try to save a null value', () => {
      assert.throws(() => cache.put(0, null), Error)
    })

    it('throws an Error when try to save an undefined value', () => {
      assert.throws(() => cache.put(0, undefined), Error)
    })
  })

  context('remotion', () => {
    it('throws an Error when try to remove a data with key null', () => {
      assert.throws(() => cache.remove(null), Error)
    })

    it('throws an Error when try to remove a data with key undefined', () => {
      assert.throws(() => cache.remove(undefined), Error)
    })

    it('remove a value from cache and returns true', () => {
      cache.put('one', 1)
      cache.put('two', 2)

      assert.strictEqual(2, cache.size)
      assert.strictEqual(true, cache.remove('one'))
      assert.strictEqual(null, cache.get('one'))
      assert.strictEqual(2, cache.get('two'))
      assert.strictEqual(1, cache.size)

      assert.strictEqual(true, cache.remove('two'))
      assert.strictEqual(null, cache.get('two'))
      assert.strictEqual(0, cache.size)
    })

    it('try to remove a nonexistent value from cache and returns false', () => {
      cache.put('one', 1)

      assert.strictEqual(1, cache.size)
      assert.strictEqual(false, cache.remove('two'))
      assert.strictEqual(null, cache.get('two'))
      assert.strictEqual(1, cache.size)
    })

    it('remove all values from cache and returns true', () => {
      cache.put('one', 1)
      cache.put('two', 2)

      assert.strictEqual(2, cache.size)
      assert.strictEqual(true, cache.removeAll())
      assert.strictEqual(null, cache.get('one'))
      assert.strictEqual(null, cache.get('two'))
      assert.strictEqual(0, cache.size)
    })

    it('try to remove all values from an empty cache and returns false', () => {
      assert.strictEqual(0, cache.size)
      assert.strictEqual(false, cache.removeAll())
      assert.strictEqual(null, cache.get('one'))
      assert.strictEqual(null, cache.get('two'))
      assert.strictEqual(0, cache.size)
    })
  })
})
