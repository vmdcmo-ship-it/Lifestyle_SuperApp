# Deploy fix avatar - CHAY TOAN BO TREN MAY WINDOWS (PowerShell)
# Copy file len VPS roi tu dong chay build/up TREN VPS qua SSH
# Chay: .\scripts\deploy-avatar-fix.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "=== Buoc 1: Copy drivers.controller.ts ===" -ForegroundColor Cyan
scp services/main-api/src/modules/drivers/drivers.controller.ts root@103.161.119.125:/opt/lifestyle-superapp/services/main-api/src/modules/drivers/drivers.controller.ts
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "`n=== Buoc 2: Copy ocr.service.ts ===" -ForegroundColor Cyan
scp services/main-api/src/modules/drivers/ocr.service.ts root@103.161.119.125:/opt/lifestyle-superapp/services/main-api/src/modules/drivers/ocr.service.ts
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "`n=== Buoc 3: Copy drivers.module.ts ===" -ForegroundColor Cyan
scp services/main-api/src/modules/drivers/drivers.module.ts root@103.161.119.125:/opt/lifestyle-superapp/services/main-api/src/modules/drivers/drivers.module.ts
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "`n=== Buoc 3: SSH vao VPS va build + restart main-api (chay tren VPS qua SSH) ===" -ForegroundColor Cyan
Write-Host "Nhap mat khau VPS khi duoc hoi..." -ForegroundColor Yellow
ssh root@103.161.119.125 "cd /opt/lifestyle-superapp && docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production build main-api --no-cache && docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production up -d main-api"
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "`n=== HOAN TAT! Reload Expo Go (nhan r) va thu upload avatar lai. ===" -ForegroundColor Green
