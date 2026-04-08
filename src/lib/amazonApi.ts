import { db as adminDb } from './supabaseAdmin';

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

  const response = await fetch(AMAZON_AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: connection.refresh_token,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${data.error_description || data.error}`);
  }

  await adminDb
    .from('amazon_connections')
    .update({
      access_token: data.access_token,
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
  let token = connection.access_token;
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
      status: campaign.state === 'enabled' ? 'Active' : campaign.state === 'paused' ? 'Paused' : 'Archived',
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

export function getOAuthUrl(state: string): string {
  const clientId = process.env.AMAZON_CLIENT_ID;
  const redirectUri = process.env.AMAZON_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/amazon/callback`;

  return `https://www.amazon.com/ap/oa?client_id=${clientId}&scope=advertising::campaign_management&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
}
