async function authMiddleware(request, reply) {
  const authHeader = request.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ error: 'Token tidak valid atau tidak ditemukan' })
  }

  try {
    const decoded = await request.jwtVerify()
    request.user = decoded
  } catch {
    return reply.code(401).send({ error: 'Token tidak valid atau tidak ditemukan' })
  }
}

module.exports = authMiddleware
