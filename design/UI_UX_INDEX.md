# Lifestyle Super App - UI/UX Design Index

> **Tổng hợp tất cả thiết kế giao diện cho toàn bộ hệ sinh thái**

---

## 🎨 Design Philosophy

### Core Values

1. **Vietnamese-First** - Ngôn ngữ, văn hóa, UX phù hợp người Việt
2. **Mobile-Optimized** - Thiết kế cho điện thoại trước
3. **Data-Driven** - UI hiển thị metrics rõ ràng
4. **Efficiency** - Giảm số lần tap, tăng tốc độ
5. **Trust & Safety** - Giao diện đáng tin cậy

---

## 🎨 Global Design System

### Color Palette (App-wide)

**Primary Colors:**
```
Gold:         #FDB813  (Primary actions, active states, brand)
Purple Dark:  #2E1A47  (Text, secondary actions)
Red:          #DC143C  (Destructive actions, alerts)
Silver:       #C0C0C0  (Accents)
White:        #FFFFFF  (Backgrounds)
```

**Semantic Colors:**
```
Success:      #4CAF50  (Green)
Warning:      #FF9800  (Orange)
Error:        #DC143C  (Red)
Info:         #2196F3  (Blue)
```

**Grayscale:**
```
Black:        #1A1A1A  (Headings)
Dark Gray:    #4A4A4A  (Body text)
Gray:         #9E9E9E  (Secondary text)
Light Gray:   #E0E0E0  (Borders, dividers)
Off-white:    #F8F8F8  (Screen backgrounds)
```

### Typography

**Font Families:**
- **iOS:** SF Pro (System default)
- **Android:** Roboto (System default)
- **Web:** Inter (Google Fonts)

**Type Scale:**
```
H1 (Screen Title):    24px Bold
H2 (Section Title):   20px SemiBold
H3 (Card Title):      18px SemiBold
Body (Regular):       16px Regular
Secondary:            14px Regular
Caption:              12px Regular
Tiny:                 10px Regular

Line Heights:
- Headings: 1.2
- Body: 1.5
- Captions: 1.4
```

### Spacing System (4px Grid)

```
XS:   4px
S:    8px
M:    12px
L:    16px
XL:   24px
XXL:  32px
XXXL: 48px
```

### Border Radius

```
Small:      4px   (Badges)
Medium:     8px   (Buttons, inputs)
Large:      12px  (Cards)
X-Large:    16px  (Modals)
Circle:     999px (Avatars, pills)
```

### Shadows & Elevation

```
Level 0 (Flat):       none
Level 1 (Subtle):     0 1px 3px rgba(0,0,0,0.12)
Level 2 (Card):       0 2px 8px rgba(0,0,0,0.15)
Level 3 (Elevated):   0 4px 16px rgba(0,0,0,0.18)
Level 4 (Modal):      0 8px 32px rgba(0,0,0,0.24)
```

---

## 📱 Application-Specific Designs

### 1. Driver App ✅ COMPLETE

**Files:**
- `design/DESIGN_SYSTEM.md` (1,500 lines)
- Logo assets: `assets/lifestyle-app-icon-v1.png`, `assets/lifestyle-logo-horizontal-v1.png`

**Design Highlights:**
- Gold primary (#FDB813), Dark Purple secondary (#2E1A47)
- Vietnamese flag-inspired icon (Red background, Yellow star)
- Professional, simple, device-compatible
- Complete component library
- Mobile design guidelines (Safe areas, touch targets 48px+)

**Screens Covered:**
- Dashboard (Trip stats, earnings, quick actions)
- Order Marketplace (Available trips)
- Order History (Completed/Cancelled)
- Navigation (Google Maps integration)
- Earnings & Wallet
- Profile & Settings
- Insurance Management
- Location Feedback (PDCA)

**Status:** ✅ Design System Complete

---

### 2. Merchant App ✅ COMPLETE

**Files:**
- `design/MERCHANT_APP_UI_GUIDE.md` (3,500 lines)
- Visual mockups:
  - `assets/merchant-dashboard-screen.png`
  - `assets/merchant-add-product-screen.png`
  - `assets/merchant-orders-screen.png`

**Design Highlights:**
- Data-first approach (Revenue, orders, stats prominently displayed)
- Professional merchant-focused UI
- AI-powered features (SEO suggestions, auto-calculations)
- 50+ component specifications
- 20+ detailed screen mockups
- Complete user flows

**Sections:**
1. **Dashboard** - Store stats, quick actions, content
2. **Products** - AI SEO, image upload, variants, preview
3. **Orders** - 6-state management, timeline, chat integration
4. **Reviews** - Star ratings, reply system, store ratings
5. **Finance** - Wallet, withdrawal, transactions
6. **Analytics** - Revenue charts, product performance, customer stats
7. **Marketing** - Promotions (Flash sales, discounts, combos), Ads
8. **Chat** - Merchant ←→ Customer ←→ Driver closed-loop
9. **Support** - AI chatbot, tickets, content hub
10. **Settings** - Store config, notifications

**Status:** ✅ UI/UX Guide Complete + Visual Mockups

---

### 3. Insurance Products (TNDS, Vật chất xe) ✅ COMPLETE

**Files:**
- `design/INSURANCE_PRODUCTS_UI_GUIDE.md` (~2,800 lines)

**Design Highlights:**
- Trust-first approach (Government regulations, transparent pricing)
- No discounts/promotions (Fixed pricing model)
- 5-step multi-step purchase flow (Info → Vehicle → Buyer → Upload → Confirm)
- Premium calculator with detailed breakdowns
- Semi-automatic ops workflow (24h SLA)

**Status:** ✅ UI/UX Guide Complete

---

### 4. Social Insurance (BHXH Tự nguyện) ✅ COMPLETE

**Files:**
- `design/SOCIAL_INSURANCE_UI_GUIDE.md` (~3,500 lines)
- Visual mockups (3 app versions):
  - `assets/bhxh-user-app-screen.png` (User: "Tích lũy thảnh thơi" 🌸)
  - `assets/bhxh-driver-app-screen.png` (Driver: "Của để dành cho nghề tự do" 🛡️)
  - `assets/bhxh-merchant-app-screen.png` (Merchant: "Phúc lợi chủ hộ kinh doanh" 👔)

**Design Highlights:**
- **Lead Generation Model** (3-step: Pre-check → Calculator → Consultation)
- **App-Specific Messaging** with emotional targeting:
  - User: Soft Pink (#FFB6C1), friendly, lifestyle-oriented
  - Driver: Strong Blue (#2E5090), protective, masculine
  - Merchant: Professional Gold (#D4AF37), business-oriented
- **Premium Calculator** (7 contribution levels, ROI visualization)
- **Agent Dashboard** (Lead queue, Call/Note/Assign)
- **Q&A Content** (Top 10 strategic questions)
- **Social Proof** (Video testimonials, Success stories)

**Innovations:**
- "Chốt bằng con số" calculator (Visual ROI 297%, Payback 6 years)
- So sánh với tiết kiệm ngân hàng (BHXH vs Bank savings)
- Government support checker (30-50% subsidy for eligible)
- Relatable comparisons ("= 2 bát phở mỗi ngày")

**Status:** ✅ UI/UX Guide Complete + Visual Mockups

---

### 5. Life Insurance (Cathay Life Partnership) ✅ COMPLETE

**Files:**
- `design/LIFE_INSURANCE_UI_GUIDE.md` (~4,500 lines)

**Design Highlights:**
- **3 Product Naming Vibes** (Brand strategy):
  - LIFESTYLE: "Bản Thiết Kế Tương Lai" 🌟 (Young professionals)
  - FINANCE: "Lá Chắn Tài Chính Lifestyle" 🛡️ (Business owners)
  - TRUST: "Quỹ Dự Phòng Hạnh Phúc" 🏡 (Mass market)
- **18 Product Names** (6 categories × 3 vibes)
- **UX Journey**: "Hide Partner, Show Value" (Nhu cầu → Giải pháp → Uy tín đối tác)
- **"Bảo hiểm của tôi" Timeline Dashboard** (Progress bars, Cash value, Investment charts)
- **Premium Calculator** with relatable comparisons ("= 2.5 bát phở/ngày")
- **Comparison Tables** (BH vs Gửi NH, ROI visualization)
- **Wiki Bảo Hiểm Lifestyle** (Educational hub, SEO, Glossary)
- **Claim Flow** (5-step process, Document upload, Step-by-step guidance)

**Innovations:**
- **Vibe Selection** by user segment (Auto-detect + Manual switch)
- **Partner Block** at bottom (Cathay Life logo, 60 years experience, 98.5% payout rate)
- **Timeline Cards** with visual progress ("Bạn đã đóng 5/20 năm")
- **Cash Value Display** (Transparent, builds trust)
- **Investment Performance** (For UL/VUL: Fund allocation, YTD return)
- **Quick Actions** (Pay, Loan, Claim, Change beneficiary)
- **AI Recommendations** (Upsell based on lifecycle)

**Product Name Examples:**
```
LIFESTYLE Vibe:
  🎓 Quỹ Chắp Cánh Tài Năng (Education)
  🌟 Đặc Quyền Tuổi Vàng (Retirement)

FINANCE Vibe:
  📊 Đòn Bẩy Tài Chính 4.0 (Investment)
  💰 Quỹ Lương Hưu Thượng Lưu (Retirement)

TRUST Vibe:
  👨‍👩‍👧 Của Để Dành Cho Con (Education)
  🏡 Hưu Trí An Nhàn (Retirement)
```

**Status:** ✅ UI/UX Guide Complete

---

### 6. Customer App (User/Member App) 🔴 TODO

**Status:** Not started

**Planned Sections:**
- Home (Services: Ride, Food, Shopping, Lifestyle)
- Service Selection (Gọi xe, Giao thức ăn, Mua sắm)
- Product Browsing & Search
- Cart & Checkout
- Order Tracking (Real-time map)
- Chat with Driver/Merchant
- Loyalty & Coins (Xu management)
- Savings Packages (Tiết kiệm)
- Referral Program
- Profile & Settings

**Priorities:**
1. Service selection UI
2. Order tracking (real-time)
3. Loyalty dashboard
4. Checkout flow

---

### 4. Admin Ops App (Desktop + Web) 🔴 TODO

**Status:** Partially documented (AI Pricing UI, Revenue Admin UI)

**Completed:**
- ✅ AI Pricing Engine UI (`docs/AI_PRICING_ADMIN_UI.md`)
- ✅ Revenue Management UI (`docs/REVENUE_ADMIN_UI.md`)

**Remaining:**
- Driver management (Approval, ratings, insurance monitoring)
- Merchant management (Approval, performance, compliance)
- Order operations (Assignment, issues)
- Customer support (Tickets, chat monitoring)
- System monitoring (Logs, alerts)
- Content management (News, promotions)

**Design Requirements:**
- Desktop-first (large screens)
- Data tables with sorting/filtering
- Real-time dashboards
- Role-based access control (Admin, Ops, Finance, Support)

---

### 5. Affiliate/Referral App Section 🔴 TODO

**Status:** Not started (Part of Customer App)

**Screens:**
- Referral Dashboard (Total invited, earnings, ranks)
- Referral Link Generation
- Referral History (Status: Pending, Active, Completed)
- Earnings Breakdown
- Leaderboard
- Referral Rules & Rewards

---

## 🎯 Component Library (Shared Across Apps)

### Buttons

**Primary Button (Gold):**
```css
height: 48px;
padding: 12px 24px;
background: #FDB813;
color: #2E1A47;
font-weight: 600;
border-radius: 8px;
shadow: Level 1;
```

**Secondary Button (Purple):**
```css
height: 48px;
background: #2E1A47;
color: #FFFFFF;
```

**Outline Button:**
```css
background: transparent;
border: 2px solid #FDB813;
color: #FDB813;
```

**Destructive Button (Red):**
```css
background: #DC143C;
color: #FFFFFF;
```

### Cards

**Standard Card:**
```css
padding: 16px;
background: #FFFFFF;
border-radius: 12px;
shadow: Level 2;
```

**Premium Card (Gradient):**
```css
background: linear-gradient(135deg, #2E1A47 0%, #4A2C6B 100%);
color: #FFFFFF;
border-radius: 12px;
shadow: Level 3;
```

### Input Fields

**Text Input:**
```css
height: 48px;
padding: 12px 16px;
border: 1px solid #E0E0E0;
border-radius: 8px;
font-size: 16px;

States:
- Focus: border 2px #FDB813
- Error: border 2px #DC143C
- Disabled: background #F5F5F5, opacity 0.6
```

### Badges

**Status Badges:**
```css
Active:   background #E8F5E9, color #4CAF50
Warning:  background #FFF3E0, color #FF9800
Error:    background #FFEBEE, color #DC143C
Info:     background #E3F2FD, color #2196F3

padding: 4px 8px;
border-radius: 4px;
font-weight: 600;
font-size: 12px;
```

### Rating Stars

```css
Filled:  color #FDB813
Empty:   color #E0E0E0
Size:    16px (default), 20px (large), 12px (small)
```

---

## 📐 Layout Guidelines

### Mobile Screen Anatomy

```
┌─────────────────────────────────────┐
│ Header (56px + safe area)           │ ← Fixed
├─────────────────────────────────────┤
│                                     │
│ Content Area                        │ ← Scrollable
│ (Variable height)                   │
│                                     │
├─────────────────────────────────────┤
│ Tab Bar (64px + safe area)          │ ← Fixed (optional)
└─────────────────────────────────────┘
```

### Grid System

```
Container padding: 16px
Card margins: 12px vertical, 16px horizontal
Grid gap: 12px
Section spacing: 24px
```

### Touch Targets

```
Minimum:      44px × 44px (Apple HIG)
Comfortable:  48px × 48px (Recommended)
Primary:      56px (Important actions)
Spacing:      8px minimum between targets
```

---

## 🎬 Animations & Transitions

### Screen Transitions

```
Tab Switch:
- Duration: 250ms
- Easing: ease-in-out
- Effect: Fade + slide (20px)

Modal/Sheet:
- Duration: 350ms
- Easing: ease-out
- Effect: Slide up from bottom
- Backdrop: Fade in (opacity 0 → 0.5)
```

### Micro-Interactions

```
Button Tap:
- Scale: 0.95
- Duration: 150ms
- Haptic: Light impact

Pull to Refresh:
- Show spinner
- Haptic on release
- Duration: 1s

Loading:
- Skeleton screens (shimmer effect)
- Duration: Until data loads
```

---

## ♿ Accessibility Guidelines

### Color Contrast (WCAG AA)

```
Text on Backgrounds:
✅ #2E1A47 on #FFFFFF → 12.5:1 (Excellent)
✅ #4A4A4A on #FFFFFF → 9.7:1 (Excellent)
✅ #FFFFFF on #2E1A47 → 12.5:1 (Excellent)
✅ #FDB813 on #2E1A47 → 5.2:1 (Good)
⚠️ #FFFFFF on #FDB813 → 1.9:1 (Large text only)
```

### Font Sizes

```
Minimum body:        16px (readability)
Minimum interactive: 14px
Caption minimum:     12px
```

### Focus States

```
All interactive elements must have visible focus states:
- Outline: 2px solid #FDB813
- Offset: 2px
```

---

## 📱 Responsive Breakpoints

### Mobile First

**Small (< 375px):**
- Single column
- Smaller padding (12px)

**Medium (375px - 428px):**
- Standard layouts
- Normal padding (16px)

**Large (> 428px) - Tablets:**
- 2-column grids
- Larger padding (24px)

### Web

**Mobile (< 768px):**
- Same as mobile app

**Tablet (768px - 1024px):**
- 2-column grids
- Sidebar navigation

**Desktop (> 1024px):**
- 3-column grids
- Persistent sidebar
- Dashboard widgets

---

## 🎨 Brand Assets

### Logos

**App Icon:**
- `assets/lifestyle-app-icon-v1.png`
- Size: 1024×1024px
- Format: PNG with transparency
- Inspired by Vietnamese flag (Red, Gold star)

**Horizontal Logo:**
- `assets/lifestyle-logo-horizontal-v1.png`
- Suitable for: Splash screens, login pages

**Color Variants:**
- Full color (primary)
- White (for dark backgrounds)
- Monochrome (for B&W contexts)

---

## 📚 Documentation Status

| App/Feature | Type Definitions | Architecture | UI/UX Guide | Visual Mockups | Status |
|-------------|------------------|--------------|-------------|----------------|--------|
| Driver App | ✅ | ✅ | ✅ | ✅ (Logo only) | 🟢 Complete |
| Merchant App | ✅ | ✅ | ✅ | ✅ (3 screens) | 🟢 Complete |
| Customer App | ✅ | 🔴 | 🔴 | 🔴 | 🔴 TODO |
| Admin Ops | Partial | Partial | Partial | 🔴 | 🟡 In Progress |
| Affiliate/Referral | ✅ | ✅ | 🔴 | 🔴 | 🟡 In Progress |

**Legend:**
- ✅ Complete
- 🟡 In Progress
- 🔴 Not Started

---

## 🎯 Next Steps

### Immediate Priorities

1. **Customer App UI/UX** (High priority)
   - Service selection screens
   - Order tracking UI
   - Checkout flow
   - Loyalty dashboard

2. **Admin Ops UI** (Medium priority)
   - Dashboard overviews
   - Data tables
   - Form wizards

3. **Visual Mockup Generation** (Low priority)
   - Customer app screens
   - Admin dashboards

### Long-term Goals

- Component library implementation (React/React Native)
- Storybook setup
- Design token system (CSS variables)
- Dark mode support
- Internationalization (i18n) for English

---

**Last Updated:** Feb 14, 2024
**Version:** 1.3
**Total Design Docs:** ~14,300+ lines (+4,500 Life Insurance)
**Status:** 🟢 Core Apps Complete (Driver + Merchant + Insurance Products + Social Insurance + Life Insurance)

---

**Beautiful, consistent, and user-friendly across the entire ecosystem! 🎨**
