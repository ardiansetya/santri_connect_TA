const bcrypt = require('bcrypt')
const User = require('../models/User')

const AuthService = {
  async register({ username, email, password }) {
    const exists = await User.checkEmailExists(email)
    if (exists) throw new Error('Email sudah terdaftar')

    const hashedPassword = await bcrypt.hash(password, 10)
    await User.create({ username, email, password: hashedPassword })
    return { message: 'Registrasi berhasil' }
  },

  async login({ email, password }) {
    const user = await User.findByEmail(email)
    if (!user) throw new Error('Kredensial tidak valid')

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new Error('Kredensial tidak valid')

    return {
      message: 'Login berhasil',
      user: { id: user.id, username: user.username, role: user.role }
    }
  }
}

const UserService = {
  async getCurrentUser(userId) {
    const user = await User.findById(userId)
    if (!user) throw new Error('Data user tidak ditemukan')
    return user
  },

  async updateUserData(userId, { username, email }) {
    const exists = await User.checkEmailExists(email, userId)
    if (exists) throw new Error('Email sudah digunakan oleh pengguna lain')

    await User.update(userId, { username, email })
    return User.findById(userId)
  }
}

const AdminService = {
  async getDashboardStats() {
    const Pesantren = require('../models/Pesantren')
    const Pendaftaran = require('../models/Pendaftaran')

    const [totalUsers, totalPesantren, totalPendaftar, totalPendaftaran, statusRows] = await Promise.all([
      User.countAll(),
      Pesantren.countAll(),
      User.countByRole('pendaftar'),
      Pendaftaran.countAll(),
      Pendaftaran.countByStatus()
    ])

    const pendaftaranByStatus = { pending: 0, diproses: 0, diterima: 0, ditolak: 0 }
    statusRows.forEach(row => { pendaftaranByStatus[row.status] = row.total })

    return {
      total_users: totalUsers,
      total_pesantren: totalPesantren,
      total_pendaftar: totalPendaftar,
      total_pendaftaran: totalPendaftaran,
      pendaftaran_by_status: pendaftaranByStatus
    }
  },

  async getAllUsers(filters) {
    const page = Math.max(1, parseInt(filters.page) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(filters.limit) || 10))
    const { data, total } = await User.findAll({ ...filters, page, limit })
    return {
      data,
      meta: { page, limit, total_data: total, total_page: Math.ceil(total / limit) }
    }
  }
}

module.exports = { AuthService, UserService, AdminService }
