const bole = require('bole')
const chai = require('chai')
const chaiHttp = require('chai-http')

const app = require('../index')

bole.reset()

chai.use(chaiHttp)
chai.should()

describe('gateway-api - router', () => {
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
          res.body.should.be.a('object')
          done()
        })
    })
  })
})
