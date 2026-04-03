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
  }
}

module.exports = PesantrenController
