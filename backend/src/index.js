require('dotenv').config()
const fastify = require('fastify')({ 
  logger: true,
  ajv: {
    customOptions: {
      formats: {
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      }
    }
  }
})

async function start() {
  await fastify.register(require('@fastify/formbody'))
  await fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET || 'santri_connect_secret_key'
  })
  await fastify.register(require('./plugins/mysql'))
  fastify.register(require('./routes/root'))
  fastify.register(require('./routes/user-routes'))
  fastify.register(require('./routes/pesantren-routes'))
  fastify.register(require('./routes/rekomendasi-routes'))

  try {
    await fastify.listen({ port: 3000 })
    console.log('Server running at http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
