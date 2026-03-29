import type { NextApiRequest, NextApiResponse } from 'next';
import { runBot, calculateMetrics, applyRules, getAIAnalysis, type CampaignData } from '@/lib/campaignBot';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { campaigns, singleCampaign } = req.body as {
      campaigns?: CampaignData[];
      singleCampaign?: CampaignData;
    };

    // Single campaign analysis (for the quick "Analyze" button)
    if (singleCampaign) {
      const metrics = calculateMetrics(singleCampaign);
      const ruleDecision = applyRules(metrics, singleCampaign);
      const aiAnalysis = await getAIAnalysis(singleCampaign, metrics, ruleDecision);
      return res.status(200).json({ result: { campaign: singleCampaign, metrics, ruleDecision, aiAnalysis, timestamp: new Date().toISOString() } });
    }

    // Full bot run (all campaigns)
    if (!campaigns || !Array.isArray(campaigns)) {
      return res.status(400).json({ error: 'campaigns array required' });
    }

    const results = await runBot(campaigns);
    return res.status(200).json({ results });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
