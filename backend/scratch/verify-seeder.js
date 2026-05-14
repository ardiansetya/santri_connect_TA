require('dotenv').config()
const mysql = require('mysql2/promise')

async function check() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })

  const [users] = await conn.query('SELECT role, COUNT(*) as count FROM users GROUP BY role')
  const [pesantren] = await conn.query('SELECT COUNT(*) as count FROM pesantren')
  const [pendaftaran] = await conn.query('SELECT COUNT(*) as count FROM pendaftaran')

  console.log('--- Database Counts ---')
  console.log('Users by Role:', users)
  console.log('Total Pesantren:', pesantren[0].count)
  console.log('Total Pendaftaran:', pendaftaran[0].count)

  await conn.end()
}

check().catch(console.error)
