import type { NextApiRequest, NextApiResponse } from 'next';
import { MASTER_SYSTEM_PROMPT } from '@/lib/campaignBot';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAuth } from '@/lib/auth';

const AD_GEN_SYSTEM_PROMPT = `${MASTER_SYSTEM_PROMPT}

You are acting as the AD GENERATOR BOT (System 3) for M20 Autopilot.

Your job:
- Generate high-converting Amazon ad content based on a product name (and optional category/brand)

You MUST return ONLY valid JSON (no markdown, no extra text) in this exact format:
{
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8", "keyword9", "keyword10"],
  "headlines": ["headline1", "headline2", "headline3", "headline4", "headline5"],
  "description": "A professional product description of 100-150 words optimized for Amazon listings.",
  "targeting": "Targeting strategy: audience, match types, and suggested bid range."
}

Rules:
- keywords: exactly 10, buyer-intent, specific to the product — NO generic terms
- headlines: exactly 5, short (under 50 chars each), catchy and conversion-focused
- description: professional, SEO-friendly, highlight key benefits and features
- targeting: practical targeting advice (match types, audiences, bid range)
- Do NOT generate fake sales numbers or guaranteed results
- All content must be in English`;

export interface AdGenResult {
  keywords: string[];
  headlines: string[];
  description: string;
  targeting: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireAuth(req, res);
  if (!user) return;

  const { productName, category, brand } = req.body as {
    productName: string;
    category?: string;
    brand?: string;
  };

  if (!productName?.trim()) return res.status(400).json({ error: 'productName is required' });

  const rawKey = process.env.OPENAI_API_KEY ?? '';
  const apiKey = rawKey.replace(/No$/, '').trim();
  if (!apiKey) return res.status(500).json({ error: 'OpenAI API key not configured' });

  const userMessage = `Generate Amazon ad content for the following product:

Product Name: ${productName}${category ? `\nCategory: ${category}` : ''}${brand ? `\nBrand: ${brand}` : ''}

Return ONLY valid JSON with no extra text.`;

  try {
    const openRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: AD_GEN_SYSTEM_PROMPT },
          { role: 'user',   content: userMessage },
        ],
        max_tokens: 800,
        temperature: 0.6,
        response_format: { type: 'json_object' },
      }),
    });

    if (!openRes.ok) {
      const err = await openRes.json();
      return res.status(openRes.status).json({ error: err?.error?.message ?? 'OpenAI error' });
    }

    const data = await openRes.json();
    const raw  = data.choices?.[0]?.message?.content?.trim() ?? '{}';

    let result: AdGenResult;
    try {
      result = JSON.parse(raw);
    } catch {
      return res.status(500).json({ error: 'Failed to parse AI response as JSON' });
    }

    await supabaseAdmin.from('ad_generations').insert({
      user_id:     user.id,
      product_name: productName.trim(),
      category:    category?.trim() || null,
      brand:       brand?.trim()    || null,
      keywords:    result.keywords  ?? [],
      headlines:   result.headlines ?? [],
      description: result.description ?? '',
      targeting:   result.targeting   ?? '',
    });

    return res.status(200).json({ result });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
