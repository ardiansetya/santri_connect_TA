const bcrypt = require('bcrypt')
const User = require('../models/User')

const ALLOWED_ROLES = ['pendaftar', 'pemilik']
const FORBIDDEN_ROLES = ['superadmin']

const AuthService = {
  async register({ username, email, password, role }) {
    // SECURITY: Hardcoded block - NEVER allow forbidden roles
    if (FORBIDDEN_ROLES.includes(role)) {
      throw new Error('Role tidak valid')
    }

    // SECURITY: Only allow explicitly permitted roles
    const userRole = role || 'pendaftar'
    if (!ALLOWED_ROLES.includes(userRole)) {
      throw new Error('Role tidak valid')
    }

    const exists = await User.checkEmailExists(email)
    if (exists) throw new Error('Email sudah terdaftar')

    const hashedPassword = await bcrypt.hash(password, 10)
    await User.create({ username, email, password: hashedPassword, role: userRole })
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
  },

  async exportPendaftaran(filters) {
    const Pendaftaran = require('../models/Pendaftaran')
    const { data } = await Pendaftaran.findAll({ ...filters, page: 1, limit: 10000 })

    const ExcelJS = require('exceljs')
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Pendaftaran')

    worksheet.columns = [
      { header: 'No. Pendaftaran', key: 'nomor_pendaftaran', width: 25 },
      { header: 'Nama Lengkap', key: 'nama_lengkap', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Pesantren', key: 'pesantren', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Tanggal Daftar', key: 'created_at', width: 20 },
      { header: 'Catatan Admin', key: 'catatan_admin', width: 30 }
    ]

    worksheet.getRow(1).font = { bold: true }

    data.forEach(row => {
      worksheet.addRow({
        nomor_pendaftaran: row.nomor_pendaftaran,
        nama_lengkap: row.nama_lengkap,
        email: row.user_email,
        pesantren: row.pesantren_nama,
        status: row.status,
        created_at: new Date(row.created_at).toLocaleDateString('id-ID'),
        catatan_admin: row.catatan_admin || '-'
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    return buffer
  },

   async createPesantren(data, files = {}) {
     const validKurikulum = ['modern', 'salaf', 'campuran']
     if (data.kurikulum && !validKurikulum.includes(data.kurikulum)) {
       throw new Error('Kurikulum tidak valid')
     }

     const WilayahService = require('./wilayah-service')
     const { normalizeWilayahData } = require('../middlewares/normalize-wilayah')
     const normalizedData = normalizeWilayahData(data)
     
     if (normalizedData.province) {
       const provinceResult = await WilayahService.validateProvince(normalizedData.province)
       if (!provinceResult.valid) throw new Error(provinceResult.message)
       normalizedData.province = provinceResult.name
     }
     if (normalizedData.kota) {
       const provinceId = normalizedData.province ? (await WilayahService.getProvinceByName(normalizedData.province))?.id : null
       if (provinceId) {
         const regencyResult = await WilayahService.validateRegency(provinceId, normalizedData.kota)
         if (!regencyResult.valid) throw new Error(regencyResult.message)
         normalizedData.kota = regencyResult.name
       }
     }

      // Handle foto_utama (single file)
      if (files.foto_utama) {
        const UploadService = require('./upload-service')
        const validation = UploadService.validateFile(files.foto_utama, 'Foto Utama')
        if (!validation.valid) {
          throw new Error(validation.message)
        }
        data.foto_utama = await UploadService.saveFile(files.foto_utama, 'foto_utama')
      }

      // Handle foto_galeri (multiple files)
      if (files.foto_galeri) {
        const UploadService = require('./upload-service')
        const { MAX_GALLERY_FILES } = require('../config/upload-config')
        
        // Convert single file to array if needed
        const galleryFiles = Array.isArray(files.foto_galeri) ? files.foto_galeri : [files.foto_galeri]
        
        // Validate max 5 files
        if (galleryFiles.length > MAX_GALLERY_FILES) {
          throw new Error(`Foto gallery maksimal ${MAX_GALLERY_FILES} file`)
        }
        
        // Validate each file
        for (let i = 0; i < galleryFiles.length; i++) {
          const validation = UploadService.validateFile(galleryFiles[i], `Foto Gallery ${i + 1}`)
          if (!validation.valid) {
            throw new Error(validation.message)
          }
        }
        
        data.foto_galeri = JSON.stringify(await UploadService.saveMultipleFiles(galleryFiles, 'foto_galeri'))
      }

     const Pesantren = require('../models/Pesantren')
     await Pesantren.create(data)
     return { message: 'Pesantren berhasil ditambahkan' }
   },

   async updatePesantren(id, data, files = {}) {
     const validKurikulum = ['modern', 'salaf', 'campuran']
     if (data.kurikulum && !validKurikulum.includes(data.kurikulum)) {
       throw new Error('Kurikulum tidak valid')
     }

     const Pesantren = require('../models/Pesantren')
     const existing = await Pesantren.findById(parseInt(id, 10))
     if (!existing) throw new Error('Pesantren tidak ditemukan')

     const WilayahService = require('./wilayah-service')
     const { normalizeWilayahData } = require('../middlewares/normalize-wilayah')
     const normalizedData = normalizeWilayahData(data)
     
     if (normalizedData.province) {
       const provinceResult = await WilayahService.validateProvince(normalizedData.province)
       if (!provinceResult.valid) throw new Error(provinceResult.message)
       normalizedData.province = provinceResult.name
     }
     if (normalizedData.kota) {
       const provinceId = normalizedData.province ? (await WilayahService.getProvinceByName(normalizedData.province))?.id : existing.province ? (await WilayahService.getProvinceByName(existing.province))?.id : null
       if (provinceId) {
         const regencyResult = await WilayahService.validateRegency(provinceId, normalizedData.kota)
         if (!regencyResult.valid) throw new Error(regencyResult.message)
         normalizedData.kota = regencyResult.name
       }
     }

      // Handle foto_utama (single file) - upload new if provided, keep old if not
      if (files.foto_utama) {
        const UploadService = require('./upload-service')
        const validation = UploadService.validateFile(files.foto_utama, 'Foto Utama')
        if (!validation.valid) {
          throw new Error(validation.message)
        }
        
        // Delete old foto_utama if exists
        if (existing.foto_utama) {
          UploadService.deleteFile(existing.foto_utama)
        }
        
        data.foto_utama = await UploadService.saveFile(files.foto_utama, 'foto_utama')
      } else if (data.foto_utama === null) {
        // Explicitly set to null to delete
        if (existing.foto_utama) {
          UploadService.deleteFile(existing.foto_utama)
        }
        data.foto_utama = null
      }
      // If no file provided and not explicitly null, keep existing foto_utama

      // Handle foto_galeri (multiple files)
      if (files.foto_galeri !== undefined) {
        const UploadService = require('./upload-service')
        const { MAX_GALLERY_FILES } = require('../config/upload-config')
        
        // Convert single file to array if needed
        const galleryFiles = Array.isArray(files.foto_galeri) ? files.foto_galeri : [files.foto_galeri]
        
        // Handle empty array (explicitly set to empty)
        if (galleryFiles.length === 0 && files.foto_galeri !== undefined) {
          // Delete all existing gallery photos
          if (existing.foto_galeri) {
            try {
              const existingGallery = JSON.parse(existing.foto_galeri)
              for (const filename of existingGallery) {
                UploadService.deleteFile(filename)
              }
            } catch (e) {
              // If parsing fails, continue
            }
          }
          data.foto_galeri = JSON.stringify([])
        } 
        // Handle file uploads
        else if (galleryFiles.length > 0) {
          // Validate max 5 files
          if (galleryFiles.length > MAX_GALLERY_FILES) {
            throw new Error(`Foto gallery maksimal ${MAX_GALLERY_FILES} file`)
          }
          
          // Validate each file
          for (let i = 0; i < galleryFiles.length; i++) {
            const validation = UploadService.validateFile(galleryFiles[i], `Foto Gallery ${i + 1}`)
            if (!validation.valid) {
              throw new Error(validation.message)
            }
          }
          
          // Delete existing gallery photos
          if (existing.foto_galeri) {
            try {
              const existingGallery = JSON.parse(existing.foto_galeri)
              for (const filename of existingGallery) {
                UploadService.deleteFile(filename)
              }
            } catch (e) {
              // If parsing fails, continue
            }
          }
          
          data.foto_galeri = JSON.stringify(await UploadService.saveMultipleFiles(galleryFiles, 'foto_galeri'))
        }
        // If galleryFiles is undefined, keep existing foto_galeri
      }
      // If files.foto_galeri is undefined, keep existing foto_galeri

     const updated = await Pesantren.update(parseInt(id, 10), data)
     if (!updated) throw new Error('Pesantren tidak ditemukan')

     return { message: 'Data pesantren berhasil diperbarui' }
   },

  async deletePesantren(id) {
    const Pesantren = require('../models/Pesantren')
    const existing = await Pesantren.findById(parseInt(id, 10))
    if (!existing) throw new Error('Pesantren tidak ditemukan')

    const deleted = await Pesantren.delete(parseInt(id, 10))
    if (!deleted) throw new Error('Pesantren tidak ditemukan')

    return { message: 'Pesantren berhasil dihapus' }
  }
}

module.exports = { AuthService, UserService, AdminService }
