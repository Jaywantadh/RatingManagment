-- RateIN Database Schema
-- PostgreSQL Database Schema for Rating System

-- Create custom types
CREATE TYPE user_role AS ENUM ('SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER');
CREATE TYPE rating_value AS ENUM ('1', '2', '3', '4', '5');

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(60) NOT NULL CHECK (LENGTH(name) >= 4),
    role user_role NOT NULL DEFAULT 'NORMAL_USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stores table
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL CHECK (LENGTH(name) >= 4),
    address VARCHAR(400) NOT NULL CHECK (LENGTH(address) <= 400),
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ratings table
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    rating_value rating_value NOT NULL,
    comment TEXT CHECK (LENGTH(comment) <= 500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, store_id) -- One rating per user per store
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_stores_owner_id ON stores(owner_id);
CREATE INDEX idx_stores_name ON stores(name);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_ratings_store_id ON ratings(store_id);
CREATE INDEX idx_ratings_rating_value ON ratings(rating_value);
CREATE INDEX idx_ratings_created_at ON ratings(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for common queries
CREATE VIEW store_ratings_summary AS
SELECT 
    s.id,
    s.name,
    s.address,
    u.name as owner_name,
    COUNT(r.id) as total_ratings,
    AVG(r.rating_value::text::integer) as average_rating,
    MIN(r.created_at) as first_rating,
    MAX(r.created_at) as last_rating
FROM stores s
LEFT JOIN ratings r ON s.id = r.store_id
LEFT JOIN users u ON s.owner_id = u.id
GROUP BY s.id, s.name, s.address, u.name;

CREATE VIEW user_rating_stats AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    COUNT(r.id) as total_ratings_given,
    AVG(r.rating_value::text::integer) as average_rating_given
FROM users u
LEFT JOIN ratings r ON u.id = r.user_id
GROUP BY u.id, u.name, u.email, u.role;

-- Insert sample data for testing with specific passwords
-- Password: Admin123! (for admin)
-- Password: Store123! (for store owner)  
-- Password: User123! (for normal user)
INSERT INTO users (email, password, name, role) VALUES
('admin@ratein.com', '$2b$12$PvPfniXfsCPZ2CLBjE4R7OlZN7aH8LKF32YRrRisUWva4N.raIhbG', 'Admin User', 'SYSTEM_ADMIN'),
('storeowner@ratein.com', '$2b$12$tz2.hmtixWScau331SST4.TKvuu1jQOvzKbcS95eden1Fc4nP.ZD6', 'Store Owner', 'STORE_OWNER'),
('normaluser@ratein.com', '$2b$12$hZ8pXZkDc3Wx35tXxAF3JevxHZDqO1J8s/J2MhuvklCo4h9kPBHLS', 'John Doe', 'NORMAL_USER');

-- Insert sample stores
INSERT INTO stores (name, address, owner_id) VALUES
('Tech Store', '123 Main Street, Tech City, TC 12345', 2),
('Coffee Shop', '456 Oak Avenue, Coffee Town, CT 67890', 2);

-- Insert sample ratings
INSERT INTO ratings (user_id, store_id, rating_value, comment) VALUES
(3, 1, '5', 'Great selection of gadgets!'),
(3, 2, '4', 'Good coffee, friendly staff'),
(1, 1, '4', 'Well organized store'),
(1, 2, '5', 'Excellent coffee quality');

-- Create function to validate password complexity
CREATE OR REPLACE FUNCTION validate_password(password VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check length (8-16 characters)
    IF LENGTH(password) < 8 OR LENGTH(password) > 16 THEN
        RETURN FALSE;
    END IF;
    
    -- Check for at least 1 uppercase letter
    IF password !~ '[A-Z]' THEN
        RETURN FALSE;
    END IF;
    
    -- Check for at least 1 special character
    IF password !~ '[!@#$%^&*()_+\-=\[\]{};'':"\\|,.<>\/?]' THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create function to get store statistics
CREATE OR REPLACE FUNCTION get_store_stats(store_id INTEGER)
RETURNS TABLE(
    total_ratings BIGINT,
    average_rating NUMERIC,
    rating_distribution JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(r.id)::BIGINT as total_ratings,
        ROUND(AVG(r.rating_value::text::integer), 2) as average_rating,
        json_build_object(
            '1', COUNT(CASE WHEN r.rating_value = '1' THEN 1 END),
            '2', COUNT(CASE WHEN r.rating_value = '2' THEN 1 END),
            '3', COUNT(CASE WHEN r.rating_value = '3' THEN 1 END),
            '4', COUNT(CASE WHEN r.rating_value = '4' THEN 1 END),
            '5', COUNT(CASE WHEN r.rating_value = '5' THEN 1 END)
        ) as rating_distribution
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE s.id = store_id
    GROUP BY s.id;
END;
$$ LANGUAGE plpgsql;
