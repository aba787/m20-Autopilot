import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { getAmazonConnection, syncCampaigns } from '@/lib/amazonApi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await requireAuth(req, res);
  if (!auth) return;

  try {
    const connection = await getAmazonConnection(auth.id);
    if (!connection) return res.status(400).json({ error: 'No Amazon account connected. Please connect your Amazon Ads account first.' });

    const result = await syncCampaigns(auth.id, connection);
    return res.status(200).json({ success: true, synced: result });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Sync failed' });
  }
}
