const fastify = require('fastify')()

async function test() {
  await fastify.register(require('@fastify/jwt'), {
    secret: 'santo_connect_secret_key_2024'
  })

  const token = fastify.jwt.sign({ id: 3, role: 'superadmin' })
  console.log(token)

  await fastify.close()
}

test().catch(console.error)
