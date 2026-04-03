$body = @{
    budget = 800000
    provinsi = "Jawa Tengah"
    fasilitas = @("Masjid", "Asrama")
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri 'http://localhost:3000/api/rekomendasi' -Method POST -Body $body -ContentType 'application/json'
$response | ConvertTo-Json -Depth 5
