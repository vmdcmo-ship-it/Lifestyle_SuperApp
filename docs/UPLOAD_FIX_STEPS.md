# Sửa lỗi Upload — Hướng dẫn từng bước theo vị trí và công cụ

Mỗi phần dưới đây là **một quy trình độc lập**. Làm theo đúng thứ tự từng bước.

---

# PHẦN 1: MÁY WINDOWS (Local)

## 1.1. Công cụ: File Explorer / VS Code

**Mục đích:** Chuẩn bị code đã sửa.

| Bước | Hành động | Chi tiết |
|------|-----------|----------|
| 1 | Mở thư mục dự án | `C:\Users\nguye\Lifestyle_SuperApp` |
| 2 | Kiểm tra file đã sửa | `apps\mobile-driver\src\services\upload.service.ts` — phải có `ensureFileExists`, `BASE_URL` |
| 3 | Kiểm tra file đã sửa | `apps\mobile-driver\src\services\api.ts` — phải có `export const BASE_URL` |
| 4 | Kiểm tra file đã sửa | `infrastructure\nginx\nginx.conf` — phải có dòng `client_body_timeout 120s;` trong block `server_name api.vmd.asia` |
| 5 | Kiểm tra file đã sửa | `infrastructure\.env.production` — phải có dòng `API_BASE_URL=https://api.vmd.asia` |

**Kết quả:** Code trên máy Windows đã đúng, sẵn sàng sync lên VPS.

---

## 1.2. Công cụ: Git (chỉ khi dùng Git)

**Mục đích:** Push code lên repo để VPS pull được.

| Bước | Hành động | Lệnh / Chi tiết |
|------|-----------|-----------------|
| 1 | Mở PowerShell | Trong thư mục `C:\Users\nguye\Lifestyle_SuperApp` |
| 2 | Xem file thay đổi | `git status` |
| 3 | Thêm file | `git add apps/mobile-driver/src/services/upload.service.ts apps/mobile-driver/src/services/api.ts infrastructure/nginx/nginx.conf infrastructure/.env.production` |
| 4 | Commit | `git commit -m "Fix upload: API_BASE_URL, nginx timeout, upload service"` |
| 5 | Push | `git push origin main` |

**Kết quả:** Code đã lên Git. Bỏ qua Phần 2 nếu dùng Git; chuyển sang Phần 3.

---

## 1.3. Công cụ: SCP (khi không dùng Git)

**Mục đích:** Copy file từ Windows lên VPS.

| Bước | Hành động | Lệnh / Chi tiết |
|------|-----------|-----------------|
| 1 | Mở PowerShell | `cd C:\Users\nguye\Lifestyle_SuperApp` |
| 2 | Copy infrastructure | `scp -r infrastructure root@103.161.119.125:/opt/lifestyle-superapp-override/` |
| 3 | Copy services | `scp -r services root@103.161.119.125:/opt/lifestyle-superapp-override/` |
| 4 | Copy packages | `scp -r packages root@103.161.119.125:/opt/lifestyle-superapp-override/` |
| 5 | Copy config gốc | `scp package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc tsconfig.json root@103.161.119.125:/opt/lifestyle-superapp-override/` |
| 6 | Copy mobile app | `scp -r apps root@103.161.119.125:/opt/lifestyle-superapp-override/` |

**Lưu ý:** Thay `103.161.119.125` bằng IP VPS thực tế nếu khác.

**Kết quả:** File đã nằm trong `/opt/lifestyle-superapp-override/` trên VPS.

---

# PHẦN 2: VPS — SSH

## 2.1. Công cụ: SSH Client (PowerShell / PuTTY)

**Mục đích:** Kết nối vào VPS.

| Bước | Hành động | Lệnh |
|------|-----------|------|
| 1 | Mở terminal | PowerShell hoặc PuTTY |
| 2 | Kết nối VPS | `ssh root@103.161.119.125` |
| 3 | Nhập mật khẩu | Khi được hỏi |

**Kết quả:** Đã vào shell trên VPS.

---

# PHẦN 3: VPS — Xử lý code (sau khi SSH)

## 3.1. Công cụ: Bash (khi dùng Git)

**Mục đích:** Lấy code mới từ Git trên VPS.

| Bước | Hành động | Lệnh |
|------|-----------|------|
| 1 | Vào thư mục dự án | `cd /opt/lifestyle-superapp` |
| 2 | Lấy code mới | `git pull origin main` |
| 3 | Kiểm tra | `ls -la infrastructure/nginx/nginx.conf` — file phải có |

**Kết quả:** Code mới đã có trong `/opt/lifestyle-superapp`.

---

## 3.2. Công cụ: Bash (khi dùng SCP, không có Git)

**Mục đích:** Gộp code từ thư mục override vào thư mục chính.

| Bước | Hành động | Lệnh |
|------|-----------|------|
| 1 | Backup .env | `cp /opt/lifestyle-superapp/infrastructure/.env.production /tmp/env.backup` |
| 2 | Ghi đè bằng code mới | `cp -r /opt/lifestyle-superapp-override/* /opt/lifestyle-superapp/` |
| 3 | Khôi phục .env | `cp /tmp/env.backup /opt/lifestyle-superapp/infrastructure/.env.production` |
| 4 | Xóa thư mục tạm | `rm -rf /opt/lifestyle-superapp-override` |
| 5 | Kiểm tra nginx | `grep "client_body_timeout" /opt/lifestyle-superapp/infrastructure/nginx/nginx.conf` |
| 6 | Kiểm tra .env | `grep "API_BASE_URL" /opt/lifestyle-superapp/infrastructure/.env.production` |

**Kết quả:** Code mới đã trong `/opt/lifestyle-superapp`, `.env` giữ nguyên mật khẩu.

---

# PHẦN 4: VPS — Docker (Main-API)

## 4.1. Công cụ: Docker Compose

**Mục đích:** Build và chạy lại main-api.

| Bước | Hành động | Lệnh |
|------|-----------|------|
| 1 | Vào thư mục dự án | `cd /opt/lifestyle-superapp` |
| 2 | Load env | `export $(cat infrastructure/.env.production | grep -v '^#' | xargs)` |
| 3 | Build main-api | `docker compose -f infrastructure/docker/docker-compose.production.yml build main-api --no-cache` |
| 4 | Chờ build xong | Đợi 2–5 phút |
| 5 | Chạy lại main-api | `docker compose -f infrastructure/docker/docker-compose.production.yml up -d --force-recreate main-api` |
| 6 | Kiểm tra | `docker compose -f infrastructure/docker/docker-compose.production.yml ps main-api` |

**Kết quả:** Cột `State` của main-api là `running`.

---

## 4.2. Công cụ: Docker (kiểm tra biến môi trường)

**Mục đích:** Xác nhận main-api nhận đúng API_BASE_URL.

| Bước | Hành động | Lệnh |
|------|-----------|------|
| 1 | In biến trong container | `docker exec lifestyle_main_api printenv API_BASE_URL` |
| 2 | Đọc kết quả | Phải là `https://api.vmd.asia` |

**Kết quả:** Nếu đúng → main-api dùng đúng base URL. Nếu rỗng hoặc sai → kiểm tra `.env.production` và Bước 4.1.

---

# PHẦN 5: VPS — Docker (Nginx)

## 5.1. Công cụ: Docker Compose

**Mục đích:** Áp dụng cấu hình nginx mới (client_body_timeout).

| Bước | Hành động | Lệnh |
|------|-----------|------|
| 1 | Vào thư mục dự án | `cd /opt/lifestyle-superapp` |
| 2 | Restart nginx | `docker compose -f infrastructure/docker/docker-compose.production.yml restart nginx` |
| 3 | Kiểm tra | `docker compose -f infrastructure/docker/docker-compose.production.yml ps nginx` |

**Kết quả:** Nginx chạy lại với config mới.

---

## 5.2. Công cụ: Docker (kiểm tra cấu hình nginx)

**Mục đích:** Xác nhận nginx đã load config mới.

| Bước | Hành động | Lệnh |
|------|-----------|------|
| 1 | Kiểm tra config | `docker exec lifestyle_nginx nginx -t` |
| 2 | Đọc kết quả | Phải có `syntax is ok` và `test is successful` |

**Kết quả:** Nginx dùng cấu hình hợp lệ.

---

# PHẦN 6: MÁY WINDOWS — Mobile App (Expo)

## 6.1. Công cụ: PowerShell + pnpm / npm

**Mục đích:** Chạy lại app mobile với code mới.

| Bước | Hành động | Lệnh |
|------|-----------|------|
| 1 | Mở PowerShell | Trong `C:\Users\nguye\Lifestyle_SuperApp` |
| 2 | Vào thư mục mobile | `cd apps\mobile-driver` |
| 3 | Cài lại phụ thuộc (nếu cần) | `pnpm install` hoặc `npm install` |
| 4 | Chạy Expo | `npx expo start` |
| 5 | Mở app | Quét QR code bằng Expo Go trên điện thoại |

**Kết quả:** App chạy với code mới trong upload.service.

---

## 6.2. Công cụ: Expo Go (trên điện thoại)

**Mục đích:** Test upload sau khi app đã chạy.

| Bước | Hành động | Chi tiết |
|------|-----------|----------|
| 1 | Đăng nhập app | Dùng tài khoản tài xế đã có |
| 2 | Vào Thông tin tài khoản | Menu → Thông tin tài khoản |
| 3 | Chọn ảnh đại diện | Chụp ảnh hoặc chọn từ thư viện |
| 4 | Xem kết quả | Nếu thành công: "Đã cập nhật ảnh đại diện" |
| 5 | Nếu lỗi | Ghi lại nội dung thông báo lỗi (vd: [401], [500], [0]) |

**Kết quả:** Upload hoạt động hoặc có thông tin lỗi để debug.

---

# PHẦN 7: KIỂM TRA NHANH

## 7.1. Công cụ: Trình duyệt

**Mục đích:** Kiểm tra API upload qua Swagger.

| Bước | Hành động | Chi tiết |
|------|-----------|----------|
| 1 | Mở | https://api.vmd.asia/docs |
| 2 | Đăng nhập lấy token | POST `/auth/login` — lấy `accessToken` |
| 3 | Authorize | Nhấn Authorize, nhập `Bearer <accessToken>` |
| 4 | Test upload | POST `/drivers/upload/avatar` — chọn file ảnh, Execute |
| 5 | Đọc kết quả | Nếu 200 + `{"url":"..."}` → backend upload OK |

**Kết quả:** Upload từ Swagger thành công thì vấn đề có thể ở app hoặc mạng.

---

# TÓM TẮT THỨ TỰ THỰC HIỆN

| Thứ tự | Vị trí | Công cụ | Phần |
|--------|--------|---------|------|
| 1 | Windows | File Explorer | 1.1 |
| 2 | Windows | Git hoặc SCP | 1.2 hoặc 1.3 |
| 3 | — | SSH | 2.1 |
| 4 | VPS | Bash | 3.1 (Git) hoặc 3.2 (SCP) |
| 5 | VPS | Docker Compose | 4.1 (main-api) |
| 6 | VPS | Docker | 4.2 (kiểm tra env) |
| 7 | VPS | Docker Compose | 5.1 (nginx) |
| 8 | VPS | Docker | 5.2 (kiểm tra nginx) |
| 9 | Windows | PowerShell + Expo | 6.1 |
| 10 | Điện thoại | Expo Go | 6.2 |
| 11 | Trình duyệt | Swagger | 7.1 (khi cần debug) |
