# Danh sách nhiệm vụ UI/UX – Spotlight

> **Mục đích:** Liệt kê các nhiệm vụ xây dựng giao diện/trải nghiệm cho mục Spotlight để thảo luận và xác nhận trước khi triển khai.
>
> **Tham chiếu:** [SPOTLIGHT_PRD.md](./SPOTLIGHT_PRD.md), [SPOTLIGHT_PHASE1_SPEC.md](./SPOTLIGHT_PHASE1_SPEC.md), [SPOTLIGHT_PHASE2_PROPOSAL.md](./SPOTLIGHT_PHASE2_PROPOSAL.md), [DE_XUAT_CAU_TRUC_WEB_SEO.md](../DE_XUAT_CAU_TRUC_WEB_SEO.md)

---

## 1. Trạng thái hiện tại (đã có)

| Trang / Component | Mô tả | Ghi chú |
|-------------------|-------|---------|
| `/spotlight` | Feed chính – grid video | Tab Dành cho bạn / Tất cả / Đang theo dõi |
| `/spotlight/[id]` | Chi tiết video – embed, like, comment, CTA | Đã có |
| `/spotlight/create` | Form đăng video (URL, mô tả, địa điểm, CTA) | Đã có |
| `/spotlight/an-uong` | Silo Ẩm thực | Filter theo category `food` |
| `/spotlight/diem-den` | Silo Điểm đến | Filter theo category `travel` |
| `/spotlight/phong-cach` | Silo Phong cách sống | Filter theo category `lifestyle` |
| `/spotlight/saved` | Video đã lưu | Cần đăng nhập |
| `/spotlight/creator/[id]` | Trang Creator – profile + danh sách video | Đã có |
| Layout 3 cột | Cột trái: đề mục, giữa: nội dung, phải: cross-sell | Dùng `ContentLayout3Col` |

---

## 2. Nhiệm vụ UI/UX cần thảo luận & xác nhận

### Nhóm A: Sửa lỗi & robustness (ưu tiên cao)

| # | Nhiệm vụ | Mô tả | Trạng thái |
|---|----------|-------|------------|
| A1 | **Fix lỗi pagination** | Trang crash khi API trả format khác hoặc không chạy – thêm fallback `pagination` | ✅ Đã xử lý |
| A2 | **Error boundary** | Bọc Spotlight page bằng Error Boundary – hiển thị thông báo thân thiện thay vì crash | Chưa làm |
| A3 | **Skeleton loading** | Hiển thị skeleton khi đang fetch feed thay vì màn trống | Chưa làm |
| A4 | **Empty state** | Khi không có video – CTA rõ ràng (Đăng video, Khám phá silo) | ✅ Đã cải thiện (2026-03-03) |

---

### Nhóm B: Cấu trúc trang & điều hướng

| # | Nhiệm vụ | Mô tả | Gợi ý |
|---|----------|-------|-------|
| B1 | **Hero / giới thiệu đầu trang** | Block giới thiệu Spotlight phía trên feed – slogan, số liệu (video, creators), CTA | ✅ Đã có |
| B2 | **Breadcrumb** | Breadcrumb SEO cho `/spotlight`, `/spotlight/an-uong`, `/spotlight/[id]` | Nên có |
| B3 | **Sticky filter bar** | Filter thể loại / địa điểm / sắp xếp – sticky khi scroll | ✅ Đã có |
| B4 | **Sidebar phải** | Nội dung cross-sell – Chủ dịch vụ đăng ký, Đăng video, Creator nổi bật? | Đang dùng default |
| B5 | **Link "Video của tôi"** | Trang `/spotlight/my` cho Creator xem bài đã đăng (API có sẵn) | Chưa có trang |

---

### Nhóm C: Trải nghiệm feed

| # | Nhiệm vụ | Mô tả | Gợi ý |
|---|----------|-------|-------|
| C1 | **Infinite scroll** | Load thêm khi cuộn thay vì phân trang | ✅ Đã có |
| C2 | **Video hover preview** | Hover vào card → preview video (muted) – giống TikTok grid | ✅ Đã có – delay 400ms, play icon overlay (2026-03-03) |
| C3 | **Grid vs List view** | Cho phép chuyển chế độ xem grid / danh sách | Có / Không? |
| C4 | **Sort "Xu hướng"** | Nút sắp xếp theo trending (backend đã hỗ trợ) | Đã có trong filter |
| C5 | **Hashtag clickable** | Click tag trong mô tả video → filter feed theo tag | Chưa có |

---

### Nhóm D: Chi tiết video & tương tác

| # | Nhiệm vụ | Mô tả | Gợi ý |
|---|----------|-------|-------|
| D1 | **Like animation** | Animation khi like (heart, pulse) | Chưa có |
| D2 | **Share button** | Nút Chia sẻ – Copy link, Zalo, Facebook | Chưa có |
| D3 | **Save/Bookmark** | Lưu video (API Phase 2) – nút + trang /spotlight/saved | Saved đã có, cần kiểm tra API |
| D4 | **Video liên quan** | Dưới video chi tiết – gợi ý cùng category/region | Chưa có |
| D5 | **Autoplay muted** | Video autoplay (muted) khi vào viewport | Có thể phức tạp, cần thảo luận |

---

### Nhóm E: Creator & Follow

| # | Nhiệm vụ | Mô tả | Gợi ý |
|---|----------|-------|-------|
| E1 | **Trang Creator** | `/spotlight/creator/[id]` – profile, video, nút Follow | Đã có |
| E2 | **Tab "Đang theo dõi"** | Feed video từ Creator user đang follow | Đã có |
| E3 | **Follow button** | Nút Follow trên card video / trang chi tiết | Cần kiểm tra |

---

### Nhóm F: Trang Create & Form

| # | Nhiệm vụ | Mô tả | Gợi ý |
|---|----------|-------|-------|
| F1 | **Form validation** | Validation rõ ràng – URL hợp lệ, mô tả bắt buộc | Cần kiểm tra |
| F2 | **Preview trước khi đăng** | Xem trước video + CTA trước khi submit | ✅ Đã có |
| F3 | **Upload progress** | Nếu hỗ trợ upload file – progress bar | Phụ thuộc API |

---

### Nhóm G: SEO & Metadata

| # | Nhiệm vụ | Mô tả | Gợi ý |
|---|----------|-------|-------|
| G1 | **Metadata động** | `title`, `description`, `og:image` cho từng video | Cần kiểm tra |
| G2 | **Sitemap** | Đảm bảo `/spotlight`, `/spotlight/an-uong`, `/spotlight/diem-den`, `/spotlight/phong-cach` trong sitemap | ✅ Đã có |
| G3 | **Schema.org** | VideoObject schema cho trang chi tiết | Chưa có |

---

## 3. Gợi ý thứ tự triển khai

### Phase ngay (sửa lỗi & ổn định)

1. A1 ✅ (đã xong)
2. A2 – Error boundary
3. A3 – Skeleton loading

### Phase 1 – Cải thiện cấu trúc

4. B2 – Breadcrumb
5. B1 – Hero (nếu đồng ý)
6. B5 – Trang "Video của tôi"

### Phase 2 – Engagement

7. C2 – Video hover preview
8. D1 – Like animation
9. D2 – Share button
10. D4 – Video liên quan

---

## 4. Câu hỏi cần xác nhận

1. **Hero block:** Có cần block giới thiệu nổi bật ở đầu trang Spotlight không?
2. **Sticky filter:** Filter có cần sticky khi scroll không?
3. **Grid vs List:** Có cần chế độ xem danh sách không?
4. **Preview trước khi đăng:** Có cần preview video + CTA trước khi submit không?
5. **Ưu tiên:** Nhóm nhiệm vụ nào cần ưu tiên trước khi launch?

---

## 5. Cập nhật

| Ngày | Thay đổi |
|------|----------|
| 2026-03-03 | Tạo tài liệu; sửa lỗi pagination (A1); B1 Hero; B3 Sticky filter; C3 Grid/List; F2 Preview |
