const FormData = require('form-data')
const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')

async function test() {
  const fastify = require('fastify')()
  await fastify.register(require('@fastify/jwt'), { 
    secret: process.env.JWT_SECRET || 'santri_connect_secret_key' 
  })
  const token = fastify.jwt.sign({ id: 6, role: 'pendaftar' })
  await fastify.close()

  const form = new FormData()
  const testFile = path.join(__dirname, 'src/images/test.jpg')
  
  form.append('pesantren_id', '1')
  form.append('nama_lengkap', 'Test Upload User')
  form.append('nik', '3374010101010003')
  form.append('tempat_lahir', 'Jakarta')
  form.append('tanggal_lahir', '2005-03-03')
  form.append('jenis_kelamin', 'L')
  form.append('alamat', 'Jl. Test Upload')
  form.append('no_hp', '08123456789')
  form.append('nama_ayah', 'Test Ayah')
  form.append('nama_ibu', 'Test Ibu')
  form.append('no_hp_ortu', '08987654321')
  form.append('pekerjaan_ortu', 'PNS')
  form.append('foto_ktp', fs.createReadStream(testFile))
  form.append('pas_foto', fs.createReadStream(testFile))
  form.append('kartu_keluarga', fs.createReadStream(testFile))

  console.log('Sending request with file uploads...')

  const res = await fetch('http://localhost:3000/api/pendaftaran', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: form
  })

  const json = await res.json()
  console.log('Response:', JSON.stringify(json, null, 2))
}

test().catch(console.error)
