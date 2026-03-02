# 📊 Lifestyle Super App - Cấu Trúc Dự Án Hoàn Chỉnh

## Tổng Quan Kiến Trúc

Dự án được xây dựng theo kiến trúc **Microservices** với **Monorepo Pattern**, sử dụng Turborepo để quản lý các workspace.

---

## 🌳 Cây Thư Mục Đầy Đủ

```
Lifestyle_SuperApp/
│
├── 📦 services/                          # Backend Microservices (NestJS)
│   ├── user-service/                     # Quản lý người dùng & xác thực
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/                # Authentication
│   │   │   │   ├── profile/             # User profile
│   │   │   │   ├── verification/        # Xác minh danh tính
│   │   │   │   └── risk-profile/        # Hồ sơ rủi ro (cho bảo hiểm)
│   │   │   ├── common/
│   │   │   │   ├── decorators/
│   │   │   │   ├── guards/
│   │   │   │   ├── interceptors/
│   │   │   │   ├── pipes/
│   │   │   │   └── filters/
│   │   │   ├── config/
│   │   │   ├── main.ts
│   │   │   └── app.module.ts
│   │   ├── test/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env.example
│   │
│   ├── transportation-service/           # Dịch vụ vận tải
│   │   ├── src/
│   │   │   └── modules/
│   │   │       ├── ride/                # Quản lý chuyến đi
│   │   │       ├── matching/            # Thuật toán ghép đôi
│   │   │       ├── pricing/             # Định giá động
│   │   │       ├── delivery/            # Giao hàng
│   │   │       └── marketplace/         # Thị trường franchise
│   │   └── ...
│   │
│   ├── insurance-service/                # Dịch vụ bảo hiểm
│   │   ├── src/
│   │   │   └── modules/
│   │   │       ├── products/            # Sản phẩm bảo hiểm
│   │   │       ├── policies/            # Quản lý hợp đồng
│   │   │       ├── claims/              # Bồi thường
│   │   │       └── ai-advisory/         # Tư vấn AI
│   │   └── ...
│   │
│   ├── payment-service/                  # Dịch vụ thanh toán
│   │   ├── src/
│   │   │   └── modules/
│   │   │       ├── wallet/              # Ví Lifestyle (nạp tiền, số dư)
│   │   │       ├── transactions/        # Giao dịch
│   │   │       └── gateways/            # Cổng thanh toán
│   │   └── ...
│   │
│   ├── ai-service/                       # Dịch vụ AI/ML (Python)
│   │   ├── src/
│   │   │   └── modules/
│   │   │       ├── chatbot/             # Chatbot hỗ trợ
│   │   │       ├── recommendation/      # Gợi ý cá nhân hóa
│   │   │       ├── risk-scoring/        # Đánh giá rủi ro
│   │   │       └── personalization/     # Phân tích hành vi
│   │   ├── models/                      # ML models
│   │   └── training/                    # Training scripts
│   │
│   ├── notification-service/             # Thông báo
│   ├── loyalty-service/                  # Chương trình khách hàng thân thiết
│   ├── analytics-service/                # Phân tích dữ liệu
│   ├── travel-service/                   # Đặt vé (hotel, flight, bus)
│   └── utility-service/                  # Tìm kiếm tiện ích địa phương
│
├── 📱 apps/                              # Frontend Applications
│   ├── mobile-user/                      # App người dùng (React Native)
│   │   ├── src/
│   │   │   ├── navigation/              # Điều hướng
│   │   │   ├── screens/
│   │   │   │   ├── auth/                # Đăng nhập/Đăng ký
│   │   │   │   ├── ride/                # Đặt xe
│   │   │   │   ├── insurance/           # Bảo hiểm
│   │   │   │   ├── profile/             # Hồ sơ
│   │   │   │   ├── travel/              # Du lịch
│   │   │   │   └── loyalty/             # Điểm thưởng
│   │   │   ├── components/
│   │   │   │   ├── common/              # Components chung
│   │   │   │   ├── ride/
│   │   │   │   ├── maps/
│   │   │   │   └── insurance/
│   │   │   ├── store/                   # Redux store
│   │   │   │   ├── slices/
│   │   │   │   └── api/                 # RTK Query
│   │   │   ├── services/                # Business logic
│   │   │   ├── hooks/                   # Custom hooks
│   │   │   ├── theme/                   # Theme & styling
│   │   │   └── assets/                  # Images, fonts, icons
│   │   ├── android/
│   │   ├── ios/
│   │   └── package.json
│   │
│   ├── mobile-driver/                    # App tài xế (React Native)
│   ├── mobile-merchant/                  # App merchant (React Native)
│   │
│   ├── web/                              # Web App (Next.js 14)
│   │   ├── app/                         # App Router
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (main)/
│   │   │   │   ├── page.tsx             # Homepage
│   │   │   │   ├── rides/
│   │   │   │   ├── insurance/
│   │   │   │   ├── profile/
│   │   │   │   └── travel/
│   │   │   ├── api/                     # API routes
│   │   │   ├── layout.tsx
│   │   │   └── providers.tsx
│   │   ├── components/
│   │   │   ├── ui/                      # shadcn/ui
│   │   │   ├── features/
│   │   │   │   ├── ride/
│   │   │   │   ├── insurance/
│   │   │   │   └── loyalty/
│   │   │   └── layout/
│   │   ├── lib/                         # Utilities
│   │   ├── hooks/                       # Custom hooks
│   │   ├── store/                       # Zustand stores
│   │   ├── public/                      # Static assets
│   │   ├── styles/
│   │   └── package.json
│   │
│   ├── zalo-mini-app/                    # Zalo Mini App
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── index/
│   │   │   │   ├── ride/
│   │   │   │   └── insurance/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   └── app.json
│   │
│   └── desktop-ops/                      # Dashboard vận hành (Electron)
│
├── 📚 packages/                          # Shared Libraries
│   ├── shared/                          # Business logic chung
│   │   └── src/
│   ├── design-system/                   # UI components & theme
│   │   └── src/
│   ├── api-client/                      # API client library
│   │   └── src/
│   ├── types/                           # TypeScript types
│   │   └── src/
│   ├── utils/                           # Utility functions
│   │   └── src/
│   ├── validation/                      # Validation schemas
│   │   └── src/
│   └── constants/                       # Constants
│
├── 🔧 backend/                           # Backend Infrastructure
│   ├── api-gateway/                     # API Gateway
│   │   └── src/
│   │       ├── config/
│   │       ├── middleware/
│   │       └── routes/
│   ├── shared/                          # Backend shared utilities
│   │   ├── dto/
│   │   ├── interfaces/
│   │   ├── enums/
│   │   └── utils/
│   └── database/
│       ├── migrations/                  # Database migrations
│       ├── seeds/                       # Seed data
│       └── schemas/                     # SQL schemas
│
├── 🚀 infrastructure/                    # DevOps & Deployment
│   ├── kubernetes/                      # K8s manifests
│   │   ├── base/
│   │   ├── overlays/
│   │   │   ├── dev/
│   │   │   ├── staging/
│   │   │   └── production/
│   │   └── services/
│   ├── terraform/                       # Infrastructure as Code
│   │   ├── modules/
│   │   │   ├── vpc/
│   │   │   ├── eks/
│   │   │   ├── rds/
│   │   │   └── redis/
│   │   └── environments/
│   │       ├── dev/
│   │       ├── staging/
│   │       └── production/
│   ├── docker/                          # Dockerfiles
│   ├── ci-cd/                           # CI/CD pipelines
│   │   ├── github-actions/
│   │   └── argocd/
│   ├── monitoring/                      # Monitoring configs
│   │   ├── prometheus.yml
│   │   └── grafana/
│   └── scripts/                         # Utility scripts
│
├── 📖 docs/                              # Documentation
│   ├── architecture/                    # Kiến trúc hệ thống
│   ├── api/                             # API documentation
│   ├── deployment/                      # Hướng dẫn triển khai
│   ├── guides/                          # Development guides
│   ├── diagrams/                        # System diagrams
│   ├── PROJECT_STRUCTURE.md
│   └── QUICK_START.md
│
├── .github/                             # GitHub configs
│   └── workflows/                       # GitHub Actions
│
├── .vscode/                             # VSCode settings
│   ├── settings.json
│   └── extensions.json
│
├── 📄 Root Files
├── package.json                         # Monorepo root package
├── turbo.json                           # Turborepo config
├── docker-compose.yml                   # Docker services
├── .env.example                         # Environment variables template
├── .gitignore                           # Git ignore rules
├── .prettierrc                          # Prettier config
├── .eslintrc.js                         # ESLint config
├── README.md                            # Main documentation
└── STRUCTURE_SUMMARY.md                 # This file
```

---

## 📊 Thống Kê Dự Án

### Microservices (10 services)
1. **user-service** - Quản lý người dùng
2. **transportation-service** - Vận tải
3. **insurance-service** - Bảo hiểm
4. **payment-service** - Thanh toán
5. **ai-service** - AI/ML
6. **notification-service** - Thông báo
7. **loyalty-service** - Khách hàng thân thiết
8. **analytics-service** - Phân tích
9. **travel-service** - Du lịch
10. **utility-service** - Tiện ích

### Frontend Apps (6 apps)
1. **mobile-user** - React Native (iOS/Android)
2. **mobile-driver** - React Native (iOS/Android)
3. **mobile-merchant** - React Native (iOS/Android)
4. **web** - Next.js 14
5. **zalo-mini-app** - Zalo SDK
6. **desktop-ops** - Electron

### Shared Packages (7 packages)
1. **shared** - Business logic chung
2. **design-system** - UI components
3. **api-client** - API client
4. **types** - TypeScript types
5. **utils** - Utilities
6. **validation** - Validation
7. **constants** - Constants

---

## 🛠️ Tech Stack Chi Tiết

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: NestJS (TypeScript)
- **APIs**:
  - GraphQL (Apollo Server)
  - REST (Express/Fastify)
  - gRPC (Proto3)
  - WebSocket (Socket.io)

### Databases
- **PostgreSQL 16** - Primary database (ACID)
- **Redis 7** - Cache, session, queue
- **MongoDB** - Logs, flexible data
- **Elasticsearch 8** - Full-text search
- **TimescaleDB** - Time-series analytics

### Message Queue
- **Apache Kafka** - Event streaming
- **RabbitMQ** - Task queue

### Frontend
- **Mobile**: React Native 0.73+
- **Web**: Next.js 14 (App Router)
- **State**: Redux Toolkit, Zustand
- **UI**: React Native Paper, Tailwind CSS, shadcn/ui

### AI/ML
- **Python**: FastAPI
- **Frameworks**: TensorFlow, PyTorch
- **Vector DB**: Pinecone, Weaviate

### Infrastructure
- **Container**: Docker, Kubernetes
- **Cloud**: AWS / GCP / Azure
- **IaC**: Terraform
- **CI/CD**: GitHub Actions, ArgoCD
- **Monitoring**: Prometheus, Grafana, Datadog, Sentry

---

## 🎯 Dịch Vụ Chính

### 🚗 Transportation Services
- Bike ride (marketplace model)
- Car ride (solo & carpool)
- Delivery (food, grocery, parcel)
- Dynamic pricing & surge
- AI-powered matching

### 🛡️ Insurance Services
- Vehicle liability insurance
- Social insurance
- Life insurance
- AI advisory 24/7
- Digital claims (eClaim)

### 🏖️ Travel & Dining
- Hotel booking
- Flight booking
- Bus & movie tickets
- Food delivery
- Review & rewards

### 📍 Local Utilities
- Gas stations
- EV charging
- Pharmacy
- Salons & car repair
- Coffee shops

### 🏃 Community Engagement
- Run-to-Earn (VRace inspired)
- Content creation & monetization
- Unified loyalty points
- Leaderboards & competitions

---

## 🚀 Lệnh Chính

### Development
```bash
npm install                # Install dependencies
npm run dev                # Start all services
npm run dev:services       # Start backend only
npm run dev:web            # Start web app
npm run dev:mobile         # Start mobile app
```

### Infrastructure
```bash
npm run docker:up          # Start infrastructure
npm run docker:down        # Stop infrastructure
npm run docker:logs        # View logs
```

### Testing & Quality
```bash
npm test                   # Run tests
npm run lint               # Lint code
npm run format             # Format code
npm run build              # Build all projects
```

---

## 📝 Tài Liệu

1. **[README.md](../README.md)** - Tổng quan dự án
2. **[QUICK_START.md](./QUICK_START.md)** - Hướng dẫn bắt đầu nhanh
3. **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Chi tiết cấu trúc dự án
4. **[Architecture Document](../../../Downloads/README_ARCHITECTURE.md)** - Kiến trúc đầy đủ

---

## 🎓 Quy Ước

### Naming Conventions
- **Services**: `kebab-case` (user-service, transportation-service)
- **Components**: `PascalCase` (UserProfile, RideCard)
- **Files**: `kebab-case.extension` (user.service.ts, ride.controller.ts)
- **Variables**: `camelCase` (userId, isActive)
- **Constants**: `UPPER_SNAKE_CASE` (API_URL, MAX_RETRIES)

### Git Workflow
- **Feature**: `feature/feature-name`
- **Bugfix**: `bugfix/bug-description`
- **Hotfix**: `hotfix/issue-number`

### Commit Messages
```
feat: Add user authentication
fix: Resolve payment gateway timeout
docs: Update API documentation
refactor: Optimize ride matching algorithm
test: Add unit tests for insurance service
```

---

## 📞 Liên Hệ & Hỗ Trợ

- **Email**: dev-support@superapp.vn
- **Slack**: #dev-help
- **Documentation**: [docs/](./index.md)
- **Issues**: GitHub Issues

---

**Phiên bản**: 1.0.0
**Ngày cập nhật**: 2026-02-14
**Tạo bởi**: Cursor AI + Architecture Team

---

🎉 **Chúc bạn code vui vẻ!**
