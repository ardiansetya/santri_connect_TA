# Test Compare Pesantren
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NzUyMjg0MDF9.CrR7TwWKIczZ2MjQHkhg1nh35aN-5qPrBPzldVrT0es"
$headers = @{ Authorization = "Bearer $token" }

# Test 1: Valid compare (2 pesantren)
Write-Host "`n=== Test 1: Valid Compare (2 pesantren) ===" -ForegroundColor Yellow
try {
    $body = '{"pesantren_ids":[1,2]}'
    $r = Invoke-RestMethod -Uri 'http://localhost:3000/api/compare' -Method POST -Body $body -ContentType 'application/json' -Headers $headers
    Write-Host "PASS - Found $($r.data.Count) pesantren" -ForegroundColor Green
    $r.data | ForEach-Object { Write-Host "  - $($_.nama) | $($_.province) | Rp $($_.biaya_bulanan)" }
} catch {
    $resp = $_.Exception.Response
    $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
    $body = $reader.ReadToEnd()
    Write-Host "FAIL - Status: $($resp.StatusCode), Body: $body" -ForegroundColor Red
}

# Test 2: Too many pesantren (>3)
Write-Host "`n=== Test 2: Too Many Pesantren (>3) ===" -ForegroundColor Yellow
try {
    $body = '{"pesantren_ids":[1,2,3,4]}'
    $r = Invoke-RestMethod -Uri 'http://localhost:3000/api/compare' -Method POST -Body $body -ContentType 'application/json' -Headers $headers
    Write-Host "FAIL - Should have rejected" -ForegroundColor Red
} catch {
    $resp = $_.Exception.Response
    Write-Host "PASS - Status: $($resp.StatusCode)" -ForegroundColor Green
}

# Test 3: Invalid ID
Write-Host "`n=== Test 3: Invalid ID ===" -ForegroundColor Yellow
try {
    $body = '{"pesantren_ids":[999]}'
    $r = Invoke-RestMethod -Uri 'http://localhost:3000/api/compare' -Method POST -Body $body -ContentType 'application/json' -Headers $headers
    Write-Host "FAIL - Should have rejected" -ForegroundColor Red
} catch {
    $resp = $_.Exception.Response
    Write-Host "PASS - Status: $($resp.StatusCode)" -ForegroundColor Green
}

# Test 4: Empty array
Write-Host "`n=== Test 4: Empty Array ===" -ForegroundColor Yellow
try {
    $body = '{"pesantren_ids":[]}'
    $r = Invoke-RestMethod -Uri 'http://localhost:3000/api/compare' -Method POST -Body $body -ContentType 'application/json' -Headers $headers
    Write-Host "FAIL - Should have rejected" -ForegroundColor Red
} catch {
    $resp = $_.Exception.Response
    Write-Host "PASS - Status: $($resp.StatusCode)" -ForegroundColor Green
}
