const User = {
  async findByEmail(email) {
    const [rows] = await require('../config/db').getPool().query(
      'SELECT id, username, email, password, role, created_at, updated_at FROM users WHERE email = ?',
      [email]
    )
    return rows[0]
  },

  async findById(id) {
    const [rows] = await require('../config/db').getPool().query(
      'SELECT id, username, email, role, created_at, updated_at FROM users WHERE id = ?',
      [id]
    )
    return rows[0]
  },

  async create({ username, email, password, role = 'pendaftar' }) {
    const [result] = await require('../config/db').getPool().query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, password, role]
    )
    return result
  },

  async update(userId, { username, email }) {
    await require('../config/db').getPool().query(
      'UPDATE users SET username = ?, email = ?, updated_at = NOW() WHERE id = ?',
      [username, email, userId]
    )
  },

  async checkEmailExists(email, excludeId = null) {
    const query = excludeId
      ? 'SELECT id FROM users WHERE email = ? AND id != ?'
      : 'SELECT id FROM users WHERE email = ?'
    const [rows] = await require('../config/db').getPool().query(query, excludeId ? [email, excludeId] : [email])
    return rows.length > 0
  },

  async countAll() {
    const [rows] = await require('../config/db').getPool().query('SELECT COUNT(*) as total FROM users')
    return rows[0].total
  },

  async countByRole(role) {
    const [rows] = await require('../config/db').getPool().query(
      'SELECT COUNT(*) as total FROM users WHERE role = ?',
      [role]
    )
    return rows[0].total
  },

  async findAll({ search, role, page, limit, sort }) {
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

    const sortMap = {
      terbaru: 'created_at DESC',
      terlama: 'created_at ASC',
      nama_asc: 'username ASC',
      nama_desc: 'username DESC'
    }
    query += ` ORDER BY ${sortMap[sort] || sortMap.terbaru}`

    const offset = (page - 1) * limit
    query += ' LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const [rows] = await require('../config/db').getPool().query(query, params)
    const [countResult] = await require('../config/db').getPool().query(countQuery, countParams)

    return { data: rows, total: countResult[0].total }
  }
}

module.exports = User
