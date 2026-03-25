# Đặc tả triển khai — timnhaxahoi.com (Satellite Web)

> **Nguồn sự thật (single source of truth)** cho dev, nội dung và vận hành trước khi code & deploy.  
> Gộp PRD ban đầu, kiến trúc satellite, SEO, bộ 11 câu, phản biện đã chốt và bản V2.

---

## Thông tin domain & máy chủ (production — đã cung cấp)

| Hạng mục | Giá trị |
|----------|---------|
| **Domain** | `timnhaxahoi.com` |
| **IPv4 VPS (timnhaxahoi production)** | `103.72.99.131` |

**Phân tách máy:** VPS **`103.57.221.93`** dùng cho **n8n** (AI Ops) — **không** deploy stack timnhaxahoi trên IP đó. SSH timnhaxahoi (iNET): thường **`ssh -p 24700 root@103.72.99.131`** (đúng user/port theo panel).

**DNS (khi deploy):** trỏ bản ghi **A** cho `@` (và `www` / `api` nếu dùng) về **`103.72.99.131`**, trừ khi sau này dùng CDN/proxy (khi đó cập nhật lại bảng này).

**Xác nhận triển khai (ngoài repo):** Toàn bộ **DNS và thao tác tại nhà đăng ký / panel** cho **`timnhaxahoi.com`** đã nhắm đúng **IPv4 production `103.72.99.131`** từ đầu — đây là **single source of truth** cho satellite (không dùng `103.57.221.93` cho timnhaxahoi; IP đó dành cho **n8n**).

**Env / CORS / OAuth / Maps API restrict:** dùng đúng host production `https://timnhaxahoi.com` (và `www` nếu bật).

---

## 1. Mục tiêu sản phẩm

- **Vai trò:** Hệ sinh thái chuyên sâu về **nhà ở xã hội (NOXH)** tại Việt Nam: tư vấn điều kiện, thẩm định sơ bộ hồ sơ (theo rule), hoạch định tài chính, danh mục dự án; **bổ sung vertical [Tìm nhà trọ](/timnhatro)** trên cùng domain (§19); **đăng tin dự án NOXH bởi publisher có gói + workspace** và **lead qua form có lọc** (§20).
- **Triết lý thương hiệu:** **Tech-Trust** — tin cậy nhờ công nghệ, nội dung chuyên gia và trải nghiệm rõ ràng.
- **Định vị nền tảng:** Trọng tâm giao diện và thông điệp là **NOXH**. Các hướng tư vấn khác (ví dụ nhà thương mại giá rẻ) chỉ là **phần tư vấn viên xử lý khi trao đổi**, không làm lệch mục tiêu chung trên sản phẩm.

---

## 2. Phạm vi địa lý & go-to-market

| Khía cạnh | Quyết định |
|-----------|------------|
| **SEO & truyền thông** | **Toàn quốc** — tối ưu từ khóa, topic cluster, video/schema. |
| **Khai thác bán hàng / ưu tiên dữ liệu** | **Miền Nam**, chủ lực: Khánh Hòa, Đồng Nai, Bình Dương, Vũng Tàu, Bình Phước, Tây Ninh, TP.HCM, Long An, … |

Nội dung và danh mục dự án cần phản ánh rõ **ưu tiên khu vực bán hàng** trong khi vẫn cho phép mở rộng SEO toàn quốc (bài pháp lý, tài chính chung).

---

## 3. Quan hệ với Lifestyle SuperApp

- **Hiện tại:** Web app **độc lập** domain **`timnhaxahoi.com`**, có thể **VPS/DB tách** khỏi Super App để SEO & tốc độ.
- **Trải nghiệm mong muốn:** Trên Super App, mục **“Tìm nhà”** hoạt động như **một tiện ích** (tương tự các module khác): mở ra **đầy đủ tính năng web** (WebView / deep link tùy triển khai mobile).
- **SSO / đồng bộ user:** **Giai đoạn sau** khi module ổn định; DB thiết kế sẵn `superapp_uid` (nullable khi chỉ dùng web). Chi tiết công việc còn lại: [§18 — Giai đoạn sau MVP](#18-giai-đoạn-sau-mvp-đúng-spec--không-chặn-mvp).
- **Chế độ nhúng:** Query `?mode=app` — **ẩn Header/Footer** (hoặc layout gọn) để hiển thị mượt trong WebView.
- **Nhận diện Kodo trong Super App:** Chỉ áp **top bar / accent** (vàng, xanh, đỏ) theo brand Kodo; **không** phủ toàn bộ UI satellite.
- **Web độc lập (`timnhaxahoi.com` ngoài app):** Giữ **palette Tech-Trust** hiện tại (§6); bắt buộc có **dấu hiệu nhận diện liên kết Kodo** (biểu tượng **bốn lá** / “Kodo” theo guideline thương hiệu) để user nhận ra thuộc hệ sinh thái.

---

## 4. Mã nguồn trong monorepo & deploy

| Hạng mục | Quyết định |
|----------|------------|
| **Vị trí code** | Trong repo **Lifestyle_SuperApp**, tuân **workspaces** hiện có (`apps/*`, `services/*`, `packages/*`). |
| **Frontend** | `apps/web-timnhaxahoi` — **Next.js 14+ (App Router)**. |
| **Backend** | `services/timnhaxahoi-service` — **NestJS**, API headless cho web và sau này Super App. |
| **Shared** | Dùng `@lifestyle/*` khi có sẵn và phù hợp; không duplicate logic. |
| **Deploy** | **Build & ship riêng** app/service lên VPS **`103.72.99.131`** / domain **`timnhaxahoi.com`**; monorepo chỉ là nơi chứa mã — **không bắt buộc** cùng server với Super App. |

Tham chiếu quy tắc chung: `docs/architecture/README_ARCHITECTURE.md`.

---

## 5. Tech stack (chuẩn dự án)

| Lớp | Công nghệ |
|-----|-----------|
| Web | Next.js 14+, Tailwind, **shadcn/ui**, Lucide, **Framer Motion** |
| API | NestJS, REST `/api/v1/...`, JWT (chuẩn bị cho tích hợp Super App sau) |
| Maps | Google Maps API (khoảng cách, vị trí — cần key & hạn mức chi phí) |
| CRM (MVP) | **Lark Base** — ghi lead **trực tiếp qua API** từ backend |
| Tự động hóa sau | **n8n webhook** — giai đoạn khai thác sâu (không chặn MVP) |

---

## 6. Thương hiệu & UI/UX

- **Phong cách:** Modern minimal, **mobile-first**, glassmorphism nhẹ, **Bento** cho dashboard.
- **Gradient thương hiệu:** Navy `#1e3a8a` → Emerald `#10b981` (góc ~135°).  
- **Nút CTA chính, progress, header chính:** dùng brand gradient.
- **Accessibility:** Văn bản, link, focus ring phải đạt **WCAG** (không ép gradient lên mọi text).
- **Hình ảnh dự án:** `next/image`, tỉ lệ ưu tiên **16:9**.
- **Loading:** Skeleton khi chờ tính toán kết quả quiz/dashboard.
- **Nhập liệu tài chính:** Ưu tiên **slider** thay vì chỉ ô số khô.

---

## 7. Cấu trúc trang & SEO (App Router)

Các route chính (có thể tinh chỉnh slug nhưng giữ đủ mục đích):

| Route | Mục đích |
|-------|----------|
| `/` | Trang chủ: tìm kiếm dự án, CTA quiz, dự án nổi bật, video |
| `/du-an` | Danh sách dự án — **SSR** SEO, lọc quận/huyện, trạng thái, khoảng giá |
| `/du-an/[slug]` | Chi tiết từng dự án (local SEO, dòng tiền, video) |
| `/phap-ly` | Blog/wiki pháp lý — TOC, schema FAQ/Article khi áp dụng |
| `/video` | Hub video (grid / dạng vertical mobile) |
| `/dashboard` | Kết quả quiz, điểm hồ sơ, dòng tiền, CTA tư vấn |
| `/timnhatro` | **Tìm nhà trọ** — tab/vertical trong cùng domain (không subdomain riêng); chi tiết nghiệp vụ & MVP: [§19](#19-tìm-nhà-trọ-timnhatro-landlord--chuẩn-hóa-với-quy-hoạch-nền-tảng) |
| *(bổ sung)* | Trang **nhà thương mại giá rẻ** — do **admin nhập**, có **dữ liệu mẫu** ban đầu để duyệt UI |

**Meta:** Mỗi trang động cần `title`, `description`, **Open Graph** theo dự án/bài viết.

**Content pillars SEO:** (1) Theo dự án + địa phương, (2) Pháp lý & thủ tục, (3) Tài chính & vay. Cuối bài pháp lý nên có widget **“Kiểm tra điều kiện”** (quiz).

**Video:** 60–90s, cấu trúc hook → thực tế → pháp lý ngắn → CTA; **VideoObject** schema khi đủ dữ liệu.

**Trang chi tiết `/du-an/[slug]` (publisher):** Trên giao diện công khai **không** hiển thị SĐT trực tiếp của người đăng tin publisher; CTA dẫn tới **form liên hệ có lọc** (§20.3).

---

## 8. Chuyên gia & ngôn ngữ

- **Thẩm định & hỗ trợ pháp lý nội dung:** Văn phòng **Luật sư Mai Quốc Định**.
- **Ngôn ngữ sản phẩm:** **Chỉ tiếng Việt** (NOXH không áp dụng cho người nước ngoài trong phạm vi sản phẩm này).

---

## 9. Engine điều kiện & “AI”

- **Chấm điểm / phân loại sơ bộ:** **Rule deterministic** theo tiêu chí luật định và logic nội bộ đã thống nhất.
- **Trường hợp không gói hết bằng rule** hoặc biên ngôn ngữ: **tư vấn viên** xử lý sau khi lead vào CRM.
- **Không** trình bày trên UI các nhãn nội bộ kiểu “upsell TM” làm trọng tâm; hướng **đặc thư** do tư vấn viên thực hiện ngoại tuyến/qua gọi điện.

---

## 10. Trắc nghiệm 11 câu (Eligibility Quiz) — tóm tắc luồng

**Cấu trúc nội dung (theo bộ câu hỏi chuẩn):**

1. **Phần 1 — Pháp lý:** Đối tượng ưu tiên; cư trú (HK/thường trú, tạm trú + BHXH > 1 năm, hoặc không đủ); thu nhập (độc thân &lt; 15tr, vợ chồng &lt; 30tr, hoặc cao hơn / đóng thuế); sở hữu nhà (&lt; 15m²/người, v.v.).
2. **Phần 2 — Vị trí & dự án:** Địa chỉ làm việc (Maps); chọn **tối đa 3 dự án ưu tiên** từ danh mục; nếu khu vực không có dự án → thông báo và yêu cầu chọn lại từ danh sách đang triển khai.
3. **Phần 3 — Tài chính:** Vốn tự có + vốn huy động; nhu cầu vay; khả năng trả hàng tháng.
4. **Phần 4 — Liên hệ & nhu cầu tư vấn:** Mong muốn hỗ trợ (pháp lý / tài chính / thực địa dự án).

**Funnel bắt buộc (lead):**

- **Một ô số điện thoại** — giả định **SĐT trùng với Zalo**.
- **Email** — bắt buộc để nhận tư vấn đầy đủ và chăm sóc sau.
- Điều kiện này là **cổng nhận báo cáo / file tư vấn** và là **nguồn lead bán hàng**.

**Tái sử dụng khi gửi form liên hệ dự án (§20.3.2):** Nếu user đã có quiz/`quiz_analytic` lưu, **không** bắt nhập lại toàn bộ câu hỏi — chỉ hỏi **Có/Không** “cập nhật / điều chỉnh hồ sơ” rồi dùng dữ liệu đã có hoặc nhánh chỉnh sửa.

---

## 11. Phân loại lead (CRM) — bảng truth cần triển khai trong code

> **Yêu cầu:** Một file/module duy nhất (ví dụ `eligibility-truth.ts` hoặc bảng config) map **boolean điều kiện → `lead_segment` + `score` 1–100**.  
> Dưới đây là **định nghĩa nghiệp vụ** đã thống nhất; dev cụ thể hóa điều kiện boolean từ JSON quiz.

| Segment (mã gợi ý) | Tên gọi vận hành | Điều kiện tóm tắt (cần chi tiết hóa trong code) | Hành động vận hành |
|--------------------|------------------|-----------------------------------------------|---------------------|
| `GREEN` | Tiềm năng cao (Xanh) | Đủ điều kiện pháp lý theo rule + **vốn tự có ≥ ~20%** (hoặc ngưỡng đã chốt trong bảng chi tiết) + đã chọn **ưu tiên 1** hợp lệ + tài chính đạt ngưỡng | Ưu tiên Sales / gọi nhanh |
| `YELLOW` | Tư vấn thêm (Vàng) | Pháp lý gần đủ nhưng vướng **thu nhập hoặc cư trú** (một điểm nghẽn), tài chính tạm ổn | Luật sư / tư vấn pháp lý |
| `RED` | Chưa đủ điều kiện (Đỏ) | Không thuộc đối tượng NOXH theo rule (vd. đã có nhà đủ diện tích) **hoặc** tài chính quá yếu | Nurture: tài liệu, lộ trình sau |
| `ORANGE_SPECIAL` | Đặc thù / Cam (nội bộ) | **Thu nhập &gt; 30 triệu/tháng** (hoặc nhánh tương đương đã map từ câu hỏi) — **hồ sơ đặc thù**, không dùng UI để đẩy mạnh TM | Tư vấn viên xử lý; có thể kèm TM trong trao đổi, **không** làm lệch messaging chính của site |

**Điểm uy tín 1–100:** Hiển thị gauge; band gợi ý (vd. 80–100 “kim cương”, 50–79 “cần bổ sung pháp lý”) — đồng bộ công thức với bảng truth trong code.

**Lưu ý:** Tên hiển thị cho user có thể dùng ngôn từ trung tính (“Kết quả sơ bộ”, “Cần tư vấn thêm”); **mã CRM** giữ enum ổn định.

---

## 12. Mô hình dữ liệu (chuẩn hóa)

### 12.1 `users_satellite` (hoặc tên bảng tương đương)

- `id` (PK)  
- `superapp_uid` (nullable)  
- `phone_number`, `email`, `full_name` (điền theo funnel)  
- `lead_segment` (enum: GREEN / YELLOW / RED / ORANGE_SPECIAL)  
- `profile_score` (1–100, nullable cho tới khi hoàn thành quiz)  
- timestamps

### 12.2 `housing_projects`

- `id`, `name`, `slug`  
- `location` (lat/lng), địa chỉ hiển thị  
- `price_per_m2` hoặc khoảng giá, `total_units`, `status`  
- `legal_score` (do admin / pháp lý cập nhật)  
- `images`, `videos_url`, `legal_info` (text/JSON tùy thiết kế)
- **Nguồn tin & publisher (mở rộng §20):**  
  - `source`: `ADMIN` | `PUBLISHER` (dự án do **KODO/Admin nhập** hay do **tài khoản đăng tin NOXH** sau duyệt gói).  
  - `publisher_account_id` (nullable FK → tài khoản publisher NOXH).  
  - **SĐT / kênh liên hệ trực tiếp của người đăng:** lưu DB phục vụ workspace & thông báo; **API public + UI trang `/du-an/[slug]` không trả/hiển thị** (chỉ liên hệ qua form có lọc — §20).

### 12.3 `quiz_analytic`

- `id`, `user_id` (FK)  
- `raw_data` (JSON 11 câu + metadata)  
- `calculated_score`  
- `recommended_project_ids` (tối đa 3)

### 12.4 Nhà thương mại giá rẻ (bảng riêng hoặc flag `project_type`)

- Admin nhập; **dữ liệu mẫu** cho giai đoạn duyệt giao diện.

### 12.5 Tách **Rental** (nhà trọ) và **Buy** (NOXH / mua) trên cùng Postgres

- **Một** instance PostgreSQL (cùng DB với satellite hiện tại trên VPS `103.72.99.131`), **hai nhóm bảng/schema logic** rõ ràng:  
  - **Buy / NOXH:** vd `housing_projects`, `quiz_analytic`, **publisher NOXH** & lead dự án (§20), …  
  - **Rental / timnhatro:** bảng cho tin phòng, chủ trọ, gói đăng tin, form liên hệ, moderation (§19) — **không** trộn bảng rental với bảng dự án trừ khi FK có chủ đích.  
- Mục tiêu: truy vấn, migration và quyền vận hành **tách biệt khái niệm**, không bắt buộc hai database vật lý.

---

## 13. API REST (phiên bản 1)

Base: `/api/v1`

| Method | Path | Mô tả |
|--------|------|--------|
| POST | `/auth/sync` | Đồng bộ / upsert user satellite; **MVP:** gọi được từ tooling/backend với `phone` + `email` (+ tuỳ chọn `superappUid`). **Sau MVP:** bảo vệ bằng JWT / chữ ký từ Super App (xem §18). |
| GET | `/projects` | Danh sách + lọc quận/huyện, trạng thái, giá |
| GET | `/projects/:slug` | Chi tiết (SEO + app) |
| POST | `/ai/eligibility-check` | Input: payload quiz; Output: segment, score, message, gợi ý dự án |
| GET | `/user/dashboard` | Dashboard sau quiz (cần auth/session theo thiết kế) |
| POST | `/leads/convert` | Ghi nhận chuyển tư vấn sâu (đồng bộ Lark Base) |
| *(mở rộng §20)* | `POST /projects/:slug/contact` *(tên path tùy chốt)* | Form liên hệ **dự án NOXH:** body gồm bước **khai báo/lọc** (cùng triết lý quiz §10–§11) + SĐT/email người hỏi; **không** trả SĐT publisher. |
| *(mở rộng §20)* | Workspace publisher (auth) | CRUD draft/publish dự án “tôi đăng”, xem lead đã lọc, cấu hình thông báo — tách route cụ thể khi implement. |

**Bảo mật:** JWT chuẩn bị cho luồng Super App; rate limit cho endpoint public quiz/lead.

---

## 14. Lark Base (MVP)

- **Ghi record trực tiếp từ backend** (HTTP API Lark), không phụ thuộc n8n trong MVP.
- **Cột tối thiểu gợi ý:** `lead_segment`, `phone`, `email`, `quiz_json`, `score`, `superapp_uid` (null), `created_at`, `source` (web / app sau này).
- **n8n / webhook:** triển khai **sau** cho tự động hóa marketing / phân công.

*(Credentials: app token, table ID — cấu hình env trên server, không commit.)*

---

## 15. Trách nhiệm thông tin hiển thị

- Đội chủ sản phẩm / luật xác định nội dung “Góc luật sư” và cập nhật khi văn bản pháp lý thay đổi.
- Kết quả quiz là **mô hình nội bộ + rule**; copy UI tránh hứa **tỉ lệ phê duyệt cụ thể** nếu không có cơ sở đo lường.

---

## 16. Checklist triển khai MVP (gợi ý thứ tự)

Chi tiết **từng bước, giai đoạn, phụ thuộc**: [KE_HOACH_TRIEN_KHAI_TUNG_BUOC.md](./KE_HOACH_TRIEN_KHAI_TUNG_BUOC.md).

1. Khởi tạo `apps/web-timnhaxahoi` + `services/timnhaxahoi-service` trong monorepo; CI build tách package.  
2. Migration DB: 3 bảng chính + enum segment.  
3. Module **bảng truth** + unit test cho các case biên (thu nhập, cư trú, nhà ở, vốn).  
4. API `eligibility-check` + lưu `quiz_analytic` + cập nhật `users_satellite`.  
5. Tích hợp **Lark Base** (env, service ghi record).  
6. UI quiz multi-step + trang kết quả + skeleton.  
7. Trang `/du-an` SSR + `[slug]` + dữ liệu mẫu.  
8. `?mode=app` layout.  
9. Deploy staging/production lên VPS `103.72.99.131` / `timnhaxahoi.com`; DNS A record, HTTPS, biến môi trường.  
10. *(Sau)* [§18](#18-giai-đoạn-sau-mvp-đúng-spec--không-chặn-mvp) — SSO/JWT, n8n, admin TM, CMS pháp lý; PDF/Zalo nếu đưa vào roadmap.

---

## 17. Tham chiếu nội bộ monorepo

- Kiến trúc & clean code: `docs/architecture/README_ARCHITECTURE.md`  
- Deploy VPS (khi áp dụng): `docs/QUY_TRINH_TRIEN_KHAI_DEPLOY.md`  
- Docker, CI, Maps & vận hành timnhaxahoi: [DEPLOY_VA_VAN_HANH.md](./DEPLOY_VA_VAN_HANH.md)  
- Contract JWT (dashboard / Super App / auth sync): [JWT_CONTRACT.md](./JWT_CONTRACT.md)  
- Giám sát (Sentry, uptime, log): [OBSERVABILITY.md](./OBSERVABILITY.md)  
- AI Ops / Lark / n8n (giai đoạn sau): `docs/ai-ops/`  
- **Scaffold code & lệnh chạy:** [README_SCAFFOLD.md](./README_SCAFFOLD.md)

---

## 18. Giai đoạn sau MVP (đúng SPEC — không chặn MVP)

Các hạng mục dưới đây **không** bắt buộc cho MVP satellite web; triển khai khi product & kỹ thuật Super App sẵn sàng.

### 18.1 JWT / SSO Super App và `POST /auth/sync`

**Đã có trong codebase (chuẩn bị):**

- `POST /api/v1/auth/sync` — body: `phone`, `email`, tuỳ chọn `fullName`, tuỳ chọn `superappUid`.
- Bảng `users_satellite.superapp_uid` (unique, nullable), logic merge / xung đột cơ bản trong `AuthService.sync`.

**Việc làm sau MVP (đúng luồng SSO):**

1. **Xác thực nguồn gọi:** không để endpoint đồng bộ mở cho bất kỳ client nào giả mạo `superappUid`. Ưu tiên: JWT do **identity chung** (vd `main-api` / dịch vụ auth Super App) ký — **contract chi tiết (iss, aud, purpose, binding email/phone):** [JWT_CONTRACT.md](./JWT_CONTRACT.md) *(họ C — Auth sync assertion)*.
2. **Luồng WebView / deep link:** Super App mở `timnhaxahoi.com?mode=app` kèm token ngắn hạn hoặc trao đổi mã một lần → web hoặc native gọi `POST /auth/sync` với payload đã được server Super App xác nhận.
3. **Gắn với quiz-only user:** khi user đã làm quiz (chỉ có `dashboardToken` / cookie nội bộ), định nghĩa rule **merge** `user_id` với tài khoản sau khi sync (tránh trùng lead / mất lịch sử).
4. **Rate limit & audit:** giới hạn theo IP / theo `superappUid`, log tối thiểu cho vận hành.

**JWT dashboard hiện tại** (sau `eligibility-check`) phục vụ **trải nghiệm web**; JWT/SSO Super App là **lớp identity riêng**, bổ sung chứ không thay thế toàn bộ trừ khi thống nhất một token.

### 18.2 n8n (sau MVP)

- MVP: **Lark Base trực tiếp** từ backend (đã mô tả §14).
- Sau MVP: webhook n8n cho marketing, phân công, nhắc lịch — tham chiếu `docs/ai-ops/`; **không** chặn ship MVP nếu chưa có workflow.

### 18.3 Admin nhập nhà thương mại giá rẻ (TM giá rẻ)

- SPEC §7 / §12.4: trang / dữ liệu **không** làm lệch trọng tâm NOXH; nội dung do **admin nhập**, có seed để duyệt UI.
- **Quản trị:** theo [kiến trúc hai tầng](../ADMIN_ARCHITECTURE_TWO_TIERS.md) — **KODO HQ** full CRUD trước; micro-site admin (nếu có) chỉ scope satellite.
- Kỹ thuật: bảng riêng hoặc `project_type` / flag trên `housing_projects` + API admin bảo vệ role; frontend route (vd `/nha-thuong-mai-gia-re` hoặc tương đương) đọc từ API.

### 18.4 CMS nội dung pháp lý (`/phap-ly`)

- MVP có thể giữ **nội dung tĩnh / file trong repo** (vd module articles) để ship nhanh.
- Sau MVP: chuyển dần sang **CMS** (Strapi, MDX + git, hoặc admin nội bộ) — versioning, draft, phân quyền biên tập; vẫn tuân trách nhiệm nội dung §15.

---

## 19. Tìm nhà trọ (`/timnhatro`), Landlord — chuẩn hóa với quy hoạch nền tảng

> Nguồn ý tưởng: quy hoạch “Nền tảng BĐS toàn diện” (PDF nội bộ). **Đoạn dưới là chốt nghiệp vụ** để dev không lệch (đặc biệt: **không** “đặt hàng” phòng trọ qua nền tảng).

### 19.1 URL & định vị

- **Một tab** trên cùng domain: **`https://timnhaxahoi.com/timnhatro`** (không subdomain `timnhatro.*`, không domain tách).
- SEO, menu chính và biến môi trường web phải phản ánh route này khi triển khai.

### 19.2 Luồng người tìm trọ (MVP) — **không giao dịch tiền thuê trên nền tảng**

- **Không** API / chức năng **đặt hàng, giữ chỗ, thanh toán cọc** giữa người thuê và chủ trọ. **Không** quản lý số tiền giao dịch giữa hai bên.
- Nền tảng chỉ **kết nối & minh bạch hóa thông tin**; tập quán: người thuê **chủ động gọi** chủ trọ; bổ sung **để lại SĐT / form** để chủ trọ liên hệ lại.
- **Lọc theo POI** (tâm điểm bản đồ) là phần cốt lõi MVP.
- **Form liên hệ thông minh:** backend luôn biết ngữ cảnh **đang liên hệ về dự án NOXH** hay **tin nhà trọ cụ thể** → route thông báo/CRM tới **đúng người đăng tin** / quản lý để tư vấn (không nhầm lead).

### 19.3 Chủ trọ / người đăng tin — gói VIP & Thường, duyệt Admin

- Muốn **đăng tin & dùng workspace quản lý nhà trọ:** phải **đăng ký** và chọn **một trong hai gói: VIP / Thường** (thanh toán **chỉ** áp dụng cho **phí gói đăng tin**, không phải tiền thuê).
- Sau khi **Admin duyệt**, mới **bật** quyền đăng tin + giao diện quản lý (Landlord workspace theo roadmap).
- **Người chỉ tìm trọ:** tài khoản **người dùng thông thường**; **không** đồng nhất với role chủ trọ (không bắt buộc đăng ký gói để xem tin — trừ khi sau này có rule khác, mặc định đọc tin công khai).

### 19.4 Thanh toán & “hợp đồng điện tử” (đúng nghĩa sản phẩm)

- **Thanh toán ON-platform:** chỉ **gói đăng ký của chủ trọ** (VIP / Thường).
- **Copy cảnh báo UX:** nền tảng **chỉ hỗ trợ kết nối**; khuyến cáo giao dịch **với chủ tin đã verified** để giảm lừa đảo.
- **Hợp đồng mẫu:** cung cấp **bản/hợp đồng mẫu** để hai bên **theo dõi, đối chiếu minh bạch**; nền tảng **không phát hành** hợp đồng và **không chịu trách nhiệm pháp lý** thay các bên.  
- **Ràng buộc tin:** tin đăng ký dùng hợp đồng mẫu làm **căn cứ** để kiểm tra **hợp lý / khớp thông tin đăng** (chống gian lận, lạm dụng) — chi tiết quy tắc do SP + pháp lý chốt khi implement.

### 19.5 Thông báo & moderation

- **Kênh thông báo (MVP):** **in-app + email**; **không** Zalo OA / SMS ở giai đoạn đầu (có thể mở rộng sau).
- **Báo cáo tin xấu / tin ảo:** có **kháng nghị**, **log moderating**, **SLA** xử lý để **chống lạm dụng cạnh tranh** (không chỉ “>3 báo cáo là gỡ” máy móc mà không có quy trình).

### 19.6 Video

- **Không** lưu file video nặng trên VPS làm mặc định. Quy trình: **đưa video gốc lên kênh YouTube chính thức** của nền tảng → **embed URL** trên card/ trang chi tiết (tiết kiệm băng thông, tích lũy kênh YouTube).

### 19.7 Ghi chú đối chiếu tài liệu PDF nội bộ

- Các mục trong PDF kiểu **“chốt chỉ số điện nước / chốt hóa đơn / thông báo Zalo”** thuộc **Landlord workspace** sau MVP duyệt gói; **không** áp vào luồng **người tìm trọ đặt hàng** vì **đã loại** chức năng đó.

---

## 20. Đăng tin dự án NOXH (publisher) — gói VIP/Thường, workspace, lead có lọc

> **Đối xứng nghiệp vụ** với chủ trọ (§19): bên **đăng tin dự án NOXH** cũng qua **đăng ký gói (VIP / Thường)** + **Admin duyệt** + **workspace** quản lý tin. **Khác** chỗ **tiếp cận lead**: **ẩn SĐT người đăng** trên trang công khai; **bắt buộc** đi qua **form liên hệ** kèm **khai báo/lọc đối tượng** (cùng tinh thần **quiz / bảng truth** §10–§11) để **lead chất lượng**.

### 20.1 Ai được đăng dự án NOXH lên site?

- **Không** thay thế hoàn toàn kênh **Admin/KODO** nhập dự án (§12.2 `source=ADMIN`) — vẫn cần cho dữ liệu chủ lực & kiểm soát pháp lý.
- **Publisher** (chủ đầu tư / đại lý / đối tác được ủy quyền — định nghĩa chi tiết & hợp đồng ngoài SPEC) đăng ký **gói VIP hoặc Thường**, **thanh toán phí gói** (cùng nguyên tắc §19.4: **không** phải tiền mua nhà trên nền tảng).
- Sau **Admin duyệt** tài khoản + gói: bật **NOXH Publisher workspace** (đăng/sửa draft, gửi duyệt hiển thị nếu có bước kiểm — do SP chốt).

### 20.2 Workspace publisher NOXH (đối xứng Landlord)

- Quản lý **danh sách dự án do mình đăng** (CRUD theo quyền), trạng thái tin, gói hiện tại, lead nhận được.
- **Không** hiển thị SĐT publisher trên **API public** / **trang công khai** `/du-an/[slug]` (dữ liệu lưu phục vụ nội bộ & thông báo sau khi có lead hợp lệ).

### 20.3 Liên hệ về dự án — chỉ form, có lọc như quiz, bảo mật & tái dùng hồ sơ quiz

#### 20.3.1 Hiển thị công khai & vai trò **người đăng chủ động gọi lại**

- **Trang chi tiết** (`/du-an/[slug]`): **không** hiển thị **SĐT (hoặc kênh gọi trực tiếp)** của **người đăng** publisher trên UI/API public.
- **Luồng ưu tiên bảo mật:** sau khi người hỏi gửi form hợp lệ, **người đăng** (publisher) **chủ động gọi lại** người hỏi — tránh lộ SĐT người đăng ra ngoài và **giảm rò rỉ** hồ sơ nhạy cảm qua kênh công cộng (chỉ dữ liệu cần thiết cho bên đã xác thực workspace).

#### 20.3.2 Form liên hệ & lọc đối tượng

- **CTA:** “Để lại thông tin — được tư vấn” (hoặc tương đương); **bắt buộc** qua form (không hiện số gọi thẳng người đăng).
- **Tái sử dụng kết quả quiz đã lưu (§10, `quiz_analytic` / hồ sơ user):**  
  - Nếu hệ thống đã có bản ghi quiz/hồ sơ cho người dùng hiện tại: **chỉ hiển thị một bước xác nhận** dạng **“Bạn có muốn cập nhật / điều chỉnh thông tin hồ sơ không?”** với lựa chọn **Có / Không**.  
  - **Không:** dùng **snapshot hồ sơ & phân loại đã có** làm đầu vào lọc lead (có thể kèm `lead_segment` / điểm sẵn có) — **không** bắt làm lại toàn bộ bài quiz.  
  - **Có:** mở luồng **điều chỉnh** (màn hình rút gọn hoặc full quiz tùy SP) rồi mới gửi lead.
- Nếu **chưa có** hồ sơ quiz: áp dụng **bước khai báo / rút gọn quiz** như trước (module truth §11).
- **Backend:** lưu `project_contact_lead` với `project_id`, `publisher_id`, `qualification_raw` (JSON, có thể tham chiếu `quiz_analytic_id` hoặc bản sao cố định lúc gửi), `segment`/`score`, nguồn `web`.
- **Chất lượng lead:** ngưỡng ưu tiên / nhãn nurture như §11 (SP chốt).

#### 20.3.3 Email thông báo cho người đăng tin — **bảng tóm tắt + phương thức liên hệ**

- **Email** gửi publisher **không** thay thế toàn bộ chính sách bảo mật: nội dung **tối thiểu** gồm:
  - **Bảng tóm tắt lead:** dự án (`slug`/tên), thời gian gửi, **segment** / mức phù hợp, các mục khai báo chính (dạng đã tóm tắt, không nhét nguyên JSON thô nếu không cần).
  - **Phương thức liên hệ:** hướng dẫn **bước tiếp theo** để publisher **liên hệ lại người hỏi** trong **môi trường đã xác thực** — mặc định khuyến nghị: **đăng nhập NOXH Publisher workspace → mục Lead / chi tiết lead** để xem **SĐT & email người hỏi** và **chủ động gọi**. *(Tuỳ chính sách SP: có thể bổ sung OTP/“mở khóa lead” trước khi hiện đầy đủ SĐT.)*
- **Lark / CRM:** nếu đồng bộ (§14), payload nên **cùng cấu trúc tóm tắt**; trường nhạy cảm chỉ trong luồng đã auth nơi có.

#### 20.3.4 Đồng bộ CRM (giữ)

- Có thể tái sử dụng **Lark Base** (§14) với cột: `project_slug`, `publisher_id`, `contact_type=NOXH_PROJECT`, cùng nguyên tắc **không lộ SĐT người đăng** ra bản ghi công khai.

### 20.4 Moderation & uy tín

- Tin dự án do publisher: **verified / báo cáo / SLA** áp dụng **cùng triết lý** §19.5 khi có nội dung gây hiểu nhầm hoặc tranh chấp thông tin dự án.
- **Pháp lý & chữ đúng:** vẫn tuân §15; nội dung nhạy cảm có thể yêu cầu **Admin duyệt** trước khi `published`.

### 20.5 Triển khai kỹ thuật (gợi ý)

- Cùng DB Postgres: mở rộng `housing_projects` + bảng `noxh_publisher_accounts` (hoặc **một** bảng `advertiser_accounts` với `vertical ∈ { RENTAL, NOXH }` + gói + trạng thái duyệt — chốt một schema khi dev).
- Deploy: **cùng** stack Docker hiện tại (`timnhaxahoi-api` / `web-timnhaxahoi`), migration tuần tự, build lại image khi đổi `NEXT_PUBLIC_*`.

---

*Tài liệu này có thể cập nhật version trong commit khi thay đổi rule hoặc schema.*
