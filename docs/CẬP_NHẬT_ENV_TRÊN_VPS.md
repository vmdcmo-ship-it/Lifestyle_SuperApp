# Cập Nhật Biến Môi Trường (.env) Trên VPS

**Lưu ý:** Từ bản cập nhật mới, domain `https://www.vmd.asia` đã được **hardcode** trong `docker-compose.production.yml` khi build web. Sitemap và canonical URLs sẽ luôn dùng vmd.asia, không phụ thuộc `.env`. File này hướng dẫn khi cần thêm biến khác hoặc rebuild.

---

## Thông Tin VPS

| Mục | Giá trị |
|-----|---------|
| **IP** | `103.161.119.125` |
| **User** | `root` |
| **Đường dẫn project** | `/opt/lifestyle-superapp` |

---

## Bước 1 — Kết nối SSH (chạy trên máy Windows)

Mở **PowerShell** và chạy:

```powershell
ssh root@103.161.119.125
```

Nhập mật khẩu SSH khi được hỏi. Khi thấy prompt dạng `root@...:~#` → đã kết nối thành công.

---

## Bước 2 — Vào thư mục project (chạy trên VPS sau khi SSH)

```bash
cd /opt/lifestyle-superapp
```

---

## Bước 3 — Thêm NEXT_PUBLIC_BASE_URL vào file .env

> **Lưu ý:** Có thể có 2 file env:
> - `infrastructure/.env.production` — dùng bởi `deploy.sh` (deploy thủ công)
> - `.env` (ở root) — dùng bởi **GitHub Actions** workflow

**Khuyến nghị:** Thêm vào cả hai để đảm bảo:

```bash
# 1. Thêm vào infrastructure/.env.production
echo "" >> infrastructure/.env.production
echo "NEXT_PUBLIC_BASE_URL=https://www.vmd.asia" >> infrastructure/.env.production

# 2. Thêm vào .env (nếu file tồn tại — dùng cho GitHub Actions deploy)
[ -f .env ] && echo "NEXT_PUBLIC_BASE_URL=https://www.vmd.asia" >> .env || echo "Không có file .env ở root, bỏ qua"
```

### Cách B: Dùng `nano` (chỉnh sửa thủ công)

```bash
nano infrastructure/.env.production
```

Thêm dòng sau vào cuối file:

```
NEXT_PUBLIC_BASE_URL=https://www.vmd.asia
```

- Lưu: `Ctrl+O` → Enter  
- Thoát: `Ctrl+X`

### Cách C: Dùng `sed` (thêm nếu chưa tồn tại)

```bash
grep -q "NEXT_PUBLIC_BASE_URL" infrastructure/.env.production || echo "NEXT_PUBLIC_BASE_URL=https://www.vmd.asia" >> infrastructure/.env.production
```

---

## Bước 4 — Rebuild container web

```bash
cd /opt/lifestyle-superapp

docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml build --no-cache web

docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml up -d web
```

---

## Bước 5 — Kiểm tra

```bash
docker ps
```

Đảm bảo container `lifestyle_web` đang chạy (status `Up`).

Mở trình duyệt: https://www.vmd.asia/sitemap.xml — URL trong sitemap phải là `https://www.vmd.asia`, không phải `lifestyle-app.com`.

---

## Tóm tắt — Copy lần lượt từng khối

**1. SSH vào VPS:**
```powershell
ssh root@103.161.119.125
```

**2. Thêm biến vào cả hai file env và rebuild (chạy sau khi đã vào VPS):**
```bash
cd /opt/lifestyle-superapp
echo "" >> infrastructure/.env.production && echo "NEXT_PUBLIC_BASE_URL=https://www.vmd.asia" >> infrastructure/.env.production
[ -f .env ] && echo "NEXT_PUBLIC_BASE_URL=https://www.vmd.asia" >> .env
docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml build --no-cache web
docker compose --env-file infrastructure/.env.production -f infrastructure/docker/docker-compose.production.yml up -d web
```

**3. Kiểm tra:**
```bash
docker ps
```

Sau đó mở https://www.vmd.asia/sitemap.xml trên trình duyệt.
