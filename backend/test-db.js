const mysql = require('mysql2/promise');

async function testDirect() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ardiansetya1',
    database: 'santo_connect'
  });

  const [rows] = await connection.query('SELECT id, nama, province FROM santo_connect.pesantren WHERE id = ?', [1]);
  console.log('Direct query result:', JSON.stringify(rows));
  
  await connection.end();
}

testDirect().catch(console.error);
