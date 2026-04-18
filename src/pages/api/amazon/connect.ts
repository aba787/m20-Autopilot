import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.query.token as string;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  req.headers.authorization = `Bearer ${token}`;
  const user = await requireAuth(req, res);
  if (!user) return;

  const clientId = process.env.AMAZON_CLIENT_ID;
  const redirectUri = process.env.AMAZON_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return res.status(500).json({ error: 'Amazon credentials not configured' });
  }

  const payload = Buffer.from(JSON.stringify({
    uid: user.id,
    exp: Date.now() + 10 * 60 * 1000,
    nonce: Math.random().toString(36).substring(2),
  })).toString('base64url');

  const url = `https://www.amazon.com/ap/oa?client_id=${clientId}&response_type=code&scope=advertising::campaign_management&redirect_uri=${encodeURIComponent(redirectUri)}&state=${payload}`;

  res.redirect(url);
}
