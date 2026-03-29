import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { Zap, Moon, Sun, TrendingUp, Shield, BarChart3, Bot, CheckCircle2, ArrowRight } from 'lucide-react';

const features = [
  { icon: BarChart3,  title: 'Comprehensive Dashboard',   desc: 'Clear KPIs and detailed performance charts modeled after Amazon Ads' },
  { icon: Bot,        title: 'Daily AI Analysis',          desc: 'Automatic product and keyword analysis with actionable recommendations' },
  { icon: TrendingUp, title: 'Ad Optimization',            desc: 'Lower ACOS and increase ROAS through intelligent campaign tuning' },
  { icon: Shield,     title: 'Smart Blacklist',            desc: 'Automatically block underperforming products to protect your budget' },
];

const BG   = '#0a0612';
const BG2  = '#0d1628';
const BG3  = '#080d1f';
const CYAN = '#00d9ff';

export default function Landing() {
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen" dir="ltr" style={{ background: BG, color: '#fff' }}>

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(8,13,31,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,217,255,0.1)' }}>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#00d9ff,#00f0ff)', boxShadow: '0 0 16px rgba(0,217,255,0.4)' }}>
            <Zap className="w-4 h-4 text-[#0a0612]" />
          </div>
          <span className="font-bold text-white">M20 Autopilot</span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggle} className="p-2 rounded-lg" style={{ color: '#a0aec0' }}>
            {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link href="/login" className="text-sm" style={{ color: '#a0aec0' }}>Sign In</Link>
          <Link href="/login"
            className="text-sm font-semibold px-4 py-2 rounded-lg text-[#0a0612]"
            style={{ background: 'linear-gradient(135deg,#00d9ff,#00f0ff)', boxShadow: '0 0 14px rgba(0,217,255,0.3)' }}>
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full mb-8"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
          Now live with Amazon.com, Amazon.co.uk & Amazon.ca
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Supercharge Your Amazon Ads<br />
          <span style={{ color: CYAN }}>with AI Autopilot</span>
        </h1>

        <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: '#8a94a6' }}>
          An all-in-one platform for Amazon sellers — analyze campaigns, optimize ACOS, and get keyword recommendations automatically.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/login"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[#0a0612]"
            style={{ background: 'linear-gradient(135deg,#00d9ff,#00f0ff)', boxShadow: '0 0 24px rgba(0,217,255,0.35)' }}>
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/dashboard"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold"
            style={{ border: '1px solid rgba(0,217,255,0.25)', color: '#e2e8f0', background: 'rgba(0,217,255,0.05)' }}>
            View Demo
          </Link>
        </div>

        <p className="text-xs mt-5" style={{ color: '#4a5568' }}>
          No credit card required • 14-day free trial
        </p>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid rgba(0,217,255,0.1)', borderBottom: '1px solid rgba(0,217,255,0.1)', background: BG2 }}>
        <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-3 gap-8 text-center">
          {[
            { value: '500+',  label: 'Active Sellers'    },
            { value: '-32%',  label: 'Avg ACOS Reduction'},
            { value: '5.2x',  label: 'Avg Customer ROAS' },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-bold" style={{ color: CYAN }}>{s.value}</p>
              <p className="text-sm mt-1" style={{ color: '#8a94a6' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-center mb-12 text-white">Everything You Need in One Place</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <div key={i}
              className="p-6 rounded-xl transition-all duration-200"
              style={{ background: 'rgba(0,217,255,0.04)', border: '1px solid rgba(0,217,255,0.12)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,217,255,0.3)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 20px rgba(0,217,255,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,217,255,0.12)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: 'rgba(0,217,255,0.1)', border: '1px solid rgba(0,217,255,0.2)' }}>
                <f.icon className="w-5 h-5" style={{ color: CYAN }} />
              </div>
              <h3 className="font-bold mb-2 text-white">{f.title}</h3>
              <p className="text-sm" style={{ color: '#8a94a6' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: BG3 }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Ready to Grow Your Sales?</h2>
          <p className="text-sm mb-8" style={{ color: '#8a94a6' }}>Join hundreds of sellers using M20 Autopilot to dominate Amazon advertising.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/login"
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-[#0a0612]"
              style={{ background: 'linear-gradient(135deg,#00d9ff,#00f0ff)', boxShadow: '0 0 20px rgba(0,217,255,0.3)' }}>
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard"
              className="px-7 py-3 rounded-xl font-semibold"
              style={{ border: '1px solid rgba(0,217,255,0.25)', color: CYAN }}>
              View Demo
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8">
            {['No credit card required', '14-day free trial', 'Cancel anytime'].map(t => (
              <div key={t} className="flex items-center gap-1.5 text-xs" style={{ color: '#4a5568' }}>
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#10b981' }} /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="py-8 text-center" style={{ borderTop: '1px solid rgba(0,217,255,0.1)' }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#00d9ff,#00f0ff)' }}>
            <Zap className="w-3.5 h-3.5 text-[#0a0612]" />
          </div>
          <span className="font-bold text-sm text-white">M20 Autopilot</span>
        </div>
        <p className="text-sm" style={{ color: '#4a5568' }}>© 2026 M20 Autopilot. All rights reserved.</p>
      </footer>
    </div>
  );
}
