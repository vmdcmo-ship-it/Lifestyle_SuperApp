# Performance Optimization Guide

## Bundle Analyzer

Phân tích kích thước bundle để tối ưu tốc độ tải trang.

### Cách sử dụng

```bash
# Chạy bundle analyzer
npm run build:analyze

# Hoặc từ root monorepo
npm run build:analyze --workspace=apps/web
```

Sau khi build xong, trình duyệt sẽ tự động mở với:
- **Client bundle analysis**: http://localhost:8888
- **Server bundle analysis**: http://localhost:8889

### Mục tiêu tối ưu

| Metric | Target | Critical |
|--------|--------|----------|
| First Load JS | < 100 KB | < 200 KB |
| Total Bundle Size | < 250 KB | < 500 KB |
| Largest Package | < 50 KB | < 100 KB |

### Các thư viện nên tối ưu

1. **Icon Libraries**: Dùng tree-shaking, chỉ import icons cần dùng
2. **Moment.js**: Thay bằng date-fns (nhẹ hơn)
3. **Lodash**: Import specific functions, không import toàn bộ
4. **UI Libraries**: Dùng modular imports

### Ví dụ tối ưu imports

```typescript
// ❌ BAD - Import toàn bộ
import _ from 'lodash';
import * as Icons from 'lucide-react';

// ✅ GOOD - Import cụ thể
import { debounce } from 'lodash-es';
import { HomeIcon, UserIcon } from 'lucide-react';
```

## PageSpeed Insights

### Các tối ưu đã áp dụng

#### 1. Next.js Configuration
- ✅ Output: standalone (giảm deployment size)
- ✅ Compression: enabled (gzip/brotli)
- ✅ Image optimization: AVIF/WebP
- ✅ optimizePackageImports: cho các thư viện lớn

#### 2. Caching Headers
- ✅ Static assets: 1 year cache
- ✅ Images: immutable cache
- ✅ Next.js static files: max-age

#### 3. Security Headers
- ✅ X-Content-Type-Options
- ✅ X-Frame-Options
- ✅ Referrer-Policy
- ✅ Permissions-Policy

#### 4. Font Optimization
- ✅ Font preloading
- ✅ Display: swap (tránh FOIT)
- ✅ Subset: latin + vietnamese

#### 5. Analytics
- ✅ Strategy: afterInteractive
- ✅ Web Vitals tracking
- ✅ Non-blocking load

#### 6. Code Splitting
- ✅ Suspense boundaries
- ✅ Lazy loading below-the-fold content
- ✅ Dynamic imports cho non-critical components

## Testing Performance

### 1. Local Testing

```bash
# Build production
npm run build

# Start production server
npm run start

# Open Lighthouse in Chrome DevTools
# - Open Chrome DevTools (F12)
# - Tab "Lighthouse"
# - Category: Performance
# - Click "Analyze page load"
```

### 2. Online Testing

Các công cụ test PageSpeed:
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [GTmetrix](https://gtmetrix.com/)

### 3. Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5s - 4s | > 4s |
| **FID** (First Input Delay) | ≤ 100ms | 100ms - 300ms | > 300ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| **FCP** (First Contentful Paint) | ≤ 1.8s | 1.8s - 3s | > 3s |
| **TTFB** (Time to First Byte) | ≤ 0.8s | 0.8s - 1.8s | > 1.8s |

## Advanced Optimizations

### Khi nào nên áp dụng

Chỉ khi bundle size > 500KB hoặc PageSpeed score < 90:

1. **Code Splitting Routes**
   ```typescript
   // app/dashboard/page.tsx
   import dynamic from 'next/dynamic';
   
   const DashboardContent = dynamic(() => import('./DashboardContent'), {
     loading: () => <Skeleton />,
   });
   ```

2. **Module Federation** (nếu có nhiều apps)

3. **Service Worker** cho offline support

4. **CDN** cho static assets

5. **Image CDN** (Cloudinary, Imgix)

## Monitoring

### Real User Monitoring (RUM)

Các metrics được tự động track qua Google Analytics:
- Page load time
- Core Web Vitals (LCP, FID, CLS)
- Custom events

### Alerts

Thiết lập alerts khi:
- Bundle size tăng > 10%
- PageSpeed score giảm < 85
- Core Web Vitals vượt ngưỡng "Good"

## Checklist Trước Deploy

- [ ] Chạy `npm run build:analyze` và kiểm tra bundle size
- [ ] Test PageSpeed Insights score ≥ 90
- [ ] Kiểm tra Core Web Vitals trong "Good" range
- [ ] Verify images được optimize (AVIF/WebP)
- [ ] Test trên 3G network (Chrome DevTools Network throttling)
- [ ] Verify font preloading hoạt động
- [ ] Check không có unused CSS/JS

---

**Cập nhật lần cuối**: 2026-02-14  
**Performance Target**: PageSpeed Score ≥ 90
