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
  await conn.query(`DELETE FROM pendaftaran WHERE nomor_pendaftaran LIKE 'REG-%'`)
  await conn.query(`DELETE FROM pesantren WHERE nama LIKE 'Pesantren Darul %'`)
  await conn.query(`DELETE FROM users WHERE username LIKE 'santri_%' OR username LIKE 'santribaru_%' OR username LIKE 'pemilik_darul_%' OR username = 'admin'`)
  
  console.log('Membuat akun admin...')
  const adminHashed = await bcrypt.hash('admin123', 10)
  await conn.query(
    'INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())',
    ['admin', 'admin@santriconnect.com', adminHashed, 'superadmin']
  )

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

  // 2. Generate 100 Pesantren & 100 Owners
  console.log('Membuat 100 data pesantren beserta 100 pemilik unik...')
  const BANKS = ['Bank Syariah Indonesia (BSI)', 'Bank Muamalat', 'BNI', 'BRI', 'Mandiri']
  const ownerHashed = await bcrypt.hash('password123', 10)
  const hashedPendaftar = await bcrypt.hash('pendaftar123', 10)
  const STATUSES = ['pending', 'diproses', 'diterima', 'ditolak']

  let pesantrenIds = []
  for (let i = 1; i <= 100; i++) {
    const prov = getRandomItem(provNames)
    const kota = getRandomItem(citiesMap[prov])
    
    // Create unique owner for this pesantren
    const ownerEmail = `pemilik.pesantren${i}@test.com`
    const [ownerRes] = await conn.query(
      'INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())',
      [`pemilik_darul_${i}`, ownerEmail, ownerHashed, 'pemilik']
    )
    const currentPemilikId = ownerRes.insertId

    // Fee logic: Monthly fee always smaller than registration fee
    const biayaPendaftaran = (Math.floor(Math.random() * 20) + 15) * 100000 // 1.5M - 3.4M
    const biayaBulanan = (Math.floor(Math.random() * 10) + 3) * 100000 // 300k - 1.2M
    
    const tahunBerdiri = 1950 + Math.floor(Math.random() * 70)
    const jumlahSantri = 50 + Math.floor(Math.random() * 2000)
    const slug = `darul-${i}-${kota.toLowerCase().replace(/\s+/g, '-')}`.substring(0, 30)

    const foto_utama = `https://loremflickr.com/800/600/mosque,islamic,building?lock=${i}`
    const foto_galeri = JSON.stringify([
      `https://loremflickr.com/800/600/muslim,student?lock=${i}`,
      `https://loremflickr.com/800/600/quran,arabic?lock=${i}`
    ])

    const [res] = await conn.query(`
      INSERT INTO pesantren (
        user_id, nama, province, kota, alamat, kurikulum,
        tahun_berdiri, jumlah_santri, jumlah_pengajar,
        biaya_pendaftaran, biaya_bulanan, fasilitas,
        email, telepon, website, deskripsi,
        foto_utama, foto_galeri,
        nama_bank, nomor_rekening, atas_nama_rekening,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      currentPemilikId,
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
      `admin.${slug}@pesantren.test`,
      `08${Math.floor(Math.random() * 8999999999) + 1000000000}`,
      `www.pesantrendarul${i}.com`,
      `Pesantren Darul ${i} merupakan lembaga pendidikan Islam yang berdedikasi tinggi di ${kota}. Kami memiliki fokus pada kurikulum ${getRandomItem(KURIKULUM)} dengan fasilitas lengkap untuk mendukung proses belajar mengajar santri.`,
      foto_utama,
      foto_galeri,
      getRandomItem(BANKS),
      Math.floor(Math.random() * 9000000000) + 1000000000,
      `Yayasan Darul ${i}`,
    ])
    const pesantrenId = res.insertId
    pesantrenIds.push(pesantrenId)

    // Create 10-15 pendaftar for this pesantren
    const pendaftarCount = Math.floor(Math.random() * 6) + 10 // 10-15
    for (let j = 1; j <= pendaftarCount; j++) {
      const username = `santri_${pesantrenId}_${j}`
      const email = `santri_${pesantrenId}_${j}@test.com`
      
      const [userRes] = await conn.query(
        'INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())',
        [username, email, hashedPendaftar, 'pendaftar']
      )
      const userId = userRes.insertId
      
      const nomor = `REG-${pesantrenId}-${j}-${Date.now().toString().slice(-4)}`
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
        nomor, userId, pesantrenId, status, paymentStatus, biayaPendaftaran,
        `Santri ${i} ${j}`,
        `320101${Math.floor(Math.random() * 10000000000)}`,
        kota, '2010-05-10', Math.random() > 0.5 ? 'L' : 'P',
        `Alamat Santri ${j} untuk Pesantren ${i}`, `08${Math.floor(Math.random() * 8999999999) + 1000000000}`,
        `Ayah Santri ${j}`, `Ibu Santri ${j}`, `08${Math.floor(Math.random() * 8999999999) + 1000000000}`,
        'Wiraswasta'
      ])
    }
  }
  console.log(`✓ 100 Pesantren, 100 Pemilik, dan ~1250 Pendaftar berhasil dibuat.`)

  await conn.end()
  console.log('\n✅ Proses seeding skala besar SELESAI!')
}

run().catch(console.error)
