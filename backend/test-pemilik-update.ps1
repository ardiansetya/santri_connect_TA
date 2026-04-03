$body = @{
    nama = "Pesantren Al-Hikmah Updated"
    province = "Jawa Tengah"
    kota = "Semarang"
    alamat = "Jl. Baru No.2"
    tahun_berdiri = 2010
    jumlah_santri = 550
    biaya_pendaftaran = 2000000
    biaya_bulanan = 800000
    fasilitas = @("Asrama", "Masjid", "WiFi")
    kurikulum = "modern"
    email = "updated@alhikmah.com"
    telepon = "628123456789"
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3000/api/pemilik/pesantren/2' -Method PUT -Body $body -ContentType 'application/json' -Headers @{ Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InBlbWlsaWsiLCJpYXQiOjE3NzUxOTk5Mzh9.ASr9yU2J_U9T5yN6jSmpigjOU4U1yLumaKP4-14FL4s' }
