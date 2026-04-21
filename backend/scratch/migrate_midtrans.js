require('dotenv').config();
const db = require('../src/config/db');

async function migrate() {
  console.log('--- Starting Database Migration for Midtrans ---');
  const pool = db.getPool();
  try {
    const [columns] = await pool.query('SHOW COLUMNS FROM pendaftaran');
    const columnNames = columns.map(c => c.Field);

    // 1. Tambah order_id
    if (!columnNames.includes('order_id')) {
      console.log('Adding order_id column...');
      await pool.query(`ALTER TABLE pendaftaran ADD COLUMN order_id VARCHAR(50) UNIQUE AFTER nomor_pendaftaran`);
    }
    
    // 2. Tambah payment_status
    if (!columnNames.includes('payment_status')) {
      console.log('Adding payment_status column...');
      await pool.query(`ALTER TABLE pendaftaran ADD COLUMN payment_status ENUM('unpaid', 'payment_pending', 'paid', 'failed') DEFAULT 'unpaid' AFTER order_id`);
    }
    
    // 3. Tambah payment_token
    if (!columnNames.includes('payment_token')) {
      console.log('Adding payment_token column...');
      await pool.query(`ALTER TABLE pendaftaran ADD COLUMN payment_token VARCHAR(255) AFTER payment_status`);
    }
    
    // 4. Tambah payment_method
    if (!columnNames.includes('payment_method')) {
      console.log('Adding payment_method column...');
      await pool.query(`ALTER TABLE pendaftaran ADD COLUMN payment_method VARCHAR(50) AFTER payment_token`);
    }
    
    // 5. Tambah payment_amount
    if (!columnNames.includes('payment_amount')) {
      console.log('Adding payment_amount column...');
      await pool.query(`ALTER TABLE pendaftaran ADD COLUMN payment_amount DECIMAL(15, 2) AFTER payment_method`);
    }
    
    console.log('--- Migration Completed Successfully ---');
  } catch (err) {
    console.error('--- Migration Failed ---');
    console.error(err);
  } finally {
    process.exit(0);
  }
}

migrate();
