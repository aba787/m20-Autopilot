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
  { href: '/dashboard',    label: 'لوحة التحكم',          icon: LayoutDashboard },
  { href: '/campaigns',    label: 'الحملات',               icon: Megaphone },
  { href: '/products',     label: 'المنتجات والكلمات',     icon: Package },
  { href: '/blacklist',    label: 'القائمة السوداء',        icon: ShieldOff },
  { href: '/ai-engine',    label: 'المحرك الذكي',           icon: Lightbulb },
  { href: '/accounting',   label: 'المحاسبة',              icon: Calculator },
  { href: '/alerts',       label: 'التنبيهات',              icon: Bell },
  { href: '/reports',      label: 'التقارير',              icon: FileText },
  { href: '/amazon-news',  label: 'أخبار أمازون',           icon: Newspaper },
  { href: '/integration',  label: 'ربط أمازون',            icon: Link2 },
  { href: '/subscriptions',label: 'الاشتراكات',            icon: CreditCard },
  { href: '/audit',        label: 'سجل التعديلات',         icon: History },
  { href: '/support',      label: 'المساعد الذكي',          icon: HeadphonesIcon },
  { href: '/help',         label: 'مركز المساعدة',          icon: HelpCircle },
  { href: '/settings',     label: 'الإعدادات',             icon: Settings },
];

const alertBadge: Record<string, number> = { '/alerts': 3, '/ai-engine': 6 };

// ── Sidebar styles ───────────────────────────────────────────
const SIDEBAR_BG    = '#0d1628';
const SIDEBAR_BORDER = 'rgba(0,217,255,0.12)';
const HEADER_BG     = '#080d1f';
const MAIN_BG       = '#0a0612';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [notifOpen, setNotifOpen]         = useState(false);
  const [profileOpen, setProfileOpen]     = useState(false);
  const [aiOpen, setAiOpen]               = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const router = useRouter();
  const { dark, toggle } = useTheme();

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = useCallback(() =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true }))), []);

  const markOneRead = useCallback((id: number) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)), []);

  return (
    <div className="flex h-screen overflow-hidden" dir="rtl">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className={`fixed lg:static inset-y-0 right-0 z-50 w-60 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} flex flex-col`}
        style={{ background: SIDEBAR_BG, borderLeft: `1px solid ${SIDEBAR_BORDER}` }}>

        {/* Logo */}
        <div className="p-4 flex-shrink-0" style={{ borderBottom: `1px solid ${SIDEBAR_BORDER}` }}>
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#00d9ff,#00f0ff)', boxShadow: '0 0 16px rgba(0,217,255,0.4)' }}>
              <Zap className="w-4 h-4 text-[#0a0612]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">M20 Autopilot</h1>
              <p className="text-[10px] leading-tight" style={{ color: '#4a5568' }}>لوحة تحكم البائع</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {menuItems.map(item => {
            const active = router.pathname === item.href;
            const Icon   = item.icon;
            const badge  = alertBadge[item.href];
            return (
              <Link key={item.href} href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-sm font-medium transition-all duration-200"
                style={active ? {
                  background: 'rgba(0,217,255,0.12)',
                  color: '#00d9ff',
                  border: '1px solid rgba(0,217,255,0.25)',
                  boxShadow: '0 0 12px rgba(0,217,255,0.1)',
                } : {
                  color: '#a0aec0',
                  border: '1px solid transparent',
                }}>
                <Icon className="w-4 h-4 flex-shrink-0" style={active ? { color: '#00d9ff' } : {}} />
                <span className="flex-1 truncate">{item.label}</span>
                {badge && (
                  <span className="text-[10px] w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 font-bold"
                    style={{ background: '#ef4444', color: '#fff' }}>{badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 flex-shrink-0" style={{ borderTop: `1px solid ${SIDEBAR_BORDER}` }}>
          <div className="flex items-center gap-2.5 p-2 rounded-lg" style={{ background: 'rgba(0,217,255,0.05)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(0,217,255,0.12)', border: '1px solid rgba(0,217,255,0.25)' }}>
              <User className="w-3.5 h-3.5" style={{ color: '#00d9ff' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">أحمد محمد</p>
              <p className="text-[10px] truncate" style={{ color: '#00d9ff' }}>احترافي</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="h-14 flex items-center justify-between px-4 sticky top-0 z-30 flex-shrink-0"
          style={{ background: HEADER_BG, borderBottom: `1px solid ${SIDEBAR_BORDER}` }}>

          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg transition-colors"
              style={{ color: '#a0aec0' }}>
              <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5 w-52"
              style={{ background: 'rgba(0,217,255,0.05)', border: '1px solid rgba(0,217,255,0.12)' }}>
              <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#4a5568' }} />
              <input type="text" placeholder="بحث..."
                className="bg-transparent border-none outline-none text-sm w-full placeholder-[#4a5568]"
                style={{ color: '#e2e8f0' }} />
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Theme toggle */}
            <button onClick={toggle}
              className="p-2 rounded-lg transition-all"
              style={{ color: '#a0aec0' }}
              title={dark ? 'الوضع الفاتح' : 'الوضع المظلم'}>
              {dark
                ? <Sun className="w-4 h-4 text-amber-400" />
                : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="p-2 rounded-lg relative transition-colors"
                style={{ color: '#a0aec0' }}>
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 left-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: '#ef4444' }}>{unreadCount}</span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute left-0 top-12 w-80 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto"
                  style={{ background: '#0d1628', border: '1px solid rgba(0,217,255,0.2)' }}>
                  <div className="p-3 flex items-center justify-between"
                    style={{ borderBottom: '1px solid rgba(0,217,255,0.12)' }}>
                    <h3 className="font-bold text-sm text-white">الإشعارات</h3>
                    <button onClick={markAllRead} className="text-xs" style={{ color: '#00d9ff' }}>
                      تحديد الكل كمقروء
                    </button>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} onClick={() => markOneRead(n.id)}
                      className="p-3 cursor-pointer transition-colors"
                      style={{
                        borderBottom: '1px solid rgba(0,217,255,0.07)',
                        background: !n.read ? 'rgba(0,217,255,0.04)' : 'transparent',
                      }}>
                      <div className="flex items-center gap-2">
                        {!n.read && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#00d9ff' }} />}
                        <p className="text-sm font-medium text-white">{n.title}</p>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: '#8a94a6' }}>{n.message}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: '#4a5568' }}>{n.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors">
                <div className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,217,255,0.12)', border: '1px solid rgba(0,217,255,0.3)' }}>
                  <User className="w-3.5 h-3.5" style={{ color: '#00d9ff' }} />
                </div>
                <span className="hidden sm:block text-sm font-medium" style={{ color: '#e2e8f0' }}>أحمد</span>
                <ChevronDown className="w-3.5 h-3.5 hidden sm:block" style={{ color: '#4a5568' }} />
              </button>

              {profileOpen && (
                <div className="absolute left-0 top-12 w-44 rounded-xl shadow-2xl z-50 overflow-hidden"
                  style={{ background: '#0d1628', border: '1px solid rgba(0,217,255,0.2)' }}>
                  <Link href="/settings"
                    className="flex items-center gap-2 p-3 text-sm transition-colors"
                    style={{ color: '#e2e8f0' }}
                    onClick={() => setProfileOpen(false)}>
                    <Settings className="w-4 h-4" style={{ color: '#00d9ff' }} /> الإعدادات
                  </Link>
                  <Link href="/login"
                    className="flex items-center gap-2 p-3 text-sm transition-colors"
                    style={{ color: '#ef4444' }}
                    onClick={() => setProfileOpen(false)}>
                    <LogOut className="w-4 h-4" /> تسجيل الخروج
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6" style={{ background: MAIN_BG }}>
          {children}
        </main>
      </div>

      {/* ── Floating AI Button ────────────────────────────────── */}
      <div className="fixed bottom-6 left-6 z-50">
        {aiOpen && (
          <div className="absolute bottom-14 left-0 w-72 rounded-xl shadow-2xl p-4 mb-2"
            style={{ background: '#0d1628', border: '1px solid rgba(0,217,255,0.25)', boxShadow: '0 0 30px rgba(0,217,255,0.15)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-5 h-5" style={{ color: '#00d9ff' }} />
              <h4 className="font-bold text-sm text-white">مساعد M20 الذكي</h4>
              <button onClick={() => setAiOpen(false)} className="mr-auto" style={{ color: '#4a5568' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs mb-3" style={{ color: '#8a94a6' }}>مرحباً! كيف يمكنني مساعدتك اليوم؟</p>
            <div className="space-y-1.5 mb-3">
              {['تحليل أفضل المنتجات', 'اقترح كلمات مفتاحية', 'ما ACOS المناسب؟'].map(q => (
                <button key={q}
                  className="w-full text-right text-xs px-3 py-2 rounded-lg transition-colors"
                  style={{ background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.15)', color: '#e2e8f0' }}>
                  {q}
                </button>
              ))}
            </div>
            <Link href="/support" onClick={() => setAiOpen(false)}
              className="block text-center text-xs transition-colors"
              style={{ color: '#00d9ff' }}>
              فتح المحادثة الكاملة →
            </Link>
          </div>
        )}

        <button onClick={() => setAiOpen(!aiOpen)}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
          style={{
            background: 'linear-gradient(135deg,#00d9ff,#00f0ff)',
            boxShadow: aiOpen ? '0 0 30px rgba(0,217,255,0.5)' : '0 0 18px rgba(0,217,255,0.35)',
          }}>
          {aiOpen ? <X className="w-5 h-5 text-[#0a0612]" /> : <Bot className="w-5 h-5 text-[#0a0612]" />}
        </button>
      </div>
    </div>
  );
}
