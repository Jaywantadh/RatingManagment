# 🚀 Deploy to Render.com (Free)

Render.com offers a generous free tier and works seamlessly with your existing Docker setup.

## Prerequisites
- GitHub account with your code pushed
- Render.com account (sign up at https://render.com)

## Step-by-Step Deployment

### 1. Create PostgreSQL Database
1. Go to Render Dashboard
2. Click **"New +"** → **"PostgreSQL"**
3. Name: `ratein-db`
4. Database: `ratein`
5. User: `ratein_user`
6. Region: Choose closest to you
7. Click **"Create Database"**
8. **Save the Internal Database URL** (you'll need this)

### 2. Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `ratein-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: Leave blank
   - **Environment**: `Docker`
   - **Docker Build Context Directory**: `.`
   - **Dockerfile Path**: `./Dockerfile`
   - **Instance Type**: `Free`

4. **Environment Variables** (click "Advanced"):
   ```
   DATABASE_URL=<paste Internal Database URL from step 1>
   JWT_SECRET=<generate a random string>
   PORT=10000
   FRONTEND_URL=<leave blank for now>
   ```

5. Click **"Create Web Service"**
6. Wait for deployment (5-10 minutes)
7. **Copy the service URL** (e.g., `https://ratein-backend.onrender.com`)

### 3. Deploy Frontend
1. Click **"New +"** → **"Web Service"**
2. Connect same GitHub repository
3. Configure:
   - **Name**: `ratein-frontend`
   - **Region**: Same as backend
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Environment**: `Docker`
   - **Docker Build Context Directory**: `frontend`
   - **Dockerfile Path**: `./Dockerfile`
   - **Instance Type**: `Free`

4. **Environment Variables**:
   ```
   REACT_APP_API_URL=<paste backend URL from step 2>
   ```

5. Click **"Create Web Service"**
6. **Copy the frontend URL** (e.g., `https://ratein-frontend.onrender.com`)

### 4. Update Backend CORS
1. Go back to Backend service
2. Add environment variable:
   ```
   FRONTEND_URL=<paste frontend URL from step 3>
   ```
3. Service will auto-redeploy

## 🎉 Done!
Your app is now live on Render's free tier!

## ⚠️ Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month (enough for 1 service running 24/7)

## 💡 Tips
- Use Render's "Keep Alive" feature or a cron job to ping your app every 14 minutes
- Database has 90-day expiration on free tier (can be extended)
