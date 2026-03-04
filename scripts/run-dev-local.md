# Chạy Web + API local để xem Spotlight

## Khắc phục lỗi "Cannot read properties of undefined (reading 'call')"

Nếu trang /spotlight báo lỗi runtime này:
1. Dừng Next.js (Ctrl+C)
2. Xóa cache: `Remove-Item -Recurse -Force apps/web/.next`
3. Khởi động lại web (next.config đã tắt webpack cache khi dev)
4. Xóa Service Worker trong Chrome: DevTools → Application → Storage → Clear site data

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
