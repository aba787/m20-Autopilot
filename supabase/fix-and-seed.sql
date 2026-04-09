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
  subscription_plan TEXT NOT NULL DEFAULT 'free',
  subscription_status TEXT NOT NULL DEFAULT 'active',
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS target_acos NUMERIC(5,2) DEFAULT 30.00;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bot_mode TEXT NOT NULL DEFAULT 'safe';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS automation_enabled BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_budget NUMERIC(10,2) NOT NULL DEFAULT 50.00;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'en';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tone TEXT NOT NULL DEFAULT 'friendly';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_plan TEXT NOT NULL DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN NOT NULL DEFAULT TRUE;

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

-- ============================================================
-- Amazon Connections
-- ============================================================
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

-- ============================================================
-- Campaigns
-- ============================================================
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

-- ============================================================
-- Ad Groups (NEW)
-- ============================================================
CREATE TABLE IF NOT EXISTS ad_groups (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campaign_id         UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  amazon_ad_group_id  TEXT NOT NULL,
  name                TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'Active',
  default_bid         NUMERIC(8,2) NOT NULL DEFAULT 1.00,
  targeting_type      TEXT NOT NULL DEFAULT 'keyword',
  spend               NUMERIC(10,2) NOT NULL DEFAULT 0,
  sales               NUMERIC(10,2) NOT NULL DEFAULT 0,
  clicks              INTEGER NOT NULL DEFAULT 0,
  impressions         INTEGER NOT NULL DEFAULT 0,
  acos                NUMERIC(6,2) NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, amazon_ad_group_id)
);

-- ============================================================
-- Ads (NEW)
-- ============================================================
CREATE TABLE IF NOT EXISTS ads (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ad_group_id     UUID NOT NULL REFERENCES ad_groups(id) ON DELETE CASCADE,
  campaign_id     UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  amazon_ad_id    TEXT NOT NULL,
  asin            TEXT NOT NULL,
  sku             TEXT,
  status          TEXT NOT NULL DEFAULT 'Active',
  spend           NUMERIC(10,2) NOT NULL DEFAULT 0,
  sales           NUMERIC(10,2) NOT NULL DEFAULT 0,
  clicks          INTEGER NOT NULL DEFAULT 0,
  impressions     INTEGER NOT NULL DEFAULT 0,
  orders          INTEGER NOT NULL DEFAULT 0,
  acos            NUMERIC(6,2) NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, amazon_ad_id)
);

-- ============================================================
-- Keywords (updated)
-- ============================================================
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

ALTER TABLE keywords ADD COLUMN IF NOT EXISTS ad_group_id UUID REFERENCES ad_groups(id) ON DELETE CASCADE;

-- ============================================================
-- Search Terms (NEW)
-- ============================================================
CREATE TABLE IF NOT EXISTS search_terms (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campaign_id     UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  ad_group_id     UUID REFERENCES ad_groups(id) ON DELETE CASCADE,
  keyword_id      UUID REFERENCES keywords(id) ON DELETE SET NULL,
  search_term     TEXT NOT NULL,
  impressions     INTEGER NOT NULL DEFAULT 0,
  clicks          INTEGER NOT NULL DEFAULT 0,
  spend           NUMERIC(10,2) NOT NULL DEFAULT 0,
  sales           NUMERIC(10,2) NOT NULL DEFAULT 0,
  orders          INTEGER NOT NULL DEFAULT 0,
  acos            NUMERIC(6,2) NOT NULL DEFAULT 0,
  conversion_rate NUMERIC(6,4) NOT NULL DEFAULT 0,
  is_harvested    BOOLEAN NOT NULL DEFAULT FALSE,
  is_negated      BOOLEAN NOT NULL DEFAULT FALSE,
  date            DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, search_term, campaign_id, date)
);

-- ============================================================
-- Negative Keywords (NEW)
-- ============================================================
CREATE TABLE IF NOT EXISTS negative_keywords (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campaign_id     UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  ad_group_id     UUID REFERENCES ad_groups(id) ON DELETE CASCADE,
  keyword         TEXT NOT NULL,
  match_type      TEXT NOT NULL DEFAULT 'Negative Exact',
  source          TEXT NOT NULL DEFAULT 'manual',
  reason          TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, keyword, campaign_id, COALESCE(ad_group_id, '00000000-0000-0000-0000-000000000000'::uuid))
);

-- ============================================================
-- Automation Rules (NEW)
-- ============================================================
CREATE TABLE IF NOT EXISTS rules (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  priority        INTEGER NOT NULL DEFAULT 0,
  condition_type  TEXT NOT NULL DEFAULT 'all',
  conditions      JSONB NOT NULL DEFAULT '[]',
  action_type     TEXT NOT NULL,
  action_params   JSONB NOT NULL DEFAULT '{}',
  scope           TEXT NOT NULL DEFAULT 'campaign',
  last_run_at     TIMESTAMPTZ,
  run_count       INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Subscriptions (NEW)
-- ============================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan              TEXT NOT NULL DEFAULT 'free',
  status            TEXT NOT NULL DEFAULT 'active',
  stripe_customer_id    TEXT,
  stripe_subscription_id TEXT,
  current_period_start  TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ,
  cancel_at_period_end  BOOLEAN NOT NULL DEFAULT FALSE,
  max_campaigns     INTEGER NOT NULL DEFAULT 5,
  max_keywords      INTEGER NOT NULL DEFAULT 100,
  max_products      INTEGER NOT NULL DEFAULT 10,
  ai_queries_limit  INTEGER NOT NULL DEFAULT 20,
  ai_queries_used   INTEGER NOT NULL DEFAULT 0,
  features          JSONB NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- Login Attempts (NEW — Security)
-- ============================================================
CREATE TABLE IF NOT EXISTS login_attempts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT NOT NULL,
  ip_address  TEXT,
  user_agent  TEXT,
  success     BOOLEAN NOT NULL DEFAULT FALSE,
  failure_reason TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Password Reset Tokens (NEW — Security)
-- ============================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token       TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  used        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Existing tables
-- ============================================================
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

CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  asin        TEXT NOT NULL,
  name        TEXT NOT NULL,
  brand       TEXT,
  image       TEXT,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','weak','poor','paused')),
  sales       NUMERIC(12,2) NOT NULL DEFAULT 0,
  spend       NUMERIC(12,2) NOT NULL DEFAULT 0,
  profit      NUMERIC(12,2) NOT NULL DEFAULT 0,
  acos        NUMERIC(6,2) NOT NULL DEFAULT 0,
  tacos       NUMERIC(6,2) NOT NULL DEFAULT 0,
  units       INTEGER NOT NULL DEFAULT 0,
  clicks      INTEGER NOT NULL DEFAULT 0,
  impressions INTEGER NOT NULL DEFAULT 0,
  orders      INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, asin)
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

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campaigns_user_date       ON campaigns(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_action_logs_user          ON action_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_accounting_user_date      ON accounting_snapshots(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_keywords_user_campaign    ON keywords(user_id, campaign_id);
CREATE INDEX IF NOT EXISTS idx_products_user             ON products(user_id, status);
CREATE INDEX IF NOT EXISTS idx_ad_groups_user_campaign   ON ad_groups(user_id, campaign_id);
CREATE INDEX IF NOT EXISTS idx_ads_user_adgroup          ON ads(user_id, ad_group_id);
CREATE INDEX IF NOT EXISTS idx_search_terms_user_date    ON search_terms(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_search_terms_campaign     ON search_terms(campaign_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_negative_keywords_user    ON negative_keywords(user_id, campaign_id);
CREATE INDEX IF NOT EXISTS idx_rules_user_active         ON rules(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user        ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_login_attempts_email      ON login_attempts(email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_password_reset_token      ON password_reset_tokens(token);

-- ============================================================
-- Auto-update triggers
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_ad_groups_updated_at ON ad_groups;
CREATE TRIGGER trg_ad_groups_updated_at
  BEFORE UPDATE ON ad_groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_ads_updated_at ON ads;
CREATE TRIGGER trg_ads_updated_at
  BEFORE UPDATE ON ads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_rules_updated_at ON rules;
CREATE TRIGGER trg_rules_updated_at
  BEFORE UPDATE ON rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RLS Policies — ALL tables
-- ============================================================

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Service role full access profiles" ON profiles;
CREATE POLICY "Service role full access profiles" ON profiles FOR ALL TO service_role USING (true) WITH CHECK (true);

-- amazon_connections
ALTER TABLE amazon_connections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own amazon_connections" ON amazon_connections;
CREATE POLICY "Users own amazon_connections" ON amazon_connections FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role full access amazon_connections" ON amazon_connections;
CREATE POLICY "Service role full access amazon_connections" ON amazon_connections FOR ALL TO service_role USING (true) WITH CHECK (true);

-- campaigns
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own campaigns" ON campaigns;
CREATE POLICY "Users own campaigns" ON campaigns FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role full access campaigns" ON campaigns;
CREATE POLICY "Service role full access campaigns" ON campaigns FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ad_groups
ALTER TABLE ad_groups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own ad_groups" ON ad_groups;
CREATE POLICY "Users own ad_groups" ON ad_groups FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role full access ad_groups" ON ad_groups;
CREATE POLICY "Service role full access ad_groups" ON ad_groups FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ads
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own ads" ON ads;
CREATE POLICY "Users own ads" ON ads FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role full access ads" ON ads;
CREATE POLICY "Service role full access ads" ON ads FOR ALL TO service_role USING (true) WITH CHECK (true);

-- keywords
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own keywords" ON keywords;
CREATE POLICY "Users own keywords" ON keywords FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role full access keywords" ON keywords;
CREATE POLICY "Service role full access keywords" ON keywords FOR ALL TO service_role USING (true) WITH CHECK (true);

-- search_terms
ALTER TABLE search_terms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own search_terms" ON search_terms;
CREATE POLICY "Users own search_terms" ON search_terms FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role full access search_terms" ON search_terms;
CREATE POLICY "Service role full access search_terms" ON search_terms FOR ALL TO service_role USING (true) WITH CHECK (true);

-- negative_keywords
ALTER TABLE negative_keywords ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own negative_keywords" ON negative_keywords;
CREATE POLICY "Users own negative_keywords" ON negative_keywords FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role full access negative_keywords" ON negative_keywords;
CREATE POLICY "Service role full access negative_keywords" ON negative_keywords FOR ALL TO service_role USING (true) WITH CHECK (true);

-- rules
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own rules" ON rules;
CREATE POLICY "Users own rules" ON rules FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role full access rules" ON rules;
CREATE POLICY "Service role full access rules" ON rules FOR ALL TO service_role USING (true) WITH CHECK (true);

-- subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own subscriptions" ON subscriptions;
CREATE POLICY "Users own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role full access subscriptions" ON subscriptions;
CREATE POLICY "Service role full access subscriptions" ON subscriptions FOR ALL TO service_role USING (true) WITH CHECK (true);

-- notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own notifications" ON notifications;
CREATE POLICY "Users own notifications" ON notifications FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role full access notifications" ON notifications;
CREATE POLICY "Service role full access notifications" ON notifications FOR ALL TO service_role USING (true) WITH CHECK (true);

-- action_logs
ALTER TABLE action_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own action_logs" ON action_logs;
CREATE POLICY "Users own action_logs" ON action_logs FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role full access action_logs" ON action_logs;
CREATE POLICY "Service role full access action_logs" ON action_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ad_generations
ALTER TABLE ad_generations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own ad_generations" ON ad_generations;
CREATE POLICY "Users own ad_generations" ON ad_generations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role full access ad_generations" ON ad_generations;
CREATE POLICY "Service role full access ad_generations" ON ad_generations FOR ALL TO service_role USING (true) WITH CHECK (true);

-- products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own products" ON products;
CREATE POLICY "Users own products" ON products FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role full access products" ON products;
CREATE POLICY "Service role full access products" ON products FOR ALL TO service_role USING (true) WITH CHECK (true);

-- accounting_snapshots
ALTER TABLE accounting_snapshots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own accounting_snapshots" ON accounting_snapshots;
CREATE POLICY "Users own accounting_snapshots" ON accounting_snapshots FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role full access accounting_snapshots" ON accounting_snapshots;
CREATE POLICY "Service role full access accounting_snapshots" ON accounting_snapshots FOR ALL TO service_role USING (true) WITH CHECK (true);

-- job_runs
ALTER TABLE job_runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own job_runs" ON job_runs;
CREATE POLICY "Users own job_runs" ON job_runs FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role full access job_runs" ON job_runs;
CREATE POLICY "Service role full access job_runs" ON job_runs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- login_attempts (admin only via service_role)
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access login_attempts" ON login_attempts;
CREATE POLICY "Service role full access login_attempts" ON login_attempts FOR ALL TO service_role USING (true) WITH CHECK (true);

-- password_reset_tokens (service_role only)
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access password_reset_tokens" ON password_reset_tokens;
CREATE POLICY "Service role full access password_reset_tokens" ON password_reset_tokens FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- RPC: Atomic AI query increment
-- ============================================================
CREATE OR REPLACE FUNCTION increment_ai_queries_used(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE subscriptions SET ai_queries_used = ai_queries_used + 1 WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- After running this SQL, call POST /api/seed to create test users.
-- The seed endpoint creates users in Supabase Auth + profiles automatically.
-- ============================================================
