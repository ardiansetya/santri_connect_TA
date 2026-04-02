const bcrypt = require('bcrypt')

async function loginUser(fastify, email, password) {
  const connection = fastify.mysql

  const [users] = await connection.query(
    'SELECT id, username, email, password, role FROM users WHERE email = ?',
    [email]
  )

  if (users.length === 0) {
    throw new Error('Kredensial tidak valid')
  }

  const user = users[0]
  const isValidPassword = await bcrypt.compare(password, user.password)

  if (!isValidPassword) {
    throw new Error('Kredensial tidak valid')
  }

  const token = fastify.jwt.sign({ id: user.id, role: user.role })

  return {
    message: 'Login berhasil',
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  }
}

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

module.exports = { registerUser, loginUser }
