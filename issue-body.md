## Deskripsi

Buat unit test untuk seluruh endpoint API dalam sistem menggunakan Jest. Testing bertujuan untuk memastikan setiap endpoint berjalan sesuai spesifikasi dan menangani berbagai kondisi (success dan error).

## Setup Testing

**Framework:** Jest
**HTTP Testing:** Fastify inject (built-in)

### Coverage
| Module | Tests | Status |
|--------|-------|--------|
| Authentication | 11 | ✅ |
| Pesantren | 7 | ✅ |
| Compare | 4 | ✅ |
| Public | 4 | ✅ |
| **Total** | **26** | **✅ All Passed** |

## Cara Menjalankan Test

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```
