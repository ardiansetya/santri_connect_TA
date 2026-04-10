// Test multipart upload langsung ke backend
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Create a test image file
const testImage = path.join(__dirname, 'test_image.jpg');
if (!fs.existsSync(testImage)) {
  // Create a minimal JPEG file (1x1 pixel)
  const minimalJpg = Buffer.from(
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==',
    'base64'
  );
  fs.writeFileSync(testImage, minimalJpg);
  console.log('📸 Created test image');
}

async function testUpload() {
  console.log('🧪 Testing multipart upload to backend...\n');

  // First, login to get token
  const loginData = JSON.stringify({
    email: 'pemilik@test.com',
    password: 'password123'
  });

  const loginOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };

  const loginReq = http.request(loginOptions, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('🔐 Login response:', res.statusCode);
      console.log('Response:', data);
      
      try {
        const parsed = JSON.parse(data);
        const token = parsed.token || parsed.data?.token;
        
        if (!token) {
          console.log('❌ No token received. Trying to register first...');
          return registerAndTest();
        }
        
        console.log('✅ Got token:', token.substring(0, 20) + '...\n');
        uploadWithToken(token);
      } catch (e) {
        console.log('❌ Failed to parse login response');
        registerAndTest();
      }
    });
  });

  loginReq.on('error', (e) => {
    console.log('❌ Login request failed:', e.message);
    console.log('💡 Make sure backend is running on http://localhost:3000');
  });

  loginReq.write(loginData);
  loginReq.end();
}

function registerAndTest() {
  const registerData = JSON.stringify({
    username: 'testpemilik',
    email: 'testpemilik@test.com',
    password: 'password123',
    role: 'pemilik'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(registerData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('🔐 Register response:', res.statusCode);
      console.log('Response:', data);
      
      // Now login with new account
      loginAndUpload('testpemilik@test.com', 'password123');
    });
  });

  req.write(registerData);
  req.end();
}

function loginAndUpload(email, password) {
  const loginData = JSON.stringify({ email, password });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        const token = parsed.token || parsed.data?.token;
        if (token) {
          console.log('✅ Got token\n');
          uploadWithToken(token);
        } else {
          console.log('❌ No token in response');
        }
      } catch (e) {
        console.log('❌ Failed to parse response');
      }
    });
  });

  req.write(loginData);
  req.end();
}

function uploadWithToken(token) {
  const form = new FormData();
  form.append('nama', 'Test Upload Pesantren');
  form.append('province', 'DKI JAKARTA');
  form.append('kota', 'KOTA JAKARTA SELATAN');
  form.append('alamat', 'Jl. Test No. 123');
  form.append('kurikulum', 'modern');
  
  // Attach file
  const testImage = path.join(__dirname, 'test_image.jpg');
  form.append('foto_utama', fs.createReadStream(testImage));

  const formHeaders = form.getHeaders();

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/pemilik/pesantren',
    method: 'POST',
    headers: {
      ...formHeaders,
      'Authorization': `Bearer ${token}`
    }
  };

  console.log('📤 Uploading to /api/pemilik/pesantren...');
  console.log('📋 Headers:', JSON.stringify(options.headers, null, 2));

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('\n📥 Response status:', res.statusCode);
      console.log('📥 Response headers:', JSON.stringify(res.headers, null, 2));
      console.log('📥 Response body:', data);
      
      // Check database after upload
      if (res.statusCode === 201) {
        console.log('\n✅ Upload successful! Checking database...');
        checkDatabase();
      } else {
        console.log('\n❌ Upload failed');
      }
    });
  });

  req.on('error', (e) => {
    console.log('❌ Upload request failed:', e.message);
  });

  form.pipe(req);
}

function checkDatabase() {
  const mysql = require('mysql2/promise');
  
  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ardiansetya1',
    database: 'santo_connect'
  }).then(async (conn) => {
    const [rows] = await conn.query('SELECT id, nama, foto_utama, foto_galeri FROM pesantren ORDER BY id DESC LIMIT 1');
    console.log('\n📊 Latest pesantren record:');
    console.log(JSON.stringify(rows[0], null, 2));
    
    // Check uploads folder
    const fs = require('fs');
    const path = require('path');
    const uploadDir = path.join(__dirname, 'uploads', 'pesantrenImages');
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      console.log('\n📁 Files in uploads/pesantrenImages/:');
      files.forEach(f => {
        const stats = fs.statSync(path.join(uploadDir, f));
        console.log(`  - ${f} (${(stats.size / 1024).toFixed(2)} KB)`);
      });
    }
    
    await conn.end();
    process.exit(0);
  }).catch(err => {
    console.error('❌ Database error:', err.message);
    process.exit(1);
  });
}

testUpload();
