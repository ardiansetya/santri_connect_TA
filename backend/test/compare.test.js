const { buildApp, generateToken } = require('./helper')

describe('Compare API', () => {
  let app

  beforeAll(async () => {
    app = await buildApp()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST /api/compare', () => {
    it('should compare pesantren successfully', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/compare',
        payload: { pesantren_ids: [1, 2] }
      })

      expect(response.statusCode).toBe(200)
      expect(response.json()).toHaveProperty('data')
      expect(Array.isArray(response.json().data)).toBe(true)
    })

    it('should reject more than 3 pesantren', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/compare',
        payload: { pesantren_ids: [1, 2, 3, 4] }
      })

      expect(response.statusCode).toBe(400)
    })

    it('should reject empty array', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/compare',
        payload: { pesantren_ids: [] }
      })

      expect(response.statusCode).toBe(400)
    })

    it('should reject non-existent IDs', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/compare',
        payload: { pesantren_ids: [999999] }
      })

      expect(response.statusCode).toBe(400)
    })
  })
})
