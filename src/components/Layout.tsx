import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from './ThemeProvider';
import { notifications as initialNotifications } from '@/data/mock';
import {
  LayoutDashboard, Megaphone, Key, Lightbulb, Bell, FileText,
  Store, Link2, CreditCard, History, HeadphonesIcon, HelpCircle,
  Settings, Moon, Sun, Menu, X, ChevronDown, User, LogOut, Search
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/campaigns', label: 'الحملات', icon: Megaphone },
  { href: '/keywords', label: 'الكلمات المفتاحية', icon: Key },
  { href: '/recommendations', label: 'التوصيات الذكية', icon: Lightbulb },
  { href: '/alerts', label: 'التنبيهات', icon: Bell },
  { href: '/reports', label: 'التقارير', icon: FileText },
  { href: '/stores', label: 'المتاجر', icon: Store },
  { href: '/integration', label: 'ربط أمازون', icon: Link2 },
  { href: '/subscriptions', label: 'الاشتراكات', icon: CreditCard },
  { href: '/audit', label: 'سجل التعديلات', icon: History },
  { href: '/support', label: 'خدمة العملاء الذكية', icon: HeadphonesIcon },
  { href: '/help', label: 'مركز المساعدة', icon: HelpCircle },
  { href: '/settings', label: 'الإعدادات', icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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

  return (
    <div className="flex h-screen overflow-hidden" dir="rtl">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} flex flex-col`}>
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-brand-700 dark:text-brand-400">أدفلو</h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 -mt-0.5">AdFlow Arabia</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {menuItems.map(item => {
            const active = router.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}>
                <Icon className="w-[18px] h-[18px]" />
                <span>{item.label}</span>
                {item.href === '/alerts' && (
                  <span className="mr-auto bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">3</span>
                )}
                {item.href === '/recommendations' && (
                  <span className="mr-auto bg-amber-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">6</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
              <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">أحمد محمد</p>
              <p className="text-[10px] text-gray-500 truncate">خطة الاحترافي</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 w-64">
              <Search className="w-4 h-4 text-gray-400" />
              <input type="text" placeholder="بحث..." className="bg-transparent border-none outline-none text-sm w-full" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {dark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-gray-500" />}
            </button>

            <div className="relative">
              <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
                <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 left-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{unreadCount}</span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute left-0 top-12 w-80 card shadow-xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <h3 className="font-bold text-sm">الإشعارات</h3>
                    <button onClick={markAllRead} className="text-xs text-brand-600 hover:underline">تحديد الكل كمقروء</button>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} onClick={() => markOneRead(n.id)} className={`p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${!n.read ? 'bg-brand-50/50 dark:bg-brand-950/30' : ''}`}>
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                  <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                </div>
                <span className="hidden sm:block text-sm font-medium">أحمد</span>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
              </button>
              {profileOpen && (
                <div className="absolute left-0 top-12 w-48 card shadow-xl z-50">
                  <Link href="/settings" className="flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">
                    <Settings className="w-4 h-4" /> الإعدادات
                  </Link>
                  <Link href="/" className="flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-red-600">
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
    </div>
  );
}
