const PublicService = require('../services/public-service')

const publicRoutes = async (fastify) => {
  fastify.get('/api/public/stats', async (request, reply) => {
    try {
      const data = await PublicService.getStats()
      return reply.code(200).send({ success: true, data })
    } catch {
      return reply.code(500).send({ success: false, error: 'Terjadi kesalahan pada server' })
    }
  })
}

module.exports = publicRoutes
