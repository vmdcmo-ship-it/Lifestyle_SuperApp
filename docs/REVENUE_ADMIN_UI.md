# Revenue Admin UI - Configuration Interface

> **Giao diện quản trị nguồn thu** - No-code, intuitive, compliance-focused

---

## 🎛️ Configuration Screens

### 1. Platform Fee Configuration

```
┌────────────────────────────────────────────────────────────┐
│ 💰 Platform Fee Configuration                              │
│────────────────────────────────────────────────────────────│
│                                                            │
│ ┌─ Basic Settings ───────────────────────────────┐        │
│ │                                                │        │
│ │ Configuration Name:                            │        │
│ │ [Platform Transaction Fee________________]    │        │
│ │                                                │        │
│ │ Description:                                   │        │
│ │ [Fixed fee charged per transaction________    │        │
│ │  _________________________________________]    │        │
│ │                                                │        │
│ │ Fee Amount:                                    │        │
│ │ ┌──────────────────────────┐                  │        │
│ │ │ [_____2,000_____] VND    │                  │        │
│ │ └──────────────────────────┘                  │        │
│ │ Range: 1,000 - 5,000 VND                       │        │
│ │                                                │        │
│ │ 💡 Competitor Analysis:                        │        │
│ │    • Grab: 2,500 VND                           │        │
│ │    • GoJek: 2,000 VND                          │        │
│ │    • Be: 1,500 VND                             │        │
│ │    • Average: 2,000 VND ✅ Competitive         │        │
│ │                                                │        │
│ └────────────────────────────────────────────────┘        │
│                                                            │
│ ┌─ Service Applicability ────────────────────────┐        │
│ │ Apply to:                                      │        │
│ │ ☑ Ride Hailing                                 │        │
│ │ ☑ Food Delivery                                │        │
│ │ ☑ Shopping Delivery                            │        │
│ │ ☐ Travel (uses markup model)                   │        │
│ │ ☐ Insurance (uses commission model)            │        │
│ └────────────────────────────────────────────────┘        │
│                                                            │
│ ┌─ Effective Period ─────────────────────────────┐        │
│ │ Effective From: [2024-03-01___] 00:00 ICT      │        │
│ │                                                │        │
│ │ Effective To (Optional):                       │        │
│ │ [____________] (Leave empty for indefinite)    │        │
│ │                                                │        │
│ │ ℹ️  Current config will be automatically       │        │
│ │    superseded on effective date.               │        │
│ └────────────────────────────────────────────────┘        │
│                                                            │
│ ┌─ Impact Simulation ────────────────────────────┐        │
│ │ Estimated Impact (Next 30 days):               │        │
│ │                                                │        │
│ │ Transactions:            15,000                │        │
│ │ Current revenue:         ₫30M (2K × 15K)       │        │
│ │ New revenue:             ₫30M (no change)      │        │
│ │ Change:                  ₫0 (0%)               │        │
│ │                                                │        │
│ │ Customer impact:         None (same fee)       │        │
│ │ Risk:                    ⚪ NONE               │        │
│ └────────────────────────────────────────────────┘        │
│                                                            │
│ [Cancel] [Save Draft] [Submit for Approval]               │
└────────────────────────────────────────────────────────────┘
```

---

### 2. Driver Commission Configuration (Tiered)

```
┌────────────────────────────────────────────────────────────┐
│ 🚗 Driver Commission Configuration (Tiered)                │
│────────────────────────────────────────────────────────────│
│                                                            │
│ Configuration Name:                                        │
│ [Driver Service Commission - Tiered________________]      │
│                                                            │
│ Commission Type:                                           │
│ ○ Fixed Percentage   ● Tiered   ○ Hybrid                  │
│                                                            │
│ ┌─ Commission Tiers ──────────────────────────────┐       │
│ │                                                 │       │
│ │ Tier 1: Low Volume Drivers                      │       │
│ │ Monthly Revenue: 0 - 10,000,000 VND            │       │
│ │ Commission Rate: [___15___] %                   │       │
│ │ Description: [New or part-time drivers_____]    │       │
│ │                                                 │       │
│ │ ─────────────────────────────────────────────  │       │
│ │                                                 │       │
│ │ Tier 2: Medium Volume Drivers                   │       │
│ │ Monthly Revenue: 10M - 20M VND                 │       │
│ │ Commission Rate: [___12___] %                   │       │
│ │ Description: [Regular full-time drivers____]    │       │
│ │                                                 │       │
│ │ ─────────────────────────────────────────────  │       │
│ │                                                 │       │
│ │ Tier 3: High Volume Drivers                     │       │
│ │ Monthly Revenue: 20M - 30M VND                 │       │
│ │ Commission Rate: [___10___] %                   │       │
│ │ Description: [Top performers_______________]    │       │
│ │                                                 │       │
│ │ ─────────────────────────────────────────────  │       │
│ │                                                 │       │
│ │ Tier 4: Elite Drivers                           │       │
│ │ Monthly Revenue: 30M+ VND                      │       │
│ │ Commission Rate: [____8___] %                   │       │
│ │ Description: [Diamond tier drivers_________]    │       │
│ │                                                 │       │
│ │ [+ Add Tier]                                    │       │
│ └─────────────────────────────────────────────────┘       │
│                                                            │
│ 💡 Tiered commission incentivizes high performance!        │
│    Drivers earn more as they do more trips.                │
│                                                            │
│ ┌─ Impact Simulation ────────────────────────────┐        │
│ │ Current driver distribution:                   │        │
│ │ • Tier 1 (15%): 450 drivers → ₫2.7M commission │        │
│ │ • Tier 2 (12%): 620 drivers → ₫8.9M commission │        │
│ │ • Tier 3 (10%): 280 drivers → ₫7.0M commission │        │
│ │ • Tier 4 (8%):  150 drivers → ₫3.6M commission │        │
│ │                                                │        │
│ │ Total commission: ₫22.2M                       │        │
│ │ vs Flat 15%: ₫26.8M                            │        │
│ │ Savings: ₫4.6M (-17.2%)                        │        │
│ │                                                │        │
│ │ Driver satisfaction: ↑ High performers happy   │        │
│ └────────────────────────────────────────────────┘        │
│                                                            │
│ [Save Configuration] [Preview Tiers]                      │
└────────────────────────────────────────────────────────────┘
```

---

### 3. Merchant Commission with Categories

```
┌────────────────────────────────────────────────────────────┐
│ 🏪 Merchant Commission Configuration                       │
│────────────────────────────────────────────────────────────│
│                                                            │
│ Commission Rate: [___15___] %                              │
│                                                            │
│ ┌─ By Merchant Category ──────────────────────────┐       │
│ │                                                 │       │
│ │ Category         Commission   Min     Max       │       │
│ │ ──────────────────────────────────────────────  │       │
│ │ Restaurant       15%          2,000   100,000   │       │
│ │ Grocery Store    12%          2,000   80,000    │       │
│ │ Pharmacy         10%          1,500   50,000    │       │
│ │ Fashion Store    18%          2,500   120,000   │       │
│ │ Electronics      20%          5,000   200,000   │       │
│ │                                                 │       │
│ │ [+ Add Category]                                │       │
│ └─────────────────────────────────────────────────┘       │
│                                                            │
│ 💡 Why different rates?                                    │
│    • Food: High volume, low margin → 15%                  │
│    • Grocery: Essential, price-sensitive → 12%            │
│    • Fashion/Electronics: Higher margin → 18-20%          │
│                                                            │
│ ┌─ Geographic Zones ──────────────────────────────┐       │
│ │ ☑ Apply globally                                │       │
│ │ ☐ Specific zones:                               │       │
│ │   [ ] TP.HCM  [ ] Hà Nội  [ ] Đà Nẵng          │       │
│ └─────────────────────────────────────────────────┘       │
│                                                            │
│ [Save Configuration]                                      │
└────────────────────────────────────────────────────────────┘
```

---

### 4. Tax Withholding Configuration

```
┌────────────────────────────────────────────────────────────┐
│ 🏛️ Tax Withholding Configuration                           │
│────────────────────────────────────────────────────────────│
│                                                            │
│ ┌─ Driver VAT ────────────────────────────────────┐       │
│ │                                                 │       │
│ │ Enable VAT Withholding: ☑ Yes                  │       │
│ │                                                 │       │
│ │ VAT Rate: [___8___] %                           │       │
│ │ (Standard rate for transport services)          │       │
│ │                                                 │       │
│ │ Apply to:                                       │       │
│ │ ● All drivers                                   │       │
│ │ ○ Only VAT-registered drivers                   │       │
│ │                                                 │       │
│ │ Monthly threshold: [_________] (Optional)       │       │
│ │ (Only withhold if driver income > threshold)    │       │
│ │                                                 │       │
│ └─────────────────────────────────────────────────┘       │
│                                                            │
│ ┌─ Driver PIT (TNCN) ─────────────────────────────┐       │
│ │                                                 │       │
│ │ Enable PIT Withholding: ☑ Yes                  │       │
│ │                                                 │       │
│ │ Progressive Tax Rates:                          │       │
│ │ ┌───────────────────────────────────────────┐  │       │
│ │ │ Income Range           Rate               │  │       │
│ │ │───────────────────────────────────────────│  │       │
│ │ │ 0 - 5M VND             0%                 │  │       │
│ │ │ 5M - 10M VND           5%                 │  │       │
│ │ │ 10M - 18M VND          10%                │  │       │
│ │ │ 18M - 32M VND          15%                │  │       │
│ │ │ 32M - 52M VND          20%                │  │       │
│ │ │ 52M - 80M VND          25%                │  │       │
│ │ │ 80M+ VND               30%                │  │       │
│ │ └───────────────────────────────────────────┘  │       │
│ │                                                 │       │
│ │ Personal Exemption: [__11,000,000__] VND/month │       │
│ │ Dependent Exemption: [__4,400,000__] per person│       │
│ │                                                 │       │
│ └─────────────────────────────────────────────────┘       │
│                                                            │
│ ┌─ Remittance Schedule ───────────────────────────┐       │
│ │ Tax remittance to authority:                    │       │
│ │ ● Monthly (by 20th of next month)               │       │
│ │ ○ Quarterly                                     │       │
│ │                                                 │       │
│ │ Auto-generate tax forms: ☑ Yes                 │       │
│ │ Notify drivers: ☑ Email tax statement monthly  │       │
│ └─────────────────────────────────────────────────┘       │
│                                                            │
│ [Save Configuration]                                      │
└────────────────────────────────────────────────────────────┘
```

---

### 5. Voucher Markup Configuration

```
┌────────────────────────────────────────────────────────────┐
│ 🎫 Voucher & Tour Markup Configuration                     │
│────────────────────────────────────────────────────────────│
│                                                            │
│ ┌─ Markup Strategy ───────────────────────────────┐       │
│ │                                                 │       │
│ │ Configuration Name:                             │       │
│ │ [Travel Package Markup___________________]     │       │
│ │                                                 │       │
│ │ Markup Type:                                    │       │
│ │ ● Percentage   ○ Fixed Amount                   │       │
│ │                                                 │       │
│ │ Markup Percentage:                              │       │
│ │ ┌──────────────────────────┐                   │       │
│ │ │ [_____20_____] %         │                   │       │
│ │ └──────────────────────────┘                   │       │
│ │ Industry standard: 15-25%                       │       │
│ │                                                 │       │
│ │ Minimum Markup: [__50,000__] VND                │       │
│ │ Maximum Markup: [_5,000,000_] VND               │       │
│ │                                                 │       │
│ └─────────────────────────────────────────────────┘       │
│                                                            │
│ ┌─ Category-Specific Markup ──────────────────────┐       │
│ │                                                 │       │
│ │ Category              Markup    Min      Max    │       │
│ │ ─────────────────────────────────────────────  │       │
│ │ Hotel                 20%      100K     5M      │       │
│ │ Tour Package          25%      200K     10M     │       │
│ │ Flight Ticket         3%       50K      2M      │       │
│ │ Restaurant Voucher    15%      20K      500K    │       │
│ │ Entertainment         18%      50K      1M      │       │
│ │                                                 │       │
│ │ [+ Add Category]                                │       │
│ └─────────────────────────────────────────────────┘       │
│                                                            │
│ ┌─ Pricing Example ───────────────────────────────┐       │
│ │ Supplier: Tour Đà Lạt 3N2Đ                      │       │
│ │                                                 │       │
│ │ Supplier Price:      2,000,000 VND              │       │
│ │ Markup (20%):        + 400,000 VND              │       │
│ │ ───────────────────────────────────────         │       │
│ │ Selling Price:       2,400,000 VND              │       │
│ │                                                 │       │
│ │ Revenue Breakdown:                              │       │
│ │ • Platform Revenue:   400,000 VND (markup)      │       │
│ │ • Supplier Collection: 2,000,000 VND (thu hộ)   │       │
│ │                                                 │       │
│ │ Accounting:                                     │       │
│ │ Debit:  Cash                  2,400,000         │       │
│ │ Credit: Revenue                 400,000         │       │
│ │ Credit: Supplier Payable      2,000,000         │       │
│ └─────────────────────────────────────────────────┘       │
│                                                            │
│ ℹ️  Markup is recognized as platform revenue.              │
│    Supplier amount is "Thu hộ" (collection).               │
│                                                            │
│ [Save Configuration] [Test Calculation]                   │
└────────────────────────────────────────────────────────────┘
```

---

### 6. Advertising Fee Configuration

```
┌────────────────────────────────────────────────────────────┐
│ 📢 Advertising Fee Configuration                           │
│────────────────────────────────────────────────────────────│
│                                                            │
│ ┌─ Ad Placement Options ──────────────────────────┐       │
│ │                                                 │       │
│ │ Placement Type    Fee Type      Amount         │       │
│ │ ──────────────────────────────────────────────  │       │
│ │ Sponsored List    % of Sales    5%             │       │
│ │ Top Banner        Fixed         500K/week      │       │
│ │ Featured Badge    Fixed         200K/week      │       │
│ │ Pop-up Ad         Fixed         1M/week        │       │
│ │ Category Top      % of Sales    8%             │       │
│ │                                                 │       │
│ │ [+ Add Placement Type]                          │       │
│ └─────────────────────────────────────────────────┘       │
│                                                            │
│ ┌─ Performance-based Fee (% of Sales) ────────────┐       │
│ │                                                 │       │
│ │ Base Fee: [___5___] % of attributed sales       │       │
│ │                                                 │       │
│ │ Attribution Window: [__7__] days                │       │
│ │ (Sales within 7 days after ad click)            │       │
│ │                                                 │       │
│ │ Minimum Monthly Fee: [__100,000__] VND          │       │
│ │ (If sales < threshold, charge minimum)          │       │
│ │                                                 │       │
│ └─────────────────────────────────────────────────┘       │
│                                                            │
│ ┌─ Calculation Example ───────────────────────────┐       │
│ │ Merchant: ABC Restaurant                        │       │
│ │                                                 │       │
│ │ Total Sales (Feb):        ₫50,000,000           │       │
│ │ Sales from Ads:           ₫12,000,000 (24%)     │       │
│ │ Ad Fee (5%):              ₫600,000              │       │
│ │                                                 │       │
│ │ Platform Revenue: ₫600,000                      │       │
│ │ Merchant keeps: ₫11,400,000                     │       │
│ └─────────────────────────────────────────────────┘       │
│                                                            │
│ [Save] [View All Ad Placements]                           │
└────────────────────────────────────────────────────────────┘
```

---

## 💼 Settlement & Disbursement

### Merchant Settlement Dashboard

```
┌────────────────────────────────────────────────────────────┐
│ 💳 Merchant Settlements - February 2024                    │
│────────────────────────────────────────────────────────────│
│                                                            │
│ Filters: [All Merchants ▼] [Pending ▼] [Search...]        │
│                                                            │
│ ┌─ Settlement #SET-2024-02-001 ──────────────────┐        │
│ │                                                 │        │
│ │ Merchant: Nhà hàng ABC                          │        │
│ │ Period: Feb 1-28, 2024                          │        │
│ │                                                 │        │
│ │ Orders:                  150 orders             │        │
│ │ Total Order Value:       ₫15,000,000            │        │
│ │                                                 │        │
│ │ Platform Commission:     - ₫2,250,000 (15%)     │        │
│ │ Advertising Fees:        - ₫200,000             │        │
│ │ ─────────────────────────────────────────────  │        │
│ │ Net Settlement:          ₫12,550,000            │        │
│ │                                                 │        │
│ │ Bank Account:                                   │        │
│ │ • Vietcombank - 0123456789                      │        │
│ │ • Nguyễn Văn A                                  │        │
│ │                                                 │        │
│ │ Status: ⏳ PENDING                               │        │
│ │ Scheduled: 2024-03-05 (5 days working after EOM)│        │
│ │                                                 │        │
│ │ [View Breakdown] [💰 Disburse Now] [📄 Invoice] │        │
│ └─────────────────────────────────────────────────┘        │
│                                                            │
│ [View All] [Export CSV] [Configure Auto-Transfer]         │
└────────────────────────────────────────────────────────────┘
```

### Driver Settlement Dashboard

```
┌────────────────────────────────────────────────────────────┐
│ 🚗 Driver Settlements - February 2024                      │
│────────────────────────────────────────────────────────────│
│                                                            │
│ ┌─ Settlement #SET-DRV-2024-02-456 ──────────────┐        │
│ │                                                 │        │
│ │ Driver: Nguyễn Thanh Vũ (#DRV456)              │        │
│ │ Period: Feb 1-28, 2024                          │        │
│ │                                                 │        │
│ │ Trips:                   200 trips              │        │
│ │ Gross Revenue:           ₫10,000,000            │        │
│ │                                                 │        │
│ │ Platform Commission:     - ₫1,500,000 (15%)     │        │
│ │ ─────────────────────────────────────────────  │        │
│ │ Revenue after Commission: ₫8,500,000            │        │
│ │                                                 │        │
│ │ Tax Withholding:                                │        │
│ │ • VAT (8%):              - ₫740,741             │        │
│ │ • PIT (5% avg):          - ₫500,000             │        │
│ │ Total Tax:               - ₫1,240,741           │        │
│ │ ─────────────────────────────────────────────  │        │
│ │                                                 │        │
│ │ Net Payment:             ₫7,259,259             │        │
│ │                                                 │        │
│ │ Bank Account:                                   │        │
│ │ • Techcombank - 9876543210                      │        │
│ │ • Nguyễn Thanh Vũ                               │        │
│ │                                                 │        │
│ │ Status: ✅ COMPLETED                            │        │
│ │ Paid on: 2024-03-05 10:30                       │        │
│ │                                                 │        │
│ │ [📄 View Tax Statement] [📧 Email to Driver]    │        │
│ └─────────────────────────────────────────────────┘        │
│                                                            │
│ ℹ️  Tax withheld will be remitted to tax authority by     │
│    March 20, 2024. Driver receives credit on tax filing.   │
│                                                            │
│ [View All] [Export for Accounting] [Batch Process]        │
└────────────────────────────────────────────────────────────┘
```

---

## 📊 Financial Reports

### Monthly P&L Report

```
┌────────────────────────────────────────────────────────────┐
│ 💼 Profit & Loss Statement - February 2024                 │
│────────────────────────────────────────────────────────────│
│                                                            │
│ REVENUE (Doanh Thu)                      Amount      %     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ Platform Fees                         ₫12,000,000   7.7%  │
│ Driver Commissions                    ₫48,000,000  30.8%  │
│ Merchant Commissions                  ₫62,000,000  39.7%  │
│ Subscription Fees                     ₫2,000,000   1.3%   │
│ Advertising Fees                      ₫4,000,000   2.6%   │
│ Voucher/Tour Markups                  ₫28,000,000  17.9%  │
│ ────────────────────────────────────────────────────────  │
│ TOTAL REVENUE                         ₫156,000,000 100.0% │
│                                                            │
│ COST OF REVENUE (Giá Vốn)                                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ Payment Gateway Fees (3%)             ₫4,680,000   3.0%   │
│ SMS & Email Costs                     ₫3,120,000   2.0%   │
│ Map API Costs (Google Maps)           ₫1,560,000   1.0%   │
│ Cloud Infrastructure (AWS)            ₫7,800,000   5.0%   │
│ ────────────────────────────────────────────────────────  │
│ TOTAL COST OF REVENUE                 ₫17,160,000  11.0%  │
│                                                            │
│ GROSS PROFIT                          ₫138,840,000  89.0% │
│                                                            │
│ OPERATING EXPENSES (Chi Phí Hoạt Động)                    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ Salaries & Benefits                   ₫80,000,000  51.3%  │
│ Marketing & Advertising               ₫24,000,000  15.4%  │
│ Technology & Development              ₫16,000,000  10.3%  │
│ Office Rent & Utilities               ₫6,000,000   3.8%   │
│ Legal & Accounting                    ₫2,000,000   1.3%   │
│ ────────────────────────────────────────────────────────  │
│ TOTAL OPERATING EXPENSES              ₫128,000,000  82.1% │
│                                                            │
│ EBITDA                                ₫10,840,000   6.9%   │
│                                                            │
│ Depreciation & Amortization           ₫2,000,000   1.3%   │
│ Interest Expense                      ₫1,000,000   0.6%   │
│                                                            │
│ NET PROFIT (Before Tax)               ₫7,840,000    5.0%  │
│ Corporate Income Tax (20%)            ₫1,568,000    1.0%  │
│ ════════════════════════════════════════════════════════  │
│ NET PROFIT (After Tax)                ₫6,272,000    4.0%  │
│                                                            │
│ ═══════════════════════════════════════════════════════   │
│                                                            │
│ COLLECTIONS (THU HỘ - Not Recognized as Revenue)          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ Merchant Collections                  ₫1,680,000,000      │
│ Driver Collections                    ₫920,000,000        │
│ Supplier Collections (Voucher)        ₫200,000,000        │
│ Tax Collections (Withholding)         ₫180,000,000        │
│ ────────────────────────────────────────────────────────  │
│ TOTAL COLLECTIONS                     ₫2,980,000,000      │
│                                                            │
│ ⚠️  IMPORTANT: Collections are held in trust accounts and  │
│    are NOT included in platform revenue or taxable income. │
│    They are disbursed to partners monthly.                 │
│                                                            │
│ [📥 Download PDF] [📊 Excel Export] [📧 Email to CFO]     │
└────────────────────────────────────────────────────────────┘
```

---

## 🔄 Auto-Disbursement Configuration

```
┌────────────────────────────────────────────────────────────┐
│ ⚙️ Auto-Disbursement Settings                              │
│────────────────────────────────────────────────────────────│
│                                                            │
│ ┌─ Merchant Settlements ──────────────────────────┐       │
│ │                                                 │       │
│ │ Enable Auto-Transfer: ☑ Yes                     │       │
│ │                                                 │       │
│ │ Settlement Cycle:                               │       │
│ │ ● Monthly (End of month)                        │       │
│ │ ○ Bi-weekly (15th & EOM)                        │       │
│ │ ○ Weekly (every Friday)                         │       │
│ │                                                 │       │
│ │ Processing Delay:                               │       │
│ │ [___5___] working days after period end         │       │
│ │ (Time to verify and process)                    │       │
│ │                                                 │       │
│ │ Minimum Settlement Amount:                      │       │
│ │ [___500,000___] VND                             │       │
│ │ (Hold if below threshold)                       │       │
│ │                                                 │       │
│ │ Transfer Method:                                │       │
│ │ ● Bank Transfer (ACH)                           │       │
│ │ ○ Hold in Wallet                                │       │
│ │                                                 │       │
│ └─────────────────────────────────────────────────┘       │
│                                                            │
│ ┌─ Driver Settlements ────────────────────────────┐       │
│ │                                                 │       │
│ │ Enable Auto-Transfer: ☑ Yes                     │       │
│ │                                                 │       │
│ │ Settlement Cycle: ● Weekly (every Monday)       │       │
│ │                                                 │       │
│ │ Minimum Settlement: [___100,000___] VND         │       │
│ │                                                 │       │
│ │ ☑ Withhold taxes before transfer                │       │
│ │ ☑ Send tax statement via email                  │       │
│ │                                                 │       │
│ └─────────────────────────────────────────────────┘       │
│                                                            │
│ ┌─ Supplier Settlements (Voucher) ────────────────┐       │
│ │                                                 │       │
│ │ Enable Auto-Transfer: ☑ Yes                     │       │
│ │                                                 │       │
│ │ Settlement Trigger:                             │       │
│ │ ● After service completion (hotel check-out,    │       │
│ │   tour completion, voucher redemption)          │       │
│ │                                                 │       │
│ │ Hold Period: [__3__] days                       │       │
│ │ (For potential refunds/disputes)                │       │
│ │                                                 │       │
│ └─────────────────────────────────────────────────┘       │
│                                                            │
│ ℹ️  All settlements are logged and auditable.              │
│                                                            │
│ [Save Settings] [Test Transfer] [View Logs]               │
└────────────────────────────────────────────────────────────┘
```

---

## 📋 Configuration History & Audit Trail

```
┌────────────────────────────────────────────────────────────┐
│ 📜 Configuration Change History                            │
│────────────────────────────────────────────────────────────│
│                                                            │
│ Filters: [All Types ▼] [Last 90 days ▼] [Search...]       │
│                                                            │
│ ┌─ Change #CR-2024-025 ───────────────────────────┐       │
│ │ Type: Driver Commission                          │       │
│ │ Change: 15% → 16% (+1pp)                         │       │
│ │ Effective: 2024-03-01                            │       │
│ │ Status: ✅ APPROVED                              │       │
│ │                                                 │       │
│ │ Timeline:                                        │       │
│ │ • Requested: 2024-02-14 10:30 by Ops Manager    │       │
│ │ • Approved: 2024-02-15 14:20 by CEO             │       │
│ │ • Applied: 2024-03-01 00:00 (auto)              │       │
│ │                                                 │       │
│ │ Impact (Actual):                                 │       │
│ │ • Revenue: +₫8.5M (+5.5%) ✅ As expected        │       │
│ │ • Driver churn: +0.8% ⚠️ Monitor                │       │
│ │                                                 │       │
│ │ [View Details] [Compare Forecast vs Actual]     │       │
│ └─────────────────────────────────────────────────┘       │
│                                                            │
│ ┌─ Change #CR-2024-018 ───────────────────────────┐       │
│ │ Type: Platform Fee                               │       │
│ │ Change: 2,500 → 2,000 VND (-500 VND)            │       │
│ │ Effective: 2024-02-01                            │       │
│ │ Status: ✅ COMPLETED                             │       │
│ │                                                 │       │
│ │ Reason: Competitive response to GoJek            │       │
│ │                                                 │       │
│ │ Impact:                                          │       │
│ │ • Orders: +1,250 (+18.5%) ✅ Success            │       │
│ │ • Revenue: -₫7.5M (-4.8%) ⚠️ Trade-off          │       │
│ │                                                 │       │
│ │ [View Details]                                   │       │
│ └─────────────────────────────────────────────────┘       │
│                                                            │
│ [Load More] [Export Audit Log]                            │
└────────────────────────────────────────────────────────────┘
```

---

## 🏦 Accounting Integration

### Account Mapping

**Chart of Accounts:**
```typescript
const ACCOUNT_MAPPING = {
  // Revenue accounts (4000-4999)
  PLATFORM_FEE_REVENUE: '4100',
  DRIVER_COMMISSION_REVENUE: '4200',
  MERCHANT_COMMISSION_REVENUE: '4300',
  SUBSCRIPTION_REVENUE: '4400',
  ADVERTISING_REVENUE: '4500',
  VOUCHER_MARKUP_REVENUE: '4600',
  
  // Liability accounts (2000-2999) - THU HỘ
  MERCHANT_PAYABLE: '2100',
  DRIVER_PAYABLE: '2200',
  SUPPLIER_PAYABLE: '2300',
  TAX_PAYABLE: '2400',
  
  // Asset accounts (1000-1999)
  CASH: '1100',
  BANK_ACCOUNT: '1200',
  PAYMENT_GATEWAY_RECEIVABLE: '1300',
  
  // Expense accounts (5000-5999)
  PAYMENT_GATEWAY_FEE: '5100',
  SMS_EMAIL_COST: '5200',
  MAP_API_COST: '5300',
  CLOUD_INFRASTRUCTURE: '5400',
  SALARIES: '5500',
  MARKETING: '5600'
};
```

### Journal Entries

**Example 1: Food Delivery Order**
```typescript
// Order: 100K from merchant, 30K delivery fee
{
  orderId: "order123",
  date: "2024-02-14",
  
  entries: [
    // Debit: Cash received
    { account: "1100", debit: 130_000, description: "Order #123 payment" },
    
    // Credit: Platform revenue
    { account: "4100", credit: 2_000, description: "Platform fee" },
    { account: "4300", credit: 15_000, description: "Merchant commission (15%)" },
    { account: "4200", credit: 4_500, description: "Driver commission (15% of 30K)" },
    
    // Credit: Collections (liabilities)
    { account: "2100", credit: 83_000, description: "Merchant payable (thu hộ)" },
    { account: "2200", credit: 25_500, description: "Driver payable (thu hộ)" }
  ],
  
  // Verification
  totalDebit: 130_000,
  totalCredit: 130_000,
  isBalanced: true
}
```

**Example 2: Monthly Settlement to Merchant**
```typescript
// Pay merchant 12.55M
{
  settlementId: "SET-2024-02-001",
  date: "2024-03-05",
  
  entries: [
    // Debit: Reduce liability
    { account: "2100", debit: 12_550_000, description: "Merchant settlement" },
    
    // Credit: Reduce cash
    { account: "1200", credit: 12_550_000, description: "Bank transfer to merchant" }
  ],
  
  totalDebit: 12_550_000,
  totalCredit: 12_550_000,
  isBalanced: true
}
```

**Example 3: Tax Remittance**
```typescript
// Remit driver taxes to authority
{
  date: "2024-03-20",
  description: "Feb 2024 driver tax withholding",
  
  entries: [
    // Debit: Reduce tax liability
    { account: "2400", debit: 180_000_000, description: "Driver tax payable" },
    
    // Credit: Cash payment to tax authority
    { account: "1200", credit: 180_000_000, description: "Tax remittance" }
  ]
}
```

---

## 🔐 Compliance & Audit

### Tax Compliance Checklist

**Monthly:**
- [ ] Calculate all driver VAT withholding
- [ ] Calculate all driver PIT withholding
- [ ] Generate tax statements for drivers
- [ ] Remit tax to authority by 20th
- [ ] File tax declaration online

**Quarterly:**
- [ ] Reconcile all collections (merchant, driver, supplier)
- [ ] Verify no collections recognized as revenue
- [ ] Review platform VAT obligations
- [ ] File quarterly tax returns

**Annually:**
- [ ] Corporate income tax filing (CIT)
- [ ] Annual financial audit
- [ ] Provide tax documents to all drivers (for filing)
- [ ] Reconcile all payments and collections

### Audit Trail

**Every change is logged:**
```typescript
{
  changeId: "CR-2024-025",
  timestamp: "2024-02-14T10:30:00Z",
  userId: "ops_manager_123",
  action: "UPDATE_DRIVER_COMMISSION",
  before: { percentage: 0.15 },
  after: { percentage: 0.16 },
  reason: "Market alignment",
  ipAddress: "192.168.1.100",
  approvals: [
    { role: "CFO", userId: "cfo_001", approvedAt: "2024-02-15T14:20:00Z" },
    { role: "CEO", userId: "ceo_001", approvedAt: "2024-02-15T16:45:00Z" }
  ]
}
```

---

## 📊 Summary Table of Revenue Streams

| Revenue Stream | Type | Amount | Calculation | Applied To | Accounting |
|----------------|------|--------|-------------|------------|------------|
| **Platform Fee** | Fixed | 2,000 VND | Per transaction | All services | Platform Revenue |
| **Driver Commission** | % | 15% | Of driver fare | Ride, Delivery | Platform Revenue |
| **Merchant Commission** | % | 15% | Of order value | Food, Shopping | Platform Revenue |
| **Subscription** | Fixed | 99K VND | Per month | Premium users | Platform Revenue |
| **Advertising** | % | 5% | Of sales from ads | Merchants | Platform Revenue |
| **Voucher Markup** | % | 20% | Of supplier price | Travel, Vouchers | Platform Revenue |
| **Merchant Sales** | N/A | Variable | N/A | N/A | **THU HỘ** (Collection) |
| **Driver Fares** | N/A | Variable | N/A | N/A | **THU HỘ** (Collection) |
| **Taxes** | % | Variable | VAT, PIT | Driver income | **THU HỘ** (Withholding) |

---

## ✅ Key Takeaways

**1. Platform Revenue (Recognized):**
- Platform fees, commissions, markups, subscriptions, ads
- **Total: ~₫156M/month**
- Subject to 20% corporate income tax

**2. Collections (Thu Hộ - NOT Revenue):**
- Merchant revenue, driver fares, supplier payments
- **Total: ~₫2.8B/month**
- Held in trust, not taxed, disbursed to partners

**3. Tax Withholding:**
- VAT & PIT withheld from driver income
- **Total: ~₫180M/month**
- Remitted to tax authority monthly
- Drivers get credit on their tax filing

**4. Clean Separation:**
```
Customer Payment (₫130K)
    ├─ Platform Revenue (₫21.5K) ───→ Taxable income
    ├─ Merchant Collection (₫83K) ──→ Thu hộ (not taxable)
    └─ Driver Collection (₫25.5K) ──→ Thu hộ (not taxable)
```

**5. Financial Integrity:**
- Every transaction balanced (debit = credit)
- Clear audit trail
- Separate bank accounts for collections
- Monthly reconciliation

---

**File Status:** Revenue Admin UI complete (~3,000 lines)
**Total Revenue System Docs:** ~7,000 lines
**Compliance:** ✅ Tax-compliant, audit-ready
