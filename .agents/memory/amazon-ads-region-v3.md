---
name: Amazon Ads API region + v3 endpoints
description: Region routing and v3 migration rules for the Amazon Ads API integration (KSA-focused).
---

# Amazon Ads API: region routing + v3 endpoints

**Rule:** KSA (SA), plus UAE (AE) and Egypt (EG), live in Amazon's **EU** Ads
region. Call `advertising-api-eu.amazon.com`, NOT the NA host
`advertising-api.amazon.com`. Regions: NA / EU (`-eu`) / FE (`-fe`).

**Why:** Calling the wrong region returns an **empty `/v2/profiles`** list, so
the connection's `profile_id` gets stuck at the placeholder `'pending'`, which
makes `Amazon-Advertising-API-Scope` invalid and every later call fail. This was
the root cause of campaigns/products never appearing for KSA sellers.

**How to apply:**
- On OAuth callback, fetch `/v2/profiles` from the EU host and pick the profile
  with `countryCode === 'SA'` (or `accountInfo.marketplaceStringId === 'A17E79C6D8DWNP'`),
  else the first. **Fail closed** — never persist an active connection whose
  `profile_id` is still `'pending'`.
- The connection has no `country_code` column; derive the region from the
  `marketplace` field (stored as `amazon.sa` or a bare code).

**v2 → v3:** Sponsored Products v2 list GETs (e.g. `GET /v2/sp/campaigns`) are
**deprecated and return 404**. Use v3 POST list endpoints:
- `POST /sp/campaigns/list` with media type `application/vnd.spCampaign.v3+json`
- `POST /sp/productAds/list` with media type `application/vnd.spProductAd.v3+json`
- The media type is **mandatory on BOTH `Content-Type` and `Accept`** or you get 404.
- v3 budget is an object: `campaign.budget.budget` (not a bare `dailyBudget`).
- `productAds` v3 returns `asin`/`sku`/`state` only — **no product title**; fetch
  names later from Catalog/SP-API if needed.
- Responses paginate via `nextToken`; bound the loop (page cap + repeated-token guard).

**Last gate (external):** Even with correct region/v3, calls 401/403 if the
`client_id` is not approved for **production** Ads API (Partner Network). Code
cannot fix this.
