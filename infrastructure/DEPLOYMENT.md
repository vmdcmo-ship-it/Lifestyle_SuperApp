# Hướng Dẫn Deploy VPS - Lifestyle Super App

## Tổng Quan

Tài liệu này hướng dẫn chi tiết cách deploy toàn bộ Lifestyle Super App lên VPS production sử dụng Docker Compose, Nginx reverse proxy và SSL certificates.

## Thông Tin VPS

- **Hostname**: azvps-1771342316
- **IP**: 103.161.119.125
- **Domain**: vmd.asia
- **OS**: Ubuntu 20.04/22.04 LTS (recommended)
- **Minimum Requirements**:
  - RAM: 4GB (8GB recommended)
  - CPU: 2 cores (4 cores recommended)
  - Storage: 50GB SSD
  - Network: 100Mbps

## Kiến Trúc Deployment

```
Internet
    │
    ├─ vmd.asia (HTTPS) ────────────> Next.js Web App (Port 3001)
    │
    ├─ api.vmd.asia (HTTPS) ────────> Main API Service (Port 3000)
    │
    └─ auth.vmd.asia (HTTPS) ───────> User Service (Port 3002)
         │
         ├─> PostgreSQL (Port 5432) - Internal only
         └─> Redis (Port 6379) - Internal only
```

## Checklist Trước Khi Deploy

### 1. DNS Configuration

Đảm bảo các A records đã được trỏ về IP VPS:

```
Type    Name          Value              TTL
A       vmd.asia      103.161.119.125    3600
A       www           103.161.119.125    3600
A       api           103.161.119.125    3600
A       auth          103.161.119.125    3600
```

Kiểm tra DNS đã propagate:
```bash
dig vmd.asia +short
dig api.vmd.asia +short
dig auth.vmd.asia +short
```

### 2. SSH Access

Tạo SSH key (nếu chưa có):
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Copy SSH key lên VPS:
```bash
ssh-copy-id root@103.161.119.125
```

Hoặc thêm manual:
```bash
ssh root@103.161.119.125
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# Paste your public key here
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### 3. Backup Code

Backup toàn bộ dự án:
```bash
# Compress project
tar -czf lifestyle-backup-$(date +%Y%m%d).tar.gz Lifestyle_SuperApp/

# Or use git
git add .
git commit -m "Pre-deployment backup"
git push
```

### 4. Generate Secrets

Generate các secrets cần thiết:

```bash
# JWT Secret (64 characters)
openssl rand -hex 64

# JWT Refresh Secret
openssl rand -hex 64

# Database Password
openssl rand -base64 32

# Redis Password
openssl rand -base64 32

# Session Secret
openssl rand -hex 32

# Encryption Key (32 characters for AES-256)
openssl rand -hex 16
```

Lưu tất cả secrets vào file an toàn!

---

## Bước Deploy Chi Tiết

### BƯỚC 1: Setup VPS Lần Đầu

SSH vào VPS:
```bash
ssh root@103.161.119.125
```

Upload code lên VPS (từ máy local):
```bash
# Option 1: Using rsync (recommended)
rsync -avz --exclude 'node_modules' --exclude '.git' \
  Lifestyle_SuperApp/ root@103.161.119.125:/opt/lifestyle-superapp/

# Option 2: Using scp
scp -r Lifestyle_SuperApp root@103.161.119.125:/opt/

# Option 3: Using git (if repository is accessible from VPS)
ssh root@103.161.119.125
cd /opt
git clone https://github.com/yourusername/lifestyle-superapp.git
cd lifestyle-superapp
```

Chạy script setup:
```bash
cd /opt/lifestyle-superapp
chmod +x infrastructure/scripts/*.sh
bash infrastructure/scripts/initial-setup.sh
```

Script này sẽ:
- Update system packages
- Cài đặt Docker & Docker Compose
- Cài đặt Node.js 20 & pnpm
- Cài đặt Nginx & Certbot
- Cấu hình firewall (UFW)
- Tạo swap space (2GB)
- Tối ưu hóa hệ thống
- Tạo user `deployer`

**Thời gian ước tính: 10-15 phút**

Sau khi hoàn tất, khuyến nghị reboot:
```bash
reboot
```

### BƯỚC 2: Cấu Hình Environment Variables

Copy template và chỉnh sửa:
```bash
cd /opt/lifestyle-superapp
cp infrastructure/.env.production.template infrastructure/.env.production
nano infrastructure/.env.production
```

**Các biến quan trọng PHẢI thay đổi:**

```bash
# Database
DATABASE_PASSWORD=<YOUR_STRONG_PASSWORD>

# Redis
REDIS_PASSWORD=<YOUR_REDIS_PASSWORD>

# JWT
JWT_SECRET=<YOUR_JWT_SECRET_64_CHARS>
JWT_REFRESH_SECRET=<YOUR_REFRESH_SECRET_64_CHARS>

# Encryption
ENCRYPTION_KEY=<YOUR_ENCRYPTION_KEY_32_CHARS>

# Email (nếu dùng)
SMTP_USER=<your_email@gmail.com>
SMTP_PASSWORD=<your_app_password>

# API Keys (nếu có)
GOOGLE_MAPS_API_KEY=<your_google_maps_key>
PAYMENT_GATEWAY_API_KEY=<your_payment_key>
```

Kiểm tra file:
```bash
cat infrastructure/.env.production | grep -v '^#' | grep '<CHANGE'
```

Không được còn dòng nào có `<CHANGE_THIS>`!

**Bảo mật file:**
```bash
chmod 600 infrastructure/.env.production
```

### BƯỚC 3: Setup SSL Certificates

Chạy script SSL:
```bash
bash infrastructure/scripts/setup-ssl.sh
```

Script này sẽ:
- Verify DNS records
- Obtain SSL certificates từ Let's Encrypt
- Setup auto-renewal (chạy 2 lần/ngày)
- Copy certificates vào đúng vị trí

**Lưu ý:** 
- Đảm bảo ports 80, 443 đã mở
- DNS phải đã propagate đầy đủ
- Email admin sẽ nhận thông báo renewal

Kiểm tra certificates:
```bash
ls -la /opt/lifestyle-superapp/ssl/
openssl x509 -in /opt/lifestyle-superapp/ssl/fullchain.pem -text -noout | grep -A 2 "Validity"
```

**Thời gian ước tính: 5-10 phút**

### BƯỚC 4: Deploy Application

Install dependencies và build:
```bash
cd /opt/lifestyle-superapp

# Install dependencies
pnpm install --frozen-lockfile

# Build shared packages
pnpm build
```

Deploy services:
```bash
# Deploy core services only (main-api, user-service, web)
bash infrastructure/scripts/deploy.sh

# Hoặc deploy với extended services
bash infrastructure/scripts/deploy.sh --profile extended
```

Script deployment sẽ:
1. Backup current state (DB, configs)
2. Pull latest code (if git)
3. Build Docker images
4. Deploy services với zero-downtime
5. Run database migrations
6. Perform health checks
7. Cleanup old images

**Thời gian ước tính: 15-30 phút** (tùy tốc độ mạng và VPS)

### BƯỚC 5: Verify Deployment

Kiểm tra containers đang chạy:
```bash
docker ps
```

Expected output:
```
CONTAINER ID   IMAGE                    STATUS         PORTS
xxxxxxxxxx     lifestyle_web            Up 2 minutes   3001
xxxxxxxxxx     lifestyle_main_api       Up 2 minutes   3000
xxxxxxxxxx     lifestyle_user_service   Up 2 minutes   3002
xxxxxxxxxx     lifestyle_postgres_prod  Up 2 minutes   5432
xxxxxxxxxx     lifestyle_redis_prod     Up 2 minutes   6379
xxxxxxxxxx     lifestyle_nginx          Up 2 minutes   80, 443
```

Kiểm tra logs:
```bash
# All services
docker compose -f infrastructure/docker/docker-compose.production.yml logs -f

# Specific service
docker logs lifestyle_main_api -f
docker logs lifestyle_web -f
```

Kiểm tra health endpoints:
```bash
# From VPS
curl -I http://localhost:3000/health
curl -I http://localhost:3001

# From outside (with SSL)
curl -I https://api.vmd.asia/health
curl -I https://vmd.asia
```

Test website:
```bash
# Open in browser
https://vmd.asia
https://api.vmd.asia/health
https://auth.vmd.asia/health
```

---

## Quản Lý Sau Deploy

### Xem Logs

```bash
# Real-time logs
docker compose -f infrastructure/docker/docker-compose.production.yml logs -f

# Last 100 lines
docker compose -f infrastructure/docker/docker-compose.production.yml logs --tail=100

# Specific service
docker logs lifestyle_main_api -f --tail=50
```

### Restart Services

```bash
# Restart specific service
docker restart lifestyle_main_api

# Restart all services
docker compose -f infrastructure/docker/docker-compose.production.yml restart
```

### Stop/Start Services

```bash
# Stop all
docker compose -f infrastructure/docker/docker-compose.production.yml down

# Start all
docker compose -f infrastructure/docker/docker-compose.production.yml up -d

# Start with extended services
docker compose -f infrastructure/docker/docker-compose.production.yml --profile extended up -d
```

### Update Application

Khi có code mới:
```bash
# Pull latest code
cd /opt/lifestyle-superapp
git pull origin main

# Deploy updates
bash infrastructure/scripts/deploy.sh
```

### Database Backup

Manual backup:
```bash
# Backup database
docker exec lifestyle_postgres_prod pg_dump -U lifestyle_admin lifestyle_db > backup_$(date +%Y%m%d).sql

# Restore database
docker exec -i lifestyle_postgres_prod psql -U lifestyle_admin lifestyle_db < backup_20260218.sql
```

Auto backup (setup cron):
```bash
# Add to crontab
crontab -e

# Add this line (backup daily at 2 AM)
0 2 * * * docker exec lifestyle_postgres_prod pg_dump -U lifestyle_admin lifestyle_db > /opt/lifestyle-superapp/backups/db_$(date +\%Y\%m\%d).sql
```

### Rollback Deployment

Nếu có vấn đề sau deploy:
```bash
bash infrastructure/scripts/deploy.sh --rollback
```

### Monitor Resources

```bash
# Container stats
docker stats

# System resources
htop

# Disk usage
df -h
docker system df
```

---

## Troubleshooting

### 1. SSL Certificate Issues

**Problem:** Certificate not obtained
```bash
# Check DNS
dig vmd.asia +short

# Check port 80 is open
netstat -tlnp | grep :80

# Retry SSL setup
bash infrastructure/scripts/setup-ssl.sh
```

**Problem:** Certificate expired
```bash
# Force renewal
certbot renew --force-renewal
bash /opt/lifestyle-superapp/scripts/renew-certs.sh
```

### 2. Service Not Starting

```bash
# Check logs
docker logs lifestyle_main_api

# Check environment variables
docker exec lifestyle_main_api env

# Restart service
docker restart lifestyle_main_api
```

### 3. Database Connection Issues

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check connection from app
docker exec lifestyle_main_api pg_isready -h postgres -U lifestyle_admin

# Check credentials
docker exec -it lifestyle_postgres_prod psql -U lifestyle_admin lifestyle_db
```

### 4. Out of Memory

```bash
# Check memory
free -h

# Check swap
swapon --show

# Restart services with memory limits
docker compose -f infrastructure/docker/docker-compose.production.yml restart
```

### 5. Port Already in Use

```bash
# Find process using port
netstat -tlnp | grep :80
lsof -i :80

# Kill process
kill -9 <PID>
```

### 6. Docker Build Fails

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker compose -f infrastructure/docker/docker-compose.production.yml build --no-cache
```

---

## Security Best Practices

### 1. SSH Hardening

```bash
# Edit SSH config
nano /etc/ssh/sshd_config

# Recommended settings:
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
Port 2222  # Change default port

# Restart SSH
systemctl restart sshd
```

### 2. Firewall Rules

```bash
# Check current rules
ufw status verbose

# Only allow necessary ports
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
```

### 3. Regular Updates

```bash
# Update system monthly
apt-get update && apt-get upgrade -y

# Update Docker images
docker compose -f infrastructure/docker/docker-compose.production.yml pull
bash infrastructure/scripts/deploy.sh
```

### 4. Secrets Management

- Không commit `.env.production` vào git
- Backup secrets file an toàn (encrypted)
- Rotate secrets định kỳ (3-6 tháng)
- Use Docker secrets cho production scale-up

---

## Performance Optimization

### 1. Database Tuning

```bash
# Edit PostgreSQL config
docker exec -it lifestyle_postgres_prod bash
nano /var/lib/postgresql/data/postgresql.conf

# Recommended settings:
max_connections = 200
shared_buffers = 1GB
effective_cache_size = 3GB
maintenance_work_mem = 256MB
```

### 2. Redis Optimization

```bash
# Check Redis info
docker exec lifestyle_redis_prod redis-cli -a <password> info

# Monitor commands
docker exec lifestyle_redis_prod redis-cli -a <password> monitor
```

### 3. Nginx Caching

Already configured in `nginx.conf` for static assets.

### 4. Log Rotation

```bash
# Check log rotation
cat /etc/logrotate.d/lifestyle-superapp

# Force rotation
logrotate -f /etc/logrotate.d/lifestyle-superapp
```

---

## Monitoring & Alerts

### Basic Monitoring

```bash
# Install monitoring tools (already done in initial-setup.sh)
htop           # CPU & Memory
iotop          # Disk I/O
nethogs        # Network
```

### Health Checks

Setup cron to check health:
```bash
crontab -e

# Add health check every 5 minutes
*/5 * * * * curl -f https://api.vmd.asia/health || echo "API DOWN!" | mail -s "Alert: API Down" admin@vmd.asia
```

### Advanced Monitoring (Optional)

Consider installing:
- Prometheus + Grafana
- Datadog agent
- Sentry for error tracking
- Uptime Robot for external monitoring

---

## Scaling Guidelines

### Vertical Scaling (Upgrade VPS)

1. Take full backup
2. Create snapshot of current VPS
3. Upgrade VPS plan
4. Restart services

### Horizontal Scaling (Multiple Instances)

When traffic increases, consider:

1. **Load Balancer**: Setup Nginx load balancer
2. **Database**: Move to managed PostgreSQL (RDS, Azure Database)
3. **Redis**: Use Redis Cluster
4. **Container Orchestration**: Migrate to Kubernetes

---

## Maintenance Schedule

### Daily
- [x] Check service status
- [x] Review error logs
- [x] Monitor disk space

### Weekly
- [x] Review access logs
- [x] Check SSL certificate validity
- [x] Database backup verification

### Monthly
- [x] System updates (`apt-get upgrade`)
- [x] Docker image updates
- [x] Security audit
- [x] Performance review

### Quarterly
- [x] Rotate secrets (JWT, passwords)
- [x] Update dependencies
- [x] Disaster recovery drill

---

## Support & Resources

### Useful Commands Reference

```bash
# Docker
docker ps                              # List containers
docker logs <container> -f             # Follow logs
docker exec -it <container> bash       # Shell into container
docker system df                       # Disk usage
docker system prune -a                 # Clean everything

# Nginx
docker logs lifestyle_nginx           # Nginx logs
docker exec lifestyle_nginx nginx -t  # Test config

# Database
docker exec -it lifestyle_postgres_prod psql -U lifestyle_admin lifestyle_db

# Application
bash infrastructure/scripts/deploy.sh           # Deploy
bash infrastructure/scripts/deploy.sh --rollback # Rollback
```

### Contact

- **DevOps Team**: devops@vmd.asia
- **On-Call**: +84-xxx-xxx-xxxx
- **Documentation**: https://docs.vmd.asia

---

## Appendix

### A. Environment Variables Reference

See `infrastructure/.env.production.template` for complete list.

### B. Port Mapping

| Service | Internal Port | External Access |
|---------|--------------|-----------------|
| Web App | 3001 | https://vmd.asia |
| Main API | 3000 | https://api.vmd.asia |
| User Service | 3002 | https://auth.vmd.asia |
| PostgreSQL | 5432 | Internal only |
| Redis | 6379 | Internal only |
| Nginx | 80, 443 | Public |

### C. Service Dependencies

```
web -> main-api -> postgres, redis
user-service -> postgres, redis
payment-service -> postgres, redis
```

---

**Document Version**: 1.0.0  
**Last Updated**: 2026-02-18  
**Author**: DevOps Team  
**Review Date**: 2026-03-18
