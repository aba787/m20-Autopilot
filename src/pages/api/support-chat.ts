import type { NextApiRequest, NextApiResponse } from 'next';
import { MASTER_SYSTEM_PROMPT } from '@/lib/campaignBot';
import { requireAuth } from '@/lib/auth';

function detectLanguage(text: string): string {
  const arabicChars = (text.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g) || []).length;
  const chineseChars = (text.match(/[\u4E00-\u9FFF\u3400-\u4DBF]/g) || []).length;
  const japaneseChars = (text.match(/[\u3040-\u30FF]/g) || []).length;
  const koreanChars = (text.match(/[\uAC00-\uD7AF]/g) || []).length;

  if (arabicChars > 0) return 'ar';
  if (chineseChars > 0) return 'zh';
  if (japaneseChars > 0) return 'ja';
  if (koreanChars > 0) return 'ko';

  if (/[üöäß]/.test(text)) return 'de';
  if (/[şğı]/.test(text)) return 'tr';
  if (/[ñ¿¡]/.test(text)) return 'es';
  if (/[éàçèêûîôùâœæ]/.test(text)) return 'fr';

  return 'en';
}

const languageNames: Record<string, string> = {
  ar: 'Arabic (العربية)',
  en: 'English',
  es: 'Spanish (Español)',
  fr: 'French (Français)',
  de: 'German (Deutsch)',
  tr: 'Turkish (Türkçe)',
  zh: 'Chinese (中文)',
  ja: 'Japanese (日本語)',
  ko: 'Korean (한국어)',
};

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

  const detectedLangName = languageNames[detectedLang] || detectedLang;
  const toneInstruction = detectedLang === 'ar'
    ? (toneAr[tone] || toneAr.friendly)
    : (toneInstructions[tone] || toneInstructions.friendly);

  return `${MASTER_SYSTEM_PROMPT}

═══ ROLE: CUSTOMER SUPPORT BOT ═══

You are the AI Assistant for M20 Autopilot. You help sellers optimize their Amazon advertising.

LANGUAGE RULES (CRITICAL):
- The user is writing in: ${detectedLangName}
- You MUST respond ENTIRELY in ${detectedLangName}
- Do NOT switch languages under any circumstances
- This applies even if the question is simple or the language is not English or Arabic

TONE: ${toneInstruction}

SCOPE — You ONLY answer questions about:
- M20 Autopilot platform usage
- Amazon advertising (campaigns, keywords, bids, budgets)
- Ad analytics (ACOS, ROAS, CTR, TACoS, profit)
- Product optimization and blacklisting
- AI recommendations and automation settings
- Amazon seller best practices

RESPONSE RULES:
- ALWAYS use the structured format: 📌 Summary → 📊 Analysis → 🚀 Recommendations
- For simple questions, you may use a shorter version (📌 + 🚀 only)
- Use **bold** for all metrics and key values
- Maximum 200 words for chat responses
- Be direct, no filler phrases

OUT OF SCOPE:
If out of scope, respond in ${detectedLangName}: direct the user to contact m20.m.devlet@gmail.com`;
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

  const apiKey = (process.env.OPENAI_API_KEY ?? '').trim();
  if (!apiKey) return res.status(500).json({ error: 'OpenAI API key not configured' });

  const detectedLang = detectLanguage(message);

  try {
    const systemPrompt = getSupportPrompt(detectedLang, language || 'en', tone || 'friendly');

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...(history ?? []).slice(-20),
      { role: 'user' as const, content: message },
    ];

    const body = {
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 600,
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
