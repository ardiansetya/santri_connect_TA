const fp = require('fastify-plugin')
const mysql = require('mysql2/promise')
const dbConfig = require('../config/database')

async function fastifyMysql(fastify, options) {
  const connection = await mysql.createConnection(dbConfig)

  fastify.decorate('mysql', connection)

  fastify.addHook('onClose', async () => {
    await connection.end()
  })
}

module.exports = fp(fastifyMysql, { name: 'fastify-mysql' })
