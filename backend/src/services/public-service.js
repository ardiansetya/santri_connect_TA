const Pesantren = require('../models/Pesantren')

function parseFasilitas(row) {
  let f = row.fasilitas
  if (typeof f === 'string') { try { f = JSON.parse(f) } catch { f = [] } }
  return {
    id: row.id, nama: row.nama, province: row.province,
    kota: row.kota, biaya_bulanan: row.biaya_bulanan,
    jumlah_santri: row.jumlah_santri, kurikulum: row.kurikulum,
    fasilitas: f, foto_utama: row.foto_utama,
    tahun_berdiri: row.tahun_berdiri
  }
}

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
  },

  async getTopPesantren() {
    const [termurah, terbaru, terbanyak] = await Promise.all([
      Pesantren.findCheapest(6),
      Pesantren.findNewest(6),
      Pesantren.findMostStudents(6)
    ])

    return {
      termurah: termurah.map(parseFasilitas),
      terbaru: terbaru.map(parseFasilitas),
      terbanyak_santri: terbanyak.map(parseFasilitas)
    }
  }
}

module.exports = PublicService
