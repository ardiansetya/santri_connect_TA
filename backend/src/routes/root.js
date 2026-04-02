async function routes(fastify, options) {
  fastify.get('/', async (request, reply) => {
    return { message: 'Hello World!' }
  })

  fastify.get('/health', async (request, reply) => {
    return { status: 'ok' }
  })
}

module.exports = routes
