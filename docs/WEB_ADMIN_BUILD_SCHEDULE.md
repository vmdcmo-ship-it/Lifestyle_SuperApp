# Lịch trình Build Web Admin

> Theo [Bản Hiến Pháp Chung](./HIEN_PHAP_LIFESTYLE_SUPERAPP.md) – Web Admin là trang quản trị vận hành, dùng main-api + auth.

**Cập nhật**: 2025
**Trạng thái**: Sprint 9 hoàn thành → Tiếp theo: Sprint 10 (MFA)

---

## Tổng quan

| Giai đoạn | Thời gian | Nội dung chính |
|-----------|-----------|----------------|
| **Sprint 1** | 1–2 tuần | Scaffold, Auth, Layout |
| **Sprint 2** | 1–2 tuần | Quản lý tài xế (MVP) |
| **Sprint 3** | 1 tuần | RBAC cơ bản + Bảo mật |
| **Sprint 4** | 1 tuần | Trung tâm thông tin |
| **Sprint 5** | 1–2 tuần | Bảng giá + Trung tâm khuyến mãi |
| **Sprint 6+** | Liên tục | Dashboard, Marketing, mở rộng |

---

## Sprint 1: Scaffold & Auth (Tuần 1–2)

### Mục tiêu
- Có ứng dụng web-admin chạy được
- Đăng nhập với tài khoản ADMIN
- Layout sidebar + header cơ bản

### Công việc

| # | Task | Chi tiết | Ước lượng |
|---|------|----------|------------|
| 1.1 | **Tạo project** | `npx create-next-app@14 web-admin` trong `apps/` | 0.5 ngày |
| 1.2 | **Config workspace** | Thêm vào `package.json` workspaces, `turbo.json` | 0.5 ngày |
| 1.3 | **Cài đặt** | Tailwind, shadcn/ui, axios/fetch cho API | 0.5 ngày |
| 1.4 | **Layout cơ bản** | Sidebar (menu), Header (user, logout), main content | 1 ngày |
| 1.5 | **Trang Login** | Form login → gọi `POST /auth/login` main-api, lưu token | 1 ngày |
| 1.6 | **Auth guard** | Middleware/guard: chưa login → redirect `/login` | 0.5 ngày |
| 1.7 | **API client** | Base URL, interceptors (Bearer token, refresh 401) | 0.5 ngày |
| 1.8 | **Tài khoản ADMIN** | Tạo user role ADMIN trong DB (seed/migration) nếu chưa có | 0.5 ngày |

### Deliverables
- [x] `apps/web-admin/` chạy `npm run dev` (port 3001)
- [ ] Đăng nhập thành công với admin@... (cần tài khoản ADMIN trong DB)
- [x] Layout sidebar + header hiển thị
- [x] Token lưu (cookie + localStorage), gửi kèm mọi request

### API sử dụng (main-api đã có)
- `POST /auth/login` – Đăng nhập
- `POST /auth/refresh` – Refresh token

---

## Sprint 2: Quản lý tài xế MVP (Tuần 2–3)

### Mục tiêu
- Danh sách tài xế (phân trang, lọc status)
- Chi tiết tài xế
- Duyệt / Từ chối hồ sơ

### Công việc

| # | Task | Chi tiết | Ước lượng |
|---|------|----------|------------|
| 2.1 | **Trang Danh sách tài xế** | Gọi `GET /drivers/list?page&limit&status` | 1 ngày |
| 2.2 | **Bảng + phân trang** | Hiển thị: mã, tên, email, status, ngày đăng ký | 0.5 ngày |
| 2.3 | **Lọc theo status** | PENDING_VERIFICATION, ACTIVE, INACTIVE | 0.5 ngày |
| 2.4 | **Trang Chi tiết tài xế** | Gọi API lấy 1 driver (hoặc dùng getProfile nếu có admin endpoint) | 1 ngày |
| 2.5 | **Modal/Form Duyệt** | Nút Duyệt / Từ chối; form nhập lý do (khi từ chối) | 1 ngày |
| 2.6 | **Gọi verifyDriver** | `PATCH /drivers/:id/verify` với `{ action, rejectionReason }` | 0.5 ngày |
| 2.7 | **Thống kê nhanh** | Card: Tổng, Đang duyệt, Đã duyệt (`GET /drivers/stats` – ADMIN) | 0.5 ngày |

### Deliverables
- [x] Danh sách tài xế có phân trang, lọc
- [x] Xem chi tiết tài xế
- [x] Duyệt / Từ chối với lý do
- [x] Thống kê hiển thị trên dashboard nhỏ

### API sử dụng (main-api)
- `GET /drivers/list?page&limit&status` – Danh sách (ADMIN)
- `GET /drivers/:id` – Chi tiết tài xế (ADMIN) – *thêm Sprint 2*
- `PATCH /drivers/:id/verify` – Duyệt/từ chối (ADMIN)
- `GET /drivers/stats` – Thống kê (ADMIN)

---

## Sprint 3: RBAC cơ bản + Bảo mật (Tuần 3–4)

### Mục tiêu
- Kiểm tra role ADMIN trước khi vào
- Session ngắn, idle timeout
- Chuẩn bị MFA (cấu trúc, chưa bắt buộc)

### Công việc

| # | Task | Chi tiết | Ước lượng |
|---|------|----------|------------|
| 3.1 | **Role guard** | Nếu user.role !== ADMIN → redirect /unauthorized hoặc /login | 0.5 ngày |
| 3.2 | **Session/JWT** | Kiểm tra expiry; refresh token khi gần hết hạn | 0.5 ngày |
| 3.3 | **Idle timeout** | Sau 15 phút không hoạt động → đăng xuất hoặc cảnh báo | 0.5 ngày |
| 3.4 | **Menu theo permission** | Ẩn menu user chưa có quyền (drivers:view, ...) | 0.5 ngày |
| 3.5 | **Logout** | Xóa token, redirect /login | 0.5 ngày |
| 3.6 | **Env config** | `NEXT_PUBLIC_API_URL`, biến môi trường cho ops | 0.5 ngày |

### Deliverables
- [x] Chỉ ADMIN vào được (role cookie + middleware)
- [x] Session có kiểm soát (proactive refresh, idle timeout)
- [x] Menu động theo quyền (permission trong MENU_ITEMS)

### Bảo mật (deploy)
- VPN/IP whitelist: cấu hình ở reverse proxy (Nginx/Cloudflare) khi deploy
- MFA: có thể triển khai sau khi auth-service hoặc main-api hỗ trợ TOTP

---

## Sprint 4: Trung tâm thông tin (Tuần 4–5)

### Phụ thuộc
- main-api cần thêm **module Content** (bảng `legal_documents`, API `GET/POST/PATCH /content`)

### Công việc

| # | Task | Chi tiết | Ước lượng |
|---|------|----------|------------|
| 4.1 | **Backend: Content module** | Bảng legal_documents, CRUD API (admin) | 1–2 ngày |
| 4.2 | **Trang Danh sách văn bản** | List: privacy-policy, terms-of-use, ... | 0.5 ngày |
| 4.3 | **Form sửa nội dung** | Rich text editor (markdown hoặc WYSIWYG), slug, version | 1 ngày |
| 4.4 | **Đặt ngày hiệu lực** | effective_from, effective_to | 0.5 ngày |
| 4.5 | **API public** | `GET /content/:slug?locale=vi` (không cần auth) cho apps | 0.5 ngày |

### Deliverables
- [x] Sửa Điều khoản bảo mật, Quy chế hoạt động trong Web Admin
- [x] App fetch `GET /content/:slug?locale=vi` (public) để hiển thị /privacy, /terms
- [x] Trang /privacy và /terms (apps/web) lấy nội dung từ main-api
- [x] Seed văn bản mặc định: `npm run seed:content` trong main-api

---

## Sprint 5: Bảng giá + Trung tâm khuyến mãi (Tuần 5–6)

### Bảng giá
- Rà soát main-api/booking xem đã có pricing chưa
- Form nhập: base price, rule, effective_from
- Lưu DB, API đọc khi tính giá

### Trung tâm khuyến mãi (cơ bản)
- Danh sách chương trình khuyến mãi
- Tạo mới: tên, điều kiện, % giảm, thời hạn
- Trạng thái: Nháp, Đã công bố
- API cho apps fetch promotions đang hiệu lực

### Deliverables Sprint 5
- [x] Trang danh sách bảng giá `/pricing` – bảng hiển thị cước theo loại xe
- [x] Trang chỉnh sửa `/pricing/[vehicleType]` – cập nhật baseFare, perKm, perMin, minFare, isActive
- [x] API `GET /pricing/fare-config` trả về tất cả config (kể cả inactive) cho admin
- [x] Trang khuyến mãi: danh sách, tạo mới, chi tiết/sửa (coupons)

---

## Sprint 6+: Mở rộng

| Sprint | Nội dung | Ghi chú |
|--------|----------|---------|
| 6 | Dashboard hiệu suất | Stats cards + Quick links (đã có) |
| 6b | Charts (tuỳ chọn) | ✓ Hoàn thành – Biểu đồ đặt xe + đơn hàng theo ngày |
| 7 | Trung tâm Marketing + Dashboard Marketing | ✓ Hoàn thành – Hub, Chiến dịch, Báo cáo hiệu quả |
| 8 | Quản lý Merchant, đơn hàng | ✓ Hoàn thành |

| 9 | Audit log UI | ✓ Hoàn thành – Trang /audit, lọc action/resource |
| 10 | MFA bắt buộc | ✓ Hoàn thành – TOTP, QR setup, login 2 bước, tắt MFA |
| — | Hoàn thiện Web Admin | ✓ 404, Error Boundary, Cài đặt, Export CSV, Breadcrumbs, link Cài đặt Header |
| 11 | RBAC mở rộng | ✓ Hoàn thành – Nhiều role, menu động theo quyền |

### Deliverables Sprint 6
- [x] Thống kê tài xế: Tổng, Đang chờ duyệt, Đã duyệt, Đang online
- [x] Thống kê hệ thống: Tổng users, Đang hoạt động, Merchants, Không hoạt động
- [x] Truy cập nhanh: Tài xế, Bảng giá, Marketing, Trung tâm thông tin
- [x] Biểu đồ: Đặt xe + Đơn hàng theo ngày (7/14/30 ngày)

### Deliverables Sprint 7
- [x] Trang Trung tâm Marketing `/marketing` – hub với link Khuyến mãi
- [x] Chiến dịch quảng cáo – CRUD campaigns (`/marketing/campaigns`)
- [x] Báo cáo hiệu quả marketing – thống kê coupon (`/marketing/reports`)

### Deliverables Sprint 9
- [x] Bảng `audit_logs` trong schema core
- [x] API `GET /audit/logs` – phân trang, lọc action, resource
- [x] Trang Audit Log `/audit` – danh sách, lọc, đồng bộ URL
- [x] Menu sidebar + Quick link Dashboard

### Deliverables Sprint 8
- [x] API Admin: `GET /merchants/admin/list`, `GET /merchants/admin/:id`
- [x] API Admin: `GET /orders/admin/list`, `GET /orders/admin/:id`
- [x] Trang Cửa hàng `/merchants` – danh sách, lọc status, tìm kiếm, chi tiết
- [x] Trang Đơn hàng `/orders` – danh sách, lọc status, chi tiết

---

## Thứ tự thực hiện đề xuất

```
Tuần 1–2:  Sprint 1 (Scaffold + Auth)        ← BẮT ĐẦU ĐÂY
Tuần 2–3:  Sprint 2 (Quản lý tài xế)         ← API đã sẵn
Tuần 3–4:  Sprint 3 (RBAC + Bảo mật)
Tuần 4–5:  Sprint 4 (Trung tâm thông tin)    ← Cần backend Content
Tuần 5–6:  Sprint 5 (Bảng giá + Khuyến mãi)  ✓ HOÀN THÀNH
Tuần 6:    Sprint 6 (Dashboard)                ✓ HOÀN THÀNH
Tuần 6+:   Sprint 6b (Charts)                  ✓ HOÀN THÀNH
           Sprint 7 (Marketing)                 ✓ HOÀN THÀNH
```

---

## Phụ thuộc Backend

| Sprint | Cần main-api | Ghi chú |
|-------|--------------|---------|
| 1 | Auth (đã có) | – |
| 2 | Drivers list, verify (đã có) | – |
| 3 | – | Chủ yếu frontend |
| 4 | Module Content mới | Thêm bảng, API |
| 5 | Pricing schema, Promotions API | Rà soát hoặc thiết kế mới |

---

## Checklist khởi động

- [ ] Tạo tài khoản ADMIN trong DB (nếu chưa có)
- [ ] Xác nhận `main-api` chạy, URL (localhost:3000 hoặc api.vmd.asia)
- [x] Tạo `apps/web-admin/` với Next.js 14
- [x] Thêm script `dev:web-admin` vào root `package.json`
- [x] Cấu hình CORS main-api cho domain web-admin (localhost:3001 đã có sẵn)

---

*Tài liệu tham chiếu: [HIEN_PHAP_LIFESTYLE_SUPERAPP.md](./HIEN_PHAP_LIFESTYLE_SUPERAPP.md)*
