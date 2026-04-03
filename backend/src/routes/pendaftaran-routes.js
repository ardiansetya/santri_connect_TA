const { authMiddleware } = require('../middlewares/auth-middleware')
const { createPendaftaran, getTrackingStatus } = require('../services/pendaftaran-service')

async function pendaftaranRoutes(fastify, options) {
  fastify.post('/api/pendaftaran', {
    preHandler: authMiddleware
  }, async (request, reply) => {
    if (request.user.role !== 'pendaftar') {
      return reply.code(403).send({ error: 'Akses ditolak, hanya pendaftar' })
    }

    const data = {}
    const files = {}

    try {
      const parts = request.parts()
      for await (const part of parts) {
        if (part.file) {
          files[part.fieldname] = part
        } else {
          data[part.fieldname] = part.value
        }
      }
    } catch (err) {
      console.error('Multipart error:', err.message)
      return reply.code(400).send({ error: 'Input tidak valid' })
    }

    const requiredFields = ['pesantren_id', 'nama_lengkap', 'nik', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'alamat', 'no_hp', 'nama_ayah', 'nama_ibu']
    for (const field of requiredFields) {
      if (!data[field]) {
        return reply.code(400).send({ error: `Field ${field} wajib diisi` })
      }
    }

    try {
      const result = await createPendaftaran(fastify, request.user.id, data, files)
      return reply.code(201).send({ data: result })
    } catch (err) {
      return reply.code(400).send({ error: err.message })
    }
  })

  fastify.get('/api/pendaftaran/status/:nomor', async (request, reply) => {
    const { nomor } = request.params

    try {
      const result = await getTrackingStatus(fastify, nomor)
      return reply.code(200).send({ data: result })
    } catch (err) {
      return reply.code(404).send({ error: 'Data pendaftaran tidak ditemukan' })
    }
  })
}

module.exports = pendaftaranRoutes
