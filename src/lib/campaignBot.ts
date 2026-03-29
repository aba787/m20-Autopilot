// ============================
// M20 Autopilot — Campaign Bot
// ============================

export interface CampaignData {
  id: number;
  name: string;
  spend: number;
  sales: number;
  clicks: number;
  impressions: number;
  orders: number;
  acos: number;
  roas: number;
  ctr: number;
  budget: number;
  status: string;
  target_acos?: number;
}

export interface BotMetrics {
  acos: number;
  roas: number;
  ctr: number;
}

export interface BotDecision {
  action: 'decrease_bid' | 'scale' | 'pause' | 'keep' | 'add_negative';
  reason: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  suggestedChange?: string;
}

export interface BotResult {
  campaign: CampaignData;
  metrics: BotMetrics;
  ruleDecision: BotDecision;
  aiAnalysis: string;
  timestamp: string;
}

// ─── Step 1: Calculate metrics ───────────────────────────────────────────────
export function calculateMetrics(campaign: CampaignData): BotMetrics {
  const acos = campaign.sales > 0 ? (campaign.spend / campaign.sales) * 100 : 0;
  const roas = campaign.spend > 0 ? campaign.sales / campaign.spend : 0;
  const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0;
  return { acos, roas, ctr };
}

// ─── Step 2: Rule-based decision engine (fast, no AI cost) ───────────────────
export function applyRules(metrics: BotMetrics, campaign: CampaignData): BotDecision {
  const targetAcos = campaign.target_acos ?? 30;

  // Critical: ACOS way too high + enough data
  if (metrics.acos > targetAcos * 2.5 && campaign.clicks > 50) {
    return {
      action: 'pause',
      reason: `ACOS ${metrics.acos.toFixed(1)}% يتجاوز الهدف بأكثر من 150%`,
      priority: 'critical',
      suggestedChange: 'إيقاف الحملة وإعادة مراجعة الكلمات المفتاحية',
    };
  }

  // High: ACOS high + enough clicks
  if (metrics.acos > targetAcos && campaign.clicks > 25) {
    return {
      action: 'decrease_bid',
      reason: `ACOS ${metrics.acos.toFixed(1)}% أعلى من الهدف (${targetAcos}%)`,
      priority: 'high',
      suggestedChange: `خفض العرض بنسبة 15-20%`,
    };
  }

  // Good: ACOS well below target → scale
  if (metrics.acos < targetAcos * 0.7 && metrics.roas > 4) {
    return {
      action: 'scale',
      reason: `ACOS ${metrics.acos.toFixed(1)}% ممتاز و ROAS ${metrics.roas.toFixed(1)}`,
      priority: 'medium',
      suggestedChange: 'زيادة الميزانية بنسبة 20-30%',
    };
  }

  // Low CTR → add negative keywords
  if (metrics.ctr < 0.8 && campaign.clicks < 20 && campaign.spend > 200) {
    return {
      action: 'add_negative',
      reason: `CTR منخفض جداً (${metrics.ctr.toFixed(2)}%) مع إنفاق مرتفع`,
      priority: 'medium',
      suggestedChange: 'مراجعة الكلمات المفتاحية وإضافة كلمات سلبية',
    };
  }

  return {
    action: 'keep',
    reason: `الأداء مستقر — ACOS ${metrics.acos.toFixed(1)}% / ROAS ${metrics.roas.toFixed(1)}`,
    priority: 'low',
  };
}

// ─── Step 3: AI analysis via GPT-4o-mini ─────────────────────────────────────
export async function getAIAnalysis(
  campaign: CampaignData,
  metrics: BotMetrics,
  ruleDecision: BotDecision
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return 'مفتاح OpenAI غير مضبوط.';

  const prompt = `You are an Amazon Ads expert analyzing campaign performance for an Arabic seller.
Answer in Arabic only.

Campaign: ${campaign.name}
Spend: ${campaign.spend} SAR
Sales: ${campaign.sales} SAR
ACOS: ${metrics.acos.toFixed(1)}%
ROAS: ${metrics.roas.toFixed(2)}
CTR: ${metrics.ctr.toFixed(2)}%
Clicks: ${campaign.clicks}
Orders: ${campaign.orders}
Budget: ${campaign.budget} SAR
Rule Decision: ${ruleDecision.action} — ${ruleDecision.reason}

Give a brief (2-3 sentences) expert analysis confirming or refining the rule decision.
Be direct and practical. Mention one specific action the seller should take.
No fake promises.`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.4,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      return `خطأ من OpenAI: ${err?.error?.message ?? res.status}`;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? 'لا يوجد رد من الذكاء الاصطناعي.';
  } catch (e: any) {
    return `خطأ في الاتصال: ${e.message}`;
  }
}

// ─── Step 4: Run the bot on a list of campaigns ───────────────────────────────
export async function runBot(campaigns: CampaignData[]): Promise<BotResult[]> {
  const results: BotResult[] = [];

  for (const campaign of campaigns) {
    const metrics = calculateMetrics(campaign);
    const ruleDecision = applyRules(metrics, campaign);
    const aiAnalysis = await getAIAnalysis(campaign, metrics, ruleDecision);

    results.push({
      campaign,
      metrics,
      ruleDecision,
      aiAnalysis,
      timestamp: new Date().toISOString(),
    });
  }

  return results;
}
