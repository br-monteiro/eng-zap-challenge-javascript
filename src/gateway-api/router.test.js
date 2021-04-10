const bole = require('bole')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = require('assert')

const app = require('../index')
const { setData } = require('../storage')

bole.reset()

chai.use(chaiHttp)
chai.should()

describe('gateway-api - router', () => {
  beforeEach(() => {
    setData('zap', { id: '123' })
    setData('viva-real', { id: '123' })
  })

  describe('GET /api/v1/:apikey', () => {
    it('should returns HTTP 200 when the APIKey is equals to "viva-real"', (done) => {
      const expected = {
        pageNumber: 1,
        pageSize: 1,
        totalCount: 1,
        listings: [{ id: '123' }],
        status: 'success',
        message: ''
      }

      chai.request(app)
        .get('/api/v1/viva-real')
        .end((_, res) => {
          res.should.have.status('200')
          assert.deepStrictEqual(res.body, expected)
          done()
        })
    })

    it('should returns HTTP 200 when the APIKey is equals to "zap"', (done) => {
      const expected = {
        pageNumber: 1,
        pageSize: 1,
        totalCount: 1,
        listings: [{ id: '123' }],
        status: 'success',
        message: ''
      }

      chai.request(app)
        .get('/api/v1/zap')
        .end((_, res) => {
          res.should.have.status('200')
          assert.deepStrictEqual(res.body, expected)
          done()
        })
    })

    it('should returns HTTP 404 when the APIKey is invalid', (done) => {
      const expected = {
        status: 'error',
        message: 'results not found'
      }

      chai.request(app)
        .get('/api/v1/whatever')
        .end((_, res) => {
          res.should.have.status('404')
          assert.deepStrictEqual(res.body, expected)
          done()
        })
    })
  })
})
