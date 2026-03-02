# Loyalty & Savings Packages Guide

> Hướng dẫn chi tiết về hệ thống Lifestyle Xu và Gói Tiết Kiệm.

---

## 📋 Table of Contents

1. [Lifestyle Xu (Loyalty System)](#lifestyle-xu)
2. [Savings Packages](#savings-packages)
3. [Integration Guide](#integration-guide)
4. [API Endpoints](#api-endpoints)
5. [Usage Examples](#usage-examples)

---

## 🪙 Lifestyle Xu

### **Giới thiệu**

Lifestyle Xu là chương trình loyalty members giúp khách hàng tích điểm khi sử dụng dịch vụ và đổi xu lấy quà tặng, voucher.

### **Cách tích xu**

| Dịch vụ | Tỷ lệ tích xu |
|---------|---------------|
| 🍔 Giao đồ ăn | 1 xu / 10,000 VND |
| 🚗 Đặt xe | 1 xu / 10,000 VND |
| 🛍️ Mua sắm | 1 xu / 10,000 VND |
| 📦 Gói Tiết Kiệm | 1 xu / 10,000 VND |
| 👥 Giới thiệu bạn | 500 xu / bạn |

### **Hạng thành viên**

| Hạng | Xu tối thiểu | Lợi ích | Tỷ lệ tích xu |
|------|--------------|---------|---------------|
| 🥉 **Đồng** | 0 | Tích xu cơ bản | 100% |
| 🥈 **Bạc** | 1,000 | Giảm phí ship | 110% |
| 🥇 **Vàng** | 5,000 | Ưu tiên hỗ trợ | 120% |
| 💎 **Bạch Kim** | 10,000 | Quà sinh nhật | 130% |
| 💠 **Kim Cương** | 50,000 | VIP toàn diện | 150% |

### **Đổi xu**

**Danh mục đổi quà:**
- 🎟️ **Voucher**: Giảm giá dịch vụ
- 🎁 **Gift Card**: Thẻ quà tặng
- 💵 **Cashback**: Hoàn tiền
- 📦 **Sản phẩm**: Quà vật lý
- 🎭 **Trải nghiệm**: Tour, sự kiện

**Ví dụ:**
```typescript
// Voucher giảm 50K giao đồ ăn
{
  name: "Voucher giảm 50K",
  coinCost: 500,  // 500 xu
  cashValue: 50000,
  category: RedemptionCategory.VOUCHER
}
```

---

## 💰 Savings Packages (Gói Tiết Kiệm)

### **Các loại gói**

#### 1. **Combo Package** 🎁
Nhiều dịch vụ trong 1 gói với giá ưu đãi.

**Ví dụ:**
```typescript
{
  name: "Combo Tiết Kiệm",
  type: SavingsPackageType.COMBO,
  price: { amount: 299000 },
  originalValue: { amount: 500000 },
  discountPercentage: 40,
  items: [
    { type: 'FOOD_VOUCHER', quantity: 5, value: 50000 },
    { type: 'RIDE_VOUCHER', quantity: 10, value: 30000 },
    { type: 'SHOPPING_VOUCHER', quantity: 3, value: 100000 }
  ]
}
```

#### 2. **Subscription Package** 🔄
Gói đăng ký định kỳ tự động gia hạn.

**Ví dụ:**
```typescript
{
  name: "Gói Hàng Tháng Premium",
  type: SavingsPackageType.SUBSCRIPTION,
  subscriptionPeriod: SubscriptionPeriod.MONTHLY,
  autoRenewal: true,
  price: { amount: 199000 },
  usageDays: 30
}
```

#### 3. **Prepaid Package** 💳
Nạp trước, dùng sau với giá tốt hơn.

#### 4. **Bundle Package** 📦
Gói sản phẩm tổng hợp.

### **Lợi ích**

✅ **Tiết kiệm**: Giảm đến 50% so với giá thường
✅ **Tiện lợi**: Không lo hết voucher
✅ **Ưu đãi**: Tích xu nhiều hơn
✅ **Linh hoạt**: Hủy bất cứ lúc nào

---

## 🔧 Integration Guide

### **1. Cài đặt Types**

```typescript
import type {
  UserCoinBalance,
  CoinTransaction,
  SavingsPackage,
  UserPackageSubscription,
} from '@lifestyle/types';
```

### **2. Sử dụng Hooks**

#### Coins
```typescript
'use client';

import { useCoinBalance, useCoinTransactions } from '@/lib/hooks';

function CoinsPage() {
  const { balance, isLoading } = useCoinBalance();
  const { transactions } = useCoinTransactions({ limit: 10 });
  
  return (
    <div>
      <h1>{balance?.totalCoins} Xu</h1>
      {/* ... */}
    </div>
  );
}
```

#### Savings Packages
```typescript
'use client';

import { useFeaturedPackages } from '@/lib/hooks';

function PackagesPage() {
  const { packages, isLoading } = useFeaturedPackages(10);
  
  return (
    <div>
      {packages.map(pkg => (
        <PackageCard key={pkg.id} package={pkg} />
      ))}
    </div>
  );
}
```

### **3. Sử dụng Services**

#### Server Components
```typescript
import { getUserCoinBalance, getSavingsPackages } from '@/lib/services';

async function ServerPage() {
  const balance = await getUserCoinBalance();
  const { data: packages } = await getSavingsPackages();
  
  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

---

## 🌐 API Endpoints

### **Loyalty Endpoints**

```typescript
GET  /loyalty/balance                    // User coin balance
GET  /loyalty/transactions               // Transaction history
GET  /loyalty/history/summary            // Summary by period
GET  /loyalty/redemption-items           // Items to redeem
POST /loyalty/redeem                     // Redeem item
GET  /loyalty/my-redemptions             // User redemptions
GET  /loyalty/tier-benefits              // Tier benefits info
GET  /loyalty/referral-code              // User referral code
```

### **Savings Packages Endpoints**

```typescript
GET  /savings/packages                   // All packages
GET  /savings/packages/:id               // Package by ID
GET  /savings/packages/featured          // Featured packages
GET  /savings/packages/popular           // Popular packages
GET  /savings/categories                 // Package categories
POST /savings/purchase                   // Purchase package
GET  /savings/my-subscriptions           // User subscriptions
POST /savings/subscriptions/:id/cancel   // Cancel subscription
PATCH /savings/subscriptions/:id/auto-renewal  // Toggle auto renewal
```

---

## 💡 Usage Examples

### **Example 1: Display Coin Balance**

```typescript
'use client';

import { useCoinBalance } from '@/lib/hooks';

export function CoinWidget() {
  const { balance, isLoading } = useCoinBalance();
  
  if (isLoading) return <Skeleton />;
  
  return (
    <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2">
      <CoinIcon />
      <span className="font-bold text-amber-700">
        {balance?.totalCoins.toLocaleString('vi-VN')} Xu
      </span>
    </div>
  );
}
```

### **Example 2: Redeem Item**

```typescript
import { redeemItem } from '@/lib/services';

async function handleRedeem(itemId: string) {
  try {
    const redemption = await redeemItem(itemId);
    toast.success(`Đổi quà thành công! Mã: ${redemption.voucherCode}`);
  } catch (error) {
    toast.error('Không đủ xu hoặc quà đã hết');
  }
}
```

### **Example 3: Purchase Package**

```typescript
import { purchasePackage } from '@/lib/services';

async function handlePurchase(packageId: string) {
  try {
    const subscription = await purchasePackage(packageId, 'LIFESTYLE_BALANCE');
    toast.success('Đăng ký gói thành công!');
    router.push('/savings-packages/my-subscriptions');
  } catch (error) {
    toast.error('Thanh toán thất bại');
  }
}
```

### **Example 4: Track Coin Transactions**

```typescript
'use client';

import { useCoinTransactions } from '@/lib/hooks';
import { CoinTransactionType } from '@lifestyle/types';

export function TransactionHistory() {
  const { transactions, isLoading } = useCoinTransactions({
    page: 1,
    limit: 20,
  });
  
  return (
    <div>
      {transactions.map(tx => (
        <div key={tx.id}>
          <span>{tx.description}</span>
          <span className={tx.type === CoinTransactionType.EARN ? 'text-green-600' : 'text-red-600'}>
            {tx.type === CoinTransactionType.EARN ? '+' : '-'}
            {Math.abs(tx.amount)} Xu
          </span>
        </div>
      ))}
    </div>
  );
}
```

---

## 🎨 UI Components

### **Coin Icon**

```typescript
function CoinIcon() {
  return (
    <svg className="h-5 w-5 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" className="fill-amber-400" />
      <circle cx="12" cy="12" r="8" className="fill-amber-500" />
      <path d="M12 6v12M8 9h8M8 15h8" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
```

### **Tier Badge**

```typescript
function TierBadge({ tier }: { tier: MembershipTier }) {
  const colors = {
    BRONZE: 'bg-amber-700 text-white',
    SILVER: 'bg-slate-500 text-white',
    GOLD: 'bg-yellow-500 text-white',
    PLATINUM: 'bg-gray-400 text-white',
    DIAMOND: 'bg-cyan-500 text-white',
  };
  
  return (
    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${colors[tier]}`}>
      ⭐ {tier}
    </span>
  );
}
```

---

## 🚀 Best Practices

### **1. Error Handling**

```typescript
try {
  const balance = await getUserCoinBalance();
} catch (error) {
  if (error.code === 'UNAUTHORIZED') {
    router.push('/login');
  } else {
    toast.error('Không thể tải số dư xu');
  }
}
```

### **2. Loading States**

```typescript
{isLoading ? (
  <Skeleton className="h-20 w-full" />
) : (
  <CoinBalance balance={balance} />
)}
```

### **3. Optimistic Updates**

```typescript
// Update UI immediately, then sync with server
const optimisticBalance = balance - itemCost;
setLocalBalance(optimisticBalance);

try {
  await redeemItem(itemId);
} catch (error) {
  setLocalBalance(balance); // Rollback on error
}
```

### **4. Caching**

```typescript
// Cache balance for 5 minutes
const { balance } = useCoinBalance();
// Auto-refresh on tab focus
// Auto-refetch on interval
```

---

## 📊 Analytics Events

Track important events for analytics:

```typescript
// Coin earned
analytics.track('coin_earned', {
  amount: 100,
  source: 'food_delivery',
  orderId: 'ORDER123',
});

// Coin redeemed
analytics.track('coin_redeemed', {
  itemId: 'ITEM123',
  coinCost: 500,
  itemName: 'Voucher 50K',
});

// Package purchased
analytics.track('package_purchased', {
  packageId: 'PKG123',
  price: 299000,
  type: 'COMBO',
});
```

---

## 🔐 Security Notes

1. **Validate on Backend**: Always validate coin balance and transactions on server
2. **Rate Limiting**: Limit redemption requests to prevent abuse
3. **Audit Trail**: Log all coin transactions for auditing
4. **Fraud Detection**: Monitor unusual patterns

---

## 📱 Mobile Support

UI components are fully responsive:
- Desktop: Full widget display
- Mobile: Compact view in header
- Mobile menu: Full coin info

---

## 🆘 Troubleshooting

### Issue: Coin balance not updating
**Solution**: Check auth token and refetch balance

### Issue: Redemption fails
**Solution**: Verify sufficient balance and item availability

### Issue: Package not activating
**Solution**: Check payment status and retry activation

---

**Documentation Version**: 1.0.0
**Last Updated**: 2026-02-14
