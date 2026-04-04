const { buildApp, generateToken } = require('./helper')

describe('Public API', () => {
  let app

  beforeAll(async () => {
    app = await buildApp()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /api/public/stats', () => {
    it('should return public stats without auth', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/public/stats'
      })

      expect(response.statusCode).toBe(200)
      expect(response.json()).toHaveProperty('data')
      expect(response.json().data).toHaveProperty('total_pesantren')
      expect(response.json().data).toHaveProperty('total_provinsi')
      expect(response.json().data).toHaveProperty('total_kota')
    })
  })

  describe('GET /api/wilayah/provinces', () => {
    it('should return provinces without auth', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/wilayah/provinces'
      })

      expect(response.statusCode).toBe(200)
      expect(response.json()).toHaveProperty('data')
      expect(Array.isArray(response.json().data)).toBe(true)
    })
  })

  describe('GET /api/wilayah/regencies/:provinceId', () => {
    it('should return regencies without auth', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/wilayah/regencies/32'
      })

      expect(response.statusCode).toBe(200)
      expect(response.json()).toHaveProperty('data')
    })
  })
})
