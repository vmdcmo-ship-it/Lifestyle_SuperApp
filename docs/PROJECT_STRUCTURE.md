# 📁 Project Structure Documentation

## Overview

This document provides a detailed explanation of the Lifestyle Super App project structure, following microservices architecture and monorepo pattern.

## Root Directory Structure

```
Lifestyle_SuperApp/
├── services/                    # Backend microservices
├── apps/                        # Frontend applications
├── packages/                    # Shared libraries
├── backend/                     # Backend infrastructure
├── infrastructure/              # DevOps & deployment
├── docs/                        # Documentation
├── .github/                     # GitHub workflows
├── .vscode/                     # VSCode settings
├── package.json                 # Root package file
├── turbo.json                   # Turborepo configuration
├── docker-compose.yml           # Docker services
└── README.md                    # Main documentation
```

---

## 1. Services (Backend Microservices)

### services/user-service/
**Purpose**: User management, authentication, and authorization
```
src/
├── modules/
│   ├── auth/               # Authentication logic (JWT, OAuth)
│   ├── profile/            # User profile management
│   ├── verification/       # Phone/email/identity verification
│   └── risk-profile/       # Risk assessment for insurance
├── common/
│   ├── decorators/         # Custom decorators
│   ├── guards/             # Auth guards
│   ├── interceptors/       # Request/response interceptors
│   ├── pipes/              # Validation pipes
│   └── filters/            # Exception filters
├── config/                 # Configuration files
└── main.ts                 # Application entry point
```

### services/transportation-service/
**Purpose**: Ride-hailing, delivery, and matching algorithms
```
src/
├── modules/
│   ├── ride/               # Ride request & management
│   ├── matching/           # Driver-customer matching algorithm
│   ├── pricing/            # Dynamic pricing engine
│   ├── delivery/           # Delivery order management
│   └── marketplace/        # Franchise marketplace
```

### services/insurance-service/
**Purpose**: Insurance products, policies, and claims management
```
src/
├── modules/
│   ├── products/           # Insurance product catalog
│   ├── policies/           # Policy management
│   ├── claims/             # Claims processing
│   └── ai-advisory/        # AI-powered insurance advisory
```

### services/payment-service/
**Purpose**: Lifestyle Wallet and payment processing
```
src/
├── modules/
│   ├── wallet/             # Lifestyle Wallet (top-up, balance, payments)
│   ├── transactions/       # Transaction history & processing
│   └── gateways/           # Payment gateway integrations
```

### services/ai-service/
**Purpose**: AI/ML services (Python-based)
```
src/
├── modules/
│   ├── chatbot/            # Customer support chatbot
│   ├── recommendation/     # Personalized recommendations
│   ├── risk-scoring/       # Risk assessment models
│   └── personalization/    # User behavior analysis
models/                     # Trained ML models
training/                   # Training scripts
```

### Other Services
- **notification-service**: Push notifications, SMS, Email
- **loyalty-service**: Loyalty points, rewards, run-to-earn
- **analytics-service**: Data analytics and reporting
- **travel-service**: Travel bookings (hotel, flight, bus)
- **utility-service**: Local utilities finder

---

## 2. Apps (Frontend Applications)

### apps/mobile-user/ (React Native)
**Target**: End users
```
src/
├── navigation/             # React Navigation setup
├── screens/                # Screen components
│   ├── auth/              # Login, Register
│   ├── ride/              # Ride booking, tracking
│   ├── insurance/         # Insurance products
│   ├── profile/           # User profile
│   ├── travel/            # Travel bookings
│   └── loyalty/           # Loyalty & rewards
├── components/             # Reusable components
│   ├── common/            # Buttons, inputs, cards
│   ├── ride/              # Ride-specific components
│   ├── maps/              # Map components
│   └── insurance/         # Insurance components
├── store/                  # Redux store
│   ├── slices/            # Redux slices
│   └── api/               # RTK Query APIs
├── services/               # Business logic services
├── hooks/                  # Custom React hooks
├── theme/                  # Colors, typography, spacing
└── assets/                 # Images, fonts, icons
```

### apps/mobile-driver/ (React Native)
**Target**: Drivers/delivery partners
- Similar structure to mobile-user
- Driver-specific features (trip acceptance, navigation, earnings)

### apps/mobile-merchant/ (React Native)
**Target**: Restaurant/store owners
- Similar structure to mobile-user
- Merchant-specific features (order management, menu management)

### apps/web/ (Next.js 14)
**Target**: Web users
```
app/
├── (auth)/                 # Auth route group
│   ├── login/
│   └── register/
├── (main)/                 # Main app route group
│   ├── rides/
│   ├── insurance/
│   ├── profile/
│   └── travel/
├── api/                    # API routes
└── layout.tsx              # Root layout
components/
├── ui/                     # shadcn/ui components
├── features/               # Feature-specific components
│   ├── ride/
│   ├── insurance/
│   └── loyalty/
└── layout/                 # Layout components
lib/                        # Utilities
hooks/                      # Custom hooks
store/                      # Zustand stores
```

### apps/zalo-mini-app/
**Target**: Zalo users
```
src/
├── pages/                  # Zalo Mini App pages
│   ├── index/
│   ├── ride/
│   └── insurance/
├── components/             # Shared components
├── services/               # API integration
└── utils/                  # Zalo SDK helpers
```

### apps/desktop-ops/ (Electron)
**Target**: Operations team
- Admin dashboard
- Analytics & reporting
- System monitoring

---

## 3. Packages (Shared Libraries)

### packages/shared/
Common business logic shared across all apps
```
src/
├── types/                  # Common TypeScript types
├── constants/              # App-wide constants
├── utils/                  # Utility functions
└── validation/             # Validation schemas
```

### packages/design-system/
UI components and theming
```
src/
├── colors.ts               # Color palette
├── typography.ts           # Font styles
├── spacing.ts              # Spacing system
└── components/             # Shared UI components
```

### packages/api-client/
API client library for all services
```
src/
├── http-client.ts          # Axios wrapper
├── graphql-client.ts       # Apollo client
├── websocket-client.ts     # WebSocket client
└── interceptors/           # Request/response interceptors
```

### packages/types/
TypeScript type definitions
```
src/
├── entities/               # Database entity types
├── dtos/                   # Data transfer objects
└── enums/                  # Enum definitions
```

---

## 4. Backend (Infrastructure)

### backend/api-gateway/
Central API Gateway (Kong or NestJS)
```
src/
├── config/                 # Gateway configuration
├── middleware/             # Gateway middleware
│   ├── auth.middleware.ts
│   ├── rate-limit.middleware.ts
│   └── logging.middleware.ts
└── routes/                 # Route definitions
```

### backend/shared/
Shared backend utilities
```
dto/                        # Common DTOs
interfaces/                 # Common interfaces
enums/                      # Common enums
utils/                      # Utility functions
```

### backend/database/
Database management
```
migrations/                 # Database migrations
seeds/                      # Seed data
schemas/                    # SQL schemas
```

---

## 5. Infrastructure (DevOps)

### infrastructure/kubernetes/
Kubernetes manifests
```
base/                       # Base configurations
overlays/                   # Environment overlays
│   ├── dev/
│   ├── staging/
│   └── production/
services/                   # Service manifests
```

### infrastructure/terraform/
Infrastructure as Code
```
modules/                    # Terraform modules
│   ├── vpc/
│   ├── eks/
│   ├── rds/
│   └── redis/
environments/               # Environment configs
│   ├── dev/
│   ├── staging/
│   └── production/
```

### infrastructure/docker/
Docker configurations
```
Dockerfile.user-service
Dockerfile.transportation-service
Dockerfile.web
Dockerfile.mobile-build
```

### infrastructure/ci-cd/
CI/CD pipelines
```
github-actions/             # GitHub Actions workflows
argocd/                     # ArgoCD configurations
```

### infrastructure/monitoring/
Monitoring configurations
```
prometheus.yml              # Prometheus config
grafana/                    # Grafana dashboards
datadog/                    # Datadog configs
```

---

## 6. Documentation

### docs/architecture/
Architecture documentation
- System design documents
- Architecture decision records (ADRs)
- Database schemas
- API specifications

### docs/api/
API documentation
- REST API docs
- GraphQL schema
- gRPC proto files
- WebSocket events

### docs/deployment/
Deployment guides
- Local development setup
- Docker deployment
- Kubernetes deployment
- Cloud deployment

### docs/guides/
Development guides
- Coding standards
- Git workflow
- Testing guidelines
- Security best practices

---

## Key Configuration Files

### Root Level
- **package.json**: Monorepo dependencies and scripts
- **turbo.json**: Turborepo pipeline configuration
- **docker-compose.yml**: Local development services
- **.env.example**: Environment variables template
- **.gitignore**: Git ignore rules
- **.prettierrc**: Code formatting rules
- **.eslintrc.js**: Linting rules

### VSCode
- **.vscode/settings.json**: Editor settings
- **.vscode/extensions.json**: Recommended extensions

---

## Development Workflow

### 1. Service Development
```bash
cd services/user-service
npm install
npm run dev
```

### 2. Frontend Development
```bash
cd apps/mobile-user
npm install
npm run dev
```

### 3. Infrastructure
```bash
# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f
```

### 4. Testing
```bash
# Run all tests
npm test

# Run specific service tests
npm test --workspace=services/user-service
```

---

## Technology Stack Summary

| Layer | Technology |
|-------|-----------|
| **Backend** | NestJS, TypeScript, Node.js 20 |
| **Frontend Mobile** | React Native 0.73+ |
| **Frontend Web** | Next.js 14 |
| **Databases** | PostgreSQL, Redis, MongoDB, Elasticsearch |
| **Message Queue** | Apache Kafka, RabbitMQ |
| **AI/ML** | Python, FastAPI, TensorFlow, PyTorch |
| **Infrastructure** | Docker, Kubernetes, Terraform |
| **Cloud** | AWS / Google Cloud / Azure |
| **CI/CD** | GitHub Actions, ArgoCD |
| **Monitoring** | Prometheus, Grafana, Datadog, Sentry |

---

## Next Steps

1. Review the [Architecture Document](./architecture/README_ARCHITECTURE.md)
2. Set up local development environment
3. Start with the [Quick Start Guide](../README.md#quick-start)
4. Read the [API Documentation](./api/)
5. Follow the [Development Guidelines](./guides/)

---

**Last Updated**: 2026-02-14
**Maintained By**: Architecture Team
