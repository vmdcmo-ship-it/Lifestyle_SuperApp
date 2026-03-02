# Infrastructure Documentation

Thư mục này chứa tất cả các files cấu hình và scripts để deploy Lifestyle Super App lên production.

## Cấu Trúc

```
infrastructure/
├── docker/                          # Docker configurations
│   ├── Dockerfile.backend          # Dockerfile cho NestJS services
│   ├── Dockerfile.web              # Dockerfile cho Next.js app
│   ├── docker-compose.production.yml # Docker Compose cho production
│   └── postgres/                   # PostgreSQL init scripts
│
├── nginx/                          # Nginx configurations
│   └── nginx.conf                  # Nginx reverse proxy config
│
├── scripts/                        # Deployment scripts
│   ├── initial-setup.sh           # VPS setup lần đầu
│   ├── deploy.sh                  # Deploy application
│   ├── setup-ssl.sh               # Setup SSL certificates
│   ├── logs.sh                    # View logs
│   ├── backup-db.sh               # Backup database
│   └── restore-db.sh              # Restore database
│
├── .env.production.template        # Environment template
├── DEPLOYMENT.md                   # Hướng dẫn deploy chi tiết
├── QUICK_START.md                  # Hướng dẫn nhanh
└── README.md                       # File này
```

## Quick Start

### 1. Lần Đầu Deploy (30 phút)

```bash
# Xem hướng dẫn nhanh
cat infrastructure/QUICK_START.md

# Hoặc xem chi tiết đầy đủ
cat infrastructure/DEPLOYMENT.md
```

### 2. Deploy Updates

```bash
bash infrastructure/scripts/deploy.sh
```

### 3. Xem Logs

```bash
bash infrastructure/scripts/logs.sh [service-name]
```

### 4. Backup Database

```bash
bash infrastructure/scripts/backup-db.sh
```

## Scripts Chi Tiết

### initial-setup.sh
Cài đặt và cấu hình VPS lần đầu tiên. Chỉ chạy một lần.

**Chức năng:**
- Cài Docker, Docker Compose, Node.js
- Setup firewall (UFW)
- Tạo swap space
- Tối ưu hóa system
- Tạo deployment user

**Usage:**
```bash
sudo bash infrastructure/scripts/initial-setup.sh
```

### deploy.sh
Deploy hoặc update application với zero-downtime.

**Chức năng:**
- Backup current state
- Build Docker images
- Deploy services
- Run migrations
- Health checks
- Auto-rollback nếu thất bại

**Usage:**
```bash
# Deploy core services
bash infrastructure/scripts/deploy.sh

# Deploy với extended services
bash infrastructure/scripts/deploy.sh --profile extended

# Rollback
bash infrastructure/scripts/deploy.sh --rollback
```

### setup-ssl.sh
Obtain và cấu hình SSL certificates từ Let's Encrypt.

**Chức năng:**
- Verify DNS records
- Obtain SSL certificates
- Setup auto-renewal
- Configure Nginx

**Usage:**
```bash
sudo bash infrastructure/scripts/setup-ssl.sh
```

### logs.sh
Xem logs của các services.

**Usage:**
```bash
# All services
bash infrastructure/scripts/logs.sh

# Specific service
bash infrastructure/scripts/logs.sh web
bash infrastructure/scripts/logs.sh main-api

# Options
bash infrastructure/scripts/logs.sh web --tail 100
```

### backup-db.sh
Backup PostgreSQL database.

**Chức năng:**
- Tạo backup với timestamp
- Compress backup
- Cleanup old backups (30 days retention)

**Usage:**
```bash
bash infrastructure/scripts/backup-db.sh
```

**Cron job (auto backup daily):**
```bash
# Add to crontab
0 2 * * * /opt/lifestyle-superapp/infrastructure/scripts/backup-db.sh
```

### restore-db.sh
Restore database từ backup.

**Usage:**
```bash
bash infrastructure/scripts/restore-db.sh /path/to/backup.sql.gz
```

## Environment Variables

### Template File
`infrastructure/.env.production.template` - Copy và rename thành `.env.production`

### Các Biến Quan Trọng

**Database:**
```bash
DATABASE_PASSWORD=<strong-password>
```

**Redis:**
```bash
REDIS_PASSWORD=<strong-password>
```

**JWT:**
```bash
JWT_SECRET=<64-character-hex-string>
JWT_REFRESH_SECRET=<64-character-hex-string>
```

**Generate Secrets:**
```bash
openssl rand -hex 64    # JWT secrets
openssl rand -base64 32 # Passwords
```

## Docker Services

### Core Services (Always Running)

- `postgres` - PostgreSQL database
- `redis` - Cache & session store
- `main-api` - Main API service (port 3000)
- `user-service` - Authentication service (port 3002)
- `web` - Next.js web app (port 3001)
- `nginx` - Reverse proxy (ports 80, 443)

### Extended Services (Optional)

Start với `--profile extended`:
- `payment-service`
- `transportation-service`
- `notification-service`

## Ports

| Service | Internal | External |
|---------|----------|----------|
| Web | 3001 | https://vmd.asia |
| Main API | 3000 | https://api.vmd.asia |
| User Service | 3002 | https://auth.vmd.asia |
| PostgreSQL | 5432 | Internal only |
| Redis | 6379 | Internal only |
| Nginx | 80, 443 | Public |

## Common Tasks

### Update Application
```bash
cd /opt/lifestyle-superapp
git pull
bash infrastructure/scripts/deploy.sh
```

### Restart Service
```bash
docker restart lifestyle_main_api
```

### View Service Status
```bash
docker ps
docker stats
```

### Check Logs
```bash
docker logs lifestyle_main_api -f
```

### Database Access
```bash
docker exec -it lifestyle_postgres_prod psql -U lifestyle_admin lifestyle_db
```

### Redis Access
```bash
docker exec -it lifestyle_redis_prod redis-cli -a <password>
```

## Troubleshooting

### Service Won't Start
```bash
# Check logs
docker logs <container-name>

# Check environment
docker exec <container-name> env

# Restart
docker restart <container-name>
```

### Database Issues
```bash
# Check PostgreSQL
docker ps | grep postgres

# Check connection
docker exec lifestyle_main_api nc -zv postgres 5432
```

### SSL Issues
```bash
# Check certificates
openssl x509 -in /opt/lifestyle-superapp/ssl/fullchain.pem -text -noout

# Renew certificates
bash infrastructure/scripts/setup-ssl.sh
```

### Out of Disk Space
```bash
# Check disk usage
df -h
docker system df

# Clean up
docker system prune -a
```

## Security Checklist

- [ ] `.env.production` không được commit vào git
- [ ] Đã đổi tất cả default passwords
- [ ] SSH chỉ dùng key authentication
- [ ] Firewall (UFW) đã enable
- [ ] SSL certificates đã setup
- [ ] Database chỉ accessible internally
- [ ] Redis có password
- [ ] Regular backups đã setup

## Monitoring

### Health Checks
```bash
curl https://api.vmd.asia/health
curl https://auth.vmd.asia/health
curl https://vmd.asia
```

### Resource Monitoring
```bash
htop              # CPU & Memory
docker stats      # Container stats
iotop            # Disk I/O
nethogs          # Network
```

## Backup Strategy

### Automated Backups
- Database: Daily at 2 AM (cron)
- Retention: 30 days
- Location: `/opt/lifestyle-superapp/backups/`

### Manual Backup
```bash
bash infrastructure/scripts/backup-db.sh
```

### Restore
```bash
bash infrastructure/scripts/restore-db.sh <backup-file>
```

## Scaling

### Vertical Scaling
Upgrade VPS resources (RAM, CPU) khi cần.

### Horizontal Scaling
Khi traffic tăng cao:
1. Setup load balancer
2. Migrate to Kubernetes
3. Use managed databases
4. Redis Cluster

## Support

- **Documentation**: `infrastructure/DEPLOYMENT.md`
- **Quick Start**: `infrastructure/QUICK_START.md`
- **Email**: devops@vmd.asia
- **On-Call**: +84-xxx-xxx-xxxx

## Version History

- **1.0.0** (2026-02-18) - Initial production setup

## License

PRIVATE - Lifestyle Super App
