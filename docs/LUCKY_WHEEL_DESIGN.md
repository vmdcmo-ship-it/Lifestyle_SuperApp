# Thiết kế Lucky Wheel (Vòng quay may mắn)

> Tài liệu thiết kế tính năng Lucky Wheel – chương trình khuyến mãi tạo động lực cho Tài xế tích cực nhận cuốc, User nạp ví trả trước, và tăng engagement qua giải thưởng có điều kiện.

---

## 1. Mục tiêu kinh doanh

| Mục tiêu | Mô tả |
|----------|-------|
| **Tài xế** | Mỗi 100.000đ doanh thu từ chuyến đi → 1 lượt quay. Khuyến khích tích cực nhận cuốc. |
| **User giao dịch** | Mỗi giao dịch sử dụng dịch vụ (đặt xe, giao đồ ăn, đơn hàng) → 1 lượt quay. |
| **User nạp ví** | Mỗi 500.000đ nạp tiền ví trả trước → 1 lượt quay. Thúc đẩy nạp ví. |
| **Giải có điều kiện** | Voucher % giảm có min order thay vì cho không → kích thích sử dụng, tạo cảm giác "trúng thưởng" thú vị hơn. |

---

## 2. Kiến trúc luồng dữ liệu

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  NGUỒN TẠO LƯỢT QUAY (Spin Credit)                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  Tài xế          │  Booking COMPLETED  │  Doanh thu ≥ 100.000đ/100k = 1 spin │
│  User            │  Order DELIVERED    │  1 giao dịch = 1 spin              │
│                  │  Booking COMPLETED  │  1 chuyến = 1 spin                  │
│  User            │  Transaction TOP_UP │  Mỗi 500.000đ nạp = 1 spin          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  LUCKY WHEEL CAMPAIGN                                                        │
│  - Thời gian: startDate, endDate                                             │
│  - Ngân sách: budget (VND) từ phân bổ                                        │
│  - Quy tắc tham gia: driverRevenuePerSpin, userOrderPerSpin, topUpPerSpin   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  POOL GIẢI THƯỞNG (Prize Pool) – dùng chung                                  │
│  - VOUCHER: mã giảm (%, VND) – min order, hạn dùng                            │
│  - WALLET_CREDIT: tiền vào ví (không rút, có thể tặng)                        │
│  - PHYSICAL_GOODS: hiện vật (nhà tài trợ, fulfillment thủ công)              │
│  - NO_PRIZE: Chúc may mắn lần sau                                            │
│  Mỗi prize: weight (xác suất), quantity/stock, value                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  GIAO DỊCH QUAY (Spin)                                                      │
│  - 1 credit = 1 lần quay                                                    │
│  - Random theo weight → trúng prize                                          │
│  - Ghi nhận: LuckyWheelSpin (userId/driverId, prizeId, campaignId)          │
│  - Giao giải: tạo voucher, cộng ví, ghi nhận hiện vật                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Chi tiết quy tắc

### 3.1 Điều kiện nhận spin (trong campaign)

| Đối tượng | Sự kiện | Ngưỡng | Ví dụ |
|-----------|---------|--------|-------|
| Driver | Doanh thu từ Booking COMPLETED | 100.000đ / spin | 3 chuyến × 50k = 150k → 1 spin dư 50k |
| User | Giao dịch Order/Booking hoàn thành | 1 giao dịch / spin | 1 đơn giao đồ ăn = 1 spin |
| User | Nạp ví (Transaction type=TOP_UP, status=COMPLETED) | 500.000đ / spin | Nạp 1.5M = 3 spin |

- Mỗi campaign có thể override ngưỡng mặc định (driverRevenuePerSpin, topUpPerSpin).
- Spin credits được cộng dồn theo campaign; hết campaign thì reset cho campaign mới.

### 3.2 Loại giải thưởng

| Loại | Mô tả | Giao giải | Cấu trúc giá trị |
|------|-------|-----------|------------------|
| **VOUCHER** | Mã giảm khi dùng dịch vụ trên nền tảng | Liên kết Coupon có sẵn (couponId) | Cơ cấu nhiều cấp độ: 5%, 10%, 20%, 50k, 100k…; mỗi loại có min order, hạn dùng |
| **WALLET_CREDIT** | Tiền số cộng ví trả trước | Cộng balance, non_withdrawable, giftable | amountVnd (ví dụ: 10k, 50k, 100k) |
| **PHYSICAL_GOODS** | Hiện vật, sản phẩm tài trợ từ nhà cung cấp | Ghi nhận "đã trúng", fulfillment thủ công | name, sponsorName, imageUrl, mô tả |
| **NO_PRIZE** | Chúc may mắn lần sau | Không giao gì, ghi log | — |

### 3.3 Cơ cấu Voucher (% giảm nhiều cấp độ)

- Tạo nhiều Coupon khác nhau với % giảm: 5%, 10%, 15%, 20%, 30%… và/hoặc số tiền cố định (10k, 20k, 50k).
- Mỗi Coupon có **min order amount** để kích thích đơn hàng lớn hơn.
- Ưu tiên voucher có điều kiện thay vì cho không → user cảm thấy "trúng" có giá trị hơn, kích thích dùng dịch vụ.

### 3.4 Tiền số (WALLET_CREDIT)

- Chỉ cộng vào **ví trả trước** (prepaid balance).
- **Không** được rút ra tiền mặt.
- **Được phép** gửi tặng bạn bè qua tính năng chuyển khoản nội bộ.
- Metadata: `source: 'LUCKY_WHEEL'`, `campaign_id`, `non_withdrawable: true`.

---

## 4. Trung tâm giải thưởng & ngân sách

- **Pool giải thưởng dùng chung**: Một campaign Lucky Wheel có một bộ giải (prizes). Cả User và Tài xế quay cùng một vòng, cùng pool giải.
- **Ngân sách**: `budget` (VND) từ phân bổ; `budgetUsed` theo dõi đã chi (voucher giá trị, tiền cộng ví, v.v.).
- Giải thưởng giao về **tài khoản cá nhân** của User/Tài xế để họ sử dụng (voucher trong Ví/Khuyến mãi, tiền vào ví trả trước, hiện vật nhận tại cửa hàng/đối tác).

---

## 5. Schema dữ liệu (gợi ý)

- `LuckyWheelCampaign`: campaign (tên, ngày, ngân sách, quy tắc)
- `LuckyWheelPrize`: giải thưởng trong pool (type, value, weight, stock)
- `LuckyWheelSpinCredit`: lượt quay đã tích (user/driver, campaign, source, amount)
- `LuckyWheelSpin`: lịch sử quay (user/driver, campaign, prize, won_at)
- `UserCoupon` / `DriverCoupon`: voucher gán cho user/driver (nếu chưa có thì mở rộng Coupon)

---

## 6. Web-Admin – Tracking & quản lý

| Trang / Chức năng | Mô tả |
|-------------------|-------|
| **Danh sách Campaign** | CRUD campaign, bật/tắt, xem thống kê |
| **Chi tiết Campaign** | Cấu hình quy tắc, quản lý Prize Pool |
| **Prize Pool** | Thêm/sửa/xóa giải, xác suất, số lượng |
| **Dashboard Lucky Wheel** | Tổng spin, giải đã trao, ngân sách đã dùng |
| **Lịch sử spin** | Bộ lọc theo campaign, user, driver, prize |
| **Báo cáo** | Spin theo ngày, theo nguồn (driver/user), top prize |

---

## 7. Luồng kỹ thuật (tóm tắt)

1. **Event**: Booking completed / Order delivered / Top-up completed
2. **Service**: Kiểm tra campaign active → Tính spin credits theo quy tắc
3. **Lưu**: `LuckyWheelSpinCredit` (hoặc tăng counter trong bảng tương ứng)
4. **App (User/Driver)**: Hiển thị số spin, nút "Quay"
5. **API quay**: Trừ 1 credit → Random prize → Ghi `LuckyWheelSpin` → Giao giải (voucher/ví/hiện vật)
6. **Web-Admin**: Theo dõi realtime qua dashboard và báo cáo
