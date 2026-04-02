const { registerUser, loginUser, getCurrentUser, updateUserData } = require('../services/user-service')
const { authMiddleware } = require('../middlewares/auth-middleware')

async function userRoutes(fastify, options) {
  fastify.post('/api/register', {
    schema: {
      body: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string', minLength: 1 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 }
        }
      }
    }
  }, async (request, reply) => {
    const { username, email, password } = request.body

    try {
      await registerUser(fastify, username, email, password)
      return reply.code(201).send({ data: 'Registrasi berhasil' })
    } catch (err) {
      return reply.code(400).send({ error: 'Registrasi gagal' })
    }
  })

  fastify.post('/api/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 1 }
        }
      }
    }
  }, async (request, reply) => {
    const { email, password } = request.body

    try {
      const result = await loginUser(fastify, email, password)
      return reply.code(200).send({ data: result })
    } catch (err) {
      return reply.code(401).send({ error: 'Email atau password salah' })
    }
  })

  fastify.get('/api/me', {
    preHandler: authMiddleware
  }, async (request, reply) => {
    try {
      const user = await getCurrentUser(fastify, request.user.id)
      return reply.code(200).send({ data: user })
    } catch (err) {
      if (err.message === 'Data user tidak ditemukan') {
        return reply.code(404).send({ error: 'Data user tidak ditemukan' })
      }
      return reply.code(500).send({ error: 'Terjadi kesalahan' })
    }
  })

  fastify.post('/api/logout', {
    preHandler: authMiddleware
  }, async (request, reply) => {
    return reply.code(200).send({ data: 'Logout berhasil' })
  })

  fastify.put('/api/me', {
    preHandler: authMiddleware,
    schema: {
      body: {
        type: 'object',
        required: ['username', 'email'],
        properties: {
          username: { type: 'string', minLength: 1 },
          email: { type: 'string', format: 'email' }
        },
        additionalProperties: false
      }
    }
  }, async (request, reply) => {
    try {
      const user = await updateUserData(fastify, request.user.id, request.body)
      return reply.code(200).send({ data: { message: 'Update data berhasil', user } })
    } catch (err) {
      return reply.code(400).send({ error: err.message })
    }
  })
}

module.exports = userRoutes
