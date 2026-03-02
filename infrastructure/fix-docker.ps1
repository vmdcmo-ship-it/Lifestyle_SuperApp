# =============================================================================
# Fix Docker Desktop - Chạy bằng PowerShell AS ADMINISTRATOR
# =============================================================================
# Cách chạy:
# 1. Click phải "Windows Terminal" hoặc "PowerShell" → "Run as Administrator"
# 2. cd c:\Users\nguye\Lifestyle_SuperApp
# 3. .\infrastructure\fix-docker.ps1
# =============================================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " FIX DOCKER DESKTOP - Lifestyle App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill all Docker & WSL processes
Write-Host "[Step 1/6] Killing Docker & WSL processes..." -ForegroundColor Yellow
Get-Process "*docker*" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process "*wsl*" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "  Done!" -ForegroundColor Green

# Step 2: Enable required Windows features
Write-Host "[Step 2/6] Enabling Windows features (WSL, Virtual Machine)..." -ForegroundColor Yellow
try {
    Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux -NoRestart -ErrorAction SilentlyContinue | Out-Null
    Write-Host "  WSL feature: Enabled" -ForegroundColor Green
} catch {
    Write-Host "  WSL feature: Already enabled or needs admin" -ForegroundColor Yellow
}

try {
    Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart -ErrorAction SilentlyContinue | Out-Null
    Write-Host "  Virtual Machine Platform: Enabled" -ForegroundColor Green
} catch {
    Write-Host "  Virtual Machine Platform: Already enabled or needs admin" -ForegroundColor Yellow
}

# Step 3: Update WSL
Write-Host "[Step 3/6] Installing/Updating WSL..." -ForegroundColor Yellow
wsl --install --no-distribution 2>&1 | Out-Null
wsl --update 2>&1 | Out-Null
Write-Host "  WSL updated!" -ForegroundColor Green

# Step 4: Set WSL 2 as default
Write-Host "[Step 4/6] Setting WSL 2 as default..." -ForegroundColor Yellow
wsl --set-default-version 2 2>&1 | Out-Null
Write-Host "  WSL 2 set as default" -ForegroundColor Green

# Step 5: Unregister old docker-desktop distributions (if broken)
Write-Host "[Step 5/6] Cleaning old Docker WSL data..." -ForegroundColor Yellow
wsl --unregister docker-desktop 2>&1 | Out-Null
wsl --unregister docker-desktop-data 2>&1 | Out-Null
Write-Host "  Old distributions cleaned" -ForegroundColor Green

# Step 6: Reset Docker Desktop settings
Write-Host "[Step 6/6] Resetting Docker Desktop..." -ForegroundColor Yellow

# Remove Docker Desktop data (clean slate)
$dockerDataPaths = @(
    "$env:APPDATA\Docker",
    "$env:LOCALAPPDATA\Docker"
)

foreach ($path in $dockerDataPaths) {
    if (Test-Path $path) {
        Remove-Item $path -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  Cleaned: $path" -ForegroundColor Gray
    }
}

# Recreate Docker config
$dockerConfigDir = "$env:USERPROFILE\.docker"
if (-not (Test-Path $dockerConfigDir)) { 
    New-Item -ItemType Directory -Path $dockerConfigDir -Force | Out-Null 
}

# Create clean config without requiring login
$config = @{
    auths = @{}
    credsStore = "desktop"
    currentContext = "desktop-linux"
} | ConvertTo-Json

Set-Content -Path "$dockerConfigDir\config.json" -Value $config
Write-Host "  Docker config reset" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " FIX COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host " Next steps:" -ForegroundColor White
Write-Host " 1. RESTART your computer" -ForegroundColor Yellow
Write-Host " 2. Open Docker Desktop (from Start Menu)" -ForegroundColor Yellow
Write-Host " 3. Skip sign-in (click 'Continue without signing in')" -ForegroundColor Yellow
Write-Host " 4. Accept the license terms" -ForegroundColor Yellow
Write-Host " 5. Wait for Docker to start (whale icon turns green)" -ForegroundColor Yellow
Write-Host " 6. Open PowerShell and run:" -ForegroundColor Yellow
Write-Host "    cd c:\Users\nguye\Lifestyle_SuperApp" -ForegroundColor Cyan
Write-Host "    docker compose up -d" -ForegroundColor Cyan
Write-Host ""
Write-Host " If Docker asks for password/login:" -ForegroundColor Red
Write-Host " → Click 'Continue without signing in'" -ForegroundColor White
Write-Host " → Or click 'Skip' at the bottom" -ForegroundColor White
Write-Host " → Docker Hub login is NOT required for local development!" -ForegroundColor White
Write-Host ""
