# Hướng dẫn Restart Metro Bundler

## Vấn đề
Khi nhấn nút "Thanh Toán" trong giỏ hàng, không chuyển sang màn hình thanh toán.

## Nguyên nhân
Metro bundler đang chạy với code cũ, chưa load các files mới:
- `CheckoutScreen.tsx`
- `PaymentMethodSelector.tsx`
- `QRPaymentModal.tsx`
- `CartContext.tsx`

## Giải pháp

### Cách 1: Restart trong terminal đang chạy Expo
1. Trong terminal đang chạy `expo start`, nhấn `Ctrl + C` để stop
2. Chạy lại:
```bash
cd apps/mobile-user
npx expo start --clear
```

### Cách 2: Kill process và restart từ đầu
1. Tìm và kill process trên port 8081 (nếu có):
```powershell
netstat -ano | findstr ":8081"
taskkill /F /PID <PID_number>
```

2. Clear cache và restart:
```bash
cd apps/mobile-user
npx expo start --clear
```

### Cách 3: Trong Expo Go app
1. Shake device để mở Dev Menu
2. Chọn "Reload"
3. Hoặc chọn "Disable Fast Refresh" rồi "Enable Fast Refresh"

## Kiểm tra sau khi restart
1. Mở app trên Expo Go
2. Thêm món vào giỏ hàng
3. Vào **Giỏ Hàng** (Cart)
4. Nhấn nút **"Thanh Toán"**
5. Phải chuyển sang màn hình **Thanh Toán** với:
   - 📍 Địa chỉ giao hàng
   - 📦 Đơn hàng
   - 💳 **Phương thức thanh toán** (với QR Sepay được đề xuất)

## Nếu vẫn không được
Kiểm tra console log trong terminal để xem có lỗi nào không.
