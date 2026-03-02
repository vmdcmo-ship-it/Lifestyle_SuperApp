# 🚀 Lifestyle Super App - Multi-Service Platform

> **Siêu Ứng Dụng Đa Dịch Vụ** - All-in-One Platform for Transportation, Insurance, Travel, and More

## 📋 Tổng Quan (Overview)

Lifestyle Super App là một hệ sinh thái dịch vụ toàn diện được xây dựng trên kiến trúc microservices hiện đại, kết hợp các dịch vụ:

- 🚗 **Transportation Services**: Bike ride, Car ride, Carpool, Delivery
- 🛡️ **Insurance Services**: Vehicle liability, Social insurance, Life insurance, AI Advisory
- 🏖️ **Travel & Dining**: Hotel, Flight, Movie, Bus booking, Food delivery
- 📍 **Local Utilities**: Find nearby services (Gas stations, EV charging, Pharmacy, etc.)
- 🏃 **Community Engagement**: Run-to-Earn, Content creation, Loyalty program

### 📸 **Image Management Policy**
> ⚠️ **Quan trọng**: Tất cả hình ảnh sản phẩm, dịch vụ, quán ăn, cửa hàng **PHẢI do đối tác/merchant tải lên** để đảm bảo tính chân thực và niềm tin. Không sử dụng ảnh stock/generic từ hệ thống.
> 
> 📖 Xem chi tiết: [Image Upload Guidelines](./docs/IMAGE_UPLOAD_GUIDELINES.md)

## 🏗️ Kiến Trúc Hệ Thống (Architecture)

```
Lifestyle_SuperApp/
├── services/                    # Microservices (NestJS)
│   ├── user-service/           # User management & authentication
│   ├── transportation-service/ # Ride-hailing & delivery
│   ├── insurance-service/      # Insurance products & claims
│   ├── payment-service/        # Lifestyle Wallet & payment processing
│   ├── ai-service/             # AI/ML services (Python)
│   ├── notification-service/   # Push notifications & alerts
│   ├── loyalty-service/        # Loyalty & rewards program
│   ├── analytics-service/      # Analytics & reporting
│   ├── travel-service/         # Travel bookings
│   └── utility-service/        # Local utilities finder
│
├── apps/                        # Frontend Applications
│   ├── mobile-user/            # React Native - User App
│   ├── mobile-driver/          # React Native - Driver App
│   ├── mobile-merchant/        # React Native - Merchant App
│   ├── web/                    # Next.js - Web Application
│   ├── zalo-mini-app/          # Zalo Mini App
│   └── desktop-ops/            # Electron - Operations Dashboard
│
├── packages/                    # Shared Libraries
│   ├── shared/                 # Common business logic
│   ├── design-system/          # UI components & theme
│   ├── api-client/             # API client library
│   ├── types/                  # TypeScript types
│   ├── utils/                  # Utility functions
│   ├── validation/             # Form validation schemas
│   └── constants/              # App constants
│
├── backend/                     # Backend Infrastructure
│   ├── api-gateway/            # API Gateway (Kong/NestJS)
│   ├── shared/                 # Shared backend utilities
│   └── database/               # Database migrations & seeds
│
├── infrastructure/              # DevOps & Infrastructure
│   ├── kubernetes/             # K8s manifests
│   ├── terraform/              # Infrastructure as Code
│   ├── docker/                 # Docker configurations
│   ├── ci-cd/                  # CI/CD pipelines
│   ├── monitoring/             # Monitoring configs
│   └── scripts/                # Utility scripts
│
└── docs/                        # Documentation
    ├── architecture/           # Architecture documents
    ├── api/                    # API documentation
    ├── deployment/             # Deployment guides
    ├── guides/                 # Development guides
    └── diagrams/               # System diagrams
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: NestJS (TypeScript)
- **API**: GraphQL (Apollo), REST, gRPC, WebSocket
- **Databases**: PostgreSQL 16, Redis 7, MongoDB, Elasticsearch 8
- **Message Queue**: Apache Kafka, RabbitMQ
- **AI/ML**: Python FastAPI, TensorFlow, PyTorch

### Frontend
- **Mobile**: React Native 0.73+
- **Web**: Next.js 14 (App Router)
- **State Management**: Redux Toolkit, Zustand
- **UI**: React Native Paper, Tailwind CSS, shadcn/ui

### Infrastructure
- **Cloud**: AWS / Google Cloud / Azure
- **Container**: Docker + Kubernetes
- **CI/CD**: GitHub Actions, ArgoCD
- **Monitoring**: Prometheus, Grafana, Datadog, Sentry

## 🚀 Quick Start

### Prerequisites
```bash
- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker & Docker Compose
- PostgreSQL 16
- Redis 7
```

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Lifestyle_SuperApp
```

2. **Install dependencies**
```bash
npm install
```

3. **Start infrastructure services (Docker)**
```bash
npm run docker:up
```

4. **Start development servers**
```bash
# Start all microservices
npm run dev:services

# Or start individual services
npm run dev:user
npm run dev:transport
npm run dev:insurance
npm run dev:payment

# Start frontend apps
npm run dev:mobile
npm run dev:web
```

### Environment Variables

Create `.env` files in each service directory. See `.env.example` for reference.

```env
# Example for user-service
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/superapp
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
```

## 📦 Services Overview

### Core Services

| Service | Port | Description |
|---------|------|-------------|
| **API Gateway** | 3000 | Central API Gateway |
| **User Service** | 3001 | User management & auth |
| **Transportation Service** | 3002 | Ride-hailing & delivery |
| **Insurance Service** | 3003 | Insurance products & claims |
| **Payment Service** | 3004 | Lifestyle Wallet & payment processing |
| **AI Service** | 3005 | AI/ML services |
| **Notification Service** | 3006 | Push notifications |
| **Loyalty Service** | 3007 | Loyalty program |
| **Analytics Service** | 3008 | Analytics & reporting |

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific service
npm test --workspace=services/user-service

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

## 📚 Documentation

- [Web Admin – Hướng dẫn chạy chi tiết](./docs/WEB_ADMIN_RUN_GUIDE.md) – Chạy Web Admin từng bước, không lỗi
- [Architecture Document](./docs/architecture/README_ARCHITECTURE.md) - Complete system architecture
- [API Documentation](./docs/api/) - API specifications
- [Deployment Guide](./docs/deployment/) - Deployment instructions
- [Development Guide](./docs/guides/) - Development best practices

## 🔐 Security

- JWT-based authentication
- Role-based access control (RBAC)
- API rate limiting
- Data encryption at rest and in transit
- Regular security audits

## 📊 Performance Targets

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| API Response Time | < 200ms (P95) | < 500ms |
| Page Load Time | < 2s (FCP) | < 3s |
| Database Query | < 50ms (P95) | < 100ms |
| System Uptime | 99.9% | 99.5% |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 👥 Team

- Architecture Team
- Backend Team
- Frontend Team
- DevOps Team
- QA Team

## 📞 Support

For support and questions, please contact:
- Email: support@superapp.vn
- Slack: #superapp-dev

---

**Built with ❤️ by the Super App Team**
