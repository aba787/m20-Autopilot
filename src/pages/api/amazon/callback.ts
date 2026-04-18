import type { NextApiRequest, NextApiResponse } from 'next';
import { db as adminDb } from '@/lib/supabaseAdmin';

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

    const connectionData = {
      user_id: userId,
      profile_id: 'pending',
      marketplace: 'amazon.sa',
      seller_name: 'Amazon Seller',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      is_active: true,
      last_synced_at: new Date().toISOString(),
    };

    const { data: existing } = await adminDb
      .from('amazon_connections')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existing) {
      await adminDb.from('amazon_connections').update(connectionData).eq('id', existing.id);
    } else {
      await adminDb.from('amazon_connections').insert(connectionData);
    }

    return res.redirect('/integration?status=success');
  } catch (err: any) {
    console.error('Amazon callback error:', err);
    return res.redirect(`/integration?error=${encodeURIComponent(err.message || 'unknown_error')}`);
  }
}
