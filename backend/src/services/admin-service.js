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

module.exports = { getDashboardStats }
