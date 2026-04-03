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
  },

  async getAllPendaftaran(filters) {
    const page = Math.max(1, parseInt(filters.page) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(filters.limit) || 10))
    const Pendaftaran = require('../models/Pendaftaran')
    const { data, total } = await Pendaftaran.findAll({ ...filters, page, limit })

    const mappedData = data.map(row => ({
      id: row.id,
      nomor_pendaftaran: row.nomor_pendaftaran,
      status: row.status,
      created_at: row.created_at,
      user: { id: row.user_id, email: row.user_email },
      pesantren: { id: row.pesantren_id, nama: row.pesantren_nama }
    }))

    return {
      data: mappedData,
      meta: { page, limit, total_data: total, total_page: Math.ceil(total / limit) }
    }
  },

  async getPendaftaranDetail(id) {
    const Pendaftaran = require('../models/Pendaftaran')
    const data = await Pendaftaran.findById(parseInt(id, 10))
    if (!data) throw new Error('Data pendaftaran tidak ditemukan')

    return {
      id: data.id,
      nomor_pendaftaran: data.nomor_pendaftaran,
      status: data.status,
      catatan_admin: data.catatan_admin,
      created_at: data.created_at,
      user: { id: data.user_id, email: data.user_email },
      pesantren: { id: data.pesantren_id, nama: data.pesantren_nama },
      dokumen: {
        foto_ktp: data.foto_ktp,
        pas_foto: data.pas_foto,
        kartu_keluarga: data.kartu_keluarga
      }
    }
  },

  async updatePendaftaranStatus(id, { status, catatan_admin }) {
    const validStatuses = ['pending', 'diproses', 'diterima', 'ditolak']
    if (!validStatuses.includes(status)) throw new Error('Status tidak valid')

    const Pendaftaran = require('../models/Pendaftaran')
    const updated = await Pendaftaran.updateStatus(parseInt(id, 10), { status, catatan_admin })
    if (!updated) throw new Error('Data pendaftaran tidak ditemukan')

    return { message: 'Status pendaftaran berhasil diperbarui' }
  }
}

module.exports = { AuthService, UserService, AdminService }
