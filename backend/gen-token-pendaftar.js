const fastify = require('fastify')()

async function test() {
  await fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET || 'santri_connect_secret_key'
  })

  const tokenPendaftar = fastify.jwt.sign({ id: 4, role: 'pendaftar' })
  console.log(tokenPendaftar)

  await fastify.close()
}

test().catch(console.error)
