-- Admin role migration (Supabase Auth version)
-- Run AFTER fix-and-seed.sql

-- Make sure role column exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

-- To make a user admin, run:
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@test.com';
