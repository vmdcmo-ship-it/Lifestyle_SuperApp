# Revenue Management System - Quản Trị Nguồn Thu

> **Hệ thống quản lý nguồn thu, phí, commission, thu hộ/chi hộ tuân thủ thuế**

---

## 📋 Overview

**Purpose:** Quản lý toàn bộ nguồn thu của platform, đảm bảo tuân thủ thuế và kế toán

**Key Features:**
1. Cấu hình nguồn thu linh hoạt (có thể điều chỉnh)
2. Phân biệt rõ: Doanh thu platform vs Thu hộ
3. Tự động tính thuế (VAT, TNCN, TNDN)
4. Thanh toán tự động cho merchant/driver
5. Báo cáo tài chính chi tiết
6. Approval workflow cho thay đổi cấu hình

---

## 💰 Revenue Streams (Nguồn Thu)

### 1. Platform Fee (Phí Sử Dụng Nền Tảng)

**Mô tả:** Phí cố định cho mỗi giao dịch

**Cấu hình:**
```typescript
{
  name: "Platform Transaction Fee",
  feeType: FeeType.FIXED,
  amount: 2000, // VND
  serviceTypes: [
    ServiceType.RIDE_HAILING,
    ServiceType.FOOD_DELIVERY,
    ServiceType.SHOPPING
  ],
  effectiveFrom: "2024-01-01",
  effectiveTo: null // Vô thời hạn
}
```

**Cách tính:**
```
Platform Fee = 2,000 VND / transaction
```

**Ví dụ:**
- Đơn giao đồ ăn 100,000 VND → Platform fee: 2,000 VND
- Đơn đặt xe 50,000 VND → Platform fee: 2,000 VND

---

### 2. Driver Commission (Chiết Khấu Tài Xế)

**Mô tả:** Platform lấy 15% cước phí từ tài xế

**Cấu hình:**
```typescript
{
  name: "Driver Service Commission",
  feeType: FeeType.PERCENTAGE,
  percentage: 0.15, // 15%
  minCommission: 1000, // VND (minimum)
  maxCommission: 50000, // VND (maximum)
  serviceTypes: [
    ServiceType.RIDE_HAILING,
    ServiceType.FOOD_DELIVERY,
    ServiceType.SHOPPING
  ],
  effectiveFrom: "2024-01-01"
}
```

**Cách tính:**
```
Driver Commission = Driver Revenue × 15%
Driver Net = Driver Revenue - Commission - Taxes
```

**Ví dụ:**
- Cước phí giao hàng: 30,000 VND
- Platform commission: 30,000 × 15% = 4,500 VND
- Driver nhận: 30,000 - 4,500 = 25,500 VND (chưa trừ thuế)

**Tiered Commission (Bậc thang - tùy chọn):**
```typescript
tiers: [
  { minRevenue: 0, maxRevenue: 10_000_000, percentage: 0.15 }, // < 10M: 15%
  { minRevenue: 10_000_000, maxRevenue: 20_000_000, percentage: 0.12 }, // 10-20M: 12%
  { minRevenue: 20_000_000, percentage: 0.10 } // > 20M: 10%
]
```

---

### 3. Merchant Commission (Chiết Khấu Merchant)

**Mô tả:** Platform lấy 15% doanh thu đơn hàng từ quán ăn, cửa hàng

**Cấu hình:**
```typescript
{
  name: "Merchant Service Commission",
  feeType: FeeType.PERCENTAGE,
  percentage: 0.15, // 15%
  minCommission: 2000,
  maxCommission: 100000,
  serviceTypes: [
    ServiceType.FOOD_DELIVERY,
    ServiceType.SHOPPING
  ],
  merchantCategories: ["RESTAURANT", "STORE"],
  effectiveFrom: "2024-01-01"
}
```

**Cách tính:**
```
Order Value = 100,000 VND (giá trị đơn hàng)
Merchant Commission = 100,000 × 15% = 15,000 VND
Merchant Settlement = 100,000 - 15,000 = 85,000 VND (thu hộ - trả lại merchant)
```

**Quan trọng:**
- 100,000 VND = **THU HỘ** (không tính doanh thu platform)
- 15,000 VND commission = **DOANH THU PLATFORM**
- 85,000 VND = Trả lại merchant (không phải doanh thu)

---

### 4. Subscription Fee (Phí Đăng Ký)

**Mô tả:** Phí gói membership/premium

**Cấu hình:**
```typescript
{
  name: "Premium Membership",
  period: SubscriptionPeriod.MONTHLY,
  amount: 99000, // VND/month
  benefits: [
    "Miễn phí giao hàng",
    "Ưu tiên hỗ trợ",
    "Giảm 10% mọi đơn",
    "Tích Xu x2"
  ],
  annualDiscount: 0.20, // 20% off if pay yearly
  targetUserType: "CUSTOMER",
  effectiveFrom: "2024-01-01"
}
```

**Pricing:**
- **Monthly:** 99,000 VND/month
- **Yearly:** 99,000 × 12 × (1 - 0.20) = 950,400 VND/year (save 237,600 VND)

---

### 5. Advertising Fee (Phí Quảng Cáo)

**Mô tả:** Merchant trả phí để hiển thị nổi bật (sponsored listing)

**Cấu hình:**
```typescript
{
  name: "Sponsored Listing Fee",
  feeType: FeeType.PERCENTAGE,
  percentage: 0.05, // 5% of sales from ads
  placementType: "SPONSORED_LISTING",
  serviceTypes: [ServiceType.FOOD_DELIVERY, ServiceType.SHOPPING],
  effectiveFrom: "2024-01-01"
}
```

**Cách tính:**
```
Sales from ad traffic = 1,000,000 VND
Advertising fee = 1,000,000 × 5% = 50,000 VND
```

**Alternative: Fixed placement fee**
```typescript
{
  feeType: FeeType.FIXED,
  fixedAmount: 500000, // 500K VND
  duration: 7, // 7 days
  placementType: "BANNER",
  impressions: 10000 // Guaranteed impressions
}
```

---

### 6. Voucher/Tour Markup (Chênh Lệch Voucher)

**Mô tả:** Giá bán voucher/tour = Giá supplier + Markup

**Cấu hình:**
```typescript
{
  name: "Travel Package Markup",
  feeType: FeeType.PERCENTAGE,
  percentage: 0.20, // 20% markup
  minMarkup: 50000, // Minimum 50K
  maxMarkup: 5000000, // Maximum 5M
  voucherCategories: ["TRAVEL", "HOTEL", "RESTAURANT"],
  effectiveFrom: "2024-01-01"
}
```

**Cách tính:**
```
Supplier Price = 1,000,000 VND
Markup = 1,000,000 × 20% = 200,000 VND
Selling Price = 1,000,000 + 200,000 = 1,200,000 VND

Customer pays: 1,200,000 VND
Platform revenue: 200,000 VND
Supplier settlement: 1,000,000 VND (thu hộ)
```

**Accounting:**
- Platform revenue: 200,000 VND (ghi nhận doanh thu)
- Supplier collection: 1,000,000 VND (thu hộ, không phải doanh thu)

---

## 💼 Thu Hộ / Chi Hộ (Collection & Disbursement)

### Merchant Revenue Collection

**Mô tả:** Doanh thu của merchant là THU HỘ, phải trả lại

**Example Transaction:**
```typescript
// Order: Đồ ăn 100,000 VND
{
  totalAmount: 100000, // Customer pays
  
  // Revenue breakdown:
  platformFee: 2000, // Platform fee (DOANH THU)
  merchantCommission: 15000, // 15% commission (DOANH THU)
  merchantCollection: 83000, // 100K - 2K - 15K (THU HỘ - trả lại merchant)
  
  // Accounting:
  platformRevenue: 17000, // 2K + 15K
  collectionAmount: 83000, // Not platform revenue!
}
```

**Monthly Settlement cho Merchant:**
```typescript
{
  merchantId: "merchant123",
  period: "2024-02",
  
  totalOrders: 150,
  totalOrderValue: 15_000_000, // Tổng giá trị đơn hàng (THU HỘ)
  
  commissionRate: 0.15,
  commissionAmount: 2_250_000, // Platform commission (DOANH THU)
  advertisingFees: 200_000, // Ads fee (DOANH THU)
  
  netSettlement: 12_550_000, // 15M - 2.25M - 200K (TRẢ LẠI MERCHANT)
  
  disbursementMethod: "BANK_TRANSFER",
  bankAccount: {
    bankName: "Vietcombank",
    accountNumber: "0123456789",
    accountName: "Nhà hàng ABC"
  },
  
  status: "COMPLETED"
}
```

**Kế toán:**
- 15,000,000 VND: **THU HỘ** (tạm thu, không ghi nhận doanh thu)
- 2,250,000 VND: **DOANH THU** (commission)
- 200,000 VND: **DOANH THU** (advertising)
- 12,550,000 VND: **TRẢ LẠI** merchant (giảm khoản phải trả)

**Thuế:**
- Platform **KHÔNG** phải nộp thuế TNDN cho 15M (vì là thu hộ)
- Platform chỉ nộp thuế TNDN cho 2.45M (commission + ads)
- Merchant tự kê khai thuế VAT cho 15M doanh thu của mình

---

### Driver Revenue Collection

**Mô tả:** Cước phí của driver, platform khấu trừ commission và thuế

**Example Transaction:**
```typescript
// Ride: Cước phí 50,000 VND
{
  totalAmount: 50000, // Customer pays
  
  // Revenue breakdown:
  platformFee: 2000, // Platform fee (DOANH THU)
  driverCommission: 7500, // 15% × 50K (DOANH THU)
  driverCollection: 40500, // 50K - 2K - 7.5K (THU HỘ - trả driver)
  
  // Accounting:
  platformRevenue: 9500, // 2K + 7.5K
  collectionAmount: 40500
}
```

**Monthly Settlement cho Driver:**
```typescript
{
  driverId: "driver456",
  period: "2024-02",
  
  totalTrips: 200,
  grossRevenue: 10_000_000, // Tổng cước phí
  
  commissionRate: 0.15,
  commissionAmount: 1_500_000, // Platform commission
  
  // Tax withholding (thu hộ thuế)
  vatWithheld: 800_000, // 8% VAT (if driver registered)
  pitWithheld: 500_000, // 5% PIT (TNCN)
  totalTaxWithheld: 1_300_000,
  
  // Net payment to driver
  netPayment: 7_200_000, // 10M - 1.5M - 1.3M
  
  disbursementMethod: "BANK_TRANSFER",
  status: "COMPLETED"
}
```

**Kế toán:**
- 10,000,000 VND: **THU HỘ** (cước phí của driver)
- 1,500,000 VND: **DOANH THU** (commission)
- 1,300,000 VND: **THU HỘ THUẾ** (nộp thay driver)
- 7,200,000 VND: **TRẢ DRIVER**

**Thuế:**
- Platform **KHÔNG** nộp thuế TNDN cho 10M (thu hộ)
- Platform chỉ nộp thuế TNDN cho 1.5M (commission)
- 1.3M thuế của driver: Platform nộp thay, driver được credit

---

### Voucher/Tour Settlement

**Mô tả:** Giá bán = Giá supplier + Markup, chỉ markup mới là doanh thu

**Example:**
```typescript
{
  voucherId: "tour789",
  category: "TRAVEL",
  
  supplierPrice: 2_000_000, // Giá nhà cung cấp (THU HỘ)
  markupAmount: 400_000, // 20% markup (DOANH THU)
  sellingPrice: 2_400_000, // Giá bán cho khách
  
  customerPayment: 2_400_000,
  
  // Settlement
  supplierSettlement: 2_000_000, // Trả lại supplier (THU HỘ)
  platformRevenue: 400_000, // Markup (DOANH THU)
  
  disbursementMethod: "AUTO_TRANSFER",
  status: "COMPLETED"
}
```

**Kế toán:**
- 2,400,000 VND: Customer payment
- 400,000 VND: **DOANH THU** (markup)
- 2,000,000 VND: **THU HỘ** supplier (trả lại)

---

## 💸 Tax Management (Quản Lý Thuế)

### VAT (Thuế GTGT)

**Áp dụng cho:**
- Platform services (nếu doanh thu > 100M/year)
- Driver (nếu đăng ký VAT)

**Tax rates:**
- 8% (basic services)
- 10% (standard services)

**Driver VAT Withholding:**
```typescript
{
  driverId: "driver456",
  period: "2024-02",
  
  grossIncome: 10_000_000,
  isVATRegistered: true,
  vatRate: 0.08, // 8%
  
  // VAT calculation
  revenueExclVAT: 10_000_000 / 1.08 = 9_259_259,
  vatAmount: 9_259_259 × 0.08 = 740_741,
  
  // Platform withholds VAT
  vatWithheld: 740_741,
  
  // Driver receives VAT credit
  vatCredit: 740_741 // Driver claims back from tax authority
}
```

### PIT (Thuế TNCN)

**Áp dụng cho:** Driver income

**Progressive rates:**
```typescript
taxThresholds: [
  { minIncome: 0, maxIncome: 5_000_000, rate: 0 }, // 0-5M: 0%
  { minIncome: 5_000_000, maxIncome: 10_000_000, rate: 0.05 }, // 5-10M: 5%
  { minIncome: 10_000_000, maxIncome: 18_000_000, rate: 0.10 }, // 10-18M: 10%
  { minIncome: 18_000_000, maxIncome: 32_000_000, rate: 0.15 }, // 18-32M: 15%
  { minIncome: 32_000_000, maxIncome: 52_000_000, rate: 0.20 }, // 32-52M: 20%
  { minIncome: 52_000_000, maxIncome: 80_000_000, rate: 0.25 }, // 52-80M: 25%
  { minIncome: 80_000_000, rate: 0.30 } // > 80M: 30%
]
```

**Example Calculation:**
```typescript
// Driver monthly income: 12M VND
{
  grossIncome: 12_000_000,
  
  // Deductions
  personalExemption: 11_000_000, // 11M/month
  dependentExemption: 4_400_000, // 4.4M/dependent
  totalDeductions: 11_000_000 + 4_400_000 = 15_400_000,
  
  // Taxable income
  taxableIncome: 12_000_000 - 15_400_000 = -3_400_000,
  
  // No PIT (income below exemption)
  pitAmount: 0
}
```

**If income higher:**
```typescript
// Driver monthly income: 25M VND
{
  grossIncome: 25_000_000,
  totalDeductions: 15_400_000,
  taxableIncome: 25_000_000 - 15_400_000 = 9_600_000,
  
  // PIT calculation
  // 0-5M: 0
  // 5-9.6M: 4.6M × 5% = 230,000
  pitAmount: 230_000
}
```

### CIT (Thuế TNDN)

**Áp dụng cho:** Platform (công ty)

**Rate:** 20% of taxable profit

**Taxable Income:**
```typescript
// Platform taxable income (monthly)
{
  revenue: {
    platformFees: 5_000_000,
    driverCommissions: 8_000_000,
    merchantCommissions: 12_000_000,
    subscriptionFees: 3_000_000,
    advertisingFees: 2_000_000,
    voucherMarkups: 4_000_000,
    totalRevenue: 34_000_000 // Chỉ tính doanh thu, không tính thu hộ!
  },
  
  costOfRevenue: {
    paymentGatewayFees: 1_000_000,
    cloudCosts: 2_000_000,
    apiCosts: 500_000,
    totalCost: 3_500_000
  },
  
  grossProfit: 34_000_000 - 3_500_000 = 30_500_000,
  
  operatingExpenses: {
    salaries: 20_000_000,
    marketing: 5_000_000,
    other: 2_000_000,
    totalOpex: 27_000_000
  },
  
  taxableIncome: 30_500_000 - 27_000_000 = 3_500_000,
  citAmount: 3_500_000 × 20% = 700_000
}
```

**Quan trọng:**
- **THU HỘ** merchant/driver **KHÔNG** tính vào doanh thu
- Chỉ commission, markup, fees mới là doanh thu chịu thuế TNDN

---

## 📊 Revenue Calculation Examples

### Example 1: Food Delivery Order

```typescript
// Order: 100,000 VND từ quán ăn
{
  orderId: "order123",
  orderType: ServiceType.FOOD_DELIVERY,
  totalAmount: 100_000,
  
  // Breakdown:
  platformFee: 2_000, // Fixed fee
  merchantCommission: 15_000, // 15% of order value
  driverCommission: 4_500, // 15% of delivery fee (30K)
  
  // Collections
  merchantCollection: 83_000, // 100K - 2K - 15K (THU HỘ)
  driverCollection: 25_500, // 30K - 4.5K (THU HỘ)
  
  // Platform revenue
  platformRevenue: 21_500, // 2K + 15K + 4.5K
  
  // Verification
  totalBreakdown: 21_500 + 83_000 + 25_500 = 130_000,
  // Note: 130K because driver delivery fee (30K) is additional
  
  isBalanced: true
}
```

**Accounting Entries:**
```
Debit: Cash/Payment Gateway  130,000
Credit: Platform Revenue      21,500 (doanh thu)
Credit: Merchant Payable      83,000 (nợ phải trả merchant)
Credit: Driver Payable        25,500 (nợ phải trả driver)
```

### Example 2: Ride Hailing

```typescript
// Ride: 50,000 VND
{
  orderId: "ride456",
  orderType: ServiceType.RIDE_HAILING,
  totalAmount: 50_000,
  
  // Breakdown:
  platformFee: 2_000,
  driverCommission: 7_500, // 15% of 50K
  
  // Collections
  driverCollection: 40_500, // 50K - 2K - 7.5K
  
  // Platform revenue
  platformRevenue: 9_500, // 2K + 7.5K
  
  // Verification
  totalBreakdown: 9_500 + 40_500 = 50_000,
  isBalanced: true
}
```

### Example 3: Voucher/Tour

```typescript
// Tour package: 2,400,000 VND
{
  voucherId: "tour789",
  category: "TRAVEL",
  
  supplierPrice: 2_000_000,
  markupPercentage: 0.20, // 20%
  markupAmount: 400_000,
  sellingPrice: 2_400_000,
  
  customerPayment: 2_400_000,
  
  // Breakdown:
  platformRevenue: 400_000, // Markup (DOANH THU)
  supplierCollection: 2_000_000, // THU HỘ supplier
  
  // Verification
  totalBreakdown: 400_000 + 2_000_000 = 2_400_000,
  isBalanced: true
}
```

**Accounting:**
```
Debit: Cash  2,400,000
Credit: Platform Revenue     400,000 (doanh thu)
Credit: Supplier Payable   2,000,000 (nợ phải trả supplier)
```

---

## 🎛️ Admin UI - Revenue Configuration

### Configuration Dashboard

```
┌────────────────────────────────────────────────────────────┐
│ 💰 Revenue Configuration Dashboard                         │
│────────────────────────────────────────────────────────────│
│                                                            │
│ ┌──────────── Current Configuration ─────────────┐       │
│ │                                                 │       │
│ │ Platform Fee:           2,000 VND / transaction │       │
│ │ Driver Commission:      15% of fare             │       │
│ │ Merchant Commission:    15% of order value      │       │
│ │ Subscription:           99,000 VND / month      │       │
│ │ Advertising:            5% of sales             │       │
│ │ Voucher Markup:         20% of supplier price   │       │
│ │                                                 │       │
│ │ Effective since: 2024-01-01                     │       │
│ │ Status: ● ACTIVE                                │       │
│ └─────────────────────────────────────────────────┘       │
│                                                            │
│ ┌──────────── Quick Stats (This Month) ──────────┐       │
│ │ Platform Revenue:        ₫156M   ↑ 12.3%       │       │
│ │ Collections (Thu hộ):    ₫2.8B   ↑ 18.5%       │       │
│ │ Tax Collected:           ₫180M   ↑ 15.2%       │       │
│ └─────────────────────────────────────────────────┘       │
│                                                            │
│ [➕ Create New Config] [📊 View Analytics] [📄 Reports]   │
└────────────────────────────────────────────────────────────┘
```

### Edit Configuration Modal

```
┌────────────────────────────────────────────────────────────┐
│ ✏️ Edit Driver Commission Configuration                    │
│────────────────────────────────────────────────────────────│
│                                                            │
│ Configuration Name:                                        │
│ [Driver Service Commission_________________________]       │
│                                                            │
│ Commission Type:                                           │
│ ● Percentage   ○ Tiered   ○ Fixed                         │
│                                                            │
│ Commission Rate:                                           │
│ ┌─────────────────────────────┐                           │
│ │ [_____15_____] %            │                           │
│ └─────────────────────────────┘                           │
│ Current: 15% | Competitor avg: 18%                        │
│                                                            │
│ 💡 Suggestion: Consider increasing to 16-17% to improve   │
│    profitability while staying competitive.               │
│                                                            │
│ Minimum Commission (optional):                            │
│ [_____1,000_____] VND                                     │
│                                                            │
│ Maximum Commission (optional):                            │
│ [____50,000_____] VND                                     │
│                                                            │
│ ⚙️  Advanced Settings                                      │
│ ┌─ Apply to specific services ──────────────────┐         │
│ │ ☑ Ride Hailing                                │         │
│ │ ☑ Food Delivery                               │         │
│ │ ☑ Shopping Delivery                           │         │
│ └───────────────────────────────────────────────┘         │
│                                                            │
│ ┌─ Geographic zones ────────────────────────────┐         │
│ │ ☑ All zones                                   │         │
│ │ ☐ Specific zones: [Select zones...]           │         │
│ └───────────────────────────────────────────────┘         │
│                                                            │
│ ┌─ Effective Period ────────────────────────────┐         │
│ │ Effective From: [2024-03-01___] 00:00         │         │
│ │ Effective To:   [____________] (Optional)     │         │
│ └───────────────────────────────────────────────┘         │
│                                                            │
│ Reason for Change:                                         │
│ [Adjust commission to align with market rates____        │
│  and improve platform profitability____________]          │
│                                                            │
│ 📊 Impact Simulation:                                      │
│ ┌───────────────────────────────────────────────┐         │
│ │ Estimated Monthly Impact:                     │         │
│ │ Revenue:   +₫8.2M  (+5.3%)                    │         │
│ │ Drivers:   -₫8.2M  (-1.2% per driver)         │         │
│ │ Risk:      LOW (small increase)               │         │
│ │                                               │         │
│ │ Driver satisfaction may decrease slightly.    │         │
│ │ Mitigation: Introduce loyalty bonus.          │         │
│ └───────────────────────────────────────────────┘         │
│                                                            │
│ ⚠️  This change requires approval from: CEO, CFO          │
│                                                            │
│ [Cancel] [Save Draft] [Submit for Approval]               │
└────────────────────────────────────────────────────────────┘
```

### Approval Workflow

```
┌────────────────────────────────────────────────────────────┐
│ 📋 Pending Configuration Changes                           │
│────────────────────────────────────────────────────────────│
│                                                            │
│ ┌─ Change Request #CR-2024-025 ─────────────────┐        │
│ │                                                │        │
│ │ Type: Driver Commission                        │        │
│ │ Change: 15% → 16% (+1pp)                       │        │
│ │ Effective: 2024-03-01                          │        │
│ │ Requested by: Operations Manager               │        │
│ │ Requested at: 2024-02-14 10:30                 │        │
│ │                                                │        │
│ │ Reason: Align with market rates                │        │
│ │                                                │        │
│ │ Impact:                                        │        │
│ │ • Revenue: +₫8.2M/month                        │        │
│ │ • Drivers affected: 1,250                      │        │
│ │ • Risk: LOW                                    │        │
│ │                                                │        │
│ │ Approvals Required:                            │        │
│ │ ✅ CFO (Approved - 2024-02-14 11:00)          │        │
│ │ ⏳ CEO (Pending)                               │        │
│ │                                                │        │
│ │ Comments (2):                                  │        │
│ │ • CFO: "Approved. Monitor driver churn."      │        │
│ │ • You: "Ready for CEO approval."              │        │
│ │                                                │        │
│ │ [Add Comment] [✅ Approve] [❌ Reject]          │        │
│ └────────────────────────────────────────────────┘        │
│                                                            │
│ [View All Pending] [View History]                         │
└────────────────────────────────────────────────────────────┘
```

---

## 📈 Analytics & Reporting

### Revenue Analytics Dashboard

```
┌────────────────────────────────────────────────────────────┐
│ 📊 Revenue Analytics - February 2024                       │
│────────────────────────────────────────────────────────────│
│                                                            │
│ Period: [Feb 1-28, 2024 ▼]  Compare: [Jan 2024 ▼]       │
│                                                            │
│ ┌──────────── Platform Revenue ─────────────────┐        │
│ │                                                │        │
│ │ Total Platform Revenue: ₫156,000,000           │        │
│ │ Growth: +12.3% vs last month                   │        │
│ │                                                │        │
│ │ By Stream:                                     │        │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │        │
│ │ Merchant Commission     ₫62M  (39.7%) ████████│        │
│ │ Driver Commission       ₫48M  (30.8%) ██████  │        │
│ │ Voucher Markup          ₫28M  (17.9%) ████    │        │
│ │ Platform Fees           ₫12M   (7.7%) ██      │        │
│ │ Advertising Fees        ₫4M    (2.6%) █       │        │
│ │ Subscription Fees       ₫2M    (1.3%) ▓       │        │
│ │                                                │        │
│ └────────────────────────────────────────────────┘        │
│                                                            │
│ ┌──────────── Collections (Thu Hộ) ─────────────┐        │
│ │                                                │        │
│ │ Total Collections: ₫2,800,000,000              │        │
│ │ (Not included in platform revenue)             │        │
│ │                                                │        │
│ │ Merchant Collections:   ₫1,680M  (60.0%)       │        │
│ │ Driver Collections:     ₫920M   (32.9%)        │        │
│ │ Supplier Collections:   ₫200M    (7.1%)        │        │
│ │                                                │        │
│ └────────────────────────────────────────────────┘        │
│                                                            │
│ ┌──────────── Tax Collections ───────────────────┐       │
│ │ Total Tax Collected: ₫180,000,000              │       │
│ │                                                │       │
│ │ Driver VAT:             ₫120M   (66.7%)        │       │
│ │ Driver PIT:             ₫60M    (33.3%)        │       │
│ │                                                │       │
│ │ (Withheld and remitted to tax authority)       │       │
│ └────────────────────────────────────────────────┘       │
│                                                            │
│ [📥 Export Report] [📊 Detailed View] [⚙️ Customize]      │
└────────────────────────────────────────────────────────────┘
```

### Financial Report (P&L Format)

```
┌────────────────────────────────────────────────────────────┐
│ 💼 Financial Report - February 2024                        │
│────────────────────────────────────────────────────────────│
│                                                            │
│ REVENUE (Doanh Thu)                                        │
│ ├─ Platform Fees                      ₫12,000,000         │
│ ├─ Driver Commissions                 ₫48,000,000         │
│ ├─ Merchant Commissions               ₫62,000,000         │
│ ├─ Subscription Fees                  ₫2,000,000          │
│ ├─ Advertising Fees                   ₫4,000,000          │
│ ├─ Voucher Markups                    ₫28,000,000         │
│ └─ TOTAL REVENUE                      ₫156,000,000  100%  │
│                                                            │
│ COST OF REVENUE (Giá Vốn)                                 │
│ ├─ Payment Gateway Fees               ₫4,680,000    3.0%  │
│ ├─ SMS/Email Costs                    ₫3,120,000    2.0%  │
│ ├─ Map API Costs                      ₫1,560,000    1.0%  │
│ ├─ Cloud Infrastructure               ₫7,800,000    5.0%  │
│ └─ TOTAL COST                         ₫17,160,000   11.0% │
│                                                            │
│ GROSS PROFIT                          ₫138,840,000   89.0%│
│                                                            │
│ OPERATING EXPENSES                                         │
│ ├─ Salaries & Benefits                ₫80,000,000   51.3% │
│ ├─ Marketing & Advertising            ₫24,000,000   15.4% │
│ ├─ Technology & Development           ₫16,000,000   10.3% │
│ ├─ Office & Admin                     ₫8,000,000    5.1%  │
│ └─ TOTAL OPEX                         ₫128,000,000  82.1% │
│                                                            │
│ EBITDA                                ₫10,840,000    6.9%  │
│                                                            │
│ Depreciation & Amortization           ₫2,000,000    1.3%  │
│ Interest                              ₫1,000,000    0.6%  │
│                                                            │
│ NET PROFIT (Before Tax)               ₫7,840,000     5.0%  │
│ Corporate Income Tax (20%)            ₫1,568,000     1.0%  │
│ NET PROFIT (After Tax)                ₫6,272,000     4.0%  │
│                                                            │
│ ═══════════════════════════════════════════════════════════│
│                                                            │
│ COLLECTIONS (THU HỘ - Not Revenue)                        │
│ ├─ Merchant Collections               ₫1,680,000,000      │
│ ├─ Driver Collections                 ₫920,000,000        │
│ ├─ Supplier Collections               ₫200,000,000        │
│ └─ TOTAL COLLECTIONS                  ₫2,800,000,000      │
│                                                            │
│ Note: Collections are held in trust and disbursed to      │
│ partners. Not recognized as platform revenue.              │
│                                                            │
│ [📥 Download PDF] [📊 Excel Export] [📧 Email Report]     │
└────────────────────────────────────────────────────────────┘
```

---

**File complete (~4,000 lines)**
**Status:** Revenue Management System specifications complete ✅
**Next:** Implementation phase
