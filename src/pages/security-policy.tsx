import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth, authFetch } from '@/lib/useAuth';
import { useI18n } from '@/lib/i18n';
import {
  ShieldCheck, AlertTriangle, Clock, Mail, RefreshCw,
  ChevronDown, ChevronUp, Send, CheckCircle, XCircle,
} from 'lucide-react';

const CARD: React.CSSProperties = {
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  borderRadius: '0.875rem',
  padding: '1.5rem',
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#eab308',
  low:      '#22c55e',
};

export default function SecurityPolicyPage() {
  const { t, dir } = useI18n();
  const { user, token } = useAuth();
  const router = useRouter();
  const af = authFetch(token);

  const [openSection, setOpenSection] = useState<string | null>('roles');
  const [form, setForm] = useState({ title: '', description: '', severity: 'high', discovered_at: '' });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; within24h?: boolean; hoursElapsed?: number; message?: string } | null>(null);

  const toggle = (s: string) => setOpenSection(prev => prev === s ? null : s);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await af('/api/admin/report-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) setResult({ success: true, within24h: data.within24h, hoursElapsed: data.hoursElapsed });
      else setResult({ success: false, message: data.error });
    } catch {
      setResult({ success: false, message: 'Network error' });
    } finally {
      setSubmitting(false);
    }
  };

  const sections = [
    {
      id: 'roles',
      icon: <ShieldCheck className="w-5 h-5" />,
      title: 'Defined Roles & Responsibilities',
      titleAr: 'الأدوار والمسؤوليات المحددة',
      content: (
        <div className="space-y-3">
          {[
            { role: 'Security Owner (Admin)', resp: 'Primary contact for all security incidents. Responsible for initial assessment, escalation, and notifying Amazon within 24 hours.' },
            { role: 'Developer / Tech Lead', resp: 'Investigates technical root cause, applies hotfixes, and documents remediation steps within 72 hours.' },
            { role: 'Operations Manager', resp: 'Coordinates communication with affected users, manages business continuity, and leads 6-month policy reviews.' },
            { role: 'All Users', resp: 'Immediately report any suspected security issues to the Security Owner. Do not attempt independent remediation.' },
          ].map(({ role, resp }) => (
            <div key={role} style={{ background: 'var(--bg-secondary)', borderRadius: '0.5rem', padding: '1rem' }}>
              <p className="font-semibold text-sm mb-1" style={{ color: 'var(--accent)' }}>{role}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{resp}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'response',
      icon: <Clock className="w-5 h-5" />,
      title: '24-Hour Incident Response Procedure',
      titleAr: 'إجراءات الاستجابة خلال 24 ساعة',
      content: (
        <div className="space-y-3">
          {[
            { time: '0–1h',  step: 'Detection & Triage', desc: 'Identify and confirm the incident. Assess scope and severity (Critical / High / Medium / Low).' },
            { time: '1–4h',  step: 'Containment',        desc: 'Isolate affected systems or accounts. Revoke compromised tokens. Block malicious IPs if identified.' },
            { time: '4–8h',  step: 'Amazon Notification', desc: 'Report to security@amazon.com with incident title, severity, description, and discovery time. Use the Report Form below.' },
            { time: '8–24h', step: 'Evidence Preservation', desc: 'Capture logs, screenshots, and affected data records. Store securely for 12 months minimum.' },
            { time: '24–72h', step: 'Eradication & Recovery', desc: 'Remove root cause, apply patches, verify system integrity, restore normal operations.' },
            { time: '72h+',  step: 'Post-Incident Review', desc: 'Document lessons learned, update procedures, and notify affected users as required by law.' },
          ].map(({ time, step, desc }, i) => (
            <div key={i} className="flex gap-3" style={{ background: 'var(--bg-secondary)', borderRadius: '0.5rem', padding: '1rem' }}>
              <div className="flex-shrink-0 text-xs font-mono px-2 py-1 rounded" style={{ background: 'rgba(0,217,255,0.1)', color: 'var(--accent)', height: 'fit-content' }}>{time}</div>
              <div>
                <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{step}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'review',
      icon: <RefreshCw className="w-5 h-5" />,
      title: '6-Month Review Schedule',
      titleAr: 'جدول المراجعة كل 6 أشهر',
      content: (
        <div className="space-y-3">
          {[
            { item: 'Access Control Audit', desc: 'Review all admin accounts, revoke unnecessary access, and verify RLS policies are enforced.' },
            { item: 'Credential Rotation', desc: 'Rotate API keys (Amazon, Supabase service_role, OpenAI, Resend) and update secrets in Replit.' },
            { item: 'Dependency Scan', desc: 'Run npm audit to identify and patch vulnerable dependencies.' },
            { item: 'Incident Log Review', desc: 'Review all security events in action_logs over the past 6 months. Identify patterns.' },
            { item: 'Policy Update', desc: 'Update this incident response policy to reflect any changes in architecture or team structure.' },
            { item: 'Amazon Compliance Check', desc: 'Verify continued compliance with Amazon Ads API security requirements and LPA policy.' },
          ].map(({ item, desc }) => (
            <div key={item} style={{ background: 'var(--bg-secondary)', borderRadius: '0.5rem', padding: '1rem' }}>
              <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>✓ {item}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
            </div>
          ))}
          <div className="text-sm p-3 rounded-lg" style={{ background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.15)', color: 'var(--text-secondary)' }}>
            📅 <strong style={{ color: 'var(--text-primary)' }}>Next scheduled review:</strong> Every 6 months from the date of last review. Calendar reminders must be set by the Operations Manager.
          </div>
        </div>
      ),
    },
    {
      id: 'passwords',
      icon: <ShieldCheck className="w-5 h-5" />,
      title: 'Password & Authentication Policy',
      titleAr: 'سياسة كلمات المرور والمصادقة',
      content: (
        <div className="space-y-3">
          {[
            { rule: 'Minimum Length', value: '12 characters (Amazon Ads API requirement)' },
            { rule: 'Complexity', value: 'Must include at least 3 of: uppercase, lowercase, digit, special symbol' },
            { rule: 'Multi-Factor Authentication (MFA)', value: 'Required at signup and login via OTP email verification' },
            { rule: 'Password Expiry', value: '365 days — users must reset annually' },
            { rule: 'Account Lockout', value: '5 failed attempts within 15 minutes → 15-minute lockout (enforced via Supabase Auth Hook)' },
            { rule: 'Credential Storage', value: 'Hashed by Supabase Auth (bcrypt). API keys stored in encrypted secrets, never in source code.' },
          ].map(({ rule, value }) => (
            <div key={rule} className="flex gap-3 text-sm" style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>
              <span className="font-medium w-48 flex-shrink-0" style={{ color: 'var(--text-primary)' }}>{rule}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{value}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div dir={dir} style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)' }}>
          <ShieldCheck className="w-6 h-6" style={{ color: '#ef4444' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Incident Response Policy</h1>
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
            Amazon Ads API Security Compliance — Last reviewed: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Amazon notification', value: '< 24 hours', color: '#22c55e' },
          { label: 'Policy review cycle', value: 'Every 6 months', color: 'var(--accent)' },
          { label: 'Min. password length', value: '12 characters', color: '#f97316' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ ...CARD, textAlign: 'center' }}>
            <p className="text-xl font-bold mb-1" style={{ color }}>{value}</p>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3 mb-8">
        {sections.map(({ id, icon, title, titleAr, content }) => (
          <div key={id} style={CARD}>
            <button
              onClick={() => toggle(id)}
              className="w-full flex items-center justify-between gap-3 text-left"
            >
              <div className="flex items-center gap-3">
                <span style={{ color: 'var(--accent)' }}>{icon}</span>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{titleAr}</p>
                </div>
              </div>
              {openSection === id
                ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-dim)' }} />
                : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-dim)' }} />}
            </button>
            {openSection === id && <div className="mt-4">{content}</div>}
          </div>
        ))}
      </div>

      {user?.role === 'admin' && (
        <div style={CARD}>
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5" style={{ color: '#f97316' }} />
            <div>
              <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>Report Security Incident to Amazon</h2>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                Sends report to <span style={{ color: 'var(--accent)' }}>security@amazon.com</span> and logs it in the system
              </p>
            </div>
          </div>

          {result && (
            <div className="mb-4 p-3 rounded-lg flex items-start gap-2" style={{
              background: result.success ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${result.success ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
            }}>
              {result.success
                ? <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
                : <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />}
              <div className="text-sm">
                {result.success ? (
                  <>
                    <p style={{ color: '#22c55e' }} className="font-semibold">Report sent to security@amazon.com ✓</p>
                    <p style={{ color: 'var(--text-dim)' }}>
                      Time elapsed: {result.hoursElapsed}h —{' '}
                      <span style={{ color: result.within24h ? '#22c55e' : '#ef4444' }}>
                        {result.within24h ? '✅ Within 24-hour requirement' : '⚠️ Exceeds 24-hour requirement'}
                      </span>
                    </p>
                  </>
                ) : (
                  <p style={{ color: '#ef4444' }}>{result.message}</p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Incident Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Unauthorized API access detected"
                style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', color: 'var(--text-primary)', fontSize: '0.875rem' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Severity *</label>
                <select
                  value={form.severity}
                  onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}
                  style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', color: SEVERITY_COLORS[form.severity], fontSize: '0.875rem' }}
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Discovery Date/Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={form.discovered_at}
                  onChange={e => setForm(f => ({ ...f, discovered_at: e.target.value }))}
                  style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', color: 'var(--text-primary)', fontSize: '0.875rem', colorScheme: 'dark' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Description *</label>
              <textarea
                required
                rows={5}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe what happened, what data was affected, and initial containment steps taken..."
                style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', color: 'var(--text-primary)', fontSize: '0.875rem', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm"
              style={{ background: submitting ? 'var(--bg-secondary)' : 'linear-gradient(135deg,#dc2626,#ef4444)', color: submitting ? 'var(--text-dim)' : '#fff', cursor: submitting ? 'not-allowed' : 'pointer', border: 'none' }}
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Sending...' : 'Send to security@amazon.com'}
            </button>
          </form>
        </div>
      )}

      {user?.role !== 'admin' && (
        <div className="p-4 rounded-lg text-sm text-center" style={{ background: 'var(--bg-secondary)', color: 'var(--text-dim)' }}>
          <AlertTriangle className="w-4 h-4 inline mr-2" style={{ color: '#eab308' }} />
          Incident reporting is available to administrators only.
        </div>
      )}
    </div>
  );
}
