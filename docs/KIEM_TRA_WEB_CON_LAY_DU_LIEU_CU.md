# Kiểm Tra Web Còn Lấy Dữ Liệu lifestyle-app

Khi https://www.vmd.asia vẫn hiển thị nội dung cũ hoặc URL `lifestyle-app.com`, làm theo các bước sau để tìm nguyên nhân và khắc phục.

---

## 1. Xác định "nội dung cũ" ở đâu

| Vị trí | Cách kiểm tra | Đã sửa trong code |
|--------|---------------|-------------------|
| **robots.txt** | https://www.vmd.asia/robots.txt | ✅ Hardcode vmd.asia |
| **sitemap.xml** | https://www.vmd.asia/sitemap.xml | ✅ Hardcode vmd.asia |
| **Canonical / meta** | Xem mã nguồn trang (Ctrl+U) → tìm `canonical`, `og:url` | ✅ Fallback vmd.asia |
| **Link trong bài viết** | API content/news/training trả về `url` | ✅ main-api dùng vmd.asia |
| **Email liên hệ** | support@... trên trang contact/help | ⚠️ Vẫn dùng support@lifestyle-app.com (chỉ là email) |

---

## 2. Kiểm tra trực tiếp trên VPS

**Cách dùng:** Mở SSH vào VPS (`ssh root@103.161.119.125`), sau đó **chạy từng lệnh một** hoặc copy cả khối vào terminal Linux (không copy lẫn output của PowerShell).

### Khối lệnh chạy trên VPS (chạy từng dòng một)

```bash
cd /opt/lifestyle-superapp
docker ps -a | grep lifestyle
```

Nếu thấy `lifestyle_web` có status `Up` nhưng `wget` vẫn "Connection refused" → web service bên trong có thể chưa sẵn sàng hoặc crash. Xem log:

```bash
docker logs lifestyle_web --tail 30
```

Nếu container **không chạy** hoặc **Exited**, khởi động lại:

```bash
cd /opt/lifestyle-superapp
docker compose -f infrastructure/docker/docker-compose.production.yml --env-file .env up -d web
sleep 30
docker exec lifestyle_web wget -qO- http://localhost:3001/sitemap.xml 2>/dev/null | head -20
```

### A. Xem sitemap từ trong container web

```bash
docker exec lifestyle_web wget -qO- http://localhost:3001/sitemap.xml 2>/dev/null | head -50
```

- Nếu thấy `https://www.vmd.asia` → container web đúng, vấn đề có thể là cache bên ngoài.
- Nếu thấy `lifestyle-app.com` → container web chưa được rebuild đúng.

### B. Xem biến môi trường trong container web

```bash
docker exec lifestyle_web env | grep -E "NEXT_PUBLIC|NODE_ENV"
```

Kỳ vọng: `NEXT_PUBLIC_BASE_URL=https://www.vmd.asia`, `NODE_ENV=production`.

### C. Kiểm tra thời gian build image

```bash
docker images | grep lifestyle
docker inspect lifestyle_web --format '{{.Created}}'
```

So sánh với thời điểm deploy gần nhất.

### D. Test API trả về URL thế nào

```bash
# Từ VPS: gọi qua nginx (host api.vmd.asia) hoặc từ trong container
curl -s "https://api.vmd.asia/api/v1/news/public/links?audience=USER&locale=vi" | head -200
```

Hoặc từ trong container main-api:

```bash
docker exec lifestyle_main_api wget -qO- "http://localhost:3000/api/v1/news/public/links?audience=USER&locale=vi" 2>/dev/null | head -200
```

Nếu `url` trong response chứa `lifestyle-app.com` → main-api chưa dùng code mới (cần rebuild main-api).

---

## 3. Nguyên nhân thường gặp

### A. Cache trình duyệt / CDN

- Thử **Ctrl+Shift+R** (hard refresh) hoặc mở **Incognito**.
- Nếu dùng **Cloudflare** (hoặc CDN khác): vào dashboard → Caching → **Purge Everything**.

### B. Container chưa rebuild

Workflow deploy có `--no-cache` cho web, nhưng nếu build lỗi im lặng, container cũ vẫn chạy.

**Khắc phục:** Rebuild thủ công trên VPS:

```bash
cd /opt/lifestyle-superapp

# Rebuild web (đảm bảo dùng đúng env)
docker compose -f infrastructure/docker/docker-compose.production.yml \
  --env-file .env build --no-cache web

docker compose -f infrastructure/docker/docker-compose.production.yml \
  --env-file .env up -d web
```

### C. main-api chưa rebuild

Các module content, news, training trong main-api trả về `url` dùng `webBaseUrl`. Nếu main-api dùng image cũ, response vẫn có thể chứa lifestyle-app.

**Khắc phục:** Rebuild main-api:

```bash
cd /opt/lifestyle-superapp

docker compose -f infrastructure/docker/docker-compose.production.yml \
  --env-file .env build --no-cache main-api

docker compose -f infrastructure/docker/docker-compose.production.yml \
  --env-file .env up -d main-api
```

### D. File .env trên VPS sai

Workflow dùng `--env-file .env`. File `.env` **không** bị rsync ghi đè (có `--exclude='.env'`).

**Kiểm tra:**

```bash
grep -E "BASE_URL|API_URL" /opt/lifestyle-superapp/.env
```

Nên có (hoặc không có, vì docker-compose đã hardcode):

- `NEXT_PUBLIC_BASE_URL=https://www.vmd.asia`
- Không có `lifestyle-app.com`

**Lưu ý:** `docker-compose.production.yml` đã hardcode `NEXT_PUBLIC_BASE_URL` trong build args của web, nên dù `.env` có sai thì build web vẫn dùng vmd.asia. Tuy nhiên các service khác có thể đọc từ env.

---

## 4. Rebuild toàn bộ (deploy all thủ công)

```bash
cd /opt/lifestyle-superapp

# Rebuild web + main-api, không dùng cache
docker compose -f infrastructure/docker/docker-compose.production.yml \
  --env-file .env build --no-cache web main-api

docker compose -f infrastructure/docker/docker-compose.production.yml \
  --env-file .env up -d web main-api

# Kiểm tra
docker ps
docker exec lifestyle_web wget -qO- http://localhost:3001/sitemap.xml 2>/dev/null | head -20
```

---

## 5. Tóm tắt

| Bước | Hành động |
|------|-----------|
| 1 | Kiểm tra sitemap/robots trong trình duyệt **Incognito** |
| 2 | Chạy `docker exec lifestyle_web wget -qO- http://localhost:3001/sitemap.xml` trên VPS |
| 3 | Nếu vẫn sai: rebuild `web` và `main-api` với `--no-cache` |
| 4 | Nếu dùng CDN: purge cache |
| 5 | Cập nhật `.env` trên VPS nếu còn `lifestyle-app.com` |
