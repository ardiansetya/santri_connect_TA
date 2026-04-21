require('dotenv').config()
const mysql = require('mysql2/promise')
const bcrypt = require('bcrypt')

async function seedSuperadmin() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    })

    console.log('🌱 Seeding Superadmin...')

    const password = 'password123'
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Check if superadmin exists
    const [rows] = await conn.query("SELECT * FROM users WHERE role = 'superadmin' LIMIT 1")
    
    if (rows.length > 0) {
      console.log(`Updating existing superadmin: ${rows[0].email}`)
      await conn.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, rows[0].id])
    } else {
      console.log('Creating new superadmin...')
      await conn.query(
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
        ['admin', 'admin@santriconnect.id', hashedPassword, 'superadmin']
      )
    }

    console.log('✅ Superadmin seeded successfully!')
    console.log('Username: admin')
    console.log('Email: admin@santriconnect.id')
    console.log('Password: ' + password)

    await conn.end()
  } catch (err) {
    console.error('❌ Error seeding superadmin:', err.message)
    process.exit(1)
  }
}

seedSuperadmin()
