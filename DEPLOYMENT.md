# 🚀 RateIN Deployment Guide

This guide provides instructions for deploying the RateIN project using Docker Compose (recommended) or manually.

## 🐳 Docker Deployment (Recommended)

The easiest way to run the entire stack (Database, Backend, Frontend) is using Docker Compose.

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop) installed and running.

### Steps

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd RateIN
    ```

2.  **Start the application**:
    ```bash
    docker-compose up --build
    ```
    *The `--build` flag ensures that the images are built from the latest source code.*

3.  **Access the application**:
    - **Frontend**: [http://localhost:3001](http://localhost:3001)
    - **Backend API**: [http://localhost:3000](http://localhost:3000)
    - **Database**: Port `5432`

4.  **Stop the application**:
    ```bash
    docker-compose down
    ```

---

## 🛠️ Manual Deployment

If you prefer to run the services individually without Docker.

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)

### 1. Database Setup
Ensure PostgreSQL is running and create a database named `ratein`.
```bash
# Example using psql
CREATE DATABASE ratein;
```

### 2. Backend Setup
1.  Navigate to the root directory:
    ```bash
    cd RateIN
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment:
    - Copy `.env.example` to `.env`
    - Update `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD` in `.env` to match your local PostgreSQL setup.
4.  Run Migrations:
    ```bash
    npm run migration:run
    ```
5.  Start the Server:
    ```bash
    npm run start:dev
    ```

### 3. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Development Server:
    ```bash
    npm start
    ```
    The frontend will be available at [http://localhost:3001](http://localhost:3001).

---

## 🔧 Troubleshooting

-   **Port Conflicts**: Ensure ports `3000`, `3001`, and `5432` are not in use.
-   **Database Connection**: If running manually, double-check your `.env` database credentials.
-   **Docker Issues**: If containers fail to start, check the logs with `docker-compose logs`.

---

## ☁️ Online Hosting (Railway)

We recommend **Railway** for hosting this project because it automatically detects Dockerfiles and handles the database.

### Prerequisites
1.  **GitHub Account**: Ensure this project is pushed to a GitHub repository.
2.  **Railway Account**: Sign up at [railway.app](https://railway.app).

### Step-by-Step Deployment

#### 1. Push to GitHub
Ensure your latest changes (including the new `Dockerfile`s) are pushed to GitHub.
```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

#### 2. Create New Project on Railway
1.  Go to your Railway Dashboard.
2.  Click **"New Project"** > **"Deploy from GitHub repo"**.
3.  Select your repository (`RatingManagment`).
4.  Click **"Deploy Now"**.

#### 3. Configure Services
Railway might initially try to deploy just one service or fail. We need to set up the **Backend**, **Frontend**, and **Database**.

**A. Database (PostgreSQL)**
1.  In your project canvas, right-click (or click "New") > **Database** > **PostgreSQL**.
2.  This will create a database service.

**B. Backend Service**
1.  Click on the service created from your repo (it might be named after your repo).
2.  Go to **Settings**.
3.  **Root Directory**: Leave as `/` (default).
4.  **Variables**: Add the following:
    - `PORT`: `3000` (Railway usually sets this automatically, but good to be safe)
    - `DB_HOST`: `${{PostgreSQL.HOST}}` (Use Railway's variable reference)
    - `DB_PORT`: `${{PostgreSQL.PORT}}`
    - `DB_USERNAME`: `${{PostgreSQL.USER}}`
    - `DB_PASSWORD`: `${{PostgreSQL.PASSWORD}}`
    - `DB_DATABASE`: `${{PostgreSQL.DATABASE}}`
    - `JWT_SECRET`: (Generate a strong secret)
    - `FRONTEND_URL`: (We will add this after deploying the frontend)
5.  **Networking**: Click "Generate Domain" to get a public URL (e.g., `backend-production.up.railway.app`).

**C. Frontend Service**
1.  In the canvas, click **"New"** > **"GitHub Repo"** > Select the same repo again.
2.  Click on this new service.
3.  Go to **Settings**.
4.  **Root Directory**: Change to `/frontend`. This is CRITICAL.
5.  **Variables**:
    - `REACT_APP_API_URL`: Paste the Backend URL from step B (e.g., `https://backend-production.up.railway.app`).
6.  **Networking**: Click "Generate Domain" to get a public URL.

#### 4. Finalize Connection
1.  Go back to the **Backend Service** > **Variables**.
2.  Update `FRONTEND_URL` with the Frontend's domain you just generated.
3.  Redeploy the Backend (it usually auto-deploys on variable change).

### 🎉 Done!
Your application is now live.
- **Frontend**: Access via the Frontend Domain.
- **Backend**: Access via the Backend Domain.

