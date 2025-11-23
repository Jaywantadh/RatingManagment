# 🚀 Deploy to Vercel (Serverless)

Vercel is great for frontend + serverless APIs, but requires converting your NestJS backend.

## ⚠️ Important Notes
- **NestJS doesn't run natively on Vercel** (it's designed for long-running servers)
- You need to convert backend to serverless functions OR use a different backend host
- **Recommended approach**: Frontend on Vercel + Backend on Render/Fly.io

## Architecture Options

### Option A: Hybrid (Recommended)
- **Frontend**: Vercel (free, unlimited)
- **Backend**: Render.com or Fly.io (free tier)
- **Database**: Neon or Supabase (free PostgreSQL)

### Option B: Full Vercel (Complex)
- Requires rewriting backend as Vercel serverless functions
- Not recommended for NestJS apps
- Would need to:
  1. Convert all controllers to API routes
  2. Remove TypeORM (use Prisma instead)
  3. Restructure authentication
  4. Handle cold starts

## Quick Deploy: Frontend Only on Vercel

If you want to deploy just the frontend to Vercel and keep backend elsewhere:

### 1. Create `vercel.json` in frontend directory
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "devCommand": "npm start",
  "installCommand": "npm install",
  "framework": "create-react-app",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Deploy Frontend
```bash
cd frontend
npx vercel --prod
```

### 3. Set Environment Variable
When prompted, add:
```
REACT_APP_API_URL=<your-backend-url>
```

## Recommended: Use Render for Full Stack
See `DEPLOYMENT_RENDER.md` for the easiest free full-stack deployment.
