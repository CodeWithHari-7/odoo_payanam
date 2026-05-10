# Travel Loop - Backend

This is the Node.js Express backend for the Travel Loop booking platform. It provides APIs for authentication, route searching, schedule management, and booking creation. It is built using Prisma ORM and PostgreSQL.

## Architecture Structure

- `config/`: Configuration setup (e.g., environment setup)
- `controllers/`: Handles the business logic for each route
- `middlewares/`: Express middlewares (JWT Auth, Error Handling)
- `prisma/`: Prisma schema and migrations
- `routes/`: Express route definitions connecting endpoints to controllers
- `server.js`: The main entry point of the application

## Prerequisites

- Node.js (v18+)
- PostgreSQL Database

## Local Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Rename `.env.example` to `.env` and configure your credentials.
   ```env
   PORT=5000
   DATABASE_URL="postgresql://username:password@localhost:5432/travel_loop?schema=public"
   JWT_SECRET="your_secure_random_string"
   CLIENT_URL="http://localhost:5173"
   ```

3. **Database Setup**
   Run the following commands to generate the Prisma client and push the schema to your PostgreSQL database.
   ```bash
   npx prisma generate
   npx prisma db push
   ```
   *(Optional)* If you want to use migrations instead of db push:
   `npx prisma migrate dev --name init`

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`.

## Deployment Guide (Render)

This backend is structured and ready for easy deployment on [Render](https://render.com/).

### 1. Database Setup (Render PostgreSQL)
1. Go to the Render Dashboard and click **New** -> **PostgreSQL**.
2. Name it `travel-loop-db` and select your region.
3. Once created, copy the **Internal Database URL** (for the web service) and **External Database URL** (for your local Prisma usage if needed).

### 2. Backend Deployment (Render Web Service)
1. In the Render Dashboard, click **New** -> **Web Service**.
2. Connect your GitHub repository.
3. **Root Directory**: `backend`
4. **Environment**: `Node`
5. **Build Command**: `npm install && npx prisma generate`
6. **Start Command**: `npm start`
7. Add the following **Environment Variables**:
   - `DATABASE_URL`: (Paste the Internal Database URL from step 1)
   - `JWT_SECRET`: (Generate a secure random string)
   - `CLIENT_URL`: (The URL where your React frontend is hosted, e.g., `https://travel-loop.vercel.app`)

8. Click **Create Web Service**. Render will automatically build and deploy your Express API!

## Frontend Connection

In your existing React frontend, you will need to point API requests to your new backend URL.

1. In the frontend `travel-loop` folder, create a `.env` file (if it doesn't exist).
2. Add: `VITE_API_URL=http://localhost:5000` (for local development) or `VITE_API_URL=https://your-render-app-url.onrender.com` (for production).
3. Prefix your fetch calls, for example: `fetch(`${import.meta.env.VITE_API_URL}/api/routes/search`)`
