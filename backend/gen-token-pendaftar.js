const fastify = require('fastify')()

async function test() {
  await fastify.register(require('@fastify/jwt'), {
    secret: 'santo_connect_secret_key_2024'
  })

  const tokenPendaftar = fastify.jwt.sign({ id: 4, role: 'pendaftar' })
  console.log(tokenPendaftar)

  await fastify.close()
}

test().catch(console.error)
