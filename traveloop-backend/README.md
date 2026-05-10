# Traveloop AI Backend

This is the fully collaborative, highly relational PostgreSQL backend for Traveloop AI built for your hackathon. It supports multiple users, trip planning, geolocation mapping, and intelligent expense splitting among trip collaborators.

## Tech Stack
- Node.js & Express.js
- PostgreSQL (via `pg` package)
- JWT Authentication & bcrypt
- Built specifically for Render deployments

## Folder Structure (MVC)
- `config/db.js`: PostgreSQL connection pooling optimized for Render's SSL setup.
- `controllers/`: Handles all business logic (Auth, Trips, Stops, Expenses, etc).
- `routes/`: Maps specific API endpoints to their respective controllers.
- `middleware/`: Houses `authMiddleware` (JWT protection) and `errorMiddleware` (centralized error catching).
- `schema.sql`: Raw SQL definition of 10 fully normalized tables with primary keys, cascading deletes, and strict relational mappings.

## Local Setup

1. **Database**
   You need a running instance of PostgreSQL. Create a database called `traveloop`.
   Run the SQL commands found in `schema.sql` to generate all 10 tables.

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in your details:
   ```env
   PORT=5000
   DATABASE_URL=postgres://user:password@localhost:5432/traveloop
   JWT_SECRET=super_secret_hackathon_key_123
   ```

3. **Start the Server**
   ```bash
   npm install
   npm run dev
   ```

## Render Deployment Guide

This backend is perfectly configured for a seamless deployment on [Render](https://render.com/).

### Step 1: Create the Database
1. Go to your Render Dashboard and create a new **PostgreSQL** instance.
2. Once deployed, copy the **Internal Database URL** (e.g., `postgres://user...`).

### Step 2: Deploy the Web Service
1. In your Render Dashboard, create a new **Web Service**.
2. Connect this GitHub repository.
3. Set the **Root Directory** to `traveloop-backend`.
4. Set **Environment** to `Node`.
5. Set **Build Command** to: `npm install`
6. Set **Start Command** to: `npm start`
7. Add the Environment Variables:
   - `DATABASE_URL`: *[Paste Internal Database URL]*
   - `JWT_SECRET`: *[Random Secret String]*

Render will handle the rest! The database pool in `config/db.js` is already configured with `ssl: { rejectUnauthorized: false }` to prevent connection rejection.

## Core API Architecture

All endpoints follow this strict JSON format:
```json
{
  "success": true,
  "data": { ... }
}
```

### Examples
- **Register**: `POST /api/auth/register` (name, email, password)
- **Create Trip**: `POST /api/trips` (title, destination, start_date, end_date)
- **Add Stop**: `POST /api/stops` (trip_id, name, lat, lng, arrival_time, departure_time)
- **Add Expense**: `POST /api/expenses` (trip_id, description, amount) -> *Automatically splits cost across all trip members in the `expense_splits` table!*
