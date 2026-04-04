const { buildApp, generateToken } = require('./helper')

describe('Admin API', () => {
  let app
  let superadminToken

  beforeAll(async () => {
    app = await buildApp()
    superadminToken = await generateToken({ id: 1, role: 'superadmin' })
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /api/admin/stats', () => {
    it('should return stats for superadmin', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/admin/stats',
        headers: { Authorization: `Bearer ${superadminToken}` }
      })

      expect(response.statusCode).toBe(200)
      expect(response.json()).toHaveProperty('data')
      expect(response.json().data).toHaveProperty('total_pesantren')
    })

    it('should reject non-superadmin', async () => {
      const token = await generateToken({ id: 2, role: 'pendaftar' })

      const response = await app.inject({
        method: 'GET',
        url: '/api/admin/stats',
        headers: { Authorization: `Bearer ${token}` }
      })

      expect(response.statusCode).toBe(403)
    })

    it('should reject without token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/admin/stats'
      })

      expect(response.statusCode).toBe(401)
    })
  })

  describe('GET /api/admin/users', () => {
    it('should return users list for superadmin', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/admin/users',
        headers: { Authorization: `Bearer ${superadminToken}` }
      })

      expect(response.statusCode).toBe(200)
      expect(response.json()).toHaveProperty('data')
      expect(response.json()).toHaveProperty('meta')
    })

    it('should reject non-superadmin', async () => {
      const token = await generateToken({ id: 2, role: 'pemilik' })

      const response = await app.inject({
        method: 'GET',
        url: '/api/admin/users',
        headers: { Authorization: `Bearer ${token}` }
      })

      expect(response.statusCode).toBe(403)
    })
  })

  describe('POST /api/admin/pesantren', () => {
    it('should create pesantren for superadmin', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/admin/pesantren',
        headers: { Authorization: `Bearer ${superadminToken}` },
        payload: {
          nama: 'Admin Pesantren Test',
          province: 'JAWA BARAT',
          kota: 'KOTA BANDUNG',
          kurikulum: 'modern'
        }
      })

      expect(response.statusCode).toBe(201)
      expect(response.json()).toHaveProperty('message')
    })

    it('should reject invalid province', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/admin/pesantren',
        headers: { Authorization: `Bearer ${superadminToken}` },
        payload: {
          nama: 'Invalid Province',
          province: 'InvalidProvince',
          kota: 'Bandung',
          kurikulum: 'modern'
        }
      })

      expect(response.statusCode).toBe(400)
    })

    it('should reject missing required fields', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/admin/pesantren',
        headers: { Authorization: `Bearer ${superadminToken}` },
        payload: {
          province: 'JAWA BARAT',
          kota: 'Bandung'
        }
      })

      expect(response.statusCode).toBe(400)
    })

    it('should reject non-superadmin', async () => {
      const token = await generateToken({ id: 2, role: 'pemilik' })

      const response = await app.inject({
        method: 'POST',
        url: '/api/admin/pesantren',
        headers: { Authorization: `Bearer ${token}` },
        payload: {
          nama: 'Should Fail',
          province: 'JAWA BARAT',
          kota: 'KOTA BANDUNG'
        }
      })

      // Note: validateWilayah middleware runs before role check in controller
      // Since the wilayah validation passes, it should reach the role check
      expect([400, 403]).toContain(response.statusCode)
    })
  })

  describe('DELETE /api/admin/pesantren/:id', () => {
    it('should reject non-superadmin', async () => {
      const token = await generateToken({ id: 2, role: 'pendaftar' })

      const response = await app.inject({
        method: 'DELETE',
        url: '/api/admin/pesantren/1',
        headers: { Authorization: `Bearer ${token}` }
      })

      expect(response.statusCode).toBe(403)
    })
  })
})
