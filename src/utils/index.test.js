const assert = require('assert')
const utils = require('./index')

describe.only('utils - index', () => {
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
})
