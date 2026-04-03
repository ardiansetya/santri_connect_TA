const PendaftaranService = require('../services/pendaftaran-service')

const PendaftaranController = {
  async create(request, reply) {
    if (request.user.role !== 'pendaftar') return reply.code(403).send({ error: 'Akses ditolak, hanya pendaftar' })

    const data = {}
    const files = {}
    try {
      for await (const part of request.parts()) {
        if (part.file) files[part.fieldname] = part
        else data[part.fieldname] = part.value
      }
    } catch {
      return reply.code(400).send({ error: 'Input tidak valid' })
    }

    const required = ['pesantren_id', 'nama_lengkap', 'nik', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'alamat', 'no_hp', 'nama_ayah', 'nama_ibu']
    for (const field of required) {
      if (!data[field]) return reply.code(400).send({ error: `Field ${field} wajib diisi` })
    }

    try {
      const result = await PendaftaranService.create(request.user.id, data, files)
      return reply.code(201).send({ data: result })
    } catch (err) {
      return reply.code(400).send({ error: err.message })
    }
  },

  async getTrackingStatus(request, reply) {
    try {
      const result = await PendaftaranService.getTrackingStatus(request.params.nomor)
      return reply.code(200).send({ data: result })
    } catch {
      return reply.code(404).send({ error: 'Data pendaftaran tidak ditemukan' })
    }
  }
}

module.exports = PendaftaranController
