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
      assert.strictEqual(undefined, utils.normalizeStr())
      assert.strictEqual('', utils.normalizeStr(''))
      assert.strictEqual(-1, utils.normalizeStr(-1))
      assert.strictEqual(true, utils.normalizeStr(true))
      assert.deepStrictEqual([], utils.normalizeStr([]))
      assert.deepStrictEqual({}, utils.normalizeStr({}))
    })
  })
})
