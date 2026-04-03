const FormData = require('form-data')
const fetch = require('node-fetch')

async function test() {
  const form = new FormData()
  form.append('pesantren_id', '1')
  form.append('nama_lengkap', 'Ahmad Fauzi')
  form.append('nik', '3374010101010001')
  form.append('tempat_lahir', 'Semarang')
  form.append('tanggal_lahir', '2005-01-01')
  form.append('jenis_kelamin', 'L')
  form.append('alamat', 'Jl. Semarang No. 1')
  form.append('no_hp', '0811111111')
  form.append('nama_ayah', 'Budi')
  form.append('nama_ibu', 'Siti')
  form.append('no_hp_ortu', '0822222222')
  form.append('pekerjaan_ortu', 'Petani')

  console.log('Sending request...')

  const res = await fetch('http://localhost:3000/api/pendaftaran', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Niwicm9sZSI6InBlbmRhZnRhciIsImlhdCI6MTc3NTE4OTU2M30.EYBm3_qIk3Y8yk7thd7kWCRVMc5c9K2YeGP-BiL3PJ8'
    },
    body: form
  })

  const text = await res.text()
  console.log('Response:', text)
}

test().catch(console.error)
