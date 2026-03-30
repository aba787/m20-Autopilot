-- ============================================================
-- M20 Autopilot — Admin Role Migration
-- Run this in Supabase SQL Editor AFTER the main schema
-- ============================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

INSERT INTO profiles (email, password_hash, full_name, bot_mode, target_acos, role)
VALUES
  ('admin@test.com', '$2b$10$tMp5tAQZOrP15ksyYSwVw.f7cAseRV8ybOlSxLxyI.CigiG61fMmy', 'Admin User', 'auto', 25.00, 'admin'),
  ('user@test.com',  '$2b$10$xaCUzD42zARKaqkaicRV4uVJ1kfu8zUQL30UKSebzyFZ6cRwWLOUK',  'Test User',  'safe', 30.00, 'user')
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  full_name     = EXCLUDED.full_name,
  role          = EXCLUDED.role;
