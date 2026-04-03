const Pesantren = require('../models/Pesantren')

const PublicService = {
  async getStats() {
    const [totalPesantren, totalProvinsi, totalKota] = await Promise.all([
      Pesantren.countAll(),
      Pesantren.countUniqueProvinces(),
      Pesantren.countUniqueCities()
    ])

    return {
      total_pesantren: totalPesantren,
      total_provinsi: totalProvinsi,
      total_kota: totalKota
    }
  }
}

module.exports = PublicService
