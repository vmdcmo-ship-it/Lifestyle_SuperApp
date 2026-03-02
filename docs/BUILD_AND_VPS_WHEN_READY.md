# (4) Build & (5) VPS — Khi app đã ổn định

Hướng dẫn build ứng dụng (đặc biệt app tài xế) và triển khai VPS khi đã sẵn sàng release.

---

## 1. VPS — Đã sẵn sàng cho API

Backend và web đã được cấu hình deploy lên VPS theo `DEPLOY_VPS_SUMMARY.md`:

| Thành phần   | URL / Ghi chú |
|-------------|----------------|
| Main API    | `https://api.vmd.asia` — app driver đã trỏ `BASE_URL` tới đây |
| Auth        | `https://auth.vmd.asia` (nếu tách) hoặc qua main-api |
| Web         | `https://vmd.asia` |

- App driver hiện dùng **production API** trong `apps/mobile-driver/src/services/api.ts`: `https://api.vmd.asia/api/v1`.
- Khi app ổn định, **không cần đổi URL**; chỉ cần đảm bảo VPS chạy đúng và SSL hợp lệ.

**Checklist VPS trước khi release app:**

- [ ] `curl https://api.vmd.asia/health` trả 200
- [ ] Đăng nhập / refresh token hoạt động
- [ ] Các endpoint driver (profile, dashboard, booking, wallet) đã test trên production
- [ ] Backup DB và script restore đã chạy thử

---

## 2. Build app tài xế (mobile-driver)

App dùng **Expo (SDK 54)**. Có hai hướng khi app ổn định.

### 2.1. Development build (chạy trên thiết bị thật, không qua Expo Go)

Dùng khi cần test bản "giống production" trên máy thật (có native module, không dùng Expo Go):

```bash
# Từ thư mục gốc monorepo
cd apps/mobile-driver

# Cài dependency (nếu chưa)
pnpm install

# Tạo thư mục native (prebuild) — chạy 1 lần hoặc khi đổi config
npx expo prebuild

# Chạy trên Android (cần Android Studio / SDK)
npx expo run:android

# Chạy trên iOS (cần Xcode, chỉ trên macOS)
npx expo run:ios
```

Sau `expo prebuild`, có thư mục `android/` và `ios/`; build release (APK/AAB hoặc IPA) qua Android Studio / Xcode hoặc EAS Build (xem dưới).

### 2.2. EAS Build (Expo Application Services) — build bản store / phân phối

Khi cần build **APK/AAB (Google Play)** hoặc **IPA (App Store)** hoặc bản internal:

1. **Cài EAS CLI (một lần):**

   ```bash
   npm install -g eas-cli
   eas login
   ```

2. **Trong project đã có `eas.json`** (xem `apps/mobile-driver/eas.json`):

   ```bash
   cd apps/mobile-driver
   eas build --platform android   # Android
   eas build --platform ios       # iOS (cần tài khoản Apple Developer)
   eas build --platform all       # Cả hai
   ```

3. **Profile trong `eas.json`:**
   - `development` — bản dev, dễ debug
   - `preview`     — bản test (internal, không lên store)
   - `production`  — bản nộp store / phân phối chính thức

Sau khi build xong, EAS cung cấp link tải APK/IPA hoặc có thể submit lên store bằng `eas submit`.

### 2.3. Scripts gợi ý (thêm vào `apps/mobile-driver/package.json` nếu cần)

```json
"scripts": {
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "prebuild": "expo prebuild",
  "build:android": "expo run:android --variant release",
  "build:ios": "expo run:ios --configuration Release"
}
```

---

## 3. Cấu hình trước khi build bản release

### 3.1. API URL

- Hiện tại: `apps/mobile-driver/src/services/api.ts` dùng `https://api.vmd.asia/api/v1`.
- Nếu có nhiều môi trường (staging/production), có thể dùng biến môi trường (ví dụ `EXPO_PUBLIC_API_URL`) và trong EAS Build set biến tương ứng cho từng profile.

### 3.2. app.json / app.config

- Kiểm tra `version` và `versionCode` (Android) / `CFBundleShortVersionString` (iOS) trước mỗi đợt release.
- Cập nhật `slug`, `name`, `icon`, `splash` nếu đổi branding.

### 3.3. Bảo mật

- Không hardcode secret (API key, signing secret) trong code; dùng EAS Secrets hoặc biến môi trường.
- Build release nên bật minify và không log token ra console.

---

## 4. Thứ tự thực hiện khi "app đã ổn định"

1. **VPS**
   - Deploy/update backend theo `DEPLOY_VPS_SUMMARY.md`.
   - Kiểm tra health, auth, driver API.
   - Backup DB và test restore.

2. **App**
   - Test E2E với production API (đăng nhập, dashboard, đơn, ví).
   - Tăng version trong `app.json` / `package.json`.
   - Chạy `expo prebuild` nếu có thay đổi native/config.

3. **Build**
   - **Nội bộ:** `expo run:android` / `expo run:ios` hoặc EAS Build profile `preview`, phân phối link tải.
   - **Store:** EAS Build profile `production`, sau đó `eas submit` hoặc upload thủ công lên Play Store / App Store.

4. **Sau release**
   - Theo dõi crash (Sentry / EAS hoặc công cụ khác).
   - Chuẩn bị bản cập nhật (OTA hoặc bản build mới) khi cần.

---

## 5. Tài liệu liên quan

- **Deploy backend & web lên VPS:** `DEPLOY_VPS_SUMMARY.md`
- **Chi tiết deploy:** `infrastructure/DEPLOYMENT.md`, `infrastructure/QUICK_START.md`
- **App driver:** `apps/mobile-driver/README.md`
- **Kiến trúc:** `docs/architecture/README_ARCHITECTURE.md`

---

**Tóm tắt:** VPS đã sẵn sàng (API tại `https://api.vmd.asia`). Khi app ổn định, chỉ cần build app (development build hoặc EAS), đảm bảo trỏ đúng API và version, rồi phân phối nội bộ hoặc lên store.
