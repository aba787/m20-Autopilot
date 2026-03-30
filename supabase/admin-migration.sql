-- ============================================================
-- M20 Autopilot — Admin Role Migration
-- Run this in Supabase SQL Editor AFTER the main schema
-- ============================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

INSERT INTO profiles (email, password_hash, full_name, bot_mode, target_acos, role)
VALUES
  ('admin@test.com', '$2b$10$sBIWj.fA9q2SAlqyt..NX.UD9CWZg59zgo9qCfcMtOxq4L8K2RVSe', 'Admin User', 'auto', 25.00, 'admin'),
  ('user@test.com',  '$2b$10$QTfISOQF48NdqVh7vHG.wueVSPlMB3Jld2E4bNf7Usw1780mLVxlO',  'Regular User',  'safe', 30.00, 'user')
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  full_name     = EXCLUDED.full_name,
  role          = EXCLUDED.role;
