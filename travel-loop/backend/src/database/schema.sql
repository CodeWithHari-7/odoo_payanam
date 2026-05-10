-- Traveloop AI Database Schema

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    creator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Trip Members (Collaborators)
CREATE TABLE IF NOT EXISTS trip_members (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- e.g., 'admin', 'member'
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(trip_id, user_id)
);

-- 4. Cities (Dictionary Table)
CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100),
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8)
);

-- 5. Stops (Itinerary locations)
CREATE TABLE IF NOT EXISTS stops (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
    arrival_date DATE,
    departure_date DATE,
    order_index INTEGER NOT NULL
);

-- 6. Activities
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    stop_id INTEGER NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    cost DECIMAL(10, 2) DEFAULT 0.00
);

-- 7. Expenses
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    paid_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    description VARCHAR(255),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Expense Splits
CREATE TABLE IF NOT EXISTS expense_splits (
    id SERIAL PRIMARY KEY,
    expense_id INTEGER NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount_owed DECIMAL(10, 2) NOT NULL
);

-- 9. Votes
CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vote_type VARCHAR(10) NOT NULL, -- 'up', 'down'
    UNIQUE(activity_id, user_id)
);
