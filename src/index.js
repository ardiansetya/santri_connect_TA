require('dotenv').config()
const fastify = require('fastify')({ logger: true })
const mysqlPlugin = require('./plugins/mysql')
const rootRoutes = require('./routes/root')

fastify.register(mysqlPlugin)
fastify.register(rootRoutes)

const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
    console.log('Server running at http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
