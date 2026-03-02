# Quick Start Guide - Deploy VPS trong 30 Phút

## TL;DR - Các Lệnh Chính

```bash
# 1. SSH vào VPS
ssh root@103.161.119.125

# 2. Upload code (từ máy local)
rsync -avz --exclude 'node_modules' Lifestyle_SuperApp/ root@103.161.119.125:/opt/lifestyle-superapp/

# 3. Setup VPS (chỉ chạy 1 lần)
cd /opt/lifestyle-superapp
bash infrastructure/scripts/initial-setup.sh

# 4. Configure environment
cp infrastructure/.env.production.template infrastructure/.env.production
nano infrastructure/.env.production
# Thay đổi tất cả giá trị <CHANGE_THIS>

# 5. Setup SSL
bash infrastructure/scripts/setup-ssl.sh

# 6. Deploy
bash infrastructure/scripts/deploy.sh

# 7. Kiểm tra
curl https://vmd.asia
```

## Checklist Nhanh

### Trước Khi Bắt Đầu (5 phút)

- [ ] Domain `vmd.asia` đã trỏ A record về `103.161.119.125`
- [ ] Kiểm tra DNS: `dig vmd.asia +short` = 103.161.119.125
- [ ] Có SSH access vào VPS
- [ ] Đã generate các secrets (JWT, passwords)

### Deploy Lần Đầu (25 phút)

1. **Setup VPS** (10 phút)
```bash
ssh root@103.161.119.125
cd /opt/lifestyle-superapp
bash infrastructure/scripts/initial-setup.sh
reboot
```

2. **Cấu hình Environment** (5 phút)
```bash
ssh root@103.161.119.125
cd /opt/lifestyle-superapp
cp infrastructure/.env.production.template infrastructure/.env.production
nano infrastructure/.env.production
```

Thay đổi các giá trị quan trọng:
- `DATABASE_PASSWORD`
- `REDIS_PASSWORD`
- `JWT_SECRET` (64 chars)
- `JWT_REFRESH_SECRET` (64 chars)

3. **Setup SSL** (5 phút)
```bash
bash infrastructure/scripts/setup-ssl.sh
```

4. **Deploy Application** (5 phút)
```bash
bash infrastructure/scripts/deploy.sh
```

### Verify (2 phút)

```bash
# Check containers
docker ps

# Check logs
docker logs lifestyle_web -f

# Test URLs
curl https://vmd.asia
curl https://api.vmd.asia/health
```

## Generate Secrets Nhanh

```bash
# JWT Secret
echo "JWT_SECRET=$(openssl rand -hex 64)"

# JWT Refresh Secret
echo "JWT_REFRESH_SECRET=$(openssl rand -hex 64)"

# Database Password
echo "DATABASE_PASSWORD=$(openssl rand -base64 32)"

# Redis Password
echo "REDIS_PASSWORD=$(openssl rand -base64 32)"

# Session Secret
echo "SESSION_SECRET=$(openssl rand -hex 32)"
```

## Các Lệnh Thường Dùng

### Xem Logs
```bash
# All services
docker compose -f infrastructure/docker/docker-compose.production.yml logs -f

# Specific service
docker logs lifestyle_main_api -f
```

### Restart Service
```bash
docker restart lifestyle_main_api
```

### Update Code
```bash
cd /opt/lifestyle-superapp
git pull
bash infrastructure/scripts/deploy.sh
```

### Rollback
```bash
bash infrastructure/scripts/deploy.sh --rollback
```

## Troubleshooting Nhanh

### SSL không hoạt động
```bash
# Check DNS
dig vmd.asia +short

# Retry SSL
bash infrastructure/scripts/setup-ssl.sh
```

### Service không start
```bash
# Check logs
docker logs lifestyle_main_api

# Restart
docker restart lifestyle_main_api
```

### Database connection error
```bash
# Check PostgreSQL
docker ps | grep postgres

# Check credentials
docker exec -it lifestyle_postgres_prod psql -U lifestyle_admin lifestyle_db
```

## Support

Xem hướng dẫn chi tiết: `infrastructure/DEPLOYMENT.md`

Liên hệ: devops@vmd.asia
