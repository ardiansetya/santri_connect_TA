const fs = require('fs')
const path = require('path')
const Pendaftaran = require('../models/Pendaftaran')
const Pesantren = require('../models/Pesantren')

const UPLOAD_DIR = path.join(__dirname, '../../uploads')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const PendaftaranService = {

  async create(userId, data, files) {
    console.log('[PendaftaranService.create] Starting...');
    const startTime = Date.now()
    
    const pesantren = await Pesantren.findById(parseInt(data.pesantren_id))
    if (!pesantren) throw new Error('Pesantren tidak ditemukan')

    console.log(`[PendaftaranService.create] Found pesantren in ${Date.now() - startTime}ms`);

    // Check for existing active registration at the same pesantren
    const existing = await Pendaftaran.findActiveByUserAndPesantren(userId, parseInt(data.pesantren_id))
    if (existing) {
      const statusMap = { pending: 'menunggu verifikasi', diproses: 'sedang diproses', diterima: 'sudah diterima' }
      throw new Error(`Anda sudah memiliki pendaftaran yang ${statusMap[existing.status] || 'aktif'} di pesantren ini (${existing.nomor_pendaftaran}). Tidak dapat mendaftar ulang.`)
    }

    // Files are already saved by controller, just get filenames
    const fotoKtp = files.foto_ktp ? files.foto_ktp.filename : null
    const pasFoto = files.pas_foto ? files.pas_foto.filename : null
    const kartuKeluarga = files.kartu_keluarga ? files.kartu_keluarga.filename : null

    console.log('[PendaftaranService.create] Files:', { fotoKtp, pasFoto, kartuKeluarga });

    let nomorPendaftaran
    do {
      nomorPendaftaran = `REG-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000) + 100000}`
    } while (await Pendaftaran.checkNomorExists(nomorPendaftaran))

    const paymentAmount = pesantren.biaya_pendaftaran || 0
    const paymentStatus = paymentAmount === 0 ? 'paid' : 'unpaid'

    console.log(`[PendaftaranService.create] Biaya: ${paymentAmount}, Status: ${paymentStatus}`);

    console.log('[PendaftaranService.create] Creating registration...');
    const result = await Pendaftaran.create({
      nomor_pendaftaran: nomorPendaftaran, user_id: userId, pesantren_id: data.pesantren_id,
      payment_amount: paymentAmount,
      payment_status: paymentStatus,
      nama_lengkap: data.nama_lengkap, nik: data.nik, tempat_lahir: data.tempat_lahir || null,
      tanggal_lahir: data.tanggal_lahir || null, jenis_kelamin: data.jenis_kelamin,
      alamat: data.alamat || null, no_hp: data.no_hp || null, nama_ayah: data.nama_ayah || null,
      nama_ibu: data.nama_ibu || null, no_hp_ortu: data.no_hp_ortu || null, pekerjaan_ortu: data.pekerjaan_ortu || null,
      foto_ktp: fotoKtp, pas_foto: pasFoto, kartu_keluarga: kartuKeluarga
    })

    const totalTime = Date.now() - startTime
    console.log(`[PendaftaranService.create] ✅ Done in ${totalTime}ms`);
    
    return { 
      id: result.insertId,
      nomor_pendaftaran: nomorPendaftaran, 
      payment_amount: paymentAmount, 
      payment_status: paymentStatus 
    }
  },

  async getPaymentToken(pendaftaranId, userId) {
    const data = await Pendaftaran.findById(pendaftaranId)
    if (!data) throw new Error('Pendaftaran tidak ditemukan')
    if (data.user_id !== userId) throw new Error('Akses ditolak')
    if (data.status === 'ditolak') throw new Error('Pendaftaran telah ditolak. Pembayaran tidak dapat dilakukan.')
    if (data.payment_status === 'paid') throw new Error('Pendaftaran sudah dibayar')

    // If order_id doesn't exist, create it
    let orderId = data.order_id
    if (!orderId) {
      orderId = `ORD-${data.nomor_pendaftaran}-${Date.now()}`
      await Pendaftaran.updatePayment(pendaftaranId, { order_id: orderId })
    }

    const snap = require('../config/midtrans')
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: data.payment_amount
      },
      customer_details: {
        first_name: data.nama_lengkap,
        email: data.user_email
      },
      item_details: [
        {
          id: `REG-${data.pesantren_id}`,
          price: data.payment_amount,
          quantity: 1,
          name: `Biaya Pendaftaran ${data.pesantren_nama}`
        }
      ]
    }

    const transaction = await snap.createTransaction(parameter)
    await Pendaftaran.updatePayment(pendaftaranId, { 
      payment_token: transaction.token,
      payment_status: 'payment_pending'
    })

    return { token: transaction.token, redirect_url: transaction.redirect_url }
  },

  async checkPaymentStatus(pendaftaranId, userId) {
    const data = await Pendaftaran.findById(pendaftaranId)
    if (!data) throw new Error('Pendaftaran tidak ditemukan')
    if (data.user_id !== userId) throw new Error('Akses ditolak')
    if (!data.order_id) throw new Error('Belum ada transaksi untuk pendaftaran ini')

    const snap = require('../config/midtrans')
    try {
      const statusResponse = await snap.transaction.status(data.order_id)
      console.log(`[PendaftaranService.checkStatus] Midtrans response for ${data.order_id}:`, statusResponse.transaction_status);
      
      let newStatus = data.payment_status
      const midtransStatus = statusResponse.transaction_status
      const fraudStatus = statusResponse.fraud_status

      if (midtransStatus === 'capture') {
        if (fraudStatus === 'challenge') newStatus = 'payment_pending'
        else if (fraudStatus === 'accept') newStatus = 'paid'
      } else if (midtransStatus === 'settlement') {
        newStatus = 'paid'
      } else if (midtransStatus === 'cancel' || midtransStatus === 'deny' || midtransStatus === 'expire') {
        newStatus = 'failed'
      } else if (midtransStatus === 'pending') {
        newStatus = 'payment_pending'
      }

      if (newStatus !== data.payment_status) {
        await Pendaftaran.updatePayment(pendaftaranId, { 
          payment_status: newStatus,
          payment_method: statusResponse.payment_type
        })
      }

      return { payment_status: newStatus, midtrans_status: midtransStatus }
    } catch (err) {
      console.error('[PendaftaranService.checkStatus] Error:', err.message);
      // If error from midtrans (e.g. 404 not found), just return current status
      return { payment_status: data.payment_status, error: err.message }
    }
  },

  async getTrackingStatus(nomor) {
    const data = await Pendaftaran.findByNomor(nomor)
    if (!data) throw new Error('Data pendaftaran tidak ditemukan')

    let currentPaymentStatus = data.payment_status

    // Auto-sync status with Midtrans if we have an order_id
    if (data.order_id && data.payment_status !== 'paid') {
      try {
        const snap = require('../config/midtrans')
        const statusResponse = await snap.transaction.status(data.order_id)
        const midtransStatus = statusResponse.transaction_status
        const fraudStatus = statusResponse.fraud_status

        let newStatus = data.payment_status
        if (midtransStatus === 'capture') {
          if (fraudStatus === 'challenge') newStatus = 'payment_pending'
          else if (fraudStatus === 'accept') newStatus = 'paid'
        } else if (midtransStatus === 'settlement') {
          newStatus = 'paid'
        } else if (midtransStatus === 'cancel' || midtransStatus === 'deny' || midtransStatus === 'expire') {
          newStatus = 'failed'
        } else if (midtransStatus === 'pending') {
          newStatus = 'payment_pending'
        }

        if (newStatus !== data.payment_status) {
          await Pendaftaran.updatePayment(data.id, { 
            payment_status: newStatus,
            payment_method: statusResponse.payment_type
          })
          currentPaymentStatus = newStatus
        }
      } catch (err) {
        console.error('[PendaftaranService.getTrackingStatus] Sync error:', err.message)
      }
    }

    return {
      id: data.id,
      nomor_pendaftaran: data.nomor_pendaftaran,
      user_id: data.user_id,
      pesantren_id: data.pesantren_id,
      status: data.status,
      payment_status: currentPaymentStatus,
      payment_amount: data.payment_amount,
      nama_lengkap: data.nama_lengkap,
      nik: data.nik,
      tempat_lahir: data.tempat_lahir || '-',
      tanggal_lahir: data.tanggal_lahir || null,
      jenis_kelamin: data.jenis_kelamin,
      alamat: data.alamat || '-',
      no_hp: data.no_hp || '-',
      nama_ayah: data.nama_ayah || '-',
      nama_ibu: data.nama_ibu || '-',
      no_hp_ortu: data.no_hp_ortu || '-',
      pekerjaan_ortu: data.pekerjaan_ortu || '-',
      foto_ktp: data.foto_ktp || null,
      pas_foto: data.pas_foto || null,
      kartu_keluarga: data.kartu_keluarga || null,
      catatan_admin: data.catatan_admin || null,
      created_at: data.created_at,
      updated_at: data.updated_at,
      pesantren: {
        id: data.pesantren_id,
        nama: data.pesantren_nama || 'Pesantren'
      }
    }
  },

  async getMyRegistrations(userId) {
    return await Pendaftaran.findByUserId(userId)
  }
}

module.exports = PendaftaranService
