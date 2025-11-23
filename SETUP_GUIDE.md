# 🚀 Database & Backend Initialization Guide

This guide will help you set up and initialize the RateIN database and backend from scratch.

## Prerequisites

Before starting, ensure you have:
- ✅ **PostgreSQL** installed (v14+)
- ✅ **Node.js** installed (v18+)
- ✅ **npm** or **yarn**

---

## 📋 Step-by-Step Initialization

### Step 1: Install PostgreSQL (if not installed)

#### Windows:
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer and remember the password you set for `postgres` user
3. Default port: `5432`

#### Verify Installation:
```bash
psql --version
```

### Step 2: Create Database

Open PostgreSQL command line (psql) or use pgAdmin:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE ratein;

# Verify
\l

# Exit
\q
```

**OR** use this one-liner:
```bash
psql -U postgres -c "CREATE DATABASE ratein;"
```

### Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Edit `.env` file with your database credentials:
```env
# Application
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3001

# Database - UPDATE THESE!
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE
DB_NAME=ratein

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Security
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=debug
```

**Important:** Replace `YOUR_POSTGRES_PASSWORD_HERE` with your actual PostgreSQL password!

### Step 4: Install Backend Dependencies

```bash
# From project root directory
npm install
```

### Step 5: Start the Backend

The backend uses **TypeORM** which will automatically:
- Create all database tables
- Set up relationships
- Apply the schema

```bash
npm run start:dev
```

**What happens:**
1. TypeORM connects to PostgreSQL
2. Creates tables: `users`, `stores`, `ratings`
3. Sets up foreign keys and constraints
4. Inserts sample data (if using Docker)

### Step 6: Verify Backend is Running

You should see:
```
🚀 RateIN Backend is running on: http://localhost:3000
📊 API Documentation: http://localhost:3000/api/v1
```

Test the API:
```bash
# Health check
curl http://localhost:3000/api/v1

# Or open in browser
http://localhost:3000/api/v1
```

---

## 🐳 Alternative: Using Docker (Easiest!)

If you have Docker installed, this is the simplest method:

```bash
# Start PostgreSQL with Docker
docker-compose up -d postgres

# This will:
# - Create the database
# - Run initialization scripts
# - Insert sample data
```

Then start the backend:
```bash
npm run start:dev
```

---

## 🔍 Troubleshooting

### Issue: "Connection refused" or "ECONNREFUSED"

**Solution:**
1. Check if PostgreSQL is running:
   ```bash
   # Windows
   net start postgresql-x64-14
   
   # Or check services
   services.msc
   ```

2. Verify connection:
   ```bash
   psql -U postgres -d ratein
   ```

### Issue: "Database does not exist"

**Solution:**
```bash
psql -U postgres -c "CREATE DATABASE ratein;"
```

### Issue: "Authentication failed"

**Solution:**
- Check your `.env` file has the correct `DB_PASSWORD`
- Verify PostgreSQL user credentials:
  ```bash
  psql -U postgres
  # If this works, your password is correct
  ```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or change PORT in .env file
PORT=3001
```

---

## 📊 Sample Data

The database comes with pre-configured sample users:

### Admin Account
- **Email:** `admin@ratein.com`
- **Password:** `Admin123!`
- **Role:** System Administrator

### Store Owner Account
- **Email:** `storeowner@ratein.com`
- **Password:** `Store123!`
- **Role:** Store Owner

### Normal User Account
- **Email:** `normaluser@ratein.com`
- **Password:** `User123!`
- **Role:** Normal User

---

## 🔄 Reset Database (Fresh Start)

If you need to start over:

```bash
# Stop backend
Ctrl+C

# Drop and recreate database
psql -U postgres -c "DROP DATABASE ratein;"
psql -U postgres -c "CREATE DATABASE ratein;"

# Restart backend (TypeORM will recreate tables)
npm run start:dev
```

---

## ✅ Verification Checklist

- [ ] PostgreSQL is installed and running
- [ ] Database `ratein` exists
- [ ] `.env` file is configured with correct credentials
- [ ] Backend dependencies installed (`npm install`)
- [ ] Backend starts without errors
- [ ] Can access http://localhost:3000/api/v1
- [ ] Sample users can login

---

## 🚀 Next Steps

Once backend is running:

1. **Start Frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

2. **Access Application:**
   - Frontend: http://localhost:3001
   - Backend: http://localhost:3000

3. **Login** with sample credentials above

4. **Deploy** using `DEPLOYMENT_RENDER.md` guide

---

## 📞 Need Help?

If you encounter issues:
1. Check backend logs in terminal
2. Verify PostgreSQL is running
3. Check `.env` configuration
4. Ensure port 3000 is available
