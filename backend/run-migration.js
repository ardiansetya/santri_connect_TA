require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true // Required to run full .sql files
  };

  const dbName = process.env.DB_NAME || 'santri_connect';

  console.log('🚀 Starting Database Initialization...');

  try {
    // 1. Connect without database
    const connection = await mysql.createConnection(connectionConfig);
    console.log(`✅ Connected to MySQL server as ${connectionConfig.user}`);

    // 2. Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database "${dbName}" checked/created.`);

    // 3. Switch to the database
    await connection.changeUser({ database: dbName });
    console.log(`✅ Switched to database "${dbName}".`);

    // 4. Run Schema
    console.log('📄 Applying schema.sql...');
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schemaSql);
      console.log('✅ Schema applied successfully.');
    } else {
      console.warn('⚠️ schema.sql not found at', schemaPath);
    }

    // 5. Run Auto Seeding
    console.log('🌱 Starting Auto-Seeding...');
    const seedPath = path.join(__dirname, 'db', 'seed_pesantren_lengkap.sql');
    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      // Using TRUNCATE or IGNORE patterns in the SQL file is recommended
      // For now, we assume seed_pesantren_lengkap.sql is safe or we use INSERT IGNORE
      await connection.query(seedSql);
      console.log('✅ Seeding completed successfully.');
    } else {
      console.warn('⚠️ seed_pesantren_lengkap.sql not found at', seedPath);
    }

    console.log('\n✨ Database is ready to use!');
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Initialization failed:');
    console.error(err.message);
    process.exit(1);
  }
}

runMigration();
