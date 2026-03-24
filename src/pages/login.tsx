import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '@/components/ThemeProvider';
import { Zap, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { dark, toggle } = useTheme();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push('/dashboard'), 900);
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 bg-black items-center justify-center p-12">
        <div className="max-w-xs text-white">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-6">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">M20 Autopilot</h2>
          <p className="text-gray-400 text-sm leading-relaxed">منصة ذكية لتحسين إعلانات أمازون وزيادة المبيعات مع خفض ACOS.</p>
          <div className="mt-8 space-y-3">
            {['تحليل يومي بالذكاء الاصطناعي', 'توصيات كلمات مفتاحية', 'نظام محاسبة متكامل', 'قائمة سوداء ذكية'].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
        <button onClick={toggle} className="absolute top-4 left-4 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
          {dark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-gray-500" />}
        </button>

        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">M20 Autopilot</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">تسجيل الدخول</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-7">أدخل بياناتك للوصول إلى حسابك</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="ahmed@example.com" className="input-field" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">كلمة المرور</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="input-field" dir="ltr" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="rounded" /> تذكرني
              </label>
              <button type="button" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">نسيت كلمة المرور؟</button>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-lg font-medium hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />جارٍ الدخول...</> : 'تسجيل الدخول'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            ليس لديك حساب؟{' '}
            <Link href="/" className="text-gray-900 dark:text-white font-medium hover:underline">إنشاء حساب</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
