import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireAuth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('profiles').select('*')
      .eq('id', user.id).single();
    if (error) return res.status(500).json({ error: error.message });

    const budget = Number(data?.daily_budget ?? 50);
    return res.status(200).json({
      profile: data,
      budget_warning: budget < 40,
      budget_warning_message: budget < 40
        ? `Current daily budget (${budget} SAR) is below the recommended minimum of 40 SAR per product.`
        : null,
    });
  }

  if (req.method === 'PATCH') {
    const { full_name, bot_mode, target_acos, automation_enabled, daily_budget, language, tone } = req.body as {
      full_name?: string;
      bot_mode?: 'safe' | 'semi' | 'auto';
      target_acos?: number;
      automation_enabled?: boolean;
      daily_budget?: number;
      language?: 'en' | 'ar';
      tone?: 'friendly' | 'professional' | 'brief';
    };

    const updates: Record<string, unknown> = {};
    if (full_name !== undefined)          updates.full_name = full_name;
    if (bot_mode !== undefined)           updates.bot_mode = bot_mode;
    if (target_acos !== undefined)        updates.target_acos = target_acos;
    if (automation_enabled !== undefined) updates.automation_enabled = automation_enabled;
    if (daily_budget !== undefined)       updates.daily_budget = daily_budget;
    if (language !== undefined)           updates.language = language;
    if (tone !== undefined)               updates.tone = tone;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles').update(updates).eq('id', user.id)
      .select('*').single();

    if (error) return res.status(400).json({ error: error.message });

    const budget = Number(data?.daily_budget ?? 50);
    return res.status(200).json({
      profile: data,
      budget_warning: budget < 40,
      automation_active: !!data?.automation_enabled,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
