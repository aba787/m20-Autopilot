import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/lib/auth';
import { db as adminDb } from '@/lib/supabaseAdmin';
import { sendBulkEmail } from '@/lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const { subject, content, segment } = req.body;

  if (!subject || !content) {
    return res.status(400).json({ error: 'Subject and content are required' });
  }

  try {
    let query = adminDb
      .from('profiles')
      .select('email, full_name')
      .eq('email_notifications', true);

    if (segment === 'pro') {
      const { data: subs } = await adminDb
        .from('subscriptions')
        .select('user_id')
        .in('plan', ['pro', 'enterprise']);
      if (subs) {
        query = query.in('id', subs.map(s => s.user_id));
      }
    }

    const { data: recipients } = await query;

    if (!recipients || recipients.length === 0) {
      return res.status(200).json({ success: true, sent: 0, message: 'No eligible recipients' });
    }

    const results = await sendBulkEmail(
      recipients.map(r => ({ email: r.email, name: r.full_name || 'User' })),
      subject,
      content,
    );

    const succeeded = results.filter(r => r.success).length;
    return res.status(200).json({ success: true, sent: succeeded, total: recipients.length });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to send emails' });
  }
}
