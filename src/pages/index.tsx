import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { Zap, Moon, Sun, TrendingUp, Shield, BarChart3, Bot, CheckCircle2, ArrowLeft, Star } from 'lucide-react';

const features = [
  { icon: BarChart3, title: 'لوحة تحكم شاملة',    desc: 'KPIs واضحة وخرائط أداء مفصلة على طراز Amazon Ads' },
  { icon: Bot,       title: 'ذكاء اصطناعي يومي',   desc: 'تحليل تلقائي للمنتجات والكلمات المفتاحية وتوصيات قابلة للتطبيق' },
  { icon: TrendingUp,title: 'تحسين الإعلانات',    desc: 'خفض ACOS وزيادة ROAS عبر تحسين ذكي للحملات' },
  { icon: Shield,    title: 'قائمة سوداء ذكية',  desc: 'حجب المنتجات الضعيفة تلقائياً لحماية ميزانيتك' },
];

const plans = [
  { name: 'الأساسي',    price: 199, features: ['متجر واحد', '10 حملات', 'تقارير أساسية'] },
  { name: 'الاحترافي', price: 499, features: ['3 متاجر', 'حملات غير محدودة', 'ذكاء اصطناعي', 'محاسبة متقدمة'], popular: true },
  { name: 'المؤسسات',  price: 999, features: ['غير محدود', 'API كامل', 'مدير مخصص'] },
];

const BG    = '#0a0612';
const BG2   = '#0d1628';
const BG3   = '#080d1f';
const CYAN  = '#00d9ff';

export default function Landing() {
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen" dir="rtl" style={{ background: BG, color: '#fff' }}>

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
          <Link href="/login" className="text-sm" style={{ color: '#a0aec0' }}>تسجيل الدخول</Link>
          <Link href="/login"
            className="text-sm font-semibold px-4 py-2 rounded-lg text-[#0a0612]"
            style={{ background: 'linear-gradient(135deg,#00d9ff,#00f0ff)', boxShadow: '0 0 14px rgba(0,217,255,0.3)' }}>
            ابدأ مجاناً
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        {/* Status pill */}
        <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full mb-8"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
          يعمل الآن مع Amazon.sa و Amazon.ae
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          حسّن إعلانات أمازون<br />
          <span style={{ color: CYAN }}>بالذكاء الاصطناعي</span>
        </h1>

        <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: '#8a94a6' }}>
          منصة متكاملة للبائعين العرب على أمازون — تحليل الحملات، تحسين ACOS، واقتراح الكلمات المفتاحية تلقائياً.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/login"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[#0a0612]"
            style={{ background: 'linear-gradient(135deg,#00d9ff,#00f0ff)', boxShadow: '0 0 24px rgba(0,217,255,0.35)' }}>
            ابدأ مجاناً <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link href="/dashboard"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold"
            style={{ border: '1px solid rgba(0,217,255,0.25)', color: '#e2e8f0', background: 'rgba(0,217,255,0.05)' }}>
            عرض تجريبي
          </Link>
        </div>

        <p className="text-xs mt-5" style={{ color: '#4a5568' }}>
          لا يلزم بطاقة ائتمانية • تجربة مجانية 14 يوم
        </p>
      </section>

      {/* ── Stats ──────────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid rgba(0,217,255,0.1)', borderBottom: '1px solid rgba(0,217,255,0.1)', background: BG2 }}>
        <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-3 gap-8 text-center">
          {[
            { value: '+500', label: 'بائع نشط' },
            { value: '-32%', label: 'متوسط انخفاض ACOS' },
            { value: '5.2x', label: 'متوسط ROAS للعملاء' },
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
        <h2 className="text-2xl font-bold text-center mb-12 text-white">كل ما تحتاجه في مكان واحد</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <div key={i}
              className="p-6 rounded-xl transition-all duration-200"
              style={{
                background: 'rgba(0,217,255,0.04)',
                border: '1px solid rgba(0,217,255,0.12)',
              }}
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

      {/* ── Pricing ─────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: BG3 }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-12 text-white">الأسعار</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {plans.map((p, i) => (
              <div key={i} className="rounded-xl p-6 flex flex-col"
                style={p.popular ? {
                  background: 'rgba(0,217,255,0.08)',
                  border: '1px solid rgba(0,217,255,0.35)',
                  boxShadow: '0 0 30px rgba(0,217,255,0.12)',
                } : {
                  background: 'rgba(0,217,255,0.03)',
                  border: '1px solid rgba(0,217,255,0.12)',
                }}>
                {p.popular && (
                  <div className="flex items-center gap-1.5 text-xs font-bold mb-3" style={{ color: CYAN }}>
                    <Star className="w-3.5 h-3.5" /> الأكثر شعبية
                  </div>
                )}
                <h3 className="font-bold text-white mb-2">{p.name}</h3>
                <div className="mb-5">
                  <span className="text-3xl font-bold" style={{ color: p.popular ? CYAN : '#fff' }}>{p.price}</span>
                  <span className="text-sm mr-1" style={{ color: '#8a94a6' }}> ر.س/شهر</span>
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm" style={{ color: '#e2e8f0' }}>
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#10b981' }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login"
                  className="block text-center text-sm py-2.5 rounded-lg font-semibold"
                  style={p.popular ? {
                    background: 'linear-gradient(135deg,#00d9ff,#00f0ff)',
                    color: '#0a0612',
                    boxShadow: '0 0 16px rgba(0,217,255,0.3)',
                  } : {
                    border: '1px solid rgba(0,217,255,0.25)',
                    color: CYAN,
                    background: 'rgba(0,217,255,0.05)',
                  }}>
                  ابدأ الآن
                </Link>
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
        <p className="text-sm" style={{ color: '#4a5568' }}>© 2026 M20 Autopilot • جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
