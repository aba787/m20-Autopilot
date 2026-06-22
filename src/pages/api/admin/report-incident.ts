import type { NextApiRequest, NextApiResponse } from 'next';
import { db as adminDb } from '@/lib/supabaseAdmin';
import { sendEmail } from '@/lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = authHeader.slice(7);

  const { data: { user }, error: authError } = await adminDb.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

  const { data: profile } = await adminDb.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

  const { title, description, severity, discovered_at } = req.body;
  if (!title || !description || !severity) {
    return res.status(400).json({ error: 'title, description, and severity are required' });
  }

  const reportedAt = new Date().toISOString();
  const discoveredAt = discovered_at || reportedAt;
  const hoursElapsed = Math.floor(
    (new Date(reportedAt).getTime() - new Date(discoveredAt).getTime()) / 3_600_000
  );
  const within24h = hoursElapsed <= 24;

  const html = `
    <div style="font-family:sans-serif;max-width:700px;margin:0 auto;background:#0f0a1a;color:#e2e8f0;padding:32px;border-radius:12px;">
      <h1 style="color:#f97316;margin-top:0;">🚨 Security Incident Report — M20 Autopilot</h1>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr><td style="padding:8px 12px;background:#1e1030;color:#94a3b8;width:180px;border-radius:6px 0 0 6px;">Severity</td>
            <td style="padding:8px 12px;background:#1a0f2e;font-weight:700;color:${severity === 'critical' ? '#ef4444' : severity === 'high' ? '#f97316' : '#eab308'};">${severity.toUpperCase()}</td></tr>
        <tr><td style="padding:8px 12px;background:#1e1030;color:#94a3b8;">Title</td>
            <td style="padding:8px 12px;background:#1a0f2e;">${title}</td></tr>
        <tr><td style="padding:8px 12px;background:#1e1030;color:#94a3b8;">Discovered At</td>
            <td style="padding:8px 12px;background:#1a0f2e;">${new Date(discoveredAt).toUTCString()}</td></tr>
        <tr><td style="padding:8px 12px;background:#1e1030;color:#94a3b8;">Reported At</td>
            <td style="padding:8px 12px;background:#1a0f2e;">${new Date(reportedAt).toUTCString()}</td></tr>
        <tr><td style="padding:8px 12px;background:#1e1030;color:#94a3b8;">Time Elapsed</td>
            <td style="padding:8px 12px;background:#1a0f2e;color:${within24h ? '#22c55e' : '#ef4444'};">${hoursElapsed}h ${within24h ? '✅ Within 24h' : '⚠️ Exceeds 24h'}</td></tr>
        <tr><td style="padding:8px 12px;background:#1e1030;color:#94a3b8;">Reported By</td>
            <td style="padding:8px 12px;background:#1a0f2e;">${user.email}</td></tr>
      </table>
      <h3 style="color:#e2e8f0;">Description</h3>
      <div style="background:#1e1030;padding:16px;border-radius:8px;border-left:3px solid #f97316;white-space:pre-wrap;">${description}</div>
      <hr style="border:none;border-top:1px solid #2d1b4e;margin:24px 0;"/>
      <p style="color:#64748b;font-size:12px;">This report was automatically sent from M20 Autopilot Security Console.<br/>Application: M20 Autopilot — Amazon Advertising SaaS</p>
    </div>`;

  const emailResult = await sendEmail({
    to: 'security@amazon.com',
    subject: `[SECURITY INCIDENT][${severity.toUpperCase()}] ${title} — M20 Autopilot`,
    html,
    tags: [{ name: 'type', value: 'security_incident' }],
  });

  await adminDb.from('action_logs').insert({
    user_id: user.id,
    action_type: 'security_incident_reported',
    actor: 'user',
    mode: 'safe',
    status: emailResult.success ? 'executed' : 'failed',
    payload: { title, severity, discovered_at: discoveredAt, reported_at: reportedAt, within_24h: within24h },
    error: emailResult.success ? null : emailResult.error,
  });

  return res.status(200).json({
    success: true,
    within24h,
    hoursElapsed,
    emailSent: emailResult.success,
    reportedAt,
  });
}
