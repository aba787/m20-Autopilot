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

  try {
    const clientId = process.env.AMAZON_CLIENT_ID;
    const clientSecret = process.env.AMAZON_CLIENT_SECRET;
    const redirectUri = process.env.AMAZON_REDIRECT_URI;

    const tokenRes = await fetch('https://api.amazon.com/auth/o2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri!,
      }),
    });

    const tokens = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error('Token exchange failed:', tokens);
      return res.redirect(`/integration?error=${encodeURIComponent(tokens.error_description || 'token_exchange_failed')}`);
    }

    // Record the advertiser's consent moment. Per Amazon's policy the refresh
    // token expires 365 days from consent, fixed at this point in time. This
    // runs on first connect AND every re-connect, so re-authorizing resets it.
    const nowMs = Date.now();
    const connectionData = {
      user_id: userId,
      profile_id: 'pending',
      marketplace: 'amazon.sa',
      seller_name: 'Amazon Seller',
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
      .single();

    const { error: dbError } = existing
      ? await adminDb.from('amazon_connections').update(connectionData).eq('id', existing.id)
      : await adminDb.from('amazon_connections').insert(connectionData);

    // Fail closed: never report success if the tokens were not persisted.
    if (dbError) {
      console.error('Amazon connection persistence failed:', dbError);
      return res.redirect(`/integration?error=${encodeURIComponent('connection_save_failed')}`);
    }

    return res.redirect('/integration?status=success');
  } catch (err: any) {
    console.error('Amazon callback error:', err);
    return res.redirect(`/integration?error=${encodeURIComponent(err.message || 'unknown_error')}`);
  }
}
