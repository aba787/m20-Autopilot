import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { db as adminDb } from './supabaseAdmin';

const JWT_SECRET = process.env.SESSION_SECRET ?? 'fallback-dev-secret-change-me';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string | null;
  bot_mode: 'safe' | 'semi' | 'auto';
  target_acos: number;
  role: 'admin' | 'user';
}

export function signToken(payload: { sub: string; email: string; role?: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { sub: string; email: string; role?: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: string; email: string; role?: string };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextApiRequest): string | null {
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  const cookie = req.cookies?.m20_token;
  return cookie ?? null;
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

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return null;
  }

  const { data: profile, error } = await adminDb
    .from('profiles')
    .select('*')
    .eq('id', payload.sub)
    .single();

  if (error || !profile) {
    res.status(401).json({ error: 'User not found' });
    return null;
  }

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

export function setAuthCookie(res: NextApiResponse, token: string) {
  res.setHeader('Set-Cookie',
    `m20_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`
  );
}

export function clearAuthCookie(res: NextApiResponse) {
  res.setHeader('Set-Cookie',
    `m20_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
  );
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
    user_id:     params.user_id,
    campaign_id: params.campaign_id ?? null,
    keyword_id:  params.keyword_id  ?? null,
    action_type: params.action_type,
    actor:       params.actor,
    mode:        params.mode,
    status:      params.status,
    payload:     params.payload,
    result:      params.result ?? null,
    error:       params.error  ?? null,
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
    user_id:     params.user_id,
    title:       params.title,
    body:        params.body,
    type:        params.type,
    read:        false,
    link:        params.link        ?? null,
    campaign_id: params.campaign_id ?? null,
  });
}
