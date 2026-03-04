# 🧪 Hướng dẫn test đầy đủ tính năng – Chuẩn bị cho test thực tế

> Mục tiêu: Có thể test App đầy đủ tính năng trên nền tảng test trước khi triển khai thực tế.

**Phiên bản**: 1.0  
**Cập nhật**: 2026-03

---

## 1. Tổng quan

| Ứng dụng | APK build | Tính năng chính |
|----------|-----------|-----------------|
| **App User (KODO)** | ✅ Có thể build | Auth, Home, Đặt xe, Bảo hiểm, Profile, Wallet |
| **App Driver** | ✅ Đã build thành công | Chợ đơn, Đơn hàng, Thu nhập, Nhiệm vụ, Profile |
| **App Merchant** | ✅ Có thể build | Đăng nhập, Dashboard, Đơn hàng, Thống kê |

---

## 2. Các bước để test đầy đủ

### 2.1 Build APK cả 3 app

```bash
# Từng app
npm run build:apk:user
npm run build:apk:driver
npm run build:apk:merchant

# Hoặc tất cả
npm run build:apk:all
```

Sau khi build xong, lấy link APK từ EAS và tải về.

### 2.2 Đảm bảo API test hoạt động

- API URL: `https://api.vmd.asia/api/v1`
- Cần đảm bảo backend/main-api đang chạy và truy cập được từ thiết bị test
- Nếu test local: dùng tunnel (ngrok/tunnel) hoặc thiết bị và máy cùng mạng với API

### 2.3 Tài khoản test

| App | Email test | Ghi chú |
|-----|------------|---------|
| User | (tạo qua API/Đăng ký) | Đăng ký mới hoặc dùng account có sẵn |
| Driver | `driver@lifestyle.vn` (demo) | Xem `mockData.ts` – `isDemoDriverEmail` |
| Merchant | (tạo qua API) | Tùy cấu hình backend |

### 2.4 Checklist tính năng test – App Driver

| Tính năng | Trạng thái | Cách test |
|-----------|------------|-----------|
| Chợ đơn (nhận đơn) | Đang thử nghiệm | Mở tab Nhận đơn → xem danh sách đơn |
| Đơn hàng đang thực hiện | Đang thử nghiệm | Nhận đơn → chuyển sang tab Đơn hàng |
| Thu nhập & Rút tiền | Đang thử nghiệm | Tab Thu nhập |
| Nhiệm vụ | Đang thử nghiệm | Tab Nhiệm vụ |
| Profile – Bảo hiểm, TK, Phương tiện, v.v. | Đang thử nghiệm | Profile → chọn mục |
| Nạp tiền | Sắp ra mắt | Hiện modal “Sắp ra mắt” |

### 2.5 Checklist tính năng test – App User (KODO)

| Tính năng | Trạng thái | Cách test |
|-----------|------------|-----------|
| Đăng nhập / Đăng ký | ✅ | Auth flow |
| Home, Spotlight | ✅ | Tab chính |
| Đặt xe | ✅ | Flow đặt xe |
| Bảo hiểm | ✅ | Màn bảo hiểm |
| Profile, Wallet, Settings | ✅ | Các tab/màn con |

---

## 3. Pre-install hook (monorepo)

Build APK trong monorepo dùng hook `scripts/eas-pre-install.js`:

- Đọc env `LIFESTYLE_BUILD_APP` (user/driver/merchant) từ eas.json
- Isolate app tương ứng lên root, xóa workspace khác
- Tránh lỗi `workspace:*` khi npm install trên EAS

Mỗi app đã cấu hình `LIFESTYLE_BUILD_APP` trong eas.json profile `preview`.

---

## 4. Lệnh nhanh

```bash
# Build APK
npm run build:apk:user
npm run build:apk:driver
npm run build:apk:merchant

# Chạy dev local (Expo)
npm run dev:mobile      # App User
npm run dev:driver      # App Driver
```

---

## 5. Tài liệu liên quan

- [APK_TESTING_DEPLOYMENT_PLAN.md](./APK_TESTING_DEPLOYMENT_PLAN.md) – Quy trình triển khai APK
- [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md) – Checklist khi lên store
