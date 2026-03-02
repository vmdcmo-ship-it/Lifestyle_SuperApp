# Hướng dẫn kiểm thử End-to-End (E2E) – App Tài xế & API thật

Tài liệu này hướng dẫn kiểm thử E2E với **API thật** tại `https://api.vmd.asia`, đảm bảo VPS chạy ổn và app (đăng ký, đăng nhập, dashboard, cài đặt nhận đơn, ví, luồng đơn) hoạt động đúng với cả **tài khoản demo** và **tài khoản tài xế thật**.

---

## 1. Chuẩn bị

### 1.1 Chạy app Driver (Expo Go)

**PowerShell (Windows) — chạy từng lệnh:**
```powershell
cd apps\mobile-driver
pnpm install
pnpm start
```

**Bash / từ root monorepo:**
```bash
pnpm run dev:driver
```
hoặc: `pnpm start --filter mobile-driver`

> **Lưu ý:** Trong PowerShell, không dùng `&&` để nối lệnh (dùng `;` hoặc chạy từng lệnh). Lệnh `pnpm start` phải chạy **trong thư mục** `apps/mobile-driver` — thư mục root không có script `start`.

### 1.1.1 Xử lý lỗi kết nối Expo Go

Nếu quét QR code hoặc mở Expo Go mà không load được app (báo lỗi kết nối, timeout):

| Bước | Hành động |
|------|-----------|
| 1 | **Dùng chế độ Tunnel** — Chạy `pnpm start:tunnel` thay vì `pnpm start`. Chế độ tunnel dùng ngrok qua internet nên không phụ thuộc WiFi LAN. Cần cài `@expo/ngrok` nếu lần đầu hỏi. |
| 2 | **Cùng WiFi** — Nếu dùng LAN thường, đảm bảo máy tính và điện thoại cùng mạng WiFi. |
| 3 | **Quyền mạng** — Trên điện thoại: Cài đặt → Expo Go → bật quyền **Mạng cục bộ** (Local Network). |
| 4 | **Firewall Windows** — Nếu dùng LAN, kiểm tra Windows Firewall cho phép Node/Metro trên port 8081. |
| 5 | **Xóa cache Expo** — Chạy `Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue` rồi `pnpm start` lại. |
| 6 | **Mạng nhà chặn** — Nếu WiFi nhà không được nhưng 4G/hotspot lại được → router có thể chặn multicast. Dùng tunnel hoặc hotspot. |

**Khuyến nghị:** Khi LAN hay lỗi, dùng `pnpm start:tunnel` là cách nhanh nhất để Expo Go kết nối được.

### 1.2 API & tài khoản

- **API base:** `https://api.vmd.asia/api/v1`
- **App:** `apps/mobile-driver` (React Native / Expo), đã cấu hình `BASE_URL` trỏ tới production API.
- **Tài khoản demo** (dữ liệu mẫu, không ghi đè backend):
  - `demo1@driver.vmd.asia` / `Demo1@123`
  - `demo2@driver.vmd.asia` / `Demo2@123`
  - `demo3@driver.vmd.asia` / `Demo3@123`

---

## 2. Kiểm tra VPS & API trả đúng

### 2.1 Health check (không cần đăng nhập)

Mở trình duyệt hoặc dùng curl/Postman:

```http
GET https://api.vmd.asia/api/v1/health
```

**Kỳ vọng:** HTTP 200, body dạng:

```json
{
  "status": "ok",
  "timestamp": "...",
  "service": "lifestyle-main-api",
  "version": "1.0.0-mvp",
  "database": "connected"
}
```

- Nếu `database` ≠ `"connected"`: kiểm tra PostgreSQL trên VPS.
- Nếu không gọi được (timeout, 5xx): kiểm tra firewall, reverse proxy (Nginx), và service backend đang chạy.

### 2.2 Kiểm tra nhanh Auth (tùy chọn)

- **Đăng nhập:**  
  `POST https://api.vmd.asia/api/v1/auth/login`  
  Body: `{ "email": "demo1@driver.vmd.asia", "password": "Demo1@123" }`  
  Kỳ vọng: 200, có `accessToken`, `refreshToken` (và có thể `user`).

- **Profile (cần token):**  
  `GET https://api.vmd.asia/api/v1/auth/profile`  
  Header: `Authorization: Bearer <accessToken>`  
  Kỳ vọng: 200, có thông tin user.

Nếu hai bước này ok → API auth cơ bản hoạt động.

---

## 3. Test trên App – Luồng chính

Chạy app (Expo Go hoặc build) và đảm bảo app đang dùng API production (trong code: `BASE_URL = 'https://api.vmd.asia/api/v1'`).

### 3.1 Đăng ký → Đăng nhập

| Bước | Hành động | Kỳ vọng |
|------|-----------|----------|
| 1 | Mở app → màn **Đăng nhập** | Form email + mật khẩu, link "Chưa có tài khoản? Đăng ký tài xế" |
| 2 | Bấm **Đăng ký tài xế** | Chuyển sang màn đăng ký (email, mật khẩu, họ, tên, số điện thoại tùy chọn) |
| 3 | Điền form đăng ký hợp lệ → **Đăng ký** | Gọi `POST /auth/register` với `role: 'DRIVER'`; nếu thành công → vào app (MainTabs), không báo lỗi |
| 4 | Đăng xuất (Tài khoản → Đăng xuất) | Về màn Đăng nhập |
| 5 | Nhập email + mật khẩu tài khoản vừa đăng ký → **Đăng nhập** | Gọi `POST /auth/login`; vào app, không lỗi |

**Lưu ý:** Nếu email đã tồn tại, backend trả 409 → app hiển thị lỗi tương ứng. Dùng email mới để test đăng ký.

### 3.2 Dashboard

| Bước | Hành động | Kỳ vọng |
|------|-----------|----------|
| 1 | Đăng nhập (demo hoặc tài khoản thật) → tab **Tổng quan** | Gọi `GET /drivers/profile`, `GET /drivers/dashboard`, `GET /wallet` (nếu có) |
| 2 | Kiểm tra giao diện | Có thống kê ngày (chuyến, thu nhập), biểu đồ tuần (nếu có), thông tin ví; với demo: dữ liệu mẫu; với tài khoản mới: có thể toàn 0 |
| 3 | Bật/tắt **Trạng thái trực tuyến** (nếu có) | Gọi `PATCH /booking/driver/status` với `status: ONLINE/OFFLINE` (hoặc tương đương), không crash |

### 3.3 Cài đặt nhận đơn

| Bước | Hành động | Kỳ vọng |
|------|-----------|----------|
| 1 | Tài khoản → **Cài đặt nhận đơn** | Màn cài đặt hiển thị (tiền mặt đang giữ, dịch vụ bật/tắt, tự động nhận đơn, v.v.) |
| 2 | Load lần đầu | Gọi `GET /drivers/settings/order-receiving`; hiển thị đúng dữ liệu (hoặc mặc định) |
| 3 | Đổi vài cài đặt (ví dụ tiền mặt, bật/tắt dịch vụ) → Lưu | Gọi `PATCH /drivers/settings/order-receiving` với body tương ứng; lưu thành công, không lỗi |
| 4 | Quay lại rồi vào lại Cài đặt nhận đơn | Dữ liệu đã lưu hiển thị đúng |

### 3.4 Ảnh đại diện (Tài khoản)

| Bước | Hành động | Kỳ vọng |
|------|-----------|---------|
| 1 | Tài khoản → **Thông tin tài khoản** | Màn thông tin, có ảnh đại diện (hoặc chữ viết tắt) |
| 2 | Chạm ảnh hoặc bấm **Chụp ảnh** | Mở camera (expo-image-picker) |
| 3 | Chạm **Chọn từ kho ảnh** | Mở thư viện ảnh |
| 4 | Chụp/chọn ảnh → Upload | Gọi `POST /drivers/upload/avatar`, rồi `PATCH /drivers/profile` với `avatar_url` |
| 5 | Quay lại tab Tài khoản | Ảnh đại diện mới hiển thị ở header |

### 3.5 Chụp ảnh khuôn mặt (Cập nhật giấy tờ)

| Bước | Hành động | Kỳ vọng |
|------|-----------|---------|
| 1 | Tài khoản → Cập nhật giấy tờ → **Chụp ảnh khuôn mặt** | Mở màn camera (expo-camera) |
| 2 | Cho phép quyền camera (nếu được hỏi) | Camera hiển thị |
| 3 | Đặt khuôn mặt trong khung oval, bật đèn nếu thiếu sáng | Hướng dẫn "Chụp ở nơi đủ sáng" |
| 4 | Chụp ảnh → Xem preview → **Dùng ảnh này** | Upload lên `POST /drivers/upload/face`, trả về `{ url }` |
| 5 | Quay lại Cập nhật giấy tờ | Nút hiển thị "Đã chụp - Chụp lại" |

**Lưu ý:** Ảnh cần đủ sáng và rõ mặt để quản lý vận hành nhận diện. Dùng đèn/flash khi môi trường tối.

**Quan trọng — Ảnh chân dung vs Ảnh chứng từ:**
- **Chân dung (selfie):** Dùng camera trước, lấy đúng ảnh khung hình camera — **không được lật ảnh** (flip), lật sẽ làm sai nhận diện khuôn mặt.
- **Chứng từ (bằng lái, CCCD, đăng ký xe...):** Dùng camera sau hoặc kho ảnh, khác luồng ảnh chân dung.

### 3.6 Ví (Thu nhập)

| Bước | Hành động | Kỳ vọng |
|------|-----------|----------|
| 1 | Tab **Thu nhập** (hoặc Tài khoản → Ví tài xế nếu có) | Gọi `GET /wallet` (hoặc endpoint ví driver tương ứng) |
| 2 | Kiểm tra giao diện | Số dư, thu nhập tháng, hoa hồng, lịch sử giao dịch (nếu có); với demo: số mẫu; với tài khoản mới: có thể 0 |
| 3 | Nếu có chức năng rút tiền / khai báo tiền mặt | Gọi đúng API (ví dụ khai báo tiền: `POST /drivers/cash/declare`); kiểm tra không lỗi và dữ liệu cập nhật sau khi refresh |

---

## 4. Test luồng đơn (Booking)

Mục tiêu: **có đơn** → app hiển thị **“Đang có”** → **nhận / từ chối** → **hoàn thành** → **ví/thống kê cập nhật**.

### 4.1 Cần có đơn trên hệ thống

- Backend có booking ở trạng thái **gán cho tài xế** (ví dụ `DRIVER_ASSIGNED`) thì tài xế đó mới thấy đơn trong **“Đang có”** (available).
- Cách tạo đơn tùy backend của bạn:
  - Tạo booking từ app khách (nếu có) và chọn tài xế gần nhất, **hoặc**
  - Gọi API tạo booking (ví dụ `POST /booking/create`) rồi gán driver (simulate hoặc admin), **hoặc**
  - Dùng script/Postman tạo booking và gán `driverId` cho tài khoản tài xế đang test.

### 4.2 Trên App Tài xế

| Bước | Hành động | Kỳ vọng |
|------|-----------|----------|
| 1 | Đăng nhập bằng **tài khoản tài xế được gán đơn** → tab **Đơn hàng** | Gọi `GET /booking/driver/available`; danh sách “Đang có” hiển thị ít nhất 1 đơn (nếu backend đã gán) |
| 2 | Chọn một đơn → **Nhận** | Gọi `POST /booking/:id/accept`; đơn chuyển trạng thái, không còn trong “Đang có” (hoặc chuyển sang tab “Đang thực hiện” tùy UI) |
| 3 | (Hoặc) Chọn đơn → **Từ chối** | Gọi `POST /booking/:id/reject` với `reason` (nếu có); đơn biến mất khỏi “Đang có” |
| 4 | Với đơn đã nhận: lần lượt cập nhật trạng thái (đang đến → đã đón → đang chạy) nếu app có nút | Gọi `PATCH /booking/:id/status?status=DRIVER_ARRIVING`, `PICKED_UP`, `IN_PROGRESS` theo luồng |
| 5 | Bấm **Hoàn thành** | Gọi `POST /booking/:id/complete` (hoặc PATCH tương đương); booking chuyển sang trạng thái hoàn thành |
| 6 | Kiểm tra **Ví** và **Tổng quan** | Số dư / thu nhập ngày tăng tương ứng (backend cộng tiền vào ví và thống kê sau khi complete) |

**Lưu ý:**  
- Tài khoản **demo** có thể luôn thấy danh sách đơn mẫu (mock); để test API thật cần dùng **tài khoản tài xế thật** và đảm bảo có ít nhất một booking được gán cho driver đó.  
- Nếu không có công cụ tạo booking, có thể chỉ kiểm tra: đăng nhập tài xế thật → tab Đơn hàng → gọi `GET /booking/driver/available` trả 200 và format dữ liệu đúng (dù mảng rỗng).

---

## 5. Test tài khoản Demo vs Tài khoản thật

| Nội dung | Tài khoản demo | Tài khoản tài xế thật |
|----------|----------------|------------------------|
| **Đăng nhập** | `demo1@driver.vmd.asia` / `Demo1@123` | Email/mật khẩu đã đăng ký với `role: DRIVER` |
| **Dashboard / Ví** | Dữ liệu mẫu (đọc từ mock hoặc từ API nếu backend hỗ trợ demo) | Dữ liệu thật từ `GET /drivers/dashboard`, `GET /wallet` |
| **Cài đặt nhận đơn** | Có thể dùng mock hoặc API; không ghi đè dữ liệu thật | Gọi API thật; thay đổi được lưu backend |
| **Đơn “Đang có”** | App có thể hiển thị đơn mẫu (mock) | Chỉ thấy đơn thật được gán cho driver (từ `GET /booking/driver/available`) |
| **Nhận / Từ chối / Hoàn thành** | Nên chặn hoặc báo “Demo” để tránh gọi API với ID không tồn tại | Gọi API thật; trạng thái đơn và ví/thống kê cập nhật đúng |

**Gợi ý:**  
- Test đăng nhập cả **demo** và **thật** để đảm bảo không lỗi.  
- Test luồng đơn đầy đủ (có đơn → nhận → hoàn thành → ví/thống kê) với **tài khoản thật** và ít nhất một booking thật được gán cho tài xế đó.

---

## 6. Checklist tổng hợp

- [ ] **VPS/API:** `GET https://api.vmd.asia/api/v1/health` → 200, `database: "connected"`.
- [ ] **Đăng ký:** Tạo tài khoản mới (role DRIVER) → đăng nhập thành công.
- [ ] **Đăng nhập:** Demo + tài khoản thật đều vào được app.
- [ ] **Dashboard:** Load được, số liệu hiển thị (demo: mẫu; thật: từ API).
- [ ] **Cài đặt nhận đơn:** GET/PATCH đúng endpoint, lưu và load lại đúng.
- [ ] **Ảnh đại diện:** Chụp/chọn ảnh từ camera hoặc kho ảnh → upload → hiển thị trên Tài khoản.
- [ ] **Ví:** GET ví, số dư/giao dịch hiển thị đúng.
- [ ] **Đơn “Đang có”:** Tài xế thật thấy đơn được gán (khi có dữ liệu); nhận/từ chối gọi API đúng.
- [ ] **Hoàn thành đơn:** Complete → ví/thống kê cập nhật (kiểm tra trên app hoặc API).

---

## 7. Một số endpoint tham chiếu (API v1)

| Mục đích | Method | Endpoint |
|----------|--------|----------|
| Health | GET | `/health` |
| Đăng ký | POST | `/auth/register` |
| Đăng nhập | POST | `/auth/login` |
| Profile | GET | `/auth/profile` |
| Dashboard tài xế | GET | `/drivers/dashboard` |
| Cài đặt nhận đơn | GET / PATCH | `/drivers/settings/order-receiving` |
| Upload ảnh chân dung | POST | `/drivers/upload/face` (multipart/form-data, field: file) |
| Upload ảnh đại diện | POST | `/drivers/upload/avatar` (multipart/form-data, field: file) |
| Upload ảnh giấy tờ | POST | `/drivers/upload/document` (multipart/form-data, field: file) |
| Cập nhật ảnh giấy tờ (CCCD, GPLX, khuôn mặt) | PATCH | `/drivers/identity` body: `{ citizenIdFrontImage?, citizenIdBackImage?, faceImage?, driverLicenseImage?, criminalRecordImage? }` |
| Cập nhật ảnh phương tiện | PATCH | `/drivers/vehicles/:id` body: `{ frontImage?, backImage?, registrationImage?, insuranceImage?, plateCloseupImage? }` |
| Ví | GET | `/wallet` |
| Đơn đang có (tài xế) | GET | `/booking/driver/available` |
| Nhận đơn | POST | `/booking/:id/accept` |
| Từ chối đơn | POST | `/booking/:id/reject` |
| Hoàn thành đơn | POST | `/booking/:id/complete` |

Base URL: `https://api.vmd.asia/api/v1`. Các endpoint cần auth: gửi header `Authorization: Bearer <accessToken>`.

---

Nếu một bước nào lỗi (4xx/5xx hoặc app báo lỗi), kiểm tra:  
1) Response body từ API (message lỗi),  
2) Network tab / log trong app (URL, method, body),  
3) VPS: log backend, kết nối DB, biến môi trường.

---

## 8. Xử lý lỗi "cannot POST /api/v1/drivers/upload/..."

Thông báo dạng `cannot POST /api/v1/drivers/upload/avatar`, `.../upload/face`, `.../upload/document` có nghĩa **endpoint không tồn tại** (404) trên server `api.vmd.asia`. Thường do:

| Nguyên nhân | Cách xử lý |
|-------------|------------|
| **Backend chưa deploy mới** | Deploy lại `services/main-api` lên VPS. `DriversController` phải có routes: `upload/avatar`, `upload/face`, `upload/document`. |
| **Main API cũ** | Kiểm tra phiên bản main-api trên VPS có đủ 3 route upload trên. |
| **Nginx/proxy** | Đảm bảo `location /` proxy tới `main_api_backend`, không bỏ qua path `/api/v1/drivers/*`. |

**Kiểm tra nhanh:** Gọi `POST https://api.vmd.asia/api/v1/drivers/upload/document` (hoặc avatar, face) với header `Authorization: Bearer <token>`. Nếu route tồn tại: trả 400 "Vui lòng chọn ảnh". Nếu route không tồn tại: trả 404 "cannot POST".

**Test upload với backend local:** Chạy main-api local (`pnpm run dev` trong `services/main-api`), đổi `BASE_URL` trong `apps/mobile-driver/src/services/api.ts` thành `http://<IP_MÁY>:3000/api/v1` (cùng WiFi với điện thoại), rồi thử chụp ảnh lại.
