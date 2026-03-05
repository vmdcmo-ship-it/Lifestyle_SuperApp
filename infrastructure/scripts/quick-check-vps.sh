#!/bin/bash
# ============================================================================
# Script Kiểm Tra Nhanh Trạng Thái Web Trên VPS
# ============================================================================
# Chạy: bash infrastructure/scripts/quick-check-vps.sh
# ============================================================================

cd /opt/lifestyle-superapp 2>/dev/null || cd "$(dirname "$0")/../.."

echo "============================================================================"
echo "  KIỂM TRA TRẠNG THÁI - LIFESTYLE SUPERAPP"
echo "============================================================================"
echo ""

echo "=== 1. Container status ==="
docker ps -a | grep -E "CONTAINER|lifestyle" || echo "Không có container nào"
echo ""

echo "=== 2. Redis health ==="
REDIS_STATUS=$(docker ps --filter name=redis --format "{{.Status}}" | head -1)
if echo "$REDIS_STATUS" | grep -q "healthy"; then
    echo "✅ Redis healthy"
else
    echo "❌ Redis không healthy:"
    echo "   $REDIS_STATUS"
    echo "   Log Redis:"
    docker logs lifestyle_redis_prod --tail 10 2>&1 || docker logs lifestyle_redis --tail 10 2>&1 || true
fi
echo ""

echo "=== 3. Web container log (20 dòng cuối) ==="
docker logs lifestyle_web --tail 20 2>&1 || echo "Container không chạy"
echo ""

echo "=== 4. Main-api container log (20 dòng cuối) ==="
docker logs lifestyle_main_api --tail 20 2>&1 || echo "Container không chạy"
echo ""

echo "=== 5. Test sitemap nội bộ ==="
SITEMAP_TEST=$(docker exec lifestyle_web wget -qO- http://localhost:3001/sitemap.xml 2>/dev/null | head -10)
if [ -z "$SITEMAP_TEST" ]; then
    echo "❌ Không lấy được sitemap từ container"
else
    echo "$SITEMAP_TEST"
    if echo "$SITEMAP_TEST" | grep -q "https://www.vmd.asia"; then
        echo ""
        echo "✅ Sitemap dùng đúng domain vmd.asia"
    else
        echo ""
        echo "⚠️ Sitemap chưa dùng vmd.asia"
    fi
fi
echo ""

echo "=== 6. Biến môi trường NEXT_PUBLIC ==="
docker exec lifestyle_web env 2>/dev/null | grep NEXT_PUBLIC || echo "Không lấy được env"
echo ""

echo "============================================================================"
echo "  KẾT THÚC KIỂM TRA"
echo "============================================================================"
echo ""
echo "Nếu mọi thứ OK, mở trình duyệt Incognito và kiểm tra:"
echo "  https://www.vmd.asia/sitemap.xml"
echo ""
