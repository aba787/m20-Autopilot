import type { NextApiRequest, NextApiResponse } from 'next';
import { db as adminDb } from '@/lib/supabaseAdmin';
import { requireAuth } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireAuth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    const { data: profile, error } = await adminDb
      .from('profiles')
      .select('full_name, email, avatar_url, bot_mode, target_acos, automation_enabled, daily_budget, language, tone, email_notifications, subscription_plan, subscription_status')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.status(200).json(profile);
  }

  if (req.method === 'PATCH') {
    const allowedFields = [
      'full_name', 'avatar_url', 'bot_mode', 'target_acos',
      'automation_enabled', 'daily_budget', 'language', 'tone',
      'email_notifications',
    ];

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.updated_at = new Date().toISOString();

    const { error } = await adminDb
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      return res.status(500).json({ error: 'Failed to update settings' });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
