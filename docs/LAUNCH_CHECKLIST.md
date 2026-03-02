# 🚀 Checklist Launch App User – iOS & Android

> Tài liệu hướng dẫn các bước chuẩn bị và triển khai **Lifestyle Super App** lên App Store (iOS) và Google Play (Android).

**Phiên bản**: 1.0  
**Cập nhật**: 2026-03

---

## 1. Tổng quan hiện trạng

### ✅ Đã hoàn thành

| Mục | Trạng thái |
|-----|------------|
| Auth Gate – redirect Login/Main theo token | ✅ |
| Đăng ký / Đăng nhập (email + password) | ✅ |
| Cấu hình `app.json` (bundleIdentifier, package) | ✅ |
| Cấu hình `eas.json` cho EAS Build | ✅ |
| Tích hợp API main-api (auth, profile, wallet, loyalty, …) | ✅ |
| Màn hình: Home, Spotlight, Đặt xe, Bảo hiểm, Profile | ✅ |
| Cấu trúc màn hình phụ (Wallet, Membership, Settings…) | ✅ |

### ⚠️ Cần bổ sung trước khi launch

- **EAS Project** – Chạy `eas init` để tạo project trên Expo
- **Credentials** – Apple Developer & Google Play Console
- **Assets** – Icon, splash, adaptive icon đúng kích thước
- **Privacy Policy & Terms** – Bắt buộc cho App Store và Play Store
- **Deep links / Universal Links** – Tùy nhu cầu marketing

---

## 2. Chuẩn bị tài khoản & môi trường

### 2.1 Apple Developer Program

- [ ] Đăng ký [Apple Developer Program](https://developer.apple.com/programs/) ($99/năm)
- [ ] Tạo App ID: `vn.lifestyle.superapp` trong [App Store Connect](https://appstoreconnect.apple.com)
- [ ] Chuẩn bị thông tin app (tên, mô tả, screenshot, privacy policy URL)

### 2.2 Google Play Console

- [ ] Đăng ký [Google Play Console](https://play.google.com/console) ($25 một lần)
- [ ] Tạo ứng dụng mới với package `vn.lifestyle.superapp`
- [ ] Chuẩn bị trang store listing (mô tả, screenshot, privacy policy URL)

### 2.3 Expo / EAS

- [ ] Cài EAS CLI: `npm install -g eas-cli`
- [ ] Đăng nhập: `eas login`
- [ ] Trong `apps/mobile-user`: chạy `eas init` để tạo/link Expo project
- [ ] Cập nhật `app.json` với `extra.eas.projectId` (sau khi `eas init`)

---

## 3. Cấu hình ứng dụng

### 3.1 `app.json` – Kiểm tra

```json
{
  "expo": {
    "name": "Lifestyle",
    "slug": "lifestyle-superapp",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "vn.lifestyle.superapp",
      "buildNumber": "1"
    },
    "android": {
      "package": "vn.lifestyle.superapp",
      "versionCode": 1
    }
  }
}
```

- [ ] Bundle ID / Package đúng với tài khoản đã đăng ký
- [ ] `version` và `buildNumber` / `versionCode` tăng lên mỗi lần submit

### 3.2 Assets (icons, splash)

| Asset | iOS | Android |
|-------|-----|---------|
| App Icon | 1024×1024 | 1024×1024 (adaptive foreground) |
| Splash | Tùy thiết bị | Tùy thiết bị |
| Adaptive Icon | - | 1024×1024 foreground + background color |

- [ ] Đặt đúng file tại `apps/mobile-user/assets/`
- [ ] Kiểm tra `icon`, `splash.image`, `adaptiveIcon.foregroundImage` trong `app.json`

---

## 4. Biến môi trường (Environment Variables)

Trong `apps/mobile-user`:

- `EXPO_PUBLIC_API_URL` – URL API production (vd: `https://api.vmd.asia/api/v1`)

- [ ] Cấu hình trong EAS Secrets cho build production:
  ```bash
  eas secret:create --name EXPO_PUBLIC_API_URL --value "https://api.vmd.asia/api/v1" --type string
  ```

---

## 5. Bản bắt buộc trước khi submit store

### 5.1 Privacy Policy & Điều khoản sử dụng

- [ ] Viết và host Privacy Policy (URL cố định)
- [ ] Viết và host Terms of Service
- [ ] Thêm links vào màn Settings / Profile trong app
- [ ] App Store và Play Store yêu cầu URL privacy policy khi submit

### 5.2 Quyền ứng dụng (Permissions)

Kiểm tra `app.json` / `app.config.js` cho các permission cần thiết:

- [ ] `expo-location` – Nếu dùng đặt xe / tìm gần
- [ ] `expo-image-picker` – Nếu upload ảnh profile
- [ ] `expo-notifications` – Push notification
- [ ] Thêm mô tả rõ ràng cho từng permission trong store listing (Lý do sử dụng)

---

## 6. Build & Submit

### 6.1 Development / Preview (Internal test)

```bash
cd apps/mobile-user

# iOS Simulator (dev)
eas build --profile development --platform ios

# Android APK (internal)
eas build --profile preview --platform android

# iOS (TestFlight / internal)
eas build --profile preview --platform ios
```

### 6.2 Production Build

```bash
# iOS (App Store)
eas build --profile production --platform ios

# Android (AAB cho Google Play)
eas build --profile production --platform android
```

### 6.3 Submit lên Store

**iOS (sau khi build xong):**

```bash
eas submit --latest --platform ios --profile production
```

Hoặc upload thủ công qua Transporter / Xcode.

**Android:**

```bash
eas submit --latest --platform android --profile production
```

Hoặc upload file `.aab` trực tiếp lên Google Play Console.

---

## 7. Thứ tự thực hiện đề xuất

| Bước | Hành động |
|------|-----------|
| 1 | Đăng ký Apple Developer + Google Play Console (nếu chưa có) |
| 2 | Chạy `eas init` trong `apps/mobile-user` |
| 3 | Cấu hình EAS Secrets (`EXPO_PUBLIC_API_URL`) |
| 4 | Cập nhật assets (icon, splash) đúng chuẩn |
| 5 | Viết và host Privacy Policy + Terms |
| 6 | Build preview → test trên thiết bị thật |
| 7 | Build production → Submit lên App Store và Play Store |
| 8 | Hoàn thành store listing (screenshot, mô tả, danh mục) |
| 9 | Nộp review và theo dõi phản hồi |

---

## 8. Tài liệu tham khảo

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [App Store Connect – App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play – Launch checklist](https://support.google.com/googleplay/android-developer/answer/9859152)
- [Expo – Configuring app.json](https://docs.expo.dev/versions/latest/config/app/)

---

**Ghi chú**: Checklist này nên được cập nhật mỗi khi có thay đổi về quy định store hoặc quy trình nội bộ.
