const mysql = require('mysql2/promise')
const dbConfig = require('./database')

let pool

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })
  }
  return pool
}

module.exports = { getPool }
