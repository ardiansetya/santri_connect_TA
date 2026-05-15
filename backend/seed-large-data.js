require('dotenv').config()
const mysql = require('mysql2/promise')
const bcrypt = require('bcrypt')

const KURIKULUM = ['modern', 'salaf', 'campuran']
const FASILITAS_ALL = ['Masjid', 'Asrama', 'Perpustakaan', 'Lab Komputer', 'WiFi', 'Klinik', 'Lapangan Olahraga', 'Kantin', 'Kolam Renang', 'Aula', 'AC', 'Koperasi']

const CURATED_PHOTOS = [
  'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa', // Sheikh Zayed Grand Mosque
  'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f', // Blue Mosque
  'https://images.unsplash.com/photo-1519817650390-64a93db51149', // Islamic Architecture
  'https://images.unsplash.com/photo-1585036156171-384164a8c675', // Mosque Dome
  'https://plus.unsplash.com/premium_photo-1670745800247-271e8977da41',
  'https://plus.unsplash.com/premium_photo-1764695516001-06ec3e3aded9',
  'https://plus.unsplash.com/premium_photo-1697730160077-11c64c37550f',
  'https://plus.unsplash.com/premium_photo-1699526398206-b519c41778ab',
  'https://plus.unsplash.com/premium_photo-1770059205799-e079ddca35a3',
  'https://plus.unsplash.com/premium_photo-1678373455601-04f440d5f074',
  'https://plus.unsplash.com/premium_photo-1697730020118-46dffe1c5b8c',
  'https://plus.unsplash.com/premium_photo-1697729912281-c2b2da54d027',
]

const CURATED_KEYWORDS = [
  'mosque', 'islamic,building', 'madrasa', 'arabic,architecture', 'spiritual',
  'muslim,culture', 'education,building', 'classic,mosque', 'modern,islamic', 'peaceful,building'
]

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

  // Ambil semua provinsi agar tiap provinsi terwakili minimal 1 pesantren
  const citiesMap = {}

  for (const prov of provinces) {
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

  // Pastikan setiap provinsi ada minimal 1 pesantren
  let targetProvinces = [...provNames]
  while (targetProvinces.length < 100) {
    targetProvinces.push(getRandomItem(provNames))
  }
  targetProvinces = targetProvinces.sort(() => 0.5 - Math.random())

  for (let i = 1; i <= 100; i++) {
    const prov = targetProvinces[i - 1]
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

    const foto_utama = CURATED_PHOTOS[(i - 1) % CURATED_PHOTOS.length]

    const foto_galeri = JSON.stringify([
      CURATED_PHOTOS[(i + 5) % CURATED_PHOTOS.length],
      CURATED_PHOTOS[(i + 12) % CURATED_PHOTOS.length]
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


  console.log('Menerapkan foto masjid ke SEMUA pesantren di database...')
  const [allPesantren] = await conn.query('SELECT id FROM pesantren')
  for (const p of allPesantren) {
    const foto_utama = CURATED_PHOTOS[p.id % CURATED_PHOTOS.length]
    const foto_galeri = JSON.stringify([
      CURATED_PHOTOS[(p.id + 3) % CURATED_PHOTOS.length],
      CURATED_PHOTOS[(p.id + 7) % CURATED_PHOTOS.length]
    ])
    await conn.query('UPDATE pesantren SET foto_utama = ?, foto_galeri = ? WHERE id = ?', [foto_utama, foto_galeri, p.id])
  }

  await conn.end()
  console.log('✅ SELESAI: Semua pesantren kini menggunakan gambar masjid/pesantren yang relevan!')
}

run().catch(console.error)
