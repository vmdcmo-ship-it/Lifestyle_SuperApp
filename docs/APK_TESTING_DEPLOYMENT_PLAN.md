# 📱 Kế hoạch triển khai APK – Giai đoạn thử nghiệm & presentation

> Triển khai **App User**, **App Merchant**, **App Driver** dưới dạng APK Android để thử nghiệm logic, flow và presentation trước Nhà đầu tư. Khi hoàn thiện sẽ chuyển lên Google Play.

**Phiên bản**: 1.0  
**Cập nhật**: 2026-03

---

## 1. Mục tiêu

| Mục tiêu | Mô tả |
|----------|-------|
| **Thử nghiệm** | Tester và team QA dùng APK để test logic, flow, tích hợp API |
| **Presentation** | Trình bày tính năng trước Nhà đầu tư với app cài sẵn trên thiết bị (trải nghiệm sát bản thật hơn Expo Go) |
| **Tiết kiệm chi phí** | Chưa cần đăng ký Google Play ($25), chưa cần submit store |
| **Chuẩn bị cho launch** | Khi hoàn thiện, build AAB và lên Google Play |

---

## 2. Tổng quan 3 ứng dụng

| Ứng dụng | Thư mục | Package Android | Tên hiển thị |
|----------|---------|-----------------|--------------|
| **App User** | `apps/mobile-user` | `vn.lifestyle.superapp` | Lifestyle |
| **App Driver** | `apps/mobile-driver` | `vn.lifestyle.superapp.driver` | Lifestyle Tài xế |
| **App Merchant** | `apps/mobile-merchant` | `vn.lifestyle.superapp.merchant` | Lifestyle Đối tác |

Ba app có **package khác nhau** → có thể cài đồng thời trên cùng 1 máy để demo đa vai trò.

---

## 3. Trình tự triển khai đề xuất

### Phase 1: Chuẩn bị môi trường (1 lần)

| Bước | Hành động |
|------|-----------|
| 1.1 | Cài EAS CLI: `npm install -g eas-cli` |
| 1.2 | Đăng nhập Expo: `eas login` |
| 1.3 | Khởi tạo EAS project cho từng app (chạy trong từng thư mục): |
| | `cd apps/mobile-user && eas init` |
| | `cd apps/mobile-driver && eas init` |
| | `cd apps/mobile-merchant && eas init` |
| 1.4 | (Tùy chọn) Cấu hình EAS Secret nếu API URL khác: |
| | `eas secret:create --name EXPO_PUBLIC_API_URL --value "https://api.vmd.asia/api/v1" --type string` |

---

### Phase 2: Build APK từng app

**Lưu ý**: Monorepo dùng pre-install hook (`scripts/eas-pre-install.js`) để isolate app khi build. Mỗi app có env `LIFESTYLE_BUILD_APP` trong eas.json (user, driver, merchant).

| Bước | Ứng dụng | Lệnh |
|------|-----------|------|
| 2.1 | App User | `cd apps/mobile-user && eas build --profile preview --platform android` |
| 2.2 | App Driver | `cd apps/mobile-driver && eas build --profile preview --platform android` |
| 2.3 | App Merchant | `cd apps/mobile-merchant && eas build --profile preview --platform android` |

**Hoặc dùng script từ root:**

```bash
# Build 1 app
npm run build:apk:user
npm run build:apk:driver
npm run build:apk:merchant

# Build tất cả (chạy tuần tự)
npm run build:apk:all
```

Sau khi build xong, EAS trả về **link tải APK**. Lưu link hoặc tải file về.

---

### Phase 3: Phân phối APK cho tester / presentation

| Cách | Mô tả |
|------|-------|
| **Link trực tiếp** | Gửi link tải từ EAS build cho tester. Họ mở link trên điện thoại, tải và cài (cần bật "Cài từ nguồn không xác định") |
| **File APK** | Tải APK từ EAS → gửi qua Drive/Telegram/email. Tester cài thủ công |
| **Google Drive / Dropbox** | Upload APK lên folder, share link. Thuận tiện cho nhiều người |

**Lưu ý cài đặt trên Android:**
- Vào **Cài đặt** → **Bảo mật** → Bật **"Cho phép cài ứng dụng từ nguồn không xác định"** (hoặc tùy theo hãng: "Cài ứng dụng không xác định")

---

### Phase 4: Checklist trước presentation

| Hạng mục | Kiểm tra |
|----------|----------|
| **Thiết bị** | Thiết bị Android (khuyến nghị 1–2 máy dự phòng) |
| **API** | Main API đang chạy và truy cập được: `https://api.vmd.asia/api/v1` |
| **Cài đặt** | Cài đủ 3 app: User, Driver, Merchant |
| **Tài khoản test** | Chuẩn bị vài tài khoản test (User, Driver, Merchant) để demo flow |
| **Mạng** | Wifi/4G ổn định tại nơi presentation |
| **Pin** | Sạc đầy hoặc chuẩn bị sạc dự phòng |

---

### Phase 5: Khi hoàn thiện – Deploy lên Google Play

| Bước | Hành động |
|------|-----------|
| 5.1 | Đăng ký [Google Play Console](https://play.google.com/console) ($25) |
| 5.2 | Tạo 3 ứng dụng trên Play Console (User, Driver, Merchant) |
| 5.3 | Build production (AAB): |
| | `eas build --profile production --platform android` |
| 5.4 | Submit: `eas submit --latest --platform android --profile production` |
| 5.5 | Hoàn thành store listing (screenshot, mô tả, privacy policy) |

---

## 4. Lệnh tóm tắt

```bash
# Khởi tạo EAS (1 lần cho mỗi app)
cd apps/mobile-user && eas init
cd apps/mobile-driver && eas init
cd apps/mobile-merchant && eas init

# Build APK (preview – dùng cho test & presentation)
cd apps/mobile-user && eas build --profile preview --platform android
cd apps/mobile-driver && eas build --profile preview --platform android
cd apps/mobile-merchant && eas build --profile preview --platform android

# Hoặc từ root
npm run build:apk:user
npm run build:apk:driver
npm run build:apk:merchant
npm run build:apk:all
```

---

## 5. Kiến trúc pre-install (monorepo)

| File | Mục đích |
|------|----------|
| `scripts/eas-pre-install.js` | Hook chạy trước `npm install` trên EAS. Đọc `LIFESTYLE_BUILD_APP` (user/driver/merchant), isolate app đó lên root, xóa workspace khác → tránh lỗi `@lifestyle/* workspace:*`. |
| Root `package.json` | `"eas-build-pre-install": "node scripts/eas-pre-install.js"` |
| `eas.json` (mỗi app) | `"env": { "LIFESTYLE_BUILD_APP": "user" }` (hoặc driver/merchant) |

---

## 6. Cập nhật khi có thay đổi code

Khi sửa code và cần build APK mới:

1. Chạy lại lệnh build tương ứng (vd: `npm run build:apk:user`)
2. Lấy link APK mới từ EAS
3. Gửi link cho tester hoặc cập nhật file trên Drive

**Tùy chọn – OTA Updates (EAS Update):** Nếu chỉ sửa JS/TS (không đổi native), có thể dùng EAS Update để đẩy bản cập nhật mà không cần build lại APK. Cần cấu hình thêm `expo-updates`.

---

## 7. So sánh APK vs Expo Go (cho presentation)

| Tiêu chí | Expo Go | APK (EAS Preview) |
|----------|---------|---------------------|
| Native modules tùy chỉnh | Giới hạn | Đầy đủ |
| Trải nghiệm gần app thật | Không | Có |
| Cài sẵn, chạy offline (sau khi cài) | Cần kết nối dev server | Có thể dùng offline (phụ thuộc API) |
| Ấn tượng với Nhà đầu tư | Trung bình | Tốt hơn (giống app production) |
| Camera, Maps, Location | Giới hạn | Hoạt động đúng |

---

## 8. Tài liệu liên quan

- [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md) – Checklist chi tiết khi lên store
- [EAS Build – Android](https://docs.expo.dev/build-reference/android-builds/)
- [EAS Build – Local vs Cloud](https://docs.expo.dev/build/internal-distribution/)
