import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { db as adminDb } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireAuth(req, res);
  if (!auth) return;

  if (req.method === 'GET') {
    const { data, error } = await adminDb
      .from('rules')
      .select('*')
      .eq('user_id', auth.id)
      .order('priority', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data || []);
  }

  if (req.method === 'POST') {
    const { name, description, conditions, condition_type, action_type, action_params, scope, priority } = req.body;

    if (!name || !action_type || !conditions) {
      return res.status(400).json({ error: 'name, conditions, and action_type are required' });
    }

    const { data, error } = await adminDb.from('rules').insert({
      user_id: auth.id,
      name,
      description: description || '',
      conditions: conditions || [],
      condition_type: condition_type || 'all',
      action_type,
      action_params: action_params || {},
      scope: scope || 'campaign',
      priority: priority || 0,
    }).select().single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
