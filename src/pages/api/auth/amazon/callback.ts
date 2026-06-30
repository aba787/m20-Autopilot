import type { NextApiRequest, NextApiResponse } from 'next';
import { db as adminDb } from '@/lib/supabaseAdmin';
import { encrypt } from '@/lib/crypto';
import { REFRESH_TOKEN_TTL_MS } from '@/lib/amazonApi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { code, state, error: oauthError } = req.query as Record<string, string>;

  if (oauthError) {
    return res.redirect(`/integration?error=${encodeURIComponent(oauthError)}`);
  }

  if (!code || !state) {
    return res.redirect('/integration?error=missing_params');
  }

  let userId: string;
  try {
    const payload = JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));
    if (!payload.uid || !payload.exp || Date.now() > payload.exp) {
      return res.redirect('/integration?error=invalid_or_expired_state');
    }
    userId = payload.uid;
  } catch {
    return res.redirect('/integration?error=invalid_state');
  }

  const clientId = process.env.AMAZON_CLIENT_ID;
  const clientSecret = process.env.AMAZON_CLIENT_SECRET;
  const redirectUri = process.env.AMAZON_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return res.redirect('/integration?error=amazon_credentials_not_configured');
  }

  try {
    const tokenRes = await fetch('https://api.amazon.com/auth/o2/token', {
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

    const tokens = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error('[amazon/callback] Token exchange failed:', tokens);
      return res.redirect(
        `/integration?error=${encodeURIComponent(tokens.error_description || tokens.error || 'token_exchange_failed')}`,
      );
    }

    const nowMs = Date.now();

    let profileId = 'pending';
    let marketplace = 'amazon.sa';
    let sellerName = 'Amazon Seller';
    let profileError: string | null = null;

    try {
      const profRes = await fetch('https://advertising-api-eu.amazon.com/v2/profiles', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          'Amazon-Advertising-API-ClientId': clientId,
        },
      });
      if (profRes.ok) {
        const profiles = await profRes.json();
        if (Array.isArray(profiles) && profiles.length > 0) {
          // Prefer the Saudi Arabia profile (KSA marketplace), else first.
          const p = profiles.find((x: any) =>
            String(x.countryCode).toUpperCase() === 'SA' ||
            x?.accountInfo?.marketplaceStringId === 'A17E79C6D8DWNP',
          ) || profiles[0];
          profileId = String(p.profileId);
          if (p.countryCode) marketplace = `amazon.${String(p.countryCode).toLowerCase()}`;
          if (p.accountInfo?.name) sellerName = p.accountInfo.name;
        } else {
          profileError = 'no_advertising_profile';
        }
      } else {
        // e.g. 401/403 when the client_id is not approved for production Ads API.
        profileError = `profile_fetch_${profRes.status}`;
      }
    } catch (e) {
      console.error('[amazon/callback] Failed to fetch Amazon Ads profile:', e);
      profileError = 'profile_fetch_failed';
    }

    // Fail closed: a connection with no real profile_id has an invalid Ads scope
    // and every later API call would fail, so don't save it as active.
    if (profileId === 'pending') {
      return res.redirect(`/integration?error=${encodeURIComponent(profileError || 'no_advertising_profile')}`);
    }

    const connectionData = {
      user_id: userId,
      profile_id: profileId,
      marketplace,
      seller_name: sellerName,
      access_token: encrypt(tokens.access_token),
      refresh_token: encrypt(tokens.refresh_token),
      token_expires_at: new Date(nowMs + tokens.expires_in * 1000).toISOString(),
      consent_date: new Date(nowMs).toISOString(),
      refresh_token_expires_at: new Date(nowMs + REFRESH_TOKEN_TTL_MS).toISOString(),
      is_active: true,
      last_synced_at: new Date().toISOString(),
    };

    const { data: existing } = await adminDb
      .from('amazon_connections')
      .select('id')
      .eq('user_id', userId)
      .eq('profile_id', profileId)
      .maybeSingle();

    const { error: dbError } = existing
      ? await adminDb.from('amazon_connections').update(connectionData).eq('id', existing.id)
      : await adminDb.from('amazon_connections').insert(connectionData);

    if (dbError) {
      console.error('[amazon/callback] Failed to save connection:', dbError);
      return res.redirect('/integration?error=connection_save_failed');
    }

    return res.redirect('/dashboard?amazon=connected');
  } catch (err: any) {
    console.error('[amazon/callback] Unexpected error:', err);
    return res.redirect(`/integration?error=${encodeURIComponent(err.message || 'unknown_error')}`);
  }
}
