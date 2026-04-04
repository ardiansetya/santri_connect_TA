# [FEATURE] Implementasi Unit Testing API (Fastify)

## Deskripsi

Buat unit test untuk seluruh endpoint API dalam sistem menggunakan framework testing (misalnya: Jest atau Vitest). Testing bertujuan untuk memastikan setiap endpoint berjalan sesuai spesifikasi dan menangani berbagai kondisi (success & error). Gunakan Context7

Fitur ini mendukung:

* Validasi fungsionalitas endpoint
* Meningkatkan reliability sistem
* Memastikan kualitas kode sebelum deployment

---

## Struktur Folder & File

Buat folder khusus untuk testing:

```bash
test/
```

Struktur yang disarankan:

```bash
test/
  auth.test.js
  profile.test.js
  pesantren.test.js
  rekomendasi.test.js
  pendaftaran.test.js
  admin.test.js
  pemilik.test.js
  utils.test.js
```

---

## Tools & Library

Gunakan:

* Jest / Vitest (testing framework)
* Supertest (HTTP testing)
* Fastify inject (opsional, built-in Fastify)

---

## Tahapan Implementasi (High-Level)

### 1. Setup Environment Testing

* Konfigurasi environment khusus testing
* Gunakan database terpisah atau mock database
* Siapkan data dummy untuk testing

---

### 2. Setup Server Instance

* Import Fastify app tanpa menjalankan server
* Gunakan instance untuk testing request

---

### 3. Struktur Testing

Gunakan pola:

* Arrange → Setup data
* Act → Call endpoint
* Assert → Validasi response

---

## Skenario Unit Test (WAJIB LENGKAP)

---

### 🔐 1. AUTHENTICATION

#### POST /api/register

* ✅ Registrasi berhasil
* ❌ Email sudah terdaftar
* ❌ Input tidak valid

#### POST /api/login

* ✅ Login berhasil
* ❌ Password salah
* ❌ User tidak ditemukan

#### GET /api/me

* ✅ Token valid
* ❌ Token tidak ada
* ❌ Token invalid

#### PUT /api/me

* ✅ Update berhasil
* ❌ Data tidak valid

#### POST /api/logout

* ✅ Logout berhasil

---

### 👤 2. PROFILE

#### GET /api/profile

* ✅ Data profile berhasil diambil
* ❌ Unauthorized

#### PUT /api/profile

* ✅ Update profile berhasil
* ❌ Input invalid

---

### 🏫 3. PESANTREN

#### GET /api/pesantren

* ✅ Get list tanpa filter
* ✅ Get list dengan filter
* ✅ Pagination berjalan
* ❌ Query invalid

#### GET /api/pesantren/:id

* ✅ Data ditemukan
* ❌ Data tidak ditemukan

---

### 🤖 4. REKOMENDASI

#### POST /api/rekomendasi

* ✅ Rekomendasi berhasil
* ❌ Input tidak valid
* ✅ Skor terurut dengan benar

---

### 📝 5. PENDAFTARAN

#### POST /api/pendaftaran

* ✅ Pendaftaran berhasil
* ❌ File tidak valid
* ❌ Input tidak lengkap

#### GET /api/pendaftaran/status/:nomor

* ✅ Data ditemukan
* ❌ Nomor tidak ditemukan

#### GET /api/pesantren/:id/pendaftaran-info

* ✅ Data berhasil diambil
* ❌ Pesantren tidak ditemukan

---

### 🛠️ 6. ADMIN

#### GET /api/admin/stats

* ✅ Data statistik berhasil
* ❌ Unauthorized
* ❌ Forbidden

#### GET /api/admin/users

* ✅ List user berhasil
* ❌ Unauthorized

---

### 🏫 ADMIN PESANTREN

#### POST /api/admin/pesantren

* ✅ Create berhasil
* ❌ Input invalid

#### PUT /api/admin/pesantren/:id

* ✅ Update berhasil
* ❌ Data tidak ditemukan

#### DELETE /api/admin/pesantren/:id

* ✅ Delete berhasil
* ❌ Data tidak ditemukan

---

### 📂 ADMIN PENDAFTARAN

#### GET /api/admin/pendaftaran

* ✅ List berhasil
* ✅ Filter bekerja

#### GET /api/admin/pendaftaran/:id

* ✅ Detail berhasil
* ❌ Data tidak ditemukan

#### PUT /api/admin/pendaftaran/:id/status

* ✅ Update status berhasil
* ❌ Status invalid

#### GET /api/admin/pendaftaran/export

* ✅ File berhasil di-download

---

### 🏢 7. PEMILIK

#### GET /api/pemilik/pesantren

* ✅ Data milik sendiri
* ❌ Tidak boleh akses milik orang lain

#### POST /api/pemilik/pesantren

* ✅ Create berhasil
* ❌ Input invalid

#### PUT /api/pemilik/pesantren/:id

* ✅ Update milik sendiri
* ❌ Forbidden jika bukan milik sendiri

---

### ⚙️ 8. UTILITIES

#### POST /api/compare

* ✅ Compare berhasil
* ❌ Lebih dari batas maksimal
* ❌ ID tidak valid

---

### 🌍 9. PUBLIC

#### GET /api/public/stats

* ✅ Data statistik berhasil

---

## Validasi Testing

Pastikan setiap test memverifikasi:

* Status code (200, 201, 400, 401, 403, 404)
* Struktur response JSON
* Data yang dikembalikan sesuai

---

## Best Practice

* Gunakan data dummy konsisten
* Reset database setiap test (isolation)
* Gunakan mock untuk dependency eksternal
* Pisahkan test per module

---

## Output yang Diharapkan

* Semua endpoint memiliki unit test
* Minimal coverage ≥ 80%
* Sistem stabil dan teruji

---

#