const fs = require('fs')
const path = require('path')
const { pipeline } = require('node:stream/promises')
const PendaftaranService = require('../services/pendaftaran-service')

const UPLOAD_DIR = path.join(__dirname, '../../uploads/pendaftaran')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const PendaftaranController = {
  async create(request, reply) {
    if (request.user.role !== 'pendaftar') return reply.code(403).send({ error: 'Akses ditolak, hanya pendaftar' })

    console.log('[PendaftaranController] 📥 Starting multipart parsing...')
    const startTime = Date.now()
    
    const data = {}
    const files = {}
    
    try {
      for await (const part of request.parts()) {
        if (part.type === 'file') {
          const ext = path.extname(part.filename) || '.jpg'
          const filename = `${part.fieldname}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}${ext}`
          const filePath = path.join(UPLOAD_DIR, filename)

          await pipeline(part.file, fs.createWriteStream(filePath))

          files[part.fieldname] = {
            filename: filename,
            originalName: part.filename,
            mimetype: part.mimetype,
            size: fs.statSync(filePath).size
          }

          console.log(`[PendaftaranController] 📁 Saved file: ${part.fieldname} → ${filename} (${(files[part.fieldname].size / 1024).toFixed(1)} KB)`);
        } else {
          data[part.fieldname] = part.value
        }
      }
      
      const parseTime = Date.now() - startTime
      console.log(`[PendaftaranController] 📦 Multipart parsed in ${parseTime}ms`);
      console.log('[PendaftaranController] 📦 Data keys:', Object.keys(data));
      console.log('[PendaftaranController] 📁 Files:', Object.keys(files));
    } catch (err) {
      console.error('[PendaftaranController] ❌ Error parsing multipart:', err);
      return reply.code(400).send({ error: 'Input tidak valid' })
    }

    const required = ['pesantren_id', 'nama_lengkap', 'nik', 'jenis_kelamin']
    for (const field of required) {
      if (!data[field]) return reply.code(400).send({ error: `Field ${field} wajib diisi` })
    }

    console.log('[PendaftaranController] 🚀 Calling service...')
    try {
      const result = await PendaftaranService.create(request.user.id, data, files)
      const totalTime = Date.now() - startTime
      console.log(`[PendaftaranController] ✅ Success in ${totalTime}ms:`, result);
      return reply.code(201).send({ data: result })
    } catch (err) {
      console.error('[PendaftaranController] ❌ Service error:', err.message);
      return reply.code(400).send({ error: err.message })
    }
  },

  async getTrackingStatus(request, reply) {
    try {
      const result = await PendaftaranService.getTrackingStatus(request.params.nomor)
      return reply.code(200).send({ data: result })
    } catch {
      return reply.code(404).send({ error: 'Data pendaftaran tidak ditemukan' })
    }
  },

  async getMyRegistrations(request, reply) {
    try {
      const result = await PendaftaranService.getMyRegistrations(request.user.id)
      return reply.code(200).send({ data: result })
    } catch (err) {
      return reply.code(500).send({ error: 'Terjadi kesalahan pada server' })
    }
  }
}

module.exports = PendaftaranController
