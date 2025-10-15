-- Sample seed data for testing

-- Insert sample users
INSERT INTO users (name, email) VALUES
('John Doe', 'john.doe@example.com'),
('Jane Smith', 'jane.smith@example.com'),
('Alice Johnson', 'alice.johnson@example.com'),
('Bob Williams', 'bob.williams@example.com'),
('Charlie Brown', 'charlie.brown@example.com');

-- Insert sample events (mix of past and future events)
INSERT INTO events (title, date_time, location, capacity) VALUES
('Tech Conference 2025', '2025-11-15 09:00:00', 'San Francisco', 500),
('Web Development Workshop', '2025-10-20 14:00:00', 'New York', 50),
('AI & ML Summit', '2025-12-01 10:00:00', 'Boston', 1000),
('Startup Networking Event', '2025-10-25 18:00:00', 'Austin', 100),
('Cloud Computing Seminar', '2025-11-10 13:00:00', 'Seattle', 200),
('Past Event Example', '2024-06-15 10:00:00', 'Chicago', 150);

-- Insert sample registrations
-- User 1 registered for multiple events
INSERT INTO registrations (user_id, event_id) VALUES
(1, 1),
(1, 2),
(1, 3);

-- User 2 registered for some events
INSERT INTO registrations (user_id, event_id) VALUES
(2, 1),
(2, 4);

-- User 3 registered for one event
INSERT INTO registrations (user_id, event_id) VALUES
(3, 2),
(3, 3),
(3, 5);

-- User 4 registered for events
INSERT INTO registrations (user_id, event_id) VALUES
(4, 1),
(4, 3);

-- User 5 registered for events
INSERT INTO registrations (user_id, event_id) VALUES
(5, 4),
(5, 5);

-- Display summary
SELECT 'Seed data inserted successfully!' as message;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_events FROM events;
SELECT COUNT(*) as total_registrations FROM registrations;