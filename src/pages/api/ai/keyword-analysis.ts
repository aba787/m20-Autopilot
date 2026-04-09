import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAIQueryLimit, incrementAIQueryCount } from '@/lib/subscriptionGuard';
import { callOpenAI, MASTER_SYSTEM_PROMPT } from '@/lib/campaignBot';

const KEYWORD_ANALYSIS_PROMPT = `${MASTER_SYSTEM_PROMPT}

═══ ROLE: KEYWORD INTELLIGENCE ENGINE ═══

IMPORTANT: For this endpoint, override the standard markdown response format. Return ONLY valid JSON.

Analyze search terms and keyword performance data. Provide structured, actionable intelligence.

CLASSIFICATION RULES:
- **Profitable** (high sales, low ACOS) → increase bid or harvest to exact match
- **Wasteful** (high spend, zero/low sales) → add as negative keyword
- **Opportunity** (good clicks, no conversions yet) → adjust bid, monitor
- **New Ideas** → suggest based on product and existing patterns
- **Match Type** → recommend Broad → Phrase → Exact progression based on data

Return your analysis as JSON with this structure:
{
  "summary": "📌 Brief structured overview — state key finding, top action, and priority level",
  "profitable_keywords": [{ "keyword": "...", "reason": "...", "action": "increase_bid", "suggested_bid": 0.00 }],
  "negative_keywords": [{ "keyword": "...", "reason": "...", "match_type": "Negative Exact" }],
  "opportunities": [{ "keyword": "...", "reason": "...", "action": "...", "suggested_bid": 0.00 }],
  "new_suggestions": [{ "keyword": "...", "match_type": "...", "estimated_bid": 0.00 }],
  "match_type_changes": [{ "keyword": "...", "from": "...", "to": "...", "reason": "..." }]
}

Every reason field must be concise (1 line), data-driven, and include the key metric in bold format.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await checkAIQueryLimit(req, res);
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

    await incrementAIQueryCount(auth.id);
    return res.status(200).json({ success: true, analysis });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'AI analysis failed' });
  }
}
