const authMiddleware = require('../middlewares/auth-middleware')
const { AuthController, UserController, AdminController } = require('../controllers/auth-controller')
const PesantrenController = require('../controllers/pesantren-controller')
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
          password: { type: 'string', minLength: 6 }
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
  fastify.get('/api/pendaftaran/status/:nomor', (request, reply) => PendaftaranController.getTrackingStatus(request, reply))
}

module.exports = { userRoutes, adminRoutes, pesantrenRoutes, rekomendasiRoutes, pendaftaranRoutes }
