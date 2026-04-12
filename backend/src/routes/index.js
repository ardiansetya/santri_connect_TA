const authMiddleware = require('../middlewares/auth-middleware')
const { AuthController, UserController, AdminController } = require('../controllers/auth-controller')
const PesantrenController = require('../controllers/pesantren-controller')
const PesantrenService = require('../services/pesantren-service')
const RekomendasiController = require('../controllers/rekomendasi-controller')
const PendaftaranController = require('../controllers/pendaftaran-controller')

const userRoutes = async (fastify) => {
  fastify.post('/api/register', {
    schema: {
      body: {
        type: 'object', required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string', minLength: 1 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          role: { type: 'string', enum: ['pendaftar', 'pemilik'] }
        }
      }
    }
  }, (request, reply) => AuthController.register(fastify, request, reply))

  fastify.post('/api/login', {
    schema: {
      body: {
        type: 'object', required: ['email', 'password'],
        properties: { email: { type: 'string', format: 'email' }, password: { type: 'string' } }
      }
    }
  }, (request, reply) => AuthController.login(fastify, request, reply))

  fastify.get('/api/me', { preHandler: authMiddleware }, (request, reply) => UserController.getCurrentUser(request, reply))

  fastify.put('/api/me', {
    preHandler: authMiddleware,
    schema: {
      body: {
        type: 'object', required: ['username', 'email'],
        properties: { username: { type: 'string', minLength: 1 }, email: { type: 'string', format: 'email' } },
        additionalProperties: false
      }
    }
  }, (request, reply) => UserController.updateUserData(request, reply))

  fastify.post('/api/logout', { preHandler: authMiddleware }, async (request, reply) => {
    return reply.code(200).send({ data: 'Logout berhasil' })
  })
}

const adminRoutes = async (fastify) => {
  fastify.get('/api/admin/stats', { preHandler: authMiddleware }, (request, reply) => AdminController.getDashboardStats(request, reply))
  fastify.get('/api/admin/users', { preHandler: authMiddleware }, (request, reply) => AdminController.getAllUsers(request, reply))
  fastify.get('/api/admin/pendaftaran', { preHandler: authMiddleware }, (request, reply) => AdminController.getAllPendaftaran(request, reply))
  fastify.get('/api/admin/pendaftaran/:id', { preHandler: authMiddleware }, (request, reply) => AdminController.getPendaftaranDetail(request, reply))
  fastify.put('/api/admin/pendaftaran/:id/status', { preHandler: authMiddleware }, (request, reply) => AdminController.updatePendaftaranStatus(request, reply))
  fastify.get('/api/admin/pendaftaran/export', { preHandler: authMiddleware }, (request, reply) => AdminController.exportPendaftaran(request, reply))
  fastify.post('/api/admin/pesantren', {
    preHandler: [authMiddleware]
  }, (request, reply) => AdminController.createPesantren(request, reply))

  fastify.put('/api/admin/pesantren/:id', {
    preHandler: [authMiddleware]
  }, (request, reply) => AdminController.updatePesantren(request, reply))
  fastify.delete('/api/admin/pesantren/:id', { preHandler: authMiddleware }, (request, reply) => AdminController.deletePesantren(request, reply))
}

const pesantrenRoutes = async (fastify) => {
  fastify.get('/api/pesantren', (request, reply) => PesantrenController.getList(request, reply))

  fastify.get('/api/pesantren/:id', {
    schema: { params: { type: 'object', properties: { id: { type: 'integer' } }, required: ['id'] } }
  }, (request, reply) => PesantrenController.getDetail(request, reply))

  fastify.get('/api/pesantren/:id/pendaftaran-info', {
    schema: { params: { type: 'object', properties: { id: { type: 'integer' } }, required: ['id'] } }
  }, (request, reply) => PesantrenController.getPendaftaranInfo(request, reply))
}

const rekomendasiRoutes = async (fastify) => {
  fastify.post('/api/rekomendasi', (request, reply) => RekomendasiController.getRekomendasi(request, reply))
}

const pendaftaranRoutes = async (fastify) => {
  fastify.post('/api/pendaftaran', { preHandler: authMiddleware }, (request, reply) => PendaftaranController.create(request, reply))
  fastify.get('/api/pendaftaran/status/:nomor', { preHandler: authMiddleware }, (request, reply) => PendaftaranController.getTrackingStatus(request, reply))
  fastify.get('/api/pendaftaran/saya', { preHandler: authMiddleware }, (request, reply) => PendaftaranController.getMyRegistrations(request, reply))
  fastify.post('/api/pendaftaran/:id/pay', { preHandler: authMiddleware }, (request, reply) => PendaftaranController.getPaymentToken(request, reply))
  fastify.get('/api/pendaftaran/:id/payment-status', { preHandler: authMiddleware }, (request, reply) => PendaftaranController.checkPaymentStatus(request, reply))
}

const pemilikRoutes = async (fastify) => {
  fastify.get('/api/pemilik/pesantren', { preHandler: authMiddleware }, async (request, reply) => {
    if (request.user.role !== 'pemilik') return reply.code(403).send({ error: 'Akses ditolak, hanya pemilik' })
    try {
      const result = await PesantrenService.getByUserId(request.user.id, request.query)
      return reply.code(200).send({ success: true, data: result.data, meta: result.meta })
    } catch {
      return reply.code(500).send({ success: false, error: 'Terjadi kesalahan pada server' })
    }
  })

  fastify.post('/api/pemilik/pesantren', {
    preHandler: [authMiddleware]
  }, (request, reply) => {
    if (request.user.role !== 'pemilik') return reply.code(403).send({ error: 'Akses ditolak, hanya pemilik' })
    return PesantrenController.createByPemilik(request, reply)
  })

  fastify.put('/api/pemilik/pesantren/:id', {
    preHandler: [authMiddleware]
  }, (request, reply) => {
    if (request.user.role !== 'pemilik') return reply.code(403).send({ error: 'Akses ditolak, hanya pemilik' })
    return PesantrenController.updateByPemilik(request, reply)
  })

  fastify.delete('/api/pemilik/pesantren/:id', {
    preHandler: [authMiddleware]
  }, (request, reply) => {
    if (request.user.role !== 'pemilik') return reply.code(403).send({ error: 'Akses ditolak, hanya pemilik' })
    return PesantrenController.deleteByPemilik(request, reply)
  })

  // Pendaftaran routes untuk pemilik
  fastify.get('/api/pemilik/pendaftaran', { preHandler: authMiddleware }, (request, reply) => {
    if (request.user.role !== 'pemilik') return reply.code(403).send({ error: 'Akses ditolak, hanya pemilik' })
    return PemilikController.getPendaftaran(request, reply)
  })

  fastify.put('/api/pemilik/pendaftaran/:id/status', { preHandler: authMiddleware }, (request, reply) => {
    if (request.user.role !== 'pemilik') return reply.code(403).send({ error: 'Akses ditolak, hanya pemilik' })
    return PemilikController.updatePendaftaranStatus(request, reply)
  })
}

const publicRoutes = require('./public-routes')
const wilayahRoutes = require('./wilayah-routes')
const CompareController = require('../controllers/compare-controller')
const PemilikController = require('../controllers/pemilik-controller')

const compareRoutes = async (fastify) => {
  fastify.post('/api/compare', {
    schema: {
      body: {
        type: 'object',
        required: ['pesantren_ids'],
        properties: {
          pesantren_ids: { type: 'array', items: { type: 'integer' }, minItems: 1, maxItems: 3 }
        }
      }
    }
  }, (request, reply) => CompareController.comparePesantren(request, reply))
}

module.exports = { userRoutes, adminRoutes, pesantrenRoutes, rekomendasiRoutes, pendaftaranRoutes, pemilikRoutes, publicRoutes, wilayahRoutes, compareRoutes }
