const bcrypt = require('bcrypt')

async function registerUser(fastify, username, email, password) {
  const connection = fastify.mysql

  const [existing] = await connection.query(
    'SELECT id FROM users WHERE email = ?',
    [email]
  )

  if (existing.length > 0) {
    throw new Error('Email already registered')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const [result] = await connection.query(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, 'pendaftar']
  )

  return result
}

module.exports = { registerUser }
