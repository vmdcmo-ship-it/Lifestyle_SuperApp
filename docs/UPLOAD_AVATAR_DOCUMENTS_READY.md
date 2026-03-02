# Upload Avatar & Chứng Từ — Sẵn sàng sử dụng

Tài liệu tóm tắt việc sửa lỗi Internal Server Error và hoàn thiện tính năng upload ảnh đại diện + giấy tờ cho app Driver.

---

## Các vấn đề đã xử lý

| Vấn đề | Nguyên nhân | Giải pháp |
|--------|-------------|-----------|
| **Internal Server Error** | Multer `fileFilter` reject `application/octet-stream` (RN/Expo thường gửi) | Thêm `application/octet-stream` + kiểm tra đuôi file |
| **500 thay vì 400** | Lỗi từ fileFilter trả về 500 | Global `HttpExceptionFilter` chuyển lỗi upload → 400 |
| **Lỗi khi file lớn** | MulterError.LIMIT_FILE_SIZE không xử lý | Exception filter bắt MulterError, trả 400 với message rõ ràng |
| **Token không lưu** | Backend trả `{ user, tokens }` nhưng mobile đọc `data.accessToken` | `extractTokens()` lấy đúng `data.tokens.accessToken` |
| **Session expired** | Không retry request sau refresh token | Logic retry trong `api.ts` |

---

## Luồng hoạt động

### 1. Upload ảnh đại diện
- User: **Tài khoản** → **Thông tin tài khoản** → Chạm avatar → Chụp/Chọn ảnh → **Dùng ảnh và lưu**
- API: `POST /api/v1/drivers/upload/avatar` → trả `{ url }` → `PATCH /api/v1/drivers/profile` với `avatar_url`

### 2. Upload giấy tờ (Cập nhật giấy tờ)
- User: **Tài khoản** → **Cập nhật giấy tờ** → Chọn loại (GPLX, CCCD, mặt trước, v.v.) → Chụp/Chọn ảnh → **Dùng ảnh và lưu**
- API: `POST /api/v1/drivers/upload/document` → `PATCH /api/v1/drivers/identity` hoặc `PATCH /api/v1/drivers/vehicles/:id`

### 3. Lưu trữ file
- Thư mục: `uploads/avatars`, `uploads/driver-faces`, `uploads/driver-documents`
- URL: `https://api.vmd.asia/uploads/avatars/<filename>`
- Docker volume: `main_api_uploads:/app/uploads` (dữ liệu không mất khi restart)

---

## Deploy lên VPS

Sau khi sửa code, cần deploy main-api:

```bash
# Trên VPS (SSH root@103.161.119.125)
cd /opt/lifestyle-superapp

# Sync code (nếu không dùng git)
# Hoặc: git pull origin main

docker compose --env-file infrastructure/.env.production \
  -f infrastructure/docker/docker-compose.production.yml \
  build main-api --no-cache

docker compose --env-file infrastructure/.env.production \
  -f infrastructure/docker/docker-compose.production.yml \
  up -d --force-recreate main-api
```

**File cần sync lên VPS (nếu không dùng git):**
- `services/main-api/src/main.ts`
- `services/main-api/src/common/http-exception.filter.ts` (mới)
- `services/main-api/src/modules/spotlight/upload.config.ts`
- `infrastructure/docker/docker-compose.production.yml`
- `infrastructure/.env.production` (thêm `JWT_ACCESS_EXPIRATION`, `JWT_REFRESH_EXPIRATION`)

---

## Kiểm tra nhanh

1. **Swagger:** https://api.vmd.asia/docs → Authorize với token DRIVER
2. **Upload avatar:** `POST /drivers/upload/avatar` → Chọn file → 200 + `{ url }`
3. **Mobile app:** Đăng xuất → Đăng nhập lại → Thử upload avatar / cập nhật giấy tờ

---

## Hạn chế file

- **Kích thước:** Tối đa 5MB (avatar, face, documents)
- **Định dạng:** JPEG, PNG, WebP, GIF
- **Lưu ý:** Nên thu nhỏ/nén ảnh trước khi upload để giảm thời gian tải
