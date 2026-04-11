const Pesantren = require('../models/Pesantren')
const UploadService = require('./upload-service')
const { MAX_GALLERY_FILES } = require('../config/upload-config')

const PesantrenService = {
  async getDetail(id) {
    const data = await Pesantren.findById(parseInt(id, 10))
    if (!data) throw new Error('Pesantren tidak ditemukan')

    let fasilitas = data.fasilitas
    if (typeof fasilitas === 'string') {
      try { fasilitas = JSON.parse(fasilitas) } catch { fasilitas = [] }
    }

    let foto_galeri = data.foto_galeri
    if (typeof foto_galeri === 'string') {
      try { foto_galeri = JSON.parse(foto_galeri) } catch { foto_galeri = [] }
    }

    return {
      id: data.id, user_id: data.user_id, nama: data.nama,
      province: data.province, kota: data.kota, alamat: data.alamat,
      tahun_berdiri: data.tahun_berdiri, jumlah_santri: data.jumlah_santri,
      jumlah_pengajar: data.jumlah_pengajar, biaya_pendaftaran: data.biaya_pendaftaran,
      biaya_bulanan: data.biaya_bulanan, fasilitas, kurikulum: data.kurikulum,
      email: data.email, telepon: data.telepon, website: data.website,
      deskripsi: data.deskripsi,
      foto_utama: data.foto_utama,
      foto_galeri: foto_galeri,
      rekening: {
        nama_bank: data.nama_bank,
        nomor_rekening: data.nomor_rekening,
        atas_nama: data.atas_nama_rekening
      }
    }
  },

  async getPendaftaranInfo(id) {
    const data = await Pesantren.findById(parseInt(id, 10))
    if (!data) throw new Error('Pesantren tidak ditemukan')

    return {
      pesantren_id: data.id,
      nama: data.nama,
      biaya_pendaftaran: data.biaya_pendaftaran,
      rekening: {
        nama_bank: data.nama_bank,
        nomor_rekening: data.nomor_rekening,
        atas_nama: data.atas_nama_rekening
      }
    }
  },

  async getList(filters) {
    const page = Math.max(1, parseInt(filters.page) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(filters.limit) || 10))
    const { data, total } = await Pesantren.findAll({ ...filters, page, limit })

    const mappedData = data.map(row => {
      let f = row.fasilitas
      if (typeof f === 'string') { try { f = JSON.parse(f) } catch { f = [] } }
      return {
        id: row.id, nama: row.nama, province: row.province,
        kota: row.kota, biaya_bulanan: row.biaya_bulanan, jumlah_santri: row.jumlah_santri,
        kurikulum: row.kurikulum, fasilitas: f,
        foto_utama: row.foto_utama, foto_galeri: row.foto_galeri
      }
    })

    return {
      data: mappedData,
      meta: { page, limit, total_data: total, total_page: Math.ceil(total / limit) }
    }
  },

  async getByUserId(userId, filters) {
    const page = Math.max(1, parseInt(filters.page) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(filters.limit) || 10))
    const { data, total } = await Pesantren.findByUserId(userId, { page, limit })

    console.log('[PesantrenService.getByUserId] Raw data from DB:', JSON.stringify(data, null, 2));

    // Parse JSON fields and construct rekening object
    const parsedData = data.map(row => {
      // Parse fasilitas
      if (row.fasilitas && typeof row.fasilitas === 'string') {
        try {
          row.fasilitas = JSON.parse(row.fasilitas)
        } catch {
          row.fasilitas = []
        }
      }
      // Parse foto_galeri
      if (row.foto_galeri && typeof row.foto_galeri === 'string') {
        try {
          row.foto_galeri = JSON.parse(row.foto_galeri)
        } catch {
          row.foto_galeri = []
        }
      }
      // Construct rekening object
      row.rekening = {
        nama_bank: row.nama_bank || '',
        nomor_rekening: row.nomor_rekening || '',
        atas_nama: row.atas_nama_rekening || ''
      }
      return row
    })

    return {
      data: parsedData,
      meta: { page, limit, total_data: total, total_page: Math.ceil(total / limit) }
    }
  },

   async createByPemilik(userId, data, files = {}, uploadedFiles = []) {
     const validKurikulum = ['modern', 'salaf', 'campuran']
     if (data.kurikulum && !validKurikulum.includes(data.kurikulum)) {
       throw new Error('Kurikulum tidak valid')
     }
     if (!data.nama) throw new Error('Nama pesantren wajib diisi')

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

      // Handle foto_utama (single file) - already saved by controller
      if (files.foto_utama) {
        // Validate file size and type
        const validation = UploadService.validateUploadedFile(files.foto_utama, 'Foto Utama')
        if (!validation.valid) {
          throw new Error(validation.message)
        }
        data.foto_utama = files.foto_utama.filename
        uploadedFiles.push(files.foto_utama.filename)
      }

      // Handle foto_galeri (multiple files) - already saved by controller
      if (files.foto_galeri) {
        console.log('[PesantrenService.create] Received foto_galeri:', JSON.stringify(files.foto_galeri, null, 2));
        
        // Convert single file to array if needed
        const galleryFiles = Array.isArray(files.foto_galeri) ? files.foto_galeri : [files.foto_galeri]
        
        console.log('[PesantrenService.create] galleryFiles array length:', galleryFiles.length);
        console.log('[PesantrenService.create] galleryFiles:', galleryFiles.map(f => f.filename));

        // Validate max 5 files
        if (galleryFiles.length > MAX_GALLERY_FILES) {
          throw new Error(`Foto gallery maksimal ${MAX_GALLERY_FILES} file`)
        }

        // Validate each file
        for (let i = 0; i < galleryFiles.length; i++) {
          const validation = UploadService.validateUploadedFile(galleryFiles[i], `Foto Gallery ${i + 1}`)
          if (!validation.valid) {
            throw new Error(validation.message)
          }
        }

        const savedFilenames = galleryFiles.map(f => f.filename)
        console.log('[PesantrenService.create] savedFilenames:', savedFilenames);
        
        savedFilenames.forEach(f => uploadedFiles.push(f))
        data.foto_galeri = JSON.stringify(savedFilenames)
      }

     await Pesantren.create({ ...data, user_id: userId })
     return { message: 'Pesantren berhasil ditambahkan' }
   },

   async updateByPemilik(userId, id, data, files = {}, uploadedFiles = []) {
     const validKurikulum = ['modern', 'salaf', 'campuran']
     if (data.kurikulum && !validKurikulum.includes(data.kurikulum)) {
       throw new Error('Kurikulum tidak valid')
     }

     const existing = await Pesantren.findById(parseInt(id, 10))
     if (!existing) throw new Error('Pesantren tidak ditemukan')
     if (existing.user_id !== userId) throw new Error('Akses ditolak, bukan pesantren Anda')

     console.log('[PesantrenService.update] Input data:', JSON.stringify(data, null, 2));
     console.log('[PesantrenService.update] Files:', Object.keys(files));
     console.log('[PesantrenService.update] foto_galeri type:', typeof files.foto_galeri);
     console.log('[PesantrenService.update] foto_galeri isArray:', Array.isArray(files.foto_galeri));
     if (files.foto_galeri) {
       console.log('[PesantrenService.update] foto_galeri:', JSON.stringify(files.foto_galeri, null, 2));
     }

     const WilayahService = require('./wilayah-service')
     const { normalizeWilayahData } = require('../middlewares/normalize-wilayah')
     const normalizedData = normalizeWilayahData(data)

     if (!normalizedData.nama) normalizedData.nama = existing.nama
     if (!normalizedData.province) normalizedData.province = existing.province
     if (!normalizedData.kota) normalizedData.kota = existing.kota

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
        const validation = UploadService.validateUploadedFile(files.foto_utama, 'Foto Utama')
        if (!validation.valid) {
          throw new Error(validation.message)
        }

        // Delete old foto_utama if exists
        if (existing.foto_utama) {
          UploadService.deleteFile(existing.foto_utama)
        }

        data.foto_utama = files.foto_utama.filename
        uploadedFiles.push(files.foto_utama.filename)
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
        // Convert single file to array if needed
        const newGalleryFiles = Array.isArray(files.foto_galeri) ? files.foto_galeri : [files.foto_galeri]

        // Get existing gallery files from frontend (sent as JSON string)
        let existingGalleryFromClient = []
        if (data.existing_foto_galeri) {
          try {
            existingGalleryFromClient = JSON.parse(data.existing_foto_galeri)
            console.log('[PesantrenService.update] Existing gallery from client:', existingGalleryFromClient);
          } catch (e) {
            console.error('Failed to parse existing_foto_galeri:', e)
          }
        }
        // Remove from data so it doesn't get saved to DB
        delete data.existing_foto_galeri

        // Handle new gallery files
        if (newGalleryFiles.length > 0) {
          // Validate new files
          for (let i = 0; i < newGalleryFiles.length; i++) {
            const validation = UploadService.validateUploadedFile(newGalleryFiles[i], `Foto Gallery ${i + 1}`)
            if (!validation.valid) {
              throw new Error(validation.message)
            }
          }

          // Merge: existing + new (if client sent existing files)
          // OR: just new files (if client didn't send existing - means replacing all)
          const allGalleryFiles = existingGalleryFromClient.length > 0
            ? [...existingGalleryFromClient, ...newGalleryFiles.map(f => f.filename)]
            : newGalleryFiles.map(f => f.filename)

          // Validate max 5 files
          if (allGalleryFiles.length > MAX_GALLERY_FILES) {
            throw new Error(`Foto gallery maksimal ${MAX_GALLERY_FILES} file`)
          }

          // Only delete old gallery files if we're REPLACING (not merging)
          if (existingGalleryFromClient.length === 0 && existing.foto_galeri) {
            try {
              const existingGallery = JSON.parse(existing.foto_galeri)
              for (const filename of existingGallery) {
                UploadService.deleteFile(filename)
              }
            } catch (e) {
              // If parsing fails, continue
            }
          }

          // Save new gallery files
          const newFilenames = newGalleryFiles.map(f => f.filename)
          newFilenames.forEach(f => uploadedFiles.push(f))

          data.foto_galeri = JSON.stringify(allGalleryFiles)
          console.log('[PesantrenService.update] Final gallery files:', allGalleryFiles);
        }
        // No new files - keep existing gallery (don't delete)
      }
      // If files.foto_galeri is undefined, keep existing foto_galeri

     const updated = await Pesantren.update(parseInt(id, 10), data)
     if (!updated) throw new Error('Pesantren tidak ditemukan')
 
     return { message: 'Data pesantren berhasil diperbarui' }
   },

   async deleteByPemilik(userId, id) {
     const existing = await Pesantren.findById(parseInt(id, 10))
     if (!existing) throw new Error('Pesantren tidak ditemukan')
     if (existing.user_id !== userId) throw new Error('Akses ditolak, bukan pesantren Anda')

     // Delete associated photo files before deleting the record
     const UploadService = require('./upload-service')
     if (existing.foto_utama) {
       UploadService.deleteFile(existing.foto_utama)
     }
     if (existing.foto_galeri) {
       try {
         const existingGallery = JSON.parse(existing.foto_galeri)
         for (const filename of existingGallery) {
           UploadService.deleteFile(filename)
         }
       } catch (e) {
         // If parsing fails, continue with deletion
         console.error('Failed to parse foto_galeri for deletion:', e)
       }
     }

     const deleted = await Pesantren.delete(parseInt(id, 10))
     if (!deleted) throw new Error('Pesantren tidak ditemukan')

     return { message: 'Pesantren berhasil dihapus' }
   }
}

module.exports = PesantrenService
