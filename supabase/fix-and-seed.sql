-- ============================================================
-- M20 Autopilot — Fix missing columns + Create test user
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add missing columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS target_acos NUMERIC(5,2) DEFAULT 30.00;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create missing tables
CREATE TABLE IF NOT EXISTS action_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  keyword_id  UUID,
  action_type TEXT NOT NULL,
  actor       TEXT NOT NULL DEFAULT 'ai' CHECK (actor IN ('ai','user')),
  mode        TEXT NOT NULL DEFAULT 'safe' CHECK (mode IN ('safe','semi','auto')),
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending','approved','rejected','executed','failed')),
  payload     JSONB NOT NULL DEFAULT '{}',
  result      JSONB,
  error       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ad_generations (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  category     TEXT,
  brand        TEXT,
  keywords     TEXT[] NOT NULL DEFAULT '{}',
  headlines    TEXT[] NOT NULL DEFAULT '{}',
  description  TEXT NOT NULL DEFAULT '',
  targeting    TEXT NOT NULL DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounting_snapshots (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date         DATE NOT NULL,
  revenue      NUMERIC(12,2) NOT NULL DEFAULT 0,
  ad_spend     NUMERIC(12,2) NOT NULL DEFAULT 0,
  cogs         NUMERIC(12,2) NOT NULL DEFAULT 0,
  gross_profit NUMERIC(12,2) NOT NULL DEFAULT 0,
  net_profit   NUMERIC(12,2) NOT NULL DEFAULT 0,
  acos         NUMERIC(6,2)  NOT NULL DEFAULT 0,
  roas         NUMERIC(6,2)  NOT NULL DEFAULT 0,
  orders       INTEGER        NOT NULL DEFAULT 0,
  units        INTEGER        NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE TABLE IF NOT EXISTS job_runs (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_name           TEXT NOT NULL,
  user_id            UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status             TEXT NOT NULL DEFAULT 'running'
                     CHECK (status IN ('running','completed','failed')),
  started_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at        TIMESTAMPTZ,
  records_processed  INTEGER NOT NULL DEFAULT 0,
  error              TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_user_date       ON campaigns(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_action_logs_user          ON action_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_accounting_user_date      ON accounting_snapshots(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_keywords_user_campaign    ON keywords(user_id, campaign_id);

-- Auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Insert test user (password: Test1234!)
-- bcrypt hash of 'Test1234!' with 12 rounds
INSERT INTO profiles (email, password_hash, full_name, bot_mode, target_acos)
VALUES (
  'test@example.com',
  '$2b$12$vZYIHQ7K97INqY/8SD67sOF2Xsvun5IKTxnyhlUIJMJewrvlI2Uci',
  'Test User',
  'safe',
  30.00
)
ON CONFLICT (email) DO NOTHING;
