import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '@/components/ThemeProvider';
import { Megaphone, Eye, EyeOff, Moon, Sun } from 'lucide-react';

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
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-gray-950 dark:via-gray-900 dark:to-brand-950 p-4" dir="rtl">
      <button onClick={toggle} className="absolute top-4 left-4 p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm">
        {dark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-gray-500" />}
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/25">
            <Megaphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-brand-700 dark:text-brand-400">أدفلو</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">AdFlow Arabia</p>
          <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm">منصة تحسين إعلانات أمازون الذكية</p>
        </div>

        <div className="card p-8">
          <h2 className="text-xl font-bold mb-6">تسجيل الدخول</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ahmed@example.com"
                className="input-field"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                  dir="ltr"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-brand-600" />
                <span className="text-gray-600 dark:text-gray-400">تذكرني</span>
              </label>
              <button type="button" className="text-brand-600 hover:underline">نسيت كلمة المرور؟</button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3 text-base disabled:opacity-70 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جارٍ تسجيل الدخول...
                </>
              ) : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ليس لديك حساب؟{' '}
              <button className="text-brand-600 hover:underline font-medium">إنشاء حساب جديد</button>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">© 2026 أدفلو - AdFlow Arabia. جميع الحقوق محفوظة</p>
      </div>
    </div>
  );
}
