require('dotenv').config()
const { getPool } = require('./src/config/db')

async function checkData() {
  const pool = getPool()
  
  console.log('Checking data for pesantren id 21...')
  
  try {
    const [rows] = await pool.query('SELECT * FROM pesantren WHERE id = 21')
    console.log(JSON.stringify(rows[0], null, 2))
  } catch (err) {
    console.error('Error:', err.message)
  }
  
  process.exit(0)
}

checkData()
