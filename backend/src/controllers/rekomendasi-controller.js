const RekomendasiService = require('../services/rekomendasi-service')

const RekomendasiController = {
  async getRekomendasi(request, reply) {
    const { budget, provinsi, kota, kurikulum, fasilitas, bobot } = request.body
    
    // Validation: budget must be a positive number, provinsi can be string, fasilitas must be array
    if (!budget || typeof budget !== 'number' || budget <= 0) {
      return reply.code(400).send({ success: false, error: 'Budget harus berupa angka positif' })
    }
    
    if (provinsi === undefined || kota === undefined || !Array.isArray(fasilitas)) {
      return reply.code(400).send({ success: false, error: 'Input tidak valid (Provinsi, Kota, atau Fasilitas)' })
    }

    try {
      const data = await RekomendasiService.getRekomendasi({ budget, provinsi, kota, kurikulum, fasilitas, bobot })
      return reply.code(200).send({ data })
    } catch {
      return reply.code(500).send({ error: 'Terjadi kesalahan pada server' })
    }
  }
}

module.exports = RekomendasiController
