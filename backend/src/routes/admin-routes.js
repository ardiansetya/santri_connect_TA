const { authMiddleware } = require('../middlewares/auth-middleware')
const { getDashboardStats } = require('../services/admin-service')

async function adminRoutes(fastify, options) {
  fastify.get('/api/admin/stats', {
    preHandler: authMiddleware
  }, async (request, reply) => {
    if (request.user.role !== 'superadmin') {
      return reply.code(403).send({ error: 'Akses ditolak, hanya superadmin' })
    }

    try {
      const stats = await getDashboardStats(fastify)
      return reply.code(200).send({ data: stats })
    } catch (err) {
      return reply.code(500).send({ error: 'Terjadi kesalahan pada server' })
    }
  })
}

module.exports = adminRoutes
