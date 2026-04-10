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
    console.log('[PendaftaranService.create] Starting...');
    const startTime = Date.now()
    
    const pesantren = await Pesantren.findById(parseInt(data.pesantren_id))
    if (!pesantren) throw new Error('Pesantren tidak ditemukan')

    console.log(`[PendaftaranService.create] Found pesantren in ${Date.now() - startTime}ms`);

    // Files are already saved by controller, just get filenames
    const fotoKtp = files.foto_ktp ? files.foto_ktp.filename : null
    const pasFoto = files.pas_foto ? files.pas_foto.filename : null
    const kartuKeluarga = files.kartu_keluarga ? files.kartu_keluarga.filename : null

    console.log('[PendaftaranService.create] Files:', { fotoKtp, pasFoto, kartuKeluarga });

    let nomorPendaftaran
    do {
      nomorPendaftaran = `REG-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000) + 100000}`
    } while (await Pendaftaran.checkNomorExists(nomorPendaftaran))

    console.log('[PendaftaranService.create] Creating registration...');
    await Pendaftaran.create({
      nomor_pendaftaran: nomorPendaftaran, user_id: userId, pesantren_id: data.pesantren_id,
      nama_lengkap: data.nama_lengkap, nik: data.nik, tempat_lahir: data.tempat_lahir || null,
      tanggal_lahir: data.tanggal_lahir || null, jenis_kelamin: data.jenis_kelamin,
      alamat: data.alamat || null, no_hp: data.no_hp || null, nama_ayah: data.nama_ayah || null,
      nama_ibu: data.nama_ibu || null, no_hp_ortu: data.no_hp_ortu || null, pekerjaan_ortu: data.pekerjaan_ortu || null,
      foto_ktp: fotoKtp, pas_foto: pasFoto, kartu_keluarga: kartuKeluarga
    })

    const totalTime = Date.now() - startTime
    console.log(`[PendaftaranService.create] ✅ Done in ${totalTime}ms`);
    
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
      tempat_lahir: data.tempat_lahir || '-',
      tanggal_lahir: data.tanggal_lahir || null,
      jenis_kelamin: data.jenis_kelamin,
      alamat: data.alamat || '-',
      no_hp: data.no_hp || '-',
      nama_ayah: data.nama_ayah || '-',
      nama_ibu: data.nama_ibu || '-',
      no_hp_ortu: data.no_hp_ortu || '-',
      pekerjaan_ortu: data.pekerjaan_ortu || '-',
      foto_ktp: data.foto_ktp || null,
      pas_foto: data.pas_foto || null,
      kartu_keluarga: data.kartu_keluarga || null,
      catatan_admin: data.catatan_admin || null,
      created_at: data.created_at,
      updated_at: data.updated_at,
      pesantren: {
        id: data.pesantren_id,
        nama: data.pesantren_nama || 'Pesantren'
      }
    }
  },

  async getMyRegistrations(userId) {
    return await Pendaftaran.findByUserId(userId)
  }
}

module.exports = PendaftaranService
