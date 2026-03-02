# Loyalty Xu & Run to Earn – Thiết kế & Báo cáo ngân sách

> Hai chương trình chi từ ngân sách khuyến mãi (marketing budget), tích hợp theo dõi và báo cáo trong Web-Admin.

---

## 1. Tổng quan nguồn chi từ ngân sách khuyến mãi

| Chương trình | Mô tả | Đối tượng | Trạng thái |
|-------------|-------|-----------|------------|
| **Voucher** | Mã giảm giá | User | ✅ Có sẵn |
| **Lucky Wheel** | Vòng quay may mắn | User, Tài xế | ✅ Có sẵn |
| **Affiliate** | Giới thiệu bạn bè | User, Tài xế | ✅ Có sẵn |
| **Loyalty Xu** | Xu tích lũy từ chi tiêu | User | 🔄 Cần tracking |
| **Run to Earn** | Chạy bộ tích Xu / giải thưởng | User (chỉ App User) | 🆕 Cần xây dựng |

---

## 2. Loyalty Xu (Tích điểm khi chi tiêu)

### 2.1 Quy tắc

- **Tỷ lệ quy đổi**: 0,1% số tiền chi tiêu → Xu
- **Ví dụ**: Chi 100.000đ → 100 Xu (100.000 × 0,1% = 100)
- **Xu lưu trong ví**: Dùng để thanh toán dịch vụ trên nền tảng
- **Không đổi ra tiền mặt**: Xu chỉ dùng nội bộ

### 2.2 Nguồn chi tiêu tính Xu

- Đặt xe (Booking)
- Giao đồ ăn / đơn hàng (Order)
- Dịch vụ khác trên nền tảng

### 2.3 Web-Admin tracking

- Tổng Xu đã tích (xu_earned_total)
- Tổng Xu đã tiêu (xu_spent_total)
- Số ví có Xu
- Ước tính chi phí (equivalent VND) từ Xu đã cấp

---

## 3. Run to Earn (Chạy kiếm tiền)

### 3.1 Đối tượng & phạm vi

- **Chỉ trên App User** (không có trên App Driver)
- Người dùng đếm bước chân, tích Xu hoặc nhận giải thưởng

### 3.2 Mô hình chiến dịch (Campaign)

- **Cuộc thi / Giải đua**: Mỗi campaign = 1 giải đua cụ thể (vd: "Chạy thử thách tháng 3")
- **Thời gian**: startDate, endDate
- **Tỷ lệ quy đổi bước → Xu**: Cấu hình được (stepsPerXu), ví dụ 1000 bước = 1 Xu

### 3.3 Loại giải thưởng (linh hoạt)

| Loại | Mô tả | Cấu hình |
|------|-------|----------|
| **XU** | Cộng Xu vào ví | Số Xu cho từng hạng (1, 2, 3…) |
| **PHYSICAL** | Hiện vật từ nhà tài trợ | Tên giải, mô tả, sponsor |
| **VOUCHER** | Mã giảm giá | Liên kết Coupon |

### 3.4 Cơ chế trao giải

- **Xếp hạng**: Theo tổng số bước trong thời gian campaign
- **Giải theo hạng**: Top 1, Top 2–5, Top 6–20… tùy cấu hình
- **Xu tích lũy**: Mọi người tham gia đều đổi bước → Xu (theo stepsPerXu)

### 3.5 Web-Admin

- **Danh sách campaign**: CRUD, bật/tắt
- **Cấu hình giải**: Thêm/sửa giải linh hoạt (rank từ–đến, loại, giá trị)
- **Thống kê**: Số người tham gia, tổng bước, ngân sách đã chi

---

## 4. Cấu trúc báo cáo ngân sách khuyến mãi (Web-Admin)

```
/marketing/reports  →  Báo cáo ngân sách khuyến mãi
├── Lucky Wheel     →  Đã chi (budgetUsed)
├── Affiliate       →  Đã chi (referrer + referee rewards)
├── Loyalty Xu      →  Xu đã cấp, ước tính equivalent VND
├── Run to Earn     →  Đã chi (Xu + giải thưởng)
└── Voucher         →  Lượt đã dùng (giá trị giảm khi áp dụng)
```

---

## 5. Luồng kỹ thuật (tóm tắt)

### Loyalty Xu

1. Order/Booking completed → Tính Xu = spending × 0,001 (0,1%)
2. Cộng Xu vào Wallet (xu_balance, xu_earned_total)
3. User dùng Xu thanh toán → Trừ xu_balance, tăng xu_spent_total

### Run to Earn

1. User sync bước từ app → Ghi nhận steps
2. Campaign active → Tính Xu từ steps (steps / stepsPerXu)
3. Cuối campaign → Xếp hạng, trao giải (Xu / Voucher / Hiện vật)
4. Ngân sách: Xu cấp + giá trị voucher/hiện vật
