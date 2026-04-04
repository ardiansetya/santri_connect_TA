const { buildApp, generateToken } = require('./helper')

describe('Authentication API', () => {
  let app

  beforeAll(async () => {
    app = await buildApp()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST /api/register', () => {
    it('should register successfully', async () => {
      const uniqueEmail = `test_${Date.now()}@example.com`
      const response = await app.inject({
        method: 'POST',
        url: '/api/register',
        payload: {
          username: 'testuser',
          email: uniqueEmail,
          password: 'password123'
        }
      })

      expect(response.statusCode).toBe(201)
      expect(response.json().data).toBe('Registrasi berhasil')
    })

    it('should reject duplicate email', async () => {
      const uniqueEmail = `dup_${Date.now()}@example.com`
      await app.inject({
        method: 'POST',
        url: '/api/register',
        payload: { username: 'user1', email: uniqueEmail, password: 'password123' }
      })

      const response = await app.inject({
        method: 'POST',
        url: '/api/register',
        payload: { username: 'user2', email: uniqueEmail, password: 'password123' }
      })

      expect(response.statusCode).toBe(400)
      expect(response.json().error).toBe('Registrasi gagal')
    })

    it('should reject invalid email format', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/register',
        payload: {
          username: 'testuser',
          email: 'invalid-email',
          password: 'password123'
        }
      })

      expect(response.statusCode).toBe(400)
    })

    it('should reject short password', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/register',
        payload: {
          username: 'testuser',
          email: 'short@example.com',
          password: '123'
        }
      })

      expect(response.statusCode).toBe(400)
    })
  })

  describe('POST /api/login', () => {
    it('should login successfully', async () => {
      const uniqueEmail = `login_${Date.now()}@example.com`
      await app.inject({
        method: 'POST',
        url: '/api/register',
        payload: { username: 'loginuser', email: uniqueEmail, password: 'password123' }
      })

      const response = await app.inject({
        method: 'POST',
        url: '/api/login',
        payload: { email: uniqueEmail, password: 'password123' }
      })

      expect(response.statusCode).toBe(200)
      expect(response.json().data).toHaveProperty('token')
      expect(response.json().data).toHaveProperty('user')
    })

    it('should reject wrong password', async () => {
      const uniqueEmail = `wrong_${Date.now()}@example.com`
      await app.inject({
        method: 'POST',
        url: '/api/register',
        payload: { username: 'wrongpw', email: uniqueEmail, password: 'correct123' }
      })

      const response = await app.inject({
        method: 'POST',
        url: '/api/login',
        payload: { email: uniqueEmail, password: 'wrongpassword' }
      })

      expect(response.statusCode).toBe(401)
      expect(response.json().error).toBe('Email atau password salah')
    })

    it('should reject non-existent email', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/login',
        payload: {
          email: 'nonexistent@example.com',
          password: 'password123'
        }
      })

      expect(response.statusCode).toBe(401)
    })
  })

  describe('GET /api/me', () => {
    it('should return user data with valid token', async () => {
      const token = await generateToken({ id: 1, role: 'pendaftar' })

      const response = await app.inject({
        method: 'GET',
        url: '/api/me',
        headers: { Authorization: `Bearer ${token}` }
      })

      expect(response.statusCode).toBe(200)
      expect(response.json()).toHaveProperty('data')
    })

    it('should reject without token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/me'
      })

      expect(response.statusCode).toBe(401)
    })

    it('should reject with invalid token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/me',
        headers: { Authorization: 'Bearer invalidtoken' }
      })

      expect(response.statusCode).toBe(401)
    })
  })

  describe('POST /api/logout', () => {
    it('should logout successfully', async () => {
      const token = await generateToken({ id: 1, role: 'pendaftar' })

      const response = await app.inject({
        method: 'POST',
        url: '/api/logout',
        headers: { Authorization: `Bearer ${token}` }
      })

      expect(response.statusCode).toBe(200)
      expect(response.json().data).toBe('Logout berhasil')
    })

    it('should reject without token', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/logout'
      })

      expect(response.statusCode).toBe(401)
    })
  })
})
