const RekomendasiService = require('../services/rekomendasi-service')

const RekomendasiController = {
  async getRekomendasi(request, reply) {
    const { budget, provinsi, fasilitas } = request.body
    if (!budget || !provinsi || !fasilitas || !Array.isArray(fasilitas)) return reply.code(400).send({ error: 'Input tidak valid' })
    if (typeof budget !== 'number' || budget <= 0) return reply.code(400).send({ error: 'Input tidak valid' })

    try {
      const data = await RekomendasiService.getRekomendasi({ budget, provinsi, fasilitas })
      return reply.code(200).send({ data })
    } catch {
      return reply.code(500).send({ error: 'Terjadi kesalahan pada server' })
    }
  }
}

module.exports = RekomendasiController
