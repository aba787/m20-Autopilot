-- ============================================================
-- M20 Autopilot — Admin Role Migration
-- Run this in Supabase SQL Editor AFTER the main schema
-- ============================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

INSERT INTO profiles (email, password_hash, full_name, bot_mode, target_acos, role)
VALUES
  ('admin@test.com', '$2b$12$HCG2TjkoG/Z1.8Wbb5Ctwumhb3vJa5v/jok7IJxS0xDU4bbJ7Pczy', 'Admin User', 'auto', 25.00, 'admin'),
  ('user@test.com',  '$2b$12$aTe8v7qxEDk39DzsecdsQ.Zu1iZp347CHS/.u2ytucVqBlqv1q536',  'Test User',  'safe', 30.00, 'user')
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  full_name     = EXCLUDED.full_name,
  role          = EXCLUDED.role;
