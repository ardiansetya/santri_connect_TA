const mysql = require('mysql2/promise');

async function checkDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ardiansetya1',
    database: 'santri_connect'
  });

  console.log('✅ Connected to database\n');

  // Check pesantren table structure
  console.log('📋 Pesantren table structure:');
  const [columns] = await connection.query(`
    SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'santri_connect' AND TABLE_NAME = 'pesantren'
    ORDER BY ORDINAL_POSITION
  `);
  columns.forEach(col => {
    console.log(`  - ${col.COLUMN_NAME} (${col.COLUMN_TYPE}) ${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'} ${col.COLUMN_DEFAULT !== null ? 'DEFAULT ' + col.COLUMN_DEFAULT : ''}`);
  });

  // Check existing pesantren data
  console.log('\n🕌 Existing pesantren records:');
  const [pesantren] = await connection.query('SELECT id, nama, foto_utama, foto_galeri FROM pesantren');
  pesantren.forEach(p => {
    console.log(`  [${p.id}] ${p.nama}`);
    console.log(`      foto_utama: ${p.foto_utama || '(null)'}`);
    console.log(`      foto_galeri: ${p.foto_galeri || '(null)'}`);
  });

  // Check if uploads directory has files
  const fs = require('fs');
  const path = require('path');
  const uploadDir = path.join(__dirname, 'uploads', 'pesantrenImages');
  
  console.log('\n📁 Files in uploads/pesantrenImages/:');
  if (fs.existsSync(uploadDir)) {
    const files = fs.readdirSync(uploadDir);
    if (files.length === 0) {
      console.log('  (empty - no files)');
    } else {
      files.forEach(f => {
        const stats = fs.statSync(path.join(uploadDir, f));
        console.log(`  - ${f} (${(stats.size / 1024).toFixed(2)} KB)`);
      });
    }
  } else {
    console.log('  (directory does not exist)');
  }

  await connection.end();
  console.log('\n✅ Done');
}

checkDatabase().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
