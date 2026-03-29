import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '@/components/ThemeProvider';
import { Zap, Eye, EyeOff, Moon, Sun, Bot, TrendingUp, Shield, BarChart3 } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
  { icon: BarChart3,  text: 'Daily AI-powered analysis'        },
  { icon: TrendingUp, text: 'Keyword recommendations'           },
  { icon: Bot,        text: 'Integrated accounting system'      },
  { icon: Shield,     text: 'Smart product blacklisting'        },
];

const CYAN = '#00d9ff';

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const router = useRouter();
  const { dark, toggle } = useTheme();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push('/dashboard'), 900);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(0,217,255,0.06)',
    border: '1px solid rgba(0,217,255,0.15)',
    borderRadius: '0.5rem',
    color: '#e2e8f0',
    padding: '0.625rem 0.75rem',
    outline: 'none',
    fontSize: '0.875rem',
  };

  return (
    <div className="min-h-screen flex" dir="ltr">

      {/* ── Left Panel (brand) ─────────────────────────────── */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-14 relative overflow-hidden"
        style={{ background: '#080d1f', borderRight: '1px solid rgba(0,217,255,0.12)' }}>

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,217,255,0.06) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-sm w-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#00d9ff,#00f0ff)', boxShadow: '0 0 24px rgba(0,217,255,0.4)' }}>
              <Zap className="w-5 h-5 text-[#0a0612]" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-tight">M20 Autopilot</h1>
              <p className="text-xs" style={{ color: CYAN }}>Amazon Ad Automation</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 leading-snug">
            Transform Your Ads<br />with AI
          </h2>
          <p className="text-sm mb-10" style={{ color: '#8a94a6' }}>
            An intelligent platform to optimize Amazon advertising and grow sales while reducing ACOS.
          </p>

          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(0,217,255,0.04)', border: '1px solid rgba(0,217,255,0.1)' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(0,217,255,0.1)' }}>
                  <f.icon className="w-3.5 h-3.5" style={{ color: CYAN }} />
                </div>
                <span className="text-sm" style={{ color: '#e2e8f0' }}>{f.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex gap-6">
            {[
              { v: '500+', l: 'Sellers'  },
              { v: '-32%', l: 'ACOS'     },
              { v: '5.2x', l: 'ROAS'     },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-xl font-bold" style={{ color: CYAN }}>{s.v}</p>
                <p className="text-xs" style={{ color: '#4a5568' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel (form) ─────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 relative"
        style={{ background: '#0a0612' }}>

        <button onClick={toggle}
          className="absolute top-4 right-4 p-2 rounded-lg"
          style={{ color: '#a0aec0', background: 'rgba(0,217,255,0.05)', border: '1px solid rgba(0,217,255,0.12)' }}>
          {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#00d9ff,#00f0ff)' }}>
              <Zap className="w-4 h-4 text-[#0a0612]" />
            </div>
            <span className="font-bold text-white">M20 Autopilot</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Sign In</h1>
          <p className="text-sm mb-8" style={{ color: '#8a94a6' }}>Enter your credentials to access your account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#e2e8f0' }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" style={inputStyle} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#e2e8f0' }}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" style={{ ...inputStyle, paddingRight: '2.5rem' }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#4a5568' }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer" style={{ color: '#a0aec0' }}>
                <input type="checkbox" className="rounded accent-[#00d9ff]" />
                Remember me
              </label>
              <button type="button" className="text-sm transition-colors" style={{ color: CYAN }}>
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-[#0a0612] flex items-center justify-center gap-2 transition-all"
              style={{
                background: 'linear-gradient(135deg,#00d9ff,#00f0ff)',
                boxShadow: '0 0 20px rgba(0,217,255,0.3)',
                opacity: loading ? 0.7 : 1,
              }}>
              {loading
                ? <><span className="w-4 h-4 border-2 border-[#0a0612]/30 border-t-[#0a0612] rounded-full animate-spin" /> Signing in...</>
                : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#8a94a6' }}>
            Don't have an account?{' '}
            <Link href="/" className="font-semibold transition-colors" style={{ color: CYAN }}>
              Start free trial
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
