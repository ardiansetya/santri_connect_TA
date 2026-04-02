const { getPesantrenDetail, getPesastrichtList } = require('../services/pesantren-service')

async function pesatrenRoutes(fastify, options) {
  fastify.get('/api/pesantren', async (request, reply) => {
    try {
      const result = await getPesastrichtList(fastify, request.query)
      return reply.code(200).send({ success: true, data: result.data, meta: result.meta })
    } catch (err) {
      return reply.code(500).send({ success: false, error: 'Terjadi kesalahan pada server' })
    }
  })

  fastify.get('/api/pesantren/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer' }
        },
        required: ['id']
      }
    }
  }, async (request, reply) => {
    const id = parseInt(request.params.id, 10)

    try {
      const pesatren = await getPesantrenDetail(fastify, id)
      return reply.code(200).send({ success: true, data: pesatren })
    } catch (err) {
      return reply.code(404).send({ success: false, error: 'Pesantren tidak ditemukan' })
    }
  })
}

module.exports = pesatrenRoutes
