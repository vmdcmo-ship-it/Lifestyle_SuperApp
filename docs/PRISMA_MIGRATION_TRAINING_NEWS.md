# Prisma Migration – Training & News (Web Admin)

Hướng dẫn áp dụng migration và seed cho module Đào tạo & Tin tức.

---

## 1. Tổng quan

Migration `20250228000000_add_training_news` đã có sẵn, tạo các bảng:

- `core.training_categories` – Danh mục đào tạo
- `core.training_materials` – Tài liệu (ARTICLE, QUIZ, FAQ)
- `core.news_articles` – Bài viết tin tức

---

## 2. Áp dụng migration

### Cách A: Khi deploy lên VPS

Script `infrastructure/scripts/deploy.sh` tự chạy `prisma migrate deploy` trong container main-api. Chỉ cần deploy bình thường:

```bash
# Trên VPS sau khi deploy
bash infrastructure/scripts/deploy.sh
```

### Cách B: Chạy thủ công trên VPS

```bash
ssh root@103.161.119.125
cd /opt/lifestyle-superapp
docker exec lifestyle_main_api npx prisma migrate deploy
```

### Cách C: Local development

Cần `DATABASE_URL` trong `.env`:

```bash
cd services/main-api
pnpm exec prisma migrate deploy
# Hoặc migrate dev (tạo migration mới nếu có thay đổi):
# pnpm exec prisma migrate dev --name my_change
```

---

## 3. Seed danh mục Đào tạo (tùy chọn)

Chạy seed để tạo các danh mục mẫu:

### Trên VPS (trong container)

```bash
docker exec -it lifestyle_main_api npx ts-node prisma/seed-training.ts
```

### Local (cần DATABASE_URL)

```bash
cd services/main-api
pnpm run seed:training
```

Danh mục mẫu:

- Đào tạo tài xế - Quy tắc ứng xử
- Kỹ năng phục vụ khách hàng
- FAQ - Câu hỏi thường gặp (Tài xế)
- Kỹ năng quản lý tài chính
- Hướng dẫn sử dụng ứng dụng

---

## 4. Kiểm tra

### Kiểm tra migration đã áp dụng

```bash
docker exec lifestyle_main_api npx prisma migrate status
```

### Kiểm tra bảng đã tồn tại

```bash
docker exec -it lifestyle_postgres_prod psql -U lifestyle_admin -d lifestyle_db -c "\dt core.training_*"
docker exec -it lifestyle_postgres_prod psql -U lifestyle_admin -d lifestyle_db -c "\dt core.news_*"
```

---

## 5. Web Admin – Sử dụng

Sau khi migration và seed xong:

1. **Đào tạo**: Web Admin → Menu **Đào tạo** → Danh mục & Tài liệu
2. **Tin tức**: Web Admin → Menu **Tin tức** → Quản lý bài viết
3. **Public API**: App User/Driver gọi `GET /training/public/links`, `GET /news/public/links`
