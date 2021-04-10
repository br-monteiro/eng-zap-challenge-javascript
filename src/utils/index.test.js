const assert = require('assert')
const utils = require('./index')

describe('utils - index', () => {
  describe('#buildResponsePattern', () => {
    context('returns the object builded according parameters', () => {
      it('only status', () => {
        const expected = { status: 'success', message: '' }

        assert.deepStrictEqual(utils.buildResponsePattern('success'), expected)
      })

      it('with status and message', () => {
        const expected = { status: 'success', message: 'hello, OLX' }

        assert.deepStrictEqual(utils.buildResponsePattern('success', 'hello, OLX'), expected)
      })

      it('with status, message and data', () => {
        const expected = { status: 'success', message: 'hello, OLX', desapega: true }

        assert.deepStrictEqual(utils.buildResponsePattern('success', 'hello, OLX', { desapega: true }), expected)
      })

      it('with status, message and complex data', () => {
        const expected = { status: 'error', message: 'hello, OLX', desapega: true, test: 'ok' }
        const data = {
          desapega: true,
          status: 'success',
          message: 'false',
          test: 'ok'
        }

        assert.deepStrictEqual(utils.buildResponsePattern('error', 'hello, OLX', data), expected)
      })
    })

    context('throws an Error with invalid status parameter', () => {
      it('invalid status', () => {
        assert.throws(() => utils.buildResponsePattern('whatever'), Error)
      })
    })
  })

  describe('#normalizeStr', () => {
    it('returns the string as lower case and without spaces at init or end', () => {
      assert.strictEqual('desapega, desapega... olx!', utils.normalizeStr('  Desapega, Desapega... OLX!  '))
      assert.strictEqual('abc', utils.normalizeStr('   ABC    '))
    })

    it('returns the same value when it is not a valid string', () => {
      assert.strictEqual(utils.normalizeStr(), undefined)
      assert.strictEqual(utils.normalizeStr(''), '')
      assert.strictEqual(utils.normalizeStr(-1), -1)
      assert.strictEqual(utils.normalizeStr(true), true)
      assert.deepStrictEqual(utils.normalizeStr([]), [])
      assert.deepStrictEqual(utils.normalizeStr({}), {})
    })
  })

  describe('#jsonParse', () => {
    it('returns the object parsed from JSON string', () => {
      const str = '{"test": true, "other": 123, "n": 1.5}'
      const expected = {
        test: true,
        other: 123,
        n: 1.5
      }

      assert.deepStrictEqual(utils.jsonParse(str), expected)
    })

    it('returns the fallback value when the JSON string is invalid', () => {
      const str = '{test: true}'

      assert.deepStrictEqual(utils.jsonParse(str), undefined)
      assert.deepStrictEqual(utils.jsonParse(str, { fallback: true }), { fallback: true })
      assert.deepStrictEqual(utils.jsonParse(str, true), true)
      assert.deepStrictEqual(utils.jsonParse(str, 123), 123)
    })

    it('returns the fallback when the value is not a valid string', () => {
      assert.deepStrictEqual(utils.jsonParse(null), undefined)
      assert.deepStrictEqual(utils.jsonParse('', { fallback: true }), { fallback: true })
      assert.deepStrictEqual(utils.jsonParse(undefined, { fallback: true }), { fallback: true })
      assert.deepStrictEqual(utils.jsonParse({}, { fallback: true }), { fallback: true })
      assert.deepStrictEqual(utils.jsonParse([], { fallback: true }), { fallback: true })
    })
  })

  describe('#intersection', () => {
    it('returns the intersection with the set A and the set B', () => {
      const setA = new Set().add('a').add('b').add('c')
      const setB = new Set().add('b').add('c').add('d')
      const expected = new Set().add('b').add('c')

      assert.deepStrictEqual(utils.intersection(setA, setB), expected)
    })

    it('returns the intersection with the set A and the set B when both the sets have the same values', () => {
      const setA = new Set().add('a').add('b').add('c')
      const setB = new Set().add('a').add('b').add('c')
      const expected = new Set().add('a').add('b').add('c')

      assert.deepStrictEqual(utils.intersection(setA, setB), expected)
    })

    it('returns a empty set when there is no intersection', () => {
      const setA = new Set().add('a').add('b').add('c')
      const setB = new Set().add('d').add('e').add('f')
      const expected = new Set()

      assert.deepStrictEqual(utils.intersection(setA, setB), expected)
      assert.deepStrictEqual(utils.intersection(new Set(), setB), expected)
    })
  })

  describe('#chunkArray', () => {
    it('split an array in chunk with the same size', () => {
      const arr = [1, 2, 3, 4, 5, 6]
      const expected = [
        [1, 2],
        [3, 4],
        [5, 6]
      ]

      assert.deepStrictEqual(utils.chunkArray(arr, 2), expected)
    })

    it('split an array with the last chunk with the rest of items', () => {
      const arr = [1, 2, 3, 4, 5, 6]
      const expected = [
        [1, 2, 3, 4],
        [5, 6]
      ]

      assert.deepStrictEqual(utils.chunkArray(arr, 4), expected)
    })

    it('split an array in chunk with the same size until the part informed as parameter', () => {
      const arr = [1, 2, 3, 4, 5, 6]
      const expected = [
        [1, 2],
        [3, 4]
      ]

      assert.deepStrictEqual(utils.chunkArray(arr, 2, 2), expected)
      assert.deepStrictEqual(utils.chunkArray(arr, 2, 1), [[1, 2]])
    })

    it('throws an Error when the value informed to splited is not an Array', () => {
      assert.throws(() => utils.chunkArray(), Error)
      assert.throws(() => utils.chunkArray({}, 2), Error)
      assert.throws(() => utils.chunkArray(null, 2), Error)
    })

    it('throws an Error when the chunk size informed is not an integer more than zero', () => {
      assert.throws(() => utils.chunkArray([]), Error)
      assert.throws(() => utils.chunkArray([], 0), Error)
      assert.throws(() => utils.chunkArray([], Infinity), Error)
      assert.throws(() => utils.chunkArray([], null), Error)
    })

    it('throws an Error when the "untilPart" informed is not an integer more than zero', () => {
      assert.throws(() => utils.chunkArray([], 2, true), Error)
      assert.throws(() => utils.chunkArray([], 2, Infinity), Error)
      assert.throws(() => utils.chunkArray([], 2, '1'), Error)
    })
  })

  describe('#buildPaginationSettings', () => {
    let mockRequest = {}

    beforeEach(() => {
      mockRequest = {
        query: {
          page: 7,
          perPage: 25
        }
      }
    })

    it('returns the PaginationSettings according Request Object', () => {
      const expected = {
        page: 7,
        perPage: 25
      }

      assert.deepStrictEqual(utils.buildPaginationSettings(mockRequest), expected)
    })

    it('returns the PaginationSettings with the last occurrence of the value', () => {
      const expected = {
        page: 10,
        perPage: 77
      }

      mockRequest.query.page = [1, 2, 3, 10]
      mockRequest.query.perPage = [1, 2, 3, 77]

      assert.deepStrictEqual(utils.buildPaginationSettings(mockRequest), expected)
    })

    it('returns the PaginationSettings with default values when there is no Retest Object', () => {
      const expected = {
        page: 1,
        perPage: 50
      }

      assert.deepStrictEqual(utils.buildPaginationSettings(), expected)
      assert.deepStrictEqual(utils.buildPaginationSettings({}), expected)
    })
  })
})
