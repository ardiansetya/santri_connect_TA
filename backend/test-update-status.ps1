$body = @{
    status = "diterima"
    catatan_admin = "Dokumen lengkap dan valid"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri 'http://localhost:3000/api/admin/pendaftaran/1/status' -Method PUT -Body $body -ContentType 'application/json' -Headers @{ Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NzUxODgxODJ9.7YwLd4JnSTaBNm7thn274-DiZewBkIJU9Azlqzq1cBQ' }
$response | ConvertTo-Json
