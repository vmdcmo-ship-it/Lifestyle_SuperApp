# Rà Soát Đồng Bộ Cấu Trúc Dữ Liệu – vmd.asia

Báo cáo tổng quan các vấn đề còn tồn tại và hướng xử lý để web https://www.vmd.asia luôn đồng bộ với codebase và dữ liệu mới nhất.

---

## 1. Tổng Quan Pipeline Deploy

```
[GitHub Repo] → rsync (--exclude .env) → [VPS /opt/lifestyle-superapp]
                    ↓
            docker compose build (web, main-api, user-service)
                    ↓
            docker compose up -d
                    ↓
            [Nginx] → web:3001, main-api:3000 (internal)
```

**Luồng dữ liệu:**
- **Code:** rsync từ GitHub → VPS
- **Env:** Không sync, dùng file `.env` sẵn có trên VPS
- **Database:** Prisma migrate cần chạy riêng
- **Build:** Chạy trên VPS, dùng env lúc build

---

## 2. Các Vấn Đề Đã Xác Định

### 2.1 Web container crash: `Cannot find module '/app/server.js'` ✅ ĐÃ SỬA

**Nguyên nhân:** Monorepo Next.js tạo `server.js` tại `apps/web/server.js`, không phải root.

**Đã sửa:** `Dockerfile.web` CMD đổi thành `node apps/web/server.js`.

---

### 2.2 File env không thống nhất

| Nguồn | File env | Ghi chú |
|-------|----------|---------|
| **GitHub Actions** | `.env` (root) | Rsync exclude `.env` → phải tạo thủ công trên VPS |
| **deploy.sh** | `infrastructure/.env.production` | Deploy thủ công |
| **Local build** | `.env` hoặc `infrastructure/.env.production` | Không có `.env` mặc định |

**Rủi ro:** VPS thiếu `.env` → GitHub deploy lỗi. Nếu dùng nhầm file env → build sai config.

**Khuyến nghị:** Tạo symlink hoặc copy:
```bash
# Trên VPS: đảm bảo .env tồn tại
cd /opt/lifestyle-superapp
[ ! -f .env ] && cp infrastructure/.env.production .env
```

---

### 2.3 Health Check trong deploy workflow sai port ❌

**Hiện tại:** `curl -sf http://localhost:4000/api/v1/health`  
**Vấn đề:** Không có service nào listen port 4000. main-api chạy 3000 (trong docker), nginx proxy trên 80/443.

**Sửa:** Dùng nginx (port 80) hoặc gọi trong container:
```bash
curl -sf http://localhost/api/v1/health
# hoặc
docker exec lifestyle_main_api wget -qO- http://localhost:3000/api/v1/health
```

---

### 2.4 Prisma migration không chạy trong GitHub Actions

**deploy.sh** có bước `prisma migrate deploy`; **GitHub Actions** không có.

**Rủi ro:** Thêm bảng mới (training, news, …) nhưng không chạy migrate trên VPS → API lỗi.

**Khuyến nghị:** Thêm step vào workflow:
```yaml
- name: Run Prisma migrations (when main-api deployed)
  if: github.event.inputs.service == 'all' || github.event.inputs.service == 'main-api'
  run: |
    ssh ... "cd /opt/lifestyle-superapp && docker exec lifestyle_main_api npx prisma migrate deploy || true"
```

---

### 2.5 Sitemap / canonical / domain

**Đã xử lý:**
- `sitemap.ts`, `robots.ts`: hardcode `PRODUCTION_BASE = 'https://www.vmd.asia'`
- main-api (content, news, training): fallback `webBaseUrl = 'https://www.vmd.asia'`
- docker-compose: build args hardcode `NEXT_PUBLIC_BASE_URL`

---

## 3. Checklist Đồng Bộ Sau Mỗi Thay Đổi

| Thay đổi | Cần làm |
|----------|---------|
| Code web/API | Push → trigger deploy hoặc `deploy.sh` |
| Schema Prisma | Chạy `prisma migrate deploy` trên VPS (qua deploy.sh hoặc thủ công) |
| Thêm env mới | Cập nhật `.env` và `infrastructure/.env.production` trên VPS |
| Nginx config | Rsync đã copy; reload nginx nếu cần |

---

## 4. Hành Động Đề Xuất (Ưu Tiên)

### P0 – Đã khắc phục (2026-03-05)

1. ✅ **Health Check** – Đổi `localhost:4000` → `localhost` (nginx port 80) + docker exec cho web.
2. ✅ **File .env** – Workflow tự tạo `.env` từ `infrastructure/.env.production` nếu chưa có.
3. ✅ **Prisma migrate** – Chạy trong workflow khi deploy main-api; thêm COPY prisma vào Dockerfile.backend.
4. ✅ **server.js path** – Dockerfile.web dùng `apps/web/server.js` cho monorepo.

### P1 – Đã áp dụng

5. ✅ Chuẩn hóa env: workflow dùng `.env`, tự tạo từ `infrastructure/.env.production`.
6. ✅ Thêm placeholder prisma cho user-service (để Dockerfile COPY chung).

### P2 – Lưu ý tiếp theo

7. Cập nhật docs (DEPLOY_*, KIEM_TRA_*) dùng `infrastructure/.env.production` khi build local.
8. Sau khi thay đổi schema Prisma: cần deploy main-api (all hoặc main-api) để migrate chạy.

---

## 5. Lệnh Kiểm Tra Nhanh Trên VPS

```bash
cd /opt/lifestyle-superapp

# 1. Kiểm tra env
[ -f .env ] && echo "OK: .env exists" || echo "MISSING: .env - tạo từ infrastructure/.env.production"

# 2. Trạng thái container
docker ps -a | grep lifestyle

# 3. Web có chạy?
docker exec lifestyle_web wget -qO- http://localhost:3001/sitemap.xml 2>/dev/null | head -5 || echo "Web lỗi"

# 4. API health
curl -sf http://localhost/api/v1/health && echo "OK" || echo "API lỗi"

# 5. Prisma migrate status
docker exec lifestyle_main_api npx prisma migrate status 2>/dev/null || echo "Không chạy được"
```

---

## 6. Tóm Tắt Root Cause – “Cấu Trúc Chưa Đồng Bộ”

| Hiện tượng | Nguyên nhân có thể |
|------------|--------------------|
| Web crash / không load | server.js path sai (đã sửa) hoặc build lỗi |
| Sitemap/URL còn lifestyle-app | Cache CDN/trình duyệt; rebuild chưa chạy đúng |
| API trả dữ liệu thiếu/lỗi | Prisma migrate chưa chạy; DB schema cũ |
| Deploy “thành công” nhưng site lỗi | Health check sai port → bỏ qua lỗi thực tế |

---

*Cập nhật: 2026-03-05*
