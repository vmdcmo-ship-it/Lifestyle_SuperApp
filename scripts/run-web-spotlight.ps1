# Chạy web Spotlight (main-api + web) để xem AI gợi ý
# Chạy: .\scripts\run-web-spotlight.ps1

$ErrorActionPreference = "Stop"
# Script nam trong scripts/ -> root = thu muc cha cua scripts
$root = Split-Path -Parent $PSScriptRoot

Write-Host "=== Lifestyle SuperApp - Chạy Spotlight Local ===" -ForegroundColor Cyan
Write-Host "Root: $root" -ForegroundColor Gray

# Ports (doi port neu bi trung: 3010, 3011, 3012...)
$apiPort = 3002
$webPort = 3011

# 1. Xoa cache Next.js neu co
$nextDir = Join-Path $root "apps\web\.next"
if (Test-Path $nextDir) {
    Write-Host "Xoa cache .next (tranh loi webpack)..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $nextDir
}

# 2. Start main-api (cua so moi)
Write-Host ""
Write-Host "Mo cua so moi cho main-api (port $apiPort)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\services\main-api'; `$env:PORT='$apiPort'; npm run dev"

# Doi API san sang
Write-Host "Cho API khoi dong (15s)..." -ForegroundColor Gray
Start-Sleep -Seconds 15

# 3. Start web
Write-Host ""
Write-Host "Khoi dong Web (port $webPort)..." -ForegroundColor Green
$env:NEXT_PUBLIC_API_URL = "http://localhost:$apiPort"
Set-Location (Join-Path $root "apps\web")

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Web:       http://localhost:$webPort" -ForegroundColor White
Write-Host "  Spotlight: http://localhost:$webPort/spotlight" -ForegroundColor White
Write-Host "  Tao video: http://localhost:$webPort/spotlight/create" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Luu y: Nut AI 'Goi y mo ta' can OPENAI_API_KEY trong apps\web\.env.local" -ForegroundColor DarkYellow
Write-Host "Nhan Ctrl+C de dung. Dong cua so API khi xong." -ForegroundColor Gray
Write-Host ""

npx next dev -p $webPort
