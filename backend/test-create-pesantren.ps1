$body = @{
    nama = "Pesantren Test"
    province = "Jawa Barat"
    kota = "Bandung"
    alamat = "Jl. Test No.1"
    tahun_berdiri = 2010
    biaya_pendaftaran = 1000000
    biaya_bulanan = 500000
    fasilitas = @("Asrama", "Masjid")
    kurikulum = "modern"
    email = "test@pesantren.com"
    telepon = "628123456789"
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3000/api/admin/pesantren' -Method POST -Body $body -ContentType 'application/json' -Headers @{ Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NzUxODgxODJ9.7YwLd4JnSTaBNm7thn274-DiZewBkIJU9Azlqzq1cBQ' }
