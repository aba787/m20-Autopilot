import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { db as adminDb } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireAuth(req, res);
  if (!auth) return;

  if (req.method === 'GET') {
    const { campaign_id, ad_group_id, is_negated, search } = req.query;

    let query = adminDb.from('search_terms').select('*').eq('user_id', auth.id).order('spend', { ascending: false });

    if (campaign_id) query = query.eq('campaign_id', campaign_id);
    if (ad_group_id) query = query.eq('ad_group_id', ad_group_id);
    if (is_negated === 'true') query = query.eq('is_negated', true);
    if (is_negated === 'false') query = query.eq('is_negated', false);
    if (search) query = query.ilike('search_term', `%${search}%`);

    const { data, error } = await query.limit(200);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data || []);
  }

  if (req.method === 'POST') {
    const items = Array.isArray(req.body) ? req.body : [req.body];

    const records = items.map((item: any) => ({
      user_id: auth.id,
      campaign_id: item.campaign_id,
      ad_group_id: item.ad_group_id || null,
      keyword_id: item.keyword_id || null,
      search_term: item.search_term,
      impressions: item.impressions || 0,
      clicks: item.clicks || 0,
      spend: item.spend || 0,
      sales: item.sales || 0,
      orders: item.orders || 0,
      acos: item.acos || 0,
      conversion_rate: item.conversion_rate || 0,
      date: item.date || new Date().toISOString().split('T')[0],
    }));

    const { data, error } = await adminDb.from('search_terms').insert(records).select();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
