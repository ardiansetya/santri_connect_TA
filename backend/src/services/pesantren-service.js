async function getPesantrenDetail(fastify, id) {
  const connection = fastify.mysql

  const parsedId = parseInt(id, 10)

  const [pesantren] = await connection.query(
    'SELECT id, user_id, nama, province, kota, alamat, tahun_berdiri, jumlah_santri, jumlah_pengajar, biaya_pendaftaran, biaya_bulanan, fasilitas, kurikulum, email, telepon, website, deskripsi, nama_bank, nomor_rekening, atas_nama_rekening FROM santo_connect.pesantren WHERE id = ?',
    [parsedId]
  )

  if (pesantren.length === 0) {
    throw new Error('Pesantren tidak ditemukan')
  }

  const data = pesantren[0]
  
  let fasilitas = data.fasilitas
  if (typeof fasilitas === 'string') {
    try {
      fasilitas = JSON.parse(fasilitas)
    } catch {
      fasilitas = []
    }
  }

  return {
    id: data.id,
    user_id: data.user_id,
    nama: data.nama,
    province: data.province,
    kota: data.kota,
    alamat: data.alamat,
    tahun_berdiri: data.tahun_berdiri,
    jumlah_santri: data.jumlah_santri,
    jumlah_pengajar: data.jumlah_pengajar,
    biaya_pendaftaran: data.biaya_pendaftaran,
    biaya_bulanan: data.biaya_bulanan,
    fasilitas,
    kurikulum: data.kurikulum,
    email: data.email,
    telepon: data.telepon,
    website: data.website,
    deskripsi: data.deskripsi,
    rekening: {
      nama_bank: data.nama_bank,
      nomor_rekening: data.nomor_rekening,
      atas_nama_rekening: data.atas_nama_rekening
    }
  }
}

async function getPesastrichtList(fastify, filters) {
  const connection = fastify.mysql
  
  const { search, provinsi, kota, biaya_min, biaya_max, fasilitas, kurikulum, page = 1, limit = 10, sort = 'terbaru' } = filters
  
  let query = 'SELECT * FROM santo_connect.pesantren WHERE 1=1'
  let countQuery = 'SELECT COUNT(*) as total FROM santo_connect.pesantren WHERE 1=1'
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
  
  const sortMapping = {
    'biaya_asc': 'biaya_bulanan ASC',
    'biaya_desc': 'biaya_bulanan DESC',
    'terbaru': 'created_at DESC'
  }
  
  const sortOrder = sortMapping[sort] || sortMapping['terbaru']
  query += ` ORDER BY ${sortOrder}`
  
  const pageNum = Math.max(1, parseInt(page))
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)))
  const offset = (pageNum - 1) * limitNum
  
  query += ' LIMIT ? OFFSET ?'
  params.push(limitNum, offset)
  
  const [rows] = await connection.query(query, params)
  const [countResult] = await connection.query(countQuery, countParams)
  
  const totalData = countResult[0].total
  const totalPage = Math.ceil(totalData / limitNum)
  
  const data = rows.map(row => {
    let rowFasilitas = row.fasilitas
    if (typeof rowFasilitas === 'string') {
      try {
        rowFasilitas = JSON.parse(rowFasilitas)
      } catch {
        rowFasilitas = []
      }
    }
    return {
      id: row.id,
      nama: row.nama,
      province: row.province,
      kota: row.kota,
      biaya_bulanan: row.biaya_bulanan,
      kurikulum: row.kurikulum,
      fasilitas: rowFasilitas
    }
  })
  
  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total_data: totalData,
      total_page: totalPage
    }
  }
}

module.exports = { getPesantrenDetail, getPesastrichtList }
