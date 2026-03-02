# Lifestyle Spotlight UI/UX Guide
## Review & Redcomment System - "Trải nghiệm thực – Giá trị thực – Phong cách thực"

> **Complete design specification for User App, Creator Platform, Web, and Admin Ops**

---

## 🎯 Design Philosophy

### Core Principles

**1. Content-First**
- Video/Image is hero (full-screen, immersive)
- Minimal UI chrome (transparent overlays)
- Swipe gestures for navigation

**2. Discovery-Driven**
- Infinite scroll (TikTok-style)
- Smart recommendations
- Serendipity > Search

**3. Creator-Friendly**
- Simple creation flow (< 5 steps)
- Real-time analytics
- Clear earnings visibility

**4. Conversion-Optimized**
- Prominent CTAs
- One-tap actions
- Frictionless checkout

**5. Trust-Building**
- Verified badges
- Detailed creator profiles
- Transparent affiliate disclosure

---

## 📱 Part 1: User App - Mobile Interface

### Navigation Structure

```
User App (iOS/Android)
├─ 🏠 Home Feed
├─ ✨ Spotlight (TikTok Mode) ⭐ NEW
│   ├─ For You (Personalized)
│   ├─ Following (Creators you follow)
│   └─ Categories (Food, Fashion, Travel, etc.)
├─ 🔍 Discover
│   ├─ Search
│   ├─ Trending
│   └─ Top Creators
├─ 💬 Inbox (Interactions)
└─ 👤 Profile
    ├─ My Reviews
    ├─ Saved
    └─ Become a Creator (CTA)
```

---

### Screen 1: Spotlight Feed (TikTok Clone Mode)

```
┌─────────────────────────────────────────┐
│ Status Bar (20dp)                       │
│ Time         Signal    Battery          │
├─────────────────────────────────────────┤
│                                         │
│           [VIDEO BACKGROUND]            │
│              (Full Screen)              │
│                                         │
│                                         │
│  ┌─ Top Bar (Transparent) ────────┐    │
│  │  ✨ Lifestyle Spotlight         │    │
│  │          [For You] [Following]  │    │
│  └─────────────────────────────────┘    │
│                                         │
│                                         │
│  [VIDEO PLAYING - Vertical]             │
│  Auto-play, Loop                        │
│                                         │
│                                         │
│  ┌─ Product Tags (Floating) ──────┐    │
│  │  🛍️ Túi Dior Lady - ₫85M      │ ← Tappable
│  │  📍 Boutique Dior, Q1          │    │
│  └────────────────────────────────┘    │
│                                         │
│                                         │
│  ┌─ Right Sidebar (Icons) ────────┐    │
│  │         [@Avatar]               │ ← Creator
│  │            +                    │ ← Follow
│  │                                 │    │
│  │         [❤️ 12.5K]              │ ← Like
│  │         [💬 892]                │ ← Comment
│  │         [🔖 Save]               │ ← Bookmark
│  │         [↗️ Share]              │ ← Share
│  │                                 │    │
│  │     [🎵 Audio Info]             │ ← Music
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─ Bottom Info (Transparent BG) ─┐    │
│  │  @mai_lifestyle_review          │    │
│  │  ⭐ Rising Creator • 15K followers │    │
│  │                                 │    │
│  │  "Review chi tiết Túi Dior Lady│    │
│  │  - Chất liệu da thật, may thủ   │    │
│  │  công tinh xảo. Đáng đầu tư!"   │    │
│  │  ... [xem thêm]                 │    │
│  │                                 │    │
│  │  ⭐⭐⭐⭐⭐ 5.0/5                 │    │
│  │  #DiorBag #LuxuryReview #OOTD   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─ CTA Button (Floating) ─────────┐    │
│  │  🛒 MUA NGAY - ₫85M             │ ← Prominent
│  │  (Gold gradient, pulsing anim)  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [Swipe ↑ for next video]               │
│                                         │
└─────────────────────────────────────────┘

Gestures:
• Swipe Up: Next video
• Swipe Down: Previous video
• Tap center: Pause/Play
• Tap right icons: Action
• Tap product tag: View product details
• Long press: Save/Report options
```

**Key Features:**
- **Auto-play**: Video starts immediately (muted first view, then with sound)
- **Infinite scroll**: Seamless loading of next videos
- **Product tagging**: Up to 5 products can be tagged per video
- **Smart CTA**: Button text adapts based on product type
  - Products: "MUA NGAY"
  - Services: "ĐẶT LỊCH"
  - Insurance: "NHẬN TƯ VẤN"
  - Travel: "BOOK NGAY"
- **Creator follow**: Quick follow from video (no need to visit profile)
- **Engagement metrics**: Real-time updates

---

### Screen 2: Product Detail from Spotlight

**Trigger**: User taps on product tag in video

```
┌─────────────────────────────────────────┐
│ [< Back]        Product      [⋮ More]   │
├─────────────────────────────────────────┤
│                                         │
│  ┌─ Image Carousel ──────────────────┐  │
│  │  [Photo 1]  [Photo 2]  [Video]    │  │
│  │  ●○○○ (Indicators)                │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Túi Dior Lady - Size Medium            │
│  Chính hãng • Boutique Dior Q1          │
│                                         │
│  ⭐ 4.8/5 (2,456 reviews)               │
│  💬 1,245 Redcomments                   │
│                                         │
│  ₫85,000,000                            │
│  [Trả góp 0%] [Bảo hành 2 năm]          │
│                                         │
│  ┌─ Quick Actions ───────────────────┐  │
│  │  [❤️ Yêu thích]  [💬 Chat]  [🔖 Lưu]│  │
│  └───────────────────────────────────┘  │
│                                         │
│  ━━━━━ Tabs ━━━━━━━━━━━━━━━━━━━━━━━━  │
│  [Redcomments] [Reviews] [Chi tiết]     │
│                                         │
│  ━━━━━ Redcomments (KOC Content) ━━━━━  │
│                                         │
│  ┌─ Redcomment Card 1 ───────────────┐  │
│  │  [Thumbnail với Play button]      │  │
│  │  @mai_lifestyle_review            │  │
│  │  ⭐ 5.0 • 12.5K views • 2 days ago │  │
│  │  "Review chi tiết Dior Lady..."   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌─ Redcomment Card 2 ───────────────┐  │
│  │  [Thumbnail]                      │  │
│  │  @fashion_queen_vn                │  │
│  │  ⭐ 4.8 • 8.2K views • 1 week ago  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  [View all 1,245 Redcomments]           │
│                                         │
│  ━━━━━ Community Reviews ━━━━━━━━━━━━  │
│                                         │
│  ⭐⭐⭐⭐⭐ 4.8/5 (2,456 đánh giá)         │
│                                         │
│  ┌─ Rating Breakdown ────────────────┐  │
│  │  Chất lượng:    ⭐⭐⭐⭐⭐ 4.9      │  │
│  │  Giá cả:        ⭐⭐⭐⭐○ 4.5      │  │
│  │  Dịch vụ:       ⭐⭐⭐⭐⭐ 4.9      │  │
│  │  Giao hàng:     ⭐⭐⭐⭐⭐ 5.0      │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌─ User Review 1 ────────────────────┐ │
│  │  [@avatar] Nguyễn Mai             │  │
│  │  ⭐⭐⭐⭐⭐ Verified Purchase        │  │
│  │  "Chất lượng tuyệt vời! Da thật,  │  │
│  │   may rất đẹp. Đáng tiền!"        │  │
│  │  [Photo 1] [Photo 2] [Photo 3]    │  │
│  │  👍 892 người thấy hữu ích         │  │
│  │                                   │  │
│  │  💬 Phản hồi từ Boutique Dior:    │  │
│  │  "Cảm ơn chị đã tin tưởng..."     │  │
│  └───────────────────────────────────┘  │
│                                         │
│  [View all 2,456 reviews]               │
│                                         │
│  ━━━━━ Sticky Bottom Bar ━━━━━━━━━━━━  │
│  ┌───────────────────────────────────┐  │
│  │  [💬 Chat]  [🛒 MUA NGAY - ₫85M]  │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

**Tabs Behavior:**
1. **Redcomments Tab** (Default):
   - Shows professional content from KOCs
   - Sorted by: "Top" (most views/engagement) or "Recent"
   - Each card is tappable → Opens video in Spotlight mode
   
2. **Reviews Tab**:
   - Community reviews from verified purchases
   - Filter: All stars, 5⭐, 4⭐, 3⭐, etc.
   - Sort: Most helpful, Recent, Highest rated
   
3. **Chi tiết Tab**:
   - Product specifications
   - Shipping info
   - Return policy

---

### Screen 3: Redcomment Detail View

**Trigger**: User taps on a Redcomment card

```
┌─────────────────────────────────────────┐
│ [< Back]        Redcomment   [⋮ More]   │
├─────────────────────────────────────────┤
│                                         │
│  ┌─ Video Player (16:9 or Vertical) ─┐  │
│  │                                    │  │
│  │        [VIDEO PLAYING]             │  │
│  │                                    │  │
│  │  [Progress bar]   [⏸] [🔊] [⚙️]   │  │
│  └────────────────────────────────────┘  │
│                                         │
│  ┌─ Creator Info ─────────────────────┐  │
│  │  [@avatar] @mai_lifestyle_review   │  │
│  │  ⭐ Rising • 15K followers          │  │
│  │  [+ Follow]                        │  │
│  └────────────────────────────────────┘  │
│                                         │
│  Review chi tiết Túi Dior Lady         │
│  - Chất liệu da thật, may thủ công    │
│                                         │
│  ⭐⭐⭐⭐⭐ 5.0/5                         │
│  ┌─────────────────────────────────────┐ │
│  │  Chất lượng:  ⭐⭐⭐⭐⭐ 5.0         │  │
│  │  Giá cả:      ⭐⭐⭐⭐○ 4.0         │  │
│  │  Thiết kế:    ⭐⭐⭐⭐⭐ 5.0         │  │
│  └─────────────────────────────────────┘ │
│                                         │
│  👁️ 12.5K views • 💬 892 comments      │
│  🔗 2,345 clicks • 🛒 156 conversions  │
│  Posted 2 days ago                      │
│                                         │
│  #DiorBag #LuxuryReview #OOTD           │
│  #Fashion #Lifestyle                    │
│                                         │
│  ━━━━━ Tagged Products (Swipeable) ━━━  │
│  ┌─ Product Card 1 ───────────────────┐ │
│  │  [Thumbnail]                       │  │
│  │  Túi Dior Lady - Medium            │  │
│  │  ₫85,000,000                       │  │
│  │  [MUA NGAY]                        │  │
│  └────────────────────────────────────┘  │
│  ← Swipe for more products →            │
│                                         │
│  ━━━━━ Engagement ━━━━━━━━━━━━━━━━━━━  │
│  ┌───────────────────────────────────┐  │
│  │  [❤️ 12.5K]  [💬 892]  [🔖]  [↗️]  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ━━━━━ Comments (892) ━━━━━━━━━━━━━━━  │
│                                         │
│  ┌─ Comment 1 ─────────────────────────┐│
│  │  [@avatar] Lan Anh                 │ │
│  │  "Review rất chi tiết! Cảm ơn chị" │ │
│  │  ❤️ 125 • Reply • 2 days ago       │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌─ Comment 2 ─────────────────────────┐│
│  │  [@avatar] Thu Thảo                │ │
│  │  "Túi đẹp quá! Đã order rồi 😍"    │ │
│  │  ❤️ 89 • Reply • 1 day ago         │ │
│  └────────────────────────────────────┘ │
│                                         │
│  [View all 892 comments]                │
│                                         │
│  ┌─ Comment Input ────────────────────┐ │
│  │  [@your_avatar]                    │  │
│  │  [Write a comment...]       [Send] │  │
│  └────────────────────────────────────┘  │
│                                         │
│  ━━━━━ Related Redcomments ━━━━━━━━━━  │
│  [Horizontal scroll of similar content] │
│                                         │
└─────────────────────────────────────────┘
```

---

### Screen 4: Write a Review (User-Generated)

**Trigger**: From product page → "Viết đánh giá" button

```
┌─────────────────────────────────────────┐
│ [✕ Close]    Viết đánh giá   [Submit]   │
├─────────────────────────────────────────┤
│                                         │
│  Đánh giá: Túi Dior Lady                │
│                                         │
│  ━━━━━ Overall Rating ━━━━━━━━━━━━━━━  │
│  Bạn đánh giá sao?                      │
│  ⭐⭐⭐⭐⭐ (Tap to select)              │
│                                         │
│  ━━━━━ Category Ratings (Optional) ━━━  │
│  Chất lượng:  ⭐⭐⭐⭐⭐                  │
│  Giá cả:      ⭐⭐⭐⭐○                  │
│  Dịch vụ:     ⭐⭐⭐⭐⭐                  │
│                                         │
│  ━━━━━ Review Title (Optional) ━━━━━━━  │
│  ┌─────────────────────────────────────┐│
│  │  [Túi đẹp, chất lượng tuyệt vời!]  ││
│  └─────────────────────────────────────┘│
│                                         │
│  ━━━━━ Review Content ━━━━━━━━━━━━━━━  │
│  ┌─────────────────────────────────────┐│
│  │  Chia sẻ trải nghiệm của bạn...    ││
│  │  (Max 1000 characters)             ││
│  │                                    ││
│  │                                    ││
│  │                                    ││
│  │                                    ││
│  │  0/1000                            ││
│  └─────────────────────────────────────┘│
│                                         │
│  ━━━━━ Pros & Cons (Optional) ━━━━━━━━  │
│  ✅ Ưu điểm:                            │
│  ┌─────────────────────────────────────┐│
│  │  • Chất lượng tốt                  ││
│  │  • Thiết kế đẹp                    ││
│  │  [+ Add more]                      ││
│  └─────────────────────────────────────┘│
│                                         │
│  ❌ Nhược điểm:                         │
│  ┌─────────────────────────────────────┐│
│  │  • Giá hơi cao                     ││
│  │  [+ Add more]                      ││
│  └─────────────────────────────────────┘│
│                                         │
│  ━━━━━ Add Photos/Video ━━━━━━━━━━━━━  │
│  ┌────┬────┬────┬────┬────────────────┐ │
│  │[+] │[+] │[+] │[+] │ Max 10 photos  │ │
│  │Foto│Foto│Foto│Video│ or 1 video   │ │
│  └────┴────┴────┴────┴────────────────┘ │
│                                         │
│  ━━━━━ Purchase Verification ━━━━━━━━━  │
│  ☑️ Tôi đã mua/sử dụng sản phẩm này     │
│  Ngày mua: [15/02/2026] (Optional)      │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│  [Submit Review]                        │
│  (Large button, gold color)             │
│                                         │
└─────────────────────────────────────────┘
```

**Validation:**
- Rating is required (1-5 stars)
- Review content minimum 20 characters
- Photos/video are optional
- If "Verified purchase" is checked, system will verify against order history

---

## 🎨 Part 2: Creator Platform - "Kiếm tiền cùng LS"

### Navigation Structure (In-app or Separate App)

```
Creator Platform
├─ 📊 Dashboard (Home)
├─ 🎬 My Content
│   ├─ Published
│   ├─ Pending Review
│   ├─ Drafts
│   └─ Rejected
├─ ➕ Create Redcomment
│   ├─ Video Reel
│   ├─ Photo Essay
│   ├─ Article
│   └─ Comparison
├─ 💰 Earnings
│   ├─ Overview
│   ├─ Transactions
│   └─ Withdraw
├─ 🔗 Affiliate Links
├─ 📈 Analytics
├─ 👥 My Followers
└─ ⚙️ Settings
    ├─ Profile
    ├─ Bank Account
    └─ Notifications
```

---

### Screen 5: Creator Dashboard (Desktop/Mobile-friendly)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ╔════════════════════════════════════════════════════════════════════╗  │
│ ║  Lifestyle Creator Platform        [@mai_lifestyle]  [Notifications] ║  │
│ ╚════════════════════════════════════════════════════════════════════╝  │
│                                                                         │
│ ━━━━━ Welcome back, Mai! ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                         │
│ ┌─ Quick Stats (Last 30 Days) ──────────────────────────────────────┐  │
│ │                                                                    │  │
│ │  ┌──────────┬──────────┬──────────┬──────────┬──────────┐        │  │
│ │  │ 👁️ VIEWS │ ❤️ LIKES │ 🔗 CLICKS│ 🛒 SALES │ 💰 EARNED│        │  │
│ │  ├──────────┼──────────┼──────────┼──────────┼──────────┤        │  │
│ │  │ 125.4K   │  8.5K    │  2.3K    │   156    │ ₫28.5M   │        │  │
│ │  │ 📈 +22%  │  📈 +18% │  📈 +35% │  📈 +42% │  📈 +45% │        │  │
│ │  └──────────┴──────────┴──────────┴──────────┴──────────┘        │  │
│ │                                                                    │  │
│ └────────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│ ━━━━━ Earnings Breakdown (Last 30 Days) ━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                         │
│ ┌────────────────────────┬────────────────────────┬──────────────────┐  │
│ │ 📝 Content Fees        │ 🔗 Affiliate Commission│ 🎁 Bonuses       │  │
│ ├────────────────────────┼────────────────────────┼──────────────────┤  │
│ │ ₫8.5M (30%)            │ ₫18.2M (64%)           │ ₫1.8M (6%)       │  │
│ │ 12 Redcomments         │ 156 conversions        │ 2 campaigns      │  │
│ │ Avg: ₫708K/piece       │ Avg: ₫117K/conversion  │                  │  │
│ └────────────────────────┴────────────────────────┴──────────────────┘  │
│                                                                         │
│ Current Balance: ₫28,500,000  [💸 Withdraw] [View Details]             │
│                                                                         │
│ ━━━━━ Performance Chart ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                         │
│ ┌─ Views & Earnings (Last 7 Days) ──────────────────────────────────┐  │
│ │      Chart showing:                                                │  │
│ │      • Daily views (bar chart, purple)                             │  │
│ │      • Daily earnings (line chart, gold)                           │  │
│ │                                                                    │  │
│ │      ▅▇█▇▆▇█  (Views trend up)                                     │  │
│ │     ╱        ╲╱  (Earnings following)                              │  │
│ │    ╱              ╲                                                │  │
│ │   Mon Tue Wed Thu Fri Sat Sun                                      │  │
│ └────────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│ ━━━━━ Top Performing Content ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                         │
│ ┌─ #1 Redcomment ───────────────────────────────────────────────────┐  │
│ │  [Thumbnail]  "Review Túi Dior Lady - Đáng đầu tư hay không?"     │  │
│ │               👁️ 45.2K • ❤️ 3.2K • 🔗 892 • 🛒 58 • ₫11.2M earned │  │
│ │               ⭐ 5.0 • Posted 5 days ago                           │  │
│ │               [View] [Analytics] [Share]                           │  │
│ └────────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│ ┌─ #2 Redcomment ───────────────────────────────────────────────────┐  │
│ │  [Thumbnail]  "Top 5 quán café Aesthetic ở Sài Gòn"               │  │
│ │               👁️ 38.5K • ❤️ 2.8K • 🔗 645 • 🛒 42 • ₫7.8M earned  │  │
│ │               ⭐ 4.9 • Posted 1 week ago                           │  │
│ │               [View] [Analytics] [Share]                           │  │
│ └────────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│ [View All Content]                                                      │
│                                                                         │
│ ━━━━━ Content Status ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                         │
│ ┌────────────┬────────────┬────────────┬────────────┐                  │
│ │ Published  │ Pending    │ Drafts     │ Rejected   │                  │
│ ├────────────┼────────────┼────────────┼────────────┤                  │
│ │   45       │    3       │    2       │    1       │                  │
│ │ (View all) │ (Review)   │ (Finish)   │ (Fix)      │                  │
│ └────────────┴────────────┴────────────┴────────────┘                  │
│                                                                         │
│ ━━━━━ Quick Actions ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                         │
│ [➕ Create New Redcomment]  [📊 View Full Analytics]  [💰 Withdraw]    │
│                                                                         │
│ ━━━━━ Notifications & Updates ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                         │
│ • 🎉 Your "Túi Dior Lady" Redcomment reached 1M views milestone!       │
│ • 💰 ₫8.5M content fee credited for 12 approved Redcomments            │
│ • ✅ 3 Redcomments approved and published                              │
│ • 📈 You're now a "Rising Creator"! (15K followers)                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Screen 6: Create Redcomment (Multi-step Form)

**Step 1: Choose Format**

```
┌─────────────────────────────────────────┐
│ [✕ Close]  Create Redcomment  [Help ?]  │
├─────────────────────────────────────────┤
│                                         │
│  Chọn định dạng Redcomment              │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  🎬 VIDEO REEL                  │    │
│  │  Vertical video (TikTok style)  │    │
│  │  Best for: Product demos,       │    │
│  │  personal experiences           │    │
│  │  [Select]                       │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  📸 PHOTO ESSAY                 │    │
│  │  Multiple photos with captions  │    │
│  │  Best for: Aesthetic reviews,   │    │
│  │  detailed visuals               │    │
│  │  [Select]                       │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  📝 ARTICLE                     │    │
│  │  Text-based with photos         │    │
│  │  Best for: In-depth analysis,   │    │
│  │  guides, comparisons            │    │
│  │  [Select]                       │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  ⚖️ COMPARISON                  │    │
│  │  Side-by-side product compare   │    │
│  │  Best for: Buying guides,       │    │
│  │  alternatives                   │    │
│  │  [Select]                       │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

**Step 2: Upload Media (Video Reel example)**

```
┌─────────────────────────────────────────┐
│ [< Back]  Video Reel (1/5)  [Save Draft]│
├─────────────────────────────────────────┤
│                                         │
│  Upload Video                           │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │         [📹 Upload icon]            ││
│  │                                     ││
│  │   Tap to upload or record video    ││
│  │                                     ││
│  │   Vertical format (9:16)           ││
│  │   Duration: 15s - 3 minutes        ││
│  │   Max size: 500MB                  ││
│  │                                     ││
│  │   [Upload from Gallery]            ││
│  │   [Record Now]                     ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  Tips for great Redcomments:           │
│  ✅ Good lighting                       │
│  ✅ Clear audio                         │
│  ✅ Stable footage (use tripod)         │
│  ✅ Show product clearly                │
│  ✅ Be authentic & honest               │
│                                         │
│  [Need help? Watch tutorial]            │
│                                         │
└─────────────────────────────────────────┘
```

**Step 3: Add Details**

```
┌─────────────────────────────────────────┐
│ [< Back]  Details (2/5)      [Next >]   │
├─────────────────────────────────────────┤
│                                         │
│  ┌─ Video Preview ─────────────────────┐│
│  │  [Thumbnail with Play button]      ││
│  │  Duration: 1:24                    ││
│  └─────────────────────────────────────┘│
│                                         │
│  Title *                                │
│  ┌─────────────────────────────────────┐│
│  │  Review Túi Dior Lady - Đáng đầu tư││
│  │  hay không?                        ││
│  └─────────────────────────────────────┘│
│  Max 100 characters                     │
│                                         │
│  Description *                          │
│  ┌─────────────────────────────────────┐│
│  │  Chi tiết về chất liệu da thật,    ││
│  │  may thủ công tinh xảo. Phân tích  ││
│  │  có đáng đầu tư hay không...       ││
│  │                                    ││
│  │  245/500                           ││
│  └─────────────────────────────────────┘│
│                                         │
│  Thumbnail (Optional)                   │
│  ┌──────┐                               │
│  │[Auto]│ [Upload custom thumbnail]     │
│  └──────┘                               │
│  System will auto-generate if not       │
│  provided                               │
│                                         │
│  Category *                             │
│  [Fashion & Accessories ▾]              │
│                                         │
│  Tags (Max 10)                          │
│  #DiorBag #LuxuryReview #OOTD          │
│  [+ Add tag]                            │
│                                         │
│  Sponsored Content?                     │
│  ☐ This is sponsored by a brand         │
│  If yes, sponsor name: [_____________]  │
│                                         │
│  [< Back]              [Next: Rating >] │
│                                         │
└─────────────────────────────────────────┘
```

**Step 4: Rating & Tags**

```
┌─────────────────────────────────────────┐
│ [< Back]  Rating (3/5)       [Next >]   │
├─────────────────────────────────────────┤
│                                         │
│  Tag Products/Services *                │
│  (These will appear on your video)      │
│                                         │
│  [🔍 Search products/services...]       │
│                                         │
│  Tagged (2):                            │
│  ┌────────────────────────────────────┐ │
│  │  [Thumbnail]                       │ │
│  │  Túi Dior Lady - Medium            │ │
│  │  ₫85,000,000                       │ │
│  │  Boutique Dior, Q1                 │ │
│  │  [✕ Remove]                        │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌────────────────────────────────────┐ │
│  │  [Thumbnail]                       │ │
│  │  Dior Lady Wallet                  │ │
│  │  ₫12,500,000                       │ │
│  │  [✕ Remove]                        │ │
│  └────────────────────────────────────┘ │
│                                         │
│  [+ Add more products] (Max 5)          │
│                                         │
│  ━━━━━ Your Rating ━━━━━━━━━━━━━━━━━━  │
│                                         │
│  Overall Rating *                       │
│  ⭐⭐⭐⭐⭐ 5.0                          │
│  (Tap to adjust)                        │
│                                         │
│  Category Ratings (Optional)            │
│  Chất lượng:  ⭐⭐⭐⭐⭐ 5.0             │
│  Giá cả:      ⭐⭐⭐⭐○ 4.0             │
│  Thiết kế:    ⭐⭐⭐⭐⭐ 5.0             │
│  Dịch vụ:     ⭐⭐⭐⭐⭐ 5.0             │
│                                         │
│  [< Back]          [Next: CTA Buttons >]│
│                                         │
└─────────────────────────────────────────┘
```

**Step 5: CTA Buttons**

```
┌─────────────────────────────────────────┐
│ [< Back]  Call to Action (4/5) [Next >] │
├─────────────────────────────────────────┤
│                                         │
│  Add action buttons to your video       │
│  (Viewers will see these on video)      │
│                                         │
│  CTA Button 1 (Primary) *               │
│  ┌─────────────────────────────────────┐│
│  │  Button Text:                       ││
│  │  [MUA NGAY - ₫85M]                  ││
│  │                                     ││
│  │  Action Type:                       ││
│  │  [● Buy   ○ Book   ○ Consult]       ││
│  │  [○ Call  ○ External Link]          ││
│  │                                     ││
│  │  Link to Product:                   ││
│  │  Túi Dior Lady - Medium             ││
│  │  (Auto-linked from tagged products) ││
│  │                                     ││
│  │  Position on video:                 ││
│  │  [● Bottom Right  ○ Bottom Center]  ││
│  └─────────────────────────────────────┘│
│                                         │
│  CTA Button 2 (Optional)                │
│  ┌─────────────────────────────────────┐│
│  │  [+ Add secondary CTA button]       ││
│  └─────────────────────────────────────┘│
│                                         │
│  Affiliate Tracking                     │
│  Your unique affiliate ID:              │
│  LS-ID-MAI15K                           │
│  ✅ Auto-attached to all CTAs           │
│                                         │
│  Commission Info:                       │
│  • Product: 15% commission              │
│  • Est. per sale: ₫191,250 (15% of ₫1.2M│
│    after merchant's fee)                │
│                                         │
│  Tips for high conversions:             │
│  • Be specific in CTA text              │
│  • Create urgency ("Limited time")      │
│  • Make it easy (1-tap action)          │
│                                         │
│  [< Back]           [Next: Review >]    │
│                                         │
└─────────────────────────────────────────┘
```

**Step 6: Review & Submit**

```
┌─────────────────────────────────────────┐
│ [< Back]  Review (5/5)  [Submit Review] │
├─────────────────────────────────────────┤
│                                         │
│  Review your Redcomment before          │
│  submitting for approval                │
│                                         │
│  ┌─ Preview ──────────────────────────┐ │
│  │  [Video thumbnail with Play icon]  │ │
│  │  Duration: 1:24                    │ │
│  └────────────────────────────────────┘ │
│                                         │
│  Title:                                 │
│  Review Túi Dior Lady - Đáng đầu tư hay │
│  không?                                 │
│  [Edit]                                 │
│                                         │
│  Tagged Products (2):                   │
│  • Túi Dior Lady - Medium (₫85M)        │
│  • Dior Lady Wallet (₫12.5M)            │
│  [Edit]                                 │
│                                         │
│  Rating: ⭐⭐⭐⭐⭐ 5.0                    │
│  [Edit]                                 │
│                                         │
│  CTA Buttons:                           │
│  1. "MUA NGAY - ₫85M" (Buy, Bottom Right│
│  [Edit]                                 │
│                                         │
│  Affiliate ID: LS-ID-MAI15K ✅          │
│                                         │
│  ━━━━━ Terms & Conditions ━━━━━━━━━━━  │
│  ☑️ I confirm that:                     │
│  • Content is original and I own rights │
│  • Information is accurate & honest     │
│  • Complies with Lifestyle policies     │
│  • Appropriate for all audiences        │
│                                         │
│  [View Full Terms & Conditions]         │
│                                         │
│  ━━━━━ Estimated Review Time ━━━━━━━━━  │
│  Your Redcomment will be reviewed       │
│  within 24 hours. You'll receive        │
│  notification once approved/rejected.   │
│                                         │
│  Quality Score (AI Pre-screen): 92/100  │
│  ✅ High chance of approval!            │
│                                         │
│  [Save as Draft]   [Submit for Review]  │
│                                         │
└─────────────────────────────────────────┘
```

---

(File này đang rất dài, tôi sẽ tiếp tục với phần còn lại trong một lần update khác)

Due to length, I'll continue this file with remaining sections. Tôi sẽ tạo một completion marker ở đây và tiếp tục.
