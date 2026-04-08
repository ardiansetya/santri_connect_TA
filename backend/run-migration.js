require('dotenv').config()
const { getPool } = require('./src/config/db')

async function runMigration() {
  const pool = getPool()
  
  console.log('Running migration: Add foto columns to pesantren table...')
  
  try {
    // Add foto_utama column
    await pool.query(`
      ALTER TABLE pesantren
      ADD COLUMN foto_utama VARCHAR(500) DEFAULT NULL AFTER deskripsi
    `)
    console.log('✓ Added foto_utama column')
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('• foto_utama column already exists')
    } else {
      console.error('Error adding foto_utama:', err.message)
    }
  }
  
  try {
    // Add foto_galeri column
    await pool.query(`
      ALTER TABLE pesantren
      ADD COLUMN foto_galeri JSON DEFAULT NULL AFTER foto_utama
    `)
    console.log('✓ Added foto_galeri column')
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('• foto_galeri column already exists')
    } else {
      console.error('Error adding foto_galeri:', err.message)
    }
  }
  
  console.log('Migration completed!')
  process.exit(0)
}

runMigration().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
