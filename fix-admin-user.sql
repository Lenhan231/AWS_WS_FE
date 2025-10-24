-- Quick fix: Insert admin user for Basic Auth mode
-- Run this if /api/v1/auth/me returns 404

INSERT INTO users (cognito_sub, email, first_name, last_name, phone_number, role, active, profile_image_url, created_at, updated_at)
VALUES ('seed-admin-sub', 'admin@easybody.com', 'System', 'Admin', '+8488880001', 'ADMIN', TRUE, NULL, NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
    cognito_sub = 'seed-admin-sub',
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone_number = EXCLUDED.phone_number,
    role = EXCLUDED.role,
    active = EXCLUDED.active,
    updated_at = NOW();

-- Verify the user was created
SELECT id, cognito_sub, email, first_name, last_name, role FROM users WHERE email = 'admin@easybody.com';
