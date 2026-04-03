$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NzUyMjg0MDF9.CrR7TwWKIczZ2MjQHkhg1nh35aN-5qPrBPzldVrT0es"
$headers = @{ Authorization = "Bearer $token" }

# Test 1: Invalid province
Write-Host "`n=== Test 1: Invalid Province ===" -ForegroundColor Yellow
try {
    $body = '{"nama":"Test","province":"InvalidProvince","kota":"Bandung","kurikulum":"modern"}'
    $r = Invoke-RestMethod -Uri 'http://localhost:3000/api/admin/pesantren' -Method POST -Body $body -ContentType 'application/json' -Headers $headers
    Write-Host "FAIL - Should have rejected, got: $($r | ConvertTo-Json -Compress)" -ForegroundColor Red
} catch {
    $resp = $_.Exception.Response
    $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
    $body = $reader.ReadToEnd()
    Write-Host "PASS - Status: $($resp.StatusCode), Body: $body" -ForegroundColor Green
}

# Test 2: Valid province and kota
Write-Host "`n=== Test 2: Valid Province & Kota ===" -ForegroundColor Yellow
try {
    $body = '{"nama":"Pesantren Test Valid","province":"JAWA BARAT","kota":"KOTA BANDUNG","kurikulum":"modern"}'
    $r = Invoke-RestMethod -Uri 'http://localhost:3000/api/admin/pesantren' -Method POST -Body $body -ContentType 'application/json' -Headers $headers
    Write-Host "PASS - Response: $($r | ConvertTo-Json -Compress)" -ForegroundColor Green
} catch {
    $resp = $_.Exception.Response
    $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
    $body = $reader.ReadToEnd()
    Write-Host "FAIL - Status: $($resp.StatusCode), Body: $body" -ForegroundColor Red
}

# Test 3: Invalid kota
Write-Host "`n=== Test 3: Invalid Kota ===" -ForegroundColor Yellow
try {
    $body = '{"nama":"Test","province":"JAWA BARAT","kota":"InvalidCity","kurikulum":"modern"}'
    $r = Invoke-RestMethod -Uri 'http://localhost:3000/api/admin/pesantren' -Method POST -Body $body -ContentType 'application/json' -Headers $headers
    Write-Host "FAIL - Should have rejected, got: $($r | ConvertTo-Json -Compress)" -ForegroundColor Red
} catch {
    $resp = $_.Exception.Response
    $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
    $body = $reader.ReadToEnd()
    Write-Host "PASS - Status: $($resp.StatusCode), Body: $body" -ForegroundColor Green
}

# Test 4: Missing required field (schema validation)
Write-Host "`n=== Test 4: Missing Required Field ===" -ForegroundColor Yellow
try {
    $body = '{"province":"JAWA BARAT","kota":"KOTA BANDUNG"}'
    $r = Invoke-RestMethod -Uri 'http://localhost:3000/api/admin/pesantren' -Method POST -Body $body -ContentType 'application/json' -Headers $headers
    Write-Host "FAIL - Should have rejected, got: $($r | ConvertTo-Json -Compress)" -ForegroundColor Red
} catch {
    $resp = $_.Exception.Response
    $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
    $body = $reader.ReadToEnd()
    Write-Host "PASS - Status: $($resp.StatusCode), Body: $body" -ForegroundColor Green
}
