# Kiến Trúc & Quy Tắc Clean Code - Lifestyle Super App

> **BẮT BUỘC**: Mọi AI/Developer phải đọc file này trước khi viết code.
>
> **Tham chiếu**: Xem thêm [Bản Hiến Pháp Chung](../HIEN_PHAP_LIFESTYLE_SUPERAPP.md) cho cấu trúc tổng thể, Web Admin, và các trung tâm quản trị.

---

## 1. Tech Stack (Bắt buộc tuân thủ)

### Backend
| Thành phần | Công nghệ | Phiên bản |
|------------|-----------|-----------|
| Runtime | Node.js | >= 20.0.0 LTS |
| Framework | NestJS | TypeScript |
| API | GraphQL (Apollo), REST, gRPC, WebSocket | - |
| Databases | PostgreSQL, Redis, MongoDB, Elasticsearch | PG 16, Redis 7, ES 8 |
| Message Queue | Apache Kafka, RabbitMQ | - |
| AI/ML Services | Python FastAPI, TensorFlow, PyTorch | - |

### Frontend
| Thành phần | Công nghệ | Phiên bản |
|------------|-----------|-----------|
| Mobile | React Native | 0.73+ |
| Web | Next.js | 14 (App Router) |
| State Management | Redux Toolkit, Zustand | - |
| UI Components | React Native Paper, Tailwind CSS, shadcn/ui | - |

### Shared & Packages
- **packages/shared**: Common business logic
- **packages/design-system**: UI components & theme
- **packages/api-client**: API client library
- **packages/types**: TypeScript types
- **packages/utils**: Utility functions
- **packages/validation**: Form validation schemas (Zod)
- **packages/constants**: App constants

### Infrastructure
- **Cloud**: AWS / Google Cloud / Azure
- **Container**: Docker + Kubernetes
- **CI/CD**: GitHub Actions, ArgoCD
- **Monitoring**: Prometheus, Grafana, Datadog, Sentry

---

## 2. Cấu Trúc Monorepo

```
Lifestyle_SuperApp/
├── services/           # Microservices (NestJS)
├── apps/               # Frontend: web, mobile-*, zalo-mini-app, desktop-ops
├── packages/           # Shared libraries (import @lifestyle/*)
├── backend/            # API Gateway, shared backend utilities
├── infrastructure/     # K8s, Terraform, Docker, CI/CD
└── docs/               # Documentation
```

### Nguyên tắc import
- Dùng **workspace packages** (`@lifestyle/shared`, `@lifestyle/types`, v.v.) thay vì duplicate code
- Không import trực tiếp giữa services (dùng API/events)

---

## 3. Clean Code - Quy Tắc Bắt Buộc

### 3.1 Đặt tên
- **Biến/Hàm**: `camelCase`
- **Class/Interface/Type**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **File**: `kebab-case` (vd: `user-profile.ts`)

### 3.2 Function
- Một hàm chỉ làm **một việc** (Single Responsibility)
- Tối đa **3–4 tham số**; nếu nhiều hơn dùng object
- Tránh side effects; prefer pure functions
- Đặt tên hàm động từ + danh từ: `getUserById`, `createOrder`

### 3.3 Class & Module
- Một class một trách nhiệm
- Các method public ngắn, dễ đọc
- Inject dependencies qua constructor (NestJS: `@Injectable()`)

### 3.4 Error Handling
- Luôn xử lý lỗi rõ ràng, không để `catch` trống
- Dùng custom Exception classes khi cần
- Log lỗi kèm context (requestId, userId, v.v.)

```typescript
// ❌ BAD
try { await fetchData(); } catch (e) {}

// ✅ GOOD
try {
  await fetchData();
} catch (e) {
  logger.error('Failed to fetch', { error: e, requestId });
  throw new DataFetchError('Unable to retrieve data', { cause: e });
}
```

### 3.5 TypeScript
- Bật **strict mode**
- Tránh `any`; dùng `unknown` khi cần
- Dùng types/interfaces từ `@lifestyle/types`

### 3.6 React/Next.js
- Functional components + hooks
- Tách logic vào custom hooks
- Colocate styles với components
- Dùng Server Components khi phù hợp (Next.js App Router)

### 3.7 Format & Lint
- **Prettier** cho format
- **ESLint** cho lint
- Chạy `npm run format` và `npm run lint` trước commit

---

## 4. Performance Targets

| Metric | Target | Critical |
|--------|--------|----------|
| API Response (P95) | < 200ms | < 500ms |
| Page Load (FCP) | < 2s | < 3s |
| DB Query (P95) | < 50ms | < 100ms |
| Uptime | 99.9% | 99.5% |

---

## 5. Security

- JWT authentication
- RBAC (Role-Based Access Control)
- API rate limiting
- Không hardcode secrets; dùng env vars

---

## 6. Checklist Trước Khi Viết Code

- [ ] Đã đọc README_ARCHITECTURE.md
- [ ] Tuân thủ tech stack được chỉ định
- [ ] Áp dụng Clean Code principles
- [ ] Import từ packages khi có sẵn
- [ ] Xử lý lỗi đầy đủ
- [ ] Chạy format + lint
