# Driver Order Receiving Settings - Cài đặt nhận đơn

> Feature quan trọng để driver tối ưu hóa việc nhận đơn

---

## 📋 Tổng quan

**Cài đặt nhận đơn** là tính năng cho phép driver:
1. Khai báo tiền mang theo (để ứng COD)
2. Tối ưu hóa việc nhận đơn (tự động, ghép đơn, điều hướng thông minh)
3. Chọn dịch vụ muốn nhận (để tăng cơ hội kiếm tiền)
4. Kiểm tra điều kiện trước khi nhận đơn

**Mục đích:**
- ✅ Đảm bảo driver đủ tiêu chuẩn nhận đơn (tiền mặt, dịch vụ)
- ✅ Tối ưu thu nhập (ghép đơn, tự động nhận, điều hướng thông minh)
- ✅ Giảm cancellation rate (chỉ nhận đơn phù hợp)
- ✅ Tăng productivity (tự động hóa)

---

## 🎯 5 Nhóm Settings

### 1️⃣ Bật trực tuyến

```typescript
interface OnlineStatus {
  isOnline: boolean; // Toggle ON/OFF
}
```

**UI:**
```
┌─────────────────────────────┐
│ Bật trực tuyến      [🟢 ON] │
└─────────────────────────────┘
```

**Behavior:**
- **ON:** Driver nhận được đơn mới, visible trong marketplace
- **OFF:** Driver không nhận đơn, invisible cho customers
- **Auto-off:** Khi driver hết giờ làm, hoặc hết tiền mặt

**Backend:**
- Update `driver.isAvailable = true/false`
- WebSocket emit `driver:online` / `driver:offline`
- Update driver location tracking (start/stop GPS)

---

### 2️⃣ Tiền mang theo

```typescript
interface CashManagement {
  cashOnHand: number; // Số tiền khai báo
  availableCash: number; // Tiền còn lại
  pendingCOD: number; // COD đang chờ
  maxCODAmount: number; // Giới hạn COD
}
```

**UI:**
```
┌────────────────────────────────────┐
│ Tiền mang theo      Nhập số tiền → │
│                                    │
│ Đang khai báo: 500,000đ            │
│ Đang ứng COD:  150,000đ            │
│ Còn lại:       350,000đ            │
│                                    │
│ ⚠️ Nên nạp thêm 200,000đ           │
└────────────────────────────────────┘
```

**Logic:**
- Driver khai báo số tiền họ mang theo (VD: 500,000đ)
- Mỗi khi nhận đơn COD, system trừ đi số tiền COD
- Khi tiền còn lại < 100,000đ → Alert "Nạp thêm tiền"
- Không thể nhận đơn COD nếu `availableCash < orderCODAmount`

**Example:**
```
Initial: 500,000đ
- Nhận đơn #1 (COD 80,000đ)  → Còn 420,000đ
- Nhận đơn #2 (COD 120,000đ) → Còn 300,000đ
- Nhận đơn #3 (COD 250,000đ) → ❌ KHÔNG ĐỦ TIỀN
```

**Top-up Flow:**
1. Driver vào "Tiền mang theo"
2. Click "Nạp thêm"
3. Nhập số tiền nạp thêm (VD: +200,000đ)
4. Confirm → `cashOnHand += 200,000đ`

**COD Collection:**
- Sau khi giao đơn COD, driver giữ tiền
- Cuối ngày/tuần: Nộp về công ty hoặc chuyển qua wallet
- System tracking: `totalCODCollected`, `totalCODPaid`

---

### 3️⃣ Tối ưu nhận đơn

#### A. Tự động nhận đơn

```typescript
interface AutoAccept {
  autoAcceptOrders: boolean;
  autoAcceptCriteria: {
    maxDistance: number; // km
    minAmount: number; // VND
    preferredServiceTypes: ServiceType[];
    peakHoursOnly: boolean;
  };
}
```

**UI:**
```
┌──────────────────────────────────────┐
│ Tự động nhận đơn           [🟢 ON]  │
│ Hệ thống tự kích hoạt cho bạn       │
│                                      │
│ Tiêu chí tự động:                   │
│ • Khoảng cách: ≤ 5km                │
│ • Giá trị đơn: ≥ 30,000đ            │
│ • Dịch vụ: Giao đồ ăn, Đặt xe       │
│ • Chỉ giờ cao điểm: KHÔNG           │
│                         [Chỉnh sửa] │
└──────────────────────────────────────┘
```

**Behavior:**
- System tự động match đơn phù hợp với tiêu chí
- Driver nhận notification: "Đã tự động nhận đơn #12345"
- Có 30 giây để cancel nếu không muốn

**Benefits:**
- Không bỏ lỡ đơn tốt
- Tiết kiệm thời gian
- Tăng acceptance rate

**Risks:**
- Driver có thể không kịp chuẩn bị
- Cần có grace period (30s) để cancel

#### B. Điều hướng nhận đơn (Smart Routing)

```typescript
interface SmartRouting {
  smartRoutingEnabled: boolean;
  smartRoutingUsageToday: number; // 2/2
  smartRoutingLimit: number; // 2 lần/ngày
  smartRoutingResetsAt: Date;
}
```

**UI:**
```
┌──────────────────────────────────────┐
│ Điều hướng nhận đơn                  │
│ Còn 2 luật sử dụng trong ngày  [Tắt]│
│                                      │
│ 💡 Bật để nhận gợi ý đơn trên        │
│    tuyến đường tối ưu                │
└──────────────────────────────────────┘
```

**How it works:**
1. Driver bật smart routing
2. System phân tích:
   - Vị trí hiện tại của driver
   - Các đơn available trong bán kính 10km
   - Tuyến đường tối ưu (A → B → C)
3. Gợi ý: "Nếu đi theo tuyến này, bạn có thể nhận 3 đơn, kiếm ~150,000đ trong 45 phút"
4. Driver chọn accept suggestion hoặc bỏ qua

**Limit:**
- **2 lần/ngày** (giới hạn để không spam)
- Reset vào 00:00 hàng ngày
- Membership tier cao → More usage (Diamond: 5 lần/ngày)

**Algorithm (Simplified):**
```python
def suggest_smart_route(driver_location, available_orders):
    # 1. Filter orders within 10km
    nearby_orders = filter_by_distance(available_orders, 10)
    
    # 2. Calculate optimal route (TSP - Traveling Salesman Problem)
    optimal_route = traveling_salesman(driver_location, nearby_orders)
    
    # 3. Calculate metrics
    total_earnings = sum(order.amount for order in optimal_route)
    total_distance = calculate_route_distance(optimal_route)
    total_time = estimate_time(total_distance)
    efficiency = total_earnings / total_time # VND/minute
    
    # 4. Return if efficiency > threshold
    if efficiency > MIN_EFFICIENCY:
        return {
            "route": optimal_route,
            "earnings": total_earnings,
            "time": total_time,
            "efficiency": efficiency
        }
```

#### C. Ghép đơn (Batch Orders)

```typescript
interface BatchOrders {
  batchOrdersEnabled: boolean;
  maxBatchOrders: number; // 3-5 đơn
}
```

**UI:**
```
┌──────────────────────────────────────┐
│ Ghép đơn                   [🟢 ON]  │
│                                      │
│ Cho phép nhận nhiều đơn cùng lúc    │
│ Tối đa: 3 đơn                        │
└──────────────────────────────────────┘
```

**How it works:**
- Driver có thể nhận 2-5 đơn cùng lúc (nếu cùng khu vực)
- System suggest: "Có 2 đơn cùng tuyến, nhận cùng lúc?"
- Requirements:
  - Pickup locations gần nhau (< 2km)
  - Dropoff locations cùng hướng
  - Time windows không conflict

**Benefits:**
- Tăng thu nhập/giờ (3 đơn trong 1 giờ thay vì 1 đơn)
- Giảm quãng đường di chuyển
- Tối ưu hóa thời gian

**Challenges:**
- Phức tạp hơn (quản lý nhiều đơn)
- Risk: Trễ 1 đơn → Ảnh hưởng tất cả
- Cần training driver

#### D. Giao hàng công kênh (Hub Delivery)

```typescript
interface HubDelivery {
  hubDeliveryEnabled: boolean;
}
```

**UI:**
```
┌──────────────────────────────────────┐
│ Giao hàng công kênh        [⚪ OFF] │
└──────────────────────────────────────┘
```

**What is Hub Delivery?**
- **Hub:** Điểm trung chuyển hàng hóa (warehouse)
- **Flow:** Merchant → Hub → Driver → Customer
- **Use case:** Bulk orders, scheduled deliveries

**Benefits:**
- Nhận nhiều đơn cùng lúc tại Hub
- Không cần đi lấy hàng ở merchant
- Fixed pickup location (dễ dàng hơn)

**Requirements:**
- Driver phải đến Hub để lấy hàng
- Hub thường ở xa trung tâm
- Phù hợp với xe tải nhỏ, nhiều đơn

#### E. Cài đặt đơn hàng Đối tác

```typescript
interface PartnerOrders {
  allowPartnerOrders: boolean;
  preferredPartners: string[]; // Partner IDs
  minPartnerRating: number; // 4.0
}
```

**UI:**
```
┌──────────────────────────────────────┐
│ Cài đặt đơn hàng Đối tác         → │
│                                      │
│ Cho phép nhận đơn từ đối tác         │
│ Đối tác ưu tiên:                     │
│ • McDonald's ✓                       │
│ • KFC ✓                              │
│ • The Coffee House ✓                 │
│                                      │
│ Rating tối thiểu: 4.0★               │
└──────────────────────────────────────┘
```

**What are Partner Orders?**
- Đơn từ merchant lớn (McDonald's, KFC, etc.)
- Có contract với platform → Ưu tiên
- Thường có bonus/incentives

**Benefits:**
- Đơn ổn định (merchants có volume cao)
- Bonus từ partners
- Professional service (clear processes)

---

### 4️⃣ Dịch vụ của tôi

```typescript
interface EnabledServices {
  // Time slots
  express1h2h: boolean; // 1H - 2H
  standard2h4h: boolean; // 2H - 4H
  economy4h8h: boolean; // 4H - 8H
  
  // Service types
  foodDelivery: boolean;
  rideBike: boolean;
  rideCar4: boolean;
  rideCar7: boolean;
  shopping: boolean;
  parcel: boolean;
  document: boolean;
  
  // Hub services
  hubCongKenh: boolean;
  hubTheoDiem: boolean;
  
  // Special
  bulkyItems: boolean;
  fragileItems: boolean;
  coldChain: boolean;
}
```

**UI (Tham khảo):**
```
┌──────────────────────────────────────┐
│ Dịch vụ của tôi            [⚪ OFF] │
│                                      │
│ ┌──────────────┐  ┌──────────────┐  │
│ │   🕐 2H      │  │   🚀 1H      │  │
│ │   2H - 4H    │  │   1H - 2H    │  │
│ │   [🟢 ON]   │  │   [🟢 ON]   │  │
│ └──────────────┘  └──────────────┘  │
│                                      │
│ ┌──────────────┐  ┌──────────────┐  │
│ │   📦 HUB     │  │   📍 HUB     │  │
│ │ Công Kênh    │  │ Theo điểm    │  │
│ │   [⚪ OFF]  │  │   [⚪ OFF]  │  │
│ └──────────────┘  └──────────────┘  │
│                                      │
│ 💡 Luôn bật tất cả dịch vụ bạn có   │
│    để tăng cơ hội nhận đơn hàng     │
└──────────────────────────────────────┘
```

**Service Cards:**

**1. Express (1H - 2H)** 🚀
- Giao nhanh trong 1-2 giờ
- Giá cao (+30% vs standard)
- Yêu cầu: Xe tốt, driver có kinh nghiệm
- Bonus: +20,000đ/đơn trong giờ cao điểm

**2. Standard (2H - 4H)** 🕐
- Giao tiêu chuẩn trong 2-4 giờ
- Giá standard
- Phổ biến nhất (70% orders)

**3. Economy (4H - 8H)** 💰
- Giao tiết kiệm trong 4-8 giờ
- Giá thấp (-20% vs standard)
- Phù hợp với đơn không gấp

**4. HUB Công Kênh** 📦
- Nhận hàng tại Hub trung tâm
- Bulk orders (10-50 đơn/lần)
- Phù hợp xe tải nhỏ

**5. HUB Theo điểm** 📍
- Hub phân tán theo khu vực
- Medium volume (5-20 đơn/lần)
- Phù hợp xe máy, xe 4 chỗ

**Vehicle Compatibility:**

| Vehicle | Express | Standard | Economy | Hub | Special |
|---------|---------|----------|---------|-----|---------|
| 🏍️ Xe máy | ✅ | ✅ | ✅ | ❌ | ❌ |
| 🚗 Xe 4 chỗ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 🚐 Xe 7 chỗ | ❌ | ✅ | ✅ | ✅ | ✅ |
| 🚚 Xe tải | ❌ | ❌ | ✅ | ✅ | ✅ |

**Recommendations:**
```
┌──────────────────────────────────────┐
│ 💡 Gợi ý cho bạn                     │
│                                      │
│ Bật dịch vụ "1H - 2H" để tăng        │
│ thu nhập thêm ~200,000đ/ngày         │
│                                      │
│ Nhu cầu cao trong khu vực của bạn:  │
│ • Giao đồ ăn: 🔥🔥🔥🔥 (Very High)    │
│ • Đặt xe: 🔥🔥🔥 (High)               │
│ • Mua sắm: 🔥🔥 (Medium)              │
│                         [Bật ngay]  │
└──────────────────────────────────────┘
```

---

## 5️⃣ Banner Thông báo

```
┌──────────────────────────────────────────┐
│ 👋 Luôn bật tất cả dịch vụ bạn có để     │
│    tăng cơ hội nhận đơn hàng             │
│                               [Đóng] [✓] │
└──────────────────────────────────────────┘
```

**Purpose:**
- Remind driver to enable all services
- Increase order volume
- Improve platform efficiency

**Behavior:**
- Show when driver has services disabled
- Dismissible (but show again after 7 days)
- Track: `bannerDismissedAt`, `bannerDismissCount`

---

## 🔄 Order Eligibility Check Flow

**Khi driver click "Nhận đơn", system check:**

```typescript
async function checkOrderEligibility(
  order: AvailableOrder,
  driver: DriverProfile,
  settings: OrderReceivingSettings
): Promise<OrderEligibilityCheck> {
  const checks = {
    isOnline: settings.isOnline,
    hasEnoughCash: checkCashRequirement(order, settings),
    serviceTypeEnabled: checkServiceEnabled(order, settings),
    withinMaxDistance: checkDistance(order, driver),
    meetsMinAmount: checkMinAmount(order, settings),
    vehicleTypeMatch: checkVehicleMatch(order, driver),
    hasRequiredDocuments: checkDocuments(driver),
    hasCapacity: checkCapacity(driver),
  };
  
  const isEligible = Object.values(checks).every(v => v === true);
  
  const reasons = [];
  if (!checks.hasEnoughCash) {
    reasons.push({
      type: 'ERROR',
      code: 'INSUFFICIENT_CASH',
      message: `Không đủ tiền ứng COD. Cần: ${order.codAmount}đ, Còn: ${settings.availableCash}đ`,
      solution: 'Nạp thêm tiền hoặc chọn đơn không COD'
    });
  }
  if (!checks.serviceTypeEnabled) {
    reasons.push({
      type: 'ERROR',
      code: 'SERVICE_DISABLED',
      message: `Dịch vụ "${order.serviceType}" chưa được bật`,
      solution: 'Vào Cài đặt → Dịch vụ của tôi → Bật dịch vụ này'
    });
  }
  // ... more checks
  
  return {
    orderId: order.orderId,
    driverId: driver.driverId,
    isEligible,
    reasons,
    checks,
    suggestions: generateSuggestions(checks, reasons)
  };
}
```

**Example Errors:**

**1. Insufficient Cash:**
```
❌ Không thể nhận đơn

Không đủ tiền ứng COD
Cần: 250,000đ
Còn: 180,000đ

[Nạp thêm tiền] [Chọn đơn khác]
```

**2. Service Disabled:**
```
❌ Không thể nhận đơn

Dịch vụ "Giao đồ ăn" chưa được bật

[Bật dịch vụ] [Đóng]
```

**3. Documents Expired:**
```
⚠️ Cảnh báo

GPLX của bạn sắp hết hạn (còn 15 ngày)
Vui lòng gia hạn để tiếp tục nhận đơn

[Cập nhật giấy tờ] [Nhắc tôi sau]
```

---

## 📊 Analytics & Tracking

**Track these metrics:**

```typescript
interface SettingsAnalytics {
  driverId: string;
  period: Date;
  
  // Cash management
  avgCashOnHand: number;
  totalCODReceived: number;
  totalCODPaid: number;
  cashTopUpCount: number;
  
  // Auto-accept
  autoAcceptEnabled: boolean;
  autoAcceptedOrders: number;
  autoAcceptCancelledOrders: number;
  autoAcceptSuccessRate: number; // %
  
  // Smart routing
  smartRoutingUsageCount: number;
  smartRoutingAcceptedOrders: number;
  smartRoutingAvgEarnings: number; // Per route
  smartRoutingEfficiency: number; // %
  
  // Batch orders
  batchOrdersEnabled: boolean;
  totalBatchOrders: number;
  avgOrdersPerBatch: number;
  batchOrderSuccessRate: number; // %
  
  // Services
  enabledServicesCount: number;
  totalServices: number;
  serviceUtilization: Record<ServiceType, number>; // % of orders by service
  
  // Impact on earnings
  earningsWithAutoAccept: number;
  earningsWithSmartRouting: number;
  earningsWithBatchOrders: number;
  totalEarningsImpact: number; // VND
  totalEarningsImpactPercent: number; // %
}
```

**Dashboard for Driver:**
```
┌──────────────────────────────────────┐
│ 📊 Hiệu quả Cài đặt nhận đơn         │
│                                      │
│ Tuần này:                            │
│ • Tự động nhận: 45 đơn (+15%)       │
│ • Điều hướng thông minh: 2 lần      │
│   → Thu nhập: +320,000đ             │
│ • Ghép đơn: 12 lần (36 đơn)         │
│   → Thu nhập: +450,000đ             │
│                                      │
│ Tổng tác động: +770,000đ (+18%)     │
│                                      │
│ 💡 Gợi ý: Bật "Hub Công Kênh" để    │
│    tăng thêm ~300,000đ/tuần         │
└──────────────────────────────────────┘
```

---

## 🔐 Security & Validation

### Cash Validation
- Driver không thể khai báo > 10,000,000đ (suspicious)
- Track unusual patterns (VD: nạp 1M, rút 1M ngay sau đó)
- Audit trail: All cash transactions logged

### Service Validation
- Cannot enable services not compatible with vehicle
- Warning if enabling services without required training

### Document Verification
- Auto-disable services when documents expire
- Send reminders 30 days before expiry
- Block order acceptance if critical docs expired (GPLX, TNDS)

---

## 🚀 Implementation Plan

### Phase 1: Core Settings (Week 1-2)
- ✅ Online/Offline toggle
- ✅ Cash on hand declaration
- ✅ Service selection (basic)
- ✅ Eligibility check (basic)

### Phase 2: Optimization Features (Week 3-4)
- ✅ Auto-accept orders
- ✅ Batch orders
- ✅ Hub delivery
- ✅ Partner orders

### Phase 3: Advanced (Week 5-6)
- ✅ Smart routing (AI-powered)
- ✅ Cash management (advanced)
- ✅ Service recommendations
- ✅ Analytics dashboard

### Phase 4: Refinement (Week 7-8)
- ✅ A/B testing (auto-accept criteria)
- ✅ Machine learning (personalized recommendations)
- ✅ Performance optimization
- ✅ User feedback integration

---

## 📝 API Endpoints

### 1. Get Settings
```
GET /api/driver/settings/order-receiving
Response: OrderReceivingSettings
```

### 2. Update Settings
```
PUT /api/driver/settings/order-receiving
Body: Partial<OrderReceivingSettings>
Response: OrderReceivingSettings
```

### 3. Update Cash
```
POST /api/driver/cash/declare
Body: { amount: number }
Response: DriverCashManagement
```

### 4. Check Eligibility
```
POST /api/driver/orders/{orderId}/check-eligibility
Response: OrderEligibilityCheck
```

### 5. Request Smart Routing
```
POST /api/driver/routing/smart-suggest
Body: { currentLocation: Location }
Response: SmartRoute
```

### 6. Get Service Recommendations
```
GET /api/driver/services/recommendations
Response: ServiceAvailabilityMatrix
```

---

## ✅ Summary

**Tính năng "Cài đặt nhận đơn" bao gồm:**

1. ✅ **Bật trực tuyến** - ON/OFF toggle
2. ✅ **Tiền mang theo** - Cash management for COD
3. ✅ **Tối ưu nhận đơn:**
   - Tự động nhận đơn (với tiêu chí)
   - Điều hướng thông minh (2 lần/ngày)
   - Ghép đơn (3-5 đơn)
   - Giao hàng công kênh
   - Đơn hàng Đối tác
4. ✅ **Dịch vụ của tôi:**
   - Time slots (1H-2H, 2H-4H, 4H-8H)
   - Service types (Food, Ride, Shopping, etc.)
   - Hub services
   - Special services
5. ✅ **Eligibility Check** - Đảm bảo driver đủ điều kiện
6. ✅ **Analytics** - Tracking impact on earnings

**Benefits:**
- 📈 Tăng thu nhập (+15-20%)
- ⚡ Tăng productivity (batch orders, smart routing)
- 🎯 Giảm cancellation rate (chỉ nhận đơn phù hợp)
- 🤖 Automation (tự động nhận, gợi ý)
- 📊 Data-driven decisions (analytics, recommendations)

**Ghi chú tham khảo:**
- UI/UX design (toggles, cards, banners)
- Cash management flow
- Service selection matrix
- Smart routing limits
- Driver education (banners, tooltips)

**Ready for implementation!** 🚀
