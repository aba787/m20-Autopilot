import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from './ThemeProvider';
import { notifications as initialNotifications } from '@/data/mock';
import {
  LayoutDashboard, Megaphone, Package, Lightbulb, Bell, FileText,
  Link2, CreditCard, History, HeadphonesIcon, HelpCircle,
  Settings, Moon, Sun, Menu, X, ChevronDown, User, LogOut, Search,
  Calculator, Newspaper, ShieldOff, Bot, Zap
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/campaigns', label: 'الحملات', icon: Megaphone },
  { href: '/products', label: 'المنتجات والكلمات', icon: Package },
  { href: '/blacklist', label: 'القائمة السوداء', icon: ShieldOff },
  { href: '/ai-engine', label: 'المحرك الذكي', icon: Lightbulb },
  { href: '/accounting', label: 'المحاسبة', icon: Calculator },
  { href: '/alerts', label: 'التنبيهات', icon: Bell },
  { href: '/reports', label: 'التقارير', icon: FileText },
  { href: '/amazon-news', label: 'أخبار أمازون', icon: Newspaper },
  { href: '/integration', label: 'ربط أمازون', icon: Link2 },
  { href: '/subscriptions', label: 'الاشتراكات', icon: CreditCard },
  { href: '/audit', label: 'سجل التعديلات', icon: History },
  { href: '/support', label: 'المساعد الذكي', icon: HeadphonesIcon },
  { href: '/help', label: 'مركز المساعدة', icon: HelpCircle },
  { href: '/settings', label: 'الإعدادات', icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const router = useRouter();
  const { dark, toggle } = useTheme();

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markOneRead = useCallback((id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const alertBadge: Record<string, number> = {
    '/alerts': 3,
    '/ai-engine': 6,
  };

  return (
    <div className="flex h-screen overflow-hidden" dir="rtl">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-60 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} flex flex-col`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-white dark:text-black" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">M20 Autopilot</h1>
              <p className="text-[10px] text-gray-500 leading-tight">لوحة تحكم البائع</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {menuItems.map(item => {
            const active = router.pathname === item.href;
            const Icon = item.icon;
            const badge = alertBadge[item.href];
            return (
              <Link key={item.href} href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {badge && (
                  <span className="bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">{badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
              <User className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">أحمد محمد</p>
              <p className="text-[10px] text-gray-500 truncate">احترافي</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5 w-56">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input type="text" placeholder="بحث..." className="bg-transparent border-none outline-none text-sm w-full" />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={toggle} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {dark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-gray-500" />}
            </button>

            <div className="relative">
              <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 relative">
                <Bell className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 left-1 w-3.5 h-3.5 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center">{unreadCount}</span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute left-0 top-11 w-80 card shadow-xl z-50 max-h-80 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <h3 className="font-bold text-sm">الإشعارات</h3>
                    <button onClick={markAllRead} className="text-xs text-brand-600 hover:underline">تحديد الكل كمقروء</button>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} onClick={() => markOneRead(n.id)}
                      className={`p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${!n.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`}>
                      <div className="flex items-center gap-2">
                        {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />}
                        <p className="text-sm font-medium">{n.title}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                </div>
                <span className="hidden sm:block text-sm font-medium">أحمد</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
              </button>
              {profileOpen && (
                <div className="absolute left-0 top-11 w-44 card shadow-xl z-50">
                  <Link href="/settings" className="flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm" onClick={() => setProfileOpen(false)}>
                    <Settings className="w-4 h-4" /> الإعدادات
                  </Link>
                  <Link href="/login" className="flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-red-600" onClick={() => setProfileOpen(false)}>
                    <LogOut className="w-4 h-4" /> تسجيل الخروج
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50 dark:bg-gray-950">
          {children}
        </main>
      </div>

      {/* Floating AI Assistant Button */}
      <div className="fixed bottom-6 left-6 z-50">
        {aiOpen && (
          <div className="absolute bottom-14 left-0 w-72 card shadow-2xl p-4 mb-2" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-5 h-5 text-green-600" />
              <h4 className="font-bold text-sm">مساعد M20 الذكي</h4>
              <button onClick={() => setAiOpen(false)} className="mr-auto"><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">مرحباً! كيف يمكنني مساعدتك اليوم؟</p>
            <div className="space-y-1.5 mb-3">
              {['تحليل أفضل المنتجات', 'اقترح كلمات مفتاحية', 'ما ACOS المناسب؟'].map(q => (
                <button key={q} className="w-full text-right text-xs px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">{q}</button>
              ))}
            </div>
            <Link href="/support" onClick={() => setAiOpen(false)} className="block text-center text-xs text-brand-600 hover:underline">فتح المحادثة الكاملة →</Link>
          </div>
        )}
        <button onClick={() => setAiOpen(!aiOpen)}
          className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg flex items-center justify-center transition-all">
          {aiOpen ? <X className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
