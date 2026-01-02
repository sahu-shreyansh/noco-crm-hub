Write-Host "=== NocoDB Pagination Debugger ===" -ForegroundColor Cyan

# 1. Deploy Debug Function
Write-Host "Step 1: Deploying diagnostic function..." -ForegroundColor Yellow
$npxArgs = "supabase", "functions", "deploy", "debug-nocodb"
& npx -y $npxArgs

if ($LASTEXITCODE -ne 0) {
    Write-Error "Deployment failed! logs above."
    # Continue anyway in case deployment worked but exit code weird? No, exit.
    # Actually, allow continue if user wants to run locally against existing deploy?
    # but we just tried to deploy.
}

# 2. Find Credentials
Write-Host "`nStep 2: locating API keys in .env..." -ForegroundColor Yellow
$envPath = Join-Path $PWD ".env"
$supabaseUrl = $null
$supabaseKey = $null

if (Test-Path $envPath) {
    $lines = Get-Content $envPath
    foreach ($line in $lines) {
        if ($line -match "SUPABASE_URL.*?=(.*)") { $supabaseUrl = $matches[1].Trim().Trim('"').Trim("'") }
        if ($line -match "SUPABASE_ANON_KEY.*?=(.*)") { $supabaseKey = $matches[1].Trim().Trim('"').Trim("'") }
    }
}

if (-not $supabaseUrl) {
    if (Test-Path $envPath) {
        $lines = Get-Content $envPath
        foreach ($line in $lines) {
            if ($line -match "VITE_SUPABASE_URL.*?=(.*)") { $supabaseUrl = $matches[1].Trim().Trim('"').Trim("'") }
            if ($line -match "VITE_SUPABASE_ANON_KEY.*?=(.*)") { $supabaseKey = $matches[1].Trim().Trim('"').Trim("'") }
        }
    }
}

if ($supabaseUrl -and $supabaseKey) {
    $supabaseUrl = $supabaseUrl.TrimEnd("/")
    Write-Host "Found URL: $supabaseUrl" -ForegroundColor Gray
    
    # 3. Invoke
    $funcUrl = "$supabaseUrl/functions/v1/debug-nocodb"
    Write-Host "`nStep 3: Invoking Diagnostic ($funcUrl)..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri $funcUrl -Method Post -Headers @{ "Authorization" = "Bearer $supabaseKey"; "Content-Type" = "application/json" }
        
        Write-Host "`n=== DIAGNOSTIC RESULTS ===" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 5
        Write-Host "==========================" -ForegroundColor Green
        
        $t1 = $response.test1_view_default.listLength
        $t2 = $response.test2_view_limit100.listLength
        $t3 = $response.test3_no_view_limit10.listLength
        
        Write-Host "`nAnalysis:"
        Write-Host "Test 1 (View Default): $t1 rows"
        Write-Host "Test 2 (View Limit 100): $t2 rows"
        Write-Host "Test 3 (No View, Limit 20): $t3 rows"

        if ($t3 -gt $t2) {
             Write-Host "`n[CONCLUSION] The View '$($response.env.viewId)' is explicitly filtering/limiting data to $t2 records." -ForegroundColor Red
             Write-Host "             Please check the View Filters in NocoDB UI."
        } elseif ($t2 -eq 14 -and $t3 -le 14) {
             Write-Host "`n[CONCLUSION] The Table seems to only have $t3 records total accessible to API." -ForegroundColor Yellow
        }
        
    } catch {
        Write-Error "Setup success, but Invoke failed: $_"
        try {
             $stream = $_.Exception.Response.GetResponseStream()
             $reader = New-Object IO.StreamReader $stream
             Write-Host $reader.ReadToEnd() -ForegroundColor Red
        } catch {}
    }

} else {
    Write-Host "`nCould not try to auto-invoke (missing keys in .env)." -ForegroundColor Red
    Write-Host "Please manually run:"
    Write-Host "curl -X POST <URL>/functions/v1/debug-nocodb -H 'Authorization: Bearer <KEY>'"
}
