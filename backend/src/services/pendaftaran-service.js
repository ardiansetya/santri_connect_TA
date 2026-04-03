const fs = require('fs')
const path = require('path')

const UPLOAD_DIR = path.join(__dirname, '../../uploads')

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

function saveFile(file, fieldName) {
  const ext = path.extname(file.filename) || '.jpg'
  const filename = `${fieldName}-${Date.now()}${ext}`
  const filePath = path.join(UPLOAD_DIR, filename)
  file.toBuffer().then(buffer => {
    fs.writeFileSync(filePath, buffer)
  })
  return filename
}

function generateNomorPendaftaran() {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 900000) + 100000
  return `REG-${year}-${random}`
}

async function createPendaftaran(fastify, userId, data, files) {
  const connection = fastify.mysql

  const [existing] = await connection.query(
    'SELECT id FROM pesantren WHERE id = ?',
    [data.pesantren_id]
  )

  if (existing.length === 0) {
    throw new Error('Pesantren tidak ditemukan')
  }

  const fotoKtp = files.foto_ktp ? saveFile(files.foto_ktp, 'ktp') : null
  const pasFoto = files.pas_foto ? saveFile(files.pas_foto, 'pas_foto') : null
  const kartuKeluarga = files.kartu_keluarga ? saveFile(files.kartu_keluarga, 'kk') : null

  let nomorPendaftaran
  let isUnique = false

  while (!isUnique) {
    nomorPendaftaran = generateNomorPendaftaran()
    const [dup] = await connection.query(
      'SELECT id FROM pendaftaran WHERE nomor_pendaftaran = ?',
      [nomorPendaftaran]
    )
    if (dup.length === 0) isUnique = true
  }

  await connection.query(
    `INSERT INTO pendaftaran (
      nomor_pendaftaran, user_id, pesatren_id, status,
      nama_lengkap, nik, tempat_lahir, tanggal_lahir, jenis_kelamin,
      alamat, no_hp, nama_ayah, nama_ibu, no_hp_ortu, pekerjaan_ortu,
      foto_ktp, pas_foto, kartu_keluarga
    ) VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nomorPendaftaran,
      userId,
      data.pesantren_id,
      data.nama_lengkap,
      data.nik,
      data.tempat_lahir,
      data.tanggal_lahir,
      data.jenis_kelamin,
      data.alamat,
      data.no_hp,
      data.nama_ayah,
      data.nama_ibu,
      data.no_hp_ortu,
      data.pekerjaan_ortu,
      fotoKtp,
      pasFoto,
      kartuKeluarga
    ]
  )

  return { nomor_pendaftaran: nomorPendaftaran }
}

module.exports = { createPendaftaran }
