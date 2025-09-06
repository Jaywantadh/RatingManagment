# 🌟 RateIN - Premium Store Rating System

<div align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-orange?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS">
</div>

<p align="center">
  <strong>A luxury, full-stack store rating platform with advanced analytics, real-time features, and premium UI/UX design</strong>
</p>

---

## 🚀 **Quick Start**

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **PostgreSQL** (v14+)
- **Git**

### ⚡ Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd RateIN

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start PostgreSQL service
# Windows: net start postgresql
# Linux/Mac: sudo service postgresql start

# Run database migrations (if applicable)
npm run migration:run

# Start backend development server
npm run start:dev

# In a new terminal, start frontend development server
cd frontend
npm start
```

**🌐 Access the Application:**
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000

### 🎯 **Demo Credentials**

```bash
# System Administrator
Email: admin2@ratein.com
Password: Admin123!

# Store Owner
Email: storeowner2@ratein.com  
Password: Store123!

# Normal User
Email: testuser@ratein.com
Password: Test123!
```

---

## 📊 **Current Project Status**

✅ **Completed Features:**
- ✨ **Luxury UI/UX Design** - Premium design system with glass morphism
- 🔐 **Complete Authentication** - JWT-based with role management
- 📊 **Advanced Analytics** - Real-time charts and dashboards
- 🏢 **Admin Panel** - Full management capabilities with luxury styling
- ⭐ **Rating System** - Complete CRUD with analytics
- 🏪 **Store Management** - Full lifecycle management
- 📱 **Responsive Design** - Mobile-first approach
- 🎆 **Animations** - Framer Motion integration
- 🛡️ **Confirmation Dialogs** - Luxury-styled confirmation system

⚡ **Current Development Status:**
- **Backend**: Fully functional with all APIs
- **Frontend**: Complete with luxury design
- **Database**: PostgreSQL with optimized schema
- **Authentication**: JWT with role-based access
- **Analytics**: Real-time dashboards with charts

---

## 📁 **Project Structure**

```
RateIN/
├── 📁 src/                          # Backend source code
│   ├── 📁 modules/
│   │   ├── 📁 auth/                 # Authentication module
│   │   ├── 📁 users/                # User management
│   │   ├── 📁 stores/               # Store management
│   │   └── 📁 ratings/              # Rating system
│   └── 📁 common/
│       ├── 📁 decorators/           # Custom decorators
│       ├── 📁 dto/                  # Data Transfer Objects
│       ├── 📁 guards/               # Route guards
│       └── 📁 strategies/           # Authentication strategies
├── 📁 frontend/                     # Frontend React application
│   ├── 📁 public/                   # Static assets
│   └── 📁 src/
│       ├── 📁 components/           # React components
│       │   ├── 📁 admin/            # Admin panel components
│       │   ├── 📁 common/           # Shared components
│       │   ├── 📁 layout/           # Layout components
│       │   └── 📁 ui/               # UI components
│       ├── 📁 contexts/             # React contexts
│       ├── 📁 hooks/                # Custom React hooks
│       ├── 📁 pages/                # Page components
│       ├── 📁 services/             # API services
│       └── 📁 utils/                # Utility functions
├── 📁 database/                     # Database scripts
├── 📁 docs/                         # Documentation
├── 📄 package.json                 # Backend dependencies
└── 📄 README.md                    # This file
```

---

## 🏗️ **Architecture Overview**

### **Backend (NestJS + TypeORM + PostgreSQL)**
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport strategies
- **Architecture**: Modular monolith with clean separation

### **Frontend (React + TypeScript + TailwindCSS)**
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with luxury design system
- **State Management**: Context API + Zustand
- **Charts**: Recharts, Nivo, Chart.js
- **Animations**: Framer Motion

### **Key Design Patterns**
- **Backend**: Module-based architecture, Repository pattern, Dependency Injection
- **Frontend**: Component composition, Custom hooks, Context providers

---

## 👥 **User Roles & Features**

### 🛡️ **System Administrator**
**Capabilities:**
- ✅ Complete system oversight and management
- ✅ User account management (create, update, delete, suspend)
- ✅ Store approval and management
- ✅ Rating moderation and content control
- ✅ Advanced analytics dashboard
- ✅ System configuration and settings

**Dashboard Features:**
- 📊 Real-time user analytics with growth trends
- 🏪 Store management with approval workflows
- ⭐ Rating oversight with moderation tools
- 📈 Advanced charts and metrics
- 🚫 User suspension and account controls

### 🏪 **Store Owner**
**Capabilities:**
- ✅ Store profile management and optimization
- ✅ Menu/inventory management
- ✅ Rating and review monitoring
- ✅ Business analytics and insights
- ✅ Customer engagement tools

**Dashboard Features:**
- 📈 Store performance analytics
- ⭐ Rating breakdown and trends
- 👥 Customer demographics
- 💰 Revenue insights (future feature)
- 📝 Review management and responses

### 👤 **Normal User**
**Capabilities:**
- ✅ Store discovery and browsing
- ✅ Rating and review submission
- ✅ Personal rating history
- ✅ Favorite stores management
- ✅ Profile customization

**Features:**
- 🔍 Advanced store search and filtering
- ⭐ Comprehensive rating system (1-5 stars)
- 📝 Detailed review composition
- 📱 Responsive mobile experience
- 🌟 Personalized recommendations

---

## 🎨 **UI/UX Design System**

### **Luxury Theme Architecture**
```scss
// Color Palette
$primary: #f97316        // Luxury Orange
$secondary: #3b82f6      // Elite Blue  
$luxury: #ffcc33         // Gold Accents
$dark: #0f172a → #475569 // Dark Gradient
$success: #22c55e        // Success Green
$warning: #f59e0b        // Warning Amber
$error: #ef4444          // Error Red
```

### **Design Components**
- 🎯 **Glass Morphism Cards** - Translucent containers with backdrop blur
- ✨ **Premium Gradients** - Multi-stop luxury color schemes  
- 🌊 **Smooth Animations** - Framer Motion powered interactions
- 💎 **Luxury Icons** - Lucide React with custom styling
- 📱 **Responsive Design** - Mobile-first approach
- 🎪 **Interactive Elements** - Hover effects and micro-interactions

### **Typography System**
- **Primary Font**: Inter (Modern, clean readability)
- **Secondary Font**: Poppins (Elegant headings)
- **Monospace**: JetBrains Mono (Code and data)

---

## 🔧 **Development Workflows**

### **Backend Development**

#### **1. Creating a New Module**
```bash
# Generate module structure
nest g module feature-name
nest g controller feature-name
nest g service feature-name
nest g entity feature-name

# Example: Creating a notifications module
nest g module notifications
nest g controller notifications
nest g service notifications
nest g entity notifications/notification
```

#### **2. Database Operations**
```bash
# Generate migration
npm run typeorm migration:generate src/migrations/MigrationName

# Run migrations
npm run typeorm migration:run

# Revert migration
npm run typeorm migration:revert

# Create seed data
npm run seed
```

#### **3. API Development Process**
1. **Define Entity** (TypeORM model)
2. **Create DTOs** (Data Transfer Objects)
3. **Implement Service** (Business logic)
4. **Build Controller** (API endpoints)
5. **Add Validation** (Class-validator decorators)
6. **Write Tests** (Unit and integration)

### **Frontend Development**

#### **1. Component Creation Workflow**
```bash
# Component structure
frontend/src/components/
├── ComponentName/
│   ├── ComponentName.tsx
│   ├── ComponentName.types.ts
│   ├── ComponentName.styles.ts (if needed)
│   └── index.ts
```

#### **2. Page Development Process**
1. **Create Page Component** in `src/pages/`
2. **Add Route** in App.tsx or router configuration
3. **Implement Layout** with proper responsive design
4. **Connect API Services** using custom hooks
5. **Add Loading States** and error handling
6. **Implement Animations** with Framer Motion

#### **3. State Management Patterns**
```typescript
// Context Pattern (for shared state)
export const FeatureContext = createContext<FeatureContextType>()

// Custom Hook Pattern (for component logic)
export const useFeature = () => {
  // Hook logic here
}

// API Hook Pattern (for data fetching)
export const useFeatureData = () => {
  // Data fetching logic
}
```

---

## 🔐 **Authentication & Security**

### **JWT Authentication Flow**
1. **User Login** → Validate credentials
2. **Generate JWT** → Include user role and permissions
3. **Return Tokens** → Access token + Refresh token
4. **Route Protection** → Guard implementation
5. **Token Refresh** → Automatic renewal

### **Role-Based Access Control (RBAC)**
```typescript
// Route Protection Examples
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('ADMIN')
async adminOnlyEndpoint() { }

@UseGuards(JwtAuthGuard, RoleGuard)  
@Roles('ADMIN', 'STORE_OWNER')
async managerEndpoint() { }
```

### **Security Features**
- 🔒 **Password Hashing** - bcrypt with salt rounds
- 🛡️ **CORS Configuration** - Cross-origin request handling
- ⚡ **Rate Limiting** - API request throttling
- 🚫 **Input Validation** - Class-validator sanitization
- 🔐 **Helmet Integration** - Security headers

---

## 📊 **Analytics & Data Visualization**

### **Chart Libraries Integration**
```typescript
// Recharts (Primary)
import { LineChart, BarChart, PieChart, AreaChart } from 'recharts'

// Nivo (Advanced visualizations)
import { ResponsiveLine, ResponsiveBar } from '@nivo/line'

// Chart.js (Complex charts)
import { Chart, Line, Bar } from 'react-chartjs-2'
```

### **Analytics Features**
- 📈 **User Growth Tracking** - Registration and activity trends
- 🏪 **Store Performance** - Rating averages and review counts
- ⭐ **Rating Distribution** - Star rating breakdowns
- 🕒 **Time-based Analysis** - Weekly, monthly, yearly trends
- 🎯 **Real-time Updates** - Live data refresh

---

## 🗃️ **Database Schema**

### **Core Entities**

#### **Users Table**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  firstName VARCHAR NOT NULL,
  lastName VARCHAR NOT NULL,
  role user_role_enum NOT NULL,
  isActive BOOLEAN DEFAULT true,
  profileImage VARCHAR,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### **Stores Table**
```sql
CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  phone VARCHAR,
  email VARCHAR,
  website VARCHAR,
  ownerId INTEGER REFERENCES users(id),
  isApproved BOOLEAN DEFAULT false,
  averageRating DECIMAL(3,2) DEFAULT 0,
  totalRatings INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### **Ratings Table**
```sql
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES users(id),
  storeId INTEGER REFERENCES stores(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  UNIQUE(userId, storeId)
);
```

---

## 🚀 **API Documentation**

### **Authentication Endpoints**

#### **POST** `/auth/login`
```typescript
// Request Body
{
  email: string;
  password: string;
}

// Response
{
  access_token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  }
}
```

#### **POST** `/auth/register`
```typescript
// Request Body
{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string; // Optional, defaults to 'USER'
}

// Response
{
  message: string;
  user: UserEntity;
}
```

### **Store Management Endpoints**

#### **GET** `/stores`
```typescript
// Query Parameters
{
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'name' | 'rating' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}

// Response
{
  stores: Store[];
  total: number;
  page: number;
  limit: number;
}
```

#### **POST** `/stores`
```typescript
// Request Body (Store Owner/Admin only)
{
  name: string;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
}
```

### **Rating Endpoints**

#### **POST** `/ratings`
```typescript
// Request Body
{
  storeId: number;
  rating: number; // 1-5
  review?: string;
}
```

#### **GET** `/ratings/store/:storeId`
```typescript
// Response
{
  ratings: Rating[];
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  }
}
```

---

## 🛠️ **Available Scripts**

### **Backend Scripts**
```bash
# Development
npm run start          # Start production server
npm run start:dev      # Start development server with hot reload
npm run start:debug    # Start debug mode
npm run start:prod     # Start production build

# Building
npm run build          # Build the application
npm run format         # Format code with Prettier
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues

# Testing
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run end-to-end tests
```

### **Frontend Scripts**
```bash
# Development
npm start              # Start development server (usually port 3001)
npm run build          # Build for production
npm test               # Run tests
npm run eject          # Eject from Create React App (irreversible)

# Additional scripts
npm run analyze        # Analyze bundle size
npm run prettier       # Format code
npm run lint:fix       # Fix linting issues
```

---

## 📱 **Responsive Design Breakpoints**

```css
/* Mobile First Approach */
/* Default: Mobile (320px+) */

/* Small Mobile */
@media (min-width: 375px) { }

/* Large Mobile */  
@media (min-width: 425px) { }

/* Tablet */
@media (min-width: 768px) { }

/* Laptop */
@media (min-width: 1024px) { }

/* Desktop */
@media (min-width: 1440px) { }

/* Large Desktop */
@media (min-width: 1920px) { }
```

### **TailwindCSS Breakpoints**
- `sm:` - 640px+
- `md:` - 768px+  
- `lg:` - 1024px+
- `xl:` - 1280px+
- `2xl:` - 1536px+

---

## 🎯 **Component Library**

### **Common Components**

#### **LuxuryCard**
```typescript
interface LuxuryCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}
```

#### **PremiumButton**
```typescript
interface PremiumButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

#### **ConfirmationDialog**
```typescript
interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}
```

---

## 🧪 **Testing Strategy**

### **Backend Testing**
```bash
# Unit Tests
src/modules/auth/auth.service.spec.ts
src/modules/users/users.controller.spec.ts

# Integration Tests  
test/auth.e2e-spec.ts
test/stores.e2e-spec.ts

# Test Commands
npm run test           # Unit tests
npm run test:e2e       # Integration tests
npm run test:cov       # Coverage report
```

### **Frontend Testing**
```bash
# Component Tests
src/components/Button/Button.test.tsx
src/pages/LoginPage/LoginPage.test.tsx

# Hook Tests
src/hooks/useAuth/useAuth.test.ts

# Test Commands
npm test               # Run all tests
npm test -- --coverage # Coverage report
npm test -- --watch    # Watch mode
```

---

## 🚀 **Deployment Guide**

### **Environment Configuration**

#### **Backend (.env)**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=ratein_user
DB_PASSWORD=secure_password
DB_DATABASE=ratein_db

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1d

# Server
PORT=3000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3001
```

#### **Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ENV=development
```

### **Production Deployment**

#### **Backend (Node.js/NestJS)**
```bash
# Build application
npm run build

# Start production server
npm run start:prod

# Using PM2 (recommended)
pm2 start dist/main.js --name ratein-backend
```

#### **Frontend (React)**
```bash
# Build for production
npm run build

# Serve static files (nginx/apache)
# Or deploy to Vercel/Netlify/AWS S3
```

### **Docker Deployment**
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]

# Frontend Dockerfile  
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npx", "serve", "-s", "build", "-l", "3001"]
```

---

## 🔍 **Troubleshooting Guide**

### **Common Backend Issues**

#### **Database Connection Error**
```bash
# Check PostgreSQL service
# Windows
net start postgresql

# Linux/Mac  
sudo service postgresql start

# Verify connection
psql -h localhost -U postgres -d ratein_db
```

#### **JWT Token Issues**
- ✅ Verify JWT_SECRET in .env
- ✅ Check token expiration time
- ✅ Ensure proper token format in headers

#### **Module Import Errors**
```bash
# Clear build cache
rm -rf dist/
npm run build

# Check module path resolution
npm run start:dev
```

### **Common Frontend Issues**

#### **API Connection Problems**
- ✅ Verify REACT_APP_API_URL in .env
- ✅ Check CORS configuration on backend
- ✅ Confirm backend server is running

#### **Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules/
rm package-lock.json
npm install

# Clear React cache
rm -rf .cache/
npm start
```

#### **Styling Issues**
- ✅ Ensure TailwindCSS is properly configured
- ✅ Check for conflicting CSS classes
- ✅ Verify responsive breakpoints

---

## 📈 **Performance Optimization**

### **Backend Optimizations**
- 🚀 **Database Indexing** - Proper indexes on frequently queried columns
- ⚡ **Query Optimization** - Efficient database queries with TypeORM
- 🔄 **Caching Strategy** - Redis integration for session management
- 📊 **Connection Pooling** - PostgreSQL connection optimization

### **Frontend Optimizations**
- 🎯 **Code Splitting** - React.lazy() for route-based splitting
- 📦 **Bundle Analysis** - Webpack Bundle Analyzer integration
- 🖼️ **Image Optimization** - WebP format and lazy loading
- ⚡ **Virtual Scrolling** - For large datasets in tables

### **Performance Monitoring**
```typescript
// Frontend: Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Backend: Performance logging
import { Logger } from '@nestjs/common';
const logger = new Logger('Performance');
```

---

## 🤝 **Contributing Guidelines**

### **Code Style Standards**
- ✅ **TypeScript** - Strict mode enabled
- ✅ **ESLint** - Airbnb configuration
- ✅ **Prettier** - Consistent code formatting
- ✅ **Conventional Commits** - Commit message standards

### **Pull Request Process**
1. **Fork Repository** and create feature branch
2. **Write Tests** for new functionality
3. **Update Documentation** as needed
4. **Run Linting** and fix any issues
5. **Submit PR** with detailed description

### **Branch Naming Convention**
```bash
feature/add-user-notifications
bugfix/fix-rating-calculation  
hotfix/security-vulnerability
refactor/optimize-database-queries
```

---

## 🔧 **Recent Development Changes**

### **Latest Updates (Recent Session):**

1. **🎨 Login Page Optimization**
   - Fixed viewport sizing for perfect screen fit
   - Implemented responsive design for all device sizes
   - Added natural scrolling when needed
   - Optimized component spacing and sizing

2. **🛡️ Confirmation Dialog System**
   - Created reusable ConfirmationDialog component
   - Implemented useConfirmation hook for easy usage
   - Added luxury styling with animations
   - Support for different dialog types (danger, warning, info)

3. **📊 Admin Analytics Enhancement**
   - Started luxury design transformation for UserManagement
   - Added comprehensive analytics with Recharts integration
   - Implemented real-time data visualization
   - Created LuxuryChart wrapper component

4. **🎯 Current Development Focus**
   - Completing luxury design for all admin components
   - Integrating confirmation dialogs for sensitive actions
   - Adding advanced analytics dashboards
   - Implementing final UI/UX polish

---

## 📚 **Additional Resources**

### **Documentation Links**
- 📖 [NestJS Documentation](https://docs.nestjs.com/)
- ⚛️ [React Documentation](https://reactjs.org/docs/)
- 🎨 [TailwindCSS Documentation](https://tailwindcss.com/docs)
- 📊 [Recharts Documentation](https://recharts.org/)
- 🎭 [Framer Motion Documentation](https://www.framer.com/motion/)

### **Database Resources**
- 🐘 [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- 🏗️ [TypeORM Documentation](https://typeorm.io/)

### **Development Tools**
- 🛠️ [Postman Collection](./docs/RateIN.postman_collection.json)
- 📊 [Database Schema Diagram](./docs/database-schema.png)
- 🎨 [UI Design System](./docs/design-system.md)

---

## 🐛 **Issue Reporting**

When reporting bugs, please include:

1. **Environment Information**
   - Operating System
   - Node.js version
   - Browser (for frontend issues)

2. **Steps to Reproduce**
   - Detailed reproduction steps
   - Expected vs actual behavior

3. **Error Logs**
   - Console errors
   - Server logs
   - Network requests (if applicable)

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 **Development Team**

- **Full-Stack Developer** - Architecture, Backend & Frontend Implementation
- **UI/UX Designer** - Luxury design system and user experience
- **Database Administrator** - Schema design and optimization

---

## 🙏 **Acknowledgments**

- **NestJS Team** - For the amazing backend framework
- **React Team** - For the robust frontend library  
- **TailwindCSS** - For the utility-first CSS framework
- **TypeORM** - For the excellent ORM capabilities
- **Framer Motion** - For smooth animations

---

<div align="center">
  <p><strong>Built with ❤️ and lots of ☕</strong></p>
  <p>© 2024 RateIN - Premium Store Rating Platform</p>
</div>
