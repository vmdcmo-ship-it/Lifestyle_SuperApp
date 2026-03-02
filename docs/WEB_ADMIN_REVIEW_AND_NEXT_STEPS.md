# Kiểm tra Web-Admin & Đề xuất bước tiếp theo

> Báo cáo kiểm tra và roadmap hoàn thiện Web-Admin (cập nhật 2025)

---

## 1. Tổng quan hiện trạng

### 1.1 Đã hoàn thành

| Hạng mục | Số lượng | Chi tiết |
|----------|----------|----------|
| **Trang** | 45+ | Dashboard, Drivers, Content, **Training**, **News**, Pricing, Marketing, Coupons, Lucky Wheel, Merchants, Orders, Regions, Franchise, Audit, Settings, Users |
| **Menu** | 15 | Tất cả có trang tương ứng |
| **RBAC** | 16 permissions | Bao gồm TRAINING, NEWS |
| **Token refresh** | ✅ | Đã dùng API_ENDPOINTS.AUTH.REFRESH |
| **Idle timeout** | ✅ | SessionGuard 15 phút, nút Tiếp tục phiên |
| **Trung tâm thông tin** | ✅ | Content + targetApps, public/links API |
| **Đào tạo** | ✅ | Danh mục + Tài liệu (ARTICLE, QUIZ, FAQ), public/links |
| **Tin tức** | ✅ | CRUD + SEO fields, public/links |

### 1.2 Cấu trúc bảo mật

- **SessionGuard** – idle 15 phút, cảnh báo + đăng xuất
- **PermissionGuard** – kiểm tra quyền theo path
- **Breadcrumbs** – điều hướng theo cấp
- **RBAC** – menu động theo role

---

## 2. Đã hoàn thiện (checklist)

### Ưu tiên cao
- [x] Trang Users (`/users`, `/users/[id]`)
- [x] Toast notifications (sonner)
- [x] Confirmation dialogs (ConfirmDialog)
- [x] API config thống nhất

### Ưu tiên trung bình
- [x] Dashboard KPI: acceptance rate, rating, thu nhập tài xế, đơn theo vùng
- [x] Merchant duyệt: nút Duyệt/Từ chối tại `/merchants/[id]`
- [x] Báo cáo theo vùng: bảng trên Dashboard
- [x] Idle timeout 15 phút
- [x] Pagination & filter chuẩn hóa
- [x] Form validation (Zod) – đã dùng @lifestyle/validation

### Trung tâm nội dung
- [x] **Trung tâm thông tin** – điều khoản, chính sách, targetApps
- [x] **Đào tạo** – danh mục, tài liệu (ARTICLE/QUIZ/FAQ), targetApps
- [x] **Tin tức** – bài viết, SEO (seoTitle, seoDescription)
- [x] Public API links cho Content, Training, News – Apps lấy link theo audience

---

## 3. Việc cần làm tiếp theo để hoàn thiện Web Admin

### 3.1 Bắt buộc (để Đào tạo + Tin tức chạy được)

| # | Task | Mô tả | Trạng thái |
|---|------|-------|------------|
| 1 | **Prisma migration** | Chạy `pnpm prisma migrate dev --name add_training_news` trong `services/main-api` để tạo bảng `training_categories`, `training_materials`, `news_articles` | ⬜ Chưa chạy |
| 2 | **Seed danh mục Đào tạo** | Tạo script seed các danh mục mẫu: Đào tạo tài xế quy tắc ứng xử, Kỹ năng phục vụ khách hàng, FAQ, Kỹ năng quản lý tài chính… | Tùy chọn |

### 3.2 Kiểm tra / Sửa lỗi

| # | Task | Chi tiết | Trạng thái |
|---|------|----------|------------|
| 3 | **Route conflict Training** | `GET /training/public/links` khai báo trước `GET /training/public/:slug` | ✅ Đúng |
| 4 | **Route conflict News** | `GET /news/public/links` và `public/:slug` khai báo trước `GET /news/:id` | ✅ Đúng |
| 5 | **Breadcrumbs** | `training`, `news` đã có trong breadcrumbs | ✅ Đã có |

### 3.3 Cải thiện UX (tùy chọn)

| # | Task | Mô tả |
|---|------|-------|
| 6 | **Xóa danh mục/tài liệu** | Thêm nút Xóa với ConfirmDialog cho Training categories & materials |
| 7 | **Xóa bài viết** | Thêm nút Xóa cho News (soft delete hoặc hard delete) |
| 8 | **Upload ảnh** | Tin tức: hỗ trợ upload `featuredImage` thay vì nhập URL |
| 9 | **Web app News trang chủ** | Trang `/news` trên web app liệt kê tin mới nhất (SEO, sitemap) |

### 3.4 Backlog

| # | Task |
|---|------|
| 10 | MFA cho Admin (Sprint 10) |
| 11 | Unit/Integration tests |
| 12 | Dark mode |
| 13 | Export CSV/Excel mở rộng |

---

## 4. Luồng Đào tạo & Tin tức

```
Web Admin                    Main API                     Apps (User/Driver/Merchant)
─────────────────────────────────────────────────────────────────────────────────────
/training                    GET /training/categories      GET /training/public/links
  - Danh mục                 GET /training/materials         ?audience=DRIVER
  - Tài liệu (ARTICLE,       POST /training/materials     → { items: [{ slug, title, url }] }
    QUIZ, FAQ)               GET /training/public/:slug   → Mở url trong WebView
  - targetApps

/news                        GET /news                    GET /news/public/links
  - Bài viết                 POST /news                      ?audience=USER
  - SEO (seoTitle,           GET /news/public/:slug       → Tin tức cho app
    seoDescription)          GET /news/:id
```

---

## 5. Lệnh cần chạy

```bash
# Trong services/main-api
cd services/main-api
pnpm prisma migrate dev --name add_training_news

# Hoặc nếu dùng yarn/npm
npx prisma migrate dev --name add_training_news
```

Sau khi migration xong, Web Admin có thể dùng ngay:
- **Đào tạo**: `/training` → Danh mục + Tài liệu
- **Tin tức**: `/news` → Danh sách + Tạo mới + Chỉnh sửa

---

## 6. Tóm tắt

**Web Admin hiện đã có đủ chức năng:** Users, Drivers, Content, **Đào tạo**, **Tin tức**, Pricing, Marketing, Coupons, Lucky Wheel, Merchants, Orders, Regions, Franchise, Audit, Settings.

**Bước tiếp theo ưu tiên:**
1. Chạy Prisma migration cho Training + News
2. (Tùy chọn) Seed danh mục Đào tạo mẫu
3. (Tùy chọn) Thêm breadcrumbs, nút xóa, upload ảnh
