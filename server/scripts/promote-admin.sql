-- Run once to grant admin (replace email).
-- Example: psql $DATABASE_URL -f server/scripts/promote-admin.sql
-- Or: UPDATE users SET role = 'admin' WHERE email = 'you@example.com';

UPDATE users
SET role = 'admin'
WHERE email = 'CHANGE_ME@example.com';
