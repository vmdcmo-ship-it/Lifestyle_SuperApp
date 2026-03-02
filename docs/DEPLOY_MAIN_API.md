# Deploy main-api mới lên VPS

## Thông tin VPS (Lifestyle Super App)

> **Lưu ý:** Các lệnh `cd /opt/...`, `docker compose`, `git pull` chạy **trên VPS**. Cần **SSH vào VPS** bằng `ssh root@103.161.119.125` (trong PowerShell Windows) **trước khi** chạy các lệnh đó. Chạy trong PowerShell mà không SSH sẽ báo lỗi `Cannot find path 'C:\opt\...'`.

| Mục | Giá trị |
|-----|---------|
| **VPS IP** | `103.161.119.125` |
| **SSH user** | `root` |
| **Lệnh SSH** | `ssh root@103.161.119.125` |
| **Thư mục dự án trên VPS** | `/opt/lifestyle-superapp` |
| **API production** | https://api.vmd.asia |
| **Chi tiết đầy đủ** | `infrastructure/DEPLOYMENT.md`, `infrastructure/QUICK_START.md` |

*Nếu IP hoặc user thay đổi, cập nhật trong `infrastructure/DEPLOYMENT.md` (mục "Thông Tin VPS").*

---

## ⚠️ Bắt buộc: file .env.production

Trước khi chạy docker compose, **phải thay placeholder** bằng giá trị thật:

- `REDIS_PASSWORD` — **Phải đổi** `<CHANGE_THIS_REDIS_PASSWORD>` thành mật khẩu thật (ví dụ: `RedisSecure123` hoặc tạo bằng `openssl rand -base64 16`). **Không dùng** ký tự `<`, `>`, `$`, `"` trong password.
- `DATABASE_PASSWORD`, `DATABASE_USER`, `JWT_SECRET` — tương tự.

Nếu giữ nguyên placeholder, Redis healthcheck sẽ **fail** (ký tự `<` `>` gây lỗi shell).

```powershell
# Mở file và sửa
notepad infrastructure\.env.production

# Ví dụ REDIS_PASSWORD sau khi sửa:
REDIS_PASSWORD=RedisSecurePass123
```

---

## ⚠️ Workspace KHÔNG dùng Git?

Nếu thư mục dự án **không có `.git`**, `git pull` trên VPS sẽ **không cập nhật** code. Khi đó bắt buộc dùng **Cách 3** để sync source từ Windows lên VPS trước khi build.

---

## Cách 1: Deploy qua script (đầy đủ) — cần Git

Trên **VPS** (SSH vào trước), chạy từng lệnh:

Lệnh 1:
```
cd /opt/lifestyle-superapp
```

Lệnh 2:
```
git pull origin main
```

Lệnh 3:
```
bash infrastructure/scripts/deploy.sh
```

Script sẽ tự load `infrastructure/.env.production` và deploy toàn bộ.

---

## Cách 2: Chỉ build và restart main-api (nhanh hơn)

Trên **VPS**, chạy từng lệnh (luôn dùng `--env-file`):

Lệnh 1:
```
cd /opt/lifestyle-superapp
```

Lệnh 2:
```
git pull origin main
```

Lệnh 3:
```
docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml build main-api --no-cache
```

Lệnh 4:
```
docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml up -d
```

Lệnh 5 (sau khi main-api đã chạy):
```
docker exec lifestyle_main_api npx prisma migrate deploy
```

---

## Sửa nhanh: Swagger chỉ hiển thị localhost (dùng đường dẫn tuyệt đối)

Nếu Swagger vẫn chỉ có `http://localhost:3000`, dùng các lệnh sau — **copy-paste từng khối**, không cần `cd`:

**1. Windows PowerShell** (sync source lên VPS):

```powershell
cd C:\Users\nguye\Lifestyle_SuperApp
scp -r services infrastructure packages package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json root@103.161.119.125:/opt/lifestyle-superapp-override/
```
*(Nhập mật khẩu root khi được hỏi. Nếu có .npmrc: thêm `.npmrc` vào danh sách.)*

**2. SSH vào VPS** → mở terminal mới:

```powershell
ssh root@103.161.119.125
```

**3. Trên VPS** (chạy lần lượt từng khối):

```bash
cd /opt/lifestyle-superapp
cp infrastructure/.env.production /tmp/env.backup
cp -r /opt/lifestyle-superapp-override/* .
cp /tmp/env.backup infrastructure/.env.production
rm -rf /opt/lifestyle-superapp-override
```

```bash
docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml build main-api --no-cache
```

```bash
docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml up -d main-api
```

**4. Kiểm tra:** Mở `https://api.vmd.asia/docs` → dropdown Servers phải có 2 mục.

---

## Sửa khi vẫn chỉ thấy 1 server (đồng bộ chỉ main.ts)

Nếu đã sync, build và `--force-recreate` nhưng Swagger vẫn 1 server — kiểm tra `docker exec lifestyle_main_api grep addServer dist/main.js` chỉ thấy 1 dòng → image vẫn dùng code cũ. Đồng bộ lại chỉ `main.ts`:

**1. Trên Windows (PowerShell):**

```powershell
cd C:\Users\nguye\Lifestyle_SuperApp
scp services/main-api/src/main.ts root@103.161.119.125:/opt/lifestyle-superapp/services/main-api/src/main.ts
```

**2. Trên VPS:**

```bash
cd /opt/lifestyle-superapp
docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml build main-api --no-cache
docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml up -d --force-recreate main-api
```

**3. Xác nhận code mới trong container:**

```bash
docker exec lifestyle_main_api grep "addServer" dist/main.js
```
→ Phải thấy **2 dòng** (Production và Local).

---

## Cách 3: Deploy khi workspace KHÔNG dùng Git (sync source từ Windows)

Dùng khi thư mục dự án không có `.git` hoặc không dùng Git. **Bắt buộc** làm theo để Swagger và mọi thay đổi code mới có hiệu lực.

### Bước 1 — Trên Windows (PowerShell), từ thư mục dự án `C:\Users\nguye\Lifestyle_SuperApp`:

```powershell
cd C:\Users\nguye\Lifestyle_SuperApp
scp -r services infrastructure packages package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc tsconfig.json root@103.161.119.125:/opt/lifestyle-superapp-override/
```

### Bước 2 — Trên VPS (SSH: `ssh root@103.161.119.125`):

```bash
cd /opt/lifestyle-superapp

# Backup .env (quan trọng — tránh ghi đè mật khẩu)
cp infrastructure/.env.production /tmp/env.backup

# Ghi đè bằng source mới
cp -r /opt/lifestyle-superapp-override/* .
[ -f /opt/lifestyle-superapp-override/.npmrc ] && cp /opt/lifestyle-superapp-override/.npmrc .

# Khôi phục .env.production
cp /tmp/env.backup infrastructure/.env.production

# Xóa thư mục tạm
rm -rf /opt/lifestyle-superapp-override

# Build lại main-api (KHÔNG dùng cache)
docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml build main-api --no-cache

# Khởi động lại
docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml up -d main-api
```

### Bước 3 — Kiểm tra

Mở `https://api.vmd.asia/docs` → dropdown **Servers** phải có 2 lựa chọn:
- **Production (api.vmd.asia)**
- **Local (localhost)**

Hoặc kiểm tra JSON: `https://api.vmd.asia/docs-json` → tìm `"servers"` phải có 2 phần tử.

---

## Trước khi deploy (trên máy local)

**Nếu dùng Git (Cách 1, 2):**
1. Commit và push code lên repository:
```powershell
git add .
git commit -m "fix: Swagger servers, DriversController upload routes, ..."
git push origin main
```

**Nếu KHÔNG dùng Git (Cách 3):**
- Chạy sync script trước:
```powershell
.\infrastructure\scripts\sync-to-vps.ps1
```
- Rồi SSH vào VPS và chạy các lệnh build/up (xem Cách 3 chi tiết).

**Chung:** Đảm bảo file `infrastructure/.env.production` tồn tại trên VPS (copy từ `.env.production.template` lần đầu).

---

## Sau khi deploy

- Swagger: https://api.vmd.asia/docs  
- Health: https://api.vmd.asia/health  
- Kiểm tra: `POST /api/v1/drivers/upload/avatar`, `upload/face`, `upload/document` đã xuất hiện trong Swagger.

---

## Kiểm tra main-api đã dùng image mới chưa (trên VPS)

Nếu Swagger vẫn **không thấy** 3 endpoint upload, image mới có thể chưa được deploy.

**Trên VPS (SSH), chạy từng lệnh:**

Lệnh 1 — Xem image main-api được tạo lúc nào:
```
docker images | grep main-api
```

Lệnh 2 — Xem container main-api khởi động lúc nào:
```
docker ps -a --filter name=main_api --format "{{.Names}} {{.Status}} {{.CreatedAt}}"
```

Lệnh 3 — Thử gọi trực tiếp endpoint upload (trên **VPS/Linux**):
```
curl -s -o /dev/null -w "%{http_code}" https://api.vmd.asia/api/v1/drivers/upload/face -X POST
```
- **401** hoặc **403** → Endpoint tồn tại (chỉ thiếu auth)
- **404** → Endpoint chưa có, đang chạy image cũ

**Trên Windows PowerShell** (cú pháp khác):
```
(Invoke-WebRequest -Uri "https://api.vmd.asia/api/v1/drivers/upload/face" -Method POST -UseBasicParsing).StatusCode
```

Nếu trả **404**, cần build và deploy lại đầy đủ (upload source → build → up -d).

---

## main-api Restarting (1) — container crash liên tục

**Triệu chứng:** `docker ps` hiển thị `lifestyle_main_api Restarting (1)`.

**Nguyên nhân:** Ứng dụng crash lúc khởi động (thiếu env, lỗi DB, lỗi code, v.v.).

### Lỗi: OAuth2Strategy requires a clientID option

**Triệu chứng:** Log có `TypeError: OAuth2Strategy requires a clientID option`.

**Cách xử lý:** Đã sửa — app sẽ chạy được **không cần** `GOOGLE_CLIENT_ID` khi chưa dùng Google login. Nếu gặp lỗi này:

1. Upload `services/main-api` mới lên VPS (code đã cập nhật)
2. Build và deploy lại: `docker compose ... build main-api --no-cache` rồi `up -d main-api`

Khi cần bật Google login sau này, thêm vào `infrastructure/.env.production`:
```
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Cách kiểm tra — trên VPS, chạy từng lệnh:**

Lệnh 1:
```
docker logs lifestyle_main_api --tail 100
```

Lệnh 2 (nếu cần thêm log):
```
docker logs lifestyle_main_api 2>&1 | tail -150
```

Copy nội dung lỗi (đặc biệt dòng có `Error`, `Exception`, `ECONNREFUSED`, `failed`) để xử lý tiếp. Thường gặp:
- `ECONNREFUSED` → Postgres/Redis chưa sẵn sàng hoặc sai `DATABASE_URL`/`REDIS_URL`
- `Cannot find module` → Thiếu dependency
- `Prisma` / `migrate` → Cần chạy `npx prisma migrate deploy`

---

## Xử lý lỗi "container lifestyle_redis_prod is unhealthy"

**Nguyên nhân:** `REDIS_PASSWORD` trống hoặc thiếu file `.env.production`.

**Cách xử lý:**

1. Kiểm tra `infrastructure/.env.production` có `REDIS_PASSWORD` với giá trị thật (ít nhất 8 ký tự):

   ```bash
   REDIS_PASSWORD=your_secure_redis_password_here
   ```

2. Chạy docker compose **cùng** `--env-file`:

   ```bash
   docker compose --env-file infrastructure/.env.production \
     -f infrastructure/docker/docker-compose.production.yml up -d
   ```

3. Nếu chạy trên **Windows PowerShell**, dùng lệnh:

   ```powershell
   docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml up -d
   ```

4. **Password nhanh để test:** Nếu chỉ cần chạy thử, dùng mật khẩu đơn giản (chỉ test local):
   ```
   REDIS_PASSWORD=RedisPass123
   DATABASE_PASSWORD=PostgresPass123
   JWT_SECRET=your-super-secret-jwt-key-at-least-64-characters-long-for-security
   ```

---

## Swagger: Chỉ hiển thị localhost, không có server Production

**Triệu chứng:** Dropdown "Servers" trong Swagger UI (`https://api.vmd.asia/docs`) chỉ có `http://localhost:3000 - Production / Local`, không có `https://api.vmd.asia` hoặc cả 2 lựa chọn.

**Nguyên nhân gốc rễ:** Container main-api đang chạy **code cũ** (phiên bản main.ts chưa cập nhật Swagger servers). Code mới đã thêm cả Production + Local server nhưng **chưa được deploy lên VPS**.

**Chẩn đoán nhanh — mở trong trình duyệt:**
```
https://api.vmd.asia/docs-json
```
Tìm `"servers"` trong JSON. Nếu thấy:
```json
"servers":[{"url":"http://localhost:3000","description":"Production / Local"}]
```
→ Container đang chạy **code cũ**. Cần đồng bộ source mới và rebuild.

**Tại sao code mới không lên VPS?**
- Workspace **không phải git repo** (không có `.git`) → `git pull` trên VPS **bỏ qua**, không cập nhật gì.
- Hoặc chưa `git push` từ local → VPS `git pull` lấy code cũ.
- Kết quả: Docker build dùng source cũ trên VPS → image cũ → Swagger không đổi.

**Cách khắc phục (bắt buộc đồng bộ source trước khi build):**

→ **Dùng Cách 3 (Deploy không dùng Git)** bên dưới: `scp` hoặc `rsync` thư mục `services/main-api` từ Windows lên VPS, **sau đó** mới chạy `docker compose build main-api --no-cache` trên VPS.

---

## Swagger: Không thấy endpoint upload / Upload thất bại

**Triệu chứng:**
- Trong tag **Drivers** chỉ thấy `POST /register`, `GET /profile`... nhưng **không có** `POST /upload/face`, `/upload/avatar`, `/upload/document`
- Hoặc thấy nhưng gọi API trả 401/404

**Nguyên nhân thường gặp:** Image Docker main-api trên VPS **chưa rebuild** với code mới.

### Bước 1: Kiểm tra endpoint có tồn tại trên server

Mở trong trình duyệt:
```
https://api.vmd.asia/docs-json
```

Tìm trong JSON: `"/api/v1/drivers/upload/face"`, `"upload/avatar"`, `"upload/document"`.
- **Có** → Endpoint đã deploy, vấn đề có thể là cache trình duyệt. Thử Ctrl+Shift+R hoặc cửa sổ ẩn danh.
- **Không** → Cần rebuild main-api (Bước 2).

### Bước 2: Rebuild main-api trên VPS

**Quan trọng:** Các lệnh `cd /opt/...`, `docker compose` phải chạy **trên VPS**, **không** chạy trên PowerShell Windows (sẽ báo lỗi `Cannot find path 'C:\opt\...'`).

#### 2.1. Trước tiên — SSH vào VPS (chạy trong PowerShell Windows):

```
ssh root@103.161.119.125
```

- Nhập mật khẩu root khi được hỏi.
- Khi đã vào VPS, prompt đổi thành dạng: `root@azvps-1771342316:~#` — **chỉ khi đó** mới chạy các lệnh tiếp theo.

#### 2.2. Trên VPS (sau khi đã SSH), chạy **từng lệnh một** (copy-paste từng dòng) (copy-paste từng dòng, Enter, chờ xong rồi chạy tiếp):

**Lệnh 1 — vào thư mục dự án:**
```
cd /opt/lifestyle-superapp
```

**Lệnh 2 — lấy code mới:**
```
git pull origin main
```
*(Nếu VPS không cài Git hoặc lỗi: dùng Option B bên dưới.)*

**Lệnh 3 — build lại main-api (5–15 phút):**
```
docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml build main-api --no-cache
```

**Lệnh 4 — khởi động lại container:**
```
docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml up -d main-api
```

> ⚠️ **Lưu ý:** Chạy từng lệnh riêng, không gộp nhiều lệnh vào một dòng.

#### Option B: VPS không có Git — upload code từ Windows lên VPS

**Trên Windows** (ở `C:\Users\nguye\Lifestyle_SuperApp`), chạy từng lệnh:

Lệnh 1:
```
scp -r services infrastructure packages package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json root@103.161.119.125:/opt/lifestyle-superapp-override/
```

**Trên VPS** (chạy từng lệnh):

Lệnh 1:
```
ssh root@103.161.119.125
```

Lệnh 2:
```
cd /opt/lifestyle-superapp
```

Lệnh 3:
```
cp infrastructure/.env.production /tmp/env.backup
```

Lệnh 4:
```
cp -r /opt/lifestyle-superapp-override/* .
```

Lệnh 5:
```
cp /tmp/env.backup infrastructure/.env.production
```

Lệnh 6:
```
rm -rf /opt/lifestyle-superapp-override
```

Rồi chạy 2 lệnh docker compose (Lệnh 3 và 4 ở mục 2.2).

#### Trường hợp chạy Docker local trên Windows (api.vmd.asia trỏ về máy bạn)

Chỉ dùng khi api.vmd.asia trỏ về máy local. Chạy từng lệnh:

Lệnh 1:
```
cd C:\Users\nguye\Lifestyle_SuperApp
```

Lệnh 2:
```
docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml build main-api --no-cache
```

Lệnh 3:
```
docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml up -d main-api
```

---

Sau khi build xong, mở lại `https://api.vmd.asia/docs` → tag **Drivers** → phải thấy 3 endpoint upload.

### Bước 3: Đúng URL Swagger

Chỉ dùng `https://api.vmd.asia/docs` (không phải auth.vmd.asia/docs).

### Bước 4: Authorize với token DRIVER

Các endpoint upload yêu cầu role DRIVER:
   - Bấm **Authorize** trên Swagger
   - Nhập `Bearer <access_token>` (token từ login user có role DRIVER)
   - Không có token DRIVER → gọi API sẽ trả 403

5. **Upload file trong Swagger:** Chọn file trong ô "file" (format binary), rồi **Execute**.

6. **Ảnh đã upload:** URL trả về (vd: `https://api.vmd.asia/uploads/driver-faces/xxx.jpg`) dùng để cập nhật qua PATCH `/api/v1/drivers/identity` hoặc `PATCH /api/v1/drivers/vehicles/:id`.

---

## Lỗi: nest build — "emailVerified" does not exist / did you mean "isEmailVerified"

**Triệu chứng:** Build thất bại với thông báo liên quan `emailVerified`, `UserCreateInput`.

**Nguyên nhân:** VPS đang dùng code cũ (file trên VPS có `emailVerified` thay vì `isEmailVerified`).

**Cách xử lý:** Upload toàn bộ source `main-api` lên VPS (trên Windows):

Lệnh 1:
```
cd C:\Users\nguye\Lifestyle_SuperApp
```

Lệnh 2:
```
scp -r services/main-api root@103.161.119.125:/opt/lifestyle-superapp/services/
```

*(Lệnh này ghi đè thư mục main-api trên VPS bằng bản local mới nhất.)*

Sau đó SSH vào VPS và build lại (Lệnh 2, 3 ở mục "Lỗi: nest build failed" bên dưới).

---

## Lỗi: nest build failed / Build Docker thất bại

**Nếu build báo lỗi ở bước `nest build`**, cần xem log đầy đủ:

Lệnh 1 (trên VPS):
```
cd /opt/lifestyle-superapp
```

Lệnh 2 (chạy build và lưu log; không dùng `-d` hay background):
```
docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml build main-api --no-cache 2>&1 | tee /tmp/build.log
```

Lệnh 3 (xem 80 dòng cuối của log):
```
tail -80 /tmp/build.log
```

Copy nội dung lỗi gửi để xử lý. Thường gặp: lỗi TypeScript, thiếu dependency, hoặc Prisma schema lệch.

---

## Lỗi: PNPM_OUTDATED_LOCKFILE khi build Docker

**Triệu chứng:**
```
ERR PNPM_OUTDATED_LOCKFILE Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json
```

**Nguyên nhân:** `pnpm-lock.yaml` chưa được commit/push sau khi thêm dependency mới vào `package.json`.

**Cách xử lý:**

**Bước A — Trên máy Windows (chạy từng lệnh):**

Lệnh 1:
```
cd C:\Users\nguye\Lifestyle_SuperApp
```

Lệnh 2:
```
pnpm install
```

Lệnh 3:
```
git add pnpm-lock.yaml
```

Lệnh 4:
```
git commit -m "chore: update pnpm-lock.yaml"
```

Lệnh 5:
```
git push origin main
```

**Bước B — Trên VPS (SSH vào rồi chạy từng lệnh):**

Lệnh 1 — SSH:
```
ssh root@103.161.119.125
```

Lệnh 2:
```
cd /opt/lifestyle-superapp
```

Lệnh 3:
```
git pull origin main
```

Lệnh 4:
```
docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml build main-api --no-cache
```

Lệnh 5:
```
docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml up -d main-api
```

---

## Rollback (nếu lỗi)

```bash
bash infrastructure/scripts/deploy.sh --rollback
```
