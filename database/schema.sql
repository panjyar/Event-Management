-- Drop existing tables if they exist
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date_time TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0 AND capacity <= 1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Registrations table (Many-to-Many relationship)
CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);

-- Create indexes for better performance
CREATE INDEX idx_events_date_time ON events(date_time);
CREATE INDEX idx_events_location ON events(location);
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_event_id ON registrations(event_id);

-- Comments for documentation
COMMENT ON TABLE users IS 'Stores user information';
COMMENT ON TABLE events IS 'Stores event information with capacity limits';
COMMENT ON TABLE registrations IS 'Many-to-many relationship between users and events';
COMMENT ON COLUMN events.capacity IS 'Maximum capacity per event (1-1000)';
COMMENT ON CONSTRAINT registrations_user_id_event_id_key ON registrations IS 'Prevents duplicate registrations';