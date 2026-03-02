# Hướng dẫn Deploy Docker lên VPS

## 📋 Tổng quan

Có 2 phương pháp chính:
- **Phương pháp 1**: Export image từ Docker Desktop → Upload → Import trên VPS
- **Phương pháp 2**: Push lên Docker Hub/Registry → Pull về VPS (Khuyên dùng)

---

## 🚀 Phương pháp 1: Export/Import Image

### Bước 1: Export image từ Docker Desktop

```bash
# Xem danh sách images hiện có
docker images

# Export image thành file .tar
docker save -o lifestyle-app.tar <image_name>:<tag>

# Ví dụ:
docker save -o lifestyle-app.tar my-app:latest
```

### Bước 2: Upload file lên VPS

```bash
# Sử dụng SCP (từ máy local)
scp lifestyle-app.tar user@your-vps-ip:/home/user/

# Hoặc sử dụng SFTP/FTP client như FileZilla
```

### Bước 3: Import và chạy trên VPS

```bash
# SSH vào VPS
ssh user@your-vps-ip

# Load image
docker load -i lifestyle-app.tar

# Kiểm tra image đã load
docker images

# Chạy container
docker run -d -p 3000:3000 --name lifestyle-app my-app:latest
```

---

## ⭐ Phương pháp 2: Docker Hub/Registry (Khuyên dùng)

### Bước 1: Build và tag image

```bash
# Build image
docker build -t your-dockerhub-username/lifestyle-app:latest .

# Hoặc tag image có sẵn
docker tag my-app:latest your-dockerhub-username/lifestyle-app:latest
```

### Bước 2: Push lên Docker Hub

```bash
# Login Docker Hub
docker login

# Push image
docker push your-dockerhub-username/lifestyle-app:latest
```

### Bước 3: Pull và chạy trên VPS

```bash
# SSH vào VPS
ssh user@your-vps-ip

# Pull image
docker pull your-dockerhub-username/lifestyle-app:latest

# Chạy container
docker run -d -p 3000:3000 --name lifestyle-app \
  your-dockerhub-username/lifestyle-app:latest
```

---

## 🔧 Phương pháp 3: Build trực tiếp trên VPS (Tốt nhất)

### Bước 1: Upload source code lên VPS

```bash
# Sử dụng Git
ssh user@your-vps-ip
cd /home/user
git clone https://github.com/your-repo/lifestyle-app.git
cd lifestyle-app

# Hoặc sử dụng SCP
scp -r ./lifestyle-app user@your-vps-ip:/home/user/
```

### Bước 2: Build và chạy trên VPS

```bash
# Build image
docker build -t lifestyle-app:latest .

# Chạy container
docker run -d -p 3000:3000 --name lifestyle-app lifestyle-app:latest
```

---

## 🐳 Sử dụng Docker Compose (Khuyên dùng cho production)

### Tạo file `docker-compose.yml`

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: lifestyle-app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### Deploy lên VPS

```bash
# Upload code + docker-compose.yml lên VPS
scp -r ./* user@your-vps-ip:/home/user/lifestyle-app/

# SSH vào VPS
ssh user@your-vps-ip
cd /home/user/lifestyle-app

# Build và chạy
docker-compose up -d

# Xem logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 📊 Kiểm tra và Quản lý

### Xem container đang chạy
```bash
docker ps
```

### Xem logs
```bash
docker logs lifestyle-app
docker logs -f lifestyle-app  # Follow mode
```

### Stop/Start/Restart container
```bash
docker stop lifestyle-app
docker start lifestyle-app
docker restart lifestyle-app
```

### Xóa container và image
```bash
docker stop lifestyle-app
docker rm lifestyle-app
docker rmi my-app:latest
```

---

## 🔒 Cấu hình Nginx Reverse Proxy (Production)

### Cài Nginx trên VPS

```bash
sudo apt update
sudo apt install nginx
```

### Cấu hình Nginx

```nginx
# /etc/nginx/sites-available/lifestyle-app

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Enable site

```bash
sudo ln -s /etc/nginx/sites-available/lifestyle-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔐 SSL Certificate (HTTPS)

```bash
# Cài Certbot
sudo apt install certbot python3-certbot-nginx

# Lấy SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renew
sudo certbot renew --dry-run
```

---

## 📝 Checklist Deploy

- [ ] Dockerfile đã tối ưu (multi-stage build, .dockerignore)
- [ ] Environment variables được cấu hình đúng
- [ ] Port được mở trên firewall VPS
- [ ] Database connection string đã update
- [ ] Nginx reverse proxy đã cấu hình
- [ ] SSL certificate đã cài đặt
- [ ] Backup và monitoring đã setup
- [ ] CI/CD pipeline (optional)

---

## 🚨 Troubleshooting

### Container bị crash
```bash
docker logs lifestyle-app
docker inspect lifestyle-app
```

### Port đã được sử dụng
```bash
# Linux/VPS
sudo lsof -i :3000
sudo kill -9 <PID>

# Hoặc đổi port khác
docker run -d -p 3001:3000 --name lifestyle-app my-app:latest
```

### Image quá lớn
```bash
# Sử dụng .dockerignore
echo "node_modules" >> .dockerignore
echo ".git" >> .dockerignore
echo "*.log" >> .dockerignore

# Sử dụng alpine base image
FROM node:18-alpine

# Multi-stage build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["npm", "start"]
```

---

## 📞 Hỗ trợ

- Docker Docs: https://docs.docker.com/
- Docker Hub: https://hub.docker.com/
- Nginx Docs: https://nginx.org/en/docs/
