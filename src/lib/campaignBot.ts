// ============================
// M20 Autopilot — Campaign Bot
// ============================

// ─── Master system prompt (shared context for all bots) ──────────────────────
export const MASTER_SYSTEM_PROMPT = `You are the main system controller for an Amazon Ads automation platform called M20 Autopilot.

Your job is to manage and ensure the correct behavior of 4 systems:
1) Campaign Management Bot (Core Bot)
2) Customer Support Bot
3) Ad Generator Bot
4) Accounting System

GENERAL RULES:
- The platform language MUST be English
- Do NOT generate fake data
- Do NOT promise profits or guaranteed results
- Always be realistic and data-driven
- If something is missing, say it clearly`;

// ─── Campaign bot system prompt ───────────────────────────────────────────────
export const CAMPAIGN_BOT_PROMPT = `${MASTER_SYSTEM_PROMPT}

You are acting as the CAMPAIGN MANAGEMENT BOT (System 1).

Responsibilities:
- Suggest campaigns
- Optimize keywords
- Pause unprofitable campaigns
- Scale profitable campaigns

You MUST:
- Use metrics like ACOS, ROAS, CTR
- Base decisions on data (spend, sales, clicks)
- Prefer logic (rules) over guessing

Valid actions: pause | scale | decrease_bid | add_negative | keep

Respond in English only. Be direct and practical. 2-3 sentences max.
No fake promises. No guaranteed results.`;

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── Step 1: Calculate metrics ────────────────────────────────────────────────
export function calculateMetrics(campaign: CampaignData): BotMetrics {
  const acos = campaign.sales > 0 ? (campaign.spend / campaign.sales) * 100 : 0;
  const roas = campaign.spend > 0 ? campaign.sales / campaign.spend : 0;
  const ctr  = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0;
  return { acos, roas, ctr };
}

// ─── Step 2: Rule-based decision engine (fast, deterministic) ─────────────────
export function applyRules(metrics: BotMetrics, campaign: CampaignData): BotDecision {
  const target = campaign.target_acos ?? 30;

  // Critical: ACOS > 2.5× target with sufficient data
  if (metrics.acos > target * 2.5 && campaign.clicks > 50) {
    return {
      action: 'pause',
      reason: `ACOS ${metrics.acos.toFixed(1)}% exceeds target by more than 150% (target: ${target}%)`,
      priority: 'critical',
      suggestedChange: 'Pause campaign and review keyword targeting before resuming',
    };
  }

  // High: ACOS above target with enough clicks
  if (metrics.acos > target && campaign.clicks > 25) {
    return {
      action: 'decrease_bid',
      reason: `ACOS ${metrics.acos.toFixed(1)}% is above target (${target}%) with ${campaign.clicks} clicks`,
      priority: 'high',
      suggestedChange: 'Reduce bids by 15–20% and monitor for 3–5 days',
    };
  }

  // Excellent: ACOS well below target + strong ROAS → scale
  if (metrics.acos < target * 0.7 && metrics.roas > 4) {
    return {
      action: 'scale',
      reason: `ACOS ${metrics.acos.toFixed(1)}% is excellent and ROAS ${metrics.roas.toFixed(1)} is strong`,
      priority: 'medium',
      suggestedChange: 'Increase daily budget by 20–30% to capture more sales',
    };
  }

  // Low CTR + spending with few clicks → add negative keywords
  if (metrics.ctr < 0.8 && campaign.clicks < 20 && campaign.spend > 200) {
    return {
      action: 'add_negative',
      reason: `Very low CTR (${metrics.ctr.toFixed(2)}%) despite $${campaign.spend} spend`,
      priority: 'medium',
      suggestedChange: 'Review search term report and add irrelevant terms as negative keywords',
    };
  }

  return {
    action: 'keep',
    reason: `Performance is stable — ACOS ${metrics.acos.toFixed(1)}% / ROAS ${metrics.roas.toFixed(1)}`,
    priority: 'low',
  };
}

// ─── Shared OpenAI caller ─────────────────────────────────────────────────────
export async function callOpenAI(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 200,
  temperature = 0.4,
  jsonMode = false,
): Promise<string> {
  const rawKey = process.env.OPENAI_API_KEY ?? '';
  const apiKey = rawKey.replace(/No$/, '').trim();
  if (!apiKey) return 'OpenAI API key is not configured.';

  try {
    const body: Record<string, any> = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage  },
      ],
      max_tokens: maxTokens,
      temperature,
    };
    if (jsonMode) body.response_format = { type: 'json_object' };

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? 'No response from AI.';
  } catch (e: any) {
    throw new Error(e.message);
  }
}

// ─── Step 3: AI campaign analysis ────────────────────────────────────────────
export async function getAIAnalysis(
  campaign: CampaignData,
  metrics: BotMetrics,
  ruleDecision: BotDecision,
): Promise<string> {
  const userMessage = `Analyze this Amazon Ads campaign:

Campaign: ${campaign.name}
Spend: $${campaign.spend}
Sales: $${campaign.sales}
ACOS: ${metrics.acos.toFixed(1)}%
ROAS: ${metrics.roas.toFixed(2)}
CTR: ${metrics.ctr.toFixed(2)}%
Clicks: ${campaign.clicks}
Orders: ${campaign.orders}
Budget: $${campaign.budget}

Rule engine decision: ${ruleDecision.action.toUpperCase()} — ${ruleDecision.reason}
${ruleDecision.suggestedChange ? `Suggested change: ${ruleDecision.suggestedChange}` : ''}

Give a brief (2-3 sentences) expert analysis confirming or refining this decision.
Be direct. Mention one specific action the seller should take. No fake promises.`;

  return callOpenAI(CAMPAIGN_BOT_PROMPT, userMessage, 220, 0.4);
}

// ─── Step 4: Run the bot on a list of campaigns ───────────────────────────────
export async function runBot(campaigns: CampaignData[]): Promise<BotResult[]> {
  const results: BotResult[] = [];
  for (const campaign of campaigns) {
    const metrics     = calculateMetrics(campaign);
    const ruleDecision = applyRules(metrics, campaign);
    const aiAnalysis  = await getAIAnalysis(campaign, metrics, ruleDecision);
    results.push({ campaign, metrics, ruleDecision, aiAnalysis, timestamp: new Date().toISOString() });
  }
  return results;
}
