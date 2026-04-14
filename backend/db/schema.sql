-- ========================================================
-- SANTRI CONNECT DATABASE SCHEMA
-- Standardized Version: 1.1.0
-- ========================================================

-- SET FOREIGN_KEY_CHECKS = 0;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('superadmin', 'pemilik', 'pendaftar') NOT NULL DEFAULT 'pendaftar',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Pesantren Table
CREATE TABLE IF NOT EXISTS pesantren (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  nama VARCHAR(255) NOT NULL,
  province VARCHAR(255),
  kota VARCHAR(255),
  alamat TEXT,
  tahun_berdiri INT,
  jumlah_santri INT,
  jumlah_pengajar INT,
  biaya_pendaftaran DECIMAL(15,2),
  biaya_bulanan DECIMAL(15,2),
  fasilitas JSON,
  kurikulum ENUM('modern', 'salaf', 'campuran'),
  email VARCHAR(255),
  telepon VARCHAR(255),
  website VARCHAR(255),
  deskripsi TEXT,
  foto_utama VARCHAR(500) DEFAULT NULL,
  foto_galeri JSON DEFAULT NULL,
  nama_bank VARCHAR(255),
  nomor_rekening VARCHAR(255),
  atas_nama_rekening VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Pendaftaran Table
CREATE TABLE IF NOT EXISTS pendaftaran (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nomor_pendaftaran VARCHAR(50) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  pesantren_id INT NOT NULL,
  status ENUM('pending', 'diproses', 'diterima', 'ditolak') DEFAULT 'pending',
  nama_lengkap VARCHAR(255),
  nik VARCHAR(16),
  tempat_lahir VARCHAR(255),
  tanggal_lahir DATE,
  jenis_kelamin ENUM('L', 'P'),
  alamat TEXT,
  no_hp VARCHAR(255),
  nama_ayah VARCHAR(255),
  nama_ibu VARCHAR(255),
  no_hp_ortu VARCHAR(255),
  pekerjaan_ortu VARCHAR(255),
  foto_ktp VARCHAR(255),
  pas_foto VARCHAR(255),
  kartu_keluarga VARCHAR(255),
  catatan_admin TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (pesantren_id) REFERENCES pesantren(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Pendaftar Profile Table
CREATE TABLE IF NOT EXISTS pendaftar_profile (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  nama_lengkap VARCHAR(255),
  nik VARCHAR(16),
  tempat_lahir VARCHAR(255),
  tanggal_lahir DATE,
  jenis_kelamin ENUM('L', 'P'),
  alamat TEXT,
  no_hp VARCHAR(255),
  nama_ayah VARCHAR(255),
  nama_ibu VARCHAR(255),
  no_hp_ortu VARCHAR(255),
  pekerjaan_ortu VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- SET FOREIGN_KEY_CHECKS = 1;
