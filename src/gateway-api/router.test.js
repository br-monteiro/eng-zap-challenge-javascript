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
    it('shoud returns HTTP 200 when the APIKey is equals to "viva-real"', (done) => {
      chai.request(app)
        .get('/api/v1/viva-real')
        .end((_, res) => {
          res.should.have.status('200')
          done()
        })
    })

    it('shoud returns HTTP 200 when the APIKey is equals to "zap"', (done) => {
      chai.request(app)
        .get('/api/v1/zap')
        .end((_, res) => {
          res.should.have.status('200')
          done()
        })
    })

    it('shoud returns HTTP 404 when the APIKey is invalid', (done) => {
      chai.request(app)
        .get('/api/v1/whatever')
        .end((_, res) => {
          res.should.have.status('404')

          const expected = { status: 'error', message: 'APIKey not found' }
          assert.deepStrictEqual(res.body, expected)
          done()
        })
    })
  })
})
