# [REFACTOR] Restructure Project to MVC Architecture

## Deskripsi
Refactor struktur project dari flat structure menjadi arsitektur MVC yang lebih terorganisir dan scalable.

## Perubahan Struktur

### Sebelum:
```
src/
├── config/
├── middlewares/
├── plugins/
├── routes/          # Semua route files
├── services/        # Campuran business logic + DB queries
└── index.js
```

### Sesudah:
```
src/
├── config/
│   ├── database.js      # DB credentials dari .env
│   └── db.js            # MySQL connection pool
├── controllers/         # Handle request/response, validasi
│   ├── auth-controller.js
│   ├── pesantren-controller.js
│   ├── rekomendasi-controller.js
│   └── pendaftaran-controller.js
├── middlewares/
│   └── auth-middleware.js
├── models/              # MySQL queries (CRUD operations)
│   ├── User.js
│   ├── Pesantren.js
│   └── Pendaftaran.js
├── routes/
│   └── index.js         # Semua route definitions → controllers
├── services/            # Business logic only
│   ├── auth-service.js
│   ├── pesantren-service.js
│   ├── rekomendasi-service.js
│   └── pendaftaran-service.js
├── utils/
└── server.js            # Fastify entry point
```

## Pemisahan Tanggung Jawab

| Layer | Tanggung Jawab |
|-------|----------------|
| **Routes** | Definisi endpoint, schema validation, mapping ke controller |
| **Controllers** | Handle HTTP request/response, validasi input, call services |
| **Services** | Business logic, scoring algorithm, file handling |
| **Models** | Database queries (CRUD), data access layer |

## Keuntungan
- Lebih mudah di-maintain
- Separation of concerns yang jelas
- Mudah untuk testing
- Scalable untuk fitur baru
