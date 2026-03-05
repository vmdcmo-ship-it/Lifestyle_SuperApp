#!/bin/bash
# Chạy script này TRÊN VPS sau khi SSH
# Cách 1: cd /opt/lifestyle-superapp && bash infrastructure/scripts/check-web-vps.sh
# Cách 2: bash /opt/lifestyle-superapp/infrastructure/scripts/check-web-vps.sh

cd /opt/lifestyle-superapp 2>/dev/null || cd "$(dirname "$0")/../.."

echo "=== 1. Trạng thái container ==="
docker ps -a | grep -E "lifestyle|CONTAINER" || true

echo ""
echo "=== 2. Log 20 dòng cuối lifestyle_web ==="
docker logs lifestyle_web --tail 20 2>&1 || echo "(Container chưa chạy hoặc không tồn tại)"

echo ""
echo "=== 3. Test sitemap từ trong container ==="
docker exec lifestyle_web wget -qO- http://localhost:3001/sitemap.xml 2>/dev/null | head -15 || echo "(Lỗi: Connection refused thường do web chưa start hoặc crash)"

echo ""
echo "=== 4. Env trong container web ==="
docker exec lifestyle_web env 2>/dev/null | grep -E "NEXT_PUBLIC|NODE_ENV" || echo "(Container không chạy)"

echo ""
echo "=== Hoàn tất ==="
