-- database/seed-admin.sql
-- Run this script to insert the default admin user.
-- Email: [EMAIL_ADDRESS]
-- Password: [PASSWORD]

INSERT INTO users (
    name, 
    email, 
    password_hash, 
    role, 
    email_verified_at,
    created_at,
    updated_at
) VALUES (
    'System Admin', 
    'admin@riseupmora.lk', 
    '$2b$10$aSrp372y8uyQ1rwhyf5WQ.MbOwD2bgwVOQAID92RkfYpTqT4DcOU2', 
    'admin', 
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;
