const WilayahService = require('../services/wilayah-service')

const WilayahController = {
  async getProvinces(request, reply) {
    try {
      const data = await WilayahService.getProvinces()
      return reply.code(200).send({ success: true, data })
    } catch {
      return reply.code(500).send({ success: false, error: 'Gagal mengambil data wilayah' })
    }
  },

  async getRegencies(request, reply) {
    try {
      const data = await WilayahService.getRegencies(request.params.provinceId)
      return reply.code(200).send({ success: true, data })
    } catch {
      return reply.code(500).send({ success: false, error: 'Gagal mengambil data wilayah' })
    }
  },

  async getProvinceDetail(request, reply) {
    try {
      const data = await WilayahService.getProvinceById(request.params.id)
      if (!data) return reply.code(404).send({ success: false, error: 'Provinsi tidak ditemukan' })
      return reply.code(200).send({ success: true, data })
    } catch {
      return reply.code(500).send({ success: false, error: 'Gagal mengambil data wilayah' })
    }
  },

  async getRegencyDetail(request, reply) {
    try {
      const data = await WilayahService.getRegencyById(request.params.provinceId, request.params.regencyId)
      if (!data) return reply.code(404).send({ success: false, error: 'Kab/Kota tidak ditemukan' })
      return reply.code(200).send({ success: true, data })
    } catch {
      return reply.code(500).send({ success: false, error: 'Gagal mengambil data wilayah' })
    }
  }
}

module.exports = WilayahController
