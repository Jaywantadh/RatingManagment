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
