## 📝 Summary
- Refactor wilayah validation from service layer to Fastify preHandler middleware
- Follow Fastify best practices: validation separated from business logic
- Add schema validation for type checking on create/update pesantren endpoints
- Clean service layer - only business logic, no validation code
- Validation runs BEFORE handler, early rejection for invalid data

## 🔧 Changes
| File | Perubahan |
|------|-----------|
| `middlewares/validate-wilayah.js` | **Baru** - async preHandler hook for wilayah validation |
| `routes/index.js` | Add validateWilayah to preHandler array + schema validation |
| `services/auth-service.js` | Remove validation code, keep only DB operations |
| `services/pesantren-service.js` | Remove validation code, keep only DB operations |

## ✅ Endpoints with Validation
| Endpoint | Schema | preHandler |
|----------|--------|------------|
| `POST /api/admin/pesantren` | ✅ nama, province, kota, kurikulum | ✅ authMiddleware + validateWilayah |
| `PUT /api/admin/pesantren/:id` | ✅ province, kota, kurikulum | ✅ authMiddleware + validateWilayah |
| `POST /api/pemilik/pesantren` | ✅ nama, province, kota, kurikulum | ✅ authMiddleware + validateWilayah |
| `PUT /api/pemilik/pesantren/:id` | ✅ province, kota, kurikulum | ✅ authMiddleware + validateWilayah |

## 🧪 Cara Test
```bash
# Invalid province - should return 400
curl -X POST http://localhost:3000/api/admin/pesantren \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nama":"Test","province":"InvalidProvince","kota":"Bandung"}'

# Valid province - should return 201
curl -X POST http://localhost:3000/api/admin/pesantren \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nama":"Test","province":"JAWA BARAT","kota":"KOTA BANDUNG","kurikulum":"modern"}'
```
