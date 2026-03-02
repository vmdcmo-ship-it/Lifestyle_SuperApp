# ============================================================================
# DEPLOY WEB APP - Lifestyle Super App
# ============================================================================
# Run this script from PowerShell on your Windows machine
# Usage: .\DEPLOY_WEB.ps1
# ============================================================================

$VPS = "root@103.161.119.125"
$REMOTE_DIR = "/opt/lifestyle-superapp"
$LOCAL_DIR = "c:\Users\nguye\Lifestyle_SuperApp"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DEPLOY WEB APP - Lifestyle Super App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Upload updated files ──────────────────────────────────────────
Write-Host "[1/6] Uploading updated files to VPS..." -ForegroundColor Yellow

# Upload web app source
Write-Host "  -> apps/web/ (source code + services + config)"
scp -r "$LOCAL_DIR\apps\web\lib" "${VPS}:${REMOTE_DIR}/apps/web/"
scp -r "$LOCAL_DIR\apps\web\app\login" "${VPS}:${REMOTE_DIR}/apps/web/app/"
scp -r "$LOCAL_DIR\apps\web\app\providers.tsx" "${VPS}:${REMOTE_DIR}/apps/web/app/"
scp "$LOCAL_DIR\apps\web\app\layout.tsx" "${VPS}:${REMOTE_DIR}/apps/web/app/"
scp "$LOCAL_DIR\apps\web\next.config.js" "${VPS}:${REMOTE_DIR}/apps/web/"
scp "$LOCAL_DIR\apps\web\package.json" "${VPS}:${REMOTE_DIR}/apps/web/"
scp "$LOCAL_DIR\apps\web\.env.local" "${VPS}:${REMOTE_DIR}/apps/web/"

# Upload shared packages (types updated)
Write-Host "  -> packages/types/ (new backend-api types)"
scp "$LOCAL_DIR\packages\types\src\backend-api.ts" "${VPS}:${REMOTE_DIR}/packages/types/src/"
scp "$LOCAL_DIR\packages\types\src\index.ts" "${VPS}:${REMOTE_DIR}/packages/types/src/"

# Upload Docker config
Write-Host "  -> infrastructure/docker/ (Dockerfile + compose)"
scp "$LOCAL_DIR\infrastructure\docker\Dockerfile.web" "${VPS}:${REMOTE_DIR}/infrastructure/docker/"
scp "$LOCAL_DIR\infrastructure\docker\docker-compose.production.yml" "${VPS}:${REMOTE_DIR}/infrastructure/docker/"

# Upload nginx config
Write-Host "  -> infrastructure/nginx/ (nginx.conf)"
scp "$LOCAL_DIR\infrastructure\nginx\nginx.conf" "${VPS}:${REMOTE_DIR}/infrastructure/nginx/"

# Upload lockfile
Write-Host "  -> pnpm-lock.yaml"
scp "$LOCAL_DIR\pnpm-lock.yaml" "${VPS}:${REMOTE_DIR}/"

Write-Host "[1/6] Upload complete!" -ForegroundColor Green
Write-Host ""

# ── Step 2-6: Run on VPS ──────────────────────────────────────────────────
Write-Host "[2/6] Building and deploying on VPS..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Now SSH into VPS and run these commands:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "ssh ${VPS}" -ForegroundColor White
Write-Host ""
Write-Host "# Step 2: Go to project directory" -ForegroundColor Gray
Write-Host "cd ${REMOTE_DIR}" -ForegroundColor White
Write-Host ""
Write-Host "# Step 3: Build ONLY the web container (keep other services running)" -ForegroundColor Gray
Write-Host "docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production build web --no-cache" -ForegroundColor White
Write-Host ""
Write-Host "# Step 4: Restart web container" -ForegroundColor Gray
Write-Host "docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production up -d web" -ForegroundColor White
Write-Host ""
Write-Host "# Step 5: Restart nginx to pick up any config changes" -ForegroundColor Gray
Write-Host "docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production restart nginx" -ForegroundColor White
Write-Host ""
Write-Host "# Step 6: Verify" -ForegroundColor Gray
Write-Host "docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'" -ForegroundColor White
Write-Host "docker logs lifestyle_web --tail 20" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "After deployment, verify at:" -ForegroundColor Green
Write-Host "  https://vmd.asia" -ForegroundColor White
Write-Host "  http://103.161.119.125" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
