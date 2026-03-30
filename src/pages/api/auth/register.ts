import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  return res.status(410).json({ error: 'Use Supabase Auth client-side: supabase.auth.signUp()' });
}
