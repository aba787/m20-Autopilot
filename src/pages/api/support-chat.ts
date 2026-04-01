import type { NextApiRequest, NextApiResponse } from 'next';
import { MASTER_SYSTEM_PROMPT } from '@/lib/campaignBot';
import { requireAuth } from '@/lib/auth';

function detectLanguage(text: string): 'ar' | 'en' {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  const arabicChars = (text.match(new RegExp(arabicPattern.source, 'g')) || []).length;
  const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
  if (arabicChars === 0 && latinChars === 0) return 'en';
  return arabicChars >= latinChars ? 'ar' : 'en';
}

function getSupportPrompt(detectedLang: string, preferredLang: string, tone: string) {
  const toneInstructions: Record<string, string> = {
    friendly: 'Be warm, friendly, and encouraging. Use a conversational tone.',
    professional: 'Be formal, professional, and precise. Use business language.',
    brief: 'Be extremely concise. Use bullet points. Maximum 2-3 sentences.',
  };

  const toneAr: Record<string, string> = {
    friendly: 'كن ودودًا ومشجعًا. استخدم أسلوب محادثة.',
    professional: 'كن رسميًا ودقيقًا. استخدم لغة أعمال.',
    brief: 'كن مختصرًا جدًا. استخدم نقاط. جملتين أو ثلاث كحد أقصى.',
  };

  return `${MASTER_SYSTEM_PROMPT}

You are acting as the CUSTOMER SUPPORT BOT (System 2) for M20 Autopilot.

CRITICAL LANGUAGE RULES:
- AUTO-DETECT the language of the user's message and respond in the SAME language
- If the user writes in Arabic → you MUST respond fully in Arabic
- If the user writes in English → you MUST respond fully in English
- If the user mixes languages → respond in the language that dominates the message
- The detected language of the current message is: ${detectedLang === 'ar' ? 'Arabic (العربية)' : 'English'}
- The user's preferred UI language is: ${preferredLang === 'ar' ? 'Arabic (العربية)' : 'English'}
- When in doubt, use the detected language of the message, NOT the UI language

ARABIC ADVERTISING TERMINOLOGY:
When responding in Arabic, use these standard terms:
- ACOS = تكلفة الإعلان من المبيعات (ACOS)
- ROAS = العائد على الإنفاق الإعلاني (ROAS)
- CTR = نسبة النقر (CTR)
- CPC = تكلفة النقرة (CPC)
- Impressions = مرات الظهور
- Clicks = النقرات
- Conversions = التحويلات
- Keywords = الكلمات المفتاحية
- Negative Keywords = الكلمات المفتاحية السلبية
- Bid = العرض / المزايدة
- Budget = الميزانية
- Campaign = الحملة
- Sponsored Products = المنتجات المدعومة
- Sponsored Brands = العلامات التجارية المدعومة
- Search Term = مصطلح البحث
- TACoS = إجمالي تكلفة الإعلان من المبيعات (TACoS)
- Organic Sales = المبيعات العضوية
- Ad Spend = الإنفاق الإعلاني

TONE: ${detectedLang === 'ar' ? (toneAr[tone] || toneAr.friendly) : (toneInstructions[tone] || toneInstructions.friendly)}

You ONLY answer questions about:
- How to use the M20 Autopilot platform (كيفية استخدام منصة M20)
- Amazon advertising campaigns and keywords (حملات وكلمات أمازون الإعلانية)
- Profit, ACOS, ROAS and other ad analytics (الأرباح والتحليلات الإعلانية)
- Product blacklisting and AI recommendations (القائمة السوداء وتوصيات الذكاء الاصطناعي)
- Budget optimization and strategy (تحسين الميزانية والاستراتيجية)
- Amazon seller best practices (أفضل ممارسات بائعي أمازون)

You MUST:
- Be clear and concise (3-5 sentences max)
- Stay strictly within scope
- Provide actionable advice with specific numbers when possible

You MUST NOT:
- Talk about unrelated topics
- Give financial guarantees or promise specific results
- Invent data or make up platform features
- Discuss competitors

If the question is out of scope, say:
${detectedLang === 'ar' ? 'هذا السؤال خارج نطاق تخصصي. يرجى التواصل مع فريق الدعم عبر support@m20.ai' : 'This question is outside my scope. Please contact our support team at support@m20.ai'}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireAuth(req, res);
  if (!user) return;

  const { message, history, language, tone } = req.body as {
    message: string;
    history?: { role: 'user' | 'assistant'; content: string }[];
    language?: string;
    tone?: string;
  };

  if (!message?.trim()) return res.status(400).json({ error: 'message is required' });

  const rawKey = process.env.OPENAI_API_KEY ?? '';
  const apiKey = rawKey.replace(/No$/, '').trim();
  if (!apiKey) return res.status(500).json({ error: 'OpenAI API key not configured' });

  const detectedLang = detectLanguage(message);

  try {
    const systemPrompt = getSupportPrompt(detectedLang, language || 'en', tone || 'friendly');

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...(history ?? []).slice(-8),
      { role: 'user' as const, content: message },
    ];

    const body = {
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 400,
      temperature: 0.4,
    };

    const openRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!openRes.ok) {
      const err = await openRes.json();
      return res.status(openRes.status).json({ error: err?.error?.message ?? 'OpenAI error' });
    }

    const data = await openRes.json();
    const reply = data.choices?.[0]?.message?.content?.trim() ?? 'No response.';
    return res.status(200).json({ reply, detected_language: detectedLang });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
