require('dotenv').config()
const fastify = require('fastify')({
  logger: process.env.NODE_ENV === 'production',
  ajv: {
    customOptions: {
      formats: { email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ }
    }
  }
})

async function start() {
  await fastify.register(require('@fastify/multipart'))
  await fastify.register(require('@fastify/formbody'))
  await fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET || 'santri_connect_secret_key'
  })

  const authMiddleware = require('./middlewares/auth-middleware')
  fastify.decorate('authMiddleware', authMiddleware)

  const { userRoutes, adminRoutes, pesantrenRoutes, rekomendasiRoutes, pendaftaranRoutes, pemilikRoutes, publicRoutes, wilayahRoutes } = require('./routes')

  fastify.get('/', async () => ({ message: 'Santri Connect API' }))
  fastify.get('/health', async () => ({ status: 'ok' }))

  await fastify.register(userRoutes)
  await fastify.register(adminRoutes)
  await fastify.register(pesantrenRoutes)
  await fastify.register(rekomendasiRoutes)
  await fastify.register(pendaftaranRoutes)
  await fastify.register(pemilikRoutes)
  await fastify.register(publicRoutes)
  await fastify.register(wilayahRoutes)

  try {
    await fastify.listen({ port: process.env.PORT || 3000 })
    console.log(`Server running at http://localhost:${process.env.PORT || 3000}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
