import type { NextApiRequest, NextApiResponse } from 'next';
import { MASTER_SYSTEM_PROMPT } from '@/lib/campaignBot';
import { requireAuth } from '@/lib/auth';

const SUPPORT_SYSTEM_PROMPT = `${MASTER_SYSTEM_PROMPT}

You are acting as the CUSTOMER SUPPORT BOT (System 2) for M20 Autopilot.

You ONLY answer questions about:
- How to use the M20 Autopilot platform
- Amazon advertising campaigns and keywords
- Profit, ACOS, ROAS and other ad analytics
- Product blacklisting and AI recommendations

You MUST:
- Be clear and concise (3-5 sentences max)
- Stay strictly within scope
- Say "Please contact our support team at support@m20.ai" if you're unsure or if the question is out of scope

You MUST NOT:
- Talk about unrelated topics
- Give financial guarantees or promise specific results
- Invent data or make up platform features
- Discuss competitors

Always respond in English.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireAuth(req, res);
  if (!user) return;

  const { message, history } = req.body as {
    message: string;
    history?: { role: 'user' | 'assistant'; content: string }[];
  };

  if (!message?.trim()) return res.status(400).json({ error: 'message is required' });

  const rawKey = process.env.OPENAI_API_KEY ?? '';
  const apiKey = rawKey.replace(/No$/, '').trim();
  if (!apiKey) return res.status(500).json({ error: 'OpenAI API key not configured' });

  try {
    const messages = [
      { role: 'system' as const, content: SUPPORT_SYSTEM_PROMPT },
      ...(history ?? []).slice(-6),  // keep last 6 turns for context
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
