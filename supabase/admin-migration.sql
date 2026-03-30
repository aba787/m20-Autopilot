-- ============================================================
-- M20 Autopilot — Admin Role Migration
-- Run this in Supabase SQL Editor AFTER the main schema
-- ============================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

INSERT INTO profiles (email, password_hash, full_name, bot_mode, target_acos, role)
VALUES
  ('admin@test.com', '$2b$12$GCCvs/4A6WZ7Wlrhv/g/G.1bBt/F9STJLk/G7.VSU2mEQHiMr8Mpi', 'Admin User', 'auto', 25.00, 'admin'),
  ('user@test.com',  '$2b$12$vUB70nGR7UYthi4UZWS28u.zJBlZc9ZnFY9Z6a/ljQeEHjFRSww32',  'Test User',  'safe', 30.00, 'user')
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  full_name     = EXCLUDED.full_name,
  role          = EXCLUDED.role;
