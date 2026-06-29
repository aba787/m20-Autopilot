import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { db as adminDb } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireAuth(req, res);
  if (!auth) return;

  if (req.method === 'GET') {
    const { campaign_id, status } = req.query;

    let query = adminDb.from('ad_groups').select('*').eq('user_id', auth.id).order('created_at', { ascending: false });

    if (campaign_id) query = query.eq('campaign_id', campaign_id);
    if (status && status !== 'all') query = query.eq('status', status);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data || []);
  }

  if (req.method === 'POST') {
    const { campaign_id, name, amazon_ad_group_id, default_bid, targeting_type } = req.body;

    if (!campaign_id || !name) {
      return res.status(400).json({ error: 'campaign_id and name are required' });
    }

    const { data, error } = await adminDb.from('ad_groups').insert({
      user_id: auth.id,
      campaign_id,
      amazon_ad_group_id: amazon_ad_group_id || `ag_${Date.now()}`,
      name,
      default_bid: default_bid || 1.00,
      targeting_type: targeting_type || 'keyword',
    }).select().single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
