const bole = require('bole')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = require('assert')

const app = require('../index')
const { setData, setFilter } = require('../storage')

bole.reset()

chai.use(chaiHttp)
chai.should()

describe('gateway-api - router', () => {
  beforeEach(() => {
    setData('htr', { id: '123' })
    setData('edinho', { id: '123' })
    setFilter('htr', 'area', '123', '77')
  })

  describe('GET /api/v1/:apikey', () => {
    it('should returns HTTP 200 when the APIKey is equals to "edinho"', (done) => {
      const expected = {
        pageNumber: 1,
        pageSize: 1,
        totalCount: 1,
        listings: [{ id: '123' }],
        status: 'success',
        message: ''
      }

      chai.request(app)
        .get('/api/v1/edinho')
        .end((_, res) => {
          res.should.have.status('200')
          assert.deepStrictEqual(res.body, expected)
          done()
        })
    })

    it('should returns HTTP 200 when the APIKey is equals to "htr"', (done) => {
      const expected = {
        pageNumber: 1,
        pageSize: 1,
        totalCount: 1,
        listings: [{ id: '123' }],
        status: 'success',
        message: ''
      }

      chai.request(app)
        .get('/api/v1/htr')
        .end((_, res) => {
          res.should.have.status('200')
          assert.deepStrictEqual(res.body, expected)
          done()
        })
    })

    it('should returns HTTP 200 when apply filters', (done) => {
      const expected = {
        pageNumber: 1,
        pageSize: 1,
        totalCount: 1,
        listings: [{ id: '123' }],
        status: 'success',
        message: ''
      }

      chai.request(app)
        .get('/api/v1/htr?filter[area]=77')
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

    it('should returns HTTP 404 when there is no results with filters', (done) => {
      const expected = {
        status: 'error',
        message: 'results not found'
      }

      chai.request(app)
        .get('/api/v1/htr?filter[acb]=123')
        .end((_, res) => {
          res.should.have.status('404')
          assert.deepStrictEqual(res.body, expected)
          done()
        })
    })
  })

  describe('POST /api/v1/load', () => {
    it('returns HTTP 200 when the Request body is according of JSON Schema', (done) => {
      const regexBody = /^queue started at \w{3}\s\w{3}\s\d{2}\s\d{4}\s(\d{2}(:|\s))+\w+.\d+\s\([\w\sÀ-ú]+\)$/

      chai.request(app)
        .post('/api/v1/load')
        .send({
          sourceUrl: 'http://localhost/souce'
        })
        .end((_, res) => {
          res.should.have.status('200')
          assert.strictEqual(true, regexBody.test(res.body.message))
          assert.strictEqual(res.body.status, 'success')
          done()
        })
    })

    it('returns HTTP 400 when the Request body is not according of JSON Schema', (done) => {
      const expected = {
        status: 'error',
        message: 'schema violation',
        errors: [{
          instancePath: '',
          schemaPath: '#/required',
          keyword: 'required',
          params: {
            missingProperty: 'sourceUrl'
          },
          message: "must have required property 'sourceUrl'"
        }]
      }

      chai.request(app)
        .post('/api/v1/load')
        .end((_, res) => {
          res.should.have.status('400')
          assert.deepStrictEqual(res.body, expected)
          done()
        })
    })
  })
})
