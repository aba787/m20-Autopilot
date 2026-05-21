import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { db as adminDb } from '@/lib/supabaseAdmin';

const USER_DATA_TABLES = [
  'ad_generations',
  'accounting_snapshots',
  'job_runs',
  'notifications',
  'action_logs',
  'products',
  'negative_keywords',
  'search_terms',
  'keywords',
  'ads',
  'ad_groups',
  'campaigns',
  'rules',
  'subscriptions',
  'amazon_connections',
  'password_reset_tokens',
  'profiles',
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const user = await requireAuth(req, res);
    if (!user) return;
    return res.status(200).json({ user });
  }

  if (req.method === 'DELETE') {
    const user = await requireAuth(req, res);
    if (!user) return;

    const confirm = req.headers['x-confirm-delete'];
    if (confirm !== 'DELETE_MY_ACCOUNT') {
      return res.status(400).json({
        error: 'Account deletion requires confirmation header: X-Confirm-Delete: DELETE_MY_ACCOUNT',
      });
    }

    const userEmail = user.email.toLowerCase().trim();
    const preErrors: Array<{ table: string; error: string }> = [];

    // Pre-delete rows that would survive auth/profile cascade because their FK
    // is ON DELETE SET NULL (job_runs.user_id) or has no FK at all
    // (login_attempts). If these fail, abort BEFORE removing the auth user so
    // we never report success with residual identifiable data.
    {
      const { error } = await adminDb.from('job_runs').delete().eq('user_id', user.id);
      if (error) {
        return res.status(500).json({
          error: 'Failed to remove historical job_runs. No account data was deleted. Please retry.',
          details: error.message,
        });
      }
    }
    {
      const { error } = await adminDb
        .from('login_attempts')
        .update({ email: 'deleted_user@redacted.local', ip_address: null, user_agent: null })
        .eq('email', userEmail);
      if (error) {
        return res.status(500).json({
          error: 'Failed to anonymize login history. No account data was deleted. Please retry.',
          details: error.message,
        });
      }
    }

    const { error: authError } = await adminDb.auth.admin.deleteUser(user.id);
    if (authError) {
      return res.status(500).json({
        error: 'Failed to remove auth identity. Account history was anonymized but profile remains. Please retry or contact support.',
        details: authError.message,
      });
    }

    const cleanupErrors = preErrors;

    for (const table of USER_DATA_TABLES) {
      const col = table === 'profiles' ? 'id' : 'user_id';
      const { error } = await adminDb.from(table).delete().eq(col, user.id);
      if (error) cleanupErrors.push({ table, error: error.message });
    }

    return res.status(200).json({
      deleted: true,
      userId: user.id,
      cleanupWarnings: cleanupErrors.length > 0 ? cleanupErrors : undefined,
      message: 'Your account and all associated data have been permanently deleted.',
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
