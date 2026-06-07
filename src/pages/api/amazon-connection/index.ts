import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';
import { encrypt, isEncrypted } from '@/lib/crypto';
import { REFRESH_TOKEN_TTL_MS } from '@/lib/amazonApi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireAuth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    const FULL_COLS = 'id, profile_id, marketplace, seller_name, is_active, last_synced_at, created_at, token_expires_at, consent_date, refresh_token_expires_at';
    const BASE_COLS = 'id, profile_id, marketplace, seller_name, is_active, last_synced_at, created_at, token_expires_at';

    const runSelect = (cols: string) => supabaseAdmin
      .from('amazon_connections')
      .select(cols)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    let data: any;
    let error: any;
    ({ data, error } = await runSelect(FULL_COLS));

    // Backward-compat: if the token-policy migration hasn't been applied yet,
    // fall back to the base columns so the page still loads.
    if (error && /column/i.test(error.message)) {
      ({ data, error } = await runSelect(BASE_COLS));
    }

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ connections: data ?? [] });
  }

  if (req.method === 'POST') {
    const { profile_id, marketplace, seller_name, access_token, refresh_token, token_expires_at } = req.body;

    if (!profile_id || !marketplace) {
      return res.status(400).json({ error: 'profile_id and marketplace are required' });
    }

    const encAccess = access_token
      ? (isEncrypted(access_token) ? access_token : encrypt(access_token))
      : access_token;
    const encRefresh = refresh_token
      ? (isEncrypted(refresh_token) ? refresh_token : encrypt(refresh_token))
      : refresh_token;

    const nowMs = Date.now();
    const { data, error } = await supabaseAdmin
      .from('amazon_connections')
      .upsert({
        user_id: user.id,
        profile_id, marketplace, seller_name,
        access_token: encAccess, refresh_token: encRefresh, token_expires_at,
        consent_date: new Date(nowMs).toISOString(),
        refresh_token_expires_at: new Date(nowMs + REFRESH_TOKEN_TTL_MS).toISOString(),
        is_active: true, last_synced_at: new Date().toISOString(),
      }, { onConflict: 'user_id,profile_id' })
      .select('id, profile_id, marketplace, seller_name, is_active, last_synced_at, created_at')
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json({ connection: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
