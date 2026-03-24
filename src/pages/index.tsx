import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { Zap, Moon, Sun, TrendingUp, Shield, BarChart3, Bot, CheckCircle2, ArrowLeft } from 'lucide-react';

const features = [
  { icon: BarChart3, title: 'لوحة تحكم شاملة', desc: 'KPIs واضحة وخرائط أداء مفصلة على طراز Amazon Ads' },
  { icon: Bot, title: 'ذكاء اصطناعي يومي', desc: 'تحليل تلقائي للمنتجات والكلمات المفتاحية وتوصيات قابلة للتطبيق' },
  { icon: TrendingUp, title: 'تحسين الإعلانات', desc: 'خفض ACOS وزيادة ROAS عبر تحسين ذكي للحملات' },
  { icon: Shield, title: 'قائمة سوداء ذكية', desc: 'حجب المنتجات الضعيفة تلقائياً لحماية ميزانيتك' },
];

const plans = [
  { name: 'الأساسي', price: 199, features: ['متجر واحد', '10 حملات', 'تقارير أساسية'] },
  { name: 'الاحترافي', price: 499, features: ['3 متاجر', 'حملات غير محدودة', 'ذكاء اصطناعي', 'محاسبة متقدمة'], popular: true },
  { name: 'المؤسسات', price: 999, features: ['غير محدود', 'API كامل', 'مدير مخصص'] },
];

export default function Landing() {
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950" dir="rtl">
      {/* Nav */}
      <nav className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-gray-950/90 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-black dark:bg-white rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white dark:text-black" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white">M20 Autopilot</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
            {dark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-gray-500" />}
          </button>
          <Link href="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">تسجيل الدخول</Link>
          <Link href="/login" className="text-sm bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg font-medium hover:opacity-90">ابدأ مجاناً</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 text-xs px-3 py-1.5 rounded-full mb-6 border border-green-200 dark:border-green-800">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          يعمل الآن مع Amazon.sa و Amazon.ae
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-5 leading-tight">
          حسّن إعلانات أمازون<br />بالذكاء الاصطناعي
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          منصة متكاملة للبائعين العرب على أمازون — تحليل الحملات، تحسين ACOS، واقتراح الكلمات المفتاحية تلقائياً.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/login" className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium hover:opacity-90 flex items-center gap-2">
            ابدأ مجاناً <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link href="/dashboard" className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
            عرض تجريبي
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">لا يلزم بطاقة ائتمانية • تجربة مجانية 14 يوم</p>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-200 dark:border-gray-800 py-10">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">+500</p>
            <p className="text-sm text-gray-500 mt-1">بائع نشط</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">-32%</p>
            <p className="text-sm text-gray-500 mt-1">متوسط انخفاض ACOS</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">5.2x</p>
            <p className="text-sm text-gray-500 mt-1">متوسط ROAS للعملاء</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-900 dark:text-white">كل ما تحتاجه في مكان واحد</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
              <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-3">
                <f.icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
              <h3 className="font-bold mb-1.5 text-gray-900 dark:text-white">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10 text-gray-900 dark:text-white">الأسعار</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {plans.map((p, i) => (
              <div key={i} className={`rounded-xl p-5 ${p.popular ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}>
                {p.popular && <div className="text-xs font-medium mb-2 text-green-400 dark:text-green-600">الأكثر شعبية</div>}
                <h3 className="font-bold mb-1">{p.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{p.price}</span>
                  <span className={`text-sm ${p.popular ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500'}`}> ر.س/شهر</span>
                </div>
                <ul className="space-y-2 mb-5">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className={`w-4 h-4 ${p.popular ? 'text-green-400 dark:text-green-600' : 'text-green-500'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className={`block text-center text-sm py-2.5 rounded-lg font-medium ${p.popular ? 'bg-white dark:bg-black text-black dark:text-white' : 'bg-black dark:bg-white text-white dark:text-black'}`}>
                  ابدأ الآن
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center">
        <p className="text-sm text-gray-400">© 2026 M20 Autopilot • جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
