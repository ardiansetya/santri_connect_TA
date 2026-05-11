require('dotenv').config()
const mysql = require('mysql2/promise')
const bcrypt = require('bcrypt')

const KURIKULUM = ['modern', 'salaf', 'campuran']
const FASILITAS_ALL = ['Masjid', 'Asrama', 'Perpustakaan', 'Lab Komputer', 'WiFi', 'Klinik', 'Lapangan Olahraga', 'Kantin', 'Kolam Renang', 'Aula', 'AC', 'Koperasi']

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomFasilitas() {
  const count = Math.floor(Math.random() * 6) + 3
  const shuffled = [...FASILITAS_ALL].sort(() => 0.5 - Math.random())
  return JSON.stringify(shuffled.slice(0, count))
}

async function fetchJson(url) {
  const res = await fetch(url)
  return await res.json()
}

async function run() {
  console.log('🌱 Memulai proses seeding data skala besar (Validasi API Wilayah)...')
  
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })

  console.log('Membersihkan data seeder sebelumnya...')
  await conn.query(`DELETE FROM pendaftaran WHERE alamat LIKE 'Jalan Rumah Santri%'`)
  await conn.query(`DELETE FROM pesantren WHERE nama LIKE 'Pesantren Darul %'`)
  await conn.query(`DELETE FROM users WHERE username LIKE 'santribaru_%'`)
  
  console.log('Mengambil data Wilayah dari API Emsifa...')
  const provinces = await fetchJson('https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json')
  
  // Pilih 5 provinsi secara acak agar tidak terlalu banyak request API
  const selectedProvinces = provinces.sort(() => 0.5 - Math.random()).slice(0, 5)
  const citiesMap = {}
  
  for (const prov of selectedProvinces) {
    const cities = await fetchJson(`https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${prov.id}.json`)
    citiesMap[prov.name] = cities.map(c => c.name)
  }

  const provNames = Object.keys(citiesMap)

  // 1. Ambil atau Buat Pemilik Pesantren
  console.log('Mempersiapkan user pemilik...')
  let [pemilikRows] = await conn.query('SELECT id FROM users WHERE role = "pemilik" LIMIT 1')
  let pemilikId = pemilikRows.length ? pemilikRows[0].id : null

  if (!pemilikId) {
    const hashed = await bcrypt.hash('password123', 10)
    const [res] = await conn.query(
      'INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())',
      ['pemilik_seeder', 'pemilik_seeder@test.com', hashed, 'pemilik']
    )
    pemilikId = res.insertId
  }

  // 2. Generate 100 Pesantren
  console.log('Membuat 100 data pesantren dengan wilayah valid...')
  let pesantrenIds = []
  for (let i = 1; i <= 100; i++) {
    const prov = getRandomItem(provNames)
    const kota = getRandomItem(citiesMap[prov])
    const biayaBulanan = (Math.floor(Math.random() * 25) + 5) * 100000
    const biayaPendaftaran = (Math.floor(Math.random() * 20) + 1) * 100000
    const tahunBerdiri = 1950 + Math.floor(Math.random() * 70)
    const jumlahSantri = 50 + Math.floor(Math.random() * 2000)

    const [res] = await conn.query(`
      INSERT INTO pesantren (
        user_id, nama, province, kota, alamat, kurikulum,
        tahun_berdiri, jumlah_santri, jumlah_pengajar,
        biaya_pendaftaran, biaya_bulanan, fasilitas,
        deskripsi, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      pemilikId,
      `Pesantren Darul ${i} ${kota.substring(0, 8)}`,
      prov,
      kota,
      `Jalan Raya Pesantren No. ${i}, ${kota}`,
      getRandomItem(KURIKULUM),
      tahunBerdiri,
      jumlahSantri,
      Math.floor(jumlahSantri / 15),
      biayaPendaftaran,
      biayaBulanan,
      getRandomFasilitas(),
      `Ini adalah deskripsi otomatis untuk pesantren Darul ${i} yang berlokasi di ${kota}, ${prov}.`
    ])
    pesantrenIds.push(res.insertId)
  }
  console.log('✓ 100 Pesantren berhasil dibuat.')

  // 3. Generate 20 Users Pendaftar
  console.log('Membuat 20 user pendaftar...')
  let pendaftarIds = []
  const hashedPendaftar = await bcrypt.hash('pendaftar123', 10)
  for (let i = 1; i <= 20; i++) {
    const email = `calonsantri${Date.now()}_${i}@test.com`
    const [res] = await conn.query(
      'INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())',
      [`santribaru_${i}`, email, hashedPendaftar, 'pendaftar']
    )
    pendaftarIds.push(res.insertId)
  }
  console.log('✓ 20 User Pendaftar berhasil dibuat.')

  // 4. Generate 20 Pendaftaran
  console.log('Membuat 20 entri pendaftaran...')
  const STATUSES = ['pending', 'diproses', 'diterima', 'ditolak']
  
  for (let i = 0; i < 20; i++) {
    const userId = pendaftarIds[i]
    const pesantrenId = getRandomItem(pesantrenIds)
    const nomor = `REG-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    const [pes] = await conn.query('SELECT biaya_pendaftaran, kota FROM pesantren WHERE id = ?', [pesantrenId])
    const paymentAmount = pes[0].biaya_pendaftaran
    const status = getRandomItem(STATUSES)
    const paymentStatus = status === 'pending' ? 'unpaid' : 'paid'

    await conn.query(`
      INSERT INTO pendaftaran (
        nomor_pendaftaran, user_id, pesantren_id, status, payment_status, payment_amount,
        nama_lengkap, nik, tempat_lahir, tanggal_lahir, jenis_kelamin,
        alamat, no_hp, nama_ayah, nama_ibu, no_hp_ortu, pekerjaan_ortu,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      nomor,
      userId,
      pesantrenId,
      status,
      paymentStatus,
      paymentAmount,
      `Calon Santri ${i+1}`,
      `320101${Math.floor(Math.random() * 10000000000)}`,
      pes[0].kota,
      '2010-05-10',
      Math.random() > 0.5 ? 'L' : 'P',
      `Jalan Rumah Santri No. ${i+1}`,
      `0812345678${i}`,
      `Ayah ${i+1}`,
      `Ibu ${i+1}`,
      `0819876543${i}`,
      'Wiraswasta'
    ])
  }
  console.log('✓ 20 Pendaftaran berhasil dibuat.')

  await conn.end()
  console.log('\n✅ Proses seeding skala besar SELESAI!')
}

run().catch(console.error)
