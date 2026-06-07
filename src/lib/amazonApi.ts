import { db as adminDb } from './supabaseAdmin';
import { encrypt, decrypt } from './crypto';

const AMAZON_ADS_API_BASE = 'https://advertising-api.amazon.com';
const AMAZON_AUTH_URL = 'https://api.amazon.com/auth/o2/token';

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
  body?: any
): Promise<any> {
  let token = decrypt(connection.access_token);
  const expiresAt = new Date(connection.token_expires_at);

  if (expiresAt < new Date(Date.now() + 5 * 60 * 1000)) {
    token = await refreshAccessToken(connection);
  }

  const response = await fetch(`${AMAZON_ADS_API_BASE}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Amazon-Advertising-API-ClientId': process.env.AMAZON_CLIENT_ID || '',
      'Amazon-Advertising-API-Scope': connection.profile_id,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Amazon API error ${response.status}: ${error}`);
  }

  return response.json();
}

export async function syncCampaigns(userId: string, connection: AmazonConnection) {
  const campaigns = await amazonApiCall(connection, '/v2/sp/campaigns');

  for (const campaign of campaigns) {
    await adminDb.from('campaigns').upsert({
      user_id: userId,
      amazon_campaign_id: String(campaign.campaignId),
      name: campaign.name,
      type: 'Sponsored Products',
      status: campaign.state === 'enabled' ? 'active' : campaign.state === 'paused' ? 'paused' : 'archived',
      budget: campaign.dailyBudget || 0,
      date: new Date().toISOString().split('T')[0],
    }, { onConflict: 'user_id,amazon_campaign_id,date' });
  }

  await adminDb
    .from('amazon_connections')
    .update({ last_synced_at: new Date().toISOString() })
    .eq('id', connection.id);

  return campaigns.length;
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
