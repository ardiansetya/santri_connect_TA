const Pendaftaran = require('../models/Pendaftaran')

const PemilikService = {
  async getPendaftaranByPesantren(userId) {
    const pendaftarans = await Pendaftaran.findByPemilikUserId(userId)
    
    return pendaftarans.map(p => ({
      id: p.id,
      nomor_pendaftaran: p.nomor_pendaftaran,
      status: p.status,
      catatan_admin: p.catatan_admin,
      created_at: p.created_at,
      updated_at: p.updated_at,
      nama_lengkap: p.nama_lengkap,
      nik: p.nik,
      tempat_lahir: p.tempat_lahir,
      tanggal_lahir: p.tanggal_lahir,
      jenis_kelamin: p.jenis_kelamin,
      alamat: p.alamat,
      no_hp: p.no_hp,
      nama_ayah: p.nama_ayah,
      nama_ibu: p.nama_ibu,
      no_hp_ortu: p.no_hp_ortu,
      pekerjaan_ortu: p.pekerjaan_ortu,
      foto_ktp: p.foto_ktp,
      pas_foto: p.pas_foto,
      kartu_keluarga: p.kartu_keluarga,
      pesantren: {
        id: p.pesantren_id,
        nama: p.pesantren_nama
      }
    }))
  },

  async updatePendaftaranStatus(userId, pendaftaranId, { status, catatan_admin }) {
    const validStatuses = ['diterima', 'ditolak']
    if (!validStatuses.includes(status)) {
      throw new Error('Status tidak valid. Gunakan "diterima" atau "ditolak"')
    }

    // Cek apakah pendaftaran ada dan milik pesantren user ini
    const pendaftarans = await Pendaftaran.findByPemilikUserId(userId)
    const pendaftaran = pendaftarans.find(p => p.id === parseInt(pendaftaranId, 10))
    
    if (!pendaftaran) {
      throw new Error('Data pendaftaran tidak ditemukan atau bukan pesantren Anda')
    }

    const updated = await Pendaftaran.updateStatus(parseInt(pendaftaranId, 10), { status, catatan_admin })
    if (!updated) {
      throw new Error('Gagal memperbarui status pendaftaran')
    }

    return { message: `Status pendaftaran berhasil ${status === 'diterima' ? 'diterima' : 'ditolak'}` }
  }
}

module.exports = PemilikService
