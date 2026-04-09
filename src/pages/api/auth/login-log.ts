import type { NextApiRequest, NextApiResponse } from 'next';
import { db as adminDb } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, success, failure_reason } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    await adminDb.from('login_attempts').insert({
      email: email.toLowerCase().trim(),
      ip_address: ip,
      user_agent: userAgent,
      success: !!success,
      failure_reason: failure_reason || null,
    });

    return res.status(200).json({ logged: true });
  } catch {
    return res.status(200).json({ logged: false });
  }
}
