# Đẩy Web lên Production (không chạy local)

## 1. Dùng sẵn Production (nhanh nhất)

Production đã chạy tại **https://vmd.asia**

Mở trực tiếp:
- Trang chủ: https://vmd.asia
- Spotlight: https://vmd.asia/spotlight
- Tạo video: https://vmd.asia/spotlight/create

Không cần chạy gì local – chỉ cần trình duyệt.

---

## 2. Deploy code mới lên Production

### Cách A: GitHub Actions (khuyến nghị)

1. Commit và push code lên repo:
   ```powershell
   git add .
   git commit -m "feat: AI gợi ý mô tả Spotlight"
   git push origin main
   ```

2. Vào **GitHub** → repo → **Actions** → workflow **"Deploy to Production"**

3. Chọn **"Run workflow"**

4. Chọn service:
   - `web` – chỉ deploy web
   - `all` – deploy web + main-api + user-service

5. Đợi workflow chạy xong (khoảng 3–5 phút)

6. Kiểm tra: https://vmd.asia/spotlight

### Cách B: Deploy thủ công trên VPS

Nếu có quyền SSH vào VPS:

```bash
# SSH vào server
ssh root@103.161.119.125

# Sync code mới (chạy từ máy local)
rsync -avz --exclude 'node_modules' --exclude '.git' \
  ./ root@103.161.119.125:/opt/lifestyle-superapp/

# Trên VPS: rebuild & restart
cd /opt/lifestyle-superapp
docker compose -f infrastructure/docker/docker-compose.production.yml \
  --env-file .env build web
docker compose -f infrastructure/docker/docker-compose.production.yml \
  --env-file .env up -d web
```

### Cách C: Script deploy (nếu có)

```bash
bash infrastructure/scripts/deploy.sh
```

---

## 3. Biến môi trường Production

Web production dùng:
- `NEXT_PUBLIC_API_URL=https://api.vmd.asia`
- `NEXT_PUBLIC_WS_URL=wss://api.vmd.asia`

Cấu hình trong `infrastructure/.env.production` hoặc file env trên VPS.

---

## Tóm tắt

| Mục đích | Hành động |
|----------|-----------|
| Xem nhanh | Mở https://vmd.asia/spotlight |
| Đẩy code mới | Push → GitHub Actions → Run "Deploy to Production" |
| Không chạy local | Dùng production trực tiếp |
