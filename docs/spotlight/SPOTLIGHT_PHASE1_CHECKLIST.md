# CHECKLIST: Spotlight Phase 1 - Hoàn thiện

**Ngày kiểm tra:** 2025-03-01  
**Đối chiếu:** [SPOTLIGHT_PHASE1_SPEC.md](./SPOTLIGHT_PHASE1_SPEC.md)

---

## 1. DATABASE ✅

| Hạng mục | Trạng thái |
|----------|------------|
| Redcomment: video_source, spotlight_category_id | ✅ |
| Bảng spotlight_categories | ✅ |
| Bảng redcomment_regions (many-to-many) | ✅ |
| cta_buttons: link_type, price_display, internal_product_id | ✅ |
| Seed 6 thể loại | ✅ |
| Seed 63 tỉnh/thành | ✅ |

---

## 2. API ENDPOINTS ✅

| Endpoint | Method | Trạng thái |
|----------|--------|------------|
| /spotlight/feed | GET | ✅ page, limit, category, regionId, sort |
| /spotlight/:id | GET | ✅ Chi tiết + tăng view |
| /spotlight/locations | GET | ✅ |
| /spotlight/categories | GET | ✅ |
| /spotlight | POST | ✅ Tạo post (video embed) |
| /spotlight/:id/like | POST | ✅ (yêu cầu auth) |
| /spotlight/:id/comments | GET | ✅ Phân trang |
| /spotlight/:id/comments | POST | ✅ |
| /spotlight/:id/link-click | POST | ✅ Public |

---

## 3. LOGIC NGHIỆP VỤ ✅

| Yêu cầu | Trạng thái |
|---------|------------|
| Parse YouTube/Facebook URL | ✅ |
| Lấy thumbnail từ YouTube | ✅ |
| Tạo post → status APPROVED, publishedAt = now | ✅ |
| CTA links (max 5) | ✅ |
| Region validation (0–5) | ✅ |

---

## 4. WEB USER ✅

| Trang | Chức năng | Trạng thái |
|-------|-----------|------------|
| /spotlight (Feed) | Grid video, filter thể loại/địa điểm/sắp xếp, phân trang | ✅ |
| /spotlight/[id] | Embed video, like, comment, CTA links + tracking | ✅ |
| /spotlight/create | Form tạo post (URL, mô tả, địa điểm, CTA) | ✅ |
| Header | Link Spotlight | ✅ |

---

## 5. CẦN BỔ SUNG / CẢI THIỆN

| # | Hạng mục | Mức độ | Mô tả |
|---|----------|--------|-------|
| 1 | **Sort "Xu hướng" (trending)** | Nhỏ | Spec có `sort=trending`; Feed client chưa có nút này. Backend đã hỗ trợ. |
| 2 | **Trang "Video của tôi"** | Phase 2 | API có `/spotlight/my/redcomments` nhưng Web chưa có trang. Creator cần xem/quản lý bài đăng. |
| 3 | **Error codes chuẩn** | Tùy chọn | Spec đề xuất INVALID_VIDEO_URL, CREATOR_REQUIRED... Hiện throw message tiếng Việt. |
| 4 | **Loading/error states** | UX | Một số trang có thể thêm skeleton loading, error boundary. |

---

## 6. GHI CHÚ

- **Like**: Phase 1 chỉ increment, không unlike (đúng spec).
- **Save**: Spec ghi "phase sau bổ sung" – chưa implement.
- **Share tracking**: Phase sau.
