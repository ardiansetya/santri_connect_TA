# Santri Connect API

RESTful API untuk sistem informasi pesantren dengan fitur manajemen pesantren, pendaftaran santri, rekomendasi berbasis scoring, dan integrasi data wilayah Indonesia.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Flow](#-api-flow)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Testing](#-testing)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Security](#-security)
- [Deployment](#-deployment)

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js 22+ |
| **Framework** | Fastify 5.x |
| **Database** | MySQL 8.x |
| **ORM/Driver** | mysql2 (connection pool) |
| **Authentication** | JWT (@fastify/jwt) |
| **Password Hashing** | bcrypt 6.x |
| **File Upload** | @fastify/multipart |
| **Excel Export** | exceljs 4.x |
| **External API** | emsifa/api-wilayah-indonesia |
| **Testing** | Jest 30.x |
| **Dev Server** | nodemon 3.x |
| **Validation** | AJV (built-in Fastify) |

---

## 🏗 Architecture

### MVC Pattern with Service Layer

```
Request → Route → Controller → Service → Model → Database
                ↓              ↓
            Validation     Business Logic
            (AJV Schema)   (Scoring, etc.)
```

### Layer Responsibilities

| Layer | Responsibility | Location |
|-------|---------------|----------|
| **Routes** | Endpoint definitions, schema validation, middleware chain | `src/routes/` |
| **Controllers** | HTTP request/response handling, error mapping | `src/controllers/` |
| **Services** | Business logic, algorithms, data transformation | `src/services/` |
| **Models** | Database queries (CRUD), data access | `src/models/` |
| **Middlewares** | JWT verification, input validation hooks | `src/middlewares/` |
| **Config** | Database connection, environment setup | `src/config/` |

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Database credentials from .env
│   │   └── db.js                # MySQL connection pool
│   ├── controllers/
│   │   ├── auth-controller.js   # Login, register, user management
│   │   ├── pesantren-controller.js
│   │   ├── rekomendasi-controller.js
│   │   ├── pendaftaran-controller.js
│   │   ├── compare-controller.js
│   │   └── wilayah-controller.js
│   ├── middlewares/
│   │   ├── auth-middleware.js   # JWT verification
│   │   └── validate-wilayah.js  # Province/city validation
│   ├── models/
│   │   ├── User.js              # User CRUD operations
│   │   ├── Pesantren.js         # Pesantren CRUD operations
│   │   └── Pendaftaran.js       # Pendaftaran CRUD operations
│   ├── routes/
│   │   ├── index.js             # All route definitions
│   │   ├── public-routes.js     # Public stats endpoint
│   │   └── wilayah-routes.js    # Wilayah Indonesia API
│   ├── services/
│   │   ├── auth-service.js      # Auth logic, admin services
│   │   ├── pesantren-service.js # Pesantren business logic
│   │   ├── rekomendasi-service.js # Rule-based scoring
│   │   ├── pendaftaran-service.js # Registration with file upload
│   │   ├── compare-service.js   # Pesantren comparison
│   │   ├── public-service.js    # Public statistics
│   │   └── wilayah-service.js   # Wilayah API integration with caching
│   └── server.js                # Fastify entry point
├── test/
│   ├── helper.js                # Test utilities
│   ├── auth.test.js             # Authentication tests (16 tests)
│   ├── admin.test.js            # Admin endpoint tests (10 tests)
│   ├── pemilik.test.js          # Pemilik endpoint tests (9 tests)
│   ├── pesantren.test.js        # Pesantren endpoint tests (7 tests)
│   ├── compare.test.js          # Compare endpoint tests (4 tests)
│   └── public.test.js           # Public endpoint tests (4 tests)
├── .env                         # Environment variables
├── .gitignore
├── jest.config.js               # Jest configuration
└── package.json
```

---

## 🗄 Database Schema

### users
| Column | Type | Constraint |
|--------|------|------------|
| id | INT | PK, AUTO_INCREMENT |
| username | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| password | VARCHAR(255) | NOT NULL (bcrypt hash) |
| role | ENUM('superadmin', 'pemilik', 'pendaftar') | DEFAULT 'pendaftar' |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

### pesantren
| Column | Type | Constraint |
|--------|------|------------|
| id | INT | PK, AUTO_INCREMENT |
| user_id | INT | FK → users.id |
| nama | VARCHAR(255) | NOT NULL |
| province | VARCHAR(255) | |
| kota | VARCHAR(255) | |
| alamat | TEXT | |
| tahun_berdiri | INT | |
| jumlah_santri | INT | |
| jumlah_pengajar | INT | |
| biaya_pendaftaran | DECIMAL(15,2) | |
| biaya_bulanan | DECIMAL(15,2) | |
| fasilitas | JSON | |
| kurikulum | ENUM('modern', 'salaf', 'campuran') | |
| email | VARCHAR(255) | |
| telepon | VARCHAR(255) | |
| website | VARCHAR(255) | |
| deskripsi | TEXT | |
| nama_bank | VARCHAR(255) | |
| nomor_rekening | VARCHAR(255) | |
| atas_nama_rekening | VARCHAR(255) | |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

### pendaftaran
| Column | Type | Constraint |
|--------|------|------------|
| id | INT | PK, AUTO_INCREMENT |
| nomor_pendaftaran | VARCHAR(50) | UNIQUE |
| user_id | INT | FK → users.id |
| pesantren_id | INT | FK → pesantren.id |
| status | ENUM('pending', 'diproses', 'diterima', 'ditolak') | DEFAULT 'pending' |
| nama_lengkap | VARCHAR(255) | |
| nik | VARCHAR(16) | |
| tempat_lahir | VARCHAR(255) | |
| tanggal_lahir | DATE | |
| jenis_kelamin | ENUM('L', 'P') | |
| alamat | TEXT | |
| no_hp | VARCHAR(255) | |
| nama_ayah | VARCHAR(255) | |
| nama_ibu | VARCHAR(255) | |
| no_hp_ortu | VARCHAR(255) | |
| pekerjaan_ortu | VARCHAR(255) | |
| foto_ktp | VARCHAR(255) | |
| pas_foto | VARCHAR(255) | |
| kartu_keluarga | VARCHAR(255) | |
| catatan_admin | TEXT | |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

### pendaftar_profile
| Column | Type | Constraint |
|--------|------|------------|
| id | INT | PK, AUTO_INCREMENT |
| user_id | INT | FK → users.id, CASCADE |
| nama_lengkap | VARCHAR(255) | |
| nik | VARCHAR(16) | |
| tempat_lahir | VARCHAR(255) | |
| tanggal_lahir | DATE | |
| jenis_kelamin | ENUM('L', 'P') | |
| alamat | TEXT | |
| no_hp | VARCHAR(255) | |
| nama_ayah | VARCHAR(255) | |
| nama_ibu | VARCHAR(255) | |
| no_hp_ortu | VARCHAR(255) | |
| pekerjaan_ortu | VARCHAR(255) | |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

---

## 🔄 API Flow

### User Registration & Authentication Flow
```
1. POST /api/register { username, email, password, role? }
   → Validate email format, password length (min 6)
   → Validate role (only 'pendaftar' or 'pemilik' allowed)
   → Hash password with bcrypt
   → Save to database with role (default: 'pendaftar')

2. POST /api/login { email, password }
   → Find user by email
   → Compare password with bcrypt
   → Generate JWT token with { id, role }
   → Return token + user info

3. GET /api/me (JWT required)
   → Verify JWT token
   → Return user data (without password)
```

### Pesantren Management Flow (Admin)
```
POST /api/admin/pesantren (superadmin only)
  → Verify JWT + check role === 'superadmin'
  → Validate wilayah (province & city via emsifa API)
  → Validate schema (nama, province, kota required)
  → Save to database

PUT /api/admin/pesantren/:id (superadmin only)
  → Verify JWT + check role
  → Validate wilayah if changed
  → Update database

DELETE /api/admin/pesantren/:id (superadmin only)
  → Verify JWT + check role
  → Delete from database
```

### Pesantren Management Flow (Pemilik)
```
POST /api/pemilik/pesantren (pemilik only)
  → Verify JWT + check role === 'pemilik'
  → Validate wilayah
  → Save with user_id = token.id

PUT /api/pemilik/pesantren/:id (pemilik only)
  → Verify JWT + check role
  → Check ownership (pesantren.user_id === token.id)
  → Validate wilayah if changed
  → Update database
```

### Pendaftaran Flow
```
POST /api/pendaftaran (pendaftar only, multipart/form-data)
  → Verify JWT + check role === 'pendaftar'
  → Parse form data + file uploads
  → Validate required fields
  → Generate unique nomor_pendaftaran (REG-YYYY-XXXXXX)
  → Save files to uploads/ directory
  → Save to database with status 'pending'

GET /api/pendaftaran/status/:nomor (public)
  → Find pendaftaran by nomor
  → Return status + pesantren info
```

### Rekomendasi Flow (Rule-Based Scoring)
```
POST /api/rekomendasi { budget, provinsi, fasilitas }
  → Fetch all pesantren from database
  → Calculate score for each:
    - Budget Score (weight: 0.4): biaya <= budget ? 1 : budget/biaya
    - Location Score (weight: 0.3): province match ? 1 : 0
    - Facilities Score (weight: 0.3): matched/total requested
    - Final Score = (budget * 0.4) + (location * 0.3) + (facilities * 0.3)
  → Sort by score descending
  → Return top 10 results
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- MySQL 8+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/ardiansetya/santri_connect_TA.git
cd santri_connect_TA/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials
```

---

## 🔧 Environment Variables

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=santri_connect
DB_PORT=3306

# JWT
JWT_SECRET=your_secret_key_here

# Server
PORT=3000
NODE_ENV=development
```

---

## 🗄 Database Setup

### 1. Create Database
```sql
CREATE DATABASE santri_connect;
```

### 2. Create Tables
```sql
-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('superadmin', 'pemilik', 'pendaftar') NOT NULL DEFAULT 'pendaftar',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Pesantren table
CREATE TABLE pesantren (
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
  nama_bank VARCHAR(255),
  nomor_rekening VARCHAR(255),
  atas_nama_rekening VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Pendaftaran table
CREATE TABLE pendaftaran (
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
);

-- Pendaftar profile table
CREATE TABLE pendaftar_profile (
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
);
```

### 3. Seed Superadmin User
```sql
-- Create a superadmin user manually (no registration endpoint)
INSERT INTO users (username, email, password, role) VALUES
('superadmin', 'admin@santriconnect.com', '$2b$10$...', 'superadmin');
```

---

## ▶ Running the Application

### Development Mode
```bash
cd backend
npm run dev
```
Server runs at `http://localhost:3000` with auto-reload.

### Production Mode
```bash
cd backend
npm start
```

### Verify Server
```bash
curl http://localhost:3000/health
# Response: {"status":"ok"}
```

---

## 🧪 Testing

### Run All Tests
```bash
cd backend
npm test
```

### Run with Coverage
```bash
npm run test:coverage
```

### Test Results
```
Test Suites: 6 passed, 6 total
Tests:       48 passed, 48 total
```

| Test Suite | Tests | Coverage |
|-----------|-------|----------|
| auth.test.js | 16 | Register, Login, Me, Logout, Role Validation |
| admin.test.js | 10 | Stats, Users, CRUD Pesantren, Auth |
| pemilik.test.js | 9 | CRUD Pesantren, Ownership, Auth |
| pesantren.test.js | 7 | List, Detail, Pagination, Filter |
| compare.test.js | 4 | Compare, Validation |
| public.test.js | 4 | Stats, Wilayah |

### Test Structure
```javascript
// Arrange → Setup data
// Act → Call endpoint via app.inject()
// Assert → Validate response
```

---

## 📡 API Endpoints

### Public Endpoints (No Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/health` | Health check |
| POST | `/api/register` | Register user (pendaftar/pemilik) |
| POST | `/api/login` | Login user |
| GET | `/api/pesantren` | List pesantren (filter, pagination, sorting) |
| GET | `/api/pesantren/:id` | Pesantren detail |
| GET | `/api/pesantren/:id/pendaftaran-info` | Pesantren registration info |
| POST | `/api/rekomendasi` | Pesantren recommendation (scoring) |
| GET | `/api/pendaftaran/status/:nomor` | Track registration status |
| POST | `/api/compare` | Compare pesantren (max 3) |
| GET | `/api/public/stats` | Public statistics |
| GET | `/api/wilayah/provinces` | List provinces (emsifa API) |
| GET | `/api/wilayah/regencies/:provinceId` | List regencies |

### Authenticated Endpoints (JWT Required)
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/me` | Any | Get current user |
| PUT | `/api/me` | Any | Update user data |
| POST | `/api/logout` | Any | Logout |
| POST | `/api/pendaftaran` | pendaftar | Submit registration |

### Admin Endpoints (Superadmin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/users` | List all users |
| POST | `/api/admin/pesantren` | Create pesantren |
| PUT | `/api/admin/pesantren/:id` | Update pesantren |
| DELETE | `/api/admin/pesantren/:id` | Delete pesantren |
| GET | `/api/admin/pendaftaran` | List all registrations |
| GET | `/api/admin/pendaftaran/:id` | Registration detail |
| PUT | `/api/admin/pendaftaran/:id/status` | Update registration status |
| GET | `/api/admin/pendaftaran/export` | Export to Excel |

### Pemilik Endpoints (Pemilik Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pemilik/pesantren` | List own pesantren |
| POST | `/api/pemilik/pesantren` | Create pesantren |
| PUT | `/api/pemilik/pesantren/:id` | Update own pesantren |

---

## 🔐 Authentication

### JWT Token
- **Secret:** Configured via `JWT_SECRET` env variable
- **Payload:** `{ id: number, role: string }`
- **Header:** `Authorization: Bearer <token>`

### Generate Token (Example)
```javascript
const token = fastify.jwt.sign({ id: 1, role: 'pendaftar' })
```

### Role-Based Access Control
| Role | Access |
|------|--------|
| `pendaftar` | View pesantren, submit registration, track status |
| `pemilik` | Manage own pesantren (CRUD with ownership check) |
| `superadmin` | Full access: manage users, pesantren, registrations |

---

## 🛡 Security

### Multi-Layer Security

| Layer | Implementation |
|-------|---------------|
| **Schema Validation** | Fastify AJV validates all inputs (type, format, enum) |
| **Role Validation** | Hardcoded block prevents `superadmin` registration |
| **JWT Verification** | Auth middleware verifies token on protected routes |
| **Role Checks** | Each endpoint verifies user role before processing |
| **Ownership Validation** | Pemilik can only modify their own pesantren |
| **Password Hashing** | bcrypt with salt rounds of 10 |
| **File Upload** | Multipart parsing with controlled file handling |
| **SQL Injection** | Parameterized queries via mysql2 |

### Registration Security
```javascript
// ALLOWED: pendaftar, pemilik
// FORBIDDEN: superadmin (hardcoded block)
const ALLOWED_ROLES = ['pendaftar', 'pemilik']
const FORBIDDEN_ROLES = ['superadmin']
```

---

## 🚀 Deployment

### Environment Setup
```bash
# Production .env
NODE_ENV=production
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
DB_NAME=santri_connect
JWT_SECRET=long-random-secret-key
PORT=3000
```

### PM2 (Process Manager)
```bash
npm install -g pm2
cd backend
pm2 start src/server.js --name santri-connect
pm2 save
pm2 startup
```

### Docker (Optional)
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "src/server.js"]
```

---

## 📝 Notes

### File Uploads
- Files are saved to `backend/uploads/` directory
- Supported: foto_ktp, pas_foto, kartu_keluarga
- Naming format: `{field}-{timestamp}.{ext}`

### Wilayah API
- Data sourced from [emsifa/api-wilayah-indonesia](https://github.com/emsifa/api-wilayah-indonesia)
- Cached in memory to reduce external API calls
- Used for validating province and city on pesantren creation

### Recommendation Algorithm
- Rule-based scoring with configurable weights
- Budget: 40%, Location: 30%, Facilities: 30%
- Returns top 10 results sorted by score

---

## 📄 License

ISC

---

## 👥 Contributors

- Ardian Setya - Backend Development
