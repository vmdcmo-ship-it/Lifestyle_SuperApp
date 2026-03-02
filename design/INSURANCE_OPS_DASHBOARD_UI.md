# Insurance Ops Dashboard UI/UX Guide
## "Bộ Não Vận Hành Bảo Hiểm" - AI-Powered Analytics Platform

> **For 3 Insurance Categories: BHTNDS, BHXH (BHPNT), Cathay Life (BHNT)**

---

## 🎯 Dashboard Philosophy

### Design Principles

**1. Data-First**
- Most important metrics at the top (Above the fold)
- Clear hierarchical importance (KPIs → Charts → Tables)
- Color-coded performance indicators

**2. Actionable Insights**
- Every metric should suggest an action
- AI recommendations prominently displayed
- Quick-action buttons on all critical metrics

**3. Multi-Level Drill-Down**
- Summary → Category → Product → Customer
- Click on any metric to see details
- Breadcrumb navigation

**4. Real-Time Updates**
- Auto-refresh every 30 seconds (configurable)
- Live indicators for active users, ongoing consultations
- Notification bell for alerts

**5. Role-Based Views**
- **CEO/Management**: High-level overview, revenue focus
- **Ops Manager**: Detailed analytics, agent performance
- **Marketing**: Content performance, conversion optimization
- **Agent Manager**: Team performance, customer care metrics

---

## 📱 Dashboard Architecture

### Navigation Structure

```
Admin Ops App (Desktop/Web)
├─ 📊 Dashboard (Home)
├─ 🛡️ Bảo Hiểm
│   ├─ 🚗 BHTNDS (Vehicle)
│   │   ├─ Tổng quan
│   │   ├─ Sản phẩm
│   │   ├─ Khách hàng
│   │   └─ Báo cáo
│   ├─ 🏥 BHXH (Social Insurance)
│   │   ├─ Tổng quan
│   │   ├─ Lead Management
│   │   ├─ Agent Performance
│   │   └─ Báo cáo
│   └─ 🌟 BHNT (Life Insurance)
│       ├─ Tổng quan
│       ├─ Sản phẩm (By Vibe)
│       ├─ Conversion Funnel
│       ├─ A/B Testing
│       └─ Báo cáo
├─ 🤖 AI Insights
│   ├─ Recommendations
│   ├─ Customer Segments
│   ├─ Sales Scenarios
│   └─ Predictions
├─ 👥 Agents
│   ├─ Performance
│   ├─ Leaderboard
│   └─ Customer Care
├─ 📈 Analytics
│   ├─ Conversion Funnels
│   ├─ Customer Journeys
│   ├─ Content Performance
│   └─ Cohort Analysis
├─ 📝 Reports
│   ├─ Business Performance
│   ├─ Revenue Analysis
│   └─ Custom Reports
└─ ⚙️ Settings
    ├─ Alert Rules
    ├─ A/B Tests
    └─ Integrations
```

---

## 🎨 Screen Designs

### Screen 1: Dashboard Home - Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════════════════════════════════════════╗   │
│ ║  🏠 Dashboard                    📅 Feb 14, 2026     [Today▾] [Refresh]  ║   │
│ ╚═══════════════════════════════════════════════════════════════════════════╝   │
│                                                                                 │
│ ━━━━━ KPIs - Overall (Today) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                                 │
│ ┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐   │
│ │ 👁️ VIEWS     │ 📊 APPS      │ ✅ ISSUED    │ 💰 REVENUE   │ 🎯 CVR       │   │
│ │              │              │              │              │              │   │
│ │   12,345     │     856      │     124      │   ₫850M      │   10.05%     │   │
│ │   📈 +15%    │   📈 +22%    │   📈 +18%    │   📈 +25%    │   📈 +2.1pp  │   │
│ │              │              │              │              │              │   │
│ │ vs yesterday │ vs yesterday │ vs yesterday │ vs yesterday │ vs yesterday │   │
│ └──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘   │
│                                                                                 │
│ ━━━━━ By Category (Today) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                                 │
│ ┌────────────────────────┬────────────────────────┬────────────────────────┐   │
│ │ 🚗 BHTNDS              │ 🏥 BHXH                │ 🌟 BHNT                │   │
│ │ (Vehicle Insurance)    │ (Social Insurance)     │ (Life Insurance)       │   │
│ ├────────────────────────┼────────────────────────┼────────────────────────┤   │
│ │ Views:      4,521      │ Views:      3,892      │ Views:      3,932      │   │
│ │ Apps:        312       │ Leads:       428       │ Apps:        116       │   │
│ │ Issued:       89       │ Consults:    257       │ Issued:       35       │   │
│ │ CVR:       6.90%       │ Lead CVR:  60.0%       │ CVR:       8.90%       │   │
│ │                        │ Consult CVR: 50.0%     │                        │   │
│ │ Revenue:  ₫245M        │ Revenue:   ₫302M       │ Revenue:   ₫303M       │   │
│ │ 📈 +12%                │ 📈 +28%                │ 📈 +35%                │   │
│ │                        │                        │                        │   │
│ │ [View Details >]       │ [View Details >]       │ [View Details >]       │   │
│ └────────────────────────┴────────────────────────┴────────────────────────┘   │
│                                                                                 │
│ ━━━━━ Conversion Funnel (Last 7 Days) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                                 │
│ ┌───────────────────────────────────────────────────────────────────────────┐   │
│ │                                                                           │   │
│ │  Views          Apps Starts      Apps Complete    Submitted      Issued  │   │
│ │  50,000    →    10,500 (21%)  →  7,350 (70%)   →  6,615 (90%) →  5,948  │   │
│ │  ████████████   ██████           ████            ███            ███      │   │
│ │                                                                           │   │
│ │  Biggest drop: Apps Starts → Apps Complete (-30% drop-off)               │   │
│ │  💡 Action: Simplify application form, add auto-save                     │   │
│ │                                                                           │   │
│ │  [View Details] [Analyze Drop-offs]                                      │   │
│ └───────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│ ━━━━━ Top Performing Products (Last 7 Days) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                                 │
│ ┌───┬──────────────────────────────────┬──────┬─────┬────────┬───────────┐   │
│ │ # │ Product Name                     │ Cat  │Issue│ CVR    │ Revenue   │   │
│ ├───┼──────────────────────────────────┼──────┼─────┼────────┼───────────┤   │
│ │ 1 │ 🎓 Quỹ Chắp Cánh Tài Năng        │ BHNT │ 145 │ 11.2%  │ ₫1.2B     │   │
│ │ 2 │ 🛡️ Quỹ An Sinh Lifestyle         │ BHXH │ 428 │ 60.0%  │ ₫850M     │   │
│ │ 3 │ 🚗 TNDS + Vật chất xe (Combo)    │ TNDS │ 312 │ 6.5%   │ ₫720M     │   │
│ │ 4 │ 📊 Đòn Bẩy Tài Chính 4.0         │ BHNT │  89 │ 9.8%   │ ₫680M     │   │
│ │ 5 │ 🏡 Hưu Trí An Nhàn                │ BHNT │  52 │ 7.2%   │ ₫420M     │   │
│ └───┴──────────────────────────────────┴──────┴─────┴────────┴───────────┘   │
│                                                                                 │
│ [View All Products]                                                             │
│                                                                                 │
│ ━━━━━ Agent Performance (Last 7 Days) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                                 │
│ ┌───┬──────────────┬───────┬──────┬────────┬────────┬──────────┐             │
│ │ # │ Agent        │ Leads │ Conv │ CVR    │ CSAT   │ Revenue  │             │
│ ├───┼──────────────┼───────┼──────┼────────┼────────┼──────────┤             │
│ │ 1 │ 🏆 Mai Anh   │  52   │  28  │ 53.8%  │ 4.8/5  │ ₫145M    │             │
│ │ 2 │ 🥈 Tuấn Minh │  48   │  24  │ 50.0%  │ 4.7/5  │ ₫132M    │             │
│ │ 3 │ 🥉 Lan Hương │  45   │  21  │ 46.7%  │ 4.6/5  │ ₫118M    │             │
│ │ 4 │   Đức Anh    │  42   │  18  │ 42.9%  │ 4.5/5  │ ₫98M     │             │
│ │ 5 │   Thu Thảo   │  38   │  15  │ 39.5%  │ 4.3/5  │ ₫85M     │             │
│ └───┴──────────────┴───────┴──────┴────────┴────────┴──────────┘             │
│                                                                                 │
│ Avg CVR: 45.2% | Avg CSAT: 4.6/5                        [View All Agents]      │
│                                                                                 │
│ ━━━━━ AI Insights & Recommendations ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                                 │
│ ┌───────────────────────────────────────────────────────────────────────────┐   │
│ │ 🤖 AI detected 3 high-priority opportunities:                             │   │
│ │                                                                           │   │
│ │ 1. 🎯 428 calculator users from BHXH haven't applied yet                 │   │
│ │    → Recommendation: Send personalized follow-up email with "Bạn đã     │   │
│ │       tính toán quyền lợi nhận ₫X triệu. Đăng ký tư vấn ngay!"          │   │
│ │    [Create Campaign]                                                     │   │
│ │                                                                           │   │
│ │ 2. 📉 Life Insurance (LIFESTYLE vibe) CVR dropped 15% (8.2% → 6.9%)     │   │
│ │    → Possible cause: New hero banner not resonating                     │   │
│ │    → Recommendation: Revert to previous banner or A/B test               │   │
│ │    [View Details] [Create A/B Test]                                     │   │
│ │                                                                           │   │
│ │ 3. 💰 52 customers with policies expiring in 30 days (TNDS)             │   │
│ │    → Recommendation: Send renewal reminder with 10% discount             │   │
│ │    [Create Campaign] [Assign to Agents]                                 │   │
│ └───────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│ ━━━━━ Recent Activity (Live) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                                 │
│ 🟢 User #12345 viewing "Quỹ Chắp Cánh Tài Năng" (2 min ago)                    │
│ 🟡 User #67890 started BHXH application (5 min ago)                             │
│ 🟢 Agent Mai Anh closed deal: TNDS policy ₫2.5M (8 min ago)                    │
│ 🔴 User #45678 abandoned BHNT application at step 3 (12 min ago)               │
│ 🟢 35 users currently viewing insurance products                                │
│                                                                                 │
│ [View All Activity]                                                             │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

### Screen 2: Category Deep-Dive - BHNT (Life Insurance)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════════════════════════════════════════╗   │
│ ║  Dashboard > 🌟 BHNT (Life Insurance)                  📅 Last 30 Days   ║   │
│ ╚═══════════════════════════════════════════════════════════════════════════╝   │
│                                                                                 │
│ ━━━━━ KPIs ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                                 │
│ ┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐   │
│ │ 👁️ VIEWS     │ 🧮 CALC USES │ 📊 APPS      │ ✅ ISSUED    │ 💰 COMMISSION│   │
│ │              │              │              │              │              │   │
│ │   125,432    │    8,542     │   1,245      │     777      │   ₫14.9B     │   │
│ │   📈 +35%    │   📈 +42%    │   📈 +38%    │   📈 +40%    │   📈 +45%    │   │
│ └──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘   │
│                                                                                 │
│ ━━━━━ Performance by Vibe ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                                 │
│ ┌────────────────────────┬────────────────────────┬────────────────────────┐   │
│ │ 🌸 LIFESTYLE           │ 🛡️ FINANCE             │ 🏡 TRUST               │   │
│ │ "Bản Thiết Kế TL"      │ "Lá Chắn Tài Chính"    │ "Quỹ Dự Phòng HPhúc"   │   │
│ ├────────────────────────┼────────────────────────┼────────────────────────┤   │
│ │ Views:     52,145      │ Views:     41,238      │ Views:     32,049      │   │
│ │ Apps:        562       │ Apps:        428       │ Apps:        255       │   │
│ │ Issued:      325       │ Issued:      278       │ Issued:      174       │   │
│ │ CVR:      10.20%       │ CVR:       9.80%       │ CVR:       8.50%       │   │
│ │                        │                        │                        │   │
│ │ Avg Premium: ₫2.1M/mo  │ Avg Premium: ₫2.4M/mo  │ Avg Premium: ₫1.8M/mo  │   │
│ │ Commission:  ₫5.2B     │ Commission:  ₫5.9B     │ Commission:  ₫3.8B     │   │
│ │                        │                        │                        │   │
│ │ 📈 Best vibe for:      │ 📈 Best vibe for:      │ 📈 Best vibe for:      │   │
│ │ • Young Parents        │ • Business Owners      │ • Mass Market          │   │
│ │ • User App             │ • Driver/Merchant App  │ • All Ages             │   │
│ │                        │                        │                        │   │
│ │ [View Products]        │ [View Products]        │ [View Products]        │   │
│ └────────────────────────┴────────────────────────┴────────────────────────┘   │
│                                                                                 │
│ 💡 AI Insight: LIFESTYLE vibe has highest CVR for User app (11.5% vs 9.2% avg) │
│    Recommendation: Promote LIFESTYLE vibe more aggressively on User app         │
│                                                                                 │
│ ━━━━━ Top Products (Last 30 Days) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                                 │
│ ┌───┬──────────────────────────────────┬──────┬──────┬────────┬───────────┐   │
│ │ # │ Product Name                     │ Vibe │Issued│ CVR    │ Commission│   │
│ ├───┼──────────────────────────────────┼──────┼──────┼────────┼───────────┤   │
│ │ 1 │ 🎓 Quỹ Chắp Cánh Tài Năng        │ LS   │ 245  │ 11.2%  │ ₫4.7B     │   │
│ │ 2 │ 📊 Đòn Bẩy Tài Chính 4.0         │ FN   │ 168  │ 10.5%  │ ₫3.2B     │   │
│ │ 3 │ 👨‍👩‍👧 Của Để Dành Cho Con         │ TR   │ 152  │  9.8%  │ ₫2.9B     │   │
│ │ 4 │ 🌟 Đặc Quyền Tuổi Vàng           │ LS   │  98  │  8.5%  │ ₫1.9B     │   │
│ │ 5 │ 🏡 Hưu Trí An Nhàn                │ TR   │  84  │  7.2%  │ ₫1.6B     │   │
│ └───┴──────────────────────────────────┴──────┴──────┴────────┴───────────┘   │
│                                                                                 │
│ [View All 18 Products]                                                          │
│                                                                                 │
│ ━━━━━ Conversion Funnel (Last 30 Days) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                                 │
│ ┌───────────────────────────────────────────────────────────────────────────┐   │
│ │                                                                           │   │
│ │ Landing → Product → Calculator → Application → Underwriting → Issued     │   │
│ │ 125,432   85,142    8,542       1,245          996            777        │   │
│ │ 100%  →   67.9%  →  10.0%    →  14.6%      →  80.0%       →  78.0%      │   │
│ │                                                                           │   │
│ │ ████████████████████████████                                             │   │
│ │                                                                           │   │
│ │ 📊 Funnel Analysis:                                                       │   │
│ │ • Biggest drop: Landing → Product View (32.1% drop-off)                  │   │
│ │   → Action: Improve hero banner, add testimonials                        │   │
│ │                                                                           │   │
│ │ • Second biggest: Product → Calculator (90% drop-off)                    │   │
│ │   → Action: Make calculator more prominent, add "Quick estimate" button  │   │
│ │                                                                           │   │
│ │ • Good: Underwriting approval rate 80% (vs 70% industry)                 │   │
│ │                                                                           │   │
│ │ [Export Data] [View Details] [Set Alert]                                 │   │
│ └───────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│ ━━━━━ Customer Journey Analysis ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                                 │
│ ┌───────────────────────────────────────────────────────────────────────────┐   │
│ │ 📍 Average Customer Journey (From first view to issued policy):           │   │
│ │                                                                           │   │
│ │ Total touchpoints: 12.5 (median: 9)                                       │   │
│ │ Time to convert: 18.2 days (median: 14 days)                              │   │
│ │                                                                           │   │
│ │ Common path:                                                              │   │
│ │ 1. View landing page (Day 1)                                              │   │
│ │ 2. View 2-3 products (Day 1-2)                                            │   │
│ │ 3. Read Wiki articles (Day 2-5)                                           │   │
│ │ 4. Use calculator 2-3 times (Day 5-8)                                     │   │
│ │ 5. Chat with agent (Day 8-10)                                             │   │
│ │ 6. Start application (Day 10-12)                                          │   │
│ │ 7. Complete application (Day 12-14)                                       │   │
│ │ 8. Underwriting (Day 14-18)                                               │   │
│ │ 9. Policy issued (Day 18)                                                 │   │
│ │                                                                           │   │
│ │ 💡 Insight: Customers who read Wiki articles have 2.3x higher CVR         │   │
│ │    → Action: Promote Wiki content more (in-app banners, emails)           │   │
│ │                                                                           │   │
│ │ [View Full Journey Map] [Export]                                          │   │
│ └───────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│ ━━━━━ Content Performance ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                                 │
│ ┌───┬─────────────────────────────────────┬──────┬─────┬────────┬──────────┐   │
│ │ # │ Content Title                       │ Type │Views│ Conv   │ Impact   │   │
│ ├───┼─────────────────────────────────────┼──────┼─────┼────────┼──────────┤   │
│ │ 1 │ Nên mua BH đầu tư hay gửi NH?       │ Wiki │8,542│ 12.5%  │ ₫1.8B    │   │
│ │ 2 │ Premium Calculator (All products)   │ Tool │8,542│ 14.6%  │ ₫2.1B    │   │
│ │ 3 │ Video: Chị Mai chia sẻ             │ Video│3,245│  8.2%  │ ₫890M    │   │
│ │ 4 │ Bảo hiểm nhân thọ là gì?           │ Wiki │6,125│  6.5%  │ ₫720M    │   │
│ │ 5 │ Tính phí bảo hiểm                   │ Wiki │4,892│  5.8%  │ ₫650M    │   │
│ └───┴─────────────────────────────────────┴──────┴─────┴────────┴──────────┘   │
│                                                                                 │
│ [View All Content]                                                              │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

### Screen 3: A/B Testing Interface

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════════════════════════════════════════╗   │
│ ║  Dashboard > BHNT > A/B Testing                     [+ New Test]         ║   │
│ ╚═══════════════════════════════════════════════════════════════════════════╝   │
│                                                                                 │
│ ━━━━━ Active Tests (2) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                                 │
│ ┌───────────────────────────────────────────────────────────────────────────┐   │
│ │ Test #1: LIFESTYLE vs FINANCE Vibe (Education Product)                   │   │
│ │ Status: 🟢 Running (Day 12/30)                                            │   │
│ │                                                                           │   │
│ │ Hypothesis: "LIFESTYLE vibe will convert better for young parents"       │   │
│ │                                                                           │   │
│ │ Variants:                                                                 │   │
│ │ ┌────────────────────┬────────────────────┬────────────────────────┐     │   │
│ │ │ CONTROL (50%)      │ VARIANT A (50%)    │ Winner?                │     │
│ │ │ LIFESTYLE Vibe     │ FINANCE Vibe       │                        │     │
│ │ ├────────────────────┼────────────────────┼────────────────────────┤     │   │
│ │ │ Impressions: 2,542 │ Impressions: 2,498 │                        │     │
│ │ │ Clicks:       318  │ Clicks:       285  │                        │     │
│ │ │ CTR:        12.5%  │ CTR:        11.4%  │ Control +9.6%          │     │
│ │ │                    │                    │                        │     │
│ │ │ Applications: 42   │ Applications: 35   │                        │     │
│ │ │ Issued:       28   │ Issued:       22   │                        │     │
│ │ │ CVR:        11.0%  │ CVR:         8.8%  │ Control +25% 🏆        │     │
│ │ │                    │                    │                        │     │
│ │ │ Revenue:   ₫538M   │ Revenue:   ₫422M   │ Control +27.5%         │     │
│ │ │                    │                    │                        │     │
│ │ │ Confidence: 95.2% ✅ (Significant)                               │     │
│ │ │                                                                  │     │
│ │ │ 💡 Recommendation: LIFESTYLE vibe wins! Apply to all User app    │     │
│ │ │                                                                  │     │
│ │ │ [View Details] [End Test] [Apply Winner]                         │     │
│ │ └──────────────────────────────────────────────────────────────────┘     │   │
│ └───────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│ ┌───────────────────────────────────────────────────────────────────────────┐   │
│ │ Test #2: CTA Button Text ("Tính ngay" vs "Đăng ký tư vấn")              │   │
│ │ Status: 🟡 Running (Day 5/14)                                             │   │
│ │                                                                           │   │
│ │ Hypothesis: "Direct action CTA ('Tính ngay') converts better"            │   │
│ │                                                                           │   │
│ │ Variants:                                                                 │   │
│ │ ┌────────────────────┬────────────────────┬────────────────────────┐     │   │
│ │ │ CONTROL (50%)      │ VARIANT A (50%)    │ Winner?                │     │
│ │ │ "Tính ngay"        │ "Đăng ký tư vấn"   │                        │     │
│ │ ├────────────────────┼────────────────────┼────────────────────────┤     │   │
│ │ │ Clicks:      892   │ Clicks:      845   │                        │     │
│ │ │ Actions:     128   │ Actions:     142   │ Variant +10.9%         │     │
│ │ │ CVR:       14.3%   │ CVR:       16.8%   │ Variant +17.5%         │     │
│ │ │                    │                    │                        │     │
│ │ │ Confidence: 78.2% ⚠️ (Not yet significant, continue test)        │     │
│ │ │                                                                  │     │
│ │ │ [View Details] [Extend Test]                                     │     │
│ │ └──────────────────────────────────────────────────────────────────┘     │   │
│ └───────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│ ━━━━━ Completed Tests (3) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                                 │
│ ┌───┬──────────────────────────────────┬────────┬─────────┬────────────────┐   │
│ │ # │ Test Name                        │ Winner │Conf Level│ Lift           │   │
│ ├───┼──────────────────────────────────┼────────┼─────────┼────────────────┤   │
│ │ 1 │ Hero Banner (Image vs Video)     │ Video  │ 97.5%   │ +22% CVR       │   │
│ │ 2 │ Calculator Placement (Top vs Mid)│ Top    │ 99.2%   │ +35% Usage     │   │
│ │ 3 │ Testimonial Type (Text vs Video) │ Video  │ 96.8%   │ +18% Trust     │   │
│ └───┴──────────────────────────────────┴────────┴─────────┴────────────────┘   │
│                                                                                 │
│ [View All Tests]                                                                │
│                                                                                 │
│ ━━━━━ Create New Test ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                                 │
│ [+ New A/B Test]                                                                │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

### Screen 4: Agent Performance Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════════════════════════════════════════╗   │
│ ║  Dashboard > Agents > Performance                   📅 Last 30 Days      ║   │
│ ╚═══════════════════════════════════════════════════════════════════════════╝   │
│                                                                                 │
│ ━━━━━ Team Overview ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                                 │
│ ┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐   │
│ │ 👥 AGENTS    │ 📞 CONSULTS  │ ✅ CONVERSIONS│ 💰 REVENUE   │ 😊 CSAT      │   │
│ │              │              │              │              │              │   │
│ │      15      │    1,245     │     689      │   ₫8.5B      │   4.6/5.0    │   │
│ │   All active │   Avg: 83/ea │   Avg: 46/ea │   Avg: ₫567M │   Excellent  │   │
│ └──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘   │
│                                                                                 │
│ ━━━━━ Leaderboard (Last 30 Days) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                                 │
│ ┌───┬────────┬──────────────┬───────┬──────┬────────┬────────┬──────────┬─────┐│
│ │ # │ Medal  │ Agent        │ Leads │ Conv │ CVR    │ CSAT   │ Revenue  │Trend││
│ ├───┼────────┼──────────────┼───────┼──────┼────────┼────────┼──────────┼─────┤│
│ │ 1 │ 🏆     │ Mai Anh      │  142  │  78  │ 54.9%  │ 4.8/5  │ ₫945M    │ 📈  ││
│ │   │        │              │       │      │ 🟢 +2% │ 🟢     │ 🟢 +12%  │     ││
│ │   │        │ [View]       │       │      │        │        │          │     ││
│ ├───┼────────┼──────────────┼───────┼──────┼────────┼────────┼──────────┼─────┤│
│ │ 2 │ 🥈     │ Tuấn Minh    │  128  │  65  │ 50.8%  │ 4.7/5  │ ₫812M    │ 📊  ││
│ │   │        │              │       │      │ 🟢 +1% │ 🟢     │ 🟢 +8%   │     ││
│ │   │        │ [View]       │       │      │        │        │          │     ││
│ ├───┼────────┼──────────────┼───────┼──────┼────────┼────────┼──────────┼─────┤│
│ │ 3 │ 🥉     │ Lan Hương    │  118  │  58  │ 49.2%  │ 4.7/5  │ ₫745M    │ 📊  ││
│ │   │        │              │       │      │ 🟡 -0.5│ 🟢     │ 🟢 +5%   │     ││
│ │   │        │ [View]       │       │      │        │        │          │     ││
│ ├───┼────────┼──────────────┼───────┼──────┼────────┼────────┼──────────┼─────┤│
│ │ 4 │        │ Đức Anh      │  105  │  52  │ 49.5%  │ 4.6/5  │ ₫695M    │ 📊  ││
│ │ 5 │        │ Thu Thảo     │   98  │  45  │ 45.9%  │ 4.5/5  │ ₫598M    │ 📉  ││
│ │ 6 │        │ Minh Khôi    │   95  │  42  │ 44.2%  │ 4.5/5  │ ₫562M    │ 📊  ││
│ │ 7 │        │ Hồng Nhung   │   89  │  39  │ 43.8%  │ 4.4/5  │ ₫528M    │ 📉  ││
│ │ 8 │        │ Văn Tài      │   82  │  35  │ 42.7%  │ 4.3/5  │ ₫485M    │ 📉  ││
│ │...│        │ ...          │  ...  │ ...  │ ...    │ ...    │ ...      │ ... ││
│ └───┴────────┴──────────────┴───────┴──────┴────────┴────────┴──────────┴─────┘│
│                                                                                 │
│ [View All 15 Agents]                                                            │
│                                                                                 │
│ ━━━━━ Performance Distribution ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                                 │
│ Conversion Rate Distribution:                                                   │
│ ┌───────────────────────────────────────────────────────────────────────────┐   │
│ │      ▂▃                                                                    │   │
│ │     ▅███▆                                                                  │   │
│ │   ▃███████▅                                                                │   │
│ │  ▂███████████▄                                                             │   │
│ │ ▁█████████████▃▂▁                                                          │   │
│ │ ─────────────────────────────                                             │   │
│ │ 30% 35% 40% 45% 50% 55% 60%                                                │   │
│ │                                                                           │   │
│ │ Avg: 47.2% | Median: 48.5% | Top 20%: >52%                                │   │
│ └───────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│ ━━━━━ Performance by Category ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                                 │
│ ┌────────────────────────┬────────────────────────┬────────────────────────┐   │
│ │ 🚗 BHTNDS              │ 🏥 BHXH                │ 🌟 BHNT                │   │
│ ├────────────────────────┼────────────────────────┼────────────────────────┤   │
│ │ Avg CVR:    48.2%      │ Avg CVR:    52.5%      │ Avg CVR:    43.8%      │   │
│ │ Top Agent: Mai Anh     │ Top Agent: Tuấn Minh   │ Top Agent: Lan Hương   │   │
│ │ Top CVR:    55.8%      │ Top CVR:    62.3%      │ Top CVR:    51.2%      │   │
│ └────────────────────────┴────────────────────────┴────────────────────────┘   │
│                                                                                 │
│ 💡 Insight: BHXH has highest avg CVR (52.5%) → Simplest product to explain     │
│    BHNT has lowest (43.8%) → Consider more training on complex products        │
│                                                                                 │
│ ━━━━━ Response Time Metrics ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                                 │
│ ┌──────────────────────────┬──────────────────────────┬────────────────────┐   │
│ │ First Response Time      │ Avg Response Time        │ Resolution Time    │   │
│ ├──────────────────────────┼──────────────────────────┼────────────────────┤   │
│ │ Avg:  12 min             │ Avg:  8 min              │ Avg:  2.5 days     │   │
│ │ Target: <15 min ✅       │ Target: <10 min ✅       │ Target: <3 days ✅ │   │
│ │                          │                          │                    │   │
│ │ Best: Mai Anh (8 min)    │ Best: Tuấn Minh (5 min)  │ Best: Lan H (1.8d) │   │
│ │ Worst: Văn Tài (25 min)  │ Worst: Hồng N (15 min)   │ Worst: Văn T (4.2d)│   │
│ └──────────────────────────┴──────────────────────────┴────────────────────┘   │
│                                                                                 │
│ ⚠️ Alert: Văn Tài's first response time is 67% slower than target              │
│    → Action: Schedule 1-on-1 with manager, review workload                     │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

(Due to length constraints, I'll create a summary document with the remaining screens documented)

Tôi sẽ tạo summary document với tất cả screen designs và specifications:
