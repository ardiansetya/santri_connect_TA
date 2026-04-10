// Simulate exactly what frontend axios does
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testFrontendStyle() {
  console.log('🧪 Testing upload exactly like frontend axios...\n');

  // Login
  const loginRes = await axios.post('http://localhost:3000/api/login', {
    email: 'pemilik@test.com',
    password: 'password123'
  });
  
  const token = loginRes.data.data.token;
  console.log('✅ Got token\n');

  // Create FormData exactly like frontend
  const formData = new FormData();
  formData.append('nama', 'Frontend Style Test');
  formData.append('province', 'DKI JAKARTA');
  formData.append('kota', 'KOTA JAKARTA SELATAN');
  formData.append('alamat', 'Jl. Test');
  formData.append('kurikulum', 'modern');
  formData.append('tahun_berdiri', '2020');
  formData.append('jumlah_santri', '100');
  formData.append('jumlah_pengajar', '20');
  formData.append('biaya_bulanan', '500000');
  formData.append('biaya_pendaftaran', '1000000');
  formData.append('fasilitas', JSON.stringify(['Masjid', 'Asrama']));
  formData.append('deskripsi', 'Test description');
  formData.append('telepon', '021-123456');
  formData.append('email', 'test@test.com');

  // Attach file
  const testImage = path.join(__dirname, 'test_image.jpg');
  formData.append('foto_utama', fs.createReadStream(testImage));

  console.log('📤 Sending FormData with axios...');
  
  try {
    const res = await axios.post('http://localhost:3000/api/pemilik/pesantren', formData, {
      headers: {
        Authorization: `Bearer ${token}`
        // NO Content-Type - let axios set it automatically for FormData
      }
    });

    console.log('✅ Response:', res.data);
    
    // Check database
    const mysql = require('mysql2/promise');
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Ardiansetya1',
      database: 'santo_connect'
    });
    
    const [rows] = await conn.query('SELECT id, nama, foto_utama FROM pesantren ORDER BY id DESC LIMIT 1');
    console.log('\n📊 Latest record:', JSON.stringify(rows[0], null, 2));
    
    await conn.end();
  } catch (err) {
    console.error('❌ Error:', err.response?.status, err.response?.data);
  }
}

// Need to polyfill FormData for Node.js
const FormData = require('form-data');

testFrontendStyle();
