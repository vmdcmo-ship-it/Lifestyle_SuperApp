# Khắc phục lỗi không truy cập được Expo Go — Driver, User, Merchant

Khi **Expo Go không load được** 3 app (Driver, User, Merchant) — báo lỗi kết nối, timeout, hoặc màn hình trắng.

---

## Nguyên nhân thường gặp

| Nguyên nhân | Triệu chứng | Giải pháp |
|-------------|-------------|-----------|
| **Không cùng mạng** | Expo Go không quét được QR, timeout | Dùng chế độ Tunnel (Bước 1) |
| **Firewall chặn** | Quét QR xong không load | Cho phép Node/Metro port 8081 |
| **CORS / API** | App load xong nhưng API lỗi | Đã cấu hình trỏ `https://api.vmd.asia` |
| **Quyền mạng** | iOS/Android chặn Local Network | Bật quyền Mạng cục bộ cho Expo Go |

---

## Các bước xử lý (theo thứ tự)

### Bước 1 — Dùng chế độ Tunnel (khuyến nghị)

Tunnel dùng ngrok qua internet → **không phụ thuộc WiFi LAN**, phù hợp khi máy và điện thoại khác mạng.

**Driver:**
```powershell
cd C:\Users\nguye\Lifestyle_SuperApp\apps\mobile-driver
pnpm start:tunnel
```

**User:**
```powershell
cd C:\Users\nguye\Lifestyle_SuperApp\apps\mobile-user
pnpm start:tunnel
```

**Merchant:**
```powershell
cd C:\Users\nguye\Lifestyle_SuperApp\apps\mobile-merchant
pnpm start:tunnel
```

Lần đầu chạy có thể hỏi cài `@expo/ngrok` — chọn **Y** (Yes).

Sau khi chạy, quét **QR code** bằng Expo Go. QR dùng URL tunnel (exp://xxx.ngrok.io) nên hoạt động trên mọi mạng.

---

### Bước 2 — Cùng WiFi (nếu dùng LAN thường)

Nếu **không dùng tunnel**, máy tính và điện thoại phải **cùng WiFi**:

1. Kết nối cả hai vào cùng mạng.
2. Chạy `pnpm start` (không có tunnel).
3. Quét QR trong Expo Go.

---

### Bước 3 — Quyền mạng trên điện thoại

- **Android:** Cài đặt → Ứng dụng → Expo Go → Quyền → Bật **Mạng cục bộ** (Local network).
- **iOS:** Cài đặt → Expo Go → **Mạng cục bộ** → Bật.

---

### Bước 4 — Firewall Windows

Nếu dùng LAN và vẫn không kết nối:

1. Mở **Windows Defender Firewall** → **Cho phép ứng dụng**.
2. Tìm **Node.js** hoặc **Metro** → tích **Riêng tư** (Private).
3. Hoặc tạm tắt firewall để thử.

---

### Bước 5 — Xóa cache Expo

```powershell
cd apps\mobile-driver
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
pnpm start
```

Làm tương tự với `mobile-user`, `mobile-merchant` nếu cần.

---

## Tóm tắt lệnh chạy nhanh

| App | Lệnh (LAN) | Lệnh (Tunnel — khuyến nghị) |
|-----|------------|-----------------------------|
| Driver | `cd apps\mobile-driver` → `pnpm start` | `pnpm start:tunnel` |
| User | `cd apps\mobile-user` → `pnpm start` | `pnpm start:tunnel` |
| Merchant | `cd apps\mobile-merchant` → `pnpm start` | `pnpm start:tunnel` |

---

## API Production

Cả 3 app đều dùng **https://api.vmd.asia/api/v1**. Không cần backend local khi test với Expo Go.

Tài khoản demo (Driver): `demo1@driver.vmd.asia` / `Demo1@123`
