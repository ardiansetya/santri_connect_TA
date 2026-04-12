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

## 🚀 Instalasi & Setup

Ikuti langkah berikut untuk menjalankan project di mesin lokal Anda:

### **1. Persiapan Database**
Buat database baru di MySQL:
```sql
CREATE DATABASE santri_connect;
```

### **2. Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Masukkan konfigurasi DB dan Midtrans Key di .env
node run-migration.js # Inialisasi tabel (Opsional, pastikan script tersedia)
npm run dev
```

### **3. Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Sesuaikan VITE_API_URL dan VITE_MIDTRANS_CLIENT_KEY
npm run dev
```

Platform akan berjalan di:
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:3000`

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
