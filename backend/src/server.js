require('dotenv').config()
const path = require('path')
const fastify = require('fastify')({
  logger: process.env.NODE_ENV === 'production',
  ajv: {
    customOptions: {
      formats: { email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ }
    }
  }
})

async function start() {
   await fastify.register(require('@fastify/cors'), {
     origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization'],
     credentials: true
   })

   await fastify.register(require('@fastify/multipart'))
   await fastify.register(require('@fastify/formbody'))
   
   // Serve static uploads
   await fastify.register(require('@fastify/static'), {
     root: path.join(__dirname, '..', 'uploads'),
     prefix: '/uploads/', // optional: default '/'
   })
   
   await fastify.register(require('@fastify/jwt'), {
     secret: process.env.JWT_SECRET || 'santri_connect_secret_key'
   })

  await fastify.register(require('@fastify/swagger'), {
    mode: 'static',
    specification: {
      path: path.join(__dirname, '..', 'swagger.json'),
      postProcessor: function (swaggerObject) {
        return swaggerObject
      }
    }
  })

  await fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    },
    staticCSP: true,
    transformSpecificationClone: true
  })

  const authMiddleware = require('./middlewares/auth-middleware')
  fastify.decorate('authMiddleware', authMiddleware)

  const { userRoutes, adminRoutes, pesantrenRoutes, rekomendasiRoutes, pendaftaranRoutes, pemilikRoutes, publicRoutes, wilayahRoutes, compareRoutes } = require('./routes')

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
  await fastify.register(compareRoutes)

  try {
    await fastify.listen({ port: process.env.PORT || 3000 })
    console.log(`Server running at http://localhost:${process.env.PORT || 3000}`)
    console.log(`Swagger UI available at http://localhost:${process.env.PORT || 3000}/documentation`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
