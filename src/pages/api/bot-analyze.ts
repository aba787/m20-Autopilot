import type { NextApiRequest, NextApiResponse } from 'next';
import { runBot, calculateMetrics, applyRules, getAIAnalysis, type CampaignData } from '@/lib/campaignBot';
import { requireAuth } from '@/lib/auth';
import { checkAIQueryLimit, incrementAIQueryCount } from '@/lib/subscriptionGuard';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await checkAIQueryLimit(req, res);
  if (!user) return;

  try {
    const { campaignId } = req.body as { campaignId?: string };

    if (campaignId) {
      const { data: campaign, error } = await supabaseAdmin
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .eq('user_id', user.id)
        .single();

      if (error || !campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      const campaignData: CampaignData = {
        id: campaign.id,
        name: campaign.name,
        spend: campaign.spend ?? 0,
        sales: campaign.sales ?? 0,
        clicks: campaign.clicks ?? 0,
        impressions: campaign.impressions ?? 0,
        orders: campaign.orders ?? 0,
        acos: campaign.acos ?? 0,
        roas: campaign.roas ?? 0,
        ctr: campaign.ctr ?? 0,
        budget: campaign.budget ?? 0,
        status: campaign.status ?? 'active',
        target_acos: campaign.target_acos ?? 30,
      };

      const metrics = calculateMetrics(campaignData);
      const ruleDecision = applyRules(metrics, campaignData);
      const aiAnalysis = await getAIAnalysis(campaignData, metrics, ruleDecision);
      await incrementAIQueryCount(user.id);
      return res.status(200).json({
        result: { campaign: campaignData, metrics, ruleDecision, aiAnalysis, timestamp: new Date().toISOString() },
      });
    }

    const { data: campaigns, error: campError } = await supabaseAdmin
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (campError) {
      return res.status(500).json({ error: 'Failed to fetch campaigns' });
    }

    if (!campaigns || campaigns.length === 0) {
      return res.status(200).json({ results: [], message: 'No active campaigns found' });
    }

    const campaignDataList: CampaignData[] = campaigns.map(c => ({
      id: c.id,
      name: c.name,
      spend: c.spend ?? 0,
      sales: c.sales ?? 0,
      clicks: c.clicks ?? 0,
      impressions: c.impressions ?? 0,
      orders: c.orders ?? 0,
      acos: c.acos ?? 0,
      roas: c.roas ?? 0,
      ctr: c.ctr ?? 0,
      budget: c.budget ?? 0,
      status: c.status ?? 'active',
      target_acos: c.target_acos ?? 30,
    }));

    const results = await runBot(campaignDataList);
    await incrementAIQueryCount(user.id);
    return res.status(200).json({ results });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
