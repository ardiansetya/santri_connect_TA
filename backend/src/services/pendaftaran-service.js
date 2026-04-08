const fs = require('fs')
const path = require('path')
const Pendaftaran = require('../models/Pendaftaran')
const Pesantren = require('../models/Pesantren')

const UPLOAD_DIR = path.join(__dirname, '../../uploads')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const PendaftaranService = {
  saveFile(file, fieldName) {
    const ext = path.extname(file.filename) || '.jpg'
    const filename = `${fieldName}-${Date.now()}${ext}`
    const filePath = path.join(UPLOAD_DIR, filename)
    file.toBuffer().then(buffer => fs.writeFileSync(filePath, buffer))
    return filename
  },

  async create(userId, data, files) {
    const pesantren = await Pesantren.findById(parseInt(data.pesantren_id))
    if (!pesantren) throw new Error('Pesantren tidak ditemukan')

    const fotoKtp = files.foto_ktp ? this.saveFile(files.foto_ktp, 'ktp') : null
    const pasFoto = files.pas_foto ? this.saveFile(files.pas_foto, 'pas_foto') : null
    const kartuKeluarga = files.kartu_keluarga ? this.saveFile(files.kartu_keluarga, 'kk') : null

    let nomorPendaftaran
    do {
      nomorPendaftaran = `REG-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000) + 100000}`
    } while (await Pendaftaran.checkNomorExists(nomorPendaftaran))

    await Pendaftaran.create({
      nomor_pendaftaran: nomorPendaftaran, user_id: userId, pesantren_id: data.pesantren_id,
      nama_lengkap: data.nama_lengkap, nik: data.nik, tempat_lahir: data.tempat_lahir,
      tanggal_lahir: data.tanggal_lahir, jenis_kelamin: data.jenis_kelamin,
      alamat: data.alamat, no_hp: data.no_hp, nama_ayah: data.nama_ayah,
      nama_ibu: data.nama_ibu, no_hp_ortu: data.no_hp_ortu, pekerjaan_ortu: data.pekerjaan_ortu,
      foto_ktp: fotoKtp, pas_foto: pasFoto, kartu_keluarga: kartuKeluarga
    })

    return { nomor_pendaftaran: nomorPendaftaran }
  },

  async getTrackingStatus(nomor) {
    const data = await Pendaftaran.findByNomor(nomor)
    if (!data) throw new Error('Data pendaftaran tidak ditemukan')

    return {
      id: data.id,
      nomor_pendaftaran: data.nomor_pendaftaran,
      user_id: data.user_id,
      pesantren_id: data.pesantren_id,
      status: data.status,
      nama_lengkap: data.nama_lengkap,
      nik: data.nik,
      tempat_lahir: data.tempat_lahir,
      tanggal_lahir: data.tanggal_lahir,
      jenis_kelamin: data.jenis_kelamin,
      alamat: data.alamat,
      no_hp: data.no_hp,
      nama_ayah: data.nama_ayah,
      nama_ibu: data.nama_ibu,
      no_hp_ortu: data.no_hp_ortu,
      pekerjaan_ortu: data.pekerjaan_ortu,
      catatan_admin: data.catatan_admin,
      created_at: data.created_at,
      updated_at: data.updated_at,
      pesantren: { id: data.pesantren_id, nama: data.pesantren_nama }
    }
  }
}

module.exports = PendaftaranService
