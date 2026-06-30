import { db as adminDb } from './supabaseAdmin';
import { encrypt, decrypt } from './crypto';

const AMAZON_ADS_API_BASE = 'https://advertising-api.amazon.com';
const AMAZON_AUTH_URL = 'https://api.amazon.com/auth/o2/token';

// Amazon Ads API regional endpoints. The correct region is mandatory: calling
// the wrong one returns empty profiles and 404s. KSA/UAE/EG live in the EU region.
const ADS_REGION_ENDPOINTS = {
  NA: 'https://advertising-api.amazon.com',
  EU: 'https://advertising-api-eu.amazon.com',
  FE: 'https://advertising-api-fe.amazon.com',
} as const;

const EU_COUNTRIES = ['SA', 'AE', 'EG', 'TR', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'PL', 'BE', 'IN'];
const FE_COUNTRIES = ['JP', 'AU', 'SG'];

// The connection stores `marketplace` as either `amazon.sa` or a bare code like
// `US`/`SA`. Extract the ISO country code from whichever format is present.
function connectionCountryCode(connection: AmazonConnection): string {
  const raw = (connection?.marketplace || '').trim();
  if (!raw) return 'SA'; // KSA is the platform's default market.
  const parts = raw.split('.');
  return parts[parts.length - 1].toUpperCase();
}

// Picks the Ads API base URL for the connection's marketplace region.
function adsBaseUrl(connection: AmazonConnection): string {
  const cc = connectionCountryCode(connection);
  if (FE_COUNTRIES.includes(cc)) return ADS_REGION_ENDPOINTS.FE;
  if (EU_COUNTRIES.includes(cc)) return ADS_REGION_ENDPOINTS.EU;
  return ADS_REGION_ENDPOINTS.NA;
}

export interface AmazonConnection {
  id: string;
  user_id: string;
  profile_id: string;
  marketplace: string;
  seller_name: string;
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
  is_active: boolean;
  consent_date?: string | null;
  refresh_token_expires_at?: string | null;
}

// Amazon Ads API refresh-token expiration policy (effective 2026-06-30):
// refresh tokens expire 365 days from the date of advertiser consent. The
// expiry is FIXED at consent time and is NOT extended by usage/refresh.
export const REFRESH_TOKEN_TTL_DAYS = 365;
export const REFRESH_TOKEN_TTL_MS = REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;
// Start prompting the advertiser to re-authorize this many days before expiry.
export const REFRESH_TOKEN_WARN_DAYS = 30;

// Thrown when the refresh token is expired/revoked and the advertiser must grant
// consent again (Amazon returns `invalid_grant` for these cases).
export class AmazonReauthRequiredError extends Error {
  readonly code = 'REAUTH_REQUIRED';
  constructor(message = 'Amazon authorization expired or revoked. Re-authorization required.') {
    super(message);
    this.name = 'AmazonReauthRequiredError';
  }
}

export type RefreshTokenStatus = 'active' | 'expiring' | 'expired';

// Derives the consent status of a refresh token from its fixed expiry date.
export function refreshTokenStatus(refreshTokenExpiresAt?: string | null): RefreshTokenStatus {
  if (!refreshTokenExpiresAt) return 'active';
  const expiry = new Date(refreshTokenExpiresAt).getTime();
  const now = Date.now();
  if (now >= expiry) return 'expired';
  if (expiry - now <= REFRESH_TOKEN_WARN_DAYS * 24 * 60 * 60 * 1000) return 'expiring';
  return 'active';
}

export async function getAmazonConnection(userId: string): Promise<AmazonConnection | null> {
  const { data } = await adminDb
    .from('amazon_connections')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  return data;
}

export async function refreshAccessToken(connection: AmazonConnection): Promise<string> {
  const clientId = process.env.AMAZON_CLIENT_ID;
  const clientSecret = process.env.AMAZON_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Amazon API credentials not configured');
  }

  // Refresh token has a fixed 365-day lifetime from consent. If it is already
  // past expiry, don't call Amazon — deactivate and require re-authorization.
  if (refreshTokenStatus(connection.refresh_token_expires_at) === 'expired') {
    await adminDb.from('amazon_connections').update({ is_active: false }).eq('id', connection.id);
    throw new AmazonReauthRequiredError();
  }

  const response = await fetch(AMAZON_AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: decrypt(connection.refresh_token),
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    // invalid_grant => refresh token expired/revoked: advertiser must re-consent.
    if (data.error === 'invalid_grant') {
      await adminDb.from('amazon_connections').update({ is_active: false }).eq('id', connection.id);
      throw new AmazonReauthRequiredError(
        `Amazon refresh token invalid: ${data.error_description || data.error}. Re-authorization required.`,
      );
    }
    throw new Error(`Token refresh failed: ${data.error_description || data.error}`);
  }

  await adminDb
    .from('amazon_connections')
    .update({
      access_token: encrypt(data.access_token),
      token_expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
    })
    .eq('id', connection.id);

  return data.access_token;
}

export async function amazonApiCall(
  connection: AmazonConnection,
  endpoint: string,
  method: string = 'GET',
  body?: any,
  vendorType?: string,
): Promise<any> {
  let token = decrypt(connection.access_token);
  const expiresAt = new Date(connection.token_expires_at);

  if (expiresAt < new Date(Date.now() + 5 * 60 * 1000)) {
    token = await refreshAccessToken(connection);
  }

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
    'Amazon-Advertising-API-ClientId': process.env.AMAZON_CLIENT_ID || '',
    'Amazon-Advertising-API-Scope': connection.profile_id,
  };
  // v3 endpoints require the resource media type on BOTH Content-Type and Accept.
  if (vendorType) {
    headers['Content-Type'] = vendorType;
    headers['Accept'] = vendorType;
  } else {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${adsBaseUrl(connection)}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Amazon API error ${response.status}: ${error}`);
  }

  return response.json();
}

// Safety cap so a misbehaving API (e.g. a repeating/erroneous nextToken) can
// never hang a sync request indefinitely.
const MAX_SYNC_PAGES = 50;

// Pages through a Sponsored Products v3 "list" endpoint, collecting every item
// from `collectionKey`. Bounded by MAX_SYNC_PAGES and a repeated-token guard.
async function listAllV3(
  connection: AmazonConnection,
  endpoint: string,
  vendorType: string,
  collectionKey: string,
): Promise<any[]> {
  const items: any[] = [];
  const seenTokens = new Set<string>();
  let nextToken: string | undefined;
  let pages = 0;

  do {
    const body: any = { stateFilter: { include: ['ENABLED', 'PAUSED', 'ARCHIVED'] }, maxResults: 100 };
    if (nextToken) body.nextToken = nextToken;

    const data = await amazonApiCall(connection, endpoint, 'POST', body, vendorType);
    const batch = data[collectionKey];
    if (Array.isArray(batch)) items.push(...batch);

    nextToken = data.nextToken || undefined;
    pages++;

    // Stop if Amazon keeps handing back a token we've already followed.
    if (nextToken && seenTokens.has(nextToken)) break;
    if (nextToken) seenTokens.add(nextToken);
  } while (nextToken && pages < MAX_SYNC_PAGES);

  return items;
}

export async function syncCampaigns(userId: string, connection: AmazonConnection) {
  const campaigns = await listAllV3(
    connection,
    '/sp/campaigns/list',
    'application/vnd.spCampaign.v3+json',
    'campaigns',
  );

  const today = new Date().toISOString().split('T')[0];
  let failures = 0;
  let firstError: string | null = null;

  for (const campaign of campaigns) {
    const state = String(campaign.state || '').toUpperCase();
    // v3 budget is an object: { budget: number, budgetType: 'DAILY' }.
    const budget = campaign.budget?.budget ?? campaign.dailyBudget ?? 0;
    const { error } = await adminDb.from('campaigns').upsert({
      user_id: userId,
      amazon_campaign_id: String(campaign.campaignId),
      name: campaign.name,
      type: 'Sponsored Products',
      status: state === 'ENABLED' ? 'active' : state === 'PAUSED' ? 'paused' : 'archived',
      budget,
      date: today,
    }, { onConflict: 'user_id,amazon_campaign_id,date' });
    if (error) { failures++; if (!firstError) firstError = error.message; }
  }

  await adminDb
    .from('amazon_connections')
    .update({ last_synced_at: new Date().toISOString() })
    .eq('id', connection.id);

  // Pull the advertised products (ASINs) so they surface in the dashboard.
  await syncProductAds(userId, connection);

  // Fail loudly so a partial/failed save is never reported as success.
  if (failures > 0) {
    throw new Error(`Failed to save ${failures} of ${campaigns.length} campaigns: ${firstError}`);
  }

  return campaigns.length;
}

export async function syncProductAds(userId: string, connection: AmazonConnection) {
  const productAds = await listAllV3(
    connection,
    '/sp/productAds/list',
    'application/vnd.spProductAd.v3+json',
    'productAds',
  );

  let failures = 0;
  let firstError: string | null = null;

  for (const ad of productAds) {
    if (!ad.asin) continue;
    const state = String(ad.state || '').toUpperCase();
    // products.status only allows active/weak/poor/paused — map the ad state.
    const status = state === 'ENABLED' ? 'active' : 'paused';

    // products.name is NOT NULL and the productAds API doesn't return a title.
    // Update only the status of existing rows (preserve any real name/metrics),
    // and insert new rows with the ASIN as a placeholder name.
    const { data: existing } = await adminDb
      .from('products')
      .select('id')
      .eq('user_id', userId)
      .eq('asin', ad.asin)
      .maybeSingle();

    const { error } = existing
      ? await adminDb
          .from('products')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
      : await adminDb.from('products').insert({
          user_id: userId,
          asin: ad.asin,
          name: ad.asin,
          status,
        });
    if (error) { failures++; if (!firstError) firstError = error.message; }
  }

  if (failures > 0) {
    throw new Error(`Failed to save ${failures} of ${productAds.length} product ads: ${firstError}`);
  }

  return productAds.length;
}

export async function updateCampaignBid(connection: AmazonConnection, campaignId: string, newBudget: number) {
  return amazonApiCall(connection, '/v2/sp/campaigns', 'PUT', [
    { campaignId: parseInt(campaignId), dailyBudget: newBudget },
  ]);
}

export async function pauseCampaign(connection: AmazonConnection, campaignId: string) {
  return amazonApiCall(connection, '/v2/sp/campaigns', 'PUT', [
    { campaignId: parseInt(campaignId), state: 'paused' },
  ]);
}

export async function enableCampaign(connection: AmazonConnection, campaignId: string) {
  return amazonApiCall(connection, '/v2/sp/campaigns', 'PUT', [
    { campaignId: parseInt(campaignId), state: 'enabled' },
  ]);
}

export async function exchangeCodeForTokens(code: string): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
  const clientId = process.env.AMAZON_CLIENT_ID;
  const clientSecret = process.env.AMAZON_CLIENT_SECRET;
  const redirectUri = process.env.AMAZON_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/amazon/callback`;

  if (!clientId || !clientSecret) {
    throw new Error('Amazon API credentials not configured');
  }

  const response = await fetch(AMAZON_AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Token exchange failed: ${data.error_description || data.error}`);
  }

  return { access_token: data.access_token, refresh_token: data.refresh_token, expires_in: data.expires_in };
}

export async function fetchAdGroups(connection: AmazonConnection, campaignId: string) {
  return amazonApiCall(connection, `/v2/sp/adGroups?campaignIdFilter=${campaignId}`);
}

export async function fetchKeywords(connection: AmazonConnection, adGroupId: string) {
  return amazonApiCall(connection, `/v2/sp/keywords?adGroupIdFilter=${adGroupId}`);
}

export async function addNegativeKeyword(
  connection: AmazonConnection,
  campaignId: string,
  keyword: string,
  matchType: 'negativeExact' | 'negativePhrase' = 'negativeExact',
) {
  return amazonApiCall(connection, '/v2/sp/negativeKeywords', 'POST', [
    { campaignId: parseInt(campaignId), keywordText: keyword, matchType, state: 'enabled' },
  ]);
}

export function getOAuthUrl(state: string): string {
  const clientId = process.env.AMAZON_CLIENT_ID;
  const redirectUri = process.env.AMAZON_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/amazon/callback`;

  return `https://www.amazon.com/ap/oa?client_id=${clientId}&scope=advertising::campaign_management&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
}
