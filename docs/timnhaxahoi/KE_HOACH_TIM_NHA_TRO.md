# Kế hoạch triển khai chi tiết — Tab **Tìm nhà trọ** (`/timnhatro`)

> **Đặc tả nghiệp vụ:** [SPEC_TRIEN_KHAI.md §19 & §19.1a](./SPEC_TRIEN_KHAI.md) (MVP B: list + detail + đăng/sửa tin; tài khoản web; auto-publish; báo cáo; TTL §19.8).  
> **Thứ tự:** bước sau chỉ bắt đầu khi bước trước **đạt tiêu chí xong** hoặc có **nhánh song song** ghi rõ.  
> **Stack:** `services/timnhaxahoi-service` (NestJS), `apps/web-timnhaxahoi` (Next.js 14), Postgres chung — **không** trộn bảng rental với `housing_projects` (§12.5).

---

## R0 — Tiền đề (đã có / cần trước khi code kênh trọ)

| # | Việc | Tiêu chí |
|---|------|-----------|
| R0.1 | Monorepo đã có **timnhaxahoi-service** + **web-timnhaxahoi** chạy được (dev/Docker) | Health API, web build OK |
| R0.2 | **Postgres** + migration NOXH hiện tại (`users_satellite`, …) ổn định | `migration:run` sạch môi trường dev |
| R0.3 | Chốt **quy ước đặt tên** bảng/API rental (vd. `rental_listings`, prefix route `/api/v1/rental/...` hoặc `/api/v1/timnhatro/...`) | Ghi trong PR đầu tiên của kênh trọ |
| R0.4 | Branch feature (vd. `feature/timnhatro-mvp-b`) | Tránh lệch `main` khi đang làm dở |

**Song song:** R0.3 có thể làm cùng R1.

### R0 — Trạng thái & quy ước đã chốt (để R1+ tuân thủ)

**Tiêu chí kỹ thuật (đã xác nhận trên monorepo):**

| Mã | Trạng thái | Ghi chú |
|----|------------|---------|
| R0.1 | OK | `pnpm --filter @lifestyle/timnhaxahoi-service run build` và `pnpm --filter @lifestyle/web-timnhaxahoi run build` thành công; script dev: `pnpm dev:timnhaxahoi-api` / `pnpm dev:timnhaxahoi-web` (root `package.json`). |
| R0.2 | Dev phải tự chạy trên DB local | Migration NOXH hiện có: `1742800000000-InitialTimnhaxahoiSchema` — chạy `migration:run` sau khi Postgres lên (Docker compose hoặc `DATABASE_*` trỏ localhost). |
| R0.3 | Đã chốt bảng dưới | Dùng xuyên suốt code + migration R1. |
| R0.4 | Nhánh `feature/timnhatro-mvp-b` | Mọi commit kênh trọ MVP B trên nhánh này; merge `main` khi R1 ổn hoặc theo sprint. |

**Quy ước đặt tên (R0.3) — kênh Tìm nhà trọ**

| Thành phần | Quy ước |
|------------|---------|
| **Bảng Postgres** | `rental_listings` (entity TypeORM: `RentalListing`). Báo cáo (R6): `rental_listing_reports`. Snake_case trong DB, camel trong TS theo chuẩn Nest/TypeORM. |
| **REST API** | Prefix **`/api/v1/rental/`**: ví dụ `GET .../rental/listings`, `GET .../rental/listings/:id`, `POST .../rental/listings` (landlord), `POST .../rental/listings/:id/report`. Không dùng prefix `/api/v1/timnhatro/` để tránh nhầm với route Next.js. |
| **Module Nest** | `services/timnhaxahoi-service/src/modules/rental/` (`RentalModule`, controller/service tách rõ public vs landlord). |
| **Next.js App Router** | `apps/web-timnhaxahoi/app/timnhatro/` (vd. `page.tsx`, `[slug]/page.tsx`). |
| **Client gọi API** | Dùng `NEXT_PUBLIC_API_URL` hiện có + path `/rental/...`. |

---

## R1 — Schema & migration (Postgres)

| # | Việc | Chi tiết kỹ thuật | Tiêu chí xong |
|---|------|-------------------|---------------|
| R1.1 | Entity + bảng **`rental_listings`** | Các trường tối thiểu: `id`, `owner_user_id` → `users_satellite`, tiêu đề, mô tả, địa chỉ/huyện/tỉnh, `lat`/`lng` (tuỳ MVP), giá, diện tích (tuỳ), **SĐT hiển thị** (lưu server), `slug` hoặc id public, `expires_at` **bắt buộc**, `created_at`/`updated_at`, cờ **`visible_public`** hoặc suy ra từ TTL + `expired_hidden_at` | Migration up/down; không `synchronize` prod |
| R1.2 | Index | Theo filter MVP: tỉnh/huyện, `expires_at`, `visible_public`, `owner_user_id` | Query list không full-scan bảng lớn |
| R1.3 | *(Tuỳ chọn cùng sprint)* Bảng **`rental_reports`** | `listing_id`, reporter (nullable nếu anonymous), `reason`, `created_at`, trạng thái `OPEN`/`REVIEWED` | Có thể ship R1.3 cùng R6 nếu gấp |

**Phụ thuộc:** R0.

---

## R2 — Auth chủ trọ trên web (MVP B)

| # | Việc | Chi tiết | Tiêu chí xong |
|---|------|----------|---------------|
| R2.1 | **Đăng ký / đăng nhập** (email+password hoặc SĐT+OTP — chốt một) | Tái sử dụng / mở rộng `users_satellite` + JWT (cùng pattern dashboard hiện có nếu khớp) | Tạo user mới; login trả token |
| R2.2 | **Role / flag** “chủ trọ có quyền đăng tin” | MVP B: user đã đăng ký = có quyền tạo listing (không chờ gói VIP — §19.1a) | Guard Nest: `LandlordGuard` hoặc `JwtAuth` + `user` |
| R2.3 | Rate limit đăng ký / login | `@nestjs/throttler` hoặc tương đương | Không để spam tài khoản |
| R2.4 | **Chưa** làm Super App sync trong giai đoạn này | Ghi TODO trong code hoặc issue “Sau MVP” | — |

**Phụ thuộc:** R1 (cần `owner_user_id` hợp lệ).

**Song song:** R2.1 có thể song song với R1.1 nếu hai người; merge trước R4.

---

## R3 — API public (đọc tin, ẩn SĐT theo §19.8)

| # | Việc | Chi tiết | Tiêu chí xong |
|---|------|----------|---------------|
| R3.1 | `GET` list | Lọc: chỉ tin **còn trong public** (còn hạn hoặc hết hạn nhưng chưa qua 30 ngày ẩn — theo SPEC bảng §19.8); phân trang | Response **không** có SĐT nếu hết hạn |
| R3.2 | `GET` detail theo `id`/`slug` | Mapper: **còn hạn** → trả `phone` (hoặc field tương đương); **hết hạn** → strip SĐT, kèm trạng thái | Contract JSON rõ ràng; test unit mapper |
| R3.3 | **Không** lộ SĐT qua field thừa (raw entity) | DTO `PublicRentalListing` tách riêng | Review security |

**Phụ thuộc:** R1.

---

## R4 — API landlord (JWT — CRUD tin của mình)

| # | Việc | Chi tiết | Tiêu chí xong |
|---|------|----------|---------------|
| R4.1 | `POST` tạo tin | Body: nội dung + **`expires_at`** (hoặc số ngày hiển thị → server tính) | Tin mới **published** ngay (auto-publish §19.1a) |
| R4.2 | `PATCH` sửa tin | Chỉ `owner_user_id` khớp JWT | 403 nếu không phải chủ |
| R4.3 | `DELETE` hoặc `PATCH` **ẩn** (tuỳ UX) | Soft delete vs hard delete — chốt một | Không còn trong list public |
| R4.4 | Gia hạn = cập nhật `expires_at` / `renewed_at` | Cập nhật `updated_at` để phục vụ rule “30 ngày sau hết hạn” | Logic nhất quán với R5 |

**Phụ thuộc:** R1, R2.

---

## R5 — TTL nâng cao: 30 ngày sau hết hạn → ẩn khỏi public

| # | Việc | Chi tiết | Tiêu chí xong |
|---|------|----------|---------------|
| R5.1 | Quy ước thời điểm | `expires_at` (hết hạn hiển thị SĐT); `hidden_at` hoặc tính: `now > expires_at + 30d` và không có `renewed_at`/`expires_at` mới | Document trong code |
| R5.2 | Job định kỳ (cron) hoặc filter query | List/detail public **loại** tin đã ẩn hoàn toàn | Test với ngày giả lập |
| R5.3 | *(Tuỳ)* Gỡ SEO: `noindex` hoặc 404 cho URL tin đã ẩn | Chốt với SP | — |

**Phụ thuộc:** R3, R4.

**Song song:** R5 có thể bắt đầu sau R3.1 (chỉ cần field ngày đủ).

---

## R6 — Báo cáo tin (report)

| # | Việc | Chi tiết | Tiêu chí xong |
|---|------|----------|---------------|
| R6.1 | `POST /.../listings/:id/report` | Body: `reason` (enum ngắn), optional contact | 201 + lưu DB |
| R6.2 | Chống lạm dụng | Throttle theo IP / user | Không spam report |
| R6.3 | Admin xem danh sách report | **Có thể** sau MVP B: chỉ log + export DB / KODO HQ | Tối thiểu: có bản ghi để xử lý tay |

**Phụ thuộc:** R1 (bảng report), có thể ship sau R4 nếu ưu tiên đăng tin trước.

---

## R7 — Frontend: public `/timnhatro`

| # | Việc | Chi tiết | Tiêu chí xong |
|---|------|----------|---------------|
| R7.1 | Route **`/timnhatro`** | Layout cơ bản, đồng bộ header/footer với site | Build OK |
| R7.2 | Trang **danh sách** | Gọi API list; card: tiêu đề, khu vực, giá, CTA “Xem chi tiết” | Responsive |
| R7.3 | Trang **chi tiết** `/timnhatro/[slug]` hoặc `[id]` | Hiển thị SĐT chỉ khi API trả (còn hạn); copy §19.2a | Không lộ SĐT khi API đã strip |
| R7.4 | *(Tuỳ SPEC §19.2)* POI / bản đồ | **Sau** nếu chưa có lat/lng đủ: placeholder “Mở rộng sau” | — |

**Phụ thuộc:** R3.

---

## R8 — Frontend: chủ trọ (auth + form)

| # | Việc | Chi tiết | Tiêu chí xong |
|---|------|----------|---------------|
| R8.1 | Trang **đăng ký / đăng nhập** (hoặc modal) | Lưu token (httpOnly cookie hoặc memory + refresh — chốt pattern an toàn) | Luồng E2E tay |
| R8.2 | Form **đăng tin** | Validation; chọn **ngày hết hạn** hoặc duration | Submit → POST R4 |
| R8.3 | Trang **sửa tin** + **danh sách tin của tôi** | Chỉ listing của user | CRUD đủ cho MVP B |
| R8.4 | Copy pháp lý / disclaimer | “Không đặt cọc trên nền tảng” (§19.2) | Hiển thị rõ |

**Phụ thuộc:** R2, R4.

---

## R9 — Gộp vào site chung (IA + SEO)

| # | Việc | Chi tiết | Tiêu chí xong |
|---|------|----------|---------------|
| R9.1 | **Nav:** thêm mục “Tìm nhà trọ” → `/timnhatro` | Cùng style menu trang chủ NOXH | Không vỡ layout |
| R9.2 | **Metadata** SEO cho list + detail | `title`/`description` theo tin | Lighthouse cơ bản |
| R9.3 | **Sitemap** (nếu đã có `sitemap.ts`) | Thêm URL rental public | Không 404 hàng loạt |

**Phụ thuộc:** R7 tối thiểu.

---

## R10 — Kiểm thử tích hợp & deploy

| # | Việc | Chi tiết | Tiêu chí xong |
|---|------|----------|---------------|
| R10.1 | Test **E2E** tay: đăng ký → đăng tin → xem public → hết hạn (giả lập DB) → SĐT ẩn | Checklist | Ghi vào PR / release note |
| R10.2 | **Migration** production | Backup DB trước; `migration:run` trên VPS | Rollback plan |
| R10.3 | Env: `CORS_ORIGIN`, `NEXT_PUBLIC_API_URL` | Không đổi nếu cùng domain | Smoke sau deploy |
| R10.4 | Smoke **curl** + trình duyệt | `/timnhatro`, API health | Giống quy trình đã làm |

**Phụ thuộc:** R1–R9 theo phạm vi đã ship.

---

## Roadmap sau MVP B (không chặn ship)

| Giai đoạn | Nội dung |
|-----------|----------|
| **Lọc POI / bản đồ** | §19.2: tâm điểm bản đồ — cần lat/lng chuẩn + UI map |
| **Super App** | Auth sync, WebView `mode=app` — [JWT_CONTRACT.md](./JWT_CONTRACT.md) |
| **Gói VIP/Thường + duyệt Admin** | §19.3 — bật khi SP chốt thu phí |
| **Email nhắc hết hạn** | §19.8 |
| **Landlord workspace** đầy đủ | Theo PDF nội bộ / §19.7 |

---

## Bản tóm tắt một dòng (WBS)

`R0 Tiền đề` → `R1 DB` → `R2 Auth web` → `R3 API public` → `R4 API landlord` → `R5 TTL 30 ngày` → `R6 Report` → `R7 FE public` → `R8 FE landlord` → `R9 Gộp nav + SEO` → `R10 QA + deploy`.

---

*Cập nhật file này khi đổi thứ tự sprint; tham chiếu SPEC §19.1a cho mọi thay đổi nghiệp vụ.*
