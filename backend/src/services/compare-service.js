const Pesantren = require('../models/Pesantren')

const CompareService = {
  async comparePesantren(ids) {
    const uniqueIds = [...new Set(ids.map(id => parseInt(id, 10)))]

    if (uniqueIds.length === 0) {
      throw new Error('Tidak ada pesantren yang dipilih')
    }

    if (uniqueIds.length > 3) {
      throw new Error('Maksimal 3 pesantren untuk dibandingkan')
    }

    const pesantrenList = await Pesantren.findByIds(uniqueIds)

    if (pesantrenList.length !== uniqueIds.length) {
      throw new Error('Beberapa pesantren tidak ditemukan')
    }

    return pesantrenList.map(p => {
      let fasilitas = p.fasilitas
      if (typeof fasilitas === 'string') {
        try { fasilitas = JSON.parse(fasilitas) } catch { fasilitas = [] }
      }

      return {
        id: p.id,
        nama: p.nama,
        province: p.province,
        kota: p.kota,
        biaya_bulanan: p.biaya_bulanan,
        biaya_pendaftaran: p.biaya_pendaftaran,
        fasilitas,
        kurikulum: p.kurikulum,
        jumlah_santri: p.jumlah_santri,
        jumlah_pengajar: p.jumlah_pengajar,
        tahun_berdiri: p.tahun_berdiri
      }
    })
  }
}

module.exports = CompareService
