-- RateIN Database Basic Setup
-- Let TypeORM handle the schema creation

-- Insert sample data for testing with specific passwords
-- Password: Admin123! (for admin)
-- Password: Store123! (for store owner)  
-- Password: User123! (for normal user)

-- Wait a moment for TypeORM to create the tables first
\timing on

-- Check if tables exist before inserting data
DO $$
BEGIN
    -- Wait and check if users table exists, if not, wait
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        RAISE NOTICE 'Tables not ready yet, will be handled by TypeORM...';
        RETURN;
    END IF;
    
    -- Insert sample users only if table exists and is empty
    IF NOT EXISTS (SELECT 1 FROM users LIMIT 1) THEN
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
        
        RAISE NOTICE 'Sample data inserted successfully!';
    ELSE
        RAISE NOTICE 'Sample data already exists!';
    END IF;
    
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Error inserting sample data: %', SQLERRM;
END $$;
