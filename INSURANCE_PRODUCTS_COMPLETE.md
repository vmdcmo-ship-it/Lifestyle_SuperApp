# Insurance Products System - Complete ✅

## 📋 Executive Summary

**Feature:** Hệ thống bán bảo hiểm phi nhân thọ (TNDS & Vật chất xe)
**Purpose:** Cung cấp bảo hiểm xe máy, ô tô cho Driver/Merchant/Customer qua 3 apps
**Complexity:** High (Multi-app, Semi-automatic ops, Payment integration, Document verification)
**Status:** 🟢 Planning & Architecture 100% Complete

---

## ✅ Completed Deliverables

### 1. Type Definitions ✅ (~1,200 lines)
**File:** `packages/types/src/insurance-products.ts`

**50+ Interfaces, 15 Enums:**

**Product Types:**
- `InsuranceProduct` - Sản phẩm bảo hiểm (TNDS, Vật chất, Tai nạn)
- `InsuranceBenefit` - Quyền lợi bảo hiểm
- `BenefitsTable` - Bảng quyền lợi chi tiết

**Vehicle & Buyer:**
- `VehicleInfo` - Thông tin xe (Biển số, Hãng, Dòng, Năm SX, Giấy tờ)
- `BuyerInfo` - Thông tin người mua (CMND, SĐT, Email, Địa chỉ)

**Pricing & Calculator:**
- `InsuranceCalculatorInput` - Input cho calculator
- `InsuranceCalculatorOutput` - Kết quả ước tính
- `TNDS_TARIFF` - Biểu phí TNDS theo Nghị định 67/2023
- `VEHICLE_PHYSICAL_RATE` - Tỷ lệ phí vật chất (1.1% - 1.8%)

**Order Management:**
- `InsuranceOrder` - Đơn hàng bảo hiểm
- `InsuranceOrderStatus` - 9 trạng thái (Draft → Active)
- `InsuranceHistory` - Lịch sử mua BH
- `InsuranceReminder` - Nhắc nhở gia hạn

**API Types:**
- Create order, Calculate premium, Upload payment, Submit to insurance co.
- Get history, Update tariff (admin)

### 2. Complete UI/UX Guide ✅ (~4,500 lines)
**File:** `design/INSURANCE_PRODUCTS_UI_GUIDE.md`

**Design Principles:**
- **Trust First** - No gimmicks, no fake sales tactics
- **Transparency** - Clear pricing, benefits, terms
- **No Discounts** - Bán đúng giá theo quy định chính phủ
- **Educational** - Giáo dục người dùng về quyền lợi BH
- **Simplicity** - Quy trình 5 bước đơn giản

**Components:**
1. **Insurance Product Card** (Compact & Expanded)
   - Icon 80px, Title, Description (300 chars), Price, Buttons
   - Expanded: Banner, Benefits, Benefits Table, Terms, Video

2. **Premium Calculator Widget**
   - Input: Vehicle type, Year, Value, Deductible, Coverages
   - Output: Premium breakdown, Effective date, Recommendations
   - For TNDS: Fixed price by vehicle category
   - For Vật chất: % of vehicle value (1.1%-1.8%)

3. **Multi-Step Purchase Form** (5 steps)
   - Step 1: Chọn loại BH (TNDS, Vật chất, Tai nạn)
   - Step 2: Thông tin người mua (CMND, SĐT, Email, Địa chỉ + Upload giấy tờ)
   - Step 3: Thông tin xe (Biển số, Hãng, Dòng, Năm SX + Upload đăng ký xe)
   - Step 4: Xác nhận & Tùy chọn (Mức khấu trừ, Điều khoản bổ sung)
   - Step 5: Thanh toán (Chuyển khoản + Upload biên lai)

4. **Status Badges**
   - Pending Payment (Orange)
   - Payment Confirmed (Green)
   - Active (Blue)
   - Expired (Gray)

5. **Alert Banner** (Insurance Expiry)
   - Shows 7 days before expiry
   - "⚠️ Bảo hiểm xe 51G-12345 sẽ hết hạn 20/02 (còn 6 ngày) [Gia hạn ngay]"

**App-Specific Implementations:**

**Driver App:**
- Section: 🛡️ Bảo hiểm (In Profile tab)
- Tabs: [Bảo hiểm của tôi] [Mua bảo hiểm] [Hướng dẫn]
- My Insurance list with TNDS + Vật chất cards
- Status: Active (green), Expiring (orange)
- Quick actions: View certificate, Report accident
- Alert banner in Dashboard when expiring soon
- Auto-fill vehicle info if registered for business

**Merchant App:**
- Section: Bảo hiểm xe (In "Thêm" → Tiện ích)
- Focus: Truck/Van insurance for delivery vehicles
- Product list (TNDS required, Vật chất recommended)
- Purchase flow (same 5 steps)

**User/Customer App:**
- Section: Bảo hiểm (In Lifestyle tab)
- Landing page: Hero banner + Product catalog
- Focus: Motorcycle + Car insurance
- Calculator widget prominent
- Educational content: "Tại sao mua bảo hiểm tại Lifestyle?"

### 3. Operations Workflow Documentation ✅ (~3,500 lines)
**File:** `docs/INSURANCE_OPS_WORKFLOW.md`

**Semi-Automatic Process (24h SLA):**

```
Customer → Mua BH trên App (5-10 min)
   ↓
Upload biên lai chuyển khoản
   ↓
Auto: Email/SMS confirmation (< 5 min)
   ↓
⏰ Ops nhận đơn (Queue in Admin Ops)
   ↓
Ops xem xét & verify documents (10-30 min)
   ↓
Ops khai báo lên hệ thống công ty BH (20-40 min)
   ↓
Chờ công ty BH duyệt (1-2 giờ, max 24h)
   ↓
Ops tải chứng nhận về
   ↓
Ops upload lên hệ thống Lifestyle
   ↓
Auto: Email/SMS gửi chứng nhận + PDF (< 5 min)
   ↓
✅ Hoàn tất
   ↓
⏰ 30 ngày sau
   ↓
Công ty BH trả hoa hồng → Lifestyle → Referrer
```

**Key Features:**
- **Admin Ops Dashboard** - Queue management, Order detail view
- **Document Verification Checklist** - CMND/CCCD, Giấy đăng ký xe, Biên lai
- **Data Package Export** - Auto-generate PDF + images for submission
- **Certificate Upload** - Number, Dates, PDF file
- **Auto Email/SMS** - 2 emails (Payment confirmed + Certificate ready) + 2 SMS
- **Commission Tracking** - 10% from insurance co., 50% to referrer
- **Reminder System** - 7 days before expiry
- **Error Handling** - Payment issues, Rejection, Cancellation, Delays

**Metrics & KPIs:**
- Processing Time: < 24h (Target: 4-8h)
- Success Rate: > 98%
- Customer Satisfaction: 4.6/5 target
- Renewal Rate: > 70%

**Training Materials:**
- Video tutorials (5 videos, total 70 min)
- Written guides (Insurance Operations Manual - 50 pages)
- Document verification checklist
- Insurance company portal guides
- FAQ for customer support (10 pages)

**Customer Support Scripts:**
- "Khi nào có chứng nhận?"
- "Tôi mất biên lai chuyển khoản, làm sao?"
- Common questions with pre-written responses

### 4. Pricing Structure (Based on Nghị định 67/2023) ✅

**TNDS Bắt buộc (Fixed Price, including 10% VAT):**

**Xe máy:**
- Dưới 50cc, điện: ₫60,500/năm
- Trên 50cc: ₫66,000/năm
- Mô tô 3 bánh: ₫319,000/năm

**Ô tô không kinh doanh:**
- Dưới 6 chỗ (Vios, Morning): ₫480,700/năm
- 6-11 chỗ (Xpander, Santa Fe): ₫873,400/năm
- 12-24 chỗ: ₫1,397,000/năm
- Bán tải (Pickup): ₫480,700/năm

**Ô tô kinh doanh vận tải:**
- Dưới 6 chỗ: ₫831,600/năm
- 7 chỗ: ₫1,188,000/năm
- 9 chỗ: ₫1,544,400/năm
- 16 chỗ: ₫2,224,200/năm
- Taxi: 170% của phí xe cùng số chỗ

**Xe tải:**
- Dưới 3 tấn: ₫938,300/năm
- 3-8 tấn: ₫1,826,000/năm
- 8-15 tấn: ₫3,020,600/năm
- Trên 15 tấn: ₫3,520,000/năm

**Vật chất xe (Tính theo % giá trị xe):**
- Rate: 1.1% - 1.8% của giá trị xe hiện tại
- Factors:
  - Xe mới (< 3 năm): Rate thấp hơn (-0.2%)
  - Xe cũ (> 5 năm): Rate cao hơn (+0.2%)
  - Mức khấu trừ cao (2M): Rate thấp hơn (-0.1%)
  - Mức khấu trừ thấp (500K): Rate cao hơn (+0.1%)
  - Điều khoản bổ sung: +0.1% - +0.3% each

**Examples:**
- Vios 2020, value 800M, rate 1.5% → ₫12,000,000/năm
- CR-V 2018, value 1B, rate 1.7% → ₫17,000,000/năm

**Tai nạn người ngồi trên xe:**
- Mức đền bù 10 triệu: ₫20,000/người/năm
- Mức đền bù 30 triệu: ₫35,000/người/năm
- Mức đền bù 50 triệu: ₫50,000/người/năm

---

## 🎯 Key Innovations

### 1. No-Discount Pricing Model
- **Giá chuẩn theo quy định** - Build trust, no sales tricks
- **Transparent** - Customer knows exactly what they pay
- **Compliant** - Follow government regulations strictly

### 2. Semi-Automatic Operations
- **24h SLA** - Balance between speed and manual verification
- **Human verification** - Prevent fraud, ensure document quality
- **Auto notifications** - Email/SMS at key milestones
- **Dashboard for Ops** - Efficient queue management

### 3. Multi-App Integration
- **Driver App** - Primary user, focus on TNDS + Vật chất
- **Merchant App** - Delivery vehicle insurance
- **Customer App** - Personal vehicle insurance (motorcycle/car)
- **Consistent UX** - Same flow across all apps

### 4. Premium Calculator
- **Instant estimate** - No need to wait for quote
- **Transparent breakdown** - Show all factors affecting price
- **Educational** - Help users understand what they're paying for

### 5. Commission Model
- **10% from insurance company** - Industry standard
- **50% to referrer** - Incentivize drivers/merchants to sell
- **30-day payment cycle** - After contract is effective
- **Automated tracking** - No manual commission calculation

### 6. Expiry Management
- **Auto-reminder 7 days before** - Prevent lapsed coverage
- **One-tap renewal** - Pre-fill all information
- **Renewal rate target** - > 70%

---

## 📊 Expected Business Impact

### Revenue Model

**Year 1 Projections:**

```
Target Customers:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Drivers:               1,500 drivers
  - TNDS:              1,500 × ₫831,600 = ₫1.25B
  - Vật chất:          750 × ₫15M = ₫11.25B
  
Merchants:             500 merchants
  - TNDS (trucks):     500 × ₫1.2M = ₫600M
  - Vật chất:          250 × ₫20M = ₫5B
  
Customers:             10,000 users
  - Motorcycle TNDS:   5,000 × ₫66K = ₫330M
  - Car TNDS:          3,000 × ₫480K = ₫1.44B
  - Car Vật chất:      1,500 × ₫12M = ₫18B

Total Premium:         ₫37.87B
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Commission (10%):      ₫3.79B
  - To referrers (50%): -₫1.89B
  - Lifestyle keeps:    ₫1.90B
  
Operating Costs:       -₫800M
  - Ops team (5 FTE):   -₫600M
  - Systems & tools:    -₫100M
  - Marketing:          -₫100M
  
Net Profit:            ₫1.10B (29% margin)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Customer Acquisition

```
Drivers (Built-in demand):
- 1,500 drivers need TNDS (bắt buộc)
- 50% buy Vật chất → 750 customers
- CAC: ₫0 (already in ecosystem)

Merchants:
- 500 merchants with delivery vehicles
- 50% buy Vật chất → 250 customers
- CAC: ₫0 (already in ecosystem)

Customers (Need marketing):
- 10,000 users (organic + paid ads)
- CAC: ₫50K/customer
- Total acquisition cost: ₫500M

LTV (5-year avg):
- Motorcycle: ₫66K × 5 = ₫330K
- Car: ₫480K × 5 = ₫2.4M
- Car + Vật chất: ₫12.5M × 5 = ₫62.5M

Avg LTV: ₫1.5M
LTV/CAC: 1.5M / 50K = 30x (Excellent!)
```

### Operational Efficiency

```
Ops Team Capacity:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1 Ops agent can process:
  - 30 orders/day (avg 30 min/order, 8h shift)
  - 600 orders/month
  - 7,200 orders/year

5 Ops agents:
  - 150 orders/day
  - 3,000 orders/month
  - 36,000 orders/year ← Capacity

Target orders Year 1: 12,000 orders
Utilization: 33% (Room for growth)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Automation Benefits:
- Email/SMS: 100% auto
- Document package: 100% auto
- Commission calc: 100% auto
- Reminders: 100% auto

Manual work:
- Document verification: Human required
- Portal submission: Human required (for now)
- Customer support: Human + AI chatbot
```

---

## 🏗️ Implementation Roadmap

### Phase 1: Core Infrastructure (Month 1-2)

**Backend:**
- [ ] Product catalog API (CRUD for insurance products)
- [ ] Tariff management API (Admin can update prices)
- [ ] Premium calculator service
- [ ] Order creation & management APIs
- [ ] Payment proof upload (S3/GCS)
- [ ] Document storage (S3/GCS with CDN)

**Database:**
- [ ] Insurance products table
- [ ] Orders table (with status machine)
- [ ] Tariff history table (for audit trail)
- [ ] Commission tracking table

**Admin Ops:**
- [ ] Order queue dashboard
- [ ] Order detail view
- [ ] Document viewer
- [ ] Certificate upload form
- [ ] Metrics dashboard

### Phase 2: Customer-Facing Apps (Month 2-3)

**Driver App:**
- [ ] Insurance section (My Insurance, Buy, Guidance)
- [ ] Product catalog
- [ ] Premium calculator
- [ ] 5-step purchase form
- [ ] Certificate viewer (PDF)
- [ ] Expiry alerts

**Merchant App:**
- [ ] Insurance section (minimal)
- [ ] Product list (truck focus)
- [ ] Purchase form

**User App:**
- [ ] Insurance landing page
- [ ] Product catalog (motorcycle/car)
- [ ] Calculator widget
- [ ] Purchase form

### Phase 3: Automation & Integration (Month 3-4)

**Email/SMS:**
- [ ] SendGrid/Twilio integration
- [ ] Email templates (2 types)
- [ ] SMS templates (2 types)
- [ ] Delivery tracking

**Reminders:**
- [ ] Scheduler (cron job)
- [ ] 7-day reminder logic
- [ ] Push notification
- [ ] In-app notification

**Commission:**
- [ ] Auto-calculation after 30 days
- [ ] Payment to wallet
- [ ] Notification to referrer

### Phase 4: Operations & Training (Month 4-5)

**Training:**
- [ ] Video tutorials (5 videos)
- [ ] Operations manual (50 pages)
- [ ] Document verification checklist
- [ ] Insurance company portal guides
- [ ] Customer support scripts

**Ops Team:**
- [ ] Hire 5 Ops agents
- [ ] Training & certification
- [ ] Dry run with test orders
- [ ] Go live with limited beta

### Phase 5: Launch & Scale (Month 5-6)

**Soft Launch:**
- [ ] Beta with 100 drivers
- [ ] Monitor SLA (< 24h)
- [ ] Collect feedback
- [ ] Fix bugs

**Full Launch:**
- [ ] Announce to all drivers
- [ ] Marketing campaign for customers
- [ ] Partnership with insurance companies
- [ ] Scale Ops team as needed

---

## 📈 Success Metrics

### Operational KPIs

```
Processing Time:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Target:   < 24 hours
Goal:     4-8 hours (during business hours)
Measure:  Time from payment confirmed to certificate sent

Success Rate:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Target:   > 98%
Measure:  Orders successfully completed / Total orders

Customer Satisfaction:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Target:   4.5/5 stars
Measure:  Post-purchase survey

Renewal Rate:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Target:   > 70%
Measure:  Renewed contracts / Expiring contracts
```

### Business KPIs

```
Revenue Growth:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Q1:  ₫200M
Q2:  ₫400M (+100%)
Q3:  ₫600M (+50%)
Q4:  ₫700M (+17%)
Year 1 Total: ₫1.90B

Active Policies:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Month 1:   500 policies
Month 6:   5,000 policies
Month 12:  12,000 policies

Market Share (in Lifestyle ecosystem):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Drivers:   80% (Target: 1,200 / 1,500)
Merchants: 50% (Target: 250 / 500)
Customers: 20% (Target: 10,000 / 50,000)
```

---

## 🚀 Go-to-Market Strategy

### Launch Sequence

**Week 1-2: Driver Soft Launch**
- Email to all drivers: "🛡️ Mua bảo hiểm TNDS ngay trong app!"
- In-app banner: "TNDS từ ₫480K/năm - Xử lý trong 24h"
- Target: 100 orders

**Week 3-4: Driver Full Launch**
- Push notification to drivers expiring soon
- Referral bonus: "Giới thiệu 1 driver mua BH → Nhận ₫50K Xu"
- Target: 500 orders

**Week 5-6: Merchant Launch**
- Email to merchants with delivery vehicles
- Highlight: "Bảo vệ xe giao hàng - Yên tâm kinh doanh"
- Target: 100 orders

**Month 2: Customer Launch**
- Landing page SEO optimization
- Facebook/Google Ads: "Bảo hiểm xe giá chuẩn - Nhanh chóng"
- Target: 500 orders

### Marketing Channels

**Organic:**
- In-app placement (Dashboard banner, Lifestyle tab)
- Push notifications (Expiry reminders)
- Email marketing (To existing users)
- SEO (Insurance landing page)

**Paid:**
- Facebook Ads (₫50M budget)
  - Target: 25-45 years old, own vehicle
  - Messaging: "Bảo hiểm đúng giá - Xử lý 24h"
- Google Ads (₫30M budget)
  - Keywords: "mua bảo hiểm ô tô", "bảo hiểm xe máy online"
- TikTok (₫20M budget)
  - Short videos: "3 lý do mua BH tại Lifestyle"

**Partnerships:**
- Insurance companies (Co-marketing)
- Car dealerships (Referral program)
- Garages (Display posters)

---

## 📚 Documentation Index

**Core Documentation:**
1. `packages/types/src/insurance-products.ts` (~1,200 lines) - Type definitions
2. `design/INSURANCE_PRODUCTS_UI_GUIDE.md` (~4,500 lines) - UI/UX guide
3. `docs/INSURANCE_OPS_WORKFLOW.md` (~3,500 lines) - Operations workflow
4. `INSURANCE_PRODUCTS_COMPLETE.md` (this file) - Summary

**Total:** ~9,200 lines of comprehensive specifications ✅

---

## ✅ Quality Checklist

### Planning & Architecture ✅
- [x] All product types defined (TNDS, Vật chất, Tai nạn)
- [x] Pricing structure documented (Based on Nghị định 67/2023)
- [x] Calculator logic specified
- [x] Purchase flow designed (5 steps)
- [x] Ops workflow documented (Semi-automatic, 24h SLA)
- [x] Commission model defined (10% → 50% to referrer)
- [x] Reminder system designed (7 days before expiry)

### UI/UX Design ✅
- [x] Components specified (Product card, Calculator, Forms, Badges)
- [x] Driver App screens (My Insurance, Buy, Alerts)
- [x] Merchant App screens (Product list, Buy)
- [x] User App screens (Landing page, Catalog, Calculator)
- [x] Admin Ops screens (Queue, Order detail, Upload)
- [x] Responsive design (Mobile-first)
- [x] Accessibility (WCAG AA compliant)

### Operations ✅
- [x] Verification checklist defined
- [x] Error handling scenarios
- [x] Customer support scripts
- [x] Training materials outlined
- [x] Metrics & KPIs defined
- [x] SLA targets set (< 24h, > 98% success)

### Business Model ✅
- [x] Revenue projections (₫1.90B Year 1)
- [x] CAC/LTV calculated (30x LTV/CAC)
- [x] Market share targets (80% drivers, 50% merchants, 20% customers)
- [x] Go-to-market strategy
- [x] Launch sequence planned

---

## 🎯 Next Steps

### Immediate (Week 1-2)
1. ✅ **Planning complete** (DONE)
2. 🔴 **Backend APIs** (Product, Calculator, Order, Payment)
3. 🔴 **Database schemas** (Products, Orders, Tariff, Commission)
4. 🔴 **Admin Ops dashboard** (Queue, Order detail, Upload)

### Short-term (Month 1-3)
- Backend implementation (APIs, database, integrations)
- Frontend implementation (Driver, Merchant, User apps)
- Admin Ops app (Dashboard, forms, metrics)
- Email/SMS integration
- Testing (Unit, integration, E2E)

### Medium-term (Month 4-6)
- Ops team training
- Soft launch (Beta with 100 drivers)
- Full launch (All drivers + customers)
- Marketing campaign
- Scale operations

---

**Planning Phase: 100% Complete** ✅  
**Ready for:** Full-scale implementation 🚀

**Bảo hiểm đơn giản, minh bạch, uy tín - Build trust, not sales tricks! 🛡️**
