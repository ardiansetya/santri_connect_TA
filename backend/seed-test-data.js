require('dotenv').config()
const mysql = require('mysql2/promise')
const bcrypt = require('bcrypt')

async function seedTestData() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })

  console.log('🌱 Seeding test data...\n')

  // Create test users
  console.log('Creating test users...')
  
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  // User ID 1 - Superadmin (for /me test)
  await conn.query(`
    INSERT IGNORE INTO users (id, username, email, password, role, created_at)
    VALUES (1, 'superadmin_test', 'superadmin@test.com', ?, 'superadmin', NOW())
  `, [hashedPassword])
  console.log('  ✓ User ID 1: superadmin (superadmin@test.com)')
  
  // User ID 2 - Pemilik
  await conn.query(`
    INSERT IGNORE INTO users (id, username, email, password, role, created_at)
    VALUES (2, 'pemilik_test', 'pemilik@test.com', ?, 'pemilik', NOW())
  `, [hashedPassword])
  console.log('  ✓ User ID 2: pemilik (pemilik@test.com)')

  // User ID 3 - Pendaftar  
  await conn.query(`
    INSERT IGNORE INTO users (id, username, email, password, role, created_at)
    VALUES (3, 'pendaftar_test', 'pendaftar@test.com', ?, 'pendaftar', NOW())
  `, [hashedPassword])
  console.log('  ✓ User ID 3: pendaftar (pendaftar@test.com)')

  // User ID 4 - Another pendaftar for registration tests
  await conn.query(`
    INSERT IGNORE INTO users (id, username, email, password, role, created_at)
    VALUES (4, 'pendaftar2_test', 'pendaftar2@test.com', ?, 'pendaftar', NOW())
  `, [hashedPassword])
  console.log('  ✓ User ID 4: pendaftar2 (pendaftar2@test.com)')

  // Create test pesantren
  console.log('\nCreating test pesantren...')
  
  // Pesantren ID 1 - Owned by pemilik (user ID 2)
  await conn.query(`
    INSERT IGNORE INTO pesantren (
      id, user_id, nama, province, kota, alamat, kurikulum,
      tahun_berdiri, jumlah_santri, jumlah_pengajar,
      biaya_pendaftaran, biaya_bulanan,
      fasilitas, email, telepon, website, deskripsi,
      foto_utama, foto_galeri, created_at, updated_at
    ) VALUES (
      1, 2, 'Pesantren Test Alpha', 'Jawa Barat', 'Kabupaten Bandung',
      'Jl. Test No. 1', 'modern', 2000, 100, 20,
      500000, 300000,
      '["Masjid", "Asrama", "Perpustakaan"]',
      'alpha@test.com', '08111111111', NULL,
      'Pesantren test pertama untuk pengujian sistem.',
      NULL, NULL, NOW(), NOW()
    )
  `)
  console.log('  ✓ Pesantren ID 1: Pesantren Test Alpha')

  // Pesantren ID 2 - For compare tests
  await conn.query(`
    INSERT IGNORE INTO pesantren (
      id, user_id, nama, province, kota, alamat, kurikulum,
      tahun_berdiri, jumlah_santri, jumlah_pengajar,
      biaya_pendaftaran, biaya_bulanan,
      fasilitas, email, telepon, website, deskripsi,
      foto_utama, foto_galeri, created_at, updated_at
    ) VALUES (
      2, 2, 'Pesantren Test Beta', 'Jawa Tengah', 'Kota Semarang',
      'Jl. Test No. 2', 'salaf', 1995, 150, 25,
      400000, 250000,
      '["Masjid", "Laboratorium"]',
      'beta@test.com', '08222222222', NULL,
      'Pesantren test kedua untuk pengujian perbandingan.',
      NULL, NULL, NOW(), NOW()
    )
  `)
  console.log('  ✓ Pesantren ID 2: Pesantren Test Beta')

  // Pesantren ID 3 - For compare tests
  await conn.query(`
    INSERT IGNORE INTO pesantren (
      id, user_id, nama, province, kota, alamat, kurikulum,
      tahun_berdiri, jumlah_santri, jumlah_pengajar,
      biaya_pendaftaran, biaya_bulanan,
      fasilitas, email, telepon, website, deskripsi,
      foto_utama, foto_galeri, created_at, updated_at
    ) VALUES (
      3, 2, 'Pesantren Test Gamma', 'DKI Jakarta', 'Kota Jakarta Selatan',
      'Jl. Test No. 3', 'campuran', 2005, 200, 30,
      600000, 350000,
      '["Masjid", "Sport Center", "WiFi"]',
      'gamma@test.com', '08333333333', NULL,
      'Pesantren test ketiga untuk pengujian fitur rekomendasi.',
      NULL, NULL, NOW(), NOW()
    )
  `)
  console.log('  ✓ Pesantren ID 3: Pesantren Test Gamma')

  // Reset auto-increment to avoid conflicts
  await conn.query('ALTER TABLE users AUTO_INCREMENT = 5')
  await conn.query('ALTER TABLE pesantren AUTO_INCREMENT = 4')

  console.log('\n✅ Test data seeded successfully!\n')
  console.log('Test Accounts:')
  console.log('  Superadmin: Use existing superadmin account')
  console.log('  Pemilik:    pemilik@test.com / password123 (ID: 2)')
  console.log('  Pendaftar:  pendaftar@test.com / password123 (ID: 3)')
  console.log('  Pendaftar2: pendaftar2@test.com / password123 (ID: 4)\n')

  await conn.end()
}

seedTestData().catch(console.error)
