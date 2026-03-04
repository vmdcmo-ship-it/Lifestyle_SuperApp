# Đề Xuất Cấu Trúc Web User – Tối Ưu SEO & Mục Tiêu Kinh Doanh

> **Phân tích**: So sánh ý tưởng Silo Structure, KODO Wealth với cấu trúc hiện tại và đề xuất giải pháp triển khai.
>
> **Trạng thái**: Phase 1, 2, 3 đã triển khai (cập nhật sau khi hoàn thiện ý tưởng).

---

## 1. Tổng Quan Ý Tưởng Của Bạn

### 1.1 Silo Structure (vmd.asia / web)

| Silo | Mục đích | Sub-routes đề xuất |
|------|----------|-------------------|
| **`/`** | Landing, tổng quan ecosystem, nút tải app | — |
| **`/spotlight/`** | Video Review Content Hub (SEO) | `/an-uong`, `/diem-den`, `/phong-cach` |
| **`/cong-dong/`** | Sports Hub – Tennis, Pickleball, Run to Earn | `/tin-tuc`, `/clb-ban-chuyen-nghiep/Tennis`, `/Pickleball` |
| **`/thinh-vuong/`** | Kiến thức & Bảo hiểm (KODO Wealth) | — |
| **`/phap-ly/`** | Thông tin pháp lý – công ty, điều khoản, quyền riêng tư | — |
| **`/affiliate/`** | Trang trung gian cho tracking (Shopee, Booking, Cross Selling) | — |

### 1.2 KODO Wealth (Thịnh Vượng)

**Topic Clusters (4 lớp nội dung):**

| Lớp | Từ khóa mục tiêu | Mục tiêu chuyển đổi |
|-----|------------------|---------------------|
| L1 – Truyền cảm hứng | Bí mật may mắn, Tự do tài chính tuổi 30, Lãi suất kép… | Traffic, Time on Page |
| L2 – Công cụ (Lead Magnet) | Bảng tính kế hoạch, Máy tính nghỉ hưu, App quản lý chi tiêu | Thu thập Email/SĐT |
| L3 – Chuyển giao rủi ro | Bảo vệ tài sản, Tại sao người giàu mua bảo hiểm | Cầu nối giáo dục bảo hiểm |
| L4 – Sản phẩm | Bảo hiểm sức khỏe online, Tính phí BH nhân thọ | Chốt đơn / Tư vấn |

**UI/UX KODO Wealth:**

- Hero: Công cụ tính nghỉ hưu ("Bạn muốn nghỉ hưu với bao nhiêu tiền?")
- Thư viện kiến thức: Card layout, tạp chí tài chính sang trọng
- Khiên chắn tài sản: Headline mạnh, widget tính quyền lợi bảo hiểm
- Cấu trúc Next.js: `/wealth`, `/wealth/knowledge/[slug]`, `/wealth/tools/*`, `/wealth/products/*`, `/wealth/consulting`

---

## 2. Cấu Trúc Hiện Tại (Đánh Giá)

### 2.1 Routes Web Đang Có

| Route | Trạng thái | Ghi chú |
|-------|------------|---------|
| `/` | ✅ Có | Landing, có CTA App Store/Google Play |
| `/spotlight` | ✅ Có | Feed, tabs, categories, creator, saved, create |
| `/spotlight/[id]` | ✅ Có | Chi tiết video |
| `/spotlight/creator/[id]` | ✅ Có | Trang creator |
| `/food-delivery` | ✅ Có | Landing dịch vụ |
| `/ride-hailing` | ✅ Có | Landing dịch vụ |
| `/shopping` | ✅ Có | Landing dịch vụ |
| `/wallet` | ✅ Có | Ví Lifestyle |
| `/savings-packages` | ✅ Có | Gói tiết kiệm |
| `/lifestyle-xu` | ✅ Có | Loyalty Xu |
| `/referral` | ✅ Có | Giới thiệu bạn bè |
| `/news/[slug]` | ✅ Có | Tin tức |
| `/training/[slug]` | ✅ Có | Tài liệu đào tạo |
| `/content/[slug]` | ✅ Có | Nội dung tĩnh |
| `/terms` | ✅ Có | Điều khoản |
| `/privacy` | ✅ Có | Chính sách bảo mật |
| `/about` | ✅ Có | Về chúng tôi |
| `/contact` | ✅ Có | Liên hệ |
| `/help` | ✅ Có | Trợ giúp |
| `/wealth` | ❌ Chưa có | KODO Wealth |
| `/cong-dong` | ❌ Chưa có | Sports Hub |
| `/phap-ly` | ❌ Chưa có | Hub pháp lý |
| `/affiliate` | ❌ Chưa có | Affiliate tracking |

### 2.2 Spotlight Categories (Backend)

Hiện có: `travel`, `food`, `resort`, `experience`, `service_review`, `lifestyle`.

**Ánh xạ với Silo đề xuất:**

- `an-uong` → `food` (đã có)
- `diem-den` → `travel` + `resort` (gộp hoặc thêm route)
- `phong-cach` → `lifestyle` (đã có)

### 2.3 Bảo Hiểm trong Hệ Thống

- Mobile: Bảo hiểm TNDS, gói bảo hiểm đầy đủ
- Backend: Schema `insurance`, `InsuranceProduct`, `InsurancePolicy`, `InsuranceClaim`
- Web: Chưa có trang bảo hiểm riêng, chưa có funnel KODO Wealth

### 2.4 Sitemap SEO

- Hiện tại: `about`, `contact`, `privacy`, `terms` + các service pages
- Thiếu: `/spotlight`, `/news/*`, `/content/*`, `/training/*` (quan trọng cho SEO)

---

## 3. Đề Xuất Giải Pháp Tối Ưu

### 3.1 Nguyên Tắc Chọn

1. **Giữ tương thích** với cấu trúc monorepo, tech stack (Next.js 14, NestJS)
2. **Tận dụng tối đa** cấu trúc đã có (Spotlight, Content, News)
3. **Thêm mới** theo đúng Silo Structure và Topic Clusters
4. **SEO-first**: canonical URLs, sitemap động, metadata từng silo

### 3.2 Cấu Trúc Thư Mục Đề Xuất (Next.js App Router)

```
apps/web/app/
├── page.tsx                    # Landing (giữ, bổ sung CTA rõ hơn)
├── spotlight/
│   ├── page.tsx                # Hub chính (đã có)
│   ├── an-uong/page.tsx        # 🆕 Silo sub: Ẩm thực (filter category=food)
│   ├── diem-den/page.tsx       # 🆕 Silo sub: Điểm đến (filter travel+resort)
│   ├── phong-cach/page.tsx     # 🆕 Silo sub: Phong cách sống (filter category=lifestyle)
│   ├── [id]/page.tsx
│   ├── creator/[creatorId]/page.tsx
│   └── ...
├── cong-dong/                  # 🆕 Sports Hub
│   ├── page.tsx                # Hub tổng
│   ├── tin-tuc/page.tsx        # Tin tức thể thao (dùng News)
│   └── clb-ban-chuyen-nghiep/
│       ├── Tennis/page.tsx
│       └── Pickleball/page.tsx
├── wealth/                     # 🆕 KODO Wealth (Thịnh vượng)
│   ├── page.tsx                # Landing + Hero Calculator
│   ├── knowledge/
│   │   ├── page.tsx            # Thư viện kiến thức (L1, L3)
│   │   └── [slug]/page.tsx     # Chi tiết bài (Bi-mat-cua-may-man...)
│   ├── tools/
│   │   ├── retirement-calculator/page.tsx    # L2 Lead Magnet
│   │   ├── insurance-benefit-calc/page.tsx   # L3 Widget
│   │   └── page.tsx            # Danh sách công cụ
│   ├── products/
│   │   ├── page.tsx            # Danh mục bảo hiểm (L4)
│   │   └── [product-id]/page.tsx
│   └── consulting/page.tsx     # Đăng ký tư vấn 1-1
├── phap-ly/                    # 🆕 Hub pháp lý (redirect/consolidate)
│   ├── page.tsx                # Index: Điều khoản, Bảo mật, Tiêu chuẩn cộng đồng...
│   ├── dieu-khoan/page.tsx     # → /terms
│   ├── chinh-sach-bao-mat/page.tsx  # → /privacy
│   └── tieu-chuan-cong-dong/page.tsx  # 🆕 (nếu có)
├── affiliate/
│   └── page.tsx                # 🆕 Trang trung gian (301/tracking)
├── terms/page.tsx              # Giữ (có thể redirect từ phap-ly)
├── privacy/page.tsx            # Giữ
└── ...
```

### 3.3 Mapping Silo ↔ Route ↔ Backend

| Silo | Route | Nguồn dữ liệu |
|------|-------|----------------|
| Spotlight | `/spotlight`, `/spotlight/an-uong`, ... | `Redcomment`, `SpotlightCategory` |
| Cộng đồng | `/cong-dong`, `/cong-dong/tin-tuc`, ... | `News`, `Content` + mở rộng nếu cần |
| Thịnh vượng | `/wealth` | `Content`, `InsuranceProduct`, custom calculators |
| Pháp lý | `/phap-ly/*` | `LegalDocument`, `Content` |
| Affiliate | `/affiliate` | Static / redirect + UTM |

### 3.4 Chiến Lược Triển Khai Theo Giai Đoạn

#### Phase 1 – Quick Wins (1–2 tuần)

1. **SEO cơ bản**
   - Bổ sung `/spotlight`, `/news`, `/content`, `/training` vào `sitemap.ts`
   - Metadata đầy đủ cho từng silo (title, description, Open Graph)
   - Breadcrumb schema (JSON-LD) cho Spotlight sub-routes

2. **Spotlight Silo sub-routes**
   - Tạo `/spotlight/an-uong`, `/spotlight/diem-den`, `/spotlight/phong-cach`
   - Mỗi trang là filter `category=food`, `travel|resort`, `lifestyle` (hoặc mapping tương đương)
   - Có thể dùng `slug` category hiện có: `food`, `travel`+`resort`, `lifestyle`

#### Phase 2 – KODO Wealth (2–4 tuần)

1. Tạo layout `/wealth` với theme sang trọng (vàng kim, xanh đen, trắng sứ)
2. Hero: Công cụ tính nghỉ hưu (input số tiền → hiển thị kế hoạch, CTA tải PDF/Kế hoạch)
3. Thư viện kiến thức: Card layout, categories (Tư duy triệu phú, Công cụ quản trị, Câu chuyện thành công)
4. Section "Khiên chắn tài sản": Headline + widget tính quyền lợi bảo hiểm
5. `/wealth/products`: Danh sách `InsuranceProduct` từ API
6. `/wealth/consulting`: Form đăng ký tư vấn (lead capture)

#### Phase 3 – Cộng Đồng & Pháp Lý (1–2 tuần)

1. `/cong-dong`: Hub thể thao – nội dung từ News/Content, filter theo category
2. `/phap-ly`: Hub pháp lý – aggregate links điều khoản, bảo mật, tiêu chuẩn cộng đồng
3. `/affiliate`: Trang landing đơn giản + UTM params, redirect tới Shopee/Booking khi cần

### 3.5 Công Cụ & Forms (KODO Wealth)

- **Retirement Calculator**: Input "Số tiền muốn nghỉ hưu" + độ tuổi → Output: Số tiền cần tích lũy, gợi ý gói tiết kiệm/đầu tư
- **Insurance Benefit Calculator**: Tuổi + nhu cầu (gia đình, giáo dục con, v.v.) → Gợi ý gói bảo hiểm
- **Lead Magnet**: Tải "Bản kế hoạch tài chính chi tiết" sau khi nhập email/SĐT
- Các form có thể tái sử dụng logic từ worksheet "MỤC TIÊU GIÁO DỤC CHO CON", "CHI PHÍ CUỘC SỐNG GIA ĐÌNH", "CHI PHÍ SINH HOẠT KHI NGHỈ HƯU" (A–B=C, Giải pháp cho C)

### 3.6 Theme & UX KODO Wealth

- Màu sắc: Vàng kim (#D4AF37), Xanh đen (#0D1B2A), Trắng sứ (#FAF9F6)
- Typography: Font sang trọng (Be Vietnam Pro đã dùng, có thể thêm font display cho headline)
- Cards: Shadow nhẹ, border tinh tế, trích dẫn Pareto 80/20, Tam giác tài chính
- Ứng dụng khung "28.000 ngày" cho storytelling (các giai đoạn cuộc đời → nhu cầu tài chính)

---

## 4. Đối Chiếu Với Architecture

| Yêu cầu | Đề xuất | Ghi chú |
|---------|---------|---------|
| Next.js 14 App Router | ✅ Đúng chuẩn | Dùng route groups nếu cần |
| Clean Code, TS strict | ✅ Tuân thủ | Components tách file, hooks riêng |
| Server Components | ✅ | Page fetch data server-side khi có thể |
| Workspace packages | ✅ | Dùng `@lifestyle/types`, `@lifestyle/shared` khi cần |
| SEO metadata | ✅ | Metadata mỗi page, sitemap động |

---

## 5. Đề Xuất Cụ Thể

### 5.1 Đề Xuất A – Triển Khai Đầy Đủ (Khuyến nghị)

- Phase 1 + 2 + 3 như trên
- Spotlight sub-routes dùng query `?category=...` thay vì route mới nếu muốn nhanh; route riêng `/an-uong`, `/diem-den`, `/phong-cach` tốt hơn cho SEO

### 5.2 Đề Xuất B – Tối Thiểu (Nếu tài nguyên hạn chế)

- Chỉ Phase 1 (SEO + Spotlight sub-routes)
- `/wealth` đơn giản: 1 trang landing + Hero Calculator + link tới bảo hiểm hiện có (mobile) hoặc form tư vấn

### 5.3 Đề Xuất C – Tên Route (Vietnamese vs English)

- **Option 1**: Dùng tiếng Việt không dấu: `/an-uong`, `/diem-den`, `/phong-cach`, `/thinh-vuong`, `/cong-dong`, `/phap-ly`  
  → SEO tiếng Việt tốt, dễ đọc với user Việt

- **Option 2**: Dùng tiếng Anh: `/spotlight/food`, `/spotlight/destinations`, `/wealth`, `/community`, `/legal`  
  → Chuẩn hơn về kỹ thuật, dễ maintain

- **Đề xuất**: Spotlight sub dùng **tiếng Việt không dấu** (trùng với Silo trong ảnh); KODO Wealth dùng **`/wealth`** để thống nhất với tài liệu và dễ nhớ.

---

## 6. Bước Tiếp Theo

1. **Xác nhận** đề xuất A/B/C và lựa chọn tên route (Việt/Anh)
2. **Thứ tự ưu tiên**: Spotlight sub-routes → KODO Wealth → Cộng đồng → Pháp lý → Affiliate
3. **Bắt đầu Phase 1**: Cập nhật sitemap, metadata, tạo `/spotlight/an-uong`, `/diem-den`, `/phong-cach`

Bạn muốn bắt đầu từ bước nào? Tôi có thể hỗ trợ triển khai Phase 1 hoặc thiết kế chi tiết UI cho trang `/wealth` theo đúng phong cách sang trọng đã mô tả.
