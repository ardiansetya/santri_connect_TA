require('dotenv').config()
const mysql = require('mysql2/promise')

async function check() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })

  const [rows] = await conn.query("SELECT nama, foto_utama FROM pesantren WHERE nama LIKE 'Pesantren Darul %' LIMIT 5")
  console.log(rows)

  await conn.end()
}

check().catch(console.error)
