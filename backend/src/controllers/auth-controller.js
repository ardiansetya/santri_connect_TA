const fs = require('fs')
const path = require('path')
const { pipeline } = require('node:stream/promises')
const { AuthService, UserService, AdminService } = require('../services/auth-service')
const UploadService = require('../services/upload-service')

const UPLOAD_DIR = path.join(__dirname, '../../uploads/pesantrenImages')

const AuthController = {
  async register(fastify, request, reply) {
    try {
      await AuthService.register(request.body)
      return reply.code(201).send({ data: 'Registrasi berhasil' })
    } catch (err) {
      if (err.message === 'Role tidak valid') {
        return reply.code(400).send({ error: 'Role tidak valid' })
      }
      return reply.code(400).send({ error: 'Registrasi gagal' })
    }
  },

  async login(fastify, request, reply) {
    try {
      const result = await AuthService.login(request.body)
      const token = fastify.jwt.sign({ id: result.user.id, role: result.user.role }, { expiresIn: '7d' })
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

    let data = {}
    const files = {}
    const uploadedFiles = [] // Track uploaded files for cleanup on error

    // Handle multipart or JSON payload
    if (request.isMultipart()) {
      try {
        for await (const part of request.parts()) {
          if (part.type === 'file') {
            // Stream file to disk using pipeline
            const ext = path.extname(part.filename) || '.jpg'
            const filename = `${part.fieldname}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}${ext}`
            const filePath = path.join(UPLOAD_DIR, filename)

            await pipeline(part.file, fs.createWriteStream(filePath))

            const fileInfo = {
              filename: filename,
              originalName: part.filename,
              mimetype: part.mimetype,
              size: fs.statSync(filePath).size
            }

            uploadedFiles.push(filename)

            // Handle multiple files with same fieldname (e.g., foto_galeri)
            if (files[part.fieldname]) {
              if (!Array.isArray(files[part.fieldname])) {
                files[part.fieldname] = [files[part.fieldname]]
              }
              files[part.fieldname].push(fileInfo)
            } else {
              files[part.fieldname] = fileInfo
            }
          } else {
            data[part.fieldname] = part.value
          }
        }
        console.log('[AdminController] 📦 Parsed data keys:', Object.keys(data));
        console.log('[AdminController] 📁 Parsed files:', Object.keys(files));
      } catch (err) {
        console.error('[AdminController] ❌ Error parsing multipart:', err);
        // Cleanup uploaded files on error
        for (const filename of uploadedFiles) {
          UploadService.deleteFile(filename)
        }
        return reply.code(400).send({ error: 'Input tidak valid' })
      }
    } else {
      data = request.body
    }

    // Normalize province/provinsi
    const { normalizeWilayahData } = require('../middlewares/normalize-wilayah')
    const normalizedData = normalizeWilayahData(data)

    if (!normalizedData.nama) return reply.code(400).send({ error: 'Nama pesantren wajib diisi' })
    if (!normalizedData.province) return reply.code(400).send({ error: 'Provinsi wajib diisi' })
    if (!normalizedData.kota) return reply.code(400).send({ error: 'Kota wajib diisi' })

    try {
      const result = await AdminService.createPesantren(normalizedData, files, uploadedFiles)
      return reply.code(201).send(result)
    } catch (err) {
      // Cleanup uploaded files on error
      for (const filename of uploadedFiles) {
        UploadService.deleteFile(filename)
      }
      return reply.code(400).send({ error: err.message })
    }
  },
  async updatePesantren(request, reply) {
    if (request.user.role !== 'superadmin') return reply.code(403).send({ error: 'Akses ditolak, hanya superadmin' })

    const data = {}
    const files = {}
    const uploadedFiles = [] // Track uploaded files for cleanup on error

    try {
      for await (const part of request.parts()) {
        if (part.type === 'file') {
          // Stream file to disk using pipeline
          const ext = path.extname(part.filename) || '.jpg'
          const filename = `${part.fieldname}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}${ext}`
          const filePath = path.join(UPLOAD_DIR, filename)

          await pipeline(part.file, fs.createWriteStream(filePath))

          const fileInfo = {
            filename: filename,
            originalName: part.filename,
            mimetype: part.mimetype,
            size: fs.statSync(filePath).size
          }

          uploadedFiles.push(filename)

          // Handle multiple files with same fieldname (e.g., foto_galeri)
          if (files[part.fieldname]) {
            if (!Array.isArray(files[part.fieldname])) {
              files[part.fieldname] = [files[part.fieldname]]
            }
            files[part.fieldname].push(fileInfo)
          } else {
            files[part.fieldname] = fileInfo
          }
        } else {
          data[part.fieldname] = part.value
        }
      }
      console.log('[AdminController] 📦 Parsed data keys:', Object.keys(data));
      console.log('[AdminController] 📁 Parsed files:', Object.keys(files));
    } catch (err) {
      console.error('[AdminController] ❌ Error parsing multipart:', err);
      // Cleanup uploaded files on error
      for (const filename of uploadedFiles) {
        UploadService.deleteFile(filename)
      }
      return reply.code(400).send({ error: 'Input tidak valid' })
    }

    try {
      const result = await AdminService.updatePesantren(request.params.id, data, files, uploadedFiles)
      return reply.code(200).send(result)
    } catch (err) {
      // Cleanup uploaded files on error
      for (const filename of uploadedFiles) {
        UploadService.deleteFile(filename)
      }

      return err.message === 'Pesantren tidak ditemukan'
        ? reply.code(404).send({ error: 'Pesantren tidak ditemukan' })
        : reply.code(400).send({ error: err.message })
    }
  },

  async deletePesantren(request, reply) {
    if (request.user.role !== 'superadmin') return reply.code(403).send({ error: 'Akses ditolak, hanya superadmin' })

    try {
      const result = await AdminService.deletePesantren(request.params.id)
      return reply.code(200).send(result)
    } catch (err) {
      return err.message === 'Pesantren tidak ditemukan'
        ? reply.code(404).send({ error: 'Pesantren tidak ditemukan' })
        : reply.code(500).send({ error: 'Terjadi kesalahan pada server' })
    }
  }
}

module.exports = { AuthController, UserController, AdminController }
