import type { NextApiRequest, NextApiResponse } from 'next';
import { MASTER_SYSTEM_PROMPT } from '@/lib/campaignBot';
import { requireAuth } from '@/lib/auth';

function getSupportPrompt(language: string, tone: string) {
  const toneInstructions: Record<string, string> = {
    friendly: 'Be warm, friendly, and encouraging. Use a conversational tone.',
    professional: 'Be formal, professional, and precise. Use business language.',
    brief: 'Be extremely concise. Use bullet points. Maximum 2-3 sentences.',
  };

  return `${MASTER_SYSTEM_PROMPT}

You are acting as the CUSTOMER SUPPORT BOT (System 2) for M20 Autopilot.

LANGUAGE RULES:
- The user's preferred language is: ${language === 'ar' ? 'Arabic (العربية)' : 'English'}
- You MUST respond in the SAME language the user writes in
- If the user writes in Arabic, respond fully in Arabic
- If the user writes in English, respond fully in English
- If unclear, default to ${language === 'ar' ? 'Arabic' : 'English'}

TONE: ${toneInstructions[tone] || toneInstructions.friendly}

You ONLY answer questions about:
- How to use the M20 Autopilot platform
- Amazon advertising campaigns and keywords
- Profit, ACOS, ROAS and other ad analytics
- Product blacklisting and AI recommendations

You MUST:
- Be clear and concise (3-5 sentences max)
- Stay strictly within scope
- Say "${language === 'ar' ? 'يرجى التواصل مع فريق الدعم عبر support@m20.ai' : 'Please contact our support team at support@m20.ai'}" if you're unsure or if the question is out of scope

You MUST NOT:
- Talk about unrelated topics
- Give financial guarantees or promise specific results
- Invent data or make up platform features
- Discuss competitors`;
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

  try {
    const systemPrompt = getSupportPrompt(language || 'en', tone || 'friendly');

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...(history ?? []).slice(-6),
      { role: 'user' as const, content: message },
    ];

    const body = {
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 300,
      temperature: 0.5,
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
    return res.status(200).json({ reply });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
