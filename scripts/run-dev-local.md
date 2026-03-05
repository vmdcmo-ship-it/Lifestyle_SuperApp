# Chạy Web + API local để xem Spotlight

## Khắc phục lỗi runtime

### Lỗi "Cannot read properties of undefined (reading 'call')"
1. Dừng Next.js (Ctrl+C)
2. Xóa cache: `Remove-Item -Recurse -Force apps/web/.next`
3. Khởi động lại web
4. Xóa Service Worker: Chrome DevTools → Application → Storage → Clear site data

### Lỗi "ChunkLoadError: Loading chunk app/layout failed (timeout)"
1. Dừng Next.js (Ctrl+C)
2. Xóa cache: `Remove-Item -Recurse -Force apps/web/.next`
3. Xóa cache trình duyệt hoặc mở tab ẩn danh (Ctrl+Shift+N)
4. Khởi động lại web – lần đầu có thể chậm (30–60s)

### Lỗi "Cannot find module middleware-manifest.json"
1. Dừng Next.js (Ctrl+C)
2. Xóa hoàn toàn thư mục .next: `Remove-Item -Recurse -Force apps/web/.next`
3. Khởi động lại: `npx next dev -p 3010` (không dùng --turbo)
4. Đợi đến khi thấy "Ready" trong terminal rồi mới mở trình duyệt

---

## Cách 1: Hai terminal riêng (khuyến nghị)

### Terminal 1 – main-api (cổng 3002)
```powershell
cd c:\Users\nguye\Lifestyle_SuperApp\services\main-api
$env:PORT=3002; npm run dev
```
Đợi đến khi thấy: `Running on: http://localhost:3002`

### Terminal 2 – Web (cổng 3001 hoặc 3003 nếu 3001 bận)
```powershell
cd c:\Users\nguye\Lifestyle_SuperApp\apps\web
$env:NEXT_PUBLIC_API_URL="http://localhost:3002"; npx next dev -p 3001
```

### Truy cập
- **Web:** http://localhost:3001 (hoặc :3003 nếu dùng port đó)
- **Spotlight:** http://localhost:3001/spotlight (hoặc :3003)
- **Tạo video (AI gợi ý):** http://localhost:3001/spotlight/create

---

## Cách 2: Nếu cổng bị chiếm

Dừng tiến trình đang dùng cổng:
```powershell
# Tìm process dùng cổng 3001
netstat -ano | findstr :3001
# Dừng theo PID (thay 12345 bằng PID thật)
taskkill /PID 12345 /F
```

---

## Seed dữ liệu Spotlight (categories, regions)

Nếu cần seed categories và địa điểm:
```powershell
cd c:\Users\nguye\Lifestyle_SuperApp\services\main-api
npx ts-node prisma/seed-spotlight.ts
```

Video: tạo qua form http://localhost:3001/spotlight/create (cần đăng nhập).
