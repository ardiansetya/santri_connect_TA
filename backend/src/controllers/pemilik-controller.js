const PemilikService = require('../services/pemilik-service')

const PemilikController = {
  async getPendaftaran(request, reply) {
    try {
      const data = await PemilikService.getPendaftaranByPesantren(request.user.id)
      return reply.code(200).send({ success: true, data })
    } catch (err) {
      return reply.code(500).send({ success: false, error: 'Terjadi kesalahan pada server' })
    }
  },

  async updatePendaftaranStatus(request, reply) {
    const { status, catatan_admin } = request.body
    
    if (!status) {
      return reply.code(400).send({ error: 'Status wajib diisi' })
    }

    try {
      const result = await PemilikService.updatePendaftaranStatus(
        request.user.id, 
        request.params.id, 
        { status, catatan_admin }
      )
      return reply.code(200).send(result)
    } catch (err) {
      if (err.message.includes('tidak ditemukan') || err.message.includes('bukan pesantren')) {
        return reply.code(404).send({ error: err.message })
      }
      if (err.message.includes('tidak valid')) {
        return reply.code(400).send({ error: err.message })
      }
      return reply.code(500).send({ error: 'Terjadi kesalahan pada server' })
    }
  }
}

module.exports = PemilikController
