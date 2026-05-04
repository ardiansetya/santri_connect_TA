-- ========================================
-- INSERT DATA LENGKAP PESANTREN
-- Format sesuai dengan create pesantren pemilik
-- ========================================

-- Pastikan user tersedia
INSERT IGNORE INTO users (id, username, email, password, role) VALUES
(1, 'admin', 'admin@santriconnect.id', '$2b$10$X7Z5qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qK', 'superadmin'),
(2, 'pemilik1', 'pemilik1@santriconnect.id', '$2b$10$X7Z5qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qK', 'pemilik'),
(3, 'pemilik2', 'pemilik2@santriconnect.id', '$2b$10$X7Z5qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qK', 'pemilik'),
(4, 'pendaftar1', 'pendaftar1@santriconnect.id', '$2b$10$X7Z5qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qK', 'pendaftar');

-- ========================================
-- INSERT DATA PESANTREN
-- Kolom: user_id, nama, province, kota, alamat,
--        tahun_berdiri, jumlah_santri, jumlah_pengajar,
--        biaya_pendaftaran, biaya_bulanan,
--        fasilitas (JSON), kurikulum,
--        email, telepon, website, deskripsi,
--        foto_utama, foto_galeri
-- ========================================

INSERT IGNORE INTO pesantren (
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
  NULL, NULL
),
-- 2. Pondok Pesantren Al-Hikmah - Surabaya
(
  2, 2,
  'Pondok Pesantren Al-Hikmah',
  'Jawa Timur', 'Kota Surabaya',
  'Jl. Ahmad Yani No. 456, Gayungan, Surabaya, Jawa Timur 60234',
  1988, 1200, 180,
  3000000, 1800000,
  '["Masjid", "Asrama", "Perpustakaan", "Lab Komputer", "WiFi", "Klinik", "Kolam Renang", "Aula"]',
  'campuran',
  'info@alhikmah.sch.id', '(031) 8901234', 'https://www.alhikmah.sch.id',
  'Pondok Pesantren Al-Hikmah merupakan salah satu pesantren tertua dan terbesar di Jawa Timur. Berdiri sejak 1988, pesantren ini telah menjadi pusat pendidikan Islam terkemuka yang mengedepankan keseimbangan antara ilmu agama dan ilmu umum. Dengan sistem pondok modern, para santri tinggal di asrama dengan pengawasan 24 jam dari para ustadz dan ustadzah. Kurikulum mencakup pendidikan diniyah, pendidikan formal SMP dan SMA, serta keterampilan hidup.',
  NULL, NULL
),
-- 3. Pondok Pesantren Nurul Islam - Semarang
(
  3, 3,
  'Pondok Pesantren Nurul Islam',
  'Jawa Tengah', 'Kota Semarang',
  'Jl. Kaligawe Raya No. 789, Genuk, Semarang, Jawa Tengah 50117',
  2001, 650, 95,
  2000000, 1200000,
  '["Masjid", "Asrama", "Perpustakaan", "WiFi", "Lapangan Olahraga"]',
  'salaf',
  'info@nurulislam.sch.id', '(024) 6789012', 'https://www.nurulislam.sch.id',
  'Pondok Pesantren Nurul Islam mengusung konsep pendidikan Islam salafiyah dengan fokus pada pendalaman kitab-kitab klasik. Didirikan tahun 2001 oleh KH. Ahmad Fauzi, pesantren ini berkomitmen mencetak generasi ulama yang memahami ilmu agama secara mendalam. Sistem pembelajaran menggunakan metode sorogan, bandongan, dan musyawarah. Kitab yang dipelajari meliputi Fiqih, Aqidah, Akhlak, Nahwu-Shorof, dan Hadits.',
  NULL, NULL
),
-- 4. Pondok Pesantren Ibnu Abbas - Jakarta Timur
(
  4, 3,
  'Pondok Pesantren Ibnu Abbas',
  'DKI Jakarta', 'Kota Jakarta Timur',
  'Jl. Condet Raya No. 321, Kramat Jati, Jakarta Timur 13530',
  2010, 420, 75,
  3500000, 2000000,
  '["Masjid", "Asrama", "Perpustakaan", "Lab Komputer", "WiFi", "AC", "Kantin"]',
  'modern',
  'info@ibnuabbas.sch.id', '(021) 5678901', 'https://www.ibnuabbas.sch.id',
  'Pondok Pesantren Ibnu Abbas hadir sebagai solusi pendidikan Islam modern di jantung ibukota. Berdiri tahun 2010, pesantren ini menawarkan program pendidikan terpadu yang mengintegrasikan kurikulum nasional dengan kurikulum pesantren. Program unggulan: Tahfidz Quran 30 Juz, Bahasa Arab dan Inggris Intensif, IT dan Coding, serta Kewirausahaan. Fasilitas premium dengan ruang ber-AC, lab komputer internet fiber optic, perpustakaan digital, dan CCTV 24 jam.',
  NULL, NULL
),
-- 5. Pondok Pesantren Miftahul Ulum - Malang
(
  5, 2,
  'Pondok Pesantren Miftahul Ulum',
  'Jawa Timur', 'Kabupaten Malang',
  'Jl. Gadingkulon No. 555, Dau, Malang, Jawa Timur 65151',
  1975, 1500, 220,
  1500000, 1000000,
  '["Masjid", "Asrama", "Perpustakaan", "Lab Komputer", "WiFi", "Klinik", "Pertanian", "Peternakan"]',
  'campuran',
  'info@miftahululum.sch.id', '(0341) 4567890', 'https://www.miftahululum.sch.id',
  'Pondok Pesantren Miftahul Ulum adalah pesantren terbesar di Malang Raya dengan lebih dari 1500 santri dan 220 tenaga pengajar. Didirikan tahun 1975 oleh KH. Mohammad Hasan, pesantren ini menerapkan keseimbangan antara pendidikan diniyah, formal, dan keterampilan praktis. Dilengkapi unit pertanian, perkebunan, dan peternakan di area seluas 15 hektar di kaki Gunung Panderman.',
  NULL, NULL
),
-- 6. Pondok Pesantren Hidayatullah - Depok
(
  6, 3,
  'Pondok Pesantren Hidayatullah',
  'Jawa Barat', 'Kota Depok',
  'Jl. Raya Cibinong No. 100, Cimanggis, Depok, Jawa Barat 16451',
  2005, 780, 110,
  2200000, 1400000,
  '["Masjid", "Asrama", "Perpustakaan", "Lab Komputer", "WiFi", "Klinik", "Lapangan Basket"]',
  'modern',
  'info@hidayatullah.sch.id', '(021) 8765432', 'https://www.hidayatullah.sch.id',
  'Pondok Pesantren Hidayatullah berkomitmen mencetak generasi Muslim yang berilmu, beramal, dan berdakwah. Berdiri tahun 2005, pesantren ini mengintegrasikan sistem pendidikan pesantren dengan pendidikan nasional. Program khusus meliputi Tahfidz Quran, kajian kitab kuning, latihan dakwah, dan pelatihan leadership. Prestasi: Juara 1 MTQ Tingkat Provinsi 2022 dan 2023, Juara 2 Pidato Bahasa Arab Nasional 2023.',
  NULL, NULL
),
-- 7. Pondok Pesantren Al-Anwar - Rembang
(
  7, 2,
  'Pondok Pesantren Al-Anwar',
  'Jawa Tengah', 'Kabupaten Rembang',
  'Jl. Raya Sarang No. 01, Sarang, Rembang, Jawa Tengah 59274',
  1967, 2000, 250,
  1200000, 900000,
  '["Masjid", "Asrama", "Perpustakaan", "Pesantren Putri", "Santri Kalong"]',
  'salaf',
  NULL, '(0295) 531234', NULL,
  'Pondok Pesantren Al-Anwar merupakan pesantren salafiyah yang sangat dihormati di Indonesia. Didirikan pada tahun 1967, pesantren ini dikenal sebagai pusat kajian kitab kuning dan ilmu-ilmu agama klasik. Ribuan santri dari seluruh nusantara datang untuk mendalami ilmu fiqih, aqidah, tasawuf, dan bahasa Arab secara intensif.',
  NULL, NULL
),
-- 8. Pondok Pesantren Modern Darussalam Gontor - Ponorogo
(
  8, 3,
  'Pondok Modern Islam Assalaam',
  'Jawa Tengah', 'Kota Surakarta',
  'Jl. Gumpang RT 03/06, Gumpang, Kartasura, Sukoharjo, Jawa Tengah 57169',
  1985, 3500, 400,
  5000000, 2500000,
  '["Masjid", "Asrama", "Perpustakaan", "Lab Komputer", "Lab Bahasa", "WiFi", "Klinik", "Lapangan Olahraga", "Aula", "Kantin", "Koperasi"]',
  'modern',
  'info@assalaam.or.id', '(0271) 783027', 'https://www.assalaam.or.id',
  'Pondok Modern Islam Assalaam adalah salah satu pesantren modern terbesar di Indonesia dengan sistem pendidikan yang mengutamakan penguasaan Bahasa Arab dan Inggris sebagai bahasa pengantar. Berdiri sejak 1985, pesantren ini telah melahirkan ribuan alumni yang berkiprah di berbagai sektor. Kurikulum mencakup pendidikan SMP, SMA, dan Ma\'had Aly dengan integrasi penuh antara ilmu agama dan ilmu umum.',
  NULL, NULL
),
-- 9. Pondok Pesantren Sidogiri - Pasuruan
(
  9, 2,
  'Pondok Pesantren Sidogiri',
  'Jawa Timur', 'Kabupaten Pasuruan',
  'Jl. Sidogiri No. 1, Kraton, Pasuruan, Jawa Timur 67151',
  1718, 12000, 800,
  800000, 700000,
  '["Masjid", "Asrama", "Perpustakaan", "Koperasi", "BMT", "Percetakan", "Pertanian"]',
  'salaf',
  NULL, '(0343) 411517', 'https://www.sidogiri.net',
  'Pondok Pesantren Sidogiri adalah salah satu pesantren tertua di Indonesia, berdiri sejak 1718. Pesantren ini terkenal dengan sistem pendidikan salafiyah yang kuat serta kiprah ekonominya melalui Koperasi BMT Sidogiri yang menjadi model koperasi pesantren nasional. Dengan lebih dari 12.000 santri, Sidogiri terus mencetak ulama-ulama berpengaruh di seluruh Indonesia.',
  NULL, NULL
),
-- 10. Pondok Pesantren Tebuireng - Jombang
(
  10, 3,
  'Pondok Pesantren Tebuireng',
  'Jawa Timur', 'Kabupaten Jombang',
  'Jl. Irian Jaya No. 10, Cukir, Diwek, Jombang, Jawa Timur 61471',
  1899, 3000, 350,
  2000000, 1300000,
  '["Masjid", "Asrama", "Perpustakaan", "Museum", "Lab Komputer", "WiFi", "Klinik", "Lapangan Olahraga"]',
  'campuran',
  'info@tebuireng.org', '(0321) 861810', 'https://www.tebuireng.org',
  'Pondok Pesantren Tebuireng merupakan pesantren bersejarah yang didirikan oleh Hadratussyaikh KH. Hasyim Asy\'ari pada tahun 1899. Sebagai salah satu pesantren tertua dan paling berpengaruh di Indonesia, Tebuireng telah melahirkan banyak tokoh bangsa. Pesantren ini menerapkan sistem pendidikan terpadu yang memadukan kurikulum salaf dan modern, dengan fasilitas lengkap termasuk museum bersejarah.',
  NULL, NULL
);

-- Reset auto-increment
ALTER TABLE pesantren AUTO_INCREMENT = 11;

-- ========================================
-- Verifikasi data yang diinsert
-- ========================================
SELECT
  id,
  nama,
  province,
  kota,
  kurikulum,
  jumlah_santri,
  biaya_pendaftaran,
  biaya_bulanan,
  LEFT(deskripsi, 80) AS deskripsi_preview
FROM pesantren
ORDER BY id;
