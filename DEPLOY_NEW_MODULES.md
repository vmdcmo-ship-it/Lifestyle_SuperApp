# Deploy 8 Modules Mới Lên VPS
# Ngày: 2026-02-22

## Tổng quan: 32+ files mới cần upload
- 8 NestJS modules (drivers, merchants, orders, notifications, loyalty, insurance, search, gateway)
- Prisma schema cập nhật (30 models, 6 schemas)
- WebSocket gateway (socket.io)
- CI/CD pipelines

---

## PHẦN A: Upload Code Từ Windows (PowerShell)

### Lệnh 1 — Upload toàn bộ thư mục src (chứa tất cả modules mới)

```powershell
scp -r c:\Users\nguye\Lifestyle_SuperApp\services\main-api\src root@103.161.119.125:/opt/lifestyle-superapp/services/main-api/
```

### Lệnh 2 — Upload Prisma schema (có models mới + insurance schema)

```powershell
scp c:\Users\nguye\Lifestyle_SuperApp\services\main-api\prisma\schema.prisma root@103.161.119.125:/opt/lifestyle-superapp/services/main-api/prisma/
```

### Lệnh 3 — Upload package.json (có thêm socket.io deps)

```powershell
scp c:\Users\nguye\Lifestyle_SuperApp\services\main-api\package.json root@103.161.119.125:/opt/lifestyle-superapp/services/main-api/
```

### Lệnh 4 — Upload pnpm-lock.yaml (đồng bộ dependencies)

```powershell
scp c:\Users\nguye\Lifestyle_SuperApp\pnpm-lock.yaml root@103.161.119.125:/opt/lifestyle-superapp/
```

---

## PHẦN B: Trên VPS — Build & Deploy

### Lệnh 5 — SSH vào VPS

```powershell
ssh root@103.161.119.125
```

### Lệnh 6 — Vào thư mục project

```bash
cd /opt/lifestyle-superapp
```

### Lệnh 7 — Tạo insurance schema trong database

```bash
docker exec -i lifestyle_postgres_prod psql -U lifestyle_admin -d lifestyle_db -c "CREATE SCHEMA IF NOT EXISTS insurance;"
```

### Lệnh 8 — Rebuild main-api (không cache)

```bash
docker compose --env-file .env -f infrastructure/docker/docker-compose.production.yml build --no-cache main-api
```

### Lệnh 9 — Khởi động lại main-api

```bash
docker compose --env-file .env -f infrastructure/docker/docker-compose.production.yml up -d main-api
```

### Lệnh 10 — Đợi container healthy rồi push schema

```bash
sleep 15 && docker exec lifestyle_main_api npx prisma db push --skip-generate
```

### Lệnh 11 — Kiểm tra container status

```bash
docker ps -a | grep lifestyle
```

### Lệnh 12 — Xem logs main-api

```bash
docker logs lifestyle_main_api --tail 50
```

---

## PHẦN C: Verify

Mở trình duyệt:
- Swagger UI: https://api.vmd.asia/api/v1/docs

Các API tags mới phải xuất hiện:
- Drivers (8 endpoints)
- Merchants (13 endpoints)
- Orders - Food Delivery & Shopping (6 endpoints)
- Notifications (7 endpoints)
- Loyalty & Rewards (7 endpoints)
- Insurance (7 endpoints)
- Search (2 endpoints)

---

## Troubleshooting

### Nếu prisma db push lỗi
```bash
docker exec -i lifestyle_postgres_prod psql -U lifestyle_admin -d lifestyle_db <<'SQL'
CREATE SCHEMA IF NOT EXISTS insurance;
GRANT ALL ON SCHEMA insurance TO lifestyle_admin;
SQL
```
Rồi chạy lại Lệnh 10.

### Nếu main-api restart loop
```bash
docker logs lifestyle_main_api --tail 100
```
Xem lỗi cụ thể rồi báo lại.
