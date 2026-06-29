---
name: Amazon Ads refresh-token 365-day policy
description: How M20 tracks Amazon refresh-token consent expiry and why schema changes go in a separate migration
---

# Amazon Ads refresh-token expiration (365 days from consent)

Amazon Ads API policy (effective 2026-06-30): refresh tokens expire **365 days from the date of advertiser consent**, fixed at consent time — NOT extended by usage/refresh. Pre-2026-06-30 tokens are grandfathered.

How M20 complies:
- `amazon_connections` stores `consent_date` and `refresh_token_expires_at` (= consent + 365d), set on first connect AND every re-connect (re-consent resets the clock).
- Status helper classifies active/expiring/expired; warns 30 days before expiry; UI shows a re-connect banner.
- On `invalid_grant` (or pre-checked expiry) during token refresh: set `is_active=false` and throw `AmazonReauthRequiredError`; `/api/amazon/sync` surfaces it as `401 { code: 'REAUTH_REQUIRED' }`.

**Why schema changes are a separate migration:** user preference forbids editing `supabase/fix-and-seed.sql`. New columns live in `supabase/amazon-token-policy.sql`.

**How to apply:** Supabase schema is NOT reachable via the Replit `DATABASE_URL` (that's the local Replit Postgres). All Supabase DDL must be run manually in the Supabase SQL Editor. The connection-list GET has a column-missing fallback so the page still loads pre-migration, but connect/sync writes require the migration applied.

Known pre-existing gap (out of scope, not yet fixed): OAuth `state` in amazon connect/callback is unsigned base64 JSON — should be HMAC-signed or server-stored nonce to prevent binding consent to a forged uid.
