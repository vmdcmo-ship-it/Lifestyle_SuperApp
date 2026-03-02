# Bản Hiến Pháp Chung – Lifestyle Super App

> **Tài liệu nền tảng** quy định cấu trúc, nguyên tắc và đường hướng phát triển toàn hệ thống. Mọi thay đổi cần đảm bảo tính nhất quán với tài liệu này.

**Phiên bản**: 1.3  
**Cập nhật**: 2025  
**Trạng thái**: Đã thống nhất – 9.1–9.5 đã quyết định

---

## 1. Tổng quan kiến trúc

### 1.1 Nguyên tắc chung

- **Monorepo** với các workspace: `apps/`, `services/`, `packages/`
- **Nhóm nhạy cảm chạy server riêng ngay từ đầu** – cô lập rủi ro
- **Cập nhật từng phần không ảnh hưởng toàn nền tảng** – deploy độc lập
- **Lỗi có thể ngăn chặn và cô lập** – không lan rộng
- **Tách biệt rõ** giữa ứng dụng người dùng cuối và hệ thống vận hành (admin)

### 1.2 Nguyên tắc Resilience (Điểm sống còn nền tảng)

| Nguyên tắc | Mô tả |
|------------|--------|
| **Cập nhật độc lập** | Deploy/sửa một service không ảnh hưởng service khác |
| **Cô lập lỗi** | Lỗi một service được chặn, không làm sập toàn hệ thống |
| **Graceful degradation** | Service phụ lỗi → Core vẫn hoạt động (fallback, thông báo tạm thời) |
| **Redundancy** | Mỗi service chạy ≥ 2 instance (PM2 cluster / K8s replicas) |

### 1.3 Sơ đồ hệ thống – Phân tách nhóm nhạy cảm

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Apps (User, Driver, Merchant, Web, Web-admin)                               │
└─────────────────────────────┬───────────────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  API Gateway / LB │
                    └─────────┬─────────┘
                              │
    ┌─────────────────────────┼─────────────────────────┐
    │                         │                         │
    ▼                         ▼                         ▼
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│  CORE (main-api)  │ │  NHÓM NHẠY CẢM     │ │  NHÓM NHẠY CẢM     │
│  Server riêng     │ │  payment-service  │ │  auth-service      │
│                   │ │  Server riêng      │ │  Server riêng      │
│  Users, Drivers   │ │  Thanh toán, Ví    │ │  Login, JWT, MFA    │
│  Booking, Orders  │ │  Giao dịch tài     │ │  (hoặc trong core  │
│  Merchants        │ │  chính             │ │   nếu cần đơn giản)│
│  Content, Search  │ │  PCI, Compliance   │ │                     │
│  Loyalty, Gateway │ └───────────────────┘ └───────────────────┘
└───────────────────┘
    │
    ├─────────────────────────┬─────────────────────────┐
    ▼                         ▼                         ▼
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│  notification-    │ │  ai-service        │ │  Analytics         │
│  service          │ │  Server riêng      │ │  (pipeline/        │
│  Server riêng      │ │  Python FastAPI    │ │   module)          │
│  Email, SMS, Push │ │  Dự báo, gợi ý     │ │                    │
│  Queue + Worker   │ │  Chatbot AI        │ │                    │
└───────────────────┘ └───────────────────┘ └───────────────────┘
```

### 1.4 Nhóm nhạy cảm – Server riêng từ đầu

Các nhóm sau **chạy service riêng, server/deploy riêng** ngay từ giai đoạn đầu:

| Service | Lý do tách | Rủi ro nếu trong core |
|---------|------------|------------------------|
| **payment-service** | Tiền, PCI, gian lận, compliance | Lỗi thanh toán = sập core; audit phức tạp |
| **auth-service** | Credential, MFA, session nhạy cảm | Lộ/ crash auth = toàn hệ thống mất bảo mật |
| **notification-service** | Gửi email/SMS/push, phụ thuộc bên thứ 3 | Timeout/ lỗi external kéo sập core |
| **ai-service** | Python, tài nguyên nặng, dễ crash | Memory leak, CPU spike ảnh hưởng core |

**Core (main-api)** chứa: Users, Drivers, Merchants, Booking, Orders, Content, Search, Loyalty, Gateway.  
**Ghi chú Auth**: Có thể giữ auth trong main-api ban đầu nếu cần đơn giản; khi scale hoặc yêu cầu bảo mật cao hơn thì tách auth-service.

### 1.5 Cập nhật & cô lập lỗi

| Yêu cầu | Giải pháp |
|---------|-----------|
| **Cập nhật tính năng từng phần** | Mỗi service deploy độc lập; sửa notification không cần deploy main-api |
| **Lỗi không lan rộng** | Circuit breaker, timeout khi gọi service khác; service lỗi → fallback, không crash caller |
| **Graceful degradation** | Payment lỗi → "Tạm thời không thanh toán được"; Notification lỗi → lưu queue, gửi sau |
| **Redundancy** | Mỗi service ≥ 2 instance (PM2 cluster / K8s replicas); 1 instance crash → LB chuyển sang còn lại |
| **Health check** | Mỗi service expose `/health`; LB không gửi traffic tới instance unhealthy |

---

## 2. Ứng dụng (Apps)

### 2.1 Danh sách ứng dụng

| App | Công nghệ | Đối tượng | Ghi chú |
|-----|-----------|-----------|---------|
| **mobile-user** | React Native | Người dùng cuối | Đặt xe, giao đồ ăn, ví, bảo hiểm... |
| **mobile-driver** | React Native | Tài xế | Nhận đơn, thực hiện, thu nhập, bảo hiểm |
| **mobile-merchant** | React Native | Đối tác merchant | Quản lý cửa hàng, đơn hàng |
| **web** | Next.js 14 | Người dùng web | Landing, đặt dịch vụ, ví, nội dung |
| **web-admin** | Next.js 14 | Nhân viên vận hành | **MỚI** – Trang quản trị tập trung |
| **zalo-mini-app** | Zalo SDK | Người dùng Zalo | (Kế hoạch) |
| **desktop-ops** | Electron | (Tùy chọn) | Chỉ khi cần offline / tích hợp OS – ưu tiên web-admin |

### 2.2 Cấu trúc thư mục

```
apps/
├── mobile-user/
├── mobile-driver/
├── mobile-merchant/
├── web/              # Web người dùng
├── web-admin/        # Web vận hành (TẠO MỚI)
└── zalo-mini-app/    # (Kế hoạch)

services/
├── main-api/         # Core – Users, Drivers, Booking, Orders...
├── payment-service/  # Nhạy cảm – Thanh toán, ví
├── auth-service/     # Nhạy cảm – (Tách khi cần)
├── notification-service/  # Nhạy cảm – Email, SMS, Push
└── ai-service/       # Nhạy cảm – Python, AI/ML
```

---

## 3. Web Admin – Trang quản trị vận hành

### 3.1 Tổng quan

- **Tên**: Web Admin / Web vận hành
- **Tech**: Next.js 14, Tailwind, shadcn/ui
- **Backend**: Dùng chung **main-api** và **auth**
- **Deploy**: Subdomain riêng (vd: ops.lifestyle.vn), **không public** – chỉ truy cập qua VPN/IP whitelist
- **Bảo mật**: Bắt buộc tăng cường (xem mục 7)

### 3.2 Các module chính

#### A. Quản trị vai trò nhân viên (RBAC)

| Thành phần | Mô tả |
|------------|--------|
| **CEO gán vai trò** | Phân quyền theo cấp bậc, chịu trách nhiệm |
| **Phạm vi quản trị** | Theo lĩnh vực dịch vụ, vùng địa lý, phòng ban chức năng |
| **Roles** | ADMIN_TRANSPORT, ADMIN_INSURANCE, SUPERVISOR_HCMC, CSKH, Kế toán... |
| **Permissions** | drivers:view, drivers:approve, orders:manage, pricing:edit... |
| **Scope** | region, service_type, department |

#### B. Quản lý theo nghiệp vụ

| Module | Chức năng |
|--------|-----------|
| **Quản lý tài xế** | Danh sách, duyệt hồ sơ (verifyDriver), xem chi tiết, từ chối + lý do |
| **Quản lý merchant** | Danh sách, duyệt, quản lý cửa hàng |
| **Quản lý đơn hàng** | Danh sách booking, trạng thái, can thiệp khi cần |
| **Quản lý người dùng** | User, roles, trạng thái |

#### C. Bảng thiết lập giá dịch vụ

| Yêu cầu | Giải pháp |
|---------|-----------|
| Không cần sửa code | Cấu hình qua form UI, lưu DB |
| Đặt ngày giờ hiệu lực | `effective_from`, `effective_to` |
| Tự động áp dụng | Backend đọc rule hiệu lực tại thời điểm tính giá |
| Giá phức tạp | Kết hợp thời tiết, mật độ giao thông, khuyến mãi đối thủ |
| Versioning | Lưu lịch sử, rollback khi cần |

**Bảng dữ liệu (gợi ý)**: `pricing_rules`, `pricing_schedules`, `surge_rules`

#### D. Dashboard phân tích hiệu suất

| Đối tượng | Chỉ số |
|-----------|--------|
| **Tài xế** | Acceptance rate, rating, thu nhập, chuyến/ngày |
| **Nhân viên** | Số đơn xử lý, thời gian phản hồi |
| **Vùng / Dịch vụ** | So sánh giữa vùng, dịch vụ |
| **Mục đích** | Điều chỉnh chính sách, thưởng, KPI |

#### E. AI vận hành thông minh

| Ứng dụng | Ví dụ |
|----------|-------|
| Dự báo nhu cầu | Đơn theo ngày/giờ/vùng → điều phối tài xế |
| Gợi ý giá | Surge, khuyến mãi dựa trên lịch sử |
| Phát hiện bất thường | Gian lận, rủi ro, thu nhập bất thường |
| Chatbot nội bộ | Hỏi đáp KPI, chính sách |
| Tối ưu vùng | Gợi ý mở/đóng vùng theo hiệu quả |

---

## 4. Trung tâm thông tin (Legal / Information Center)

### 4.1 Nguyên tắc: Single Source of Truth

- **Sửa một nơi** → **Cập nhật mọi nơi** (App User, Driver, Merchant, Web)
- Nội dung pháp lý quản trị tập trung tại Web Admin

### 4.2 Loại nội dung

| Slug (key) | Mô tả |
|------------|--------|
| `privacy-policy` | Điều khoản bảo mật |
| `terms-of-use` | Quy chế hoạt động |
| `payment-policy` | Chính sách thanh toán |
| `partner-terms` | Chính sách đối tác |
| `quality-standards` | Tiêu chuẩn chất lượng nền tảng |
| ... | Các term pháp lý và tiêu chuẩn khác |

### 4.3 Cấu trúc dữ liệu (gợi ý)

| Trường | Mô tả |
|--------|--------|
| `slug` | Key cố định cho API |
| `title` | Tiêu đề hiển thị |
| `content` | Nội dung (markdown/HTML) |
| `version` | Phiên bản |
| `effective_from` | Ngày có hiệu lực |
| `locale` | vi, en... |
| `external_url` | Link ra trang bên ngoài (nếu dùng) |

### 4.4 API cho các app

```
GET /api/content/:slug?locale=vi  → Nội dung pháp lý
```

Cache (Redis) theo slug + locale để tối ưu.

---

## 5. Trung tâm quản lý khuyến mãi

### 5.1 Chức năng

| Thành phần | Mô tả |
|------------|--------|
| **Chính sách khuyến mãi** | Tạo, duyệt, công bố |
| **Chính sách hợp tác** | Điều kiện đối tác |
| **Mã giảm giá / Voucher** | Tạo, áp dụng theo điều kiện |
| **Phát hành** | Trạng thái: Nháp → Chờ duyệt → Đã công bố |

### 5.2 Luồng

- Sửa/công bố trong Web Admin → API lưu DB
- App User, Driver, Merchant fetch API → Hiển thị banner, voucher, chương trình

---

## 6. Trung tâm Marketing

### 6.1 Quản trị nội dung

- Banner, landing page, creative
- Chiến dịch marketing
- Link sang Legal Center, Promotion Center

### 6.2 Dashboard theo dõi & báo cáo chỉ số Marketing

#### A. Acquisition (Tiếp cận & tải app)

| Chỉ số | Mô tả |
|--------|--------|
| Số lượt tải app | Theo User/Driver/Merchant App |
| Tải theo nguồn | Organic, paid, referral |
| Cost per install (CPI) | Chi phí / số tải |

#### B. Activation & Engagement

| Chỉ số | Mô tả |
|--------|--------|
| DAU, WAU, MAU | Số người đang dùng |
| Tỷ lệ sử dụng tối đa | Stickiness (DAU/MAU) |
| Thời gian sử dụng tối thiểu / TB | Chất lượng session |
| Retention rate | D1, D7, D30 |
| Số session / user | Tần suất sử dụng |

#### C. Chiến dịch Marketing

| Chỉ số | Mô tả |
|--------|--------|
| Chi phí chiến dịch | Budget theo campaign |
| Conversion theo campaign | Tải → Đăng ký → Giao dịch đầu |
| Attribution | Nguồn dẫn tới giao dịch |
| ROAS | Doanh thu / Chi phí quảng cáo |

#### D. Hiệu quả bán hàng

| Chỉ số | Mô tả |
|--------|--------|
| Doanh thu theo kênh | Ride, Food, Shopping... |
| LTV, ARPU | Giá trị user |
| Conversion funnel | Mở app → Tìm kiếm → Đặt hàng → Thanh toán |

#### E. Nguồn dữ liệu

- Event tracking (app_open, session_duration, feature_use)
- UTM / campaign_id cho attribution
- Tích hợp store stats (App Store, CH Play) hoặc ad platforms

---

## 7. Bảo mật – Tăng cường cho Web Admin

### 7.1 Nguyên tắc

Web Admin xử lý dữ liệu nhạy cảm. **Bảo mật phải được triển khai ngay từ đầu**, không làm bổ sung sau.

### 7.2 Kiểm soát truy cập (giảm rủi ro "truy cập mọi nơi")

| Biện pháp | Mô tả | Bắt buộc |
|-----------|--------|----------|
| **VPN hoặc IP whitelist** | Chỉ cho phép truy cập từ VPN nội bộ hoặc IP văn phòng | ✅ Có |
| **Subdomain nội bộ** | VD: ops-internal.lifestyle.vn – không quảng bá URL công khai | ✅ Khuyến nghị |
| **Geo-restriction** | Chỉ cho phép từ quốc gia hoạt động (tùy chọn) | Tùy chọn |

### 7.3 Bảo vệ phiên đăng nhập

| Biện pháp | Mô tả | Bắt buộc |
|-----------|--------|----------|
| **MFA (2FA)** | Bắt buộc cho mọi tài khoản admin (TOTP/SMS/app) | ✅ Có |
| **Session ngắn** | JWT 15–30 phút; refresh token có revoke | ✅ Có |
| **Idle timeout** | Tự đăng xuất sau 10–15 phút không hoạt động | ✅ Khuyến nghị |
| **Single session** | Một tài khoản chỉ 1 phiên – đăng nhập mới = đăng xuất chỗ cũ | Khuyến nghị |
| **Thông báo đăng nhập** | Gửi email/SMS khi có đăng nhập mới (thiết bị, IP, thời gian) | Khuyến nghị |

### 7.4 Phân quyền & kiểm soát

| Biện pháp | Mô tả |
|-----------|--------|
| **RBAC** | Mỗi API kiểm tra role + permission |
| **Audit log** | Ghi: user, action, thời gian, IP, dữ liệu thay đổi |
| **Least privilege** | Mỗi role chỉ có quyền tối thiểu cần thiết |

### 7.5 Bảo vệ dữ liệu

| Biện pháp | Mô tả |
|-----------|--------|
| **HTTPS** | Bắt buộc TLS 1.3 |
| **Encryption at rest** | Mã hóa dữ liệu nhạy cảm trong DB |
| **Không log mật khẩu/token** | Audit log không ghi credential |

### 7.6 Chính sách sử dụng (nên có)

- Chỉ dùng máy công ty / máy được phê duyệt
- Không truy cập Web Admin qua wifi công cộng (trừ khi qua VPN)
- Đăng xuất khi rời máy
- Nội quy bảo mật, đào tạo nhân viên

---

## 8. Tech stack & nguyên tắc kỹ thuật

### 8.1 Theo docs/architecture/README_ARCHITECTURE.md

- Backend: Node.js 20+, NestJS, TypeScript
- Frontend: Next.js 14, React Native 0.73+, Tailwind, shadcn/ui
- Shared: packages (api-client, types, design-system...)

### 8.2 Nguyên tắc dùng chung

1. **Core (main-api)** xử lý nghiệp vụ chính; gọi các service nhạy cảm qua HTTP/gRPC
2. **Auth** thống nhất: JWT, roles; auth-service (hoặc auth module trong core) là nguồn duy nhất
3. **Packages** dùng chung thay vì duplicate code
4. **Giao tiếp giữa services** dùng circuit breaker, timeout; không để lỗi lan truyền

---

## 9. Xung đột & Điểm cần trao đổi trước khi build

### 9.1 Desktop-ops vs Web-admin ✅ ĐÃ QUYẾT ĐỊNH

| Quyết định | Trạng thái |
|------------|------------|
| Dùng **web-admin (Next.js)** làm trang quản trị vận hành chính | ✅ Xác nhận |
| Bảo mật tăng cường: VPN/IP whitelist, MFA, session ngắn, audit log | ✅ Ghi trong mục 7 |
| `desktop-ops` (Electron) | Ưu tiên thấp – chỉ xem xét khi cần offline/tích hợp OS |

**Cần làm**: Cập nhật `PROJECT_STRUCTURE.md`, `STRUCTURE_SUMMARY.md` để phản ánh web-admin.

---

### 9.2 Cấu trúc Backend: main-api vs nhiều service ✅ ĐÃ QUYẾT ĐỊNH

| Quyết định | Chi tiết |
|------------|----------|
| **Core (main-api)** | Users, Drivers, Merchants, Booking, Orders, Content, Search, Loyalty, Gateway |
| **Nhóm nhạy cảm – server riêng từ đầu** | payment-service, auth-service (hoặc trong core ban đầu), notification-service, ai-service |
| **Nguyên tắc** | Cập nhật từng phần không ảnh hệ thống; lỗi cô lập, không lan rộng |
| **Giao tiếp** | Circuit breaker, timeout; graceful degradation khi service phụ lỗi |

**Cần làm**: Triển khai tách payment-service, notification-service, ai-service. Auth có thể tách sau khi ổn định.

---

### 9.3 Analytics / Data pipeline cho Marketing Dashboard ✅ ĐÃ QUYẾT ĐỊNH

| Quyết định | Chi tiết |
|------------|----------|
| **Lên kế hoạch trước** | Analytics pipeline (event schema, storage, aggregation) cần có **trước khi** build Dashboard Marketing |
| **Event tracking** | SDK/endpoint thống nhất cho App User, Driver, Merchant |
| **Attribution** | Chuẩn hóa UTM, campaign_id khi gọi API |
| **Aggregation** | analytics-service hoặc module trong main-api cho DAU, MAU, retention |

**Cần làm**: Thiết kế event schema, chọn storage (DB/Elasticsearch/TimescaleDB), API aggregation trước Phase 6.

---

### 9.4 Content API (Trung tâm thông tin) ✅ ĐÃ QUYẾT ĐỊNH

| Quyết định | Chi tiết |
|------------|----------|
| **Ưu tiên** | Thêm module Content/CMS trong **main-api** (đơn giản, dùng chung DB) |
| **API** | `GET /api/content/:slug?locale=vi` → nội dung pháp lý |
| **Tách riêng** | Chỉ tạo content-service riêng khi nội dung rất lớn, cần scale độc lập |

**Cần làm**: Thêm module Content trong main-api (bảng legal_documents, schema slug/version/effective_from).

---

### 9.5 Pricing Service (Bảng thiết lập giá) ✅ ĐÃ QUYẾT ĐỊNH

| Quyết định | Chi tiết |
|------------|----------|
| **Rà soát hiện có** | Kiểm tra logic pricing trong main-api/booking – dùng lại nếu đủ |
| **Schema** | Bảng pricing_rules, pricing_schedules (effective_from, effective_to) |
| **Module vs Service** | Ưu tiên module trong main-api; tách pricing-service riêng khi logic phức tạp (surge theo thời tiết, traffic) |

**Cần làm**: Rà soát main-api/booking; thiết kế schema pricing_rules nếu chưa có.

---

## 10. Lộ trình gợi ý

**Lịch trình build chi tiết**: Xem [WEB_ADMIN_BUILD_SCHEDULE.md](./WEB_ADMIN_BUILD_SCHEDULE.md)

| Phase | Nội dung | Ưu tiên |
|-------|----------|---------|
| **0** | **Tách nhóm nhạy cảm**: payment-service, notification-service (Queue+Worker), ai-service skeleton | Cao – nền tảng resilience |
| **1** | Web-admin cơ bản + Quản lý tài xế + RBAC + **Bảo mật cơ bản** (MFA, VPN/IP whitelist, session) | Cao |
| **2** | Trung tâm thông tin (pháp lý) | Cao |
| **3** | Bảng thiết lập giá (base + ngày hiệu lực) | Cao |
| **4** | Trung tâm khuyến mãi (cơ bản) | Cao |
| **5** | Dashboard hiệu suất (tài xế, nhân viên) | Trung bình |
| **6** | Trung tâm Marketing + Dashboard Marketing | Trung bình |
| **7** | Pricing nâng cao (surge, thời tiết, traffic) | Trung bình |
| **8** | AI vận hành (dự báo, gợi ý, chatbot) | Trung bình |
| **9** | Audit log đầy đủ, hardening bảo mật, chính sách sử dụng | Cao (song song Phase 1) |

---

## 11. Rà soát & cập nhật

- Khi có thay đổi lớn: cập nhật tài liệu này, tăng phiên bản
- Xung đột mới phát sinh: ghi vào mục 9, trao đổi trước khi build
- Mọi AI/developer tham chiếu tài liệu này để đảm bảo tính nhất quán

---

*Tài liệu được tạo để đảm bảo cấu trúc logic chặt chẽ cho toàn hệ thống Lifestyle Super App.*
