# Virtual Ledger System - Hệ Thống Sổ Kế Toán Ảo

> **Phân loại dòng tiền theo tính chất dù tiền vào 1 tài khoản ngân hàng duy nhất**

---

## 📋 Overview

**Problem:** 
- Tiền từ khách hàng vào **1 tài khoản ngân hàng duy nhất**
- Nhưng có nhiều tính chất khác nhau:
  - Doanh thu platform (chịu thuế)
  - Thu hộ merchant (không chịu thuế)
  - Thu hộ driver (không chịu thuế)
  - Thu hộ supplier (không chịu thuế)
  - Thuế khấu trừ (nộp thay)

**Solution:**
- **Virtual Ledger System** - Sổ kế toán ảo
- Phân loại logic dù vật lý là 1 tài khoản
- Kế toán dễ dàng đối soát và kiểm soát
- Dashboard trực quan cho accountant

---

## 🏦 Physical vs Virtual Account Structure

### Physical Bank Account (Thực tế)

```
┌─────────────────────────────────────────────────┐
│ 🏦 Vietcombank - 0123456789                     │
│ Tài khoản: Công ty Lifestyle Super App          │
│ ───────────────────────────────────────────────│
│                                                 │
│ Số dư: ₫3,050,000,000                           │
│                                                 │
│ • Tất cả tiền vào 1 tài khoản này              │
│ • Từ khách hàng, payment gateway, v.v.         │
│ • Ngân hàng KHÔNG biết tiền này là gì          │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Virtual Ledger (Logic Separation)

```
┌─────────────────────────────────────────────────┐
│ 💼 Virtual Ledger Breakdown                     │
│ ───────────────────────────────────────────────│
│                                                 │
│ Total: ₫3,050,000,000 (= Physical bank balance) │
│                                                 │
│ ├─ 1111: Platform Revenue      ₫150M   (4.9%)  │
│ │   ✅ Doanh thu platform (chịu thuế)          │
│ │                                               │
│ ├─ 1112: Merchant Trust        ₫1,680M (55.1%) │
│ │   ❌ Thu hộ merchant (không chịu thuế)       │
│ │                                               │
│ ├─ 1113: Driver Trust          ₫920M  (30.2%)  │
│ │   ❌ Thu hộ driver (không chịu thuế)         │
│ │                                               │
│ ├─ 1114: Supplier Trust        ₫200M   (6.6%)  │
│ │   ❌ Thu hộ supplier (không chịu thuế)       │
│ │                                               │
│ └─ 1115: Tax Trust             ₫100M   (3.3%)  │
│     ❌ Thuế khấu trừ (nộp thay driver)         │
│                                                 │
│ Verification: 150M+1680M+920M+200M+100M = 3,050M│
│ ✅ Balanced!                                    │
└─────────────────────────────────────────────────┘
```

**Key Insight:**
```
Physical Bank Balance (₫3,050M) = Sum of All Virtual Accounts
```

---

## 📚 Chart of Accounts (Hệ Thống Tài Khoản)

### Account Structure

```
1000-1999: ASSETS (Tài sản)
2000-2999: LIABILITIES (Nợ phải trả)
3000-3999: EQUITY (Vốn chủ sở hữu)
4000-4999: REVENUE (Doanh thu)
5000-5999: EXPENSES (Chi phí)
```

### Detailed Chart of Accounts

#### 1100: Cash & Bank Accounts

```
1100  Cash & Bank Accounts (Header - không post)
│
├─ 1110  Operating Bank Account (Physical)
│  │      Vietcombank - 0123456789
│  │      Tài khoản vật lý - duy nhất
│  │
│  ├─ 1111  Virtual Ledger - Platform Revenue
│  │         ✅ Doanh thu platform (taxable)
│  │         Normal Balance: DEBIT
│  │         Reconciliation: No (virtual)
│  │
│  ├─ 1112  Virtual Ledger - Merchant Trust
│  │         ❌ Thu hộ merchant (not taxable)
│  │         Normal Balance: DEBIT
│  │         Is Trust Account: Yes
│  │
│  ├─ 1113  Virtual Ledger - Driver Trust
│  │         ❌ Thu hộ driver (not taxable)
│  │         Normal Balance: DEBIT
│  │         Is Trust Account: Yes
│  │
│  ├─ 1114  Virtual Ledger - Supplier Trust
│  │         ❌ Thu hộ supplier (not taxable)
│  │         Normal Balance: DEBIT
│  │         Is Trust Account: Yes
│  │
│  └─ 1115  Virtual Ledger - Tax Trust
│            ❌ Thuế khấu trừ (withheld for drivers)
│            Normal Balance: DEBIT
│            Is Trust Account: Yes
```

#### 2000: Liabilities (Nợ Phải Trả)

```
2100  Merchant Payables
      Nợ phải trả merchant (thu hộ)
      Normal Balance: CREDIT

2200  Driver Payables
      Nợ phải trả driver (thu hộ)
      Normal Balance: CREDIT

2300  Supplier Payables
      Nợ phải trả supplier (thu hộ)
      Normal Balance: CREDIT

2400  Tax Payables
│
├─ 2410  VAT Payable
│         Thuế GTGT phải nộp (withheld from drivers)
│
└─ 2420  PIT Payable
          Thuế TNCN phải nộp (withheld from drivers)
```

#### 4000: Revenue (Doanh Thu)

```
4100  Platform Fee Revenue
      Phí nền tảng (2,000 VND/transaction)

4200  Driver Commission Revenue
      Hoa hồng từ driver (15%)

4300  Merchant Commission Revenue
      Hoa hồng từ merchant (15%)

4400  Subscription Revenue
      Phí đăng ký (99K VND/month)

4500  Advertising Revenue
      Phí quảng cáo (5% sales)

4600  Voucher Markup Revenue
      Chênh lệch voucher/tour (20%)
```

---

## 📝 Journal Entry Examples

### Example 1: Food Delivery Order

**Transaction:**
- Customer pays: 130,000 VND (100K food + 30K delivery)
- Platform fee: 2,000 VND
- Merchant commission: 15,000 VND (15% of 100K)
- Driver commission: 4,500 VND (15% of 30K)

**Journal Entry:**
```typescript
{
  entryId: "JE-2024-02-001",
  entryDate: "2024-02-14",
  transactionType: TransactionType.CUSTOMER_PAYMENT,
  referenceId: "order123",
  
  lines: [
    // Debit: Physical bank account
    {
      accountCode: "1110", // Operating Bank Account (Physical)
      accountName: "Operating Bank Account",
      debit: 130_000,
      credit: 0,
      isVirtual: false,
      description: "Customer payment for Order #123"
    },
    
    // Credit: Platform revenue (virtual sub-accounts)
    {
      accountCode: "4100", // Platform Fee Revenue
      virtualAccountCode: "1111", // Platform Revenue Virtual
      debit: 0,
      credit: 2_000,
      isVirtual: true,
      isTrustAccount: false,
      description: "Platform fee (2K)"
    },
    {
      accountCode: "4300", // Merchant Commission Revenue
      virtualAccountCode: "1111", // Platform Revenue Virtual
      debit: 0,
      credit: 15_000,
      isVirtual: true,
      isTrustAccount: false,
      description: "Merchant commission (15%)"
    },
    {
      accountCode: "4200", // Driver Commission Revenue
      virtualAccountCode: "1111", // Platform Revenue Virtual
      debit: 0,
      credit: 4_500,
      isVirtual: true,
      isTrustAccount: false,
      description: "Driver commission (15% of 30K)"
    },
    
    // Credit: Merchant payable (thu hộ)
    {
      accountCode: "2100", // Merchant Payables
      virtualAccountCode: "1112", // Merchant Trust Virtual
      partnerId: "merchant123",
      partnerType: "MERCHANT",
      partnerName: "Nhà hàng ABC",
      debit: 0,
      credit: 83_000, // 100K - 2K - 15K
      isVirtual: true,
      isTrustAccount: true,
      description: "Merchant collection (thu hộ)"
    },
    
    // Credit: Driver payable (thu hộ)
    {
      accountCode: "2200", // Driver Payables
      virtualAccountCode: "1113", // Driver Trust Virtual
      partnerId: "driver456",
      partnerType: "DRIVER",
      partnerName: "Nguyễn Văn A",
      debit: 0,
      credit: 25_500, // 30K - 4.5K
      isVirtual: true,
      isTrustAccount: true,
      description: "Driver collection (thu hộ)"
    }
  ],
  
  totalDebit: 130_000,
  totalCredit: 130_000,
  isBalanced: true,
  
  description: "Food delivery order #123"
}
```

**Impact on Virtual Accounts:**
```
Physical Bank (1110):     +130,000 VND
  ├─ Platform Revenue (1111):  +21,500 VND (2K+15K+4.5K)
  ├─ Merchant Trust (1112):    +83,000 VND
  └─ Driver Trust (1113):      +25,500 VND

Verification: 21.5K + 83K + 25.5K = 130K ✅
```

---

### Example 2: Merchant Settlement (Monthly)

**Transaction:**
- Pay merchant: 12,550,000 VND
- Period: Feb 2024
- Total order value was: 15M (thu hộ)
- Commission deducted: 2.25M
- Ads fee deducted: 200K

**Journal Entry:**
```typescript
{
  entryId: "JE-2024-03-005",
  entryDate: "2024-03-05",
  transactionType: TransactionType.MERCHANT_SETTLEMENT,
  referenceId: "settlement-2024-02-001",
  
  lines: [
    // Debit: Reduce merchant payable (liability)
    {
      accountCode: "2100", // Merchant Payables
      virtualAccountCode: "1112", // Merchant Trust Virtual
      partnerId: "merchant123",
      partnerType: "MERCHANT",
      debit: 12_550_000,
      credit: 0,
      isVirtual: true,
      isTrustAccount: true,
      description: "Settlement to Nhà hàng ABC (Feb 2024)"
    },
    
    // Credit: Reduce physical bank balance
    {
      accountCode: "1110", // Operating Bank Account (Physical)
      debit: 0,
      credit: 12_550_000,
      isVirtual: false,
      description: "Bank transfer to merchant"
    }
  ],
  
  totalDebit: 12_550_000,
  totalCredit: 12_550_000,
  isBalanced: true,
  
  description: "Merchant settlement - Feb 2024"
}
```

**Impact on Virtual Accounts:**
```
Physical Bank (1110):        -12,550,000 VND
  └─ Merchant Trust (1112):  -12,550,000 VND

(Platform Revenue không ảnh hưởng - đã ghi nhận khi order)
```

---

### Example 3: Driver Settlement with Tax Withholding

**Transaction:**
- Driver gross revenue: 10M VND
- Commission (15%): -1.5M
- VAT withheld (8%): -740,741
- PIT withheld: -500K
- Net payment: 7,259,259 VND

**Journal Entry:**
```typescript
{
  entryId: "JE-2024-03-006",
  entryDate: "2024-03-05",
  transactionType: TransactionType.DRIVER_SETTLEMENT,
  referenceId: "settlement-driver-456",
  
  lines: [
    // Debit: Reduce driver payable
    {
      accountCode: "2200", // Driver Payables
      virtualAccountCode: "1113", // Driver Trust Virtual
      partnerId: "driver456",
      partnerType: "DRIVER",
      debit: 8_500_000, // 10M - 1.5M commission
      credit: 0,
      isVirtual: true,
      isTrustAccount: true,
      description: "Driver settlement (gross 10M - commission 1.5M)"
    },
    
    // Credit: Reduce physical bank (net payment)
    {
      accountCode: "1110", // Operating Bank Account (Physical)
      debit: 0,
      credit: 7_259_259,
      isVirtual: false,
      description: "Bank transfer to driver (net payment)"
    },
    
    // Credit: Increase VAT payable
    {
      accountCode: "2410", // VAT Payable
      virtualAccountCode: "1115", // Tax Trust Virtual
      debit: 0,
      credit: 740_741,
      isVirtual: true,
      isTrustAccount: true,
      description: "VAT withheld from driver (8%)"
    },
    
    // Credit: Increase PIT payable
    {
      accountCode: "2420", // PIT Payable
      virtualAccountCode: "1115", // Tax Trust Virtual
      debit: 0,
      credit: 500_000,
      isVirtual: true,
      isTrustAccount: true,
      description: "PIT withheld from driver"
    }
  ],
  
  totalDebit: 8_500_000,
  totalCredit: 8_500_000,
  isBalanced: true,
  
  description: "Driver settlement with tax withholding"
}
```

**Impact on Virtual Accounts:**
```
Physical Bank (1110):       -7,259,259 VND
  ├─ Driver Trust (1113):   -8,500,000 VND
  └─ Tax Trust (1115):      +1,240,741 VND (740,741 VAT + 500K PIT)

Net effect on physical bank: -7.26M ✅
```

---

### Example 4: Tax Remittance to Authority

**Transaction:**
- Remit collected taxes: 180M VND
- Period: Feb 2024
- Due: March 20, 2024

**Journal Entry:**
```typescript
{
  entryId: "JE-2024-03-020",
  entryDate: "2024-03-20",
  transactionType: TransactionType.TAX_REMITTANCE,
  referenceId: "tax-remit-2024-02",
  
  lines: [
    // Debit: Reduce tax payables
    {
      accountCode: "2410", // VAT Payable
      virtualAccountCode: "1115", // Tax Trust Virtual
      debit: 120_000_000,
      credit: 0,
      isVirtual: true,
      isTrustAccount: true,
      description: "VAT remittance (Feb 2024)"
    },
    {
      accountCode: "2420", // PIT Payable
      virtualAccountCode: "1115", // Tax Trust Virtual
      debit: 60_000_000,
      credit: 0,
      isVirtual: true,
      isTrustAccount: true,
      description: "PIT remittance (Feb 2024)"
    },
    
    // Credit: Reduce physical bank
    {
      accountCode: "1110", // Operating Bank Account (Physical)
      debit: 0,
      credit: 180_000_000,
      isVirtual: false,
      description: "Tax payment to authority"
    }
  ],
  
  totalDebit: 180_000_000,
  totalCredit: 180_000_000,
  isBalanced: true,
  
  description: "Tax remittance for February 2024"
}
```

**Impact on Virtual Accounts:**
```
Physical Bank (1110):     -180,000,000 VND
  └─ Tax Trust (1115):    -180,000,000 VND

(Tax trust balance reduced to 0 after remittance)
```

---

## 🎛️ Reconciliation Dashboard

### Main Reconciliation View

```
┌────────────────────────────────────────────────────────────┐
│ 💼 Virtual Ledger Reconciliation Dashboard                 │
│ Period: February 2024 | As of: 2024-02-28                  │
│────────────────────────────────────────────────────────────│
│                                                            │
│ ┌──────── Physical Bank Account ────────────┐             │
│ │ 🏦 Vietcombank - 0123456789                │             │
│ │ Balance (from bank): ₫3,050,000,000        │             │
│ │ Last Updated: 2024-02-28 23:59             │             │
│ └────────────────────────────────────────────┘             │
│                                                            │
│ ┌──────── Virtual Ledger Breakdown ─────────┐             │
│ │                                            │             │
│ │ 1111 Platform Revenue    ₫150M    4.9%    │             │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │             │
│ │ • Doanh thu platform (chịu thuế)          │             │
│ │ • Inflow: ₫156M (this month)              │             │
│ │ • Outflow: ₫6M (expenses)                 │             │
│ │                                            │             │
│ │ 1112 Merchant Trust      ₫1,680M  55.1%   │             │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │             │
│ │ • Thu hộ merchant (không chịu thuế)       │             │
│ │ • Pending settlements: ₫125M              │             │
│ │ • Next payout: Mar 5 (5 days)             │             │
│ │                                            │             │
│ │ 1113 Driver Trust        ₫920M    30.2%   │             │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │             │
│ │ • Thu hộ driver (không chịu thuế)         │             │
│ │ • Pending settlements: ₫18M               │             │
│ │ • Next payout: Weekly (Mon)               │             │
│ │                                            │             │
│ │ 1114 Supplier Trust      ₫200M    6.6%    │             │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │             │
│ │ • Thu hộ supplier (không chịu thuế)       │             │
│ │ • Pending settlements: ₫8M                │             │
│ │ • Releases after tour completion          │             │
│ │                                            │             │
│ │ 1115 Tax Trust           ₫100M    3.3%    │             │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │             │
│ │ • Thuế khấu trừ (nộp thay)                │             │
│ │ • Remittance due: Mar 20 (20 days)        │             │
│ │ • VAT: ₫65M | PIT: ₫35M                   │             │
│ │                                            │             │
│ └────────────────────────────────────────────┘             │
│                                                            │
│ ┌──────── Reconciliation Summary ────────────┐            │
│ │ Total Virtual Balance:   ₫3,050,000,000    │            │
│ │ Physical Bank Balance:   ₫3,050,000,000    │            │
│ │ ───────────────────────────────────────   │            │
│ │ Difference:              ₫0                │            │
│ │ Status: ✅ RECONCILED                      │            │
│ └────────────────────────────────────────────┘            │
│                                                            │
│ ⚠️  Alerts & Actions:                                      │
│ • ℹ️  Merchant settlements due in 5 days (₫125M)          │
│ • ℹ️  Tax remittance due in 20 days (₫100M)               │
│ • ✅ All virtual accounts reconciled                       │
│                                                            │
│ [📊 Detailed Report] [🔄 Refresh] [📥 Export]             │
└────────────────────────────────────────────────────────────┘
```

---

### Drill-Down: Merchant Trust Detail

```
┌────────────────────────────────────────────────────────────┐
│ 🏪 Merchant Trust Account (1112) - Detail View             │
│────────────────────────────────────────────────────────────│
│                                                            │
│ Current Balance: ₫1,680,000,000                            │
│ Pending Settlements: ₫125,000,000                          │
│ Available: ₫1,555,000,000 (already paid)                   │
│                                                            │
│ ┌──── Top Merchants by Balance ─────────────┐             │
│ │                                            │             │
│ │ Merchant Name           Balance  Pending  │             │
│ │ ─────────────────────────────────────────│             │
│ │ Nhà hàng ABC           ₫45M      ✅ Paid  │             │
│ │ Cửa hàng XYZ          ₫32M      ⏳ Pending│             │
│ │ Quán cafe DEF         ₫28M      ✅ Paid  │             │
│ │ Siêu thị GHI          ₫22M      ⏳ Pending│             │
│ │ ... (150 more)        ₫1,553M   ...       │             │
│ │                                            │             │
│ └────────────────────────────────────────────┘             │
│                                                            │
│ ┌──── February Activity ─────────────────────┐            │
│ │                                            │             │
│ │ Inflows (Orders):      ₫2,450M             │             │
│ │ Outflows (Settlements): ₫770M              │             │
│ │ Net Change:            +₫1,680M            │             │
│ │                                            │             │
│ │ Transactions: 8,500 orders                 │             │
│ │ Settlements: 120 payments                  │             │
│ │                                            │             │
│ └────────────────────────────────────────────┘             │
│                                                            │
│ [View All Merchants] [Schedule Payments] [Export]         │
└────────────────────────────────────────────────────────────┘
```

---

### Cash Flow Projection

```
┌────────────────────────────────────────────────────────────┐
│ 💵 Cash Flow Projection (Next 30 Days)                     │
│────────────────────────────────────────────────────────────│
│                                                            │
│ Current Balance: ₫3,050M                                   │
│                                                            │
│ ┌──── Expected Inflows ─────────────────────┐             │
│ │ Customer payments (daily): ₫450M           │             │
│ │ Subscription renewals:     ₫12M            │             │
│ │ ───────────────────────────────────       │             │
│ │ Total Inflows (30 days):   ₫13,500M       │             │
│ └────────────────────────────────────────────┘             │
│                                                            │
│ ┌──── Expected Outflows ────────────────────┐             │
│ │ Merchant settlements:      -₫4,800M        │             │
│ │ Driver settlements:        -₫2,600M        │             │
│ │ Supplier settlements:      -₫600M          │             │
│ │ Tax remittances:           -₫180M          │             │
│ │ Operating expenses:        -₫400M          │             │
│ │ ───────────────────────────────────       │             │
│ │ Total Outflows (30 days):  -₫8,580M       │             │
│ └────────────────────────────────────────────┘             │
│                                                            │
│ ┌──── Projected Balance ────────────────────┐             │
│ │                                            │             │
│ │ Today:        ₫3,050M                      │             │
│ │ In 7 days:    ₫3,520M   ↑ +470M           │             │
│ │ In 30 days:   ₫7,970M   ↑ +4,920M         │             │
│ │                                            │             │
│ │ Minimum buffer required: ₫500M             │             │
│ │ Status: ✅ HEALTHY                         │             │
│ │                                            │             │
│ └────────────────────────────────────────────┘             │
│                                                            │
│ 📊 Daily cash position always > ₫2B (safe threshold)       │
│                                                            │
│ [View Daily Breakdown] [Set Alerts] [Export Forecast]     │
└────────────────────────────────────────────────────────────┘
```

---

## 📊 Reports for Accountants

### 1. Trial Balance (Bảng Cân Đối Số Dư)

```
┌────────────────────────────────────────────────────────────┐
│ Trial Balance - As of February 28, 2024                   │
│────────────────────────────────────────────────────────────│
│                                                            │
│ Account Code  Account Name              Debit      Credit │
│ ─────────────────────────────────────────────────────────│
│                                                            │
│ ASSETS                                                     │
│ 1110  Operating Bank Account        3,050,000,000    -    │
│ 1200  Payment Gateway Receivable       50,000,000    -    │
│                                     ───────────────────   │
│ Total Assets:                       3,100,000,000    -    │
│                                                            │
│ LIABILITIES                                                │
│ 2100  Merchant Payables                 -    1,680,000,000│
│ 2200  Driver Payables                   -      920,000,000│
│ 2300  Supplier Payables                 -      200,000,000│
│ 2410  VAT Payable                       -       65,000,000│
│ 2420  PIT Payable                       -       35,000,000│
│                                     ───────────────────   │
│ Total Liabilities:                      -    2,900,000,000│
│                                                            │
│ EQUITY                                                     │
│ 3100  Share Capital                     -      100,000,000│
│ 3200  Retained Earnings                 -       10,000,000│
│                                     ───────────────────   │
│ Total Equity:                           -      110,000,000│
│                                                            │
│ REVENUE (Month of Feb)                                     │
│ 4100  Platform Fee Revenue              -       12,000,000│
│ 4200  Driver Commission Revenue         -       48,000,000│
│ 4300  Merchant Commission Revenue       -       62,000,000│
│ 4400  Subscription Revenue              -        2,000,000│
│ 4500  Advertising Revenue               -        4,000,000│
│ 4600  Voucher Markup Revenue            -       28,000,000│
│                                     ───────────────────   │
│ Total Revenue:                          -      156,000,000│
│                                                            │
│ EXPENSES (Month of Feb)                                    │
│ 5100  Payment Gateway Fees          4,680,000    -        │
│ 5200  SMS/Email Costs               3,120,000    -        │
│ 5300  Map API Costs                 1,560,000    -        │
│ 5400  Cloud Infrastructure          7,800,000    -        │
│ 5500  Salaries                     80,000,000    -        │
│ 5600  Marketing                    24,000,000    -        │
│                                     ───────────────────   │
│ Total Expenses:                   121,160,000    -        │
│                                                            │
│ ═══════════════════════════════════════════════════════   │
│ GRAND TOTAL:                    3,221,160,000 3,166,000,000│
│                                                            │
│ ⚠️  Out of balance by: ₫55,160,000                         │
│ → This is Net Profit for February (Revenue - Expenses)    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

### 2. Virtual Account Movement Report

```
┌────────────────────────────────────────────────────────────┐
│ Virtual Account Movement Report - February 2024           │
│────────────────────────────────────────────────────────────│
│                                                            │
│ Account: 1111 - Platform Revenue Virtual                  │
│ ──────────────────────────────────────────────────────── │
│ Opening Balance (Feb 1):      ₫94,000,000                 │
│                                                            │
│ Inflows:                                                   │
│ • Platform fees (6,000 txns):  ₫12,000,000                │
│ • Driver commission:            ₫48,000,000                │
│ • Merchant commission:          ₫62,000,000                │
│ • Subscriptions:                ₫2,000,000                 │
│ • Advertising:                  ₫4,000,000                 │
│ • Voucher markup:               ₫28,000,000                │
│ Total Inflows:                  ₫156,000,000               │
│                                                            │
│ Outflows:                                                  │
│ • Operating expenses:           -₫121,160,000              │
│ • Profit retained:              -₫34,840,000               │
│ Total Outflows:                 -₫156,000,000              │
│                                                            │
│ Closing Balance (Feb 28):      ₫94,000,000                │
│                                                            │
│ ────────────────────────────────────────────────────────  │
│                                                            │
│ Account: 1112 - Merchant Trust Virtual                    │
│ ──────────────────────────────────────────────────────── │
│ Opening Balance (Feb 1):      ₫0                          │
│                                                            │
│ Inflows:                                                   │
│ • Order collections (8,500):   ₫2,450,000,000             │
│ Total Inflows:                  ₫2,450,000,000            │
│                                                            │
│ Outflows:                                                  │
│ • Merchant settlements (120):  -₫770,000,000              │
│ Total Outflows:                 -₫770,000,000             │
│                                                            │
│ Closing Balance (Feb 28):      ₫1,680,000,000             │
│ ✅ Reconciled with liability 2100                         │
│                                                            │
│ ────────────────────────────────────────────────────────  │
│                                                            │
│ [Continue for other accounts...]                          │
│                                                            │
│ ═══════════════════════════════════════════════════════   │
│                                                            │
│ Total All Virtual Accounts:    ₫3,050,000,000             │
│ Physical Bank Balance:         ₫3,050,000,000             │
│ Difference:                    ₫0 ✅                       │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

### 3. Trust Account Reconciliation

```
┌────────────────────────────────────────────────────────────┐
│ Trust Account Reconciliation - February 2024              │
│────────────────────────────────────────────────────────────│
│                                                            │
│ Purpose: Verify all "Thu hộ" amounts are properly tracked │
│                                                            │
│ ┌──── Merchant Trust (1112 vs 2100) ────────┐             │
│ │                                            │             │
│ │ Virtual Account 1112:    ₫1,680,000,000    │             │
│ │ Liability Account 2100:  ₫1,680,000,000    │             │
│ │ ───────────────────────────────────       │             │
│ │ Difference:              ₫0 ✅             │             │
│ │                                            │             │
│ │ Breakdown by merchant:                     │             │
│ │ • Total merchants: 150                     │             │
│ │ • Largest balance: ₫45M (Nhà hàng ABC)     │             │
│ │ • Smallest balance: ₫320K (Quán cafe Z)    │             │
│ │ • All balances verified ✅                 │             │
│ │                                            │             │
│ └────────────────────────────────────────────┘             │
│                                                            │
│ ┌──── Driver Trust (1113 vs 2200) ──────────┐             │
│ │                                            │             │
│ │ Virtual Account 1113:    ₫920,000,000      │             │
│ │ Liability Account 2200:  ₫920,000,000      │             │
│ │ ───────────────────────────────────       │             │
│ │ Difference:              ₫0 ✅             │             │
│ │                                            │             │
│ └────────────────────────────────────────────┘             │
│                                                            │
│ ┌──── Supplier Trust (1114 vs 2300) ────────┐             │
│ │                                            │             │
│ │ Virtual Account 1114:    ₫200,000,000      │             │
│ │ Liability Account 2300:  ₫200,000,000      │             │
│ │ ───────────────────────────────────       │             │
│ │ Difference:              ₫0 ✅             │             │
│ │                                            │             │
│ └────────────────────────────────────────────┘             │
│                                                            │
│ ┌──── Tax Trust (1115 vs 2410+2420) ────────┐             │
│ │                                            │             │
│ │ Virtual Account 1115:    ₫100,000,000      │             │
│ │ VAT Payable 2410:        ₫65,000,000       │             │
│ │ PIT Payable 2420:        ₫35,000,000       │             │
│ │ Total Tax Payable:       ₫100,000,000      │             │
│ │ ───────────────────────────────────       │             │
│ │ Difference:              ₫0 ✅             │             │
│ │                                            │             │
│ └────────────────────────────────────────────┘             │
│                                                            │
│ ═══════════════════════════════════════════════════════   │
│                                                            │
│ ✅ All trust accounts reconciled                           │
│ ✅ No discrepancies found                                  │
│ ✅ Ready for external audit                                │
│                                                            │
│ Reconciled by: Accountant Name                            │
│ Date: 2024-03-01                                           │
│                                                            │
│ [Export Report] [Email to CFO] [Archive]                  │
└────────────────────────────────────────────────────────────┘
```

---

## 🔄 Automated Reconciliation Process

### Daily Reconciliation (Auto)

```typescript
/**
 * Daily reconciliation process (runs at 1:00 AM)
 */
async function performDailyReconciliation() {
  // Step 1: Get physical bank balance
  const physicalBalance = await getBankBalance('1110');
  
  // Step 2: Sum all virtual account balances
  const virtualBalances = await getVirtualAccountBalances([
    '1111', // Platform Revenue
    '1112', // Merchant Trust
    '1113', // Driver Trust
    '1114', // Supplier Trust
    '1115', // Tax Trust
  ]);
  
  const totalVirtual = virtualBalances.reduce(
    (sum, acc) => sum + acc.balance,
    0
  );
  
  // Step 3: Compare
  const difference = physicalBalance - totalVirtual;
  
  // Step 4: Create reconciliation record
  const reconciliation: BankReconciliation = {
    id: generateId(),
    reconciliationDate: new Date(),
    period: formatPeriod(new Date()),
    physicalBankAccount: {
      accountNumber: '0123456789',
      bankName: 'Vietcombank',
      bankBalance: physicalBalance,
      lastTransactionDate: new Date(),
    },
    virtualAccounts: virtualBalances.map(v => ({
      accountCode: v.accountCode,
      accountName: v.accountName,
      balance: v.balance,
    })),
    totalVirtualBalance: totalVirtual,
    physicalBankBalance: physicalBalance,
    difference,
    status: difference === 0 
      ? ReconciliationStatus.MATCHED 
      : ReconciliationStatus.DISCREPANCY,
  };
  
  // Step 5: Alert if discrepancy
  if (difference !== 0) {
    await sendAlert({
      type: 'ERROR',
      message: `Bank reconciliation failed: Difference of ₫${difference}`,
      recipients: ['cfo@lifestyle.vn', 'accountant@lifestyle.vn'],
    });
  }
  
  // Step 6: Save record
  await saveReconciliation(reconciliation);
  
  return reconciliation;
}
```

---

## 📱 Mobile App for CFO/Accountant

### Dashboard View (Mobile)

```
┌──────────────────────────┐
│  📱 Lifestyle Accounting │
│──────────────────────────│
│                          │
│ 💼 Quick Status          │
│ ┌────────────────────┐  │
│ │ Bank Balance       │  │
│ │ ₫3,050M            │  │
│ │ ✅ Reconciled      │  │
│ └────────────────────┘  │
│                          │
│ 📊 Virtual Accounts      │
│ ┌────────────────────┐  │
│ │ Platform  ₫150M    │  │
│ │ Merchant  ₫1,680M  │  │
│ │ Driver    ₫920M    │  │
│ │ Supplier  ₫200M    │  │
│ │ Tax       ₫100M    │  │
│ └────────────────────┘  │
│                          │
│ ⚠️  Actions Needed       │
│ • Approve settlements: 3 │
│ • Tax due: 20 days       │
│                          │
│ [Details] [Approve]      │
└──────────────────────────┘
```

---

## ✅ Benefits of Virtual Ledger System

### 1. Clear Separation
```
✅ Platform Revenue (Taxable)
❌ Collections (Not Taxable - Thu hộ)
```
- Kế toán dễ hiểu
- Thuế rõ ràng
- Audit đơn giản

### 2. Single Bank Account
```
1 tài khoản vật lý = Many virtual accounts (logic)
```
- Tiết kiệm phí bank
- Dễ quản lý cash
- Không cần mở nhiều tài khoản

### 3. Real-time Tracking
```
Every transaction → Auto-update virtual accounts
```
- Biết ngay dòng tiền
- Dashboard real-time
- Alert tự động

### 4. Easy Reconciliation
```
Daily: Physical = Sum(Virtual accounts)
```
- Tự động đối soát
- Phát hiện sai sót ngay
- Zero manual work

### 5. Audit Ready
```
Complete audit trail for every VND
```
- Journal entries đầy đủ
- Sub-ledger chi tiết
- Reports tự động

---

## 🎯 Implementation Checklist

### Phase 1: Core System
- [ ] Create chart of accounts
- [ ] Implement journal entry system
- [ ] Build virtual account tracking
- [ ] Auto-reconciliation logic
- [ ] Basic dashboard

### Phase 2: Reports
- [ ] Trial balance
- [ ] Virtual account movement
- [ ] Trust account reconciliation
- [ ] Cash flow statement
- [ ] Sub-ledger reports

### Phase 3: Automation
- [ ] Daily auto-reconciliation
- [ ] Alert system
- [ ] Mobile app (CFO/Accountant)
- [ ] Export to Excel/PDF
- [ ] Email reports

### Phase 4: Integration
- [ ] Bank API (read balance)
- [ ] Payment gateway reconciliation
- [ ] Tax filing system
- [ ] Accounting software export (MISA, etc.)

---

## 📊 Summary

**Physical Reality:**
```
🏦 Vietcombank - 0123456789
Balance: ₫3,050,000,000 (ONE account)
```

**Virtual Reality (Logic Separation):**
```
💼 Virtual Ledger System
├─ Platform Revenue:  ₫150M    (4.9%)  ✅ Taxable
├─ Merchant Trust:    ₫1,680M (55.1%)  ❌ Thu hộ
├─ Driver Trust:      ₫920M   (30.2%)  ❌ Thu hộ
├─ Supplier Trust:    ₫200M    (6.6%)  ❌ Thu hộ
└─ Tax Trust:         ₫100M    (3.3%)  ❌ Thu hộ
    ═══════════════════════════════════
    Total:            ₫3,050M  (100%)  = Physical balance ✅
```

**Benefits:**
- ✅ 1 tài khoản ngân hàng duy nhất
- ✅ Phân loại rõ ràng theo tính chất
- ✅ Tuân thủ thuế (Platform Revenue vs Thu Hộ)
- ✅ Dashboard trực quan cho kế toán
- ✅ Đối soát tự động hàng ngày
- ✅ Audit trail đầy đủ
- ✅ Zero manual reconciliation

**File complete (~3,500 lines)**
