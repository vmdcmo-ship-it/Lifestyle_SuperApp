# Findnear - Web & App

## App: Findnear riêng + Video liên quan

Trên **App**, Findnear là mục riêng, hiển thị:
1. **Danh sách dịch vụ** (list) – như trước
2. **Video liên quan** (list ngang) – bổ sung bên dưới, lọc theo:
   - **Hashtag/từ khóa** từ danh mục Findnear (cafe → café, spa → spa, pharmacy → nhà thuốc...)
   - **Từ khóa tìm kiếm** (searchText)
   - **Vị trí** (quận, TP.HCM, sài gòn – từ địa chỉ hiện tại)

---

# Findnear trên Web - Ghép với Spotlight

## Tổng quan

Trên **web**, Findnear được **ghép chung** với trang Spotlight. Trên **App** thì Findnear là mục riêng.

## Layout Web

```
┌─ Hero Spotlight ─────────────────────────────────┐
│ Spotlight · Khám phá video...                     │
└──────────────────────────────────────────────────┘

┌─ Findnear (compact) ─────────────────────────────┐
│ [📍 Findnear] [Tìm dịch vụ] [▼ Danh mục] [Gần tôi]│
├─ Danh sách dịch vụ (max 10, bán kính 7km) ───────┤
│ 1. Quán A · 0.5 km · [Xem video]                 │
│ 2. Spa B · 1.2 km · [Xem video]                   │
│ ...                                               │
└──────────────────────────────────────────────────┘

┌─ Feed video ─────────────────────────────────────┐
│ Dành cho bạn | Tất cả | Đang theo dõi             │
│ [Video grid / list]                               │
└──────────────────────────────────────────────────┘
```

## Tính năng đã triển khai

| # | Tính năng | Trạng thái |
|---|-----------|------------|
| 1 | Findnear bar compact | ✅ |
| 2 | Danh sách 10 dịch vụ trong 7km | ✅ |
| 3 | Khoảng cách (km) hiển thị | ✅ |
| 4 | Cache vị trí 30 phút, nút Gần tôi refresh | ✅ |
| 5 | Video feed bên dưới list | ✅ (feed Spotlight) |
| 6 | Dropdown danh mục (Cà phê, Nhà hàng...) | ✅ |

## API sử dụng

- `GET /api/v1/search/nearby?lat=&lng=&radius=7&type=`
- Trả về merchants có `latitude`, `longitude`, `distanceKm`

## Hướng dẫn Creator – Gán merchant cho video review

**Lưu ý cho Creator:** Video review phải gán đúng `merchant_id` khi tạo (form Create) thì mới hiển thị trong feed khi khách nhấn "Xem video" từ Findnear. Nếu video review một dịch vụ cụ thể trên sàn KODO (quán cafe, nhà hàng, spa…), hãy chọn/link đúng merchant để khách tìm thấy.

---

## Cải thiện tương lai

- [x] API `GET /spotlight/feed?merchantId=` để lấy video liên quan merchant (2026-03-03)
- [x] Link "Xem video" trỏ đúng feed filtered by merchantId (2026-03-03)
- [x] Tùy chọn tăng bán kính (7, 10, 15, 20, 30 km) khi < 10 kết quả – phù hợp Đà Lạt (2026-03-03)
- [ ] Form Create: thêm trường chọn merchant (để Creator gán khi review dịch vụ)
