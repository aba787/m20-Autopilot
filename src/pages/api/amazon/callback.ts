import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { exchangeCodeForTokens } from '@/lib/amazonApi';
import { db as adminDb } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await requireAuth(req, res);
  if (!auth) return;

  const { code, marketplace, seller_name, profile_id } = req.body;
  if (!code) return res.status(400).json({ error: 'Authorization code is required' });

  try {
    const tokens = await exchangeCodeForTokens(code);

    const connectionData = {
      user_id: auth.id,
      profile_id: profile_id || 'pending',
      marketplace: marketplace || 'amazon.sa',
      seller_name: seller_name || auth.full_name || 'Amazon Seller',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      is_active: true,
    };

    const { data: existing } = await adminDb
      .from('amazon_connections')
      .select('id')
      .eq('user_id', auth.id)
      .single();

    if (existing) {
      await adminDb
        .from('amazon_connections')
        .update(connectionData)
        .eq('id', existing.id);
    } else {
      await adminDb
        .from('amazon_connections')
        .insert(connectionData);
    }

    return res.status(200).json({ success: true, connected: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to connect Amazon account' });
  }
}
