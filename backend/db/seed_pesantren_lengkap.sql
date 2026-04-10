-- ========================================
-- INSERT DATA LENGKAP PESANTREN
-- ========================================

-- First, ensure we have some users
INSERT IGNORE INTO users (id, username, email, password, role) VALUES
(1, 'admin', 'admin@santriconnect.id', '$2b$10$X7Z5qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qK', 'superadmin'),
(2, 'pemilik1', 'pemilik1@santriconnect.id', '$2b$10$X7Z5qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qK', 'pemilik'),
(3, 'pemilik2', 'pemilik2@santriconnect.id', '$2b$10$X7Z5qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qK', 'pemilik'),
(4, 'pendaftar1', 'pendaftar1@santriconnect.id', '$2b$10$X7Z5qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qKxJ9qK', 'pendaftar');

-- Insert Pesantren with complete data
INSERT INTO pesantren (
  id, user_id, nama, province, kota, alamat, 
  tahun_berdiri, jumlah_santri, jumlah_pengajar, 
  biaya_pendaftaran, biaya_bulanan, 
  fasilitas, kurikulum, 
  email, telepon, website, 
  deskripsi,
  foto_utama, foto_galeri,
  nama_bank, nomor_rekening, atas_nama_rekening
) VALUES
(
  1,
  2,
  'Pondok Pesantren Darul Quran',
  'Jawa Barat',
  'Bandung',
  'Jl. Raya Cibiru No. 123, Cibiru, Bandung, Jawa Barat 40615',
  1995,
  850,
  120,
  2500000.00,
  1500000.00,
  '["Masjid", "Asrama", "Perpustakaan", "Lab Komputer", "WiFi", "Klinik", "Lapangan Olahraga", "Kantin"]',
  'modern',
  'info@darulquran.sch.id',
  '(022) 7890123',
  'https://www.darulquran.sch.id',
  'Pondok Pesantren Darul Quran adalah salah satu pondok pesantren terkemuka di Jawa Barat yang menggabungkan kurikulum modern dengan nilai-nilai Islam tradisional. Didirikan pada tahun 1995, pesantren ini telah mendidik lebih dari 5000 alumni yang sukses di berbagai bidang.\n\nDengan luas area 5 hektar, pesantren ini memiliki fasilitas lengkap termasuk masjid berkapasitas 2000 jamaah, asrama nyaman, perpustakaan dengan 10.000+ koleksi buku, laboratorium komputer modern, dan lapangan olahraga. Program unggulan meliputi Tahfidz Quran, Bahasa Arab & Inggris, Sains & Teknologi, serta Kewirausahaan.\n\nVisi kami adalah mencetak generasi Muslim yang berilmu, berakhlak mulia, dan berdaya saing global.',
  'pesantren_1_main.jpg',
  '["pesantren_1_gallery_1.jpg", "pesantren_1_gallery_2.jpg", "pesantren_1_gallery_3.jpg", "pesantren_1_gallery_4.jpg"]',
  'Bank Syariah Indonesia',
  '7123456789',
  'Yayasan Darul Quran'
),
(
  2,
  2,
  'Pondok Pesantren Al-Hikmah',
  'Jawa Timur',
  'Surabaya',
  'Jl. Ahmad Yani No. 456, Gayungan, Surabaya, Jawa Timur 60234',
  1988,
  1200,
  180,
  3000000.00,
  1800000.00,
  '["Masjid", "Asrama", "Perpustakaan", "Lab Komputer", "WiFi", "Klinik", "Kolam Renang", "Aula"]',
  'campuran',
  'info@alhikmah.sch.id',
  '(031) 8901234',
  'https://www.alhikmah.sch.id',
  'Pondok Pesantren Al-Hikmah merupakan salah satu pesantren tertua dan terbesar di Jawa Timur. Berdiri sejak 1988, pesantren ini telah menjadi pusat pendidikan Islam terkemuka yang mengedepankan keseimbangan antara ilmu agama dan ilmu umum.\n\nDengan sistem pondok modern, para santri tinggal di asrama dengan pengawasan 24 jam dari para ustadz dan ustadzah. Kurikulum yang diterapkan mencakup pendidikan diniyah (fiqh, aqidah, akhlak, nahwu-shorof), pendidikan formal (SMP & SMA), serta keterampilan hidup (life skills).\n\nFasilitas unggulan meliputi masjid jami\', perpustakaan digital, laboratorium sains & komputer, kolam renang, dan aula serbaguna. Ekstrakurikuler: Pramuka, Pencak Silat, Panahan, Kaligrafi, Jurnalistik, dan Robotika.',
  'pesantren_2_main.jpg',
  '["pesantren_2_gallery_1.jpg", "pesantren_2_gallery_2.jpg", "pesantren_2_gallery_3.jpg"]',
  'Bank Muamalat',
  '8234567890',
  'Yayasan Al-Hikmah Surabaya'
),
(
  3,
  3,
  'Pondok Pesantren Nurul Islam',
  'Jawa Tengah',
  'Semarang',
  'Jl. Kaligawe Raya No. 789, Genuk, Semarang, Jawa Tengah 50117',
  2001,
  650,
  95,
  2000000.00,
  1200000.00,
  '["Masjid", "Asrama", "Perpustakaan", "WiFi", "Lapangan Olahraga"]',
  'salaf',
  'info@nurulislam.sch.id',
  '(024) 6789012',
  'https://www.nurulislam.sch.id',
  'Pondok Pesantren Nurul Islam mengusung konsep pendidikan Islam salafiyah dengan fokus pada pendalaman kitab-kitab klasik (turats). Didirikan tahun 2001 oleh KH. Ahmad Fauzi, pesantren ini berkomitmen mencetak generasi ulama yang memahami ilmu agama secara mendalam.\n\nSistem pembelajaran menggunakan metode sorogan (individual), bandongan (klasikal), dan musyawarah (diskusi). Kitab yang dipelajari meliputi: Fiqih (Fathul Qarib, Fathul Muin), Aqidah (Aqidatul Awam, Tijanud Darori), Akhlak (Ta\'lim Muta\'allim, Bidayatul Hidayah), Nahwu-Shorof (Alfiyah Ibnu Malik, Jurumiyah), dan Hadits (Bulughul Maram, Riyadhus Shalihin).\n\nPara santri dibimbing untuk memiliki kompetensi di bidang:\n- Bahasa Arab aktif (percakapan & tulisan)\n- Baca kitab kuning (klasik)\n- Memimpin masyarakat (imamah)\n- Dakwah & pengajaran',
  'pesantren_3_main.jpg',
  '["pesantren_3_gallery_1.jpg", "pesantren_3_gallery_2.jpg"]',
  'Bank BRI',
  '9345678901',
  'Yayasan Nurul Islam'
),
(
  4,
  3,
  'Pondok Pesantren Ibnu Abbas',
  'DKI Jakarta',
  'Jakarta Timur',
  'Jl. Condet Raya No. 321, Kramat Jati, Jakarta Timur 13530',
  2010,
  420,
  75,
  3500000.00,
  2000000.00,
  '["Masjid", "Asrama", "Perpustakaan", "Lab Komputer", "WiFi", "AC", "Kantin"]',
  'modern',
  'info@ibnuabbas.sch.id',
  '(021) 5678901',
  'https://www.ibnuabbas.sch.id',
  'Pondok Pesantren Ibnu Abbas hadir sebagai solusi pendidikan Islam modern di jantung ibukota. Berdiri tahun 2010, pesantren ini menawarkan program pendidikan terpadu yang mengintegrasikan kurikulum nasional (Diknas) dengan kurikulum pesantren (Diniyah).\n\nProgram unggulan:\n🎓 Tahfidz Quran 30 Juz (target 3-5 tahun)\n🌐 Bahasa Arab & Inggris Intensif\n💻 IT & Coding (Web Development, Mobile Apps)\n📊 Sains Terapan (Matematika, Fisika, Biologi)\n💼 Kewirausahaan & Leadership\n\nFasilitas premium:\n- Ruang ber-AC di semua asrama\n- Lab komputer dengan internet fiber optic\n- Perpustakaan digital (e-books & e-journals)\n- Masjid ber-AC dengan sound system modern\n- Kantin sehat dengan menu bergizi\n- CCTV 24 jam untuk keamanan\n\nTenaga pengajar berasal dari lulusan universitas terkemuka dalam & luar negeri (Al-Azhar Kairo, Madinah University, UIN, UI, ITB).',
  'pesantren_4_main.jpg',
  '["pesantren_4_gallery_1.jpg", "pesantren_4_gallery_2.jpg", "pesantren_4_gallery_3.jpg"]',
  'Bank DKI Syariah',
  '1456789012',
  'Yayasan Ibnu Abbas'
),
(
  5,
  2,
  'Pondok Pesantren Miftahul Ulum',
  'Jawa Timur',
  'Malang',
  'Jl. Gadingkulon No. 555, Dau, Malang, Jawa Timur 65151',
  1975,
  1500,
  220,
  1500000.00,
  1000000.00,
  '["Masjid", "Asrama", "Perpustakaan", "Lab Komputer", "WiFi", "Klinik", "Pertanian", "Peternakan"]',
  'campuran',
  'info@miftahululum.sch.id',
  '(0341) 4567890',
  'https://www.miftahululum.sch.id',
  'Pondok Pesantren Miftahul Ulum adalah pesantren terbesar di Malang Raya dengan lebih dari 1500 santri dan 220 tenaga pengajar. Didirikan tahun 1975 oleh KH. Mohammad Hasan, pesantren ini telah menghasilkan ribuan alumni yang sukses di berbagai bidang.\n\nKonsep pendidikan yang diterapkan adalah keseimbangan antara:\n📚 Pendidikan Diniyah (Ilmu Agama)\n🎓 Pendidikan Formal (SMP-SMA-S1)\n🌱 Keterampilan Praktis (Vocational Skills)\n\nProgram unggulan:\n- Takhassus (program spesialisasi ilmu agama)\n- Ma\'had Aly (pendidikan tinggi Islam)\n- SMP & SMA Islam Terpadu\n- STAI Miftahul Ulum (S1)\n- Unit Pertanian & Perkebunan\n- Unit Peternakan (Sapi, Kambing, Ayam)\n- Koperasi Pesantren\n\nDengan area seluas 15 hektar di kaki Gunung Panderman, pesantren ini menawarkan lingkungan belajar yang asri, sejuk, dan kondusif untuk menuntut ilmu.',
  'pesantren_5_main.jpg',
  '["pesantren_5_gallery_1.jpg", "pesantren_5_gallery_2.jpg", "pesantren_5_gallery_3.jpg", "pesantren_5_gallery_4.jpg", "pesantren_5_gallery_5.jpg"]',
  'BNI Syariah',
  '2567890123',
  'Yayasan Miftahul Ulum'
),
(
  6,
  3,
  'Pondok Pesantren Hidayatullah',
  'Banten',
  'Depok',
  'Jl. Raya Cibinong No. 100, Cimanggis, Depok, Jawa Barat 16451',
  2005,
  780,
  110,
  2200000.00,
  1400000.00,
  '["Masjid", "Asrama", "Perpustakaan", "Lab Komputer", "WiFi", "Klinik", "Lapangan Basket"]',
  'modern',
  'info@hidayatullah.sch.id',
  '(021) 8765432',
  'https://www.hidayatullah.sch.id',
  'Pondok Pesantren Hidayatullah berkomitmen untuk mencetak generasi Muslim yang berilmu, beramal, dan berdakwah. Berdiri tahun 2005, pesantren ini mengintegrasikan sistem pendidikan pesantren dengan pendidikan nasional.\n\nKurikulum yang diterapkan:\n📖 Kurikulum Diniyah: Aqidah, Fiqih, Akhlak, Qur\'an Hadits, Sejarah Islam\n📚 Kurikulum Nasional: SMP & SMA (Kemendikbud)\n🌍 Bahasa Asing: Arab & Inggris (aktif)\n💻 Keterampilan: Komputer, Desain Grafis, Public Speaking\n\nProgram khusus:\n- Tahfidz Quran (target 20-30 juz)\n- Kajian Kitab Kuning\n- Latihan Dakwah & Jurnalistik\n- Pelatihan Leadership & Manajemen\n- Olahraga: Basket, Futsal, Panahan\n\nPrestasi:\n🏆 Juara 1 MTQ Tingkat Provinsi (2022, 2023)\n🏆 Juara 2 Pidato Bahasa Arab Nasional (2023)\n🏆 Juara 3 Olimpiade Matematika Islam (2022)',
  'pesantren_6_main.jpg',
  '["pesantren_6_gallery_1.jpg", "pesantren_6_gallery_2.jpg", "pesantren_6_gallery_3.jpg"]',
  'Bank Mega Syariah',
  '3678901234',
  'Yayasan Hidayatullah'
);

-- ========================================
-- Update foto_galeri to use placeholder URLs for testing
-- ========================================
UPDATE pesantren SET foto_galeri = JSON_ARRAY(
  'https://placehold.co/800x600/3b82f6/white?text=Gallery+1',
  'https://placehold.co/800x600/10b981/white?text=Gallery+2',
  'https://placehold.co/800x600/f59e0b/white?text=Gallery+3'
) WHERE id = 1;

UPDATE pesantren SET foto_galeri = JSON_ARRAY(
  'https://placehold.co/800x600/8b5cf6/white?text=Gallery+1',
  'https://placehold.co/800x600/ec4899/white?text=Gallery+2'
) WHERE id = 2;

UPDATE pesantren SET foto_galeri = JSON_ARRAY(
  'https://placehold.co/800x600/14b8a6/white?text=Gallery+1',
  'https://placehold.co/800x600/f97316/white?text=Gallery+2',
  'https://placehold.co/800x600/06b6d4/white?text=Gallery+3'
) WHERE id = 3;

UPDATE pesantren SET foto_galeri = JSON_ARRAY(
  'https://placehold.co/800x600/6366f1/white?text=Gallery+1',
  'https://placehold.co/800x600/84cc16/white?text=Gallery+2'
) WHERE id = 4;

UPDATE pesantren SET foto_galeri = JSON_ARRAY(
  'https://placehold.co/800x600/e11d48/white?text=Gallery+1',
  'https://placehold.co/800x600/0ea5e9/white?text=Gallery+2',
  'https://placehold.co/800x600/8b5cf6/white?text=Gallery+3',
  'https://placehold.co/800x600/d946ef/white?text=Gallery+4'
) WHERE id = 5;

UPDATE pesantren SET foto_galeri = JSON_ARRAY(
  'https://placehold.co/800x600/22c55e/white?text=Gallery+1',
  'https://placehold.co/800x600/eab308/white?text=Gallery+2'
) WHERE id = 6;

-- ========================================
-- Set foto_utama to placeholder URLs
-- ========================================
UPDATE pesantren SET foto_utama = 'https://placehold.co/1200x800/3b82f6/white?text=Darul+Quran' WHERE id = 1;
UPDATE pesantren SET foto_utama = 'https://placehold.co/1200x800/10b981/white?text=Al-Hikmah' WHERE id = 2;
UPDATE pesantren SET foto_utama = 'https://placehold.co/1200x800/f59e0b/white?text=Nurul+Islam' WHERE id = 3;
UPDATE pesantren SET foto_utama = 'https://placehold.co/1200x800/8b5cf6/white?text=Ibnu+Abbas' WHERE id = 4;
UPDATE pesantren SET foto_utama = 'https://placehold.co/1200x800/ec4899/white?text=Miftahul+Ulum' WHERE id = 5;
UPDATE pesantren SET foto_utama = 'https://placehold.co/1200x800/06b6d4/white?text=Hidayatullah' WHERE id = 6;

-- ========================================
-- Verify inserted data
-- ========================================
SELECT 
  id,
  nama,
  province,
  kota,
  tahun_berdiri,
  jumlah_santri,
  biaya_pendaftaran,
  kurikulum,
  LEFT(deskripsi, 100) as deskripsi_preview
FROM pesantren
ORDER BY id;
