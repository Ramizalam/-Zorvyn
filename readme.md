# Finance Dashboard Backend

A fully-featured REST API backend for a finance dashboard system. Built with **Node.js**, **TypeScript**, **Express**, **Prisma ORM**, and **PostgreSQL**.

---

## Features

- 🔐 **JWT Authentication** — register, login, `/me` endpoint
- 👥 **Role-Based Access Control** — VIEWER, ANALYST, ADMIN with per-route enforcement
- 💰 **Financial Records** — full CRUD with filters, pagination, search, and soft-delete
- 📊 **Dashboard Analytics** — summary totals, category breakdown, recent activity, monthly trends
- ✅ **Zod Validation** — strict input validation on all write endpoints
- 🛡️ **Rate Limiting** — global limiter + stricter auth limiter
- 🌱 **Seed Script** — pre-populated test users and 6 months of sample data

---

## Quick Start

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database

### 2. Install Dependencies
```bash
cd Backend
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env and set your DATABASE_URL and JWT_SECRET
```

### 4. Set Up Database
```bash
npx prisma migrate dev --name init
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```

Server starts at `http://localhost:3000`

---

## Test Users (after seeding)

| Email | Password | Role |
|-------|----------|------|
| admin@finance.com | Admin@123 | ADMIN |
| analyst@finance.com | Analyst@123 | ANALYST |
| viewer@finance.com | Viewer@123 | VIEWER |

---

## API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and get JWT token |
| GET | `/api/auth/me` | All | Get current user info |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | ADMIN | List users (paginated) |
| GET | `/api/users/:id` | ADMIN | Get single user |
| POST | `/api/users` | ADMIN | Create user |
| PATCH | `/api/users/:id` | ADMIN | Update user |
| DELETE | `/api/users/:id` | ADMIN | Delete user |

### Financial Records
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/records` | ALL | List records with filters |
| GET | `/api/records/:id` | ALL | Get single record |
| POST | `/api/records` | ANALYST, ADMIN | Create record |
| PATCH | `/api/records/:id` | ANALYST, ADMIN | Update record |
| DELETE | `/api/records/:id` | ADMIN | Soft-delete record |

**Record Filters** (query params): `type`, `category`, `dateFrom`, `dateTo`, `search`, `page`, `limit`

### Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard/summary` | ALL | Income, expenses, net balance |
| GET | `/api/dashboard/categories` | ALL | Totals grouped by category |
| GET | `/api/dashboard/recent` | ALL | Recent activity feed |
| GET | `/api/dashboard/trends?year=2026` | ANALYST, ADMIN | Monthly income/expense trends |

---

## Project Structure

```
Backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed script
├── src/
│   ├── lib/
│   │   └── prisma.ts       # Prisma singleton
│   ├── middleware/
│   │   ├── authenticate.ts # JWT auth middleware
│   │   ├── authorize.ts    # RBAC middleware
│   │   ├── validate.ts     # Zod validation middleware
│   │   └── errorHandler.ts # Global error handler
│   ├── modules/
│   │   ├── auth/           # Register, login
│   │   ├── users/          # User management
│   │   ├── records/        # Financial records CRUD
│   │   └── dashboard/      # Aggregated analytics
│   ├── utils/
│   │   ├── apiResponse.ts  # Response helpers
│   │   └── asyncHandler.ts # Async error wrapper
│   ├── routes.ts           # Root router
│   └── index.ts            # Server entry point
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (hot reload) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm run seed` | Seed database with test data |
| `npm run prisma:migrate` | Run Prisma migrations |
| `npm run prisma:studio` | Open Prisma Studio |
