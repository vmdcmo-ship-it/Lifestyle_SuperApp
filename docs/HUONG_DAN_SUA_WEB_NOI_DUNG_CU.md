# Hướng Dẫn Chi Tiết: Sửa Lỗi Web Hiển Thị Nội Dung Cũ

## Tóm tắt vấn đề

- **Hiện tượng:** Website https://www.vmd.asia vẫn hiển thị nội dung cũ hoặc sitemap có URL `lifestyle-app.com` dù đã deploy code mới.
- **Nguyên nhân chính:**
  1. **Container web crash do thiếu `server.js`** – Next.js trong monorepo tạo `server.js` ở `apps/web/server.js` nhưng Dockerfile cũ chạy `node server.js` ở root.
  2. **Redis không khởi được** – `REDIS_PASSWORD` trong `.env.production` để trống hoặc chưa có, làm Redis crash → web/main-api không chạy được.
  3. **File `pnpm-lock.yaml` thiếu** – Docker build không tìm thấy file này nên không thể install dependencies.
  4. **Cache CDN/browser** – Dù container mới đã chạy, người dùng vẫn nhận được cache cũ.

---

## Phần 1: Hiểu rõ môi trường làm việc

### A. Máy local Windows (PowerShell)
- **Đường dẫn:** `C:\Users\nguye\Lifestyle_SuperApp`
- **Mục đích:** Chỉnh code, commit, push lên GitHub
- **KHÔNG ĐƯỢC:** Chạy lệnh `cd /opt/...`, `nano`, hay các lệnh Linux khác

### B. VPS Ubuntu (SSH Terminal)
- **Địa chỉ:** `103.161.119.125`
- **User:** `root`
- **Đường dẫn project:** `/opt/lifestyle-superapp`
- **Mục đích:** Build Docker, deploy, chạy production stack
- **Cách vào:** `ssh root@103.161.119.125` từ PowerShell → nhập mật khẩu

---

## Phần 2: Checklist từng bước (copy-paste)

### Bước 1: Chuẩn bị script tự động trên VPS

**Trên PowerShell (Windows), chạy SSH:**
```powershell
ssh root@103.161.119.125
```

**Sau khi vào VPS (prompt `root@…:~#`), chạy từng khối sau:**

#### 1.1. Tạo script sửa env tự động

```bash
cat <<'SCRIPT1' > /tmp/fix-env.sh
#!/bin/bash
cd /opt/lifestyle-superapp

echo "=== Kiểm tra file cần thiết ==="
[ ! -f "pnpm-lock.yaml" ] && echo "⚠️ Thiếu pnpm-lock.yaml - cần git pull hoặc rsync" && exit 1
[ ! -f "infrastructure/.env.production.template" ] && echo "⚠️ Thiếu template" && exit 1

echo "=== Tạo .env.production từ template ==="
cp infrastructure/.env.production.template infrastructure/.env.production

echo "=== Điền các giá trị cần thiết ==="
# Thay các placeholder bằng giá trị thực
sed -i 's|<CHANGE_THIS_STRONG_PASSWORD>|LifestyleDB@2026!|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_REDIS_PASSWORD>|RedisStrong@2026!|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_JWT_SECRET>|jwt_secret_min_64_chars_LifestyleApp_2026_Production_Key_Secret|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_REFRESH_SECRET>|refresh_secret_min_64_chars_LifestyleApp_2026_Production_Key|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_SESSION_SECRET>|session_secret_LifestyleApp_2026_Production|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_WEBHOOK_SECRET>|webhook_secret_LifestyleApp_2026_Production|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_ENCRYPTION_KEY_32_CHARS>|encryption_key_32_chars_2026_LS|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_INTERNAL_API_KEY>|internal_api_key_2026_production|g' infrastructure/.env.production

echo "✅ File .env.production đã được tạo và điền giá trị cơ bản"
echo "⚠️ Lưu ý: Các API key (Google, Firebase, Payment...) vẫn cần điền thủ công nếu cần dùng"
SCRIPT1

chmod +x /tmp/fix-env.sh
```

#### 1.2. Chạy script để tạo env

```bash
bash /tmp/fix-env.sh
```

Nếu báo "Thiếu pnpm-lock.yaml" → chạy `git pull` hoặc đợi rsync từ GitHub Actions:
```bash
cd /opt/lifestyle-superapp
git pull origin main
```

---

### Bước 2: Fix Redis (recreate với password mới)

```bash
cd /opt/lifestyle-superapp
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production stop redis
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production rm -f redis
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production up -d redis
```

Chờ 10 giây, kiểm tra:
```bash
docker ps | grep redis
```

Phải thấy `(healthy)` ở cột STATUS.

---

### Bước 3: Rebuild web + main-api (với server.js path đúng)

```bash
cd /opt/lifestyle-superapp
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production build --no-cache web main-api
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production up -d web main-api
```

Build mất ~10-20 phút. Chờ xong, kiểm tra:
```bash
docker ps
```

Phải thấy `lifestyle_web` và `lifestyle_main_api` đều `Up` (có thể `unhealthy` trong 30s đầu là bình thường).

---

### Bước 4: Kiểm tra sitemap nội bộ

```bash
docker exec lifestyle_web wget -qO- http://localhost:3001/sitemap.xml 2>/dev/null | head -20
```

Phải thấy `<loc>https://www.vmd.asia/...`, không phải `lifestyle-app.com`.

---

### Bước 5: Kiểm tra log không còn lỗi

```bash
docker logs lifestyle_web --tail 30
```

Không còn lỗi "Cannot find module '/app/server.js'" hay "Failed to find Server Action".

---

### Bước 6: Xác thực bên ngoài (trình duyệt)

**Trên máy Windows**, mở trình duyệt **Incognito**:
- https://www.vmd.asia
- https://www.vmd.asia/sitemap.xml

Nếu vẫn thấy nội dung cũ:
- Xóa cache trình duyệt (Ctrl+Shift+Delete)
- Purge CDN nếu dùng Cloudflare/Fastly
- Hard refresh (Ctrl+Shift+R)

---

## Phần 3: Script tổng hợp (copy-paste một lần)

Nếu muốn chạy tất cả một lúc, copy khối này vào terminal SSH (sau khi đã vào VPS):

```bash
cd /opt/lifestyle-superapp

# Tạo script fix env
cat <<'SCRIPTFIX' > /tmp/fix-env-redis-web.sh
#!/bin/bash
set -e
cd /opt/lifestyle-superapp

echo "=== 1. Tạo .env.production ==="
cp infrastructure/.env.production.template infrastructure/.env.production
sed -i 's|<CHANGE_THIS_STRONG_PASSWORD>|LifestyleDB@2026!|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_REDIS_PASSWORD>|RedisStrong@2026!|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_JWT_SECRET>|jwt_secret_min_64_chars_LifestyleApp_2026_Production_Key_Secret|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_REFRESH_SECRET>|refresh_secret_min_64_chars_LifestyleApp_2026_Production_Key|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_SESSION_SECRET>|session_secret_LifestyleApp_2026_Production|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_WEBHOOK_SECRET>|webhook_secret_LifestyleApp_2026_Production|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_ENCRYPTION_KEY_32_CHARS>|encryption_key_32_chars_2026_LS|g' infrastructure/.env.production
sed -i 's|<CHANGE_THIS_INTERNAL_API_KEY>|internal_api_key_2026_production|g' infrastructure/.env.production
echo "✅ Env đã sẵn sàng"

echo "=== 2. Recreate Redis ==="
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production stop redis || true
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production rm -f redis || true
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production up -d redis
sleep 15
docker ps | grep redis

echo "=== 3. Rebuild web + main-api ==="
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production build --no-cache web main-api

echo "=== 4. Start web + main-api ==="
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production up -d web main-api

echo "=== 5. Chờ 30s để container khởi động ==="
sleep 30

echo "=== 6. Kiểm tra ==="
docker ps
echo ""
echo "=== Log web ==="
docker logs lifestyle_web --tail 20
echo ""
echo "=== Sitemap test ==="
docker exec lifestyle_web wget -qO- http://localhost:3001/sitemap.xml 2>/dev/null | head -15 || echo "Lỗi: container chưa sẵn sàng"

echo ""
echo "=== Hoàn tất ==="
echo "Bây giờ mở trình duyệt Incognito và vào https://www.vmd.asia/sitemap.xml"
SCRIPTFIX

chmod +x /tmp/fix-env-redis-web.sh
bash /tmp/fix-env-redis-web.sh
```

Khối này sẽ tự động:
1. Tạo file env với password
2. Recreate Redis
3. Build + start web/main-api
4. Kiểm tra kết quả

---

## Phần 4: Nếu còn lỗi

### Lỗi "pnpm-lock.yaml not found"
```bash
cd /opt/lifestyle-superapp
git status
git pull origin main
```

Hoặc nếu repo không phải git, chạy lại rsync từ GitHub Actions.

### Lỗi Redis vẫn unhealthy
```bash
docker logs lifestyle_redis_prod --tail 50
```
Xem log cụ thể, có thể cần xóa volume cũ:
```bash
docker volume rm lifestyle_postgres_data lifestyle_redis_data
```

### Container web vẫn crash
```bash
docker logs lifestyle_web --tail 100
```
Gửi log này để tôi phân tích tiếp.

---

## Tóm tắt: Bạn chỉ cần làm

1. **Trên PowerShell:** `ssh root@103.161.119.125`
2. **Sau khi vào VPS:** Copy toàn bộ khối script ở **Phần 3** → paste vào terminal → Enter
3. **Chờ ~15-20 phút** script chạy xong
4. **Mở trình duyệ Incognito:** https://www.vmd.asia/sitemap.xml

Nếu script báo lỗi, gửi output để tôi hỗ trợ tiếp.
