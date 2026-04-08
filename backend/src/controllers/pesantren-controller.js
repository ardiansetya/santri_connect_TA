const PesantrenService = require('../services/pesantren-service')

const PesantrenController = {
  async getDetail(request, reply) {
    try {
      const data = await PesantrenService.getDetail(request.params.id)
      return reply.code(200).send({ success: true, data })
    } catch {
      return reply.code(404).send({ success: false, error: 'Pesantren tidak ditemukan' })
    }
  },

  async getList(request, reply) {
    try {
      const result = await PesantrenService.getList(request.query)
      return reply.code(200).send({ success: true, data: result.data, meta: result.meta })
    } catch {
      return reply.code(500).send({ success: false, error: 'Terjadi kesalahan pada server' })
    }
  },

  async getPendaftaranInfo(request, reply) {
    try {
      const data = await PesantrenService.getPendaftaranInfo(request.params.id)
      return reply.code(200).send({ success: true, data })
    } catch {
      return reply.code(404).send({ success: false, error: 'Pesantren tidak ditemukan' })
    }
  },

  async getByPemilik(request, reply) {
    try {
      const result = await PesantrenService.getByUserId(request.user.id, request.query)
      return reply.code(200).send({ success: true, data: result.data, meta: result.meta })
    } catch {
      return reply.code(500).send({ success: false, error: 'Terjadi kesalahan pada server' })
    }
  },

  async createByPemilik(request, reply) {
    const data = {}
    const files = {}
    
    // Handle multipart or JSON payload
    if (request.isMultipart()) {
      try {
        for await (const part of request.parts()) {
          if (part.file) files[part.fieldname] = part
          else data[part.fieldname] = part.value
        }
      } catch {
        return reply.code(400).send({ error: 'Input tidak valid' })
      }
    } else {
      Object.assign(data, request.body)
    }

    // Normalize province/provinsi
    const { normalizeWilayahData } = require('../middlewares/normalize-wilayah')
    const normalizedData = normalizeWilayahData(data)
    
    if (!normalizedData.nama) return reply.code(400).send({ error: 'Nama pesantren wajib diisi' })
    if (!normalizedData.province) return reply.code(400).send({ error: 'Provinsi wajib diisi' })
    if (!normalizedData.kota) return reply.code(400).send({ error: 'Kota wajib diisi' })

    try {
      const result = await PesantrenService.createByPemilik(request.user.id, normalizedData, files)
      return reply.code(201).send(result)
    } catch (err) {
      return reply.code(400).send({ error: err.message })
    }
  },

  async updateByPemilik(request, reply) {
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

    try {
      const result = await PesantrenService.updateByPemilik(request.user.id, request.params.id, data, files)
      return reply.code(200).send(result)
    } catch (err) {
      if (err.message === 'Pesantren tidak ditemukan') {
        return reply.code(404).send({ error: 'Pesantren tidak ditemukan' })
      }
      if (err.message === 'Akses ditolak, bukan pesantren Anda') {
        return reply.code(403).send({ error: 'Akses ditolak' })
      }
      return reply.code(400).send({ error: err.message })
    }
  }
}

module.exports = PesantrenController
