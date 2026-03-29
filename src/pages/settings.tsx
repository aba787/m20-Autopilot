import { useState } from 'react';
import { Settings as SettingsIcon, Save, Link2, Globe, Bell, Shield } from 'lucide-react';

const CARD = { background: 'rgba(0,217,255,0.04)', border: '1px solid rgba(0,217,255,0.12)', borderRadius: '0.875rem' } as const;

const inputStyle: React.CSSProperties = {
  background: 'rgba(0,217,255,0.06)',
  border: '1px solid rgba(0,217,255,0.15)',
  borderRadius: '0.5rem',
  color: '#e2e8f0',
  padding: '0.375rem 0.75rem',
  outline: 'none',
  width: '100%',
  fontSize: '0.875rem',
};

export default function Settings() {
  const [amazonLink,   setAmazonLink]   = useState('https://www.amazon.com/s?me=XXXXXXXX');
  const [currency,     setCurrency]     = useState('USD');
  const [timezone,     setTimezone]     = useState('America/New_York');
  const [targetAcos,   setTargetAcos]   = useState('25');
  const [emailAlerts,  setEmailAlerts]  = useState(true);
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [saved,        setSaved]        = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <div onClick={onChange}
      className="w-11 h-6 rounded-full cursor-pointer transition-colors flex-shrink-0"
      style={{ background: value ? '#00d9ff' : 'rgba(255,255,255,0.1)', boxShadow: value ? '0 0 8px rgba(0,217,255,0.4)' : 'none' }}>
      <div className={`w-4 h-4 bg-white rounded-full m-1 transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  );

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5" style={{ color: '#00d9ff' }} /> Settings
        </h1>
        <p className="text-sm" style={{ color: '#8a94a6' }}>Account settings and preferences</p>
      </div>

      {/* Amazon Link */}
      <div className="p-5" style={CARD}>
        <h2 className="font-bold text-sm mb-4 text-white flex items-center gap-2">
          <Link2 className="w-4 h-4" style={{ color: '#00d9ff' }} /> Amazon Store Link
        </h2>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#a0aec0' }}>Store URL on Amazon</label>
          <input type="url" value={amazonLink} onChange={e => setAmazonLink(e.target.value)}
            style={{ ...inputStyle, fontFamily: 'monospace' }}
            dir="ltr" placeholder="https://www.amazon.com/..." />
          <p className="text-xs mt-1" style={{ color: '#4a5568' }}>The platform will use this link to analyze and suggest improvements.</p>
        </div>
      </div>

      {/* Currency & Region */}
      <div className="p-5" style={CARD}>
        <h2 className="font-bold text-sm mb-4 text-white flex items-center gap-2">
          <Globe className="w-4 h-4" style={{ color: '#10b981' }} /> Currency & Region
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#a0aec0' }}>Currency</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="USD">US Dollar (USD)</option>
              <option value="GBP">British Pound (GBP)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="CAD">Canadian Dollar (CAD)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#a0aec0' }}>Timezone</label>
            <select value={timezone} onChange={e => setTimezone(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="America/New_York">New York (ET)</option>
              <option value="America/Los_Angeles">Los Angeles (PT)</option>
              <option value="America/Chicago">Chicago (CT)</option>
              <option value="Europe/London">London (GMT)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Performance Goals */}
      <div className="p-5" style={CARD}>
        <h2 className="font-bold text-sm mb-4 text-white flex items-center gap-2">
          <SettingsIcon className="w-4 h-4 text-amber-400" /> Performance Goals
        </h2>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#a0aec0' }}>Target ACOS (%)</label>
          <div className="flex items-center gap-3">
            <input type="number" value={targetAcos} onChange={e => setTargetAcos(e.target.value)}
              style={{ ...inputStyle, width: '7rem' }}
              min="5" max="100" dir="ltr" />
            <p className="text-xs" style={{ color: '#4a5568' }}>The system will alert you when this target is exceeded.</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="p-5" style={CARD}>
        <h2 className="font-bold text-sm mb-4 text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" /> Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Email Alerts</p>
              <p className="text-xs" style={{ color: '#4a5568' }}>Get instant alerts when performance declines</p>
            </div>
            <Toggle value={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
          </div>
          <div className="flex items-center justify-between" style={{ paddingTop: '1rem', borderTop: '1px solid rgba(0,217,255,0.08)' }}>
            <div>
              <p className="text-sm font-medium text-white">Auto-Optimize</p>
              <p className="text-xs" style={{ color: '#4a5568' }}>Allow AI to apply recommendations automatically</p>
            </div>
            <Toggle value={autoOptimize} onChange={() => setAutoOptimize(!autoOptimize)} />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-5 rounded-xl" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.25)' }}>
        <h2 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: '#ef4444' }}>
          <Shield className="w-4 h-4" /> Danger Zone
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Delete All Data</p>
            <p className="text-xs" style={{ color: '#4a5568' }}>Permanently delete all account data — cannot be undone</p>
          </div>
          <button className="text-sm px-3 py-1.5 rounded transition-colors"
            style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
            Delete Account
          </button>
        </div>
      </div>

      <button onClick={save}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-[#0a0612] transition-all"
        style={{ background: 'linear-gradient(135deg,#00d9ff,#00f0ff)', boxShadow: '0 0 16px rgba(0,217,255,0.3)' }}>
        {saved ? '✓ Saved!' : <><Save className="w-4 h-4" /> Save Settings</>}
      </button>
    </div>
  );
}
