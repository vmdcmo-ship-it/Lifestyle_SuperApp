# Cấu trúc Ngân sách Khuyến mãi – Web-Admin

> Tài liệu mô tả cấu trúc theo dõi và báo cáo ngân sách khuyến mãi (marketing budget) trong Web-Admin.

---

## 1. Tổng quan

Tất cả chương trình sau **dùng chung ngân sách khuyến mãi** (marketing budget):

| Chương trình | Mô tả | Nguồn chi | Web-Admin |
|--------------|-------|-----------|-----------|
| **Voucher** | Mã giảm giá (% hoặc VND) | Giá trị giảm khi áp dụng | `/coupons`, `/marketing/reports` |
| **Lucky Wheel** | Vòng quay may mắn | Ngân sách campaign | `/lucky-wheel`, `/marketing/reports` |
| **Affiliate** | Giới thiệu bạn bè | Thưởng referrer + referee | `/marketing/affiliate`, `/marketing/reports` |
| **Loyalty Xu** | Xu tích lũy từ chi tiêu | 0,1% số tiền chi → Xu | `/marketing/loyalty-xu`, `/marketing/reports` |
| **Run to Earn** | Chạy kiếm Xu (App User) | Ngân sách campaign + giải | `/marketing/run-to-earn`, `/marketing/reports` |

---

## 2. Chi tiết từng chương trình

### 2.1 Loyalty Xu

- **Tỷ lệ**: 0,1% số tiền chi tiêu dịch vụ → Xu
- **Dùng Xu**: Thanh toán dịch vụ trên nền tảng (không đổi ra tiền mặt)
- **Báo cáo**: Tổng Xu đã tích, Xu đã tiêu, ước tính chi phí (estimatedBudgetImpactVnd)

### 2.2 Run to Earn (chỉ App User)

- **Quy đổi**: X bước chân = 1 Xu (cấu hình theo campaign)
- **Giải thưởng**: Xu, Voucher, Hiện vật (linh hoạt theo hạng)
- **Campaign**: Cuộc thi/giải đấu với thời gian, ngân sách, bảng giải
- **Web-Admin**: Tạo campaign, thêm giải theo hạng (rank from–to), Xu/Voucher/Hiện vật

### 2.3 Affiliate

- **Điều kiện**: Bạn giới thiệu sử dụng dịch vụ lần đầu → cả 2 nhận quà
- **Báo cáo**: Số lượt giới thiệu, ngân sách đã chi (referrer + referee)

### 2.4 Lucky Wheel

- **Nguồn lượt quay**: Tài xế (doanh thu 100k), User (giao dịch, nạp ví 500k)
- **Giải**: Voucher, tiền ví, hiện vật, Chúc may mắn

### 2.5 Voucher

- **Tác động**: Giá trị giảm khi user áp dụng
- **Báo cáo**: Lượt đã dùng, top coupon

---

## 3. Trang Báo cáo (`/marketing/reports`)

- **Tổng chi ngân sách**: Tổng hợp LW + Affiliate + Loyalty Xu (ước tính) + Run to Earn
- **Chi tiết theo chương trình**: Link tới từng module, số liệu đã chi
- **Thống kê chiến dịch**: Chiến dịch quảng cáo (Draft/Active/Paused/Ended)
- **Tổng quan coupon**: Số coupon, lượt dùng, top coupon

---

## 4. Trung tâm Marketing (`/marketing`)

| Card | Route | Mô tả |
|------|-------|-------|
| Voucher | `/coupons` | Mã giảm giá |
| Lucky Wheel | `/lucky-wheel` | Vòng quay |
| Chiến dịch quảng cáo | `/marketing/campaigns` | Campaign ads |
| Affiliate | `/marketing/affiliate` | Giới thiệu bạn bè |
| Loyalty Xu | `/marketing/loyalty-xu` | Xu từ chi tiêu |
| Run to Earn | `/marketing/run-to-earn` | Chạy kiếm Xu |
| Báo cáo | `/marketing/reports` | Tổng hợp ngân sách |

---

## 5. Luồng logic

```
┌─────────────────────────────────────────────────────────────────┐
│  NGÂN SÁCH KHUYẾN MÃI (Marketing Budget)                        │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─► Lucky Wheel    (campaign.budget, budgetUsed)
         ├─► Affiliate      (referrerReward + refereeReward)
         ├─► Loyalty Xu     (estimated: totalXuEarned × rate)
         ├─► Run to Earn    (campaign.budget, budgetUsed)
         └─► Voucher        (giá trị giảm khi apply – không cấp trực tiếp)
```

---

**Phiên bản**: 1.0  
**Cập nhật**: 2025
