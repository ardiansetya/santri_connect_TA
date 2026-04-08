const fastify = require('fastify')()

async function test() {
  await fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET || 'santri_connect_secret_key'
  })

  const token = fastify.jwt.sign({ id: 6, role: 'pendaftar' })
  console.log(token)

  await fastify.close()
}

test().catch(console.error)
