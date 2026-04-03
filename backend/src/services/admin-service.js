async function getDashboardStats(fastify) {
  const connection = fastify.mysql

  const [totalUsersResult] = await connection.query('SELECT COUNT(*) as total FROM users')
  const [totalPesantrenResult] = await connection.query('SELECT COUNT(*) as total FROM pesantren')
  const [totalPendaftarResult] = await connection.query("SELECT COUNT(*) as total FROM users WHERE role = 'pendaftar'")
  const [totalPendaftaranResult] = await connection.query('SELECT COUNT(*) as total FROM pendaftaran')
  const [statusResult] = await connection.query('SELECT status, COUNT(*) as total FROM pendaftaran GROUP BY status')

  const pendaftaranByStatus = {
    pending: 0,
    diproses: 0,
    diterima: 0,
    ditolak: 0
  }

  statusResult.forEach(row => {
    pendaftaranByStatus[row.status] = row.total
  })

  return {
    total_users: totalUsersResult[0].total,
    total_pesantren: totalPesantrenResult[0].total,
    total_pendaftar: totalPendaftarResult[0].total,
    total_pendaftaran: totalPendaftaranResult[0].total,
    pendaftaran_by_status: pendaftaranByStatus
  }
}

async function getAllUsers(fastify, filters) {
  const connection = fastify.mysql
  
  const { search, role, page = 1, limit = 10, sort = 'terbaru' } = filters
  
  let query = 'SELECT id, username, email, role, created_at, updated_at FROM users WHERE 1=1'
  let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1'
  const params = []
  const countParams = []
  
  if (search) {
    query += ' AND (username LIKE ? OR email LIKE ?)'
    countQuery += ' AND (username LIKE ? OR email LIKE ?)'
    params.push(`%${search}%`, `%${search}%`)
    countParams.push(`%${search}%`, `%${search}%`)
  }
  
  if (role) {
    query += ' AND role = ?'
    countQuery += ' AND role = ?'
    params.push(role)
    countParams.push(role)
  }
  
  const sortMapping = {
    'terbaru': 'created_at DESC',
    'terlama': 'created_at ASC',
    'nama_asc': 'username ASC',
    'nama_desc': 'username DESC'
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
  
  return {
    data: rows,
    meta: {
      page: pageNum,
      limit: limitNum,
      total_data: totalData,
      total_page: totalPage
    }
  }
}

module.exports = { getDashboardStats, getAllUsers }
