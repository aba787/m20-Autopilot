import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { Zap, Moon, Sun, TrendingUp, Shield, BarChart3, Bot, CheckCircle2, ArrowRight } from 'lucide-react';

const features = [
  { icon: BarChart3,  title: 'Comprehensive Dashboard',   desc: 'Clear KPIs and detailed performance charts modeled after Amazon Ads' },
  { icon: Bot,        title: 'Daily AI Analysis',          desc: 'Automatic product and keyword analysis with actionable recommendations' },
  { icon: TrendingUp, title: 'Ad Optimization',            desc: 'Lower ACOS and increase ROAS through intelligent campaign tuning' },
  { icon: Shield,     title: 'Smart Blacklist',            desc: 'Automatically block underperforming products to protect your budget' },
];

export default function Landing() {
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen" dir="ltr" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-primary)' }}>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', boxShadow: 'var(--accent-glow)' }}>
            <Zap className="w-4 h-4" style={{ color: 'var(--btn-text)' }} />
          </div>
          <span className="font-bold" style={{ color: 'var(--text-primary)' }}>M20 Autopilot</span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggle} className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}>
            {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link href="/login" className="text-sm" style={{ color: 'var(--text-muted)' }}>Sign In</Link>
          <Link href="/login"
            className="text-sm font-semibold px-4 py-2 rounded-lg"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', color: 'var(--btn-text)', boxShadow: 'var(--accent-glow)' }}>
            Get Started Free
          </Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full mb-8"
          style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', color: 'var(--success)' }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--success)' }} />
          Now live with Amazon.com, Amazon.co.uk & Amazon.ca
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Supercharge Your Amazon Ads<br />
          <span style={{ color: 'var(--accent)' }}>with AI Autopilot</span>
        </h1>

        <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          An all-in-one platform for Amazon sellers — analyze campaigns, optimize ACOS, and get keyword recommendations automatically.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/login"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', color: 'var(--btn-text)', boxShadow: 'var(--accent-glow)' }}>
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/dashboard"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold"
            style={{ border: '1px solid var(--accent-border)', color: 'var(--text-secondary)', background: 'var(--card-bg)' }}>
            View Demo
          </Link>
        </div>

        <p className="text-xs mt-5" style={{ color: 'var(--text-dim)' }}>
          No credit card required • 14-day free trial
        </p>
      </section>

      <section style={{ borderTop: '1px solid var(--border-primary)', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-3 gap-8 text-center">
          {[
            { value: '500+',  label: 'Active Sellers'    },
            { value: '-32%',  label: 'Avg ACOS Reduction'},
            { value: '5.2x',  label: 'Avg Customer ROAS' },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>{s.value}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-center mb-12" style={{ color: 'var(--text-primary)' }}>Everything You Need in One Place</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <div key={i}
              className="p-6 rounded-xl transition-all duration-200"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent-border)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 20px var(--accent-bg)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--card-border)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--card-shadow)'; }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: 'var(--accent-bg-strong)', border: '1px solid var(--accent-border)' }}>
                <f.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              </div>
              <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20" style={{ background: 'var(--bg-tertiary)' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Ready to Grow Your Sales?</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>Join hundreds of sellers using M20 Autopilot to dominate Amazon advertising.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/login"
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', color: 'var(--btn-text)', boxShadow: 'var(--accent-glow)' }}>
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard"
              className="px-7 py-3 rounded-xl font-semibold"
              style={{ border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>
              View Demo
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8">
            {['No credit card required', '14-day free trial', 'Cancel anytime'].map(t => (
              <div key={t} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-dim)' }}>
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--success)' }} /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 text-center" style={{ borderTop: '1px solid var(--border-primary)' }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))' }}>
            <Zap className="w-3.5 h-3.5" style={{ color: 'var(--btn-text)' }} />
          </div>
          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>M20 Autopilot</span>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>© 2026 M20 Autopilot. All rights reserved.</p>
      </footer>
    </div>
  );
}
