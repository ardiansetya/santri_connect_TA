# Endpoint Compatibility Test Script
# This script tests all backend endpoints to verify they work correctly

$baseUrl = "http://localhost:3000/api"
$testResults = @()

function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Path,
        [string]$Description,
        [string]$ExpectedStatus = "200",
        [hashtable]$Body = $null,
        [hashtable]$Headers = $null
    )
    
    $url = "$baseUrl$Path"
    Write-Host "Testing: $Description" -ForegroundColor Cyan
    Write-Host "  URL: $Method $url" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $url
            Method = $Method
            UseBasicParsing = $true
            ErrorAction = 'Stop'
        }
        
        if ($Headers) {
            $params.Headers = $Headers
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
            $params.ContentType = 'application/json'
        }
        
        $response = Invoke-WebRequest @params
        $status = $response.StatusCode
        
        if ($status -eq $ExpectedStatus) {
            Write-Host "  ✓ PASS (Status: $status)" -ForegroundColor Green
            $testResults += @{
                Endpoint = "$Method $Path"
                Description = $Description
                Status = "PASS"
                ResponseStatus = $status
            }
        } else {
            Write-Host "  ✗ FAIL (Expected: $ExpectedStatus, Got: $status)" -ForegroundColor Red
            $testResults += @{
                Endpoint = "$Method $Path"
                Description = $Description
                Status = "FAIL"
                ExpectedStatus = $ExpectedStatus
                ResponseStatus = $status
            }
        }
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        Write-Host "  ✗ FAIL (Status: $status)" -ForegroundColor Red
        $testResults += @{
            Endpoint = "$Method $Path"
            Description = $Description
            Status = "FAIL"
            ResponseStatus = $status
            Error = $_.Exception.Message
        }
    }
    
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  ENDPOINT COMPATIBILITY TEST" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# Health Check
Test-Endpoint -Method "GET" -Path "/health" -Description "Health Check"

# Public Endpoints
Test-Endpoint -Method "GET" -Path "/public/stats" -Description "Public Stats"
Test-Endpoint -Method "GET" -Path "/pesantren" -Description "Public Pesantren List"

# Wilayah Endpoints
Test-Endpoint -Method "GET" -Path "/wilayah/provinces" -Description "Get Provinces"
Test-Endpoint -Method "GET" -Path "/wilayah/province/1" -Description "Get Province Detail"

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  TEST SUMMARY" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

$passed = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$total = $testResults.Count

Write-Host "Total Tests: $total" -ForegroundColor Cyan
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host ""

if ($failed -eq 0) {
    Write-Host "✓ All endpoints are working correctly!" -ForegroundColor Green
} else {
    Write-Host "✗ Some endpoints need attention:" -ForegroundColor Yellow
    $testResults | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
        Write-Host "  - $($_.Endpoint): $($_.Description)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Detailed Results:" -ForegroundColor Cyan
$testResults | Format-Table -AutoSize
