import { useState, useEffect, useCallback } from 'react';
import { Settings as SettingsIcon, Save, Link2, Globe, Bell, Shield, Bot, Languages, MessageSquare, Mail, FileText, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useAuth, authFetch } from '@/lib/useAuth';

const CARD = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)' } as const;

const inputStyle: React.CSSProperties = {
  background: 'var(--input-bg)',
  border: '1px solid var(--input-border)',
  borderRadius: '0.5rem',
  color: 'var(--text-secondary)',
  padding: '0.375rem 0.75rem',
  outline: 'none',
  width: '100%',
  fontSize: '0.875rem',
};

export default function Settings() {
  const { t, lang, setLang, tone, setTone, automationEnabled, setAutomationEnabled } = useI18n();
  const { token } = useAuth();
  const af = authFetch(token);
  const [amazonLink,   setAmazonLink]   = useState('https://www.amazon.com/s?me=XXXXXXXX');
  const [currency,     setCurrency]     = useState('SAR');
  const [timezone,     setTimezone]     = useState('Asia/Riyadh');
  const [targetAcos,   setTargetAcos]   = useState('25');
  const [emailAlerts,    setEmailAlerts]    = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [saved,        setSaved]        = useState(false);
  const [showAutoWarning, setShowAutoWarning] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!token) return;
    try {
      const res = await af('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.email_notifications !== undefined) setMarketingEmails(data.email_notifications);
        if (data.target_acos) setTargetAcos(String(data.target_acos));
        if (data.automation_enabled !== undefined) setAutomationEnabled(data.automation_enabled);
      }
    } catch {}
  }, [token]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  useEffect(() => {
    if (automationEnabled) {
      setShowAutoWarning(true);
      const timer = setTimeout(() => setShowAutoWarning(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [automationEnabled]);

  const save = async () => {
    if (token) {
      try {
        await af('/api/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email_notifications: marketingEmails,
            target_acos: parseFloat(targetAcos) || 25,
            automation_enabled: automationEnabled,
          }),
        });
      } catch {}
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <div onClick={onChange}
      className="w-11 h-6 rounded-full cursor-pointer transition-colors flex-shrink-0"
      style={{ background: value ? 'var(--accent)' : 'var(--hover-bg)', boxShadow: value ? 'var(--accent-glow)' : 'none' }}>
      <div className={`w-4 h-4 bg-white rounded-full m-1 transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  );

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5" style={{ color: 'var(--accent)' }} /> {t('settings.title')}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('settings.subtitle')}</p>
      </div>

      {showAutoWarning && (
        <div className="p-4 rounded-xl flex items-start gap-3 animate-pulse"
          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.4)' }}>
          <Bot className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
          <p className="text-sm font-semibold" style={{ color: 'var(--warning)' }}>
            {t('auto.warning')}
          </p>
        </div>
      )}

      <div className="p-5" style={CARD}>
        <h2 className="font-bold text-base mb-4 text-white flex items-center gap-2">
          <Languages className="w-4 h-4" style={{ color: 'var(--accent)' }} /> {t('settings.language')} & {t('settings.tone')}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('settings.language')}</label>
            <select value={lang} onChange={e => setLang(e.target.value as any)}
              style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="en">English</option>
              <option value="ar">العربية (Arabic)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('settings.tone')}</label>
            <select value={tone} onChange={e => setTone(e.target.value as any)}
              style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="friendly">{t('settings.toneFriendly')}</option>
              <option value="professional">{t('settings.toneProfessional')}</option>
              <option value="brief">{t('settings.toneBrief')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-5" style={{
        ...CARD,
        border: automationEnabled ? '1px solid rgba(16,185,129,0.4)' : '1px solid var(--card-border)',
        background: automationEnabled ? 'rgba(16,185,129,0.04)' : 'var(--card-bg)',
      }}>
        <h2 className="font-bold text-base mb-4 text-white flex items-center gap-2">
          <Bot className="w-4 h-4" style={{ color: automationEnabled ? 'var(--success)' : 'var(--accent)' }} /> {t('auto.title')}
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-white flex items-center gap-2">
              {automationEnabled ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  🟢 {t('auto.on')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--error)', border: '1px solid rgba(239,68,68,0.3)' }}>
                  🔴 {t('auto.off')}
                </span>
              )}
            </p>
            <p className="text-xs mt-1.5" style={{ color: 'var(--text-dim)' }}>{t('auto.desc')}</p>
          </div>
          <Toggle value={automationEnabled} onChange={() => setAutomationEnabled(!automationEnabled)} />
        </div>
      </div>

      <div className="p-5" style={CARD}>
        <h2 className="font-bold text-base mb-4 text-white flex items-center gap-2">
          <Link2 className="w-4 h-4" style={{ color: 'var(--accent)' }} /> {t('settings.amazonStore')}
        </h2>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('settings.storeUrl')}</label>
          <input type="url" value={amazonLink} onChange={e => setAmazonLink(e.target.value)}
            style={{ ...inputStyle, fontFamily: 'monospace' }}
            dir="ltr" placeholder="https://www.amazon.com/..." />
        </div>
      </div>

      <div className="p-5" style={CARD}>
        <h2 className="font-bold text-base mb-4 text-white flex items-center gap-2">
          <Globe className="w-4 h-4" style={{ color: 'var(--success)' }} /> {t('settings.currency')}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('settings.currency')}</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="SAR">{t('settings.sarOption')}</option>
              <option value="USD">{t('settings.usdOption')}</option>
              <option value="AED">{t('settings.aedOption')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('settings.timezone')}</label>
            <select value={timezone} onChange={e => setTimezone(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="Asia/Riyadh">Riyadh (AST)</option>
              <option value="America/New_York">New York (ET)</option>
              <option value="America/Los_Angeles">Los Angeles (PT)</option>
              <option value="Europe/London">London (GMT)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-5" style={CARD}>
        <h2 className="font-bold text-base mb-4 text-white flex items-center gap-2">
          <SettingsIcon className="w-4 h-4 text-amber-400" /> {t('settings.perfGoals')}
        </h2>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('settings.targetAcos')}</label>
          <div className="flex items-center gap-3">
            <input type="number" value={targetAcos} onChange={e => setTargetAcos(e.target.value)}
              style={{ ...inputStyle, width: '7rem' }}
              min="5" max="100" dir="ltr" />
          </div>
        </div>
      </div>

      <div className="p-5" style={CARD}>
        <h2 className="font-bold text-base mb-4 text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" /> {t('settings.notifications')}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">{t('settings.emailAlerts')}</p>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                {lang === 'ar' ? 'تلقي تنبيهات فورية عند انخفاض الأداء' : 'Get instant alerts when performance declines'}
              </p>
            </div>
            <Toggle value={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
          </div>
          <div className="flex items-center justify-between" style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <p className="text-sm font-semibold text-white">
                {lang === 'ar' ? 'رسائل التحديثات والإعلانات' : 'Updates & Announcements'}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                {lang === 'ar' ? 'استلام رسائل بريدية حول الميزات الجديدة والتحديثات' : 'Receive emails about new features, tips, and platform updates'}
              </p>
            </div>
            <Toggle value={marketingEmails} onChange={() => setMarketingEmails(!marketingEmails)} />
          </div>
          <div className="flex items-center justify-between" style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <p className="text-sm font-semibold text-white">{t('settings.autoOptimize')}</p>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                {lang === 'ar' ? 'السماح للذكاء الاصطناعي بتطبيق التوصيات تلقائيًا' : 'Allow AI to apply recommendations automatically'}
              </p>
            </div>
            <Toggle value={automationEnabled} onChange={() => setAutomationEnabled(!automationEnabled)} />
          </div>
        </div>
      </div>

      <div className="p-5" style={CARD}>
        <h2 className="font-bold text-base mb-4 text-white flex items-center gap-2">
          <Mail className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          {lang === 'ar' ? 'الدعم والقانوني' : 'Support & Legal'}
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">
                {lang === 'ar' ? 'البريد الإلكتروني للدعم' : 'Support Email'}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                {lang === 'ar' ? 'للمساعدة الفنية والفوترة وأي استفسار' : 'For technical help, billing, and any inquiries'}
              </p>
            </div>
            <a href="mailto:m20.m.devlet@gmail.com"
              className="text-sm px-3 py-1.5 rounded-lg font-medium inline-flex items-center gap-2"
              style={{
                color: 'var(--accent)',
                background: 'var(--accent-bg-strong)',
                border: '1px solid var(--accent-border)',
              }}>
              <Mail className="w-3.5 h-3.5" /> m20.m.devlet@gmail.com
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
            <Link href="/terms" target="_blank"
              className="text-sm px-3 py-2 rounded-lg flex items-center gap-2"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--card-border)', background: 'var(--input-bg)' }}>
              <FileText className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              {lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Service'}
            </Link>
            <Link href="/privacy" target="_blank"
              className="text-sm px-3 py-2 rounded-lg flex items-center gap-2"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--card-border)', background: 'var(--input-bg)' }}>
              <ShieldCheck className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              {lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </Link>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-xl" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.25)' }}>
        <h2 className="font-bold text-base mb-4 flex items-center gap-2" style={{ color: 'var(--error)' }}>
          <Shield className="w-4 h-4" /> {t('settings.dangerZone')}
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">{t('settings.deleteAccount')}</p>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
              {t('settings.deleteDesc')}
            </p>
          </div>
          <button className="text-sm px-3 py-1.5 rounded transition-colors"
            style={{ color: 'var(--error)', border: '1px solid rgba(239,68,68,0.3)' }}>
            {t('settings.deleteAccount')}
          </button>
        </div>
      </div>

      <button onClick={save}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-[#0a0612] transition-all"
        style={{ background: 'var(--accent-gradient)', boxShadow: 'var(--accent-glow)' }}>
        {saved ? t('settings.saved') : <><Save className="w-4 h-4" /> {t('settings.save')}</>}
      </button>
    </div>
  );
}
