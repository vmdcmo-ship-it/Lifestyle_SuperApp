# Driver App Architecture - Lifestyle Super App

> **Tài liệu cấu trúc App Driver** - Dành cho tài xế đối tác
> 
> Tham khảo từ: các ứng dụng vận chuyển cùng loại (đầy đủ features, marketplace design)

---

## 📱 Platform

### Mobile Apps
- **apps/mobile-driver** - React Native app cho tài xế
- **apps/driver-web** (optional) - Web portal cho tài xế (desktop)

### Backend Services
- **services/driver-service** - Driver profile, availability, stats
- **services/order-matching-service** - Order marketplace & matching
- **services/earning-service** - Earnings, wallet, payouts
- **services/challenge-service** - Challenges, rewards, leaderboard

---

## 🗺️ App Structure

### Bottom Navigation (5 tabs)

```
┌─────────────────────────────────────────────────┐
│  🎯 Nhận đơn   │  📦 Đơn hàng  │  💰 Thu nhập  │
│               │               │               │
│  🎁 Nhiệm vụ  │  👤 Tài xế   │               │
└─────────────────────────────────────────────────┘
```

1. **🎯 Nhận đơn** (Marketplace) - Chợ đơn hàng
2. **📦 Đơn hàng** (Order Management) - Quản lý đơn đã nhận
3. **💰 Thu nhập** (Earnings) - Ví tài xế & thu nhập
4. **🎁 Nhiệm vụ** (Challenges/Missions) - Thử thách & phần thưởng
5. **👤 Tài xế** (Profile/Account) - Tài khoản & cài đặt

---

## 1️⃣ Tab: Nhận đơn (Marketplace)

### Mục đích
- **Chợ đơn hàng** - Hiển thị đơn hàng available
- Real-time updates
- Driver có thể pick & choose đơn phù hợp
- Filter theo: khoảng cách, giá trị, loại dịch vụ

### UI Components
```
┌─────────────────────────────────────────┐
│  🔍 Tìm kiếm & Filter                   │
│  ┌─────────────────────────────────┐   │
│  │ Lọc: Tất cả ▾  Khoảng cách ▾   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📍 Đơn gần bạn (2.3km)                │
│  ┌─────────────────────────────────┐   │
│  │ 🏍️ Giao đồ ăn                  │   │
│  │ 📍 A → B (3.5km)                │   │
│  │ 💰 45,000đ  ⏱️ 25 phút          │   │
│  │ [Nhận đơn]                      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📍 Đơn VIP (Ưu tiên)                  │
│  ┌─────────────────────────────────┐   │
│  │ 🚗 Đặt xe 7 chỗ               │   │
│  │ 📍 Tân Bình → Q1 (8km)         │   │
│  │ 💰 120,000đ  ⏱️ 35 phút         │   │
│  │ ⭐ Thưởng thêm 20,000đ         │   │
│  │ [Nhận ngay]                     │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Features
- **Real-time order feed** - WebSocket updates
- **Smart matching** - Gợi ý đơn phù hợp với driver
- **Order details modal** - Chi tiết đơn trước khi nhận
- **Auto-refresh** - Cập nhật danh sách tự động
- **Sound notification** - Thông báo đơn mới
- **Quick accept** - 1-tap nhận đơn
- **Filters:**
  - Loại dịch vụ (Food, Ride, Shopping, etc.)
  - Khoảng cách (< 2km, 2-5km, > 5km)
  - Giá trị đơn (< 50K, 50-100K, > 100K)
  - Thời gian giao (sớm nhất, thời gian phù hợp)

### Order Card Info
- Service type (icon + label)
- Pickup location → Dropoff location
- Distance & estimated time
- Payment amount
- Bonus/incentive (if any)
- Customer rating (if repeat customer)
- Action button (Nhận đơn / Chi tiết)

---

## 2️⃣ Tab: Đơn hàng (Order Management)

### Mục đích
- **Quản lý đơn đã nhận** - Tracking & history
- Phân loại theo trạng thái
- Statistics & performance

### UI Structure
```
┌─────────────────────────────────────────┐
│  Tabs: Đang xử lý | Đã hoàn thành | Đã hủy │
│─────────────────────────────────────────│
│  📊 Hôm nay: 12 đơn | 540,000đ          │
│─────────────────────────────────────────│
│                                         │
│  🟢 Đang giao (#LS12345)                │
│  ┌─────────────────────────────────┐   │
│  │ 🏍️ Giao đồ ăn - McDonald's     │   │
│  │ 📍 Pickup: Nguyễn Văn A          │   │
│  │ 🎯 Dropoff: 123 Lê Lợi, Q1      │   │
│  │ ⏱️ Còn 15 phút                   │   │
│  │ 💰 45,000đ                       │   │
│  │ [Xem chi tiết] [Liên hệ]       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  🟡 Đến lấy hàng (#LS12346)            │
│  ┌─────────────────────────────────┐   │
│  │ 🚗 Đặt xe - Sân bay TSN         │   │
│  │ 📍 Đón: Terminal 1               │   │
│  │ 🎯 Đến: 456 Pasteur, Q3          │   │
│  │ 💰 150,000đ                      │   │
│  │ [Đã đến điểm đón]               │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Tabs & Status

**1. Đang xử lý (In Progress)**
- 🟢 Đang giao (Delivering)
- 🟡 Đến lấy hàng (Going to pickup)
- 🔵 Chờ xác nhận (Waiting confirmation)

**2. Đã hoàn thành (Completed)**
- ✅ Giao thành công
- Stats: Tổng đơn, tổng thu nhập, rating trung bình
- Lọc theo: Hôm nay, Tuần này, Tháng này

**3. Đã hủy (Cancelled)**
- ❌ Đã hủy (by driver/customer/system)
- Lý do hủy
- Impact: Tỷ lệ hủy đơn

### Order Detail Screen
- Order ID & timestamp
- Customer info (name, phone, rating)
- Pickup & Dropoff addresses (map + navigation)
- **📍 Location Feedback** (if GPS error > 300m)
  - Auto-detect discrepancy between driver GPS and customer address
  - Button: "Báo cáo vị trí sai" (Report incorrect location)
  - Earn 20-100 Xu for verified feedback
  - Helps improve system accuracy (PDCA cycle)
- Items list (for food/shopping)
- Payment method & amount
- Special instructions
- Timeline (Created → Accepted → Picked up → Delivered)
- Actions:
  - Call customer
  - Navigate (Google Maps / Waze)
  - Report issue
  - Complete order
  - Cancel (with reason)

### Statistics Dashboard
- Today's summary (orders, earnings, rating)
- Week/Month comparison
- Performance metrics:
  - Acceptance rate
  - Completion rate
  - Cancellation rate
  - Average rating
  - On-time delivery rate

---

## 3️⃣ Tab: Thu nhập (Earnings & Wallet)

### Mục đích
- **Ví tài xế** - Số dư, giao dịch
- **Thu nhập** - Tracking & reports
- **Rút tiền** - Payout management

### UI Structure
```
┌─────────────────────────────────────────┐
│  💰 Quỹ tài xế của tôi                  │
│  ┌─────────────────────────────────┐   │
│  │  Số dư                          │   │
│  │  đ 1,234,567                    │   │
│  │                                 │   │
│  │  Ký quỹ: đ100,000              │   │
│  │  Chờ xét duyệt: đ0             │   │
│  │                 [Chi tiết →]    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📥 Nạp tiền                            │
│  📤 Rút tiền                            │
│  📊 Chi tiết số dư                      │
│  🏦 Chi tiết tài khoản                  │
│                                         │
│  ─────────────────────────────────     │
│  📈 Thu nhập                            │
│  ┌─────────────────────────────────┐   │
│  │  Tuần này: 🔥                  │   │
│  │  2,340,000đ (+15%)             │   │
│  │  ▂▄▆█▆▄▂ (chart)               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📅 Hôm nay    540,000đ (12 đơn)       │
│  📅 Tuần này   2,340,000đ (68 đơn)     │
│  📅 Tháng này  9,870,000đ (234 đơn)    │
│                                         │
│  🧾 Lịch sử giao dịch                  │
│  ┌─────────────────────────────────┐   │
│  │ ✅ Đơn #LS12345                 │   │
│  │ 14/02 10:30  +45,000đ          │   │
│  │─────────────────────────────────│   │
│  │ 📤 Rút tiền                     │   │
│  │ 13/02 18:00  -500,000đ         │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Features

**Ví tài xế (Driver Wallet)**
- Số dư hiện tại
- Ký quỹ (security deposit - bắt buộc)
- Chờ xét duyệt (pending balance)
- Nạp tiền (Top-up): Bank transfer, E-wallet
- Rút tiền (Withdraw): To bank account
- Chi tiết số dư: Breakdown (earnings, bonus, deductions)
- Chi tiết tài khoản: Bank account info for payouts

**Thu nhập (Earnings)**
- Real-time earnings tracking
- Daily/Weekly/Monthly breakdown
- Charts & trends
- Comparison with previous periods
- Earnings by service type
- Bonus & incentives tracking

**Lịch sử giao dịch (Transaction History)**
- Earnings from orders
- Withdrawals
- Top-ups
- Bonuses
- Deductions (cancellation fees, penalties)
- Ký quỹ adjustments

**Báo cáo (Reports)**
- Detailed earning reports
- Export to PDF/Excel
- Tax documentation
- Payout history

---

## 4️⃣ Tab: Nhiệm vụ (Challenges & Missions)

### Mục đích
- **Gamification** - Tăng engagement
- **Challenges** - Thử thách hàng ngày/tuần
- **Rewards** - Phần thưởng & bonus
- **Leaderboard** - Xếp hạng tài xế

### UI Structure
```
┌─────────────────────────────────────────┐
│  🎁 Nhiệm vụ & Thử thách                │
│                                         │
│  🔥 Thử thách hôm nay                   │
│  ┌─────────────────────────────────┐   │
│  │ 🏆 Hoàn thành 15 đơn             │   │
│  │ ████████░░ 12/15                │   │
│  │ 🎁 Thưởng: 100,000đ             │   │
│  │ ⏱️ Còn 6 giờ                     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ⭐ Thử thách tuần                      │
│  ┌─────────────────────────────────┐   │
│  │ 🚀 Giao 100 đơn trong tuần       │   │
│  │ ███████░░░ 68/100               │   │
│  │ 🎁 Thưởng: 500,000đ + 1000 Xu   │   │
│  │ ⏱️ Còn 3 ngày                    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  🏅 Bảng xếp hạng tuần                 │
│  ┌─────────────────────────────────┐   │
│  │ 🥇 #1  Nguyễn A    234 đơn      │   │
│  │ 🥈 #2  Trần B      198 đơn      │   │
│  │ 🥉 #3  Lê C        176 đơn      │   │
│  │ ...                             │   │
│  │ 🎯 #156 Bạn        68 đơn       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  🎖️ Hạng thành viên: ⭐⭐ GOLD        │
│  ┌─────────────────────────────────┐   │
│  │ Ưu đãi hiện tại:                │   │
│  │ • Ưu tiên nhận đơn VIP          │   │
│  │ • Bonus +5% mọi đơn             │   │
│  │ • Miễn phí bảo hiểm             │   │
│  │                                 │   │
│  │ Lên PLATINUM: 50 đơn nữa        │   │
│  │ ██████░░░░ 150/200              │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Challenge Types

**1. Daily Challenges (Hàng ngày)**
- Hoàn thành X đơn
- Đạt rating trung bình X sao
- Online X giờ
- Giao đúng giờ X đơn
- Rewards: 50K-200K VND, Xu points

**2. Weekly Challenges (Hàng tuần)**
- Hoàn thành X đơn trong tuần
- Duy trì acceptance rate > X%
- Zero cancellation
- Peak hour bonus (giao nhiều giờ cao điểm)
- Rewards: 200K-1M VND, Xu points, tier upgrade

**3. Special Events**
- Tết bonus
- Rainy day bonus
- Night shift bonus
- Rewards: 2x-5x earnings, exclusive badges

**4. Membership Tiers (Hạng thành viên)**
- 🥉 **BRONZE** (0-50 đơn/tháng)
  - Standard commission
  - Basic support
- 🥈 **SILVER** (51-100 đơn/tháng)
  - Commission -1%
  - Priority support
- 🥇 **GOLD** (101-200 đơn/tháng)
  - Commission -2%
  - Bonus +5% per order
  - Free insurance
  - Priority VIP orders
- 💎 **PLATINUM** (201-300 đơn/tháng)
  - Commission -3%
  - Bonus +10% per order
  - Free insurance + health checkup
  - Exclusive events
- 💠 **DIAMOND** (300+ đơn/tháng)
  - Commission -5%
  - Bonus +15% per order
  - Premium insurance package
  - Personal account manager
  - Exclusive high-value orders

**5. Leaderboard (Bảng xếp hạng)**
- Daily/Weekly/Monthly rankings
- By number of orders
- By earnings
- By rating
- Prizes for top 10: Cash bonus, badges, recognition

---

## 5️⃣ Tab: Tài xế (Driver Profile & Account)

### Mục đích
- **Profile** - Thông tin cá nhân
- **Settings** - Cài đặt app
- **Support** - Hỗ trợ & FAQ
- **Documents** - Giấy tờ & xác minh

### UI Structure (Tham khảo chung)
```
┌─────────────────────────────────────────┐
│         [Avatar]                        │
│      NGUYỄN THANH VŨ                    │
│      🟢 PHỔ THÔNG                       │
│                                         │
│  5★          100%         0%           │
│  Đánh giá    Tỷ lệ chấp nhận  Tỷ lệ hủy│
│                                         │
│─────────────────────────────────────────│
│  📋 Lịch sử đơn                        │
│  💳 Ví Tài Xế                          │
│  🛡️ Bảo hiểm                           │
│                                         │
│  ──── Tài xế thân thiết ────           │
│  🎁 Giới thiệu & nhận thưởng           │
│  🎯 Thử thách                          │
│  🏆 Thi đua Tài Xế                     │
│  💰 Thưởng tuần                        │
│  ⭐ Hạng thành viên                    │
│  🚗 Xe đi chung (Carpooling)                  │
│                                         │
│  ──── Sổ tay và Đào tạo ────          │
│  📖 Sổ tay trực tuyến                  │
│  🎓 Đào tạo trực tuyến                 │
│                                         │
│  ──── Tổng quát ────                   │
│  💵 Bảng giá                           │
│  📄 Cập nhật giấy tờ                   │
│  ❓ Câu hỏi thường gặp                 │
│  📞 Tổng đài hỗ trợ                    │
│  ⚙️ Cài đặt                            │
│                                         │
│  Phiên bản 11.26.3.29                  │
│  [Đăng xuất]                           │
└─────────────────────────────────────────┘
```

### Menu Structure

**1. Profile Header**
- Avatar (editable)
- Name
- Driver tier badge (Phổ thông / VIP / Premium)
- Key stats:
  - ⭐ Rating (X★)
  - ✅ Acceptance rate (X%)
  - ❌ Cancellation rate (X%)

**2. Quick Actions**
- 📋 Lịch sử đơn → Xem tất cả đơn đã giao
- 💳 Ví Tài Xế → Earnings tab
- 🛡️ Bảo hiểm → Insurance management (TNDS tracking, reminders, purchase)

**3. Tài xế thân thiết (Loyalty Program)**
- 🎁 **Giới thiệu & nhận thưởng**
  - Referral program (driver-to-driver)
  - Mã giới thiệu unique
  - Thưởng cho cả 2 bên
- 🎯 **Thử thách** → Challenges tab
- 🏆 **Thi đua Tài Xế** → Leaderboard
- 💰 **Thưởng tuần** → Weekly bonus history
- ⭐ **Hạng thành viên** → Tier info & progress
- 🚗 **Xe đi chung** (Carpooling - if applicable)

**4. Sổ tay và Đào tạo (Handbook & Training)**
- 📖 **Sổ tay trực tuyến**
  - Driver handbook
  - Best practices
  - Safety guidelines
  - Service standards
- 🎓 **Đào tạo trực tuyến**
  - Onboarding videos
  - Skills training
  - Product knowledge
  - Quiz & certification

**5. Tổng quát (General)**
- ⚙️ **Cài đặt nhận đơn** ⭐ NEW
  - Bật trực tuyến (ON/OFF)
  - Tiền mang theo (Cash for COD)
  - Tối ưu nhận đơn:
    - Tự động nhận đơn
    - Điều hướng thông minh (2 lần/ngày)
    - Ghép đơn
    - Giao hàng công kênh
    - Đơn hàng Đối tác
  - Dịch vụ của tôi:
    - Time slots (1H-2H, 2H-4H, 4H-8H)
    - Service types
    - Hub services
  - *See detailed specs: DRIVER_ORDER_RECEIVING_SETTINGS.md*
- 💵 **Bảng giá**
  - Service pricing table
  - Commission rates
  - Bonus structure
- 🛡️ **Bảo hiểm** ⭐ NEW
  - TNDS tracking (vehicle compulsory insurance)
  - Expiry reminders (7, 3, 1 days before)
  - In-app purchase with 10% discount
  - My Insurances (BHXH, BHYT, Life, etc.)
  - Digital certificates
  - *See detailed specs: DRIVER_INSURANCE_MANAGEMENT.md*
- 📄 **Cập nhật giấy tờ**
  - Upload/renew documents
  - GPLX expiry reminder
  - Vehicle registration
  - Insurance document upload
- ❓ **Câu hỏi thường gặp** (FAQ)
- 📞 **Tổng đài hỗ trợ**
  - Hotline
  - In-app chat
  - Email support
- ⚙️ **Cài đặt chung**
  - Notifications
  - Sound/Vibration
  - Language
  - GPS accuracy
  - Data usage
  - Privacy

**6. Footer**
- App version
- Đăng xuất

---

## 🏗️ Technical Architecture

### Frontend (React Native)

**Structure:**
```
apps/mobile-driver/
├── src/
│   ├── screens/
│   │   ├── marketplace/          # Tab 1: Nhận đơn
│   │   │   ├── MarketplaceScreen.tsx
│   │   │   ├── OrderDetailModal.tsx
│   │   │   └── components/
│   │   ├── orders/                # Tab 2: Đơn hàng
│   │   │   ├── OrdersScreen.tsx
│   │   │   ├── OrderDetailScreen.tsx
│   │   │   ├── InProgressTab.tsx
│   │   │   ├── CompletedTab.tsx
│   │   │   └── CancelledTab.tsx
│   │   ├── earnings/              # Tab 3: Thu nhập
│   │   │   ├── EarningsScreen.tsx
│   │   │   ├── WalletScreen.tsx
│   │   │   ├── WithdrawScreen.tsx
│   │   │   └── TransactionHistory.tsx
│   │   ├── missions/              # Tab 4: Nhiệm vụ
│   │   │   ├── MissionsScreen.tsx
│   │   │   ├── ChallengesTab.tsx
│   │   │   ├── LeaderboardTab.tsx
│   │   │   └── MembershipTier.tsx
│   │   ├── profile/               # Tab 5: Tài xế
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── ReferralScreen.tsx
│   │   │   ├── TrainingScreen.tsx
│   │   │   ├── DocumentsScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   └── auth/
│   ├── navigation/
│   │   ├── MainTabNavigator.tsx
│   │   └── StackNavigators.tsx
│   ├── components/
│   ├── services/
│   ├── hooks/
│   ├── store/ (Redux)
│   └── utils/
└── package.json
```

### Backend Services

**1. driver-service**
- Driver profile CRUD
- Availability management (online/offline)
- Location tracking
- Performance stats
- Document verification

**2. order-matching-service**
- Order marketplace feed
- Smart matching algorithm
- Real-time updates (WebSocket)
- Order assignment
- Route optimization

**3. earning-service**
- Earnings calculation
- Wallet management (balance, deposit)
- Withdrawals & payouts
- Transaction history
- Commission calculation

**4. challenge-service**
- Challenge management
- Progress tracking
- Reward distribution
- Leaderboard calculation
- Membership tier management

**5. notification-service**
- Push notifications (new orders, earnings, etc.)
- In-app notifications
- SMS/Email alerts

---

## 📊 Key Metrics & KPIs

### Driver Performance
- **Acceptance Rate** - % đơn chấp nhận / tổng đơn offered
- **Completion Rate** - % đơn hoàn thành / tổng đơn accepted
- **Cancellation Rate** - % đơn hủy / tổng đơn accepted
- **Average Rating** - Rating trung bình từ khách hàng
- **On-time Rate** - % đơn giao đúng giờ
- **Hours Online** - Tổng giờ online/ngày
- **Orders per Hour** - Số đơn/giờ (productivity)

### Earnings Metrics
- **Daily Earnings** - Thu nhập hàng ngày
- **Weekly Earnings** - Thu nhập hàng tuần
- **Monthly Earnings** - Thu nhập hàng tháng
- **Average per Order** - Thu nhập trung bình/đơn
- **Bonus Earnings** - Thu nhập từ bonus/incentives
- **Commission Rate** - % hoa hồng platform

### Engagement Metrics
- **Active Days** - Số ngày online/tháng
- **Challenge Completion** - % thử thách hoàn thành
- **Referral Success** - Số tài xế giới thiệu thành công
- **Training Completion** - % khóa đào tạo hoàn thành

---

## 🔐 Security & Compliance

### Driver Verification
- Identity verification (CCCD + eKYC Level 2)
- Driver license verification
- Criminal record check (Lý lịch tư pháp mẫu số 2)
- Vehicle registration
- Insurance verification (TNDS)
- Background check

### Real-time Safety
- Location tracking (GPS)
- SOS button
- Trip sharing (real-time location to ops)
- Audio/Video recording (with consent)
- Emergency contact
- Insurance coverage during trips

### Data Protection
- End-to-end encryption (location, personal data)
- GDPR/PDPA compliance
- Data retention policies
- Privacy controls

---

## 🎨 Design Principles

### Mobile-First
- Optimized for one-hand use
- Large touch targets
- Bottom navigation
- Swipe gestures

### Performance
- Fast load times (<2s)
- Offline mode (cache orders, earnings)
- Low data usage
- Battery optimization

### Accessibility
- High contrast mode
- Font scaling
- Screen reader support
- Voice commands

---

## 📱 Push Notifications

### Critical
- 🔔 New order available (sound + vibration)
- ⚠️ Order about to expire
- 📍 Customer updated pickup/dropoff
- 🚨 SOS activated

### Important
- ✅ Order completed
- 💰 Earnings credited
- 🎁 Challenge completed
- 🏆 New tier achieved

### Informational
- 📊 Daily summary
- 🎯 Weekly challenge reminder
- 📄 Document expiry reminder
- 💡 Tips & best practices

---

## 🚀 Launch Checklist

### MVP Features (Phase 1)
- ✅ Driver registration & verification
- ✅ Marketplace (Nhận đơn)
- ✅ Order management (Đơn hàng)
- ✅ Basic earnings & wallet
- ✅ Profile & settings
- ✅ GPS tracking
- ✅ Push notifications

### Phase 2
- ✅ Challenges & missions
- ✅ Leaderboard
- ✅ Membership tiers
- ✅ Referral program
- ✅ Training modules
- ✅ In-app chat support

### Phase 3
- ✅ Advanced analytics
- ✅ Route optimization
- ✅ Predictive earnings
- ✅ AI-powered matching
- ✅ Gamification enhancements
- ✅ Social features (driver community)
- ✅ Location PDCA System (GPS feedback & quality improvement)
- ✅ Insurance Management (TNDS tracking, reminders, in-app purchase)

---

## 📚 Documentation Links

- **Driver Onboarding Guide** - Setup & getting started
- **API Documentation** - Backend API specs
- **Design System** - UI components & guidelines
- **Testing Guide** - QA & testing procedures
- **Deployment Guide** - CI/CD & release process
- **Location PDCA System** - GPS feedback & address quality (see `LOCATION_PDCA_SYSTEM.md`)
- **Order Receiving Settings** - Service settings & COD cash management (see `DRIVER_ORDER_RECEIVING_SETTINGS.md`)
- **Insurance Management** - TNDS tracking, reminders, in-app purchase (see `DRIVER_INSURANCE_MANAGEMENT.md`)

---

**Status**: 🟢 Architecture Complete
**Next Step**: Implementation of core screens
**Owner**: Driver Experience Team
