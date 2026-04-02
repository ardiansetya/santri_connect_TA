const { getpesantrenDetail, getpesantrenList } = require('../services/pesantren-service')

async function pesatrenRoutes(fastify, options) {
  fastify.get('/api/pesantren', async (request, reply) => {
    try {
      const result = await getpesantrenList(fastify, request.query)
      return reply.code(200).send({ success: true, data: result.data, meta: result.meta })
    } catch (err) {
      console.error('List error:', err.message)
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
      const pesatren = await getpesantrenDetail(fastify, id)
      return reply.code(200).send({ success: true, data: pesatren })
    } catch (err) {
      console.error('Detail error:', err.message)
      return reply.code(404).send({ success: false, error: 'pesantren tidak ditemukan' })
    }
  })
}

module.exports = pesatrenRoutes
