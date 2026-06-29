import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';

const BUDGET_THRESHOLD_SAR = 40;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireAuth(req, res);
  if (!user) return;

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('daily_budget, automation_enabled')
    .eq('id', user.id)
    .single();

  const dailyBudget = Number(profile?.daily_budget ?? 50);
  const automationEnabled = !!profile?.automation_enabled;
  const budgetLow = dailyBudget < BUDGET_THRESHOLD_SAR;

  return res.status(200).json({
    daily_budget: dailyBudget,
    threshold: BUDGET_THRESHOLD_SAR,
    currency: 'SAR',
    budget_warning: budgetLow,
    budget_warning_message: budgetLow
      ? `We recommend setting a daily budget of at least ${BUDGET_THRESHOLD_SAR} SAR.`
      : null,
    automation_enabled: automationEnabled,
    automation_status: automationEnabled ? 'active' : 'stopped',
  });
}
