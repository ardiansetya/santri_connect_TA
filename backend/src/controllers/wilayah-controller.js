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
  }
}

module.exports = WilayahController
