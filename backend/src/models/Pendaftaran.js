const Pendaftaran = {
  async create(data) {
    const [result] = await require('../config/db').getPool().query(
      `INSERT INTO pendaftaran (
        nomor_pendaftaran, order_id, user_id, pesantren_id, status,
        payment_status, payment_amount,
        nama_lengkap, nik, tempat_lahir, tanggal_lahir, jenis_kelamin,
        alamat, no_hp, nama_ayah, nama_ibu, no_hp_ortu, pekerjaan_ortu,
        foto_ktp, pas_foto, kartu_keluarga
      ) VALUES (?, ?, ?, ?, 'pending', 'unpaid', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.nomor_pendaftaran, data.order_id || null, data.user_id, data.pesantren_id,
        data.payment_amount || 0,
        data.nama_lengkap, data.nik, data.tempat_lahir, data.tanggal_lahir,
        data.jenis_kelamin, data.alamat, data.no_hp, data.nama_ayah,
        data.nama_ibu, data.no_hp_ortu, data.pekerjaan_ortu,
        data.foto_ktp, data.pas_foto, data.kartu_keluarga
      ]
    )
    return result
  },

  async findByNomor(nomor) {
    const [rows] = await require('../config/db').getPool().query(
      `SELECT p.id, p.nomor_pendaftaran, p.order_id, p.user_id, p.pesantren_id, p.status, p.catatan_admin, 
              p.payment_status, p.payment_token, p.payment_method, p.payment_amount,
              p.created_at, p.updated_at,
              p.nama_lengkap, p.nik, p.tempat_lahir, p.tanggal_lahir, p.jenis_kelamin,
              p.alamat, p.no_hp, p.nama_ayah, p.nama_ibu, p.no_hp_ortu, p.pekerjaan_ortu,
              p.foto_ktp, p.pas_foto, p.kartu_keluarga,
              pes.id as pesantren_id, pes.nama as pesantren_nama
       FROM pendaftaran p
       LEFT JOIN pesantren pes ON p.pesantren_id = pes.id
       WHERE p.nomor_pendaftaran = ?`,
      [nomor]
    )
    return rows[0]
  },

  async checkNomorExists(nomor) {
    const [rows] = await require('../config/db').getPool().query(
      'SELECT id FROM pendaftaran WHERE nomor_pendaftaran = ?',
      [nomor]
    )
    return rows.length > 0
  },

  async findActiveByUserAndPesantren(userId, pesantrenId) {
    const [rows] = await require('../config/db').getPool().query(
      `SELECT id, status, nomor_pendaftaran FROM pendaftaran 
       WHERE user_id = ? AND pesantren_id = ? AND status IN ('pending', 'diproses', 'diterima')
       LIMIT 1`,
      [userId, pesantrenId]
    )
    return rows[0] || null
  },

  async countAll() {
    const [rows] = await require('../config/db').getPool().query('SELECT COUNT(*) as total FROM pendaftaran')
    return rows[0].total
  },

  async countByStatus() {
    const [rows] = await require('../config/db').getPool().query(
      'SELECT status, COUNT(*) as total FROM pendaftaran GROUP BY status'
    )
    return rows
  },

  async findAll({ status, pesantren_id, page, limit }) {
    let query = `SELECT p.id, p.nomor_pendaftaran, p.status, p.catatan_admin, p.created_at,
                        p.nama_lengkap,
                        u.id as user_id, u.email as user_email,
                        pes.id as pesantren_id, pes.nama as pesantren_nama
                 FROM pendaftaran p
                 LEFT JOIN users u ON p.user_id = u.id
                 LEFT JOIN pesantren pes ON p.pesantren_id = pes.id
                 WHERE 1=1`
    let countQuery = 'SELECT COUNT(*) as total FROM pendaftaran WHERE 1=1'
    const params = []
    const countParams = []

    if (status) {
      query += ' AND p.status = ?'
      countQuery += ' AND status = ?'
      params.push(status)
      countParams.push(status)
    }
    if (pesantren_id) {
      query += ' AND p.pesantren_id = ?'
      countQuery += ' AND pesantren_id = ?'
      params.push(parseInt(pesantren_id))
      countParams.push(parseInt(pesantren_id))
    }

    query += ' ORDER BY p.created_at DESC'

    const offset = (page - 1) * limit
    query += ' LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const [rows] = await require('../config/db').getPool().query(query, params)
    const [countResult] = await require('../config/db').getPool().query(countQuery, countParams)

    return { data: rows, total: countResult[0].total }
  },

  async findById(id) {
    const [rows] = await require('../config/db').getPool().query(
      `SELECT p.id, p.nomor_pendaftaran, p.order_id, p.status, p.catatan_admin, p.created_at,
              p.payment_status, p.payment_token, p.payment_method, p.payment_amount,
              p.nama_lengkap, p.nik, p.tempat_lahir, p.tanggal_lahir, p.jenis_kelamin,
              p.alamat, p.no_hp, p.nama_ayah, p.nama_ibu, p.no_hp_ortu, p.pekerjaan_ortu,
              p.foto_ktp, p.pas_foto, p.kartu_keluarga,
              u.id as user_id, u.email as user_email,
              pes.id as pesantren_id, pes.nama as pesantren_nama
       FROM pendaftaran p
       LEFT JOIN users u ON p.user_id = u.id
       LEFT JOIN pesantren pes ON p.pesantren_id = pes.id
       WHERE p.id = ?`,
      [id]
    )
    return rows[0]
  },

  async updateStatus(id, { status, catatan_admin }) {
    const [result] = await require('../config/db').getPool().query(
      'UPDATE pendaftaran SET status = ?, catatan_admin = ?, updated_at = NOW() WHERE id = ?',
      [status, catatan_admin || null, id]
    )
    return result.affectedRows > 0
  },

  async findByUserId(userId) {
    const [rows] = await require('../config/db').getPool().query(
      `SELECT p.id, p.nomor_pendaftaran, p.order_id, p.status, p.catatan_admin, p.created_at, p.updated_at,
              p.payment_status, p.payment_token, p.payment_method, p.payment_amount,
              p.nama_lengkap, p.nik, p.tempat_lahir, p.tanggal_lahir, p.jenis_kelamin,
              p.alamat, p.no_hp, p.nama_ayah, p.nama_ibu, p.no_hp_ortu, p.pekerjaan_ortu,
              p.foto_ktp, p.pas_foto, p.kartu_keluarga,
              pes.id as pesantren_id, pes.nama as pesantren_nama, pes.kota as pesantren_kota,
              pes.province as pesantren_province
       FROM pendaftaran p
       LEFT JOIN pesantren pes ON p.pesantren_id = pes.id
       WHERE p.user_id = ?
       ORDER BY p.created_at DESC`,
      [userId]
    )
    return rows
  },

  async findByPemilikUserId(pemilikUserId) {
    const [rows] = await require('../config/db').getPool().query(
      `SELECT p.id, p.nomor_pendaftaran, p.status, p.catatan_admin, p.created_at, p.updated_at,
              p.nama_lengkap, p.nik, p.tempat_lahir, p.tanggal_lahir, p.jenis_kelamin,
              p.alamat, p.no_hp, p.nama_ayah, p.nama_ibu, p.no_hp_ortu, p.pekerjaan_ortu,
              p.foto_ktp, p.pas_foto, p.kartu_keluarga,
              pes.id as pesantren_id, pes.nama as pesantren_nama
       FROM pendaftaran p
       INNER JOIN pesantren pes ON p.pesantren_id = pes.id
       WHERE pes.user_id = ?
       ORDER BY p.created_at DESC`,
      [pemilikUserId]
    )
    return rows
  },

  async findLatest(limit = 5) {
    const [rows] = await require('../config/db').getPool().query(
      `SELECT p.id, p.nama_lengkap, p.status, p.created_at, p.payment_status,
              pes.nama as pesantren_nama
       FROM pendaftaran p
       LEFT JOIN pesantren pes ON p.pesantren_id = pes.id
       ORDER BY p.created_at DESC
       LIMIT ?`,
      [limit]
    )
    return rows
  },

  async updatePayment(id, data) {
    const fields = []
    const params = []
    
    if (data.payment_status) {
      fields.push('payment_status = ?')
      params.push(data.payment_status)
    }
    if (data.payment_token) {
      fields.push('payment_token = ?')
      params.push(data.payment_token)
    }
    if (data.payment_method) {
      fields.push('payment_method = ?')
      params.push(data.payment_method)
    }
    if (data.order_id) {
      fields.push('order_id = ?')
      params.push(data.order_id)
    }
    
    if (fields.length === 0) return false
    
    params.push(id)
    const [result] = await require('../config/db').getPool().query(
      `UPDATE pendaftaran SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      params
    )
    return result.affectedRows > 0
  },

  async findByOrderId(orderId) {
    const [rows] = await require('../config/db').getPool().query(
      'SELECT id, nomor_pendaftaran, user_id, payment_amount, payment_status FROM pendaftaran WHERE order_id = ?',
      [orderId]
    )
    return rows[0]
  }
}

module.exports = Pendaftaran
