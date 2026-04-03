$body = @{
    nama = "Pesantren Test Updated"
    province = "Jawa Barat"
    kota = "Bandung"
    alamat = "Jl. Baru No.2"
    tahun_berdiri = 2015
    biaya_pendaftaran = 2000000
    biaya_bulanan = 600000
    fasilitas = @("Asrama", "Masjid", "WiFi")
    kurikulum = "modern"
    email = "updated@pesantren.com"
    telepon = "628987654321"
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3000/api/admin/pesantren/4' -Method PUT -Body $body -ContentType 'application/json' -Headers @{ Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NzUxODgxODJ9.7YwLd4JnSTaBNm7thn274-DiZewBkIJU9Azlqzq1cBQ' }
