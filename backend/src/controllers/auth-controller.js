const { AuthService, UserService, AdminService } = require('../services/auth-service')

const AuthController = {
  async register(fastify, request, reply) {
    try {
      await AuthService.register(request.body)
      return reply.code(201).send({ data: 'Registrasi berhasil' })
    } catch {
      return reply.code(400).send({ error: 'Registrasi gagal' })
    }
  },

  async login(fastify, request, reply) {
    try {
      const result = await AuthService.login(request.body)
      const token = fastify.jwt.sign({ id: result.user.id, role: result.user.role })
      return reply.code(200).send({ data: { ...result, token } })
    } catch {
      return reply.code(401).send({ error: 'Email atau password salah' })
    }
  }
}

const UserController = {
  async getCurrentUser(request, reply) {
    try {
      const user = await UserService.getCurrentUser(request.user.id)
      return reply.code(200).send({ data: user })
    } catch (err) {
      return err.message === 'Data user tidak ditemukan'
        ? reply.code(404).send({ error: 'Data user tidak ditemukan' })
        : reply.code(500).send({ error: 'Terjadi kesalahan' })
    }
  },

  async updateUserData(request, reply) {
    try {
      const user = await UserService.updateUserData(request.user.id, request.body)
      return reply.code(200).send({ data: { message: 'Update data berhasil', user } })
    } catch (err) {
      return reply.code(400).send({ error: err.message })
    }
  }
}

const AdminController = {
  async getDashboardStats(request, reply) {
    if (request.user.role !== 'superadmin') return reply.code(403).send({ error: 'Akses ditolak, hanya superadmin' })
    try {
      const stats = await AdminService.getDashboardStats()
      return reply.code(200).send({ data: stats })
    } catch {
      return reply.code(500).send({ error: 'Terjadi kesalahan pada server' })
    }
  },

  async getAllUsers(request, reply) {
    if (request.user.role !== 'superadmin') return reply.code(403).send({ error: 'Akses ditolak, hanya superadmin' })
    try {
      const result = await AdminService.getAllUsers(request.query)
      return reply.code(200).send({ data: result.data, meta: result.meta })
    } catch {
      return reply.code(500).send({ error: 'Terjadi kesalahan pada server' })
    }
  },

  async getAllPendaftaran(request, reply) {
    if (request.user.role !== 'superadmin') return reply.code(403).send({ error: 'Akses ditolak, hanya superadmin' })
    try {
      const result = await AdminService.getAllPendaftaran(request.query)
      return reply.code(200).send({ data: result.data, meta: result.meta })
    } catch {
      return reply.code(500).send({ error: 'Terjadi kesalahan pada server' })
    }
  },

  async getPendaftaranDetail(request, reply) {
    if (request.user.role !== 'superadmin') return reply.code(403).send({ error: 'Akses ditolak, hanya superadmin' })
    try {
      const data = await AdminService.getPendaftaranDetail(request.params.id)
      return reply.code(200).send({ data })
    } catch (err) {
      return err.message === 'Data pendaftaran tidak ditemukan'
        ? reply.code(404).send({ error: 'Data pendaftaran tidak ditemukan' })
        : reply.code(500).send({ error: 'Terjadi kesalahan pada server' })
    }
  },

  async updatePendaftaranStatus(request, reply) {
    if (request.user.role !== 'superadmin') return reply.code(403).send({ error: 'Akses ditolak, hanya superadmin' })
    const { status, catatan_admin } = request.body
    if (!status) return reply.code(400).send({ error: 'Input tidak valid' })

    try {
      const result = await AdminService.updatePendaftaranStatus(request.params.id, { status, catatan_admin })
      return reply.code(200).send(result)
    } catch (err) {
      return err.message === 'Status tidak valid' || err.message === 'Data pendaftaran tidak ditemukan'
        ? reply.code(400).send({ error: err.message })
        : reply.code(500).send({ error: 'Terjadi kesalahan pada server' })
    }
  },

  async exportPendaftaran(request, reply) {
    if (request.user.role !== 'superadmin') return reply.code(403).send({ error: 'Akses ditolak, hanya superadmin' })

    try {
      const buffer = await AdminService.exportPendaftaran(request.query)
      const filename = `pendaftaran-${new Date().toISOString().split('T')[0]}.xlsx`

      return reply
        .header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .header('Content-Disposition', `attachment; filename="${filename}"`)
        .send(buffer)
    } catch {
      return reply.code(500).send({ error: 'Terjadi kesalahan pada server' })
    }
  },

  async createPesantren(request, reply) {
    if (request.user.role !== 'superadmin') return reply.code(403).send({ error: 'Akses ditolak, hanya superadmin' })
    if (!request.body.nama) return reply.code(400).send({ error: 'Input tidak valid' })

    try {
      const result = await AdminService.createPesantren(request.body)
      return reply.code(201).send(result)
    } catch (err) {
      return reply.code(400).send({ error: err.message })
    }
  }
}

module.exports = { AuthController, UserController, AdminController }
