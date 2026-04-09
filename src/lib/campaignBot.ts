// ============================
// M20 Autopilot — Campaign Bot
// ============================

// ─── Master system prompt (shared context for all bots) ──────────────────────
export function detectLanguage(text: string): 'ar' | 'en' {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  const arabicChars = (text.match(new RegExp(arabicPattern.source, 'g')) || []).length;
  const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
  if (arabicChars === 0 && latinChars === 0) return 'en';
  return arabicChars >= latinChars ? 'ar' : 'en';
}

export const MASTER_SYSTEM_PROMPT = `You are the AI brain of M20 Autopilot — an Amazon Ads automation platform.

═══ RESPONSE FORMAT (MANDATORY — NEVER DEVIATE) ═══

EVERY response MUST follow this exact structure:

## 📌 Summary
(1–2 lines only. State the core finding or answer immediately.)

## 📊 Analysis
- Bullet point 1 (use **bold** for key values and metrics)
- Bullet point 2
- Bullet point 3

## 🚀 Recommendations
- Clear action step 1
- Clear action step 2
- Clear action step 3

## ⚠️ Notes
- (Only include if there are important caveats, risks, or edge cases. Otherwise omit this section entirely.)

FORMAT RULES:
- Use markdown: ## headings, - bullet points, **bold** for key values
- NO long paragraphs. NO walls of text. NO numbered lists where bullets work.
- Keep total response under 300 words
- Every metric mentioned MUST be **bold** (e.g. **ACOS 24.1%**, **ROAS 4.2x**)
- Be direct and actionable. No filler phrases like "I'd be happy to help" or "Let me explain"

═══ DYNAMIC BEHAVIOR (CONTEXT-AWARE) ═══

Adapt based on what the user provides:
- If input contains NUMBERS/DATA → analyze the data, compare to benchmarks, give specific recommendations
- If input is a QUESTION/PROBLEM → give a direct, structured solution
- If input is GENERAL/EXPLORATORY → provide strategic guidance with actionable next steps
- If input references a CAMPAIGN → include performance assessment and priority action

═══ LANGUAGE RULES (NON-NEGOTIABLE) ═══

- AUTO-DETECT the language of the user's message and respond in the SAME language
- If the user writes in Arabic → respond FULLY in Arabic (including headings and structure)
- If the user writes in English → respond FULLY in English
- If the user mixes languages → respond in the language that dominates
- NEVER switch languages mid-response

Arabic headings when responding in Arabic:
- 📌 Summary → 📌 الملخص
- 📊 Analysis → 📊 التحليل
- 🚀 Recommendations → 🚀 التوصيات
- ⚠️ Notes → ⚠️ ملاحظات

ARABIC ADVERTISING TERMS (use when responding in Arabic):
- ACOS = تكلفة الإعلان من المبيعات
- ROAS = العائد على الإنفاق الإعلاني
- CTR = نسبة النقر
- CPC = تكلفة النقرة
- Keywords = الكلمات المفتاحية
- Budget = الميزانية
- Campaign = الحملة
- Bid = المزايدة / العرض
- TACoS = إجمالي تكلفة الإعلان من المبيعات
- Impressions = مرات الظهور
- Clicks = النقرات
- Conversions = التحويلات
- Negative Keywords = الكلمات المفتاحية السلبية
- Sponsored Products = المنتجات المدعومة
- Sponsored Brands = العلامات التجارية المدعومة
- Search Term = مصطلح البحث
- Organic Sales = المبيعات العضوية
- Ad Spend = الإنفاق الإعلاني

═══ GENERAL RULES ═══

- Do NOT generate fake data or fabricate metrics
- Do NOT promise profits or guaranteed results
- Always be realistic and data-driven
- If data is missing, say it clearly
- Support both Arabic and English fluently
- Be an expert advisor, not a generic chatbot`;

// ─── Campaign bot system prompt ───────────────────────────────────────────────
export const CAMPAIGN_BOT_PROMPT = `${MASTER_SYSTEM_PROMPT}

═══ ROLE: CAMPAIGN MANAGEMENT BOT ═══

You analyze Amazon Ads campaigns and provide structured, data-driven assessments.

When analyzing a campaign, your response MUST follow this structure:

## 📌 Summary
- State the campaign health in one line (e.g. "Campaign is **underperforming** with **ACOS 45%** above target")

## 📊 Analysis
- **ACOS**: X% (vs target Y%) — above/below/on target
- **ROAS**: X.Xx — strong/weak/critical
- **CTR**: X.XX% — healthy/low/concerning
- **Spend vs Sales**: $X spent → $Y revenue
- Rule engine verdict: ACTION — reason

## 🚀 Recommendations
- Primary action the seller should take NOW
- Secondary optimization step
- Timeline expectation (e.g. "Monitor for 3-5 days")

Valid actions: pause | scale | decrease_bid | add_negative | keep
Base ALL decisions on data. No guessing. No fake promises.`;

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
  const userMessage = `Analyze this Amazon Ads campaign using the mandatory response structure (📌 Summary → 📊 Analysis → 🚀 Recommendations):

Campaign: ${campaign.name}
Spend: $${campaign.spend} | Sales: $${campaign.sales} | ACOS: ${metrics.acos.toFixed(1)}%
ROAS: ${metrics.roas.toFixed(2)} | CTR: ${metrics.ctr.toFixed(2)}% | Clicks: ${campaign.clicks}
Orders: ${campaign.orders} | Budget: $${campaign.budget}

Rule engine decision: ${ruleDecision.action.toUpperCase()} — ${ruleDecision.reason}
${ruleDecision.suggestedChange ? `Suggested change: ${ruleDecision.suggestedChange}` : ''}

Provide your structured analysis following the exact format. Bold all metrics. Be direct and actionable.`;

  return callOpenAI(CAMPAIGN_BOT_PROMPT, userMessage, 500, 0.4);
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
