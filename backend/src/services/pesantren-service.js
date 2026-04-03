const Pesantren = require('../models/Pesantren')

const PesantrenService = {
  async getDetail(id) {
    const data = await Pesantren.findById(parseInt(id, 10))
    if (!data) throw new Error('Pesantren tidak ditemukan')

    let fasilitas = data.fasilitas
    if (typeof fasilitas === 'string') {
      try { fasilitas = JSON.parse(fasilitas) } catch { fasilitas = [] }
    }

    return {
      id: data.id, user_id: data.user_id, nama: data.nama,
      province: data.province, kota: data.kota, alamat: data.alamat,
      tahun_berdiri: data.tahun_berdiri, jumlah_santri: data.jumlah_santri,
      jumlah_pengajar: data.jumlah_pengajar, biaya_pendaftaran: data.biaya_pendaftaran,
      biaya_bulanan: data.biaya_bulanan, fasilitas, kurikulum: data.kurikulum,
      email: data.email, telepon: data.telepon, website: data.website,
      deskripsi: data.deskripsi,
      rekening: {
        nama_bank: data.nama_bank,
        nomor_rekening: data.nomor_rekening,
        atas_nama_rekening: data.atas_nama_rekening
      }
    }
  },

  async getPendaftaranInfo(id) {
    const data = await Pesantren.findById(parseInt(id, 10))
    if (!data) throw new Error('Pesantren tidak ditemukan')

    return {
      pesantren_id: data.id,
      nama: data.nama,
      biaya_pendaftaran: data.biaya_pendaftaran,
      rekening: {
        nama_bank: data.nama_bank,
        nomor_rekening: data.nomor_rekening,
        atas_nama: data.atas_nama_rekening
      }
    }
  },

  async getList(filters) {
    const page = Math.max(1, parseInt(filters.page) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(filters.limit) || 10))
    const { data, total } = await Pesantren.findAll({ ...filters, page, limit })

    const mappedData = data.map(row => {
      let f = row.fasilitas
      if (typeof f === 'string') { try { f = JSON.parse(f) } catch { f = [] } }
      return {
        id: row.id, nama: row.nama, province: row.province,
        kota: row.kota, biaya_bulanan: row.biaya_bulanan,
        kurikulum: row.kurikulum, fasilitas: f
      }
    })

    return {
      data: mappedData,
      meta: { page, limit, total_data: total, total_page: Math.ceil(total / limit) }
    }
  },

  async getByUserId(userId, filters) {
    const page = Math.max(1, parseInt(filters.page) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(filters.limit) || 10))
    const { data, total } = await Pesantren.findByUserId(userId, { page, limit })
    return {
      data,
      meta: { page, limit, total_data: total, total_page: Math.ceil(total / limit) }
    }
  },

  async createByPemilik(userId, data) {
    await Pesantren.create({ ...data, user_id: userId })
    return { message: 'Pesantren berhasil ditambahkan' }
  },

  async updateByPemilik(userId, id, data) {
    const existing = await Pesantren.findById(parseInt(id, 10))
    if (!existing) throw new Error('Pesantren tidak ditemukan')
    if (existing.user_id !== userId) throw new Error('Akses ditolak, bukan pesantren Anda')

    const updated = await Pesantren.update(parseInt(id, 10), data)
    if (!updated) throw new Error('Pesantren tidak ditemukan')

    return { message: 'Data pesantren berhasil diperbarui' }
  }
}
    if (!data.nama) throw new Error('Nama pesantren wajib diisi')

    await Pesantren.create({ ...data, user_id: userId })
    return { message: 'Pesantren berhasil ditambahkan' }
  },

  async updateByPemilik(userId, id, data) {
    const validKurikulum = ['modern', 'salaf', 'campuran']
    if (data.kurikulum && !validKurikulum.includes(data.kurikulum)) {
      throw new Error('Kurikulum tidak valid')
    }

    const existing = await Pesantren.findById(parseInt(id, 10))
    if (!existing) throw new Error('Pesantren tidak ditemukan')
    if (existing.user_id !== userId) throw new Error('Akses ditolak, bukan pesantren Anda')

    const updated = await Pesantren.update(parseInt(id, 10), data)
    if (!updated) throw new Error('Pesantren tidak ditemukan')

    return { message: 'Data pesantren berhasil diperbarui' }
  }
}

module.exports = PesantrenService
