-- ============================================================
-- M20 Autopilot — Supabase Schema
-- Run this in Supabase SQL Editor (Project > SQL Editor > New query)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           TEXT UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  full_name       TEXT,
  avatar_url      TEXT,
  bot_mode        TEXT NOT NULL DEFAULT 'safe' CHECK (bot_mode IN ('safe','semi','auto')),
  target_acos     NUMERIC(5,2) NOT NULL DEFAULT 30.00,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Amazon Connections ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS amazon_connections (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  profile_id       TEXT NOT NULL,
  marketplace      TEXT NOT NULL DEFAULT 'US',
  seller_name      TEXT,
  access_token     TEXT,
  refresh_token    TEXT,
  token_expires_at TIMESTAMPTZ,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  last_synced_at   TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Campaigns ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS campaigns (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amazon_campaign_id TEXT NOT NULL,
  name               TEXT NOT NULL,
  type               TEXT NOT NULL DEFAULT 'Sponsored Products',
  status             TEXT NOT NULL DEFAULT 'Active',
  budget             NUMERIC(10,2) NOT NULL DEFAULT 0,
  spend              NUMERIC(10,2) NOT NULL DEFAULT 0,
  sales              NUMERIC(10,2) NOT NULL DEFAULT 0,
  clicks             INTEGER NOT NULL DEFAULT 0,
  impressions        INTEGER NOT NULL DEFAULT 0,
  orders             INTEGER NOT NULL DEFAULT 0,
  acos               NUMERIC(6,2) NOT NULL DEFAULT 0,
  roas               NUMERIC(6,2) NOT NULL DEFAULT 0,
  ctr                NUMERIC(6,4) NOT NULL DEFAULT 0,
  date               DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, amazon_campaign_id, date)
);

-- ── Keywords ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS keywords (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  keyword     TEXT NOT NULL,
  match_type  TEXT NOT NULL DEFAULT 'Broad',
  bid         NUMERIC(8,2) NOT NULL DEFAULT 0,
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks      INTEGER NOT NULL DEFAULT 0,
  spend       NUMERIC(10,2) NOT NULL DEFAULT 0,
  sales       NUMERIC(10,2) NOT NULL DEFAULT 0,
  acos        NUMERIC(6,2) NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'Active',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Action Logs ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS action_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  keyword_id  UUID REFERENCES keywords(id) ON DELETE SET NULL,
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

-- ── Notifications ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info','warning','error','success')),
  read        BOOLEAN NOT NULL DEFAULT FALSE,
  link        TEXT,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Ad Generations ────────────────────────────────────────────────────────────
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

-- ── Accounting Snapshots ──────────────────────────────────────────────────────
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

-- ── Job Runs ──────────────────────────────────────────────────────────────────
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

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_campaigns_user_date      ON campaigns(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_action_logs_user         ON action_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_accounting_user_date     ON accounting_snapshots(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_keywords_user_campaign   ON keywords(user_id, campaign_id);

-- ── Auto-update updated_at ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row-Level Security (optional, enable if using Supabase auth) ──────────────
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
-- etc.
