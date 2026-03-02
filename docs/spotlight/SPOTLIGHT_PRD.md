# PRD: Spotlight – Video Nội Dung Lifestyle

> Product Requirements Document cho tính năng Spotlight trên Web User.

---

## 1. Tổng quan

### 1.1 Ý tưởng
Spotlight là luồng nội dung video dạng TikTok cho du lịch, review, phong cách sống, hướng dẫn địa phương. **Web User** dùng chính cho Spotlight; các trang khác vẫn có nhưng không phải trọng tâm.

### 1.2 Nguồn video
- **Chỉ dùng link**: YouTube, Facebook (Reels/Video).
- **Không** upload video trực tiếp lên hệ thống.
- Lý do: tận dụng nền tảng đã duyệt nội dung, giảm chi phí lưu trữ.

### 1.3 Monetization
- Link mua hàng dưới video: voucher, tour, affiliate.
- Hai loại: **sản phẩm trong app** (thanh toán hoa hồng) và **sản phẩm ngoài** (chỉ tracking click).

---

## 2. Quyết định thiết kế

### 2.1 Địa điểm
| Quyết định | Chi tiết |
|------------|----------|
| Chuẩn hóa | Sử dụng **đơn vị hành chính Việt Nam** (tỉnh/thành, quận/huyện, phường/xã) |
| Nguồn dữ liệu | API [provinces.open-api.vn](https://provinces.open-api.vn/api/) |
| Implementation | Bảng `Region` (core schema) + seed script sync 63 tỉnh/thành |

### 2.2 Kiểm duyệt
| Quyết định | Chi tiết |
|------------|----------|
| Pre-moderation | **Không** bắt buộc duyệt trước khi public |
| Publish flow | Đăng xong → hiển thị ngay |
| Lý do | YouTube và Facebook đã duyệt nội dung trước khi video được public |

### 2.3 Phân chia doanh thu & tracking
| Loại | Mô tả | Xử lý |
|------|-------|-------|
| **Sản phẩm trong app** | Voucher, tour, product trên Lifestyle | Thanh toán hoa hồng Creator; tracking conversion |
| **Sản phẩm ngoài** | Link affiliate, external URL | Chỉ tracking click |
| **Đánh giá video** | Chất lượng nội dung + mức độ quan tâm | Metric: views, likes, comments, clicks, conversions |

> Click và hoa hồng không tỷ lệ thuận cố định; cần đánh giá video qua views + số người click vào sản phẩm/dịch vụ.

### 2.4 Thể loại
| Quyết định | Chi tiết |
|------------|----------|
| Mở rộng | Cho phép **thêm nhóm thể loại mới** về sau |
| Implementation | Bảng `spotlight_category` (sluggable, có thể mở rộng) |
| Hiện có | `target_type` enum: PRODUCT, RESTAURANT, CAFE, HOTEL, TRAVEL, INSURANCE, EVENT, EXPERIENCE |

---

## 3. Phase 1 – Scope

| Tính năng | Mô tả |
|-----------|-------|
| Feed | Trang chủ Web: danh sách video Spotlight |
| Chi tiết | Trang xem video (embed YouTube/Facebook) |
| Tạo post | Form: URL, tiêu đề, mô tả, tag, địa điểm; không upload file |
| Like / Comment | Tương tác cơ bản |
| Link CTA | Vùng link sản phẩm/dịch vụ dưới video |

---

## 4. Mô hình dữ liệu

### 4.1 Redcomment (đã có, bổ sung)
| Field | Type | Ghi chú |
|-------|------|---------|
| `region_id` | UUID (FK Region) | Địa điểm (tỉnh/thành, quận/huyện) |
| `video_source` | enum | YOUTUBE \| FACEBOOK |
| `video_url` | string | (đã có) URL gốc YouTube/Facebook |
| `status` | content_status | Mặc định APPROVED khi tạo từ URL (Phase 1) |

### 4.2 spotlight_category (mới)
| Field | Type |
|-------|------|
| id | UUID |
| slug | string, unique |
| name | string |
| description | string? |
| sort_order | int |
| is_active | boolean |

### 4.3 cta_buttons (đã có)
- `action`: BOOK, CONSULT, BUY, CALL, EXTERNAL_LINK  
- `target_url`: link external hoặc deep link  
- (Phase 2) Thêm `target_id` cho sản phẩm trong app → commission

### 4.4 Region (đã có – core)
- `code`, `name`, `level` (PROVINCE, DISTRICT, AREA), `parent_id`
- Seed 63 tỉnh/thành từ provinces.open-api.vn

---

## 5. API

### 5.1 Tạo post từ URL
```
POST /spotlight/redcomments
Body: {
  title, description, tags, regionId,
  videoUrl, videoSource: "YOUTUBE" | "FACEBOOK",
  format: "VIDEO_REEL",
  targetType,
  ctaButtons?: [{ text, action, targetUrl }]
}
```
- Validate URL YouTube/Facebook (regex).
- Trích thumbnail từ oEmbed nếu cần.
- Tạo Redcomment với `status: APPROVED`, `publishedAt: now()`.

### 5.2 Feed
- `GET /spotlight/feed?page&limit&regionId&format&targetType`
- Filter: `status = APPROVED`, `deletedAt = null`.

### 5.3 Chi tiết + increment view
- `GET /spotlight/redcomments/:id`
- Include: creator, comments, cta_buttons, region.

### 5.4 Like / Comment
- Đã có: Comment model.
- Like: `redcomment.likes` (BigInt), API like/unlike.

### 5.5 Tracking CTA click
- `POST /spotlight/cta/:buttonId/click`
- Increment `cta_buttons.clicks` và `redcomment.clicks`.

---

## 6. UI Web (Phase 1)

- **Trang chủ**: Feed video dạng grid/list.
- **Chi tiết**: Embed YouTube/Facebook, thông tin Creator, CTA buttons, Comment.
- **Tạo post**: Form nhập URL, title, description, tags, region (select), CTA buttons.
- **Region**: Dropdown tỉnh/thành (từ Region), có thể mở rộng quận/huyện.

---

## 7. Roadmap tóm tắt

| Phase | Nội dung |
|-------|----------|
| **Phase 1** | Feed + Chi tiết + Tạo post + Like/Comment + Link CTA |
| Phase 2 | Sản phẩm trong app, thanh toán hoa hồng |
| Phase 3 | Thể loại mở rộng, filter nâng cao, analytics Creator |

---

## 8. Tài liệu liên quan

- [README_ARCHITECTURE](../../architecture/README_ARCHITECTURE.md)
- [API Reference](../api/API_REFERENCE.md)
- Prisma: `services/main-api/prisma/schema.prisma` (Redcomment, Region, cta_buttons)
