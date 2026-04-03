const Pesantren = {
  async findById(id) {
    const [rows] = await require('../config/db').getPool().query(
      'SELECT id, user_id, nama, province, kota, alamat, tahun_berdiri, jumlah_santri, jumlah_pengajar, biaya_pendaftaran, biaya_bulanan, fasilitas, kurikulum, email, telepon, website, deskripsi, nama_bank, nomor_rekening, atas_nama_rekening FROM pesantren WHERE id = ?',
      [id]
    )
    return rows[0]
  },

  async findAll({ search, provinsi, kota, biaya_min, biaya_max, fasilitas, kurikulum, page, limit, sort }) {
    let query = 'SELECT * FROM pesantren WHERE 1=1'
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
  }
}

module.exports = Pesantren
