require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const path = require('path')
const Fastify = require('fastify')

async function buildApp() {
  const app = Fastify({
    ajv: {
      customOptions: {
        formats: { email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ }
      }
    }
  })

  await app.register(require('@fastify/multipart'))
  await app.register(require('@fastify/formbody'))
  await app.register(require('@fastify/jwt'), {
    secret: 'test_secret_key_for_testing'
  })

  const authMiddleware = require('../src/middlewares/auth-middleware')
  app.decorate('authMiddleware', authMiddleware)

  const { userRoutes, adminRoutes, pesantrenRoutes, rekomendasiRoutes, pendaftaranRoutes, pemilikRoutes, publicRoutes, wilayahRoutes, compareRoutes } = require('../src/routes')

  app.get('/', async () => ({ message: 'Santri Connect API' }))
  app.get('/health', async () => ({ status: 'ok' }))

  await app.register(userRoutes)
  await app.register(adminRoutes)
  await app.register(pesantrenRoutes)
  await app.register(rekomendasiRoutes)
  await app.register(pendaftaranRoutes)
  await app.register(pemilikRoutes)
  await app.register(publicRoutes)
  await app.register(wilayahRoutes)
  await app.register(compareRoutes)

  return app
}

async function generateToken(payload) {
  const fastify = Fastify()
  await fastify.register(require('@fastify/jwt'), { secret: 'test_secret_key_for_testing' })
  return fastify.jwt.sign(payload)
}

module.exports = { buildApp, generateToken }
