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
  
  // User ID 1 - Superadmin
  await conn.query(`
    INSERT IGNORE INTO users (id, username, email, password, role, created_at)
    VALUES (1, 'superadmin_test', 'superadmin@test.com', ?, 'superadmin', NOW())
  `, [hashedPassword])
  console.log('  ✓ User ID 1: superadmin (superadmin@test.com)')
  
  // User ID 2, 3, 4 - Pemiliks
  for (let i = 1; i <= 3; i++) {
    await conn.query(`
      INSERT IGNORE INTO users (id, username, email, password, role, created_at)
      VALUES (?, ?, ?, ?, 'pemilik', NOW())
    `, [i + 1, `pemilik${i}_test`, `pemilik${i}@test.com`, hashedPassword])
    console.log(`  ✓ User ID ${i + 1}: pemilik${i} (pemilik${i}@test.com)`)
  }

  // User ID 5 - Pendaftar  
  await conn.query(`
    INSERT IGNORE INTO users (id, username, email, password, role, created_at)
    VALUES (5, 'pendaftar_test', 'pendaftar@test.com', ?, 'pendaftar', NOW())
  `, [hashedPassword])
  console.log('  ✓ User ID 5: pendaftar (pendaftar@test.com)')
  
  // User ID 6 - Another pendaftar
  await conn.query(`
    INSERT IGNORE INTO users (id, username, email, password, role, created_at)
    VALUES (6, 'pendaftar2_test', 'pendaftar2@test.com', ?, 'pendaftar', NOW())
  `, [hashedPassword])
  console.log('  ✓ User ID 6: pendaftar2 (pendaftar2@test.com)')

  // Create test pesantren
  console.log('\nCreating test pesantren...')
  
  // Pesantren ID 1 - Owned by pemilik1 (user ID 2)
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
      'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa', 
      '["https://images.unsplash.com/photo-1518391846015-55a9cf003585", "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f"]', 
      NOW(), NOW()
    )
  `)
  console.log('  ✓ Pesantren ID 1: Pesantren Test Alpha (Owner: pemilik1)')

  // Pesantren ID 2 - Owned by pemilik2 (user ID 3)
  await conn.query(`
    INSERT IGNORE INTO pesantren (
      id, user_id, nama, province, kota, alamat, kurikulum,
      tahun_berdiri, jumlah_santri, jumlah_pengajar,
      biaya_pendaftaran, biaya_bulanan,
      fasilitas, email, telepon, website, deskripsi,
      foto_utama, foto_galeri, created_at, updated_at
    ) VALUES (
      2, 3, 'Pesantren Test Beta', 'Jawa Tengah', 'Kota Semarang',
      'Jl. Test No. 2', 'salaf', 1995, 150, 25,
      400000, 250000,
      '["Masjid", "Laboratorium"]',
      'beta@test.com', '08222222222', NULL,
      'Pesantren test kedua untuk pengujian perbandingan.',
      'https://images.unsplash.com/photo-1542612013-149090623e86', 
      '["https://images.unsplash.com/photo-1564121211835-e88c852648a2", "https://images.unsplash.com/photo-1585036156171-384164a8c675"]', 
      NOW(), NOW()
    )
  `)
  console.log('  ✓ Pesantren ID 2: Pesantren Test Beta (Owner: pemilik2)')

  // Pesantren ID 3 - Owned by pemilik3 (user ID 4)
  await conn.query(`
    INSERT IGNORE INTO pesantren (
      id, user_id, nama, province, kota, alamat, kurikulum,
      tahun_berdiri, jumlah_santri, jumlah_pengajar,
      biaya_pendaftaran, biaya_bulanan,
      fasilitas, email, telepon, website, deskripsi,
      foto_utama, foto_galeri, created_at, updated_at
    ) VALUES (
      3, 4, 'Pesantren Test Gamma', 'DKI Jakarta', 'Kota Jakarta Selatan',
      'Jl. Test No. 3', 'campuran', 2005, 200, 30,
      600000, 350000,
      '["Masjid", "Sport Center", "WiFi"]',
      'gamma@test.com', '08333333333', NULL,
      'Pesantren test ketiga untuk pengujian fitur rekomendasi.',
      'https://images.unsplash.com/photo-1519817650390-64a93db51149', 
      '["https://images.unsplash.com/photo-1597933534024-bcbb649d0e80", "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74"]', 
      NOW(), NOW()
    )
  `)
  console.log('  ✓ Pesantren ID 3: Pesantren Test Gamma (Owner: pemilik3)')

  // Reset auto-increment to avoid conflicts
  await conn.query('ALTER TABLE users AUTO_INCREMENT = 7')
  await conn.query('ALTER TABLE pesantren AUTO_INCREMENT = 4')

  console.log('\n✅ Test data seeded successfully!\n')
  console.log('Test Accounts (Password: password123):')
  console.log('  Superadmin: superadmin@test.com')
  console.log('  Pemilik 1:  pemilik1@test.com (ID: 2)')
  console.log('  Pemilik 2:  pemilik2@test.com (ID: 3)')
  console.log('  Pemilik 3:  pemilik3@test.com (ID: 4)')
  console.log('  Pendaftar:  pendaftar@test.com (ID: 5)')
  console.log('  Pendaftar 2: pendaftar2@test.com (ID: 6)\n')

  await conn.end()
}

seedTestData().catch(console.error)
