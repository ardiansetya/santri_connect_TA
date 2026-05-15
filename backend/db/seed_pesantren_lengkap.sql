-- ========================================
-- MASTER SEEDER: SANTRI CONNECT
-- Membersihkan dan mengisi semua data awal
-- ========================================

-- 1. Nonaktifkan pengecekan Foreign Key untuk proses TRUNCATE yang aman
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Bersihkan semua tabel
TRUNCATE TABLE pendaftaran;
TRUNCATE TABLE pendaftar_profile;
TRUNCATE TABLE pesantren;
TRUNCATE TABLE users;

-- 3. Aktifkan kembali pengecekan Foreign Key
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- INSERT USERS
-- ========================================
INSERT INTO users (id, username, email, password, role) VALUES
(1, 'admin', 'admin@santriconnect.id', '$2b$10$eomtHDIih4kxKZmzgn2SnODJxnYpVd/57ss3L4.jUX3jKKUEfwi8C', 'superadmin'),
(2, 'pemilik1', 'pemilik1@santriconnect.id', '$2b$10$eomtHDIih4kxKZmzgn2SnODJxnYpVd/57ss3L4.jUX3jKKUEfwi8C', 'pemilik'),
(3, 'pemilik2', 'pemilik2@santriconnect.id', '$2b$10$eomtHDIih4kxKZmzgn2SnODJxnYpVd/57ss3L4.jUX3jKKUEfwi8C', 'pemilik'),
(4, 'pemilik3', 'pemilik3@santriconnect.id', '$2b$10$eomtHDIih4kxKZmzgn2SnODJxnYpVd/57ss3L4.jUX3jKKUEfwi8C', 'pemilik'),
(5, 'pemilik4', 'pemilik4@santriconnect.id', '$2b$10$eomtHDIih4kxKZmzgn2SnODJxnYpVd/57ss3L4.jUX3jKKUEfwi8C', 'pemilik'),
(6, 'pemilik5', 'pemilik5@santriconnect.id', '$2b$10$eomtHDIih4kxKZmzgn2SnODJxnYpVd/57ss3L4.jUX3jKKUEfwi8C', 'pemilik'),
(7, 'pemilik6', 'pemilik6@santriconnect.id', '$2b$10$eomtHDIih4kxKZmzgn2SnODJxnYpVd/57ss3L4.jUX3jKKUEfwi8C', 'pemilik'),
(8, 'pemilik7', 'pemilik7@santriconnect.id', '$2b$10$eomtHDIih4kxKZmzgn2SnODJxnYpVd/57ss3L4.jUX3jKKUEfwi8C', 'pemilik'),
(9, 'pemilik8', 'pemilik8@santriconnect.id', '$2b$10$eomtHDIih4kxKZmzgn2SnODJxnYpVd/57ss3L4.jUX3jKKUEfwi8C', 'pemilik'),
(10, 'pemilik9', 'pemilik9@santriconnect.id', '$2b$10$eomtHDIih4kxKZmzgn2SnODJxnYpVd/57ss3L4.jUX3jKKUEfwi8C', 'pemilik'),
(11, 'pemilik10', 'pemilik10@santriconnect.id', '$2b$10$eomtHDIih4kxKZmzgn2SnODJxnYpVd/57ss3L4.jUX3jKKUEfwi8C', 'pemilik'),
(12, 'pendaftar1', 'pendaftar1@santriconnect.id', '$2b$10$eomtHDIih4kxKZmzgn2SnODJxnYpVd/57ss3L4.jUX3jKKUEfwi8C', 'pendaftar');

-- ========================================
-- INSERT PENDAFTAR PROFILE
-- ========================================
INSERT INTO pendaftar_profile (
  user_id, nama_lengkap, nik, tempat_lahir, tanggal_lahir, 
  jenis_kelamin, alamat, no_hp, nama_ayah, nama_ibu, 
  no_hp_ortu, pekerjaan_ortu
) VALUES (
  12, 'Ahmad Fulan', '3273012345678901', 'Bandung', '2008-05-15',
  'L', 'Jl. Merdeka No. 45, Sumur Bandung, Kota Bandung', '081234567890',
  'Budi Santoso', 'Siti Aminah', '081987654321', 'PNS'
);

-- ========================================
-- INSERT PESANTREN
-- ========================================
INSERT INTO pesantren (
  id, user_id, nama, province, kota, alamat,
  tahun_berdiri, jumlah_santri, jumlah_pengajar,
  biaya_pendaftaran, biaya_bulanan,
  fasilitas, kurikulum,
  email, telepon, website,
  deskripsi,
  foto_utama, foto_galeri
) VALUES
-- 1. Pondok Pesantren Darul Quran - Bandung
(
  1, 2,
  'Pondok Pesantren Darul Quran',
  'Jawa Barat', 'Kabupaten Bandung',
  'Jl. Raya Cibiru No. 123, Cibiru, Bandung, Jawa Barat 40615',
  1995, 850, 120,
  2500000, 1500000,
  '["Masjid", "Asrama", "Perpustakaan", "Lab Komputer", "WiFi", "Klinik", "Lapangan Olahraga", "Kantin"]',
  'modern',
  'info@darulquran.sch.id', '(022) 7890123', 'https://www.darulquran.sch.id',
  'Pondok Pesantren Darul Quran adalah salah satu pondok pesantren terkemuka di Jawa Barat yang menggabungkan kurikulum modern dengan nilai-nilai Islam tradisional. Didirikan pada tahun 1995, pesantren ini telah mendidik lebih dari 5000 alumni yang sukses di berbagai bidang. Dengan luas area 5 hektar, pesantren ini memiliki fasilitas lengkap termasuk masjid berkapasitas 2000 jamaah, asrama nyaman, perpustakaan dengan 10.000 koleksi buku, laboratorium komputer modern, dan lapangan olahraga. Program unggulan meliputi Tahfidz Quran, Bahasa Arab dan Inggris, Sains dan Teknologi, serta Kewirausahaan.',
  'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa', '["https://images.unsplash.com/photo-1518391846015-55a9cf003585", "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f"]'
),
-- 2. Pondok Pesantren Al-Hikmah - Surabaya
(
  2, 3,
  'Pondok Pesantren Al-Hikmah',
  'Jawa Timur', 'Kota Surabaya',
  'Jl. Ahmad Yani No. 456, Gayungan, Surabaya, Jawa Timur 60234',
  1988, 1200, 180,
  3000000, 1800000,
  '["Masjid", "Asrama", "Perpustakaan", "Lab Komputer", "WiFi", "Klinik", "Kolam Renang", "Aula"]',
  'campuran',
  'info@alhikmah.sch.id', '(031) 8901234', 'https://www.alhikmah.sch.id',
  'Pondok Pesantren Al-Hikmah merupakan salah satu pesantren tertua dan terbesar di Jawa Timur. Berdiri sejak 1988, pesantren ini telah menjadi pusat pendidikan Islam terkemuka yang mengedepankan keseimbangan antara ilmu agama dan ilmu umum. Dengan sistem pondok modern, para santri tinggal di asrama dengan pengawasan 24 jam dari para ustadz dan ustadzah. Kurikulum mencakup pendidikan diniyah, pendidikan formal SMP dan SMA, serta keterampilan hidup.',
  'https://images.unsplash.com/photo-1542612013-149090623e86', '["https://images.unsplash.com/photo-1564121211835-e88c852648a2", "https://images.unsplash.com/photo-1585036156171-384164a8c675"]'
),
-- 3. Pondok Pesantren Nurul Islam - Semarang
(
  3, 4,
  'Pondok Pesantren Nurul Islam',
  'Jawa Tengah', 'Kota Semarang',
  'Jl. Kaligawe Raya No. 789, Genuk, Semarang, Jawa Tengah 50117',
  2001, 650, 95,
  2000000, 1200000,
  '["Masjid", "Asrama", "Perpustakaan", "WiFi", "Lapangan Olahraga"]',
  'salaf',
  'info@nurulislam.sch.id', '(024) 6789012', 'https://www.nurulislam.sch.id',
  'Pondok Pesantren Nurul Islam mengusung konsep pendidikan Islam salafiyah dengan fokus pada pendalaman kitab-kitab klasik. Didirikan tahun 2001 oleh KH. Ahmad Fauzi, pesantren ini berkomitmen mencetak generasi ulama yang memahami ilmu agama secara mendalam. Sistem pembelajaran menggunakan metode sorogan, bandongan, dan musyawarah. Kitab yang dipelajari meliputi Fiqih, Aqidah, Akhlak, Nahwu-Shorof, dan Hadits.',
  'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f', '["https://images.unsplash.com/photo-1519817650390-64a93db51149", "https://images.unsplash.com/photo-1597933534024-bcbb649d0e80"]'
),
-- 4. Pondok Pesantren Ibnu Abbas - Jakarta Timur
(
  4, 5,
  'Pondok Pesantren Ibnu Abbas',
  'DKI Jakarta', 'Kota Jakarta Timur',
  'Jl. Condet Raya No. 321, Kramat Jati, Jakarta Timur 13530',
  2010, 420, 75,
  3500000, 2000000,
  '["Masjid", "Asrama", "Perpustakaan", "Lab Komputer", "WiFi", "AC", "Kantin"]',
  'modern',
  'info@ibnuabbas.sch.id', '(021) 5678901', 'https://www.ibnuabbas.sch.id',
  'Pondok Pesantren Ibnu Abbas hadir sebagai solusi pendidikan Islam modern di jantung ibukota. Berdiri tahun 2010, pesantren ini menawarkan program pendidikan terpadu yang mengintegrasikan kurikulum nasional dengan kurikulum pesantren. Program unggulan: Tahfidz Quran 30 Juz, Bahasa Arab dan Inggris Intensif, IT dan Coding, serta Kewirausahaan. Fasilitas premium dengan ruang ber-AC, lab komputer internet fiber optic, perpustakaan digital, dan CCTV 24 jam.',
  'https://images.unsplash.com/photo-1519817650390-64a93db51149', '["https://images.unsplash.com/photo-1526628953301-3e589a6a8b74", "https://images.unsplash.com/photo-1566069174414-fba88f25a597"]'
),
-- 5. Pondok Pesantren Miftahul Ulum - Malang
(
  5, 6,
  'Pondok Pesantren Miftahul Ulum',
  'Jawa Timur', 'Kabupaten Malang',
  'Jl. Gadingkulon No. 555, Dau, Malang, Jawa Timur 65151',
  1975, 1500, 220,
  1500000, 1000000,
  '["Masjid", "Asrama", "Perpustakaan", "Lab Komputer", "WiFi", "Klinik", "Pertanian", "Peternakan"]',
  'campuran',
  'info@miftahululum.sch.id', '(0341) 4567890', 'https://www.miftahululum.sch.id',
  'Pondok Pesantren Miftahul Ulum adalah pesantren terbesar di Malang Raya dengan lebih dari 1500 santri and 220 tenaga pengajar. Didirikan tahun 1975 oleh KH. Mohammad Hasan, pesantren ini menerapkan keseimbangan antara pendidikan diniyah, formal, and keterampilan praktis. Dilengkapi unit pertanian, perkebunan, and peternakan di area seluas 15 hektar di kaki Gunung Panderman.',
  'https://images.unsplash.com/photo-1564121211835-e88c852648a2', '["https://images.unsplash.com/photo-1507537362145-9f7e4e1de542", "https://images.unsplash.com/photo-1574241604938-db8174b12634"]'
),
-- 6. Pondok Pesantren Hidayatullah - Depok
(
  6, 7,
  'Pondok Pesantren Hidayatullah',
  'Jawa Barat', 'Kota Depok',
  'Jl. Raya Cibinong No. 100, Cimanggis, Depok, Jawa Barat 16451',
  2005, 780, 110,
  2200000, 1400000,
  '["Masjid", "Asrama", "Perpustakaan", "Lab Komputer", "WiFi", "Klinik", "Lapangan Basket"]',
  'modern',
  'info@hidayatullah.sch.id', '(021) 8765432', 'https://www.hidayatullah.sch.id',
  'Pondok Pesantren Hidayatullah berkomitmen mencetak generasi Muslim yang berilmu, beramal, dan berdakwah. Berdiri tahun 2005, pesantren ini mengintegrasikan sistem pendidikan pesantren dengan pendidikan nasional. Program khusus meliputi Tahfidz Quran, kajian kitab kuning, latihan dakwah, dan pelatihan leadership. Prestasi: Juara 1 MTQ Tingkat Provinsi 2022 dan 2023, Juara 2 Pidato Bahasa Arab Nasional 2023.',
  'https://images.unsplash.com/photo-1585036156171-384164a8c675', '["https://images.unsplash.com/photo-1581404476143-fb31d742929f", "https://images.unsplash.com/photo-1567593259050-01d6706e4a2d"]'
),
-- 7. Pondok Pesantren Al-Anwar - Rembang
(
  7, 8,
  'Pondok Pesantren Al-Anwar',
  'Jawa Tengah', 'Kabupaten Rembang',
  'Jl. Raya Sarang No. 01, Sarang, Rembang, Jawa Tengah 59274',
  1967, 2000, 250,
  1200000, 900000,
  '["Masjid", "Asrama", "Perpustakaan", "Pesantren Putri", "Santri Kalong"]',
  'salaf',
  NULL, '(0295) 531234', NULL,
  'Pondok Pesantren Al-Anwar merupakan pesantren salafiyah yang sangat dihormati di Indonesia. Didirikan pada tahun 1967, pesantren ini dikenal sebagai pusat kajian kitab kuning dan ilmu-ilmu agama klasik. Ribuan santri dari seluruh nusantara datang untuk mendalami ilmu fiqih, aqidah, tasawuf, dan bahasa Arab secara intensif.',
  'https://images.unsplash.com/photo-1597933534024-bcbb649d0e80', '["https://images.unsplash.com/photo-1564121171936-f0814620ca63", "https://images.unsplash.com/photo-1517582082532-16a09095493f"]'
),
-- 8. Pondok Pesantren Modern Darussalam Gontor - Ponorogo
(
  8, 9,
  'Pondok Modern Islam Assalaam',
  'Jawa Tengah', 'Kota Surakarta',
  'Jl. Gumpang RT 03/06, Gumpang, Kartasura, Sukoharjo, Jawa Tengah 57169',
  1985, 3500, 400,
  5000000, 2500000,
  '["Masjid", "Asrama", "Perpustakaan", "Lab Komputer", "Lab Bahasa", "WiFi", "Klinik", "Lapangan Olahraga", "Aula", "Kantin", "Koperasi"]',
  'modern',
  'info@assalaam.or.id', '(0271) 783027', 'https://www.assalaam.or.id',
  'Pondok Modern Islam Assalaam adalah salah satu pesantren modern terbesar di Indonesia dengan sistem pendidikan yang mengutamakan penguasaan Bahasa Arab dan Inggris sebagai bahasa pengantar. Berdiri sejak 1985, pesantren ini telah melahirkan ribuan alumni yang berkiprah di berbagai sektor. Kurikulum mencakup pendidikan SMP, SMA, dan Ma\'had Aly dengan integrasi penuh antara ilmu agama dan ilmu umum.',
  'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74', '["https://images.unsplash.com/photo-1537731308434-6db35d49a714", "https://images.unsplash.com/photo-1542360663-801996c3d470"]'
),
-- 9. Pondok Pesantren Sidogiri - Pasuruan
(
  9, 10,
  'Pondok Pesantren Sidogiri',
  'Jawa Timur', 'Kabupaten Pasuruan',
  'Jl. Sidogiri No. 1, Kraton, Pasuruan, Jawa Timur 67151',
  1718, 12000, 800,
  800000, 700000,
  '["Masjid", "Asrama", "Perpustakaan", "Koperasi", "BMT", "Percetakan", "Pertanian"]',
  'salaf',
  NULL, '(0343) 411517', 'https://www.sidogiri.net',
  'Pondok Pesantren Sidogiri adalah salah satu pesantren tertua di Indonesia, berdiri sejak 1718. Pesantren ini terkenal dengan sistem pendidikan salafiyah yang kuat serta kiprah ekonominya melalui Koperasi BMT Sidogiri yang menjadi model koperasi pesantren nasional. Dengan lebih dari 12.000 santri, Sidogiri terus mencetak ulama-ulama berpengaruh di seluruh Indonesia.',
  'https://images.unsplash.com/photo-1566069174414-fba88f25a597', '["https://images.unsplash.com/photo-1584464431734-08082463e264", "https://images.unsplash.com/photo-1551041777-ed071d335f0b"]'
),
-- 10. Pondok Pesantren Tebuireng - Jombang
(
  10, 11,
  'Pondok Pesantren Tebuireng',
  'Jawa Timur', 'Kabupaten Jombang',
  'Jl. Irian Jaya No. 10, Cukir, Diwek, Jombang, Jawa Timur 61471',
  1899, 3000, 350,
  2000000, 1300000,
  '["Masjid", "Asrama", "Perpustakaan", "Museum", "Lab Komputer", "WiFi", "Klinik", "Lapangan Olahraga"]',
  'campuran',
  'info@tebuireng.org', '(0321) 861810', 'https://www.tebuireng.org',
  'Pondok Pesantren Tebuireng merupakan pesantren bersejarah yang didirikan oleh Hadratussyaikh KH. Hasyim Asy\'ari pada tahun 1899. Sebagai salah satu pesantren tertua dan paling berpengaruh di Indonesia, Tebuireng telah melahirkan banyak tokoh bangsa. Pesantren ini menerapkan sistem pendidikan terpadu yang memadukan kurikulum salaf dan modern, dengan fasilitas lengkap termasuk museum bersejarah.',
  'https://images.unsplash.com/photo-1507537362145-9f7e4e1de542', '["https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa", "https://images.unsplash.com/photo-1542612013-149090623e86"]'
);

-- ========================================
-- INSERT PENDAFTARAN (DUMMY DATA)
-- ========================================
INSERT INTO pendaftaran (
  nomor_pendaftaran, order_id, user_id, pesantren_id, status, payment_status, 
  payment_amount, nama_lengkap, nik, tempat_lahir, tanggal_lahir, 
  jenis_kelamin, alamat, no_hp, nama_ayah, nama_ibu, 
  no_hp_ortu, pekerjaan_ortu
) VALUES 
(
  'REG-20260501-0001', 'ORD-1234567890', 12, 1, 'diproses', 'paid',
  2500000.00, 'Ahmad Fulan', '3273012345678901', 'Bandung', '2008-05-15',
  'L', 'Jl. Merdeka No. 45, Sumur Bandung, Kota Bandung', '081234567890',
  'Budi Santoso', 'Siti Aminah', '081987654321', 'PNS'
),
(
  'REG-20260502-0002', 'ORD-0987654321', 12, 2, 'pending', 'unpaid',
  3000000.00, 'Ahmad Fulan', '3273012345678901', 'Bandung', '2008-05-15',
  'L', 'Jl. Merdeka No. 45, Sumur Bandung, Kota Bandung', '081234567890',
  'Budi Santoso', 'Siti Aminah', '081987654321', 'PNS'
);

-- ========================================
-- Verifikasi data yang diinsert
-- ========================================
SELECT 'Users' as Table_Name, COUNT(*) as Total_Rows FROM users
UNION ALL
SELECT 'Pendaftar Profile', COUNT(*) FROM pendaftar_profile
UNION ALL
SELECT 'Pesantren', COUNT(*) FROM pesantren
UNION ALL
SELECT 'Pendaftaran', COUNT(*) FROM pendaftaran;
