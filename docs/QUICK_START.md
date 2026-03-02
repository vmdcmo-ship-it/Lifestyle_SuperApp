# 🚀 Quick Start Guide

Get your Lifestyle Super App development environment up and running in minutes!

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: >= 20.0.0 ([Download](https://nodejs.org/))
- **npm**: >= 10.0.0 (comes with Node.js)
- **Docker Desktop**: For running infrastructure services ([Download](https://www.docker.com/products/docker-desktop))
- **Git**: For version control
- **VSCode**: Recommended IDE ([Download](https://code.visualstudio.com/))

### Optional Tools
- **PostgreSQL Client**: For database management
- **Redis Commander**: For Redis inspection
- **Postman/Insomnia**: For API testing
- **React Native CLI**: For mobile development

---

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Lifestyle_SuperApp
```

---

## Step 2: Install Dependencies

Install all dependencies for the monorepo:

```bash
npm install
```

This will install dependencies for all services and apps in the workspace.

---

## Step 3: Set Up Environment Variables

### Root Level
Copy the example environment file:

```bash
cp .env.example .env
```

### User Service Example
```bash
cd services/user-service
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=3001

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=superapp
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-super-secret-key
```

Repeat for other services as needed.

---

## Step 4: Start Infrastructure Services

Start PostgreSQL, Redis, MongoDB, Kafka, and other services using Docker:

```bash
npm run docker:up
```

This command starts:
- ✅ PostgreSQL (port 5432)
- ✅ Redis (port 6379)
- ✅ MongoDB (port 27017)
- ✅ Elasticsearch (port 9200)
- ✅ Kafka (port 9092)
- ✅ RabbitMQ (port 5672, Management UI: 15672)
- ✅ Prometheus (port 9090)
- ✅ Grafana (port 3100)

### Verify Services

Check if all services are running:

```bash
docker-compose ps
```

### Access Management UIs

- **pgAdmin**: http://localhost:5050 (admin@superapp.local / admin)
- **Redis Commander**: http://localhost:8081
- **Mongo Express**: http://localhost:8082
- **RabbitMQ Management**: http://localhost:15672 (admin / admin)
- **Grafana**: http://localhost:3100 (admin / admin)
- **Prometheus**: http://localhost:9090

---

## Step 5: Run Database Migrations

Initialize the database schema:

```bash
cd services/user-service
npm run migration:run
```

---

## Step 6: Start Development Servers

### Option A: Start All Services (Recommended)

```bash
npm run dev:services
```

This starts:
- User Service (port 3001)
- Transportation Service (port 3002)
- Insurance Service (port 3003)
- Payment Service (port 3004)

### Option B: Start Individual Services

```bash
# Terminal 1: User Service
npm run dev:user

# Terminal 2: Transportation Service
npm run dev:transport

# Terminal 3: Insurance Service
npm run dev:insurance

# Terminal 4: Payment Service
npm run dev:payment
```

### Start Frontend Apps

**Web App (Next.js)**
```bash
# Terminal 5
npm run dev:web
```
Access at: http://localhost:3000

**Mobile App (React Native)**
```bash
# Terminal 6
npm run dev:mobile
```

For iOS:
```bash
cd apps/mobile-user/ios
pod install
cd ..
npx react-native run-ios
```

For Android:
```bash
cd apps/mobile-user
npx react-native run-android
```

---

## Step 7: Verify Everything is Working

### Check API Endpoints

**User Service Health Check**
```bash
curl http://localhost:3001/api/v1/health
```

**Swagger Documentation**
```bash
# User Service
open http://localhost:3001/api/docs

# Transportation Service
open http://localhost:3002/api/docs

# Insurance Service
open http://localhost:3003/api/docs
```

### Test Authentication

```bash
# Register a new user
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## Common Development Tasks

### Run Tests

```bash
# Run all tests
npm test

# Run tests for specific service
npm test --workspace=services/user-service

# Run tests with coverage
npm run test:coverage
```

### Lint Code

```bash
# Lint all code
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### Format Code

```bash
npm run format
```

### Build for Production

```bash
# Build all services and apps
npm run build

# Build specific service
npm run build --workspace=services/user-service
```

---

## Troubleshooting

### Port Already in Use

If a port is already in use, you can change it in the service's `.env` file or stop the conflicting process:

```bash
# Find process using port 3001
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Docker Services Not Starting

```bash
# Stop all services
npm run docker:down

# Remove volumes and restart
docker-compose down -v
npm run docker:up
```

### Database Connection Errors

1. Check if PostgreSQL is running:
   ```bash
   docker-compose ps postgres
   ```

2. Verify database credentials in `.env`

3. Check PostgreSQL logs:
   ```bash
   docker-compose logs postgres
   ```

### Node Modules Issues

```bash
# Clean install
npm run clean
npm install
```

### React Native Build Errors

**iOS**
```bash
cd apps/mobile-user/ios
pod deintegrate
pod install
cd ..
```

**Android**
```bash
cd apps/mobile-user/android
./gradlew clean
cd ..
```

---

## Development Tools

### Recommended VSCode Extensions

The project includes a `.vscode/extensions.json` file with recommended extensions:

- Prettier - Code formatter
- ESLint - Linting
- Path Intellisense
- Docker
- GraphQL
- Tailwind CSS IntelliSense

VSCode will prompt you to install these when you open the project.

### Git Hooks

The project uses Husky for Git hooks:

- **pre-commit**: Runs linting and formatting
- **pre-push**: Runs tests

---

## Next Steps

1. ✅ Read the [Architecture Document](./architecture/README_ARCHITECTURE.md)
2. ✅ Explore the [Project Structure](./PROJECT_STRUCTURE.md)
3. ✅ Check out the [API Documentation](./api/)
4. ✅ Review [Coding Standards](./guides/CODING_STANDARDS.md)
5. ✅ Join the team on Slack/Discord

---

## Useful Commands Cheat Sheet

```bash
# Development
npm run dev                    # Start all services
npm run dev:services          # Start backend services only
npm run dev:web               # Start web app
npm run dev:mobile            # Start mobile app

# Docker
npm run docker:up             # Start infrastructure
npm run docker:down           # Stop infrastructure
npm run docker:logs           # View logs

# Testing
npm test                      # Run all tests
npm run test:watch           # Run tests in watch mode
npm run test:e2e             # Run e2e tests

# Building
npm run build                 # Build all projects
npm run clean                 # Clean all builds

# Code Quality
npm run lint                  # Lint code
npm run format               # Format code
```

---

## Getting Help

- 📧 Email: dev-support@superapp.vn
- 💬 Slack: #dev-help
- 📚 Documentation: [docs/](./index.md)
- 🐛 Issues: GitHub Issues

---

**Happy Coding! 🚀**
