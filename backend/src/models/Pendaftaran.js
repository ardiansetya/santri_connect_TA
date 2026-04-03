const Pendaftaran = {
  async create(data) {
    const [result] = await require('../config/db').getPool().query(
      `INSERT INTO pendaftaran (
        nomor_pendaftaran, user_id, pesantren_id, status,
        nama_lengkap, nik, tempat_lahir, tanggal_lahir, jenis_kelamin,
        alamat, no_hp, nama_ayah, nama_ibu, no_hp_ortu, pekerjaan_ortu,
        foto_ktp, pas_foto, kartu_keluarga
      ) VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.nomor_pendaftaran, data.user_id, data.pesantren_id,
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
      `SELECT p.nomor_pendaftaran, p.status, p.catatan_admin, p.created_at,
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
      `SELECT p.id, p.nomor_pendaftaran, p.status, p.catatan_admin, p.created_at,
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
  }
}

module.exports = Pendaftaran
