# Electricity Bills Management System API

Sistem manajemen tagihan listrik dengan Next.js, TypeScript, dan arsitektur yang terstruktur.

## 📚 API Documentation

**Live Documentation (Swagger UI):**
- 🔗 Local: http://localhost:3000/docs
- 🌐 Production: https://your-api.vercel.app/docs

**OpenAPI Specification:**
- 📄 JSON: http://localhost:3000/api/docs/swagger.json

## 🚀 Fitur Utama

- **Framework**: Next.js 15 dengan App Router
- **Language**: TypeScript
- **Database**: PostgreSQL/MySQL dengan Prisma ORM
- **Authentication**: JWT-based auth system
- **API Documentation**: OpenAPI 3.0 (Swagger UI)
- **Testing**: Jest dengan coverage reporting
- **Architecture**: Clean Architecture & Domain-Driven Design
- **Containerization**: Docker & Docker Compose
- **Code Quality**: ESLint & Prettier

## 📁 Struktur Projek

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   └── (frontend)/     # React pages
├── components/         # Shared React components
├── lib/               # Core application logic
│   ├── common/        # Utilities, config, middleware
│   └── features/      # Feature-based modules
│       └── auth/      # Authentication feature
│           ├── application/    # Use cases
│           ├── domain/         # Business logic & entities
│           ├── infrastructure/ # External adapters
│           └── presentation/   # Controllers & DTOs
```

## 🛠 Teknologi yang Digunakan

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Database ORM
- **PostgreSQL** - Database relational
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Frontend

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling (diasumsikan)

### Development Tools

- **Jest** - Testing framework
- **Docker** - Containerization
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🏗 Arsitektur

Projek ini mengimplementasikan **Clean Architecture** dengan pendekatan **Domain-Driven Design**:

### Layer Architecture:

1. **Domain Layer** - Business logic & entities
2. **Application Layer** - Use cases & business rules
3. **Infrastructure Layer** - External concerns (DB, APIs)
4. **Presentation Layer** - Controllers & UI

### Feature Structure (contoh: Auth):

```
auth/
├── domain/
│   ├── entity/         # User, Session entities
│   ├── port/           # Repository interfaces
│   └── service/        # Domain services
├── application/
│   └── usecase/        # Use cases (Register, Login, etc.)
├── infrastructure/
│   ├── adapter/        # Prisma repositories
│   └── mapper/         # Data mappers
└── presentation/
    ├── dto/            # Data transfer objects
    └── middleware/     # Auth middleware
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL
- Docker (opsional)

### Installation

1. **Clone dan install dependencies:**

```bash
git clone <repository-url>
cd nextjs-template
npm install
```

2. **Setup environment variables:**

```bash
cp .env.example .env.local
# Edit .env.local dengan konfigurasi database dan JWT secret
```

3. **Setup database:**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (jika ada)
npx prisma db seed
```

4. **Jalankan development server:**

```bash
npm run dev
```

### Dengan Docker

```bash
# Jalankan dengan Docker Compose
docker-compose up -d

# Atau untuk development
docker-compose -f docker-compose-dev.yml up -d
```

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token

### Panel Management
- `GET /api/panel` - List semua panel
- `POST /api/panel` - Buat panel baru
- `GET /api/panel/{id}` - Get panel by ID
- `PUT /api/panel/{id}` - Update panel
- `DELETE /api/panel/{id}` - Delete panel

### Electricity Bills
- `GET /api/electricity-bills` - List semua tagihan (with filters)
- `POST /api/electricity-bills` - Buat tagihan baru
- `GET /api/electricity-bills/{id}` - Get tagihan by ID
- `PUT /api/electricity-bills/{id}` - Update tagihan
- `DELETE /api/electricity-bills/{id}` - Delete tagihan

**📚 Untuk dokumentasi lengkap, buka:** http://localhost:3000/docs

## 🌐 Deployment ke Production

### Quick Deploy ke Vercel (5 menit!)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Atau gunakan script:**
```bash
# Windows
.\deploy-vercel.ps1

# Linux/Mac
./deploy-vercel.sh
```

**Panduan Lengkap:**
- 📘 [DEPLOY_README.md](./DEPLOY_README.md) - Quick start guide
- 📗 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Complete deployment guide

**Hasil Deploy:** `https://your-api.vercel.app/docs`

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests dengan coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run tests dalam watch mode
npm run test:watch
```

## 📊 Test Coverage

Projek ini memiliki comprehensive test coverage termasuk:

- Unit tests untuk use cases
- Integration tests untuk auth flow
- Repository tests
- Utility function tests

Lihat laporan coverage di: `coverage/lcov-report/index.html`

## 🔐 Authentication System

Sistem authentication yang lengkap dengan:

- **Registration** - User pendaftaran dengan password hashing
- **Login** - Email/password authentication
- **JWT Tokens** - Access & refresh tokens
- **Session Management** - Database-backed sessions
- **Token Refresh** - Secure token refresh mechanism
- **Logout** - Session invalidation

### API Endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

## 🗄 Database Schema

### User Model:

```sql
id
String   @id @default(cuid())
email         String   @unique
passwordHash  String
name          String?
role          UserRole @default(USER)
createdAt     DateTime @default(now())
updatedAt     DateTime @updatedAt
```

### Session Model:

```sql
id
String   @id @default(cuid())
userId       String
user         User     @relation(fields: [userId], references: [id])
refreshToken String   @unique
expiresAt    DateTime
createdAt    DateTime @default(now())
```

## 🔧 Development Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run test         # Run tests
npm run test:watch   # Tests in watch mode
npm run lint         # ESLint checking
npm run format       # Prettier formatting
npm run db:reset     # Reset database
npm run db:seed      # Seed database
```

## 🐳 Docker Deployment

### Production:

```bash
docker-compose up -d
```

### Development:

```bash
docker-compose -f docker-compose-dev.yml up -d
```

## 📝 Best Practices Implemented

- ✅ TypeScript untuk type safety
- ✅ Clean Architecture & DDD
- ✅ Comprehensive testing
- ✅ Secure authentication
- ✅ Environment-based configuration
- ✅ Error handling yang proper
- ✅ Logging system
- ✅ Database migrations
- ✅ Code formatting & linting

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🆕 Menggunakan Template Ini

Template ini cocok untuk:

- 🏢 Enterprise applications
- 🚀 Startup projects
- 🎓 Learning Clean Architecture
- 🔐 Projects requiring robust authentication

Untuk mulai menggunakan:

1. Clone repository ini
2. Update package.json dengan project info Anda
3. Sesuaikan database schema sesuai kebutuhan
4. Tambahkan features sesuai requirements

---

**Happy Coding!** 🎉
