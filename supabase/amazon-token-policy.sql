-- ============================================================
-- Amazon Ads API — Refresh Token Expiration Policy (365 days)
-- ============================================================
-- Amazon Ads API policy (effective 2026-06-30): refresh tokens issued on or
-- after that date expire 365 days from the date of advertiser CONSENT. The
-- expiry is FIXED at consent time and is NOT extended by token usage/refresh.
--
-- This migration adds the metadata required to comply:
--   consent_date              — timestamp of the advertiser's OAuth consent
--                               (set on first connect AND every re-connect).
--   refresh_token_expires_at  — derived = consent_date + 365 days. Stored so
--                               the UI/cron can cheaply find expiring tokens.
--
-- Apply once against the database (idempotent).
-- ============================================================

ALTER TABLE amazon_connections
  ADD COLUMN IF NOT EXISTS consent_date TIMESTAMPTZ;

ALTER TABLE amazon_connections
  ADD COLUMN IF NOT EXISTS refresh_token_expires_at TIMESTAMPTZ;

-- Backfill existing rows: treat their original connection time as consent date.
-- (Pre-2026-06-30 tokens are grandfathered and not subject to the 365-day rule,
--  but we still populate the columns so the UI has consistent data to render.)
UPDATE amazon_connections
SET consent_date = COALESCE(consent_date, created_at),
    refresh_token_expires_at = COALESCE(refresh_token_expires_at, created_at + INTERVAL '365 days')
WHERE consent_date IS NULL OR refresh_token_expires_at IS NULL;
