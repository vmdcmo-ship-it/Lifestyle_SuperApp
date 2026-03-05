# Bước Cuối Cùng: Sửa Web Chạy Nội Dung Cũ - Hướng Dẫn Copy-Paste

> **Dành cho:** Người chưa có kinh nghiệm Linux/Docker  
> **Mục tiêu:** Sửa lỗi https://www.vmd.asia vẫn hiển thị nội dung cũ/sitemap có lifestyle-app.com

---

## 📋 Chuẩn Bị

**Trên máy Windows:**
1. Mở **PowerShell** (Start → gõ "PowerShell")
2. Chuẩn bị mật khẩu SSH VPS (103.161.119.125)

---

## 🚀 Bước 1: SSH vào VPS

Trong PowerShell, chạy:
```powershell
ssh root@103.161.119.125
```

- Nhập mật khẩu khi được hỏi
- Chờ thấy prompt `root@azvps-…:~#` → đã vào VPS thành công

> ⚠️ **Lưu ý:** Tất cả các bước sau đây chạy TRÊN VPS (trong phiên SSH), không phải PowerShell!

---

## 🔧 Bước 2: Chạy script tự động sửa lỗi

### Cách A: Dùng script có sẵn (nếu đã rsync/git pull mới nhất)

```bash
cd /opt/lifestyle-superapp
bash infrastructure/scripts/fix-web-deploy-vps.sh
```

Nếu báo "No such file" → script chưa được đồng bộ, dùng **Cách B**.

---

### Cách B: Tạo và chạy script ngay trên VPS

**Copy toàn bộ khối này, paste vào terminal SSH, rồi Enter:**

```bash
cd /opt/lifestyle-superapp

cat <<'FIXSCRIPT' > /tmp/fix-web-now.sh
#!/bin/bash
set -e
cd /opt/lifestyle-superapp

echo "=== 1. Kiểm tra file ==="
[ ! -f "pnpm-lock.yaml" ] && echo "Đang git pull..." && git pull origin main || true
[ ! -f "pnpm-lock.yaml" ] && echo "❌ Vẫn thiếu pnpm-lock.yaml, kiểm tra repo" && exit 1

echo "=== 2. Tạo .env.production ==="
cp infrastructure/.env.production.template infrastructure/.env.production
sed -i 's|<CHANGE_THIS_STRONG_PASSWORD>|LifestyleDB@2026!|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_REDIS_PASSWORD>|RedisStrong@2026!|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_JWT_SECRET>|jwt_secret_min_64_chars_LifestyleApp_2026_Production_Key_Secret|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_REFRESH_SECRET>|refresh_secret_min_64_chars_LifestyleApp_2026_Production_Key|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_SESSION_SECRET>|session_secret_LifestyleApp_2026_Production|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_WEBHOOK_SECRET>|webhook_secret_LifestyleApp_2026_Production|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_ENCRYPTION_KEY_32_CHARS>|encryption_key_32_chars_2026_LS|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_INTERNAL_API_KEY>|internal_api_key_2026_production|g' infrastructure/.env.production
echo "✅ Env đã có password"

echo "=== 3. Recreate Redis ==="
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production stop redis 2>/dev/null || true
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production rm -f redis 2>/dev/null || true
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production up -d redis
sleep 15

echo "=== 4. Rebuild web + main-api (10-20 phút) ==="
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production build --no-cache web main-api

echo "=== 5. Start web + main-api ==="
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production up -d web main-api
sleep 30

echo ""
echo "=== 6. Kiểm tra ==="
docker ps | grep -E "CONTAINER|lifestyle_web|lifestyle_main_api|lifestyle_redis"
echo ""
docker logs lifestyle_web --tail 20
echo ""
docker exec lifestyle_web wget -qO- http://localhost:3001/sitemap.xml 2>/dev/null | head -15 || echo "Container chưa sẵn sàng"
echo ""
echo "✅ Xong! Mở trình duyệt Incognito: https://www.vmd.asia/sitemap.xml"
FIXSCRIPT

chmod +x /tmp/fix-web-now.sh
bash /tmp/fix-web-now.sh
```

---

## ⏱️ Thời gian chờ

- **Redis recreate:** ~15 giây
- **Build web + main-api:** 10-20 phút
- **Start containers:** ~30 giây

**Tổng:** khoảng 15-25 phút.

---

## ✅ Bước 3: Xác thực kết quả

### Trên VPS (kiểm tra sitemap nội bộ)

```bash
docker exec lifestyle_web wget -qO- http://localhost:3001/sitemap.xml 2>/dev/null | head -20
```

Phải thấy `<loc>https://www.vmd.asia/...`, không phải `lifestyle-app.com`.

### Trên máy Windows (kiểm tra bên ngoài)

1. Mở trình duyệt **Incognito** (Ctrl+Shift+N)
2. Truy cập: https://www.vmd.asia/sitemap.xml
3. Xem các `<loc>` phải là `https://www.vmd.asia/`

Nếu vẫn thấy `lifestyle-app.com`:
- Hard refresh (Ctrl+Shift+R)
- Xóa cache trình duyệt
- Purge CDN (Cloudflare/Fastly) nếu dùng

---

## 🔍 Nếu còn lỗi

### Lỗi "pnpm-lock.yaml not found"
```bash
cd /opt/lifestyle-superapp
ls -la pnpm-lock.yaml
git pull origin main
```

### Redis vẫn unhealthy
```bash
docker logs lifestyle_redis_prod --tail 50
```

Nếu thấy "wrong number of arguments" → password vẫn rỗng, kiểm tra:
```bash
grep REDIS_PASSWORD infrastructure/.env.production
```

### Web vẫn crash
```bash
docker logs lifestyle_web --tail 100
```

Nếu thấy "Cannot find module '/app/server.js'" → Dockerfile chưa được cập nhật, cần:
```bash
git pull origin main
```
Rồi chạy lại build.

---

## 📝 Tóm tắt siêu ngắn gọn

**Trên PowerShell:**
```powershell
ssh root@103.161.119.125
```

**Sau khi vào VPS, copy-paste khối này:**
```bash
cd /opt/lifestyle-superapp && git pull origin main && bash infrastructure/scripts/fix-web-deploy-vps.sh
```

Nếu script không có, dùng **Cách B** trong Bước 2 (copy toàn bộ khối `cat <<'FIXSCRIPT'` … `bash /tmp/fix-web-now.sh`).

**Chờ 15-25 phút → Mở Incognito → https://www.vmd.asia/sitemap.xml**

---

## ❓ Câu hỏi thường gặp

**Q: Tôi chạy `ssh` nhưng bị "Connection closed"?**  
A: Thử lại, đảm bảo nhập đúng mật khẩu khi được hỏi.

**Q: Tôi chạy `docker compose …` nhưng báo lỗi "unknown docker command: compose \\"?**  
A: Bạn đang ở PowerShell (Windows), không phải VPS. Phải SSH trước.

**Q: Script chạy xong nhưng sitemap vẫn có `lifestyle-app.com`?**  
A: Đó là cache CDN/trình duyệt. Purge CDN hoặc hard refresh.

**Q: Container vẫn unhealthy sau 5 phút?**  
A: Chạy `docker logs <tên_container> --tail 100` và gửi log để được hỗ trợ.
