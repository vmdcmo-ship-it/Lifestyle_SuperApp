# ============================================================================
# Sync source code to VPS (when NOT using Git)
# ============================================================================
# Usage: .\infrastructure\scripts\sync-to-vps.ps1
# Prereq: scp/ssh accessible to root@103.161.119.125
# ============================================================================

$VPS = "root@103.161.119.125"
$REMOTE_DIR = "/opt/lifestyle-superapp-override"
$PROJECT_ROOT = $PSScriptRoot -replace '\\infrastructure\\scripts$', '' -replace '/infrastructure/scripts$', ''

if (-not (Test-Path "$PROJECT_ROOT/package.json")) {
    Write-Host "[ERROR] Khong tim thay package.json. Chay script tu thu muc project." -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Syncing source to VPS ($VPS)..." -ForegroundColor Cyan
Write-Host ""

# Create temp dir and copy files (avoids sending node_modules, .git, etc.)
$TEMP_DIR = Join-Path $env:TEMP "lifestyle-superapp-sync"
if (Test-Path $TEMP_DIR) { Remove-Item -Recurse -Force $TEMP_DIR }
New-Item -ItemType Directory -Path $TEMP_DIR | Out-Null

$items = @(
    "services",
    "infrastructure",
    "packages",
    "package.json",
    "pnpm-lock.yaml",
    "pnpm-workspace.yaml",
    "tsconfig.json"
)
if (Test-Path "$PROJECT_ROOT/.npmrc") { $items += ".npmrc" }

foreach ($item in $items) {
    $src = Join-Path $PROJECT_ROOT $item
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $TEMP_DIR -Recurse -Force
        Write-Host "  + $item" -ForegroundColor Green
    } else {
        Write-Host "  - $item (khong ton tai)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "[INFO] Creating remote dir and uploading..." -ForegroundColor Cyan
ssh $VPS "mkdir -p $REMOTE_DIR"
scp -r "$TEMP_DIR\*" "${VPS}:${REMOTE_DIR}/"
$exitCode = $LASTEXITCODE

Remove-Item -Recurse -Force $TEMP_DIR -ErrorAction SilentlyContinue

if ($exitCode -ne 0) {
    Write-Host "[ERROR] scp that bai (exit $exitCode). Kiem tra SSH key/password." -ForegroundColor Red
    exit $exitCode
}

Write-Host ""
Write-Host "[OK] Sync hoan thanh. Tiep theo tren VPS:" -ForegroundColor Green
Write-Host "  ssh $VPS" -ForegroundColor White
Write-Host "  cd /opt/lifestyle-superapp" -ForegroundColor White
Write-Host "  cp infrastructure/.env.production /tmp/env.backup" -ForegroundColor White
Write-Host "  cp -r /opt/lifestyle-superapp-override/* ." -ForegroundColor White
Write-Host "  [ -f /opt/lifestyle-superapp-override/.npmrc ] && cp /opt/lifestyle-superapp-override/.npmrc ." -ForegroundColor White
Write-Host "  cp /tmp/env.backup infrastructure/.env.production" -ForegroundColor White
Write-Host "  rm -rf /opt/lifestyle-superapp-override" -ForegroundColor White
Write-Host "  docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml build main-api --no-cache" -ForegroundColor White
Write-Host "  docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml up -d main-api" -ForegroundColor White
Write-Host ""
