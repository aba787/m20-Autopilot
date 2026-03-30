-- ============================================================
-- M20 Autopilot — Database Setup (Supabase Auth)
-- Copy ALL of this and paste into Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste > Run
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  full_name  TEXT,
  avatar_url TEXT,
  bot_mode   TEXT NOT NULL DEFAULT 'safe',
  target_acos NUMERIC(5,2) DEFAULT 30.00,
  role       TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add any missing columns (safe for existing tables)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS target_acos NUMERIC(5,2) DEFAULT 30.00;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bot_mode TEXT NOT NULL DEFAULT 'safe';

-- Link profiles.id to auth.users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'profiles_id_fkey'
    AND table_name = 'profiles'
  ) THEN
    BEGIN
      ALTER TABLE profiles
        ADD CONSTRAINT profiles_id_fkey
        FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'Could not add foreign key to auth.users';
    END;
  END IF;
END $$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, bot_mode, target_acos, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'safe',
    30.00,
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create all other tables
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

CREATE TABLE IF NOT EXISTS action_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campaign_id UUID,
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

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Service role full access" ON profiles;
CREATE POLICY "Service role full access" ON profiles
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ============================================================
-- After running this SQL, call POST /api/seed to create test users.
-- The seed endpoint creates users in Supabase Auth + profiles automatically.
-- ============================================================
