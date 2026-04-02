const { registerUser, loginUser } = require('../services/user-service')

async function userRoutes(fastify, options) {
  fastify.post('/api/register', {
    schema: {
      body: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' }
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
          email: { type: 'string' },
          password: { type: 'string' }
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
}

module.exports = userRoutes
