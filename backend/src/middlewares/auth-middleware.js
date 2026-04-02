async function authMiddleware(request, reply) {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ error: 'Token tidak valid atau tidak ditemukan' })
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    const decoded = await request.jwtVerify()
    request.user = decoded
  } catch (err) {
    return reply.code(401).send({ error: 'Token tidak valid atau tidak ditemukan' })
  }
}

module.exports = { authMiddleware }
