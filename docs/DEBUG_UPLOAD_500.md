# Chẩn đoán lỗi 500 khi Upload Avatar / Chứng tử

Khi app báo "Internal server error, Thử lại sau hoặc kiểm tra kết nối mạng".

---

## Bước 1: Xác định lỗi xảy ra ở đâu

Luồng: **Upload ảnh** (POST) → **Cập nhật profile** (PATCH). Lỗi có thể ở một trong hai bước.

### 1.1. Kiểm tra log main-api trên VPS

```bash
cd /opt/lifestyle-superapp

docker compose --env-file infrastructure/.env.production \
  -f infrastructure/docker/docker-compose.production.yml \
  logs -f main-api
```

Để tab log chạy, dùng app upload ảnh lại. Nếu thấy `[Express Error]` hoặc stack trace → copy toàn bộ để phân tích.

### 1.2. Test bằng Swagger (tách từng bước)

1. Mở https://api.vmd.asia/docs
2. **Authorize** với token DRIVER:
   - Đăng nhập app → (hoặc dùng Postman gọi POST /auth/login) → copy `accessToken`
   - Swagger → Authorize → Bearer `<accessToken>`
3. **Test upload:**
   - `POST /drivers/upload/avatar` → Chọn file ảnh (JPEG, < 5MB) → Execute
   - Nếu **200** + `{ url: "..." }` → upload OK
   - Nếu **400/500** → lỗi ở upload
4. **Test update profile:**
   - Nếu upload OK, copy `url` từ response
   - `PATCH /drivers/profile` → body: `{ "avatar_url": "https://api.vmd.asia/uploads/avatars/xxx.jpg" }` → Execute
   - Nếu **200** → update OK
   - Nếu **400/500** → lỗi ở update profile

---

## Bước 2: Xác minh đã deploy đúng code

```bash
cd /opt/lifestyle-superapp

# Xem main-api có chứa Express error handler không
docker exec lifestyle_main_api grep -A 2 "Express error handler" dist/main.js
```

Nếu không thấy dòng tương ứng → build/deploy chưa dùng code mới.

**Deploy lại đầy đủ:**

```bash
cd /opt/lifestyle-superapp

docker compose --env-file infrastructure/.env.production \
  -f infrastructure/docker/docker-compose.production.yml \
  build main-api --no-cache

docker compose --env-file infrastructure/.env.production \
  -f infrastructure/docker/docker-compose.production.yml \
  up -d --force-recreate main-api
```

---

## Bước 3: Kiểm tra Nginx

```bash
docker compose -f infrastructure/docker/docker-compose.production.yml logs nginx --tail 50
```

Nếu thấy 502 Bad Gateway → main-api có thể crash hoặc không phản hồi.

---

## Bước 4: Kiểm tra quyền thư mục uploads

```bash
docker exec lifestyle_main_api ls -la /app/uploads/
docker exec lifestyle_main_api ls -la /app/uploads/avatars/ 2>/dev/null || echo "Thư mục avatars chưa tồn tại"
```

Quyền cần cho phép user `nestjs` (UID 1001) ghi file.

---

## Nguyên nhân thường gặp

| Triệu chứng | Nguyên nhân có thể |
|-------------|--------------------|
| Log không có gì khi upload | Request chưa tới main-api (firewall, nginx, DNS) |
| Log có `[Express Error]` | Lỗi từ multer/upload hoặc DB |
| Swagger upload 200, app 500 | Lỗi ở bước PATCH profile (DB, validation) |
| 502 trong nginx logs | main-api crash hoặc timeout |

---

## Nếu vẫn không xử lý được

Gửi kèm:
1. Output `docker compose logs main-api` khi thử upload
2. Response từ Swagger (status code + body) cho POST upload và PATCH profile
