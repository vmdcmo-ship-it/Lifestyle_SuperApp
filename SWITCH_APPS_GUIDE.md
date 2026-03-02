# Hướng dẫn Chuyển đổi giữa các Apps trên Expo Go

## 📱 3 Apps trong Lifestyle SuperApp

1. **User App** (`apps/mobile-user`) - Ứng dụng cho người dùng
2. **Driver App** (`apps/mobile-driver`) - Ứng dụng cho tài xế
3. **Merchant App** (`apps/mobile-merchant`) - Ứng dụng cho nhà bán hàng

---

## 🔄 Cách chuyển đổi Apps

### Bước 1: Stop app hiện tại

Nếu đang chạy app khác, cần stop trước:

```powershell
# Tìm process đang chạy
netstat -ano | findstr ":8081"

# Kill process (thay <PID> bằng số PID tìm được)
taskkill /F /PID <PID>
```

### Bước 2: Start app muốn xem

#### ✅ Xem User App
```bash
cd apps/mobile-user
npx expo start --clear
```

#### ✅ Xem Driver App (ĐÃ CHẠY HIỆN TẠI)
```bash
cd apps/mobile-driver
npx expo start --clear
```

#### ✅ Xem Merchant App
```bash
cd apps/mobile-merchant
npx expo start --clear
```

### Bước 3: Kết nối từ Expo Go

**Cách 1: Scan QR Code**
- Mở Expo Go app trên điện thoại
- Scan QR code hiển thị trong terminal

**Cách 2: Kết nối thủ công**
- Mở Expo Go → "Enter URL manually"
- Nhập: `exp://<your-local-ip>:8081`

---

## 🎯 Hiện tại

✅ **Driver App đã sẵn sàng!**

Server đang chạy tại: `http://localhost:8081`

### Để xem trên Expo Go:

1. **Mở Expo Go app** trên điện thoại
2. **Đảm bảo cùng WiFi** với máy tính
3. **Scan QR code** (nếu có hiển thị trong terminal)
4. **Hoặc kết nối thủ công** qua local IP

### Nếu không thấy QR code:

Trong terminal đang chạy, nhấn:
- `w` - Mở trên web
- `a` - Mở Android emulator (nếu có)
- `i` - Mở iOS simulator (nếu có Mac)

---

## 📊 So sánh tính năng 3 Apps

### User App 🛍️
- 🏠 Home với Lifestyle Services
- 🍜 Gọi món ăn (Food Delivery)
- 🛒 Mua sắm (Shopping)
- 🏃 Run to Earn (rewards, groups)
- 💰 Lifestyle Wallet
- 🎯 Lifestyle Local (Must Try, Hot Spots)
- 📊 Pension Calculator
- 🛒 **Giỏ hàng & Thanh toán QR**

### Driver App 🚗
- 📍 Bản đồ đơn hàng
- 📦 Danh sách đơn hàng
- ✅ Nhận/Hoàn thành đơn
- 💰 Thu nhập
- 🗺️ Điều hướng

### Merchant App 🏪
- 📦 Quản lý đơn hàng
- 🍜 Quản lý menu/sản phẩm
- 📊 Thống kê doanh thu
- ⚙️ Cài đặt cửa hàng
- 🎫 Tạo khuyến mãi

---

## 🔧 Troubleshooting

### Lỗi "Port 8081 already in use"
```powershell
netstat -ano | findstr ":8081"
taskkill /F /PID <PID>
```

### App không reload khi sửa code
- Shake device → Reload
- Hoặc trong terminal nhấn `r`

### Cannot connect to Metro
- Kiểm tra Firewall
- Kiểm tra cùng WiFi
- Restart Expo Go app

### Package version warnings
```bash
# Update packages (optional)
npx expo install --fix
```

---

## 💡 Tips

1. **Dev Menu**: Shake device để mở dev menu
2. **Fast Refresh**: Tự động reload khi sửa code
3. **Debug**: Shake → "Debug Remote JS"
4. **Clear Cache**: Thêm flag `--clear` khi start
5. **Network**: Luôn dùng cùng WiFi

---

## 📞 Next Steps

Sau khi xem xong Driver App, muốn quay lại User App:

```bash
# Stop Driver App (Ctrl + C trong terminal)
# Start User App
cd apps/mobile-user
npx expo start
```
