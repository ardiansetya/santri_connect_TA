const { registerUser } = require('../services/user-service')

async function userRoutes(fastify, options) {
  fastify.post('/api/register', async (request, reply) => {
    const { username, email, password } = request.body

    if (!username || !email || !password) {
      return reply.code(400).send({ error: 'Registrasi gagal' })
    }

    try {
      await registerUser(fastify, username, email, password)
      return reply.code(201).send({ data: 'Registrasi berhasil' })
    } catch (err) {
      return reply.code(400).send({ error: 'Registrasi gagal' })
    }
  })
}

module.exports = userRoutes
