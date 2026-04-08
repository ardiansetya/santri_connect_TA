const Pesantren = {
  async findById(id) {
    const [rows] = await require('../config/db').getPool().query(
      'SELECT id, user_id, nama, province, kota, alamat, tahun_berdiri, jumlah_santri, jumlah_pengajar, biaya_pendaftaran, biaya_bulanan, fasilitas, kurikulum, email, telepon, website, deskripsi, foto_utama, foto_galeri, nama_bank, nomor_rekening, atas_nama_rekening FROM pesantren WHERE id = ?',
      [id]
    )
    return rows[0]
  },

  async findAll({ search, provinsi, kota, biaya_min, biaya_max, fasilitas, kurikulum, page, limit, sort }) {
    let query = 'SELECT id, nama, province, kota, biaya_bulanan, kurikulum, fasilitas, foto_utama FROM pesantren WHERE 1=1'
    let countQuery = 'SELECT COUNT(*) as total FROM pesantren WHERE 1=1'
    const params = []
    const countParams = []

    if (search) {
      query += ' AND nama LIKE ?'
      countQuery += ' AND nama LIKE ?'
      params.push(`%${search}%`)
      countParams.push(`%${search}%`)
    }
    if (provinsi) {
      query += ' AND province = ?'
      countQuery += ' AND province = ?'
      params.push(provinsi)
      countParams.push(provinsi)
    }
    if (kota) {
      query += ' AND kota = ?'
      countQuery += ' AND kota = ?'
      params.push(kota)
      countParams.push(kota)
    }
    if (biaya_min) {
      query += ' AND biaya_bulanan >= ?'
      countQuery += ' AND biaya_bulanan >= ?'
      params.push(parseInt(biaya_min))
      countParams.push(parseInt(biaya_min))
    }
    if (biaya_max) {
      query += ' AND biaya_bulanan <= ?'
      countQuery += ' AND biaya_bulanan <= ?'
      params.push(parseInt(biaya_max))
      countParams.push(parseInt(biaya_max))
    }
    if (fasilitas) {
      query += ' AND JSON_CONTAINS(fasilitas, ?)'
      countQuery += ' AND JSON_CONTAINS(fasilitas, ?)'
      params.push(`"${fasilitas}"`)
      countParams.push(`"${fasilitas}"`)
    }
    if (kurikulum) {
      query += ' AND kurikulum = ?'
      countQuery += ' AND kurikulum = ?'
      params.push(kurikulum)
      countParams.push(kurikulum)
    }

    const sortMap = {
      biaya_asc: 'biaya_bulanan ASC',
      biaya_desc: 'biaya_bulanan DESC',
      terbaru: 'created_at DESC'
    }
    query += ` ORDER BY ${sortMap[sort] || sortMap.terbaru}`

    const offset = (page - 1) * limit
    query += ' LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const [rows] = await require('../config/db').getPool().query(query, params)
    const [countResult] = await require('../config/db').getPool().query(countQuery, countParams)

    return { data: rows, total: countResult[0].total }
  },

  async countAll() {
    const [rows] = await require('../config/db').getPool().query('SELECT COUNT(*) as total FROM pesantren')
    return rows[0].total
  },

  async create(data) {
    const [result] = await require('../config/db').getPool().query(
      `INSERT INTO pesantren (
        user_id, nama, province, kota, alamat, tahun_berdiri, jumlah_santri,
        jumlah_pengajar, biaya_pendaftaran, biaya_bulanan, fasilitas, kurikulum,
        email, telepon, website, deskripsi, foto_utama, foto_galeri,
        nama_bank, nomor_rekening, atas_nama_rekening
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.user_id || null,
        data.nama,
        data.province || data.provinsi,
        data.kota,
        data.alamat,
        data.tahun_berdiri || null,
        data.jumlah_santri || null,
        data.jumlah_pengajar || null,
        data.biaya_pendaftaran || null,
        data.biaya_bulanan || null,
        data.fasilitas ? JSON.stringify(data.fasilitas) : null,
        data.kurikulum || null,
        data.email || null,
        data.telepon || null,
        data.website || null,
        data.deskripsi || null,
        data.foto_utama || null,
        data.foto_galeri ? JSON.stringify(data.foto_galeri) : null,
        data.nama_bank || null,
        data.nomor_rekening || null,
        data.atas_nama_rekening || null
      ]
    )
    return result
  },

  async update(id, data) {
    const [result] = await require('../config/db').getPool().query(
      `UPDATE pesantren SET
        nama = ?, province = ?, kota = ?, alamat = ?, tahun_berdiri = ?,
        jumlah_santri = ?, jumlah_pengajar = ?, biaya_pendaftaran = ?,
        biaya_bulanan = ?, fasilitas = ?, kurikulum = ?, email = ?,
        telepon = ?, website = ?, deskripsi = ?, foto_utama = ?, foto_galeri = ?,
        nama_bank = ?, nomor_rekening = ?, atas_nama_rekening = ?, updated_at = NOW()
      WHERE id = ?`,
      [
        data.nama,
        data.province || data.provinsi,
        data.kota,
        data.alamat,
        data.tahun_berdiri || null,
        data.jumlah_santri || null,
        data.jumlah_pengajar || null,
        data.biaya_pendaftaran || null,
        data.biaya_bulanan || null,
        data.fasilitas ? JSON.stringify(data.fasilitas) : null,
        data.kurikulum || null,
        data.email || null,
        data.telepon || null,
        data.website || null,
        data.deskripsi || null,
        data.foto_utama || null,
        data.foto_galeri ? JSON.stringify(data.foto_galeri) : null,
        data.nama_bank || null,
        data.nomor_rekening || null,
        data.atas_nama_rekening || null,
        id
      ]
    )
    return result.affectedRows > 0
  },

  async delete(id) {
    const [result] = await require('../config/db').getPool().query(
      'DELETE FROM pesantren WHERE id = ?',
      [id]
    )
    return result.affectedRows > 0
  },

  async findByUserId(userId, { page, limit }) {
    let query = 'SELECT id, nama, province, kota, biaya_bulanan, created_at FROM pesantren WHERE user_id = ?'
    let countQuery = 'SELECT COUNT(*) as total FROM pesantren WHERE user_id = ?'
    const params = [userId]
    const countParams = [userId]

    query += ' ORDER BY created_at DESC'

    const offset = (page - 1) * limit
    query += ' LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const [rows] = await require('../config/db').getPool().query(query, params)
    const [countResult] = await require('../config/db').getPool().query(countQuery, countParams)

    return { data: rows, total: countResult[0].total }
  },

  async countUniqueProvinces() {
    const [rows] = await require('../config/db').getPool().query(
      'SELECT COUNT(DISTINCT province) as total FROM pesantren WHERE province IS NOT NULL'
    )
    return rows[0].total
  },

  async countUniqueCities() {
    const [rows] = await require('../config/db').getPool().query(
      'SELECT COUNT(DISTINCT kota) as total FROM pesantren WHERE kota IS NOT NULL'
    )
    return rows[0].total
  },

  async findByIds(ids) {
    const placeholders = ids.map(() => '?').join(',')
    const [rows] = await require('../config/db').getPool().query(
      `SELECT id, nama, province, kota, alamat, tahun_berdiri, jumlah_santri,
              jumlah_pengajar, biaya_pendaftaran, biaya_bulanan, fasilitas,
              kurikulum, email, telepon, website, deskripsi
       FROM pesantren WHERE id IN (${placeholders})`,
      ids
    )
    return rows
  }
}

module.exports = Pesantren
