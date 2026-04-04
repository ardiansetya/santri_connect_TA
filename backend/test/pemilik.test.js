const { buildApp, generateToken } = require('./helper')

describe('Pemilik API', () => {
  let app
  let pemilikToken
  let pendaftarToken

  beforeAll(async () => {
    app = await buildApp()
    pemilikToken = await generateToken({ id: 2, role: 'pemilik' })
    pendaftarToken = await generateToken({ id: 3, role: 'pendaftar' })
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /api/pemilik/pesantren', () => {
    it('should return pesantren list for pemilik', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/pemilik/pesantren',
        headers: { Authorization: `Bearer ${pemilikToken}` }
      })

      expect(response.statusCode).toBe(200)
      expect(response.json()).toHaveProperty('data')
    })

    it('should reject non-pemilik', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/pemilik/pesantren',
        headers: { Authorization: `Bearer ${pendaftarToken}` }
      })

      expect(response.statusCode).toBe(403)
    })

    it('should reject without token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/pemilik/pesantren'
      })

      expect(response.statusCode).toBe(401)
    })
  })

  describe('POST /api/pemilik/pesantren', () => {
    it('should create pesantren for pemilik', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/pemilik/pesantren',
        headers: { Authorization: `Bearer ${pemilikToken}` },
        payload: {
          nama: 'Pemilik Pesantren Test',
          province: 'JAWA TENGAH',
          kota: 'KOTA SEMARANG',
          kurikulum: 'modern'
        }
      })

      expect(response.statusCode).toBe(201)
      expect(response.json()).toHaveProperty('message')
    })

    it('should reject invalid province', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/pemilik/pesantren',
        headers: { Authorization: `Bearer ${pemilikToken}` },
        payload: {
          nama: 'Invalid Province',
          province: 'InvalidProvince',
          kota: 'Semarang',
          kurikulum: 'modern'
        }
      })

      expect(response.statusCode).toBe(400)
    })

    it('should reject missing required fields', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/pemilik/pesantren',
        headers: { Authorization: `Bearer ${pemilikToken}` },
        payload: {
          province: 'JAWA TENGAH',
          kota: 'Semarang'
        }
      })

      expect(response.statusCode).toBe(400)
    })

    it('should reject non-pemilik', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/pemilik/pesantren',
        headers: { Authorization: `Bearer ${pendaftarToken}` },
        payload: {
          nama: 'Should Fail',
          province: 'JAWA TENGAH',
          kota: 'KOTA SEMARANG'
        }
      })

      expect(response.statusCode).toBe(403)
    })
  })

  describe('PUT /api/pemilik/pesantren/:id', () => {
    it('should reject non-pemilik', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: '/api/pemilik/pesantren/1',
        headers: { Authorization: `Bearer ${pendaftarToken}` },
        payload: {
          nama: 'Updated',
          province: 'JAWA TENGAH',
          kota: 'KOTA SEMARANG'
        }
      })

      expect(response.statusCode).toBe(403)
    })
  })
})
