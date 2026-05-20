require('dotenv').config()
const mysql = require('mysql2/promise')

async function checkImages() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })

  const [rows] = await conn.query('SELECT nama, foto_utama, foto_galeri FROM pesantren LIMIT 5')
  
  console.log('--- Pesantren Images Check ---')
  rows.forEach(row => {
    console.log(`Nama: ${row.nama}`)
    console.log(`Foto Utama: ${row.foto_utama}`)
    console.log(`Foto Galeri: ${row.foto_galeri}`)
    console.log('-----------------------------')
  })

  await conn.end()
}

checkImages().catch(console.error)
