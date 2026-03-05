# Xóa Cache — Đảm Bảo Sitemap Hiển Thị Đúng Domain (vmd.asia)

Khi sitemap vẫn hiển thị `lifestyle-app.com` sau khi đã sửa code, cần xóa cache ở **3 tầng**: Docker, Trình duyệt, CDN (nếu có).

---

## 1. Docker Build Cache (quan trọng nhất)

Sitemap được **sinh lúc build** và nhúng vào image. Nếu Docker dùng layer cache cũ → sitemap vẫn sai.

### Trên VPS — chạy lần lượt từng lệnh:

```bash
# Bước 1: SSH vào VPS
ssh root@103.161.119.125

# Bước 2: Vào thư mục project
cd /opt/lifestyle-superapp

# Bước 3: Dừng container web
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file .env stop web

# Bước 4: Xóa image web cũ (bắt buộc)
docker rmi lifestyle-superapp-web 2>/dev/null || docker rmi $(docker images -q 'lifestyle-superapp*web*') 2>/dev/null || true

# Bước 5: Xóa toàn bộ build cache (tùy chọn — nếu bước 4 chưa đủ)
docker builder prune -af

# Bước 6: Rebuild KHÔNG cache
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file .env build --no-cache web

# Bước 7: Chạy lại container
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file .env up -d web

# Bước 8: Kiểm tra container đang chạy
docker ps
```

### Nếu dùng file `infrastructure/.env.production`:

```bash
cd /opt/lifestyle-superapp
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production stop web
docker rmi lifestyle-superapp-web 2>/dev/null || true
docker builder prune -af
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production build --no-cache web
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file infrastructure/.env.production up -d web
```

---

## 2. Cache trình duyệt

### Chrome / Edge

1. Mở https://www.vmd.asia/sitemap.xml
2. **Ctrl + Shift + R** (hard refresh) — hoặc
3. **F12** → tab **Network** → tick **Disable cache** → F5

### Firefox

1. **Ctrl + Shift + Delete** → chọn "Cache" → Clear
2. Hoặc **Ctrl + F5** để hard refresh

### Kiểm tra qua Incognito / Private

Mở cửa sổ ẩn danh (Ctrl+Shift+N) rồi truy cập https://www.vmd.asia/sitemap.xml

---

## 3. CDN / Cloudflare (nếu có)

Nếu dùng Cloudflare hoặc CDN trước Nginx:

- **Cloudflare:** Dashboard → Caching → **Purge Everything**
- Hoặc purge riêng URL: `https://www.vmd.asia/sitemap.xml`

---

## 4. Kiểm tra trực tiếp từ container (bỏ qua Nginx)

Để chắc chắn container web trả đúng nội dung:

```bash
ssh root@103.161.119.125
docker exec lifestyle_web wget -qO- http://localhost:3001/sitemap.xml | head -50
```

Nếu kết quả có `https://www.vmd.asia` → container đúng, vấn đề ở cache bên ngoài.  
Nếu vẫn `lifestyle-app.com` → cần rebuild với `--no-cache` (bước 1).

---

## Tóm tắt — Copy cả khối (chạy trên VPS sau khi SSH)

```bash
cd /opt/lifestyle-superapp
ENV_FILE=".env"
[ -f infrastructure/.env.production ] && ENV_FILE="infrastructure/.env.production"
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file $ENV_FILE stop web
docker rmi lifestyle-superapp-web 2>/dev/null || true
docker builder prune -af
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file $ENV_FILE build --no-cache web
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file $ENV_FILE up -d web
echo ">>> Hoàn tất. Kiểm tra: docker ps"
```
