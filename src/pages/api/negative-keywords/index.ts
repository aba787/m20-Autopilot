import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { db as adminDb } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireAuth(req, res);
  if (!auth) return;

  if (req.method === 'GET') {
    const { campaign_id, ad_group_id } = req.query;

    let query = adminDb.from('negative_keywords').select('*').eq('user_id', auth.id).order('created_at', { ascending: false });

    if (campaign_id) query = query.eq('campaign_id', campaign_id);
    if (ad_group_id) query = query.eq('ad_group_id', ad_group_id);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data || []);
  }

  if (req.method === 'POST') {
    const items = Array.isArray(req.body) ? req.body : [req.body];

    const records = items.map((item: any) => ({
      user_id: auth.id,
      campaign_id: item.campaign_id,
      ad_group_id: item.ad_group_id || null,
      keyword: item.keyword,
      match_type: item.match_type || 'Negative Exact',
      source: item.source || 'manual',
      reason: item.reason || null,
    }));

    const { data, error } = await adminDb.from('negative_keywords').insert(records).select();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'ID is required' });

    const { error } = await adminDb.from('negative_keywords').delete().eq('id', id).eq('user_id', auth.id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
