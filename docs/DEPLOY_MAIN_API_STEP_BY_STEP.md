# Deploy main-api lên VPS — Hướng dẫn từng bước

Hướng dẫn đầy đủ từ bước 1 đến bước cuối. Làm theo thứ tự.

---

## Giải thích "Sync file lên VPS"

**Sync** = copy code từ máy Windows lên VPS.

- Code sửa trên máy Windows → nằm trong `C:\Users\nguye\Lifestyle_SuperApp`
- VPS chỉ chạy code nằm trong `/opt/lifestyle-superapp`
- Nếu không sync → VPS vẫn dùng code cũ, deploy sẽ không có thay đổi mới

**Có 2 cách:**
- **Dùng Git:** Chạy `git pull` trên VPS để lấy code mới (cần đã push từ máy Windows)
- **Không dùng Git:** Dùng `scp` để copy thư mục `services`, `infrastructure`, `packages`... từ Windows lên VPS

---

## Phần A: Dùng Git (nếu đã push code)

### Bước 1. SSH vào VPS

```powershell
ssh root@103.161.119.125
```

### Bước 2. Vào thư mục dự án và pull code

```bash
cd /opt/lifestyle-superapp
git pull origin main
```

### Bước 3. Build main-api

```bash
docker compose --env-file infrastructure/.env.production \
  -f infrastructure/docker/docker-compose.production.yml \
  build main-api --no-cache
```

### Bước 4. Khởi động lại main-api

```bash
docker compose --env-file infrastructure/.env.production \
  -f infrastructure/docker/docker-compose.production.yml \
  up -d --force-recreate main-api
```

### Bước 5. Kiểm tra

```bash
docker compose --env-file infrastructure/.env.production \
  -f infrastructure/docker/docker-compose.production.yml \
  ps main-api
```

→ Cột `State` phải là `running`.

---

## Phần B: Không dùng Git (sync bằng scp)

### Bước 1. Trên Windows — mở PowerShell

```powershell
cd C:\Users\nguye\Lifestyle_SuperApp
```

### Bước 2. Copy code lên VPS

```powershell
scp -r services infrastructure packages package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc tsconfig.json root@103.161.119.125:/opt/lifestyle-superapp-override/
```

*(Nhập mật khẩu root khi được hỏi.)*

### Bước 3. SSH vào VPS

Mở terminal **mới**, chạy:

```powershell
ssh root@103.161.119.125
```

### Bước 4. Trên VPS — áp dụng code mới

```bash
cd /opt/lifestyle-superapp

# Backup file .env (tránh bị ghi đè)
cp infrastructure/.env.production /tmp/env.backup

# Ghi đè bằng code mới
cp -r /opt/lifestyle-superapp-override/* .

# Khôi phục .env.production (giữ mật khẩu, JWT secret...)
cp /tmp/env.backup infrastructure/.env.production

# Xóa thư mục tạm
rm -rf /opt/lifestyle-superapp-override
```

### Bước 5. Build main-api

```bash
docker compose --env-file infrastructure/.env.production \
  -f infrastructure/docker/docker-compose.production.yml \
  build main-api --no-cache
```

*(Đợi 2–5 phút.)*

### Bước 6. Khởi động lại main-api

```bash
docker compose --env-file infrastructure/.env.production \
  -f infrastructure/docker/docker-compose.production.yml \
  up -d --force-recreate main-api
```

### Bước 7. Kiểm tra

```bash
docker compose --env-file infrastructure/.env.production \
  -f infrastructure/docker/docker-compose.production.yml \
  ps main-api
```

→ Cột `State` phải là `running`.

---

## Tóm tắt nhanh

| Có Git? | Làm gì |
|---------|--------|
| **Có** | Bước 1: SSH → Bước 2: `git pull` → Bước 3: Build → Bước 4: Up |
| **Không** | Bước 1: `scp` từ Windows → Bước 2: SSH → Bước 3: `cp` code → Bước 4: Build → Bước 5: Up |

---

## Lưu ý

- Luôn chạy lệnh trong đúng thư mục: `cd /opt/lifestyle-superapp` (trên VPS).
- Không xóa hoặc ghi đè `infrastructure/.env.production` — file này chứa mật khẩu DB, JWT secret, v.v.
- Sau khi deploy, thử lại upload avatar trong app để xác nhận.
