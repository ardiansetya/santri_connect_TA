const fs = require('fs')
const path = require('path')
const { pipeline } = require('node:stream/promises')
const PesantrenService = require('../services/pesantren-service')
const UploadService = require('../services/upload-service')

const UPLOAD_DIR = path.join(__dirname, '../../uploads/pesantrenImages')

const PesantrenController = {
  async getDetail(request, reply) {
    try {
      const data = await PesantrenService.getDetail(request.params.id)
      return reply.code(200).send({ success: true, data })
    } catch {
      return reply.code(404).send({ success: false, error: 'Pesantren tidak ditemukan' })
    }
  },

  async getList(request, reply) {
    try {
      const result = await PesantrenService.getList(request.query)
      return reply.code(200).send({ success: true, data: result.data, meta: result.meta })
    } catch {
      return reply.code(500).send({ success: false, error: 'Terjadi kesalahan pada server' })
    }
  },

  async getPendaftaranInfo(request, reply) {
    try {
      const data = await PesantrenService.getPendaftaranInfo(request.params.id)
      return reply.code(200).send({ success: true, data })
    } catch {
      return reply.code(404).send({ success: false, error: 'Pesantren tidak ditemukan' })
    }
  },

  async getByPemilik(request, reply) {
    try {
      const result = await PesantrenService.getByUserId(request.user.id, request.query)
      return reply.code(200).send({ success: true, data: result.data, meta: result.meta })
    } catch {
      return reply.code(500).send({ success: false, error: 'Terjadi kesalahan pada server' })
    }
  },

  async createByPemilik(request, reply) {
    const data = {}
    const files = {}
    const uploadedFiles = [] // Track uploaded files for cleanup on error

    // Handle multipart or JSON payload
    if (request.isMultipart()) {
      try {
        for await (const part of request.parts()) {
          if (part.type === 'file') {
            // Stream file to disk using pipeline (correct way per @fastify/multipart docs)
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
            // part.type === 'field'
            let value = part.value
            if (value === 'null' && (part.fieldname === 'foto_utama' || part.fieldname === 'tahun_berdiri' || part.fieldname === 'jumlah_santri' || part.fieldname === 'jumlah_pengajar' || part.fieldname === 'biaya_bulanan' || part.fieldname === 'biaya_pendaftaran')) {
              value = null
            }
            data[part.fieldname] = value
          }
        }
        console.log('[PesantrenController] 📦 Parsed data keys:', Object.keys(data));
        console.log('[PesantrenController] 📁 Parsed files:', Object.keys(files));
      } catch (err) {
        console.error('[PesantrenController] ❌ Error parsing multipart:', err);
        // Cleanup any files that were uploaded before error
        for (const filename of uploadedFiles) {
          UploadService.deleteFile(filename)
        }
        return reply.code(400).send({ error: 'Input tidak valid' })
      }
    } else {
      console.log('[PesantrenController] 📦 Received JSON body');
      Object.assign(data, request.body)
    }

    // Normalize province/provinsi
    const { normalizeWilayahData } = require('../middlewares/normalize-wilayah')
    const normalizedData = normalizeWilayahData(data)

    if (!normalizedData.nama) return reply.code(400).send({ error: 'Nama pesantren wajib diisi' })
    if (!normalizedData.province) return reply.code(400).send({ error: 'Provinsi wajib diisi' })
    if (!normalizedData.kota) return reply.code(400).send({ error: 'Kota wajib diisi' })

    try {
      const result = await PesantrenService.createByPemilik(request.user.id, normalizedData, files, uploadedFiles)
      return reply.code(201).send(result)
    } catch (err) {
      console.error('[PesantrenController] ❌ Gagal membuat pesantren:', err.message)
      // Cleanup uploaded files on error
      for (const filename of uploadedFiles) {
        UploadService.deleteFile(filename)
      }
      return reply.code(400).send({ error: err.message })
    }
  },

  async updateByPemilik(request, reply) {
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
          let value = part.value
          // Convert string 'null' or empty string to actual null for numeric fields
          if ((value === 'null' || value === '') && (part.fieldname === 'foto_utama' || part.fieldname === 'tahun_berdiri' || part.fieldname === 'jumlah_santri' || part.fieldname === 'jumlah_pengajar' || part.fieldname === 'biaya_bulanan' || part.fieldname === 'biaya_pendaftaran')) {
            value = null
          }
          data[part.fieldname] = value
        }
      }
      console.log('[PesantrenController] 📦 Parsed data keys:', Object.keys(data));
      console.log('[PesantrenController] 📁 Parsed files:', Object.keys(files));
    } catch (err) {
      console.error('[PesantrenController] ❌ Error parsing multipart:', err);
      // Cleanup any files that were uploaded before error
      for (const filename of uploadedFiles) {
        UploadService.deleteFile(filename)
      }
      return reply.code(400).send({ error: 'Input tidak valid' })
    }

    try {
      const result = await PesantrenService.updateByPemilik(request.user.id, request.params.id, data, files, uploadedFiles)
      return reply.code(200).send(result)
    } catch (err) {
      // Cleanup uploaded files on error
      for (const filename of uploadedFiles) {
        UploadService.deleteFile(filename)
      }

      if (err.message === 'Pesantren tidak ditemukan') {
        return reply.code(404).send({ error: 'Pesantren tidak ditemukan' })
      }
      if (err.message === 'Akses ditolak, bukan pesantren Anda') {
        return reply.code(403).send({ error: 'Akses ditolak' })
      }
      return reply.code(400).send({ error: err.message })
    }
  },

  async deleteByPemilik(request, reply) {
    try {
      const result = await PesantrenService.deleteByPemilik(request.user.id, request.params.id)
      return reply.code(200).send(result)
    } catch (err) {
      if (err.message === 'Pesantren tidak ditemukan') {
        return reply.code(404).send({ error: 'Pesantren tidak ditemukan' })
      }
      if (err.message === 'Akses ditolak, bukan pesantren Anda') {
        return reply.code(403).send({ error: 'Akses ditolak' })
      }
      return reply.code(500).send({ error: 'Terjadi kesalahan pada server' })
    }
  }
}

module.exports = PesantrenController
