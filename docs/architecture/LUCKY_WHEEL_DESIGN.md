# Lucky Wheel (Vòng quay may mắn) – Thiết kế & Logic

> Tài liệu thiết kế tính năng Vòng quay may mắn – chương trình khuyến mãi kích thích Tài xế, User và thúc đẩy nạp ví trả trước.

---

## 1. Mục tiêu kinh doanh

- **Tài xế**: Tích cực nhận cuộc → mỗi 100.000đ doanh thu = 1 lượt quay
- **User**: Dùng dịch vụ → mỗi giao dịch = 1 lượt quay
- **User**: Nạp ví trả trước → mỗi 500.000đ = 1 lượt quay
- **Quỹ thưởng**: Dùng chung, từ ngân sách phân bổ
- **Loại giải**: Voucher (có điều kiện), hiện vật, tiền số (ví – không rút, có thể tặng)

---

## 2. Luồng nhận lượt quay

| Đối tượng | Điều kiện | Chi tiết |
|-----------|-----------|----------|
| **Tài xế** | Doanh thu 100.000đ | Mỗi 100k doanh thu từ cuộc xe (Booking completed) → +1 lượt |
| **User** | Giao dịch dịch vụ | Mỗi Booking (đặt xe) hoặc Order (giao đồ ăn/đồ) completed → +1 lượt |
| **User** | Nạp ví 500.000đ | Mỗi 500k nạp vào ví trả trước (Transaction TOP_UP) → +1 lượt (làm tròn xuống) |

### Xử lý kỹ thuật

- **Tài xế**: Aggregate `totalPrice` từ Booking có `driverId` và `status = COMPLETED` trong khoảng thời gian campaign. Số lượt = `floor(totalRevenue / 100_000)`.
- **User – Giao dịch**: Mỗi Booking completed (userId) hoặc Order delivered (userId) → 1 spin. Không cộng dồn theo giá trị.
- **User – Nạp ví**: Mỗi Transaction `type=TOP_UP`, `status=COMPLETED` → `floor(amount / 500_000)` lượt.

---

## 3. Loại giải thưởng

| Loại | Mô tả | Ví dụ |
|------|-------|-------|
| **VOUCHER** | Mã giảm giá (liên kết Coupon) | 10%, 20%, 50k cố định, có min order |
| **PHYSICAL** | Hiện vật / sản phẩm tài trợ | Quà từ đối tác |
| **WALLET_CREDIT** | Tiền số cộng ví trả trước | 10k, 50k – chỉ dùng dịch vụ hoặc tặng, không rút |

### Quy định WALLET_CREDIT

- Số tiền cộng vào `balance` ví trả trước
- Không rút ra tiền mặt
- Có thể chuyển/tặng cho bạn bè qua tính năng chuyển khoản nội bộ

---

## 4. Cấu trúc dữ liệu

### 4.1 LuckyWheelCampaign

- Chiến dịch vòng quay (có thể chạy nhiều đợt)
- `startDate`, `endDate`
- `budgetAllocated` (VND)
- `status`: DRAFT | ACTIVE | PAUSED | ENDED

### 4.2 LuckyWheelPrize

- Thuộc campaign
- `type`: VOUCHER | PHYSICAL | WALLET_CREDIT
- `weight`: Xác suất trúng (số nguyên, tỉ lệ tương đối)
- `stock`: Số lượng (null = không giới hạn)
- **VOUCHER**: `couponId` → Coupon
- **PHYSICAL**: `name`, `description`, `sponsorName`, `imageUrl`
- **WALLET_CREDIT**: `amountVnd`

### 4.3 LuckyWheelSpin

- Lượt quay
- `campaignId`, `userId` (user hoặc driver đều là User)
- `sourceType`: DRIVER_REVENUE | USER_TRANSACTION | USER_TOPUP
- `sourceId`: bookingId, orderId, transactionId
- `status`: PENDING | SPUN | EXPIRED
- `prizeId`, `spunAt`

### 4.4 LuckyWheelEligibility (tính toán động)

- Không lưu bảng riêng; tính từ:
  - **Driver**: aggregate revenue từ Booking
  - **User transaction**: đếm Booking/Order completed
  - **User topup**: aggregate amount từ Transaction TOP_UP

---

## 5. API (Backend)

| Method | Path | Mô tả |
|--------|------|-------|
| GET | /lucky-wheel/campaigns | Danh sách campaign (Admin) |
| GET | /lucky-wheel/campaigns/:id | Chi tiết campaign + prizes |
| POST | /lucky-wheel/campaigns | Tạo campaign (Admin) |
| PATCH | /lucky-wheel/campaigns/:id | Cập nhật campaign |
| GET | /lucky-wheel/campaigns/:id/prizes | Danh sách giải |
| POST | /lucky-wheel/campaigns/:id/prizes | Thêm giải |
| PATCH | /lucky-wheel/campaigns/:id/prizes/:pid | Sửa giải |
| GET | /lucky-wheel/campaigns/:id/stats | Thống kê campaign |
| GET | /lucky-wheel/spins | Lịch sử lượt quay (phân trang, filter) |
| POST | /lucky-wheel/spin | Thực hiện quay (mobile) |

---

## 6. Web-Admin: Tracking & Quản lý

- **Dashboard Lucky Wheel**: Tổng quan số lượt quay, giải đã trúng, ngân sách
- **Danh sách Campaign**: Tạo/sửa, bật/tắt
- **Quản lý Giải**: Thêm/sửa giải, cấu hình xác suất, stock
- **Lịch sử lượt quay**: Filter theo campaign, user, nguồn, thời gian
- **Báo cáo**: Biểu đồ lượt quay theo ngày, tỉ lệ trúng từng loại giải

---

## 7. Tích hợp (Events / Jobs)

- **Booking completed** → grant spin cho User + Driver (nếu có logic tách)
- **Order delivered** → grant spin cho User
- **Transaction TOP_UP completed** → grant spin cho User (số lượt = floor(amount/500000))
- **Driver revenue milestone** → cron/job aggregate revenue mỗi X phút, grant spin khi đạt 100k

---

## 8. Rủi ro & Giới hạn

- **Trùng lượt**: Mỗi (userId, sourceType, sourceId) chỉ tạo 1 spin
- **Hết giải**: Khi stock = 0 → loại bỏ khỏi bảng quay hoặc trả "Chúc may mắn lần sau"
- **Hạn quay**: Spin PENDING hết hạn sau N ngày nếu không quay
