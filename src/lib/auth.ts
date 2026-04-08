import type { NextApiRequest, NextApiResponse } from 'next';
import { db as adminDb } from './supabaseAdmin';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string | null;
  bot_mode: 'safe' | 'semi' | 'auto';
  target_acos: number;
  role: 'admin' | 'user';
}

function getTokenFromRequest(req: NextApiRequest): string | null {
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<AuthUser | null> {
  const token = getTokenFromRequest(req);
  if (!token) {
    res.status(401).json({ error: 'Not authenticated' });
    return null;
  }

  const { data: { user: authUser }, error: authError } = await adminDb.auth.getUser(token);

  if (authError || !authUser) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return null;
  }

  const { data: profile, error } = await adminDb
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (error || !profile) {
    res.status(401).json({ error: 'User profile not found' });
    return null;
  }

  return { ...profile, role: profile.role ?? 'user' } as AuthUser;
}

export async function optionalAuth(
  req: NextApiRequest,
): Promise<AuthUser | null> {
  const token = getTokenFromRequest(req);
  if (!token) return null;

  const { data: { user: authUser }, error: authError } = await adminDb.auth.getUser(token);
  if (authError || !authUser) return null;

  const { data: profile, error } = await adminDb
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (error || !profile) return null;
  return { ...profile, role: profile.role ?? 'user' } as AuthUser;
}

export async function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<AuthUser | null> {
  const user = await requireAuth(req, res);
  if (!user) return null;
  if (user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return null;
  }
  return user;
}

export async function logAction(params: {
  user_id: string;
  campaign_id?: string;
  keyword_id?: string;
  action_type: string;
  actor: 'ai' | 'user';
  mode: 'safe' | 'semi' | 'auto';
  status: 'pending' | 'approved' | 'rejected' | 'executed' | 'failed';
  payload: Record<string, unknown>;
  result?: Record<string, unknown> | null;
  error?: string | null;
}) {
  await adminDb.from('action_logs').insert({
    user_id: params.user_id,
    campaign_id: params.campaign_id ?? null,
    keyword_id: params.keyword_id ?? null,
    action_type: params.action_type,
    actor: params.actor,
    mode: params.mode,
    status: params.status,
    payload: params.payload,
    result: params.result ?? null,
    error: params.error ?? null,
  });
}

export async function createNotification(params: {
  user_id: string;
  title: string;
  body: string;
  type: 'info' | 'warning' | 'error' | 'success';
  link?: string;
  campaign_id?: string;
}) {
  await adminDb.from('notifications').insert({
    user_id: params.user_id,
    title: params.title,
    body: params.body,
    type: params.type,
    read: false,
    link: params.link ?? null,
    campaign_id: params.campaign_id ?? null,
  });
}
