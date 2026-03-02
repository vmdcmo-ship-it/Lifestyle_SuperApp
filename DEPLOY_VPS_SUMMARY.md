# 🚀 VPS Deployment - Tổng Kết & Hướng Dẫn

## ✅ Đã Hoàn Thành

Tôi đã tạo đầy đủ infrastructure để deploy Lifestyle Super App lên VPS production với các tính năng:

### 1. Docker Configuration ✓
- ✅ `Dockerfile.backend` - Multi-stage build cho NestJS services
- ✅ `Dockerfile.web` - Optimized Next.js với standalone mode
- ✅ `docker-compose.production.yml` - Full stack với 11 services
- ✅ `.dockerignore` - Optimize build context

### 2. Nginx & SSL ✓
- ✅ `nginx.conf` - Reverse proxy với SSL, rate limiting, security headers
- ✅ Auto-setup SSL certificates (Let's Encrypt)
- ✅ Auto-renewal configuration

### 3. Environment & Security ✓
- ✅ `.env.production.template` - Đầy đủ environment variables
- ✅ Security best practices
- ✅ Secrets management guide

### 4. Deployment Scripts ✓
- ✅ `initial-setup.sh` - VPS setup tự động
- ✅ `deploy.sh` - Zero-downtime deployment
- ✅ `setup-ssl.sh` - SSL automation
- ✅ `logs.sh` - Log viewer
- ✅ `backup-db.sh` - Database backup
- ✅ `restore-db.sh` - Database restore

### 5. Documentation ✓
- ✅ `DEPLOYMENT.md` - Hướng dẫn chi tiết 600+ lines
- ✅ `QUICK_START.md` - Deploy trong 30 phút
- ✅ `infrastructure/README.md` - Infrastructure docs

---

## 📋 Checklist Trước Khi Deploy

### Bước 1: Chuẩn Bị Local
- [ ] Đã backup toàn bộ code
- [ ] Commit tất cả changes vào git
- [ ] Generate secure passwords và secrets

### Bước 2: Chuẩn Bị DNS
- [ ] Domain `vmd.asia` đã trỏ A record về `103.161.119.125`
- [ ] Subdomains `www`, `api`, `auth` đã cấu hình
- [ ] Verify: `dig vmd.asia +short` → `103.161.119.125`

### Bước 3: Chuẩn Bị VPS
- [ ] SSH access: `ssh root@103.161.119.125`
- [ ] VPS có ít nhất 4GB RAM, 2 CPU cores
- [ ] OS: Ubuntu 20.04/22.04 LTS

---

## 🎯 Deploy Nhanh (4 Bước Chính)

### BƯỚC 1: Upload Code Lên VPS

Từ máy Windows local của bạn, upload code:

```powershell
# Sử dụng WinSCP, FileZilla, hoặc rsync (nếu có WSL)
# Hoặc dùng Git (recommended)

# Option 1: Git (nếu có repository)
ssh root@103.161.119.125
cd /opt
git clone https://github.com/yourusername/lifestyle-superapp.git lifestyle-superapp

# Option 2: SCP/WinSCP
# Upload thư mục Lifestyle_SuperApp/ vào /opt/lifestyle-superapp/
```

### BƯỚC 2: Setup VPS (Chạy 1 Lần)

**Lưu ý:** Có 2 bước — (1) chạy trên **máy Windows** để SSH vào VPS; (2) các lệnh còn lại chạy **trên VPS** (sau khi đã đăng nhập). Không chạy `cd /opt/...`, `chmod`, `bash` trong PowerShell trên Windows.

**Trên máy Windows (PowerShell)** — kết nối vào VPS:

```powershell
ssh root@103.161.119.125
```

**Sau khi đã vào VPS** (thấy prompt dạng `root@...:~#`) — chạy lần lượt:

```bash
cd /opt/lifestyle-superapp

# Make scripts executable
chmod +x infrastructure/scripts/*.sh

# Run setup
bash infrastructure/scripts/initial-setup.sh

# Reboot (recommended)
reboot
```

**Thời gian:** ~15 phút

### BƯỚC 3: Configure Environment

**Trên Windows:** `ssh root@103.161.119.125` → sau khi vào VPS, chạy:

```bash
cd /opt/lifestyle-superapp

# Copy template
cp infrastructure/.env.production.template infrastructure/.env.production

# Edit file
nano infrastructure/.env.production
```

**Các giá trị PHẢI thay đổi:**

```bash
# Generate secrets (chạy trên local hoặc VPS)
openssl rand -hex 64    # JWT_SECRET
openssl rand -hex 64    # JWT_REFRESH_SECRET
openssl rand -base64 32 # DATABASE_PASSWORD
openssl rand -base64 32 # REDIS_PASSWORD
openssl rand -hex 32    # SESSION_SECRET
```

Paste vào file `.env.production` và thay thế các giá trị `<CHANGE_THIS>`.

### BƯỚC 4: Deploy

**Chạy trên VPS** (sau khi đã SSH vào và `cd /opt/lifestyle-superapp`):

```bash
# Setup SSL
bash infrastructure/scripts/setup-ssl.sh

# Deploy application (khuyến nghị - tự load .env.production)
bash infrastructure/scripts/deploy.sh

# Hoặc chạy docker-compose thủ công (bắt buộc dùng --env-file để tránh WARN biến trống):
docker compose --env-file infrastructure/.env.production \
  -f infrastructure/docker/docker-compose.production.yml up -d --build

# Check status
docker ps
curl https://vmd.asia
```

**Thời gian:** ~20 phút

---

## 🔧 Khắc phục lỗi build (đủ file + lockfile)

Các lỗi thường gặp và cách xử lý **cùng lúc**:

| Lỗi | Nguyên nhân | Cách xử lý |
|-----|-------------|------------|
| `Module not found: Can't resolve 'axios'` | apps/web thiếu axios hoặc build dùng cache cũ | Upload `apps/web/package.json` **và** `pnpm-lock.yaml` |
| `ERR_PNPM_OUTDATED_LOCKFILE ... 1 dependencies were added: axios` | Đã upload package.json có axios nhưng **chưa upload pnpm-lock.yaml** | Upload `pnpm-lock.yaml` vào thư mục gốc `/opt/lifestyle-superapp/` |
| `sh: nest: not found` / `sh: rimraf: not found` | Trên VPS vẫn dùng package.json cũ của main-api, user-service | Upload `services/main-api/package.json` và `services/user-service/package.json` |

### Bước 1: Upload từng file (Windows PowerShell) — mỗi ô copy một lệnh, chạy xong rồi copy lệnh tiếp

**Lệnh 1 — upload Dockerfile backend:**
```powershell
scp c:\Users\nguye\Lifestyle_SuperApp\infrastructure\docker\Dockerfile.backend root@103.161.119.125:/opt/lifestyle-superapp/infrastructure/docker/
```

**Lệnh 2 — upload package.json main-api:**
```powershell
scp c:\Users\nguye\Lifestyle_SuperApp\services\main-api\package.json root@103.161.119.125:/opt/lifestyle-superapp/services/main-api/
```

**Lệnh 3 — upload package.json user-service:**
```powershell
scp c:\Users\nguye\Lifestyle_SuperApp\services\user-service\package.json root@103.161.119.125:/opt/lifestyle-superapp/services/user-service/
```

**Lệnh 4 — upload package.json web (nếu cần sửa lỗi axios):**
```powershell
scp c:\Users\nguye\Lifestyle_SuperApp\apps\web\package.json root@103.161.119.125:/opt/lifestyle-superapp/apps/web/
```

**Lệnh 5 — upload pnpm-lock.yaml (nếu đã sửa web/axios):**
```powershell
scp c:\Users\nguye\Lifestyle_SuperApp\pnpm-lock.yaml root@103.161.119.125:/opt/lifestyle-superapp/
```

---

### Bước 2: Vào VPS (chỉ chạy khi cần chạy lệnh trên Linux)

**Lệnh 6 — kết nối SSH:**
```powershell
ssh root@103.161.119.125
```
Sau khi vào, prompt sẽ thành `root@azvps-1771342316:~#`. Các lệnh dưới chạy **sau khi đã thấy prompt đó**.

---

### Bước 3: Trên VPS — mỗi ô copy một lệnh, Enter rồi copy lệnh tiếp

**Lệnh 7 — vào thư mục project:**
```bash
cd /opt/lifestyle-superapp
```

**Lệnh 8 — build lại main-api và user-service:**
```bash
docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml build --no-cache main-api user-service
```

**Lệnh 9 — chạy toàn bộ stack:**
```bash
docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml up -d
```

**Lưu ý:** Mỗi lệnh copy vào terminal rồi Enter; không dán nhiều lệnh dính nhau. Không copy dòng chữ lỗi (ví dụ `target web: failed to solve...`) vào terminal.

---

## 🔍 Verify Deployment

### 1. Check Containers

```bash
docker ps
```

Expected output: 6 containers running (postgres, redis, main-api, user-service, web, nginx)

### 2. Check Logs

```bash
bash infrastructure/scripts/logs.sh
```

### 3. Test URLs

```bash
curl https://vmd.asia
curl https://api.vmd.asia/health
curl https://auth.vmd.asia/health
```

### 4. Open in Browser

- https://vmd.asia - Web app
- https://api.vmd.asia/health - API health
- https://auth.vmd.asia/health - Auth health

---

## 📊 Kiến Trúc Đã Deploy

```
Internet (HTTPS)
    ↓
┌─────────────────────────────────────────┐
│  VPS: 103.161.119.125 (vmd.asia)        │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Nginx (Ports 80, 443)             │ │
│  │  - SSL/TLS Termination             │ │
│  │  - Rate Limiting                   │ │
│  │  - Security Headers                │ │
│  └────────────────────────────────────┘ │
│             ↓         ↓         ↓        │
│  ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │ Web App  │ │ Main API │ │  User   │ │
│  │  :3001   │ │  :3000   │ │ Service │ │
│  │          │ │          │ │  :3002  │ │
│  └──────────┘ └──────────┘ └─────────┘ │
│         ↓             ↓          ↓       │
│  ┌────────────────────────────────────┐ │
│  │  PostgreSQL :5432                  │ │
│  │  Redis :6379                       │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Services Deployed

| Service | URL | Port | Status |
|---------|-----|------|--------|
| Web App | https://vmd.asia | 3001 | Core |
| Main API | https://api.vmd.asia | 3000 | Core |
| User Service | https://auth.vmd.asia | 3002 | Core |
| PostgreSQL | Internal | 5432 | Core |
| Redis | Internal | 6379 | Core |
| Nginx | Public | 80, 443 | Core |

### Optional Extended Services

Enable with `--profile extended`:
- Payment Service (:3003)
- Transportation Service (:3004)
- Notification Service (:3005)

---

## 🛠️ Quản Lý Hàng Ngày

### Xem Logs

```bash
# All services
bash infrastructure/scripts/logs.sh

# Specific service
bash infrastructure/scripts/logs.sh main-api
bash infrastructure/scripts/logs.sh web
```

### Update Application

```bash
cd /opt/lifestyle-superapp
git pull origin main
bash infrastructure/scripts/deploy.sh
```

### Restart Service

```bash
docker restart lifestyle_main_api
docker restart lifestyle_web
```

### Backup Database

```bash
bash infrastructure/scripts/backup-db.sh
```

### Check Status

```bash
docker ps
docker stats
htop
```

---

## 🆘 Troubleshooting

### Problem: Service không start

```bash
# Check logs
docker logs lifestyle_main_api

# Check environment
docker exec lifestyle_main_api env | grep DATABASE

# Restart
docker restart lifestyle_main_api
```

### Problem: SSL không hoạt động

```bash
# Check DNS
dig vmd.asia +short

# Retry SSL setup
bash infrastructure/scripts/setup-ssl.sh
```

### Problem: Database connection error

```bash
# Check PostgreSQL
docker ps | grep postgres
docker logs lifestyle_postgres_prod

# Check credentials in .env.production
cat infrastructure/.env.production | grep DATABASE
```

### Problem: Out of disk space

```bash
# Check disk usage
df -h
docker system df

# Clean up
docker system prune -a
```

---

## 📚 Documentation

Đã tạo các tài liệu sau:

1. **`infrastructure/QUICK_START.md`** - Deploy trong 30 phút
2. **`infrastructure/DEPLOYMENT.md`** - Hướng dẫn đầy đủ với troubleshooting
3. **`infrastructure/README.md`** - Infrastructure overview
4. **`DEPLOY_VPS_SUMMARY.md`** - File này (tổng kết)

---

## 🔐 Security Checklist

- [ ] `.env.production` không được commit vào git (đã thêm vào .gitignore)
- [ ] Đã thay đổi tất cả default passwords
- [ ] JWT secrets đủ mạnh (64+ characters)
- [ ] SSH key authentication (không dùng password)
- [ ] Firewall (UFW) đã enable
- [ ] SSL certificates đã setup
- [ ] Database và Redis chỉ accessible internally
- [ ] Regular backups đã setup

---

## 📞 Support & Next Steps

### (4) Build & (5) VPS khi app đã ổn định

Khi app (đặc biệt **app tài xế**) đã ổn định:

- **Build:** Hướng dẫn build development build (Expo prebuild + run:android/ios) và EAS Build (APK/IPA cho store) nằm trong **`docs/BUILD_AND_VPS_WHEN_READY.md`**.
- **VPS:** API đã sẵn sàng tại `https://api.vmd.asia`. App driver đã trỏ production API; chỉ cần đảm bảo VPS chạy đúng, health check và backup DB trước khi release.
- **Checklist:** Trước release: test đăng nhập/dashboard/đơn/ví trên production, tăng version trong `app.json`, build preview hoặc production qua EAS (hoặc local), rồi phân phối nội bộ hoặc submit store.

Chi tiết đầy đủ: **[docs/BUILD_AND_VPS_WHEN_READY.md](docs/BUILD_AND_VPS_WHEN_READY.md)**.

---

### Sau Khi Deploy Thành Công

1. **Setup Monitoring**
   - Sentry for error tracking
   - Uptime monitoring
   - Performance monitoring

2. **Setup Automated Backups**
   ```bash
   # Add to crontab
   crontab -e
   # Add: 0 2 * * * /opt/lifestyle-superapp/infrastructure/scripts/backup-db.sh
   ```

3. **Configure CI/CD** (Optional)
   - GitHub Actions
   - Auto-deploy on push to main

4. **Performance Tuning**
   - Database optimization
   - Redis caching strategy
   - CDN for static assets

### Contact

- **Documentation Issues**: Check `infrastructure/DEPLOYMENT.md`
- **Technical Support**: devops@vmd.asia
- **Emergency**: Review rollback procedures in DEPLOYMENT.md

---

## ✨ Tổng Kết

Bạn đã có:
- ✅ Full Docker setup với best practices
- ✅ Production-ready Nginx configuration
- ✅ Automated SSL management
- ✅ Zero-downtime deployment scripts
- ✅ Database backup/restore scripts
- ✅ Comprehensive documentation
- ✅ Security hardening
- ✅ Monitoring & logging tools

**Thời gian deploy lần đầu:** ~30-45 phút  
**Thời gian deploy updates sau này:** ~5-10 phút

**Good luck với deployment! 🚀**

---

**Tạo bởi:** AI Assistant  
**Ngày:** 2026-02-18  
**Version:** 1.0.0
