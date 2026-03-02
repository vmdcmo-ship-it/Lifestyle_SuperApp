# Deploy main-api (fix avatar static serving)
# Chạy từ thư mục root của project: .\scripts\deploy-main-api-avatar-fix.ps1

$VPS = "root@103.161.119.125"
$REMOTE = "/opt/lifestyle-superapp"

Write-Host "=== Buoc 1: Copy source main.ts len VPS ===" -ForegroundColor Cyan
scp services/main-api/src/main.ts "${VPS}:${REMOTE}/services/main-api/src/main.ts"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Loi SCP. Kiem tra ket noi SSH." -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Buoc 2: SSH vao VPS va rebuild main-api ===" -ForegroundColor Cyan
Write-Host "Chay cac lenh sau tren VPS (hoac copy-paste khi SSH):" -ForegroundColor Yellow
Write-Host @"

cd $REMOTE
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production build main-api --no-cache
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production up -d main-api

"@ -ForegroundColor White
