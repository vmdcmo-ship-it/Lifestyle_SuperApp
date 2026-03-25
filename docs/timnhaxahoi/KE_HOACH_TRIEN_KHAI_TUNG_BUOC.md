# Kế hoạch triển khai từng bước — timnhaxahoi.com

> Thứ tự **bắt buộc tuân theo**: bước sau chỉ làm khi bước trước **xong hoặc có nhánh song song** đã ghi rõ.  
> Đặc tả nghiệp vụ/kỹ thuật: [SPEC_TRIEN_KHAI.md](./SPEC_TRIEN_KHAI.md).  
> Deploy VPS (khi tới giai đoạn đó): [../QUY_TRINH_TRIEN_KHAI_DEPLOY.md](../QUY_TRINH_TRIEN_KHAI_DEPLOY.md).  
> **Kênh Tìm nhà trọ (`/timnhatro`, MVP B):** [KE_HOACH_TIM_NHA_TRO.md](./KE_HOACH_TIM_NHA_TRO.md) — kế hoạch chi tiết theo giai đoạn R0–R10.

---

## Giai đoạn 0 — Chuẩn bị (trước khi gõ code)

| # | Việc | Ghi chú |
|---|------|---------|
| 0.1 | **Domain production:** `timnhaxahoi.com` — **VPS IPv4 (timnhaxahoi):** `103.72.99.131` — xác nhận quyền quản lý **DNS** (A `@` / `www` → IP; **không** trỏ timnhaxahoi về VPS n8n `103.57.221.93`) | Trước deploy production |
| 0.2 | Chốt **PostgreSQL** chạy ở đâu (Docker local / RDS / VPS) | Cần trước migration thật |
| 0.3 | Tạo repo branch / convention commit theo monorepo hiện có | Tránh lệch turbo/workspaces |
| 0.4 | *(Tuỳ chọn sớm)* Tạo **Lark Base** + bảng cột tối thiểu theo SPEC §14 | Chỉ bắt buộc trước bước ghi lead thật |

**Kết thúc giai đoạn 0:** có chỗ chạy DB dev; domain/DNS biết ai lo (có thể chưa trỏ IP).

---

## Giai đoạn 1 — Khởi tạo workspace trong monorepo

| # | Việc | Tiêu chí xong |
|---|------|----------------|
| 1.1 | Tạo **`apps/web-timnhaxahoi`**: Next.js 14 App Router, TypeScript, Tailwind, ESLint theo chuẩn app khác trong repo | `pnpm`/`npm run dev` (hoặc turbo) chạy được trang trống |
| 1.2 | Tạo **`services/timnhaxahoi-service`**: NestJS, cấu trúc module cơ bản, health check | Service boot, `/health` hoặc tương đương |
| 1.3 | Đăng ký **workspaces** trong `package.json` root (nếu chưa auto nhận `apps/*`, `services/*`) | `turbo run build` không lỗi cho 2 package mới |
| 1.4 | Thêm script dev ngắn gọn (vd. `dev:timnhaxahoi-web`, `dev:timnhaxahoi-api`) nếu team hay dùng | README package hoặc comment trong root `package.json` |

**Song song được:** 1.1 và 1.2 làm cùng lúc bởi hai người.

---

## Giai đoạn 2 — Cơ sở dữ liệu & domain model

| # | Việc | Tiêu chí xong |
|---|------|----------------|
| 2.1 | Thiết kế migration: `users_satellite`, `housing_projects`, `quiz_analytic` (+ enum `lead_segment`) | Migration chạy sạch trên DB dev |
| 2.2 | *(Tuỳ chọn MVP)* Bảng hoặc flag **`project_type`** cho NOXH vs TM giá rẻ | Seed được dữ liệu mẫu |
| 2.3 | Seed **dữ liệu mẫu** vài dự án (Miền Nam ưu tiên) để UI và SSR có nội dung | ≥ 3 slug có ảnh/tiêu đề tối thiểu |

**Phụ thuộc:** Giai đoạn 1 (service có chỗ gắn TypeORM/Prisma/Drizzle tùy chọn stack — **khớp với service khác trong monorepo nếu đã có chuẩn**).

---

## Giai đoạn 3 — Rule engine & API lõi (backend)

| # | Việc | Tiêu chí xong |
|---|------|----------------|
| 3.1 | Module **bảng truth**: input = JSON quiz chuẩn hóa → `lead_segment` + `score` 1–100 | Unit test: các case Xanh/Vàng/Đỏ/Cam trong SPEC §11 |
| 3.2 | `POST /api/v1/ai/eligibility-check`: validate body, gọi engine, trả message an toàn (không hứa % phê duyệt) | Postman/curl OK |
| 3.3 | Lưu `quiz_analytic`, cập nhật `users_satellite` (sau khi có phone/email theo luồng) | Transaction hoặc thứ tự rõ ràng |
| 3.4 | `GET /api/v1/projects`, `GET /api/v1/projects/:slug` (filter theo SPEC) | Web có thể gọi được |
| 3.5 | `GET /api/v1/user/dashboard` (auth tạm: session/JWT nội bộ — MVP có thể dùng token sau quiz) | Dữ liệu khớp bản ghi quiz mới nhất |

**Phụ thuộc:** Giai đoạn 2.

---

## Giai đoạn 4 — Tích hợp Lark Base (khi đã có credential)

| # | Việc | Tiêu chí xong |
|---|------|----------------|
| 4.1 | Env: `LARK_APP_ID` / token / `BASE_TABLE_ID` (tên biến chốt trong team) | Không commit secret |
| 4.2 | Service ghi **một record** khi hoàn thành quiz + lead hợp lệ | Thấy dòng trên Base |
| 4.3 | `POST /api/v1/leads/convert` (nếu tách bước “yêu cầu tư vấn sâu”) hoặc gộp vào bước submit | Không ghi trùng nếu submit lại — idempotency hoặc update |

**Có thể trễ:** Làm **sau** 3.2 nếu chưa có Lark; tạm **log payload** ra console/file staging.

**Phụ thuộc:** Giai đoạn 3 (có dữ liệu lead).

---

## Giai đoạn 5 — Frontend: phễu & dashboard

| # | Việc | Tiêu chí xong |
|---|------|----------------|
| 5.1 | Multi-step quiz 11 câu (theo SPEC §10): **1 ô SĐT**, **email** bắt buộc trước “Xem kết quả” | Validation rõ ràng |
| 5.2 | Gọi API eligibility-check; **skeleton** khi chờ | UX mượt mobile |
| 5.3 | Trang kết quả / **dashboard**: gauge điểm, tóm tắt segment (copy user-friendly) | Không lộ nhãn nội bộ “upsell” |
| 5.4 | Layout **`?mode=app`**: ẩn header/footer | QA bằng URL có query |

**Phụ thuộc:** API giai đoạn 3 (có thể mock API trước khi 3 xong — nhưng merge code nên sau khi contract API ổn định).

---

## Giai đoạn 6 — Trang nội dung & SEO

| # | Việc | Tiêu chí xong |
|---|------|----------------|
| 6.1 | `/` landing: CTA quiz, block dự án nổi bật | Lighthouse cơ bản |
| 6.2 | `/du-an` SSR + `/du-an/[slug]` + meta/OG động | Xem source có `title`/`description` |
| 6.3 | `/phap-ly` khung blog (TOC, 1–2 bài mẫu) | Có route ổn định |
| 6.4 | `/video` grid/vertical (placeholder video) | Responsive |
| 6.5 | Trang **nhà thương mại giá rẻ** + seed mẫu | Admin có thể nhập sau qua CMS/API — MVP có thể static JSON |

**Song song được:** 6.x với 5.x nếu đủ người; cùng design tokens (gradient, WCAG).

---

## Giai đoạn 7 — Google Maps (khi có API key)

| # | Việc | Tiêu chí xong |
|---|------|----------------|
| 7.1 | Autocomplete / geocode địa chỉ làm việc (câu 5) | Giới hạn billing / key restrict theo domain |
| 7.2 | Tính khoảng cách tới tọa độ dự án ưu tiên | Hiển thị trên dashboard kết quả |

**Có thể trễ:** Sau MVP nếu cần ship nhanh — tạm nhập text không tính km.

---

## Giai đoạn 8 — Deploy lần đầu (staging → production)

Làm **theo** [../QUY_TRINH_TRIEN_KHAI_DEPLOY.md](../QUY_TRINH_TRIEN_KHAI_DEPLOY.md) — tóm tắt thứ tự:

| # | Việc |
|---|------|
| 8.1 | Chuẩn bị **VPS**, firewall, SSH keepalive (theo runbook) |
| 8.2 | **DNS:** `timnhaxahoi.com` (và `www` nếu cần) bản ghi **A** → `103.72.99.131`; chờ propagate |
| 8.3 | Cài **HTTPS** (Let’s Encrypt / CDN) |
| 8.4 | Build & chạy **API + Web** (Docker Compose hoặc pm2 + nginx — chốt một cách, ghi lại) |
| 8.5 | Set **env production**: `DATABASE_URL`, JWT secret, Lark, Maps (nếu bật), `NEXT_PUBLIC_*` |
| 8.6 | Chạy **migration** production; smoke test quiz end-to-end + 1 record Lark |

**Không** deploy production trước khi có backup DB và cách rollback build.

---

## Giai đoạn 9 — Sau MVP (theo roadmap)

| Hạng mục | Mô tả |
|----------|--------|
| **SSO Super App + JWT** | **Đã có nền:** DB `superapp_uid`, `POST /auth/sync` (merge user). **Còn làm:** triển khai verify theo [JWT_CONTRACT.md](./JWT_CONTRACT.md) (họ C); luồng WebView `?mode=app`; merge user quiz-only ↔ user sau sync; rate limit. Tổng quan: [SPEC §18](./SPEC_TRIEN_KHAI.md#18-giai-đoạn-sau-mvp-đúng-spec--không-chặn-mvp). |
| **n8n** | Sau MVP — webhook tự động hóa; MVP vẫn ghi Lark Base trực tiếp. Tham chiếu `docs/ai-ops/`. |
| **Admin TM giá rẻ** | CRUD listing nhà thương mại giá rẻ (bảng riêng hoặc flag loại dự án); **KODO HQ** trước, micro-admin sau; có seed UI. |
| **CMS pháp lý** | Thay/thích hợp nội dung `/phap-ly` tĩnh bằng CMS (Strapi / MDX / admin) + quy trình biên tập. |
| PDF / Zalo sâu | Gửi báo cáo; cần OA / template |
| Giám sát | Sentry, uptime, log tập trung |

---

## Bản tóm tắt một dòng (WBS ngắn)

`0 Chuẩn bị` → `1 Scaffold app + service` → `2 DB + seed` → `3 API + rule engine` → `4 Lark` → `5 Quiz + dashboard + ?mode=app` → `6 SEO pages` → `7 Maps` *(tuỳ)* → `8 Deploy` → `9 Mở rộng`.

---

*Cập nhật file này khi thay đổi thứ tự ưu tiên sprint (ghi ngày + lý do trong commit message).*
