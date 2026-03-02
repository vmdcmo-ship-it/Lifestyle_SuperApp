# Hướng dẫn chạy Web Admin – Từng bước chi tiết

> **Mục đích:** Chạy Web Admin (Sprint 1) và Sprint 2 mà không gặp lỗi, theo thứ tự rõ ràng.

---

## 1. Yêu cầu hệ thống

| Thành phần    | Phiên bản   |
|---------------|-------------|
| Node.js       | ≥ 20.0.0    |
| npm           | ≥ 10.0.0    |
| PostgreSQL    | 16 (hoặc Docker) |
| Redis         | 7 (nếu main-api dùng) |

---

## 2. Bước 1: Chuẩn bị Database

### 2.1 PostgreSQL đang chạy

**Option A – Docker:**
```powershell
docker run -d --name lifestyle-pg -e POSTGRES_USER=lifestyle_admin -e POSTGRES_PASSWORD=Lifestyle@2026! -e POSTGRES_DB=lifestyle_db -p 5432:5432 postgres:16-alpine
```

**Option B – PostgreSQL cài sẵn:** Đảm bảo service chạy và có DB `lifestyle_db`.

### 2.2 Kiểm tra kết nối

```powershell
# PowerShell
psql -h localhost -U lifestyle_admin -d lifestyle_db -c "SELECT 1"
# Hoặc dùng pgAdmin / DBeaver để test
```

---

## 3. Bước 2: Cấu hình main-api

### 3.1 Tạo file `.env`

```powershell
cd c:\Users\nguye\Lifestyle_SuperApp\services\main-api
```

Nếu chưa có `.env`, copy từ `.env.example` hoặc tạo mới:

```env
PORT=3000
NODE_ENV=development

# Thay đổi nếu DB khác
DATABASE_URL=postgresql://lifestyle_admin:Lifestyle@2026!@localhost:5432/lifestyle_db

JWT_SECRET=lifestyle-super-app-jwt-secret-dev-2026
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

UPLOAD_DEST=./uploads
MAX_FILE_SIZE=52428800

# Redis (nếu dùng)
REDIS_URL=redis://:Redis@2026!@localhost:6379
```

### 3.2 Chạy migrations

```powershell
cd c:\Users\nguye\Lifestyle_SuperApp\services\main-api
npx prisma generate
npx prisma migrate deploy
```

Nếu dùng `db push` trong môi trường dev:

```powershell
npx prisma db push
```

### 3.3 Tạo tài khoản ADMIN

Chạy script seed:

```powershell
cd c:\Users\nguye\Lifestyle_SuperApp\services\main-api
npm run seed:admin
```

Tài khoản mặc định: `admin@lifestyle.local` / `Admin@123`  
Có thể đổi qua biến môi trường: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_FIRST_NAME`, `ADMIN_LAST_NAME`.

Hoặc tạo thủ công qua Prisma Studio:

```powershell
npx prisma studio
```

Trong Prisma Studio: tạo user mới trong bảng `users` (schema `core`) với:
- `email`: `admin@lifestyle.local`
- `password_hash`: Hash bcrypt của mật khẩu (ví dụ `Admin@123`)
- `first_name`: `Admin`
- `last_name`: `System`
- `display_name`: `Admin System`
- `role`: `ADMIN`
- `is_active`: `true`
- `ekyc_level`: `LEVEL_0`

---

## 4. Bước 3: Chạy main-api

```powershell
cd c:\Users\nguye\Lifestyle_SuperApp
npm run dev --workspace=services/main-api
```

Hoặc:

```powershell
cd c:\Users\nguye\Lifestyle_SuperApp\services\main-api
npm run start:dev
```

**Kiểm tra:**
- Log: `Running on: http://localhost:3000`
- Mở: http://localhost:3000/api/v1/health  
  Kỳ vọng: `{ "status": "ok", ... }`

---

## 5. Bước 4: Cấu hình Web Admin

### 5.1 Tạo `.env.local`

```powershell
cd c:\Users\nguye\Lifestyle_SuperApp\apps\web-admin
```

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 5.2 Cài đặt dependencies (nếu chưa)

```powershell
cd c:\Users\nguye\Lifestyle_SuperApp
npm install
```

---

## 6. Bước 5: Chạy Web Admin

```powershell
cd c:\Users\nguye\Lifestyle_SuperApp
npm run dev:web-admin
```

Hoặc:

```powershell
cd c:\Users\nguye\Lifestyle_SuperApp\apps\web-admin
npm run dev
```

**Kiểm tra:**
- Web Admin chạy tại: http://localhost:3001
- Nếu chưa đăng nhập → tự redirect tới `/login`

---

## 7. Bước 6: Kiểm tra luồng đăng nhập

1. Mở **http://localhost:3001**
2. Thấy trang đăng nhập
3. Nhập:
   - **Email:** `admin@lifestyle.local` (hoặc email admin đã tạo)
   - **Mật khẩu:** `Admin@123` (hoặc mật khẩu đã set khi seed)
4. Bấm **Đăng nhập**
5. Kỳ vọng:
   - Redirect tới Dashboard
   - Sidebar và Header hiển thị
   - Email + role ADMIN
6. Bấm **Đăng xuất** → về lại trang đăng nhập

---

## 8. Thứ tự chạy tóm tắt

```
1. PostgreSQL chạy
2. main-api .env + migrate + seed ADMIN
3. main-api chạy (port 3000)
4. web-admin .env.local
5. web-admin chạy (port 3001)
6. Mở http://localhost:3001 → Login → Dashboard
```

---

## 9. Lỗi thường gặp và cách xử lý

| Lỗi | Nguyên nhân | Cách xử lý |
|-----|-------------|-----------|
| `ECONNREFUSED localhost:5432` | PostgreSQL chưa chạy | Chạy PostgreSQL / Docker container |
| `ECONNREFUSED localhost:3000` | main-api chưa chạy | Chạy `npm run dev --workspace=services/main-api` |
| `Email hoặc mật khẩu không đúng` | Chưa có user ADMIN | Chạy seed-admin hoặc tạo user qua Prisma Studio |
| `Not allowed by CORS` | CORS sai cấu hình | main-api đã cho `localhost:3001`. Kiểm tra thứ tự chạy |
| Trang trắng / 404 | web-admin chưa build | `cd apps/web-admin && npm run build` rồi chạy lại |
| Redirect loop `/login` | Cookie không set | Mở DevTools → Application → Cookies, xóa cookie `admin_auth` |

---

## 10. Sau khi Sprint 1 ổn định: chạy Sprint 2

Sau khi login/dashboard hoạt động:

1. Cập nhật code Sprint 2
2. Web Admin đã chạy → chỉ cần refresh trình duyệt
3. Vào **Tài xế** → kiểm tra danh sách, chi tiết, duyệt/từ chối

---

*Tài liệu tham chiếu: [WEB_ADMIN_BUILD_SCHEDULE.md](./WEB_ADMIN_BUILD_SCHEDULE.md)*
