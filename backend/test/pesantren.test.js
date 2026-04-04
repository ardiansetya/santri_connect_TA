const { buildApp, generateToken } = require('./helper')

describe('Pesantren API', () => {
  let app

  beforeAll(async () => {
    app = await buildApp()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /api/pesantren', () => {
    it('should return list of pesantren', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/pesantren'
      })

      expect(response.statusCode).toBe(200)
      expect(response.json()).toHaveProperty('data')
      expect(response.json()).toHaveProperty('meta')
    })

    it('should support pagination', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/pesantren?page=1&limit=5'
      })

      expect(response.statusCode).toBe(200)
      expect(response.json().meta).toHaveProperty('page', 1)
      expect(response.json().meta).toHaveProperty('limit', 5)
    })

    it('should support filtering by province', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/pesantren?provinsi=JAWA TENGAH'
      })

      expect(response.statusCode).toBe(200)
      expect(response.json()).toHaveProperty('data')
    })
  })

  describe('GET /api/pesantren/:id', () => {
    it('should return pesantren detail', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/pesantren/1'
      })

      expect(response.statusCode).toBe(200)
      expect(response.json().data).toHaveProperty('id', 1)
      expect(response.json().data).toHaveProperty('nama')
    })

    it('should return 404 for non-existent pesantren', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/pesantren/999999'
      })

      expect(response.statusCode).toBe(404)
      expect(response.json().error).toBe('Pesantren tidak ditemukan')
    })
  })

  describe('GET /api/pesantren/:id/pendaftaran-info', () => {
    it('should return pendaftaran info', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/pesantren/1/pendaftaran-info'
      })

      expect(response.statusCode).toBe(200)
      expect(response.json().data).toHaveProperty('pesantren_id')
      expect(response.json().data).toHaveProperty('rekening')
    })

    it('should return 404 for non-existent pesantren', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/pesantren/999999/pendaftaran-info'
      })

      expect(response.statusCode).toBe(404)
    })
  })
})
