import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { callOpenAI, MASTER_SYSTEM_PROMPT } from '@/lib/campaignBot';

const KEYWORD_ANALYSIS_PROMPT = `${MASTER_SYSTEM_PROMPT}

You are the Keyword Intelligence Engine for M20 Autopilot. Your job is to analyze search terms and keyword performance data to provide actionable recommendations.

When given keyword/search term data, you must:
1. Identify HIGH-PERFORMING keywords (high sales, low ACOS) → recommend increasing bids or harvesting
2. Identify WASTEFUL keywords (high spend, zero/low sales) → recommend as negative keywords
3. Identify OPPORTUNITY keywords (good clicks but no conversions yet) → recommend bid adjustments
4. Suggest NEW keyword ideas based on the product and existing keyword patterns
5. Recommend match type changes (Broad → Phrase → Exact) based on performance

Return your analysis as JSON with this structure:
{
  "profitable_keywords": [{ "keyword": "...", "reason": "...", "action": "increase_bid", "suggested_bid": 0.00 }],
  "negative_keywords": [{ "keyword": "...", "reason": "...", "match_type": "Negative Exact" }],
  "opportunities": [{ "keyword": "...", "reason": "...", "action": "...", "suggested_bid": 0.00 }],
  "new_suggestions": [{ "keyword": "...", "match_type": "...", "estimated_bid": 0.00 }],
  "match_type_changes": [{ "keyword": "...", "from": "...", "to": "...", "reason": "..." }],
  "summary": "Brief overview of the analysis"
}`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await requireAuth(req, res);
  if (!auth) return;

  const { keywords, searchTerms, productName, campaignName, targetAcos } = req.body;

  if (!keywords && !searchTerms) {
    return res.status(400).json({ error: 'Keywords or search terms data is required' });
  }

  try {
    const context = `
Product: ${productName || 'Not specified'}
Campaign: ${campaignName || 'Not specified'}
Target ACOS: ${targetAcos || 30}%

Keywords Data:
${JSON.stringify(keywords || [], null, 2)}

Search Terms Data:
${JSON.stringify(searchTerms || [], null, 2)}
`;

    const reply = await callOpenAI(
      KEYWORD_ANALYSIS_PROMPT,
      context,
      800,
      0.3,
      true
    );

    let analysis;
    try {
      analysis = JSON.parse(reply);
    } catch {
      analysis = { summary: reply, profitable_keywords: [], negative_keywords: [], opportunities: [], new_suggestions: [], match_type_changes: [] };
    }

    return res.status(200).json({ success: true, analysis });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'AI analysis failed' });
  }
}
