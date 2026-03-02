# Mobile Driver App

Ứng dụng dành cho đối tác tài xế (Lifestyle Super App) — React Native (Expo).

## Đã triển khai

### 1. Đăng nhập / Đăng ký
- **LoginScreen**: Đăng nhập bằng email/mật khẩu.
- **RegisterScreen**: Đăng ký tài khoản tài xế (họ, tên, email, SĐT, mật khẩu).
- **AuthContext**: Lưu token (AsyncStorage), kiểm tra phiên khi mở app, refresh profile.
- Luồng: Chưa đăng nhập → màn Login/Register; Đã đăng nhập → Tab chính.

### 2. Dashboard (Tổng quan)
- Header: Tên tài xế, phương tiện (từ API hoặc mock).
- Bật/tắt **Online/Offline** → gọi `driverService.updateStatus('ONLINE'|'OFFLINE')`.
- Thống kê hôm nay: chuyến, thu nhập, giờ online, tỷ lệ nhận/hủy, đánh giá (từ API hoặc mock).
- Biểu đồ thu nhập tuần.
- Ví: số dư, thu nhập tháng, hoa hồng, thưởng (từ `walletService.getInfo()` hoặc mock).
- Pull-to-refresh; khi API lỗi/404 dùng dữ liệu mock.

### 3. Đơn hàng
- Tab **Đang có**: Danh sách đơn có thể nhận từ `bookingService.getAvailableOrders()`.
- Nút **Nhận đơn** → `bookingService.acceptOrder(id)`; **Từ chối** → `rejectOrder(id)`.
- Tab **Lịch sử**: `bookingService.getHistory()` (fallback mock).
- Loading & pull-to-refresh; khi 401 (SESSION_EXPIRED) → đăng xuất và quay về Login.

### 4. Thu nhập
- Chọn kỳ: Ngày / Tuần / Tháng.
- Số dư ví & chi tiết thu nhập từ `walletService.getInfo()` (fallback mock).
- Pull-to-refresh.

### 5. Tài khoản
- Profile từ `driverService.getProfile()` hoặc auth user (fallback mock).
- Menu: Thông tin, phương tiện, giấy tờ, bảo hiểm, đánh giá, cài đặt, hỗ trợ...
- **Đăng xuất** → xác nhận → `authService.logout()` → về màn Login.

### API & Backend
- Base URL: `__DEV__` → `http://10.0.2.2:4000/api/v1` (Android) / `http://localhost:4000/api/v1` (iOS); production → `https://api.vmd.asia/api/v1`.
- Token lưu AsyncStorage; 401 → thử refresh token; hết phiên → clear token, throw `SESSION_EXPIRED` (app xử lý logout).
- Các service: `auth.service`, `driver.service`, `booking.service`, `wallet.service`, `notification.service` — sẵn sàng gọi backend khi có endpoint tương ứng.

## Chạy app

```bash
# Từ thư mục gốc monorepo
pnpm run dev:driver

# Hoặc trong thư mục app
cd apps/mobile-driver
pnpm start
```

Sau đó mở bằng Expo Go (quét QR) hoặc `pnpm run android` / `pnpm run ios` (nếu đã cấu hình).

## Cấu trúc chính

- `App.tsx` — `AuthProvider` + `AppNavigator`
- `src/context/AuthContext.tsx` — Trạng thái đăng nhập, login/register/logout
- `src/navigation/AppNavigator.tsx` — Stack Login/Register + Tab (Dashboard, Orders, Earnings, Profile)
- `src/screens/` — Login, Register, Dashboard, Orders, Earnings, Profile
- `src/services/` — api, auth, driver, booking, wallet, notification
- `src/data/mockData.ts` — Dữ liệu mock khi backend chưa có/ lỗi

## Ghi chú

- **Tài khoản demo (trình diễn đầy đủ dữ liệu):** Có **3 tài khoản** để nhiều người truy cập cùng lúc không xung đột. Mỗi tài khoản xem cùng bộ dữ liệu mẫu (read-only).

  | Tên    | Email                    | Mật khẩu   |
  |--------|---------------------------|------------|
  | Demo 1 | `demo1@driver.vmd.asia`   | `Demo1@123` |
  | Demo 2 | `demo2@driver.vmd.asia`   | `Demo2@123` |
  | Demo 3 | `demo3@driver.vmd.asia`   | `Demo3@123` |

  Nếu chưa có trên backend: vào **Đăng ký** trong app, tạo lần lượt 3 tài khoản với email và mật khẩu trên, sau đó đăng nhập bằng từng tài khoản để xem demo.
- **Tài xế mới đăng ký:** Sau khi đăng ký, app hiển thị trạng thái "mới": không có phương tiện, 0 chuyến, 0đ thu nhập. Cần **hoàn thành hồ sơ đăng ký** (phương tiện, giấy tờ) và được duyệt. Chỉ khi có **giao dịch thực tế** mới có dữ liệu thống kê/đơn hàng/thu nhập.
- Backend cần có các endpoint tương thích (auth, drivers, booking, wallet). Nếu chưa có hoặc trả lỗi, tài khoản thường thấy dữ liệu rỗng; chỉ tài khoản demo mới thấy dữ liệu mẫu.
- Đăng ký gửi `role: 'DRIVER'`; backend cần hỗ trợ role DRIVER và profile/dashboard/wallet cho driver.
