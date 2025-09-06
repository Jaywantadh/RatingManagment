# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

RateIN is a full-stack rating system built with NestJS backend and React frontend, featuring role-based authentication and PostgreSQL database integration.

## Architecture

**Backend**: NestJS with TypeORM, JWT authentication, and modular architecture
- **API Base**: `http://localhost:3001/api/v1`
- **Database**: PostgreSQL with custom views and functions
- **Authentication**: JWT tokens with role-based access control

**Frontend**: React 18 with TypeScript, Tailwind CSS, and state management
- **Development**: `http://localhost:3000`
- **State**: Context API + Zustand for complex state
- **UI**: Tailwind CSS with Framer Motion animations

**Roles**: SYSTEM_ADMIN, STORE_OWNER, NORMAL_USER with distinct dashboards and permissions

## Development Commands

### Backend Development
```bash
# Development server with hot reload
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod

# Linting and formatting
npm run lint
npm run format

# Testing
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e
```

### Frontend Development
```bash
cd frontend

# Development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Database Operations
```bash
# Connect to PostgreSQL
psql -U postgres -d ratein

# Run schema (initial setup)
psql -U postgres -d ratein -f database/schema.sql
```

## Key File Structure

```
src/
├── modules/
│   ├── auth/          # JWT authentication, login/register
│   ├── users/         # User management, profile operations
│   ├── stores/        # Store CRUD, search, ownership validation
│   └── ratings/       # Rating system, statistics, validation
├── common/
│   └── dto/           # Shared DTOs and validation schemas
├── app.module.ts      # Root module with database and JWT config
└── main.ts           # Application bootstrap with security middleware

frontend/src/
├── components/
│   ├── auth/          # Protected routes, login forms
│   └── common/        # Reusable UI components
├── contexts/          # React Context for global state
├── pages/             # Role-specific dashboard pages
└── services/          # API communication layer
```

## Database Schema

**Core Tables**: `users`, `stores`, `ratings`
**Key Constraints**: 
- One rating per user per store (composite unique)
- Store owners must have STORE_OWNER role
- Rating values constrained to 1-5
- Name fields: 20-60 characters
- Comments: ≤500 characters

**Useful Views**:
- `store_ratings_summary`: Aggregated store statistics
- `user_rating_stats`: User rating activity

**Helper Functions**:
- `get_store_stats(store_id)`: Returns rating distribution JSON
- `validate_password(password)`: Server-side password validation

## Environment Setup

Copy `env.example` to `.env` and configure:
- Database connection (PostgreSQL)
- JWT secret and expiration
- CORS frontend URL
- bcrypt salt rounds

**Default Test Credentials**:
- Admin: `admin@ratein.com` / `Admin123!`
- Store Owner: `storeowner@ratein.com` / `Store123!`
- Normal User: `normaluser@ratein.com` / `User123!`

## TypeScript Configuration

Uses custom path aliases:
- `@/*` → `src/*`
- `@/common/*` → `src/common/*`
- `@/modules/*` → `src/modules/*`

Decorators enabled for NestJS functionality.

## Role-Based Features

**SYSTEM_ADMIN**: User management, system analytics, all store operations
**STORE_OWNER**: Own store management, rating analytics, customer insights  
**NORMAL_USER**: Store browsing, rating submission, profile management

Each role has dedicated dashboard routes and protected endpoints.

## Security Features

- JWT authentication with configurable expiration
- Password complexity validation (8-16 chars, uppercase, special char)
- Role-based route guards and API protection
- bcrypt password hashing with configurable rounds
- CORS, Helmet, and compression middleware
- Input validation with class-validator DTOs

## Database Relationships

- Users → Stores (one-to-many via owner_id)
- Users → Ratings (one-to-many via user_id)  
- Stores → Ratings (one-to-many via store_id)
- Composite unique constraint: (user_id, store_id) on ratings

## Testing Approach

- Unit tests with Jest for services and controllers
- E2E tests for complete API workflows
- Frontend tests with React Testing Library
- Coverage reports available via `npm run test:cov`

## Performance Optimizations

- Database indexes on frequently queried columns
- Materialized views for analytics queries
- TypeORM connection pooling
- Frontend lazy loading and code splitting
- Framer Motion for smooth UI animations
