const CompareService = require('../services/compare-service')

const CompareController = {
  async comparePesantren(request, reply) {
    const { pesantren_ids } = request.body

    if (!Array.isArray(pesantren_ids) || pesantren_ids.length === 0) {
      return reply.code(400).send({ error: 'Input tidak valid' })
    }

    if (pesantren_ids.length > 3) {
      return reply.code(400).send({ error: 'Maksimal 3 pesantren untuk dibandingkan' })
    }

    try {
      const data = await CompareService.comparePesantren(pesantren_ids)
      return reply.code(200).send({ success: true, data })
    } catch (err) {
      if (err.message === 'Beberapa pesantren tidak ditemukan' || err.message === 'Tidak ada pesantren yang dipilih') {
        return reply.code(400).send({ error: err.message })
      }
      return reply.code(500).send({ success: false, error: 'Terjadi kesalahan pada server' })
    }
  }
}

module.exports = CompareController
