# 🕌 Santri Connect

> **Digitalisasi Manajemen & Pendaftaran Pesantren Indonesia**
>
> Sebuah platform ekosistem digital premium yang menghubungkan calon santri dengan lembaga pesantren di seluruh Indonesia melalui sistem informasi terpadu, rekomendasi cerdas, dan gerbang pembayaran otomatis.

---

## 🌟 Overview

**Santri Connect** adalah solusi *all-in-one* yang dirancang untuk memodernisasi cara pesantren dan wali santri berinteraksi. Mulai dari pencarian lokasi, perbandingan fasilitas, hingga proses pendaftaran dan pembayaran biaya administrasi yang kini dapat dilakukan secara *seamless* dalam satu platform.

### ✨ Fitur Utama

- **🚀 Smart Recommendation**: Sistem rekomendasi berbasis scoring yang membantu wali santri menemukan pesantren terbaik berdasarkan budget, lokasi, dan fasilitas.
- **📊 Interactive Comparison**: Bandingkan hingga 3 pesantren sekaligus untuk melihat perbedaan fasilitas, kurikulum, dan biaya secara berdampingan.
- **💳 Midtrans Payment**: Integrasi gerbang pembayaran otomatis (Snap API) untuk pembayaran biaya pendaftaran yang aman dan praktis.
- **📍 Wilayah Integration**: Data administratif yang akurat menggunakan basis data Wilayah Indonesia terkini.
- **🛡️ Multi-Role Dashboard**: Panel khusus untuk **Superadmin**, **Pemilik Pesantren**, dan **Wali Santri/Pendaftar** dengan hak akses yang terenkripsi.
- **🔍 Real-time Tracking**: Lacak status verifikasi dokumen pendaftaran secara langsung melalui nomor registrasi unik.

---

## 🛠 Tech Stack

Aplikasi ini dibangun menggunakan arsitektur modern yang memisahkan antara *logic* bisnis dan *user experience*.

### **Backend (Fastify Engine)**
- **Runtime**: Node.js 22+
- **Framework**: [Fastify 5](https://fastify.io/) (High performance, low overhead)
- **Database**: MySQL 8.x
- **Payment Gateway**: Midtrans Snap API
- **Auth**: JWT (@fastify/jwt) & Bcrypt
- **Validation**: AJV Schema Validation

### **Frontend (Vue 3 Ecosystem)**
- **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS & Tailwind CSS
- **State Management**: Reactive State (Ref/Computed)
- **Toast**: Vue-Toastification
- **Pinia**: Pinia State Management

---

## 🏗 Project Structure

```bash
santri_connect/
├── backend/            # Fastify Server & Business Logic
│   ├── src/            # Source Code (MVC Layer)
│   ├── test/           # Unit & Integration Tests (Jest)
│   └── uploads/        # Storage Dokumen Pendaftaran
├── frontend/           # Vue 3 UI Application
│   ├── src/
│   │   ├── components/ # Reusable UI Components
│   │   ├── views/      # Page Components
│   │   └── services/   # API Connection Layer
│   └── public/         # Static Assets
└── README.md           # Documentation Utama
```

---

## 🚀 Instalasi & Setup (Lokal)

Ikuti panduan langkah demi langkah berikut untuk menjalankan **Santri Connect** di mesin lokal Anda. Pastikan Node.js (v22+) dan MySQL sudah terinstall.

### **1. Setup Database & Konfigurasi Lingkungan (Backend)**
Buka terminal dan arahkan ke direktori `backend`:
```bash
cd backend
npm install
```

Salin file `.env` dan sesuaikan kredensial MySQL Anda (serta kunci Midtrans):
```bash
cp .env.example .env
```

**Inisialisasi Database:**
Kami telah menyediakan *script* otomatis untuk membuat tabel dan mengisi data dasar:
```bash
npm run db:init
```

**Seeding Data Skala Besar (Opsional tapi Direkomendasikan):**
Untuk mengisi aplikasi dengan 100 pesantren dan ribuan data pendaftar simulasi:
```bash
npm run seed:large
```
> **Catatan:** Perintah ini akan menghapus data lama (jika ada) dan melakukan reset bersih pada database `santri_connect`.

### **2. Menjalankan Server Backend**
Setelah database siap, jalankan server pengembangan:
```bash
npm run dev
```
*Server akan berjalan di `http://localhost:3000`*

### **3. Setup Lingkungan Frontend**
Buka terminal baru dan arahkan ke direktori `frontend`:
```bash
cd frontend
npm install
cp .env.example .env
```
*(Pastikan `VITE_API_URL=http://localhost:3000` di dalam `.env` frontend)*

Jalankan server aplikasi frontend:
```bash
npm run dev
```
*Aplikasi web akan berjalan di `http://localhost:5173`*

---

## 🔑 Akun Default (Hasil Seeder)

Jika Anda menjalankan `npm run seed:large`, gunakan kredensial berikut:

- **Superadmin:**
  - **Email:** `admin@santriconnect.com`
  - **Password:** `admin123`
- **Pendaftar / Santri:**
  - **Username:** `santri_1_1` (pola: `santri_{pesantren_id}_{index}`)
  - **Password:** `pendaftar123`
- **Pemilik Pesantren:**
  - **Email:** `pemilik.pesantren1@test.com` (pola: `pemilik.pesantren{id}@test.com`)
  - **Password:** `password123`

---

## 🔒 Security Practices
- **Parameterized Queries**: Melindungi dari SQL Injection.
- **JWT Auth**: Keamanan akses API antar role.
- **File Validation**: Pembatasan tipe file (JPG/PNG/PDF) dan ukuran maksimal 2MB.
- **Environment Separation**: Pemisahan kredensial sensitif menggunakan `.env`.

---

## 📄 License
Project ini dikembangkan untuk kebutuhan akademik dan profesional. Hak Cipta &copy; 2026.

---

**Santri Connect** - *Menghubungkan Hati, Mempermudah Langkah Menuju Ilmu.*

