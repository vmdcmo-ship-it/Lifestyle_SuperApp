#!/bin/bash
# ============================================================================
# Script Tự Động Sửa Lỗi Web Hiển Thị Nội Dung Cũ
# ============================================================================
# Chạy script này TRÊN VPS sau khi SSH
# Cách dùng: bash infrastructure/scripts/fix-web-deploy-vps.sh
# ============================================================================

set -e

echo "============================================================================"
echo "  FIX WEB DEPLOYMENT - LIFESTYLE SUPERAPP"
echo "============================================================================"
echo ""

# Đảm bảo đang ở đúng thư mục
cd /opt/lifestyle-superapp || { echo "❌ Không tìm thấy /opt/lifestyle-superapp"; exit 1; }

# ============================================================================
# BƯỚC 1: Kiểm tra file cần thiết
# ============================================================================
echo ">>> BƯỚC 1: Kiểm tra file cần thiết..."

if [ ! -f "pnpm-lock.yaml" ]; then
    echo "⚠️ Thiếu pnpm-lock.yaml"
    echo "Đang thử git pull..."
    git pull origin main || echo "⚠️ Git pull thất bại, bỏ qua"
fi

if [ ! -f "infrastructure/.env.production.template" ]; then
    echo "❌ Thiếu template .env.production.template"
    exit 1
fi

echo "✅ File cần thiết đã có"
echo ""

# ============================================================================
# BƯỚC 2: Tạo/cập nhật .env.production
# ============================================================================
echo ">>> BƯỚC 2: Tạo .env.production từ template..."

# Backup file cũ nếu tồn tại
if [ -f "infrastructure/.env.production" ]; then
    cp infrastructure/.env.production infrastructure/.env.production.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Đã backup file env cũ"
fi

cp infrastructure/.env.production.template infrastructure/.env.production

# Thay các placeholder bằng giá trị mặc định (có thể chỉnh lại sau)
sed -i 's|<CHANGE_THIS_STRONG_PASSWORD>|LifestyleDB@2026!|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_REDIS_PASSWORD>|RedisStrong@2026!|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_JWT_SECRET>|jwt_secret_min_64_chars_LifestyleApp_2026_Production_Key_Secret_Random|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_REFRESH_SECRET>|refresh_secret_min_64_chars_LifestyleApp_2026_Production_Key_Random|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_SESSION_SECRET>|session_secret_LifestyleApp_2026_Production_Random|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_WEBHOOK_SECRET>|webhook_secret_LifestyleApp_2026_Production_Random|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_ENCRYPTION_KEY_32_CHARS>|encryption_key_32_chars_2026_LS|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_INTERNAL_API_KEY>|internal_api_key_2026_production_random|g' infrastructure/.env.production

echo "✅ File .env.production đã được tạo"
echo "⚠️ Lưu ý: Các API key bên ngoài (Google, Firebase...) cần điền thủ công nếu dùng"
echo ""

# ============================================================================
# BƯỚC 3: Stop và xóa Redis cũ
# ============================================================================
echo ">>> BƯỚC 3: Recreate Redis với password mới..."

docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production stop redis 2>/dev/null || true
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production rm -f redis 2>/dev/null || true

echo "Khởi động Redis mới..."
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production up -d redis

echo "Chờ 15 giây để Redis khởi động..."
sleep 15

# Kiểm tra Redis
REDIS_STATUS=$(docker ps --filter name=lifestyle_redis --format "{{.Status}}" | head -1)
if echo "$REDIS_STATUS" | grep -q "healthy"; then
    echo "✅ Redis đã healthy"
else
    echo "⚠️ Redis chưa healthy, kiểm tra log:"
    docker logs lifestyle_redis_prod --tail 20 || docker logs lifestyle_redis --tail 20 || true
    echo ""
    echo "Nếu vẫn lỗi, chạy: docker logs lifestyle_redis_prod --tail 50"
fi
echo ""

# ============================================================================
# BƯỚC 4: Rebuild web + main-api
# ============================================================================
echo ">>> BƯỚC 4: Rebuild web + main-api (--no-cache)..."
echo "⏱️ Quá trình này mất 10-20 phút, vui lòng chờ..."
echo ""

docker compose -f infrastructure/docker/docker-compose.production.yml \
  --env-file infrastructure/.env.production build --no-cache web main-api

echo "✅ Build hoàn tất"
echo ""

# ============================================================================
# BƯỚC 5: Start web + main-api
# ============================================================================
echo ">>> BƯỚC 5: Khởi động web + main-api..."

docker compose -f infrastructure/docker/docker-compose.production.yml \
  --env-file infrastructure/.env.production up -d web main-api

echo "Chờ 30 giây để container khởi động..."
sleep 30
echo ""

# ============================================================================
# BƯỚC 6: Kiểm tra kết quả
# ============================================================================
echo ">>> BƯỚC 6: Kiểm tra kết quả..."
echo ""

echo "=== Container status ==="
docker ps --filter name=lifestyle | grep -E "CONTAINER|lifestyle_web|lifestyle_main_api|lifestyle_redis"
echo ""

echo "=== Log web (20 dòng cuối) ==="
docker logs lifestyle_web --tail 20 2>&1
echo ""

echo "=== Test sitemap nội bộ ==="
docker exec lifestyle_web wget -qO- http://localhost:3001/sitemap.xml 2>/dev/null | head -15 || echo "⚠️ Container chưa sẵn sàng hoặc chưa chạy"
echo ""

echo "=== Biến môi trường trong container ==="
docker exec lifestyle_web env 2>/dev/null | grep -E "NEXT_PUBLIC|NODE_ENV" || echo "⚠️ Không lấy được env"
echo ""

# ============================================================================
# KẾT THÚC
# ============================================================================
echo "============================================================================"
echo "  ✅ HOÀN TẤT"
echo "============================================================================"
echo ""
echo "Bước tiếp theo:"
echo "1. Mở trình duyệt Incognito trên máy Windows"
echo "2. Truy cập: https://www.vmd.asia/sitemap.xml"
echo "3. Kiểm tra các <loc> phải là https://www.vmd.asia/..."
echo "4. Nếu vẫn thấy nội dung cũ: Purge CDN hoặc hard refresh (Ctrl+Shift+R)"
echo ""
echo "Nếu có lỗi, chạy:"
echo "  docker logs lifestyle_web --tail 50"
echo "  docker logs lifestyle_main_api --tail 50"
echo ""
