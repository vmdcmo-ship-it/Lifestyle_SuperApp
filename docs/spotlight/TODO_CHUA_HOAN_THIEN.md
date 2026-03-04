# Checklist – Chưa hoàn thiện (Spotlight & Findnear)

> **Cập nhật:** 2026-03-03  
> Tổng hợp từ thảo luận và triển khai gần đây.

---

## ✅ Đã hoàn thành

### Web Spotlight
- Hero block, Sticky filter, Grid/List view, Preview trước khi đăng
- Findnear bar + danh sách 10 dịch vụ 7km + khoảng cách + cache vị trí
- Pagination fallback, Sitemap

### App Findnear
- Danh sách dịch vụ + Video liên quan (lọc hashtag, từ khóa, vị trí)

---

## ❌ Chưa hoàn thiện

### 1. SEO & Nội dung text (ưu tiên cao)

| # | Nhiệm vụ | Mô tả |
|---|----------|-------|
| 1.1 | **Mô tả text bắt buộc cho video** | Trang chi tiết cần block giới thiệu/mô tả rõ để SEO. Hiện có `description` nhưng có thể chưa đủ nổi bật. |
| 1.2 | **AI sinh mô tả** | ✅ Đã có – nút "Gợi ý mô tả" trong form Create, gọi OpenAI theo công thức SEO (thu hút/ấn tượng/độc đáo/di sản) (2026-03-03) |
| 1.3 | **Công cụ gợi ý từ khóa** | ✅ Đã có – nút "Gợi ý từ khóa" trong form Create, 1-click thêm tags SEO (2026-03-03) |

### 2. Findnear – Cải thiện

| # | Nhiệm vụ | Mô tả |
|---|----------|-------|
| 2.1 | **API `merchantId` cho feed** | ✅ Đã có (2026-03-03) |
| 2.2 | **Link "Xem video" chính xác** | ✅ Đã có – link `/spotlight?merchantId=xxx` (2026-03-03) |
| 2.3 | **Tùy chọn tăng bán kính** | ✅ Đã có – gợi ý 10/15/20/30 km (tối đa 30km cho vùng như Đà Lạt) |
| - | **Ghi chú Creator** | Video cần gán merchant_id khi tạo → hiển thị trong Findnear (đã thêm hướng dẫn trên form Create & FINDNEAR_WEB_SPEC) |

### 3. App – Spotlight screen

| # | Nhiệm vụ | Mô tả |
|---|----------|-------|
| 3.1 | **Icon Findnear góc trên phải** | ✅ Đã có – icon 📍 tap → mở FindNear (2026-03-03) |
| 3.2 | **Actions dưới bên phải** | Like, comment, share – kiểm tra ReelItem đã đủ chưa |

### 4. Web – Robustness & UX

| # | Nhiệm vụ | Mô tả |
|---|----------|-------|
| 4.1 | **Error boundary** | ✅ Đã có – `spotlight/error.tsx` (2026-03-03) |
| 4.2 | **Skeleton loading** | ✅ Đã có – `spotlight/loading.tsx` (2026-03-03) |
| 4.3 | **Breadcrumb SEO** | ✅ Đã có – `/spotlight`, `/spotlight/[id]` + JSON-LD (2026-03-03) |

### 5. Web – Tính năng bổ sung

| # | Nhiệm vụ | Mô tả |
|---|----------|-------|
| 5.1 | **Trang "Video của tôi"** | ✅ Đã có – `/spotlight/my` (2026-03-03) |
| 5.2 | **Hashtag clickable** | ✅ Đã có – feed + chi tiết, link `/spotlight?tag=xxx` (2026-03-03) |
| 5.x | **Icon trolley 🛒 mua sản phẩm** | ✅ Đã có – link nội bộ (KODO) hoặc affiliate (Shopee, TikTok Shop) (2026-03-03) |
| 5.3 | **Video liên quan** | Dưới trang chi tiết video – gợi ý cùng category/region |
| 5.4 | **Share button** | Copy link, Zalo, Facebook |
| 5.5 | **Schema.org VideoObject** | ✅ Đã có – trang chi tiết video (2026-03-03) |

### 6. Backend – Kiểm tra

| # | Nhiệm vụ | Mô tả |
|---|----------|-------|
| 6.1 | **Search/nearby** | Xác nhận `deleted_at` trên `merchants` nếu dùng |
| 6.2 | **Spotlight feed** | Thêm query `merchantId` nếu cần (cho 2.1) |

---

## Thứ tự ưu tiên gợi ý

1. **Phase SEO**: 1.1, 1.2, 1.3  
2. **Phase Findnear**: 2.1, 2.2, 2.3  
3. **Phase App**: 3.1, 3.2  
4. **Phase Ổn định**: 4.1, 4.2  
5. **Phase Mở rộng**: 5.1–5.5, 4.3  
