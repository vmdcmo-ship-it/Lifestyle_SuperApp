# Deploy Web App lên VPS

## Yêu cầu
- VPS đã chạy: postgres, redis, main-api, user-service, nginx
- SSH access: `ssh root@103.161.119.125`

---

## Bước 1: Upload code (chạy trên Windows PowerShell)

**Cách nhanh nhất - upload toàn bộ bằng `scp -r`:**

```powershell
scp -r c:\Users\nguye\Lifestyle_SuperApp\apps\web\lib root@103.161.119.125:/opt/lifestyle-superapp/apps/web/
```

```powershell
scp -r c:\Users\nguye\Lifestyle_SuperApp\apps\web\app\login root@103.161.119.125:/opt/lifestyle-superapp/apps/web/app/
```

```powershell
scp c:\Users\nguye\Lifestyle_SuperApp\apps\web\app\providers.tsx root@103.161.119.125:/opt/lifestyle-superapp/apps/web/app/
```

```powershell
scp c:\Users\nguye\Lifestyle_SuperApp\apps\web\app\layout.tsx root@103.161.119.125:/opt/lifestyle-superapp/apps/web/app/
```

```powershell
scp c:\Users\nguye\Lifestyle_SuperApp\apps\web\next.config.js root@103.161.119.125:/opt/lifestyle-superapp/apps/web/
```

```powershell
scp c:\Users\nguye\Lifestyle_SuperApp\apps\web\package.json root@103.161.119.125:/opt/lifestyle-superapp/apps/web/
```

```powershell
scp c:\Users\nguye\Lifestyle_SuperApp\infrastructure\docker\Dockerfile.web root@103.161.119.125:/opt/lifestyle-superapp/infrastructure/docker/
```

```powershell
scp c:\Users\nguye\Lifestyle_SuperApp\infrastructure\docker\docker-compose.production.yml root@103.161.119.125:/opt/lifestyle-superapp/infrastructure/docker/
```

```powershell
scp c:\Users\nguye\Lifestyle_SuperApp\infrastructure\nginx\nginx.conf root@103.161.119.125:/opt/lifestyle-superapp/infrastructure/nginx/
```

```powershell
scp c:\Users\nguye\Lifestyle_SuperApp\packages\types\src\backend-api.ts root@103.161.119.125:/opt/lifestyle-superapp/packages/types/src/
```

```powershell
scp c:\Users\nguye\Lifestyle_SuperApp\packages\types\src\index.ts root@103.161.119.125:/opt/lifestyle-superapp/packages/types/src/
```

```powershell
scp c:\Users\nguye\Lifestyle_SuperApp\pnpm-lock.yaml root@103.161.119.125:/opt/lifestyle-superapp/
```

---

## Bước 2: SSH vào VPS

```powershell
ssh root@103.161.119.125
```

---

## Bước 3: Build web container (chạy trên VPS)

```bash
cd /opt/lifestyle-superapp
```

```bash
docker compose -f infrastructure/docker/docker-compose.production.yml \
  --env-file infrastructure/.env.production \
  build web --no-cache
```

> Build mất khoảng 3-5 phút. Các services khác (main-api, postgres, redis) vẫn chạy bình thường.

---

## Bước 4: Khởi động web container

```bash
docker compose -f infrastructure/docker/docker-compose.production.yml \
  --env-file infrastructure/.env.production \
  up -d web
```

---

## Bước 5: Restart nginx

```bash
docker compose -f infrastructure/docker/docker-compose.production.yml \
  --env-file infrastructure/.env.production \
  restart nginx
```

---

## Bước 6: Kiểm tra

```bash
# Xem tất cả containers
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

# Xem logs web app
docker logs lifestyle_web --tail 30

# Test health check
curl -s http://localhost:3001 | head -20
```

**Kết quả mong đợi:**
- Container `lifestyle_web` status: `Up ... (healthy)`
- `curl http://localhost:3001` trả về HTML của trang chủ

---

## Bước 7: Verify trên trình duyệt

Mở các URL sau:

| URL | Mong đợi |
|-----|----------|
| https://vmd.asia | Trang chủ Lifestyle Super App |
| https://vmd.asia/login | Trang đăng nhập (kết nối API thật) |
| https://vmd.asia/food-delivery | Trang đặt đồ ăn |
| https://vmd.asia/wallet | Trang ví |
| https://api.vmd.asia/api/v1/docs | Swagger API docs (đã chạy từ trước) |

---

## Troubleshooting

### Web container không build được

```bash
# Xem build log chi tiết
docker compose -f infrastructure/docker/docker-compose.production.yml \
  --env-file infrastructure/.env.production \
  build web --no-cache --progress=plain 2>&1 | tail -50
```

### Web container crash/restart

```bash
# Xem full logs
docker logs lifestyle_web --tail 100

# Kiểm tra memory
docker stats --no-stream
```

### Trang trắng hoặc 502

```bash
# Kiểm tra web container có đang chạy không
docker ps -a | grep web

# Restart toàn bộ
docker compose -f infrastructure/docker/docker-compose.production.yml \
  --env-file infrastructure/.env.production \
  up -d --force-recreate web nginx
```

### CORS error khi gọi API

Web app đã config `NEXT_PUBLIC_API_URL=https://api.vmd.asia`.
Backend đã config `CORS_ORIGIN: https://vmd.asia,https://www.vmd.asia`.
Nginx đã thêm CORS headers cho `api.vmd.asia`.

---

## Kiến trúc sau khi deploy

```
                Internet
                   │
         ┌─────────┴─────────┐
         │    Nginx (:80/443) │
         └──┬──────┬──────┬───┘
            │      │      │
     ┌──────┘      │      └──────┐
     ▼             ▼             ▼
 ┌────────┐  ┌──────────┐  ┌──────────┐
 │  Web   │  │ Main API │  │  User    │
 │ :3001  │  │  :3000   │  │ Service  │
 │(Next.js│  │ (NestJS) │  │  :3002   │
 └────────┘  └─────┬────┘  └────┬─────┘
                   │             │
              ┌────┴─────────────┴────┐
              │  PostgreSQL  │  Redis │
              │    :5432     │  :6379 │
              └──────────────────────┘
```

**Domains:**
- `https://vmd.asia` → Web App (Next.js)
- `https://api.vmd.asia` → Main API (100+ endpoints)
- `https://auth.vmd.asia` → User Service
