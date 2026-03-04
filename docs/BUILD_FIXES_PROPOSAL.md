# Đề Xuất Xử Lý Lỗi Build

> **Lỗi hiện tại**: `opengraph-image` (Invalid URL) và xung đột `export *` trong `@lifestyle/types`
>
> **Đã triển khai (2026-03-03)**: Fix đã áp dụng; build web qua thành công.

---

## Đã triển khai

### 1. opengraph-image
- **Đã làm**: Đổi tên `opengraph-image.tsx` → `opengraph-image.tsx.disabled` để tắt dynamic generation (lỗi @vercel/og trên Windows)
- **Fallback**: Layout dùng `images: [{ url: '/og-image.png' }]` trong metadata. Thêm file `public/og-image.png` (1200×630) khi cần ảnh share mạng xã hội

### 2. @lifestyle/types
- **Đã làm**: Chỉ export từ các module không xung đột: common, user, api, food-delivery, ride-hailing, shopping, referral, loyalty, savings-package, location-feedback, spotlight, run-to-earn
- **Đã bỏ khỏi barrel chính**: driver, driver-app, pricing, revenue, accounting, merchant, insurance, v.v.
- **Subpath**: Import `@lifestyle/types/driver-app`, `@lifestyle/types/pricing`, ... khi backend/mobile cần

### 3. Consumer
- **Không cần sửa**: apps/web và packages/api-client dùng đúng các module còn export → không cần thay đổi import

---

## 1. opengraph-image – Invalid URL

### Nguyên nhân
- Lỗi xảy ra trong `@vercel/og` khi build, liên quan `fileURLToPath` / `Invalid URL`
- Thường do font hoặc tài nguyên được load với đường dẫn tương đối / không hợp lệ trên Windows

### Giải pháp (3 mức)

#### 1.1 Quick fix – Tạm dùng static OG image
- Đổi `opengraph-image.tsx` sang dùng file ảnh tĩnh thay vì dynamic generation
- Hoặc tạm vô hiệu hóa: đổi tên `opengraph-image.tsx` → `opengraph-image.tsx.bak`

#### 1.2 Medium fix – Đổi runtime
Thử dùng Edge runtime thay cho Node.js:

```ts
// opengraph-image.tsx - bỏ dòng runtime = 'nodejs'
export const runtime = 'edge'; // hoặc bỏ hẳn (default là edge)
```

#### 1.3 Proper fix
- Đảm bảo `metadataBase` trong layout có URL tuyệt đối hợp lệ
- Nếu có font/ảnh: dùng URL public (`https://...`) thay vì `file://` hoặc đường dẫn tương đối
- Nếu cần Node.js runtime: kiểm tra lại `outputFileTracingRoot` (có thể gây lỗi trên Windows với standalone build)

---

## 2. @lifestyle/types – Xung đột Export

### Nguyên nhân
Nhiều file cùng `export *` các tên trùng nhau:

| Tên          | File xung đột                                       |
|-------------|------------------------------------------------------|
| VehicleType | driver, ride-hailing, pricing, backend-api           |
| ServiceType | loyalty, driver-app, pricing, revenue                |
| MembershipTier | loyalty, driver-app                             |
| OrderStatus | driver-app, merchant, backend-api                    |
| TransactionType | driver-app, accounting                          |
| PaymentMethod | driver-app, insurance-products                  |
| SubscriptionPeriod | savings-package, revenue                       |
| PromotionStatus/Type | pricing, merchant                            |
| ReminderFrequency | insurance, social-insurance                   |

Một số enum khác giá trị giữa các domain (ví dụ: `MembershipTier` của user Loyalty vs tài xế Driver).

### Giải pháp (3 mức)

#### 2.1 Quick fix – Export chọn lọc trong index (khuyến nghị)

Thay `export *` bằng export rõ ràng, mỗi tên chỉ xuất từ một nguồn. Với tên trùng, chọn nguồn phù hợp với app web (loyalty, shopping, ride-hailing):

```ts
// packages/types/src/index.ts

// Không dùng export * cho mọi file
export * from './common';
export * from './user';
export * from './api';
export * from './referral';
export * from './spotlight';
export * from './run-to-earn';
export * from './location-feedback';
export * from './food-delivery';
export * from './shopping';

// Module có xung đột - export từng phần, TRÁNH trùng tên
export {
  DriverProfile,
  DriverStatus,
  VehicleType as DriverVehicleType,  // Alias
} from './driver';

export {
  VehicleType,  // Giữ làm mặc định cho ride-hailing (dùng nhiều trên web)
  Vehicle,
  // ... các type khác
} from './ride-hailing';

export {
  CoinTransactionType,
  MembershipTier as LoyaltyMembershipTier,
  ServiceType as LoyaltyServiceType,
  // ...
} from './loyalty';

export {
  OrderStatus as DriverOrderStatus,
  ServiceType as DriverServiceType,
  MembershipTier as DriverMembershipTier,
  TransactionType as DriverTransactionType,
  PaymentMethod as DriverPaymentMethod,
  // ...
} from './driver-app';

// Tương tự cho pricing, revenue, accounting, merchant, insurance...
```

Sau đó cập nhật consumer:

```ts
// apps/web/app/coins/coins-content.tsx
import { CoinTransactionType, LoyaltyMembershipTier } from '@lifestyle/types';
// Hoặc giữ tên cũ nếu export MembershipTier từ loyalty làm mặc định:
import { CoinTransactionType, MembershipTier } from '@lifestyle/types';
```

Ưu điểm: sửa ít file, build qua. Nhược: consumer phải chọn đúng tên (MembershipTier vs DriverMembershipTier).

#### 2.2 Subpath exports – Import theo domain

Thêm vào `packages/types/package.json`:

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./loyalty": "./src/loyalty.ts",
    "./driver-app": "./src/driver-app.ts",
    "./ride-hailing": "./src/ride-hailing.ts"
  }
}
```

Dùng: `import { MembershipTier } from '@lifestyle/types/loyalty'`

Ưu điểm: rõ ràng theo domain. Nhược: phải đổi nhiều import.

#### 2.3 Long-term – Chuẩn hóa shared enums

- Tạo `packages/types/src/shared-enums.ts` với các enum dùng chung
- Các file domain import từ đây thay vì định nghĩa lại
- Đòi hỏi refactor lớn và xác định bản enum “chuẩn” cho từng use case

---

## 3. outputFileTracingRoot

Next.js 14.2 báo `Unrecognized key`. Có thể bỏ tạm nếu không dùng `output: 'standalone'`, hoặc giữ nếu cần cho monorepo và chỉ chấp nhận warning.

---

## 4. Thứ tự thực hiện đề xuất

1. **opengraph-image**: Thử (1.2) → nếu vẫn lỗi dùng (1.1).
2. **@lifestyle/types**: Thực hiện (2.1) với các bước:
   - Tạo index mới với export chọn lọc
   - Sửa các import trong apps/web (coins, referral, savings-packages, home-sections, v.v.)
   - Chạy build và xử lý các lỗi còn lại

Sau khi áp dụng, build nên pass. Nếu muốn, tôi có thể hỗ trợ viết cụ thể diff cho từng file.
