# Kiến Trúc & Quy Tắc Clean Code - Lifestyle Super App

> **BẮT BUỘC**: Mọi AI/Developer phải đọc file này trước khi viết code.
>
> **Tham chiếu**:
> - [Bản Hiến Pháp Chung](../HIEN_PHAP_LIFESTYLE_SUPERAPP.md) – cấu trúc tổng thể, KODO HQ, trung tâm quản trị
> - [Quy trình Triển khai Deploy](../QUY_TRINH_TRIEN_KHAI_DEPLOY.md) – **bắt buộc đọc** khi deploy lên VPS
> - [Kiến trúc hai tầng quản trị](../ADMIN_ARCHITECTURE_TWO_TIERS.md) – KODO HQ (full quyền) vs Micro-site Admin (delegated)
> - [Đặc tả triển khai timnhaxahoi.com (Satellite Web)](../timnhaxahoi/SPEC_TRIEN_KHAI.md) – Next.js + Nest trong monorepo, quiz/lead, Lark Base, SEO; **đọc trước khi code module này**
> - [Kế hoạch triển khai Tìm nhà trọ (`/timnhatro`)](../timnhaxahoi/KE_HOACH_TIM_NHA_TRO.md) – MVP B, giai đoạn R0–R10; tham chiếu §19.1a
> - [Kế hoạch AI Ops đa Bot (tham chiếu)](../KE_HOACH_AI_OPS_DA_BOT_THAM_CHIEU.md) – Lark, n8n, OpenClaw, Cursor, sandbox & phân quyền 3 bot
> - [Runbook Lark A.1 (AI Ops)](../AI_OPS_PHASE_A1_LARK_APP_RUNBOOK.md) – tạo 3 app, nhóm, Base, scopes
> - [Runbook n8n A.2 + Lark (AI Ops)](../AI_OPS_PHASE_A2_N8N_LARK_RUNBOOK.md) – HTTPS, 3 webhook, verify URL, ping
> - [n8n làm lại từ đầu (Docker + Lark verify)](../AI_OPS_N8N_LAM_LAI_TU_DAU.md) – xóa container/volume, env chuẩn, workflow một Webhook
> - [Sao lưu workflow n8n + bảng kê (Bước 1 AI Ops)](../ai-ops/n8n-workflow-exports/README.md)
> - [n8n Public API + curl (tự động hóa import/activate)](../ai-ops/N8N_API_VA_CURL.md)
>
> **Nguyên tắc quyền lực**: KODO HQ = chủ sở hữu nền tảng, full tính năng. Micro-site Admin = ủy quyền, scope giới hạn. Luôn triển khai KODO HQ trước, Micro-site Admin sau.

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

## 6. Quyền lực & Vai trò (Admin)

- **KODO HQ** = Chủ sở hữu nền tảng, **full** quyền lực.
- **Micro-site Admin** = Ủy quyền, **delegated** – phạm vi giới hạn (CLB của mình, trận được giao, v.v.).
- Khi thiết kế tính năng: KODO HQ full trước → Micro-site Admin delegate sau.
- **User segments**: Gán mã phân khúc (vd: `AGRI_FARM_HOUSEHOLD`) qua bảng `user_segments`; dùng "nông hộ" trên UI, tránh "nông dân". *Chi tiết: [HIEN_PHAP](../HIEN_PHAP_LIFESTYLE_SUPERAPP.md) mục 8.3, 9.7*
- *Chi tiết: [ADMIN_ARCHITECTURE_TWO_TIERS.md](../../docs/ADMIN_ARCHITECTURE_TWO_TIERS.md)*

---

## 7. Checklist Trước Khi Viết Code

- [ ] Đã đọc README_ARCHITECTURE.md
- [ ] **Trước khi deploy:** Đã đọc [QUY_TRINH_TRIEN_KHAI_DEPLOY.md](../QUY_TRINH_TRIEN_KHAI_DEPLOY.md) – 5 bước bắt buộc, tránh timeout, giảm build time
- [ ] Tuân thủ tech stack được chỉ định
- [ ] Áp dụng Clean Code principles
- [ ] Import từ packages khi có sẵn
- [ ] Xử lý lỗi đầy đủ
- [ ] Chạy format + lint
