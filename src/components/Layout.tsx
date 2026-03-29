import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from './ThemeProvider';
import {
  LayoutDashboard, Megaphone, Package, Lightbulb, Bell, FileText,
  Link2, History, HeadphonesIcon, HelpCircle,
  Settings, Moon, Sun, Menu, X, ChevronDown, User, LogOut, Search,
  Calculator, Newspaper, ShieldOff, Bot, Zap, Sparkles, CheckCircle
} from 'lucide-react';
import { useAuth, authFetch } from '@/lib/useAuth';

const menuItems = [
  { href: '/dashboard',     label: 'Dashboard',          icon: LayoutDashboard },
  { href: '/campaigns',     label: 'Campaigns',          icon: Megaphone       },
  { href: '/products',      label: 'Products & Keywords',icon: Package         },
  { href: '/blacklist',     label: 'Blacklist',          icon: ShieldOff       },
  { href: '/ai-engine',     label: 'AI Engine',          icon: Lightbulb       },
  { href: '/ads-generator', label: 'Ad Generator',       icon: Sparkles        },
  { href: '/accounting',    label: 'Accounting',         icon: Calculator      },
  { href: '/alerts',        label: 'Alerts',             icon: Bell            },
  { href: '/reports',       label: 'Reports',            icon: FileText        },
  { href: '/amazon-news',   label: 'Amazon News',        icon: Newspaper       },
  { href: '/integration',   label: 'Amazon Connect',     icon: Link2           },
  { href: '/audit',         label: 'Change Log',         icon: History         },
  { href: '/support',       label: 'AI Assistant',       icon: HeadphonesIcon  },
  { href: '/help',          label: 'Help Center',        icon: HelpCircle      },
  { href: '/settings',      label: 'Settings',           icon: Settings        },
];

const SIDEBAR_BG     = '#0d1628';
const SIDEBAR_BORDER = 'rgba(0,217,255,0.12)';
const HEADER_BG      = '#080d1f';
const MAIN_BG        = '#0a0612';
const CYAN           = '#00d9ff';

interface DBNotif { id: string; title: string; body: string; type: string; read: boolean; created_at: string; }

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [aiOpen,       setAiOpen]       = useState(false);
  const [notifications, setNotifications] = useState<DBNotif[]>([]);
  const [unread,       setUnread]       = useState(0);

  const router = useRouter();
  const { dark, toggle } = useTheme();
  const { user, token, logout } = useAuth();
  const af = authFetch(token);

  // Load real notifications
  useEffect(() => {
    if (!token) return;
    af('/api/notifications').then(r => r.json()).then(d => {
      if (d.notifications) { setNotifications(d.notifications); setUnread(d.unread ?? 0); }
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const markAllRead = useCallback(async () => {
    if (!token) return;
    await af('/api/notifications/all/read', { method: 'POST' });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnread(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const markOneRead = useCallback(async (id: string) => {
    if (!token) return;
    await af(`/api/notifications/${id}/read`, { method: 'POST' });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnread(prev => Math.max(0, prev - 1));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const displayName = user?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'User';
  const modeLabel   = user?.bot_mode ? `Bot: ${user.bot_mode}` : 'Guest';
  const modeColor   = user?.bot_mode === 'auto' ? '#10b981' : user?.bot_mode === 'semi' ? '#f59e0b' : CYAN;

  return (
    <div className="flex h-screen overflow-hidden" dir="ltr">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-60 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}
        style={{ background: SIDEBAR_BG, borderRight: `1px solid ${SIDEBAR_BORDER}` }}>

        {/* Logo */}
        <div className="p-4 flex-shrink-0" style={{ borderBottom: `1px solid ${SIDEBAR_BORDER}` }}>
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#00d9ff,#00f0ff)', boxShadow: '0 0 16px rgba(0,217,255,0.4)' }}>
              <Zap className="w-4 h-4 text-[#0a0612]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">M20 Autopilot</h1>
              <p className="text-[10px] leading-tight" style={{ color: '#4a5568' }}>Amazon Ad Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {menuItems.map(item => {
            const active = router.pathname === item.href;
            const Icon   = item.icon;
            return (
              <Link key={item.href} href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-sm font-medium transition-all duration-200"
                style={active ? {
                  background: 'rgba(0,217,255,0.12)', color: CYAN,
                  border: '1px solid rgba(0,217,255,0.25)', boxShadow: '0 0 12px rgba(0,217,255,0.1)',
                } : { color: '#a0aec0', border: '1px solid transparent' }}>
                <Icon className="w-4 h-4 flex-shrink-0" style={active ? { color: CYAN } : {}} />
                <span className="flex-1 truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User chip */}
        <div className="p-3 flex-shrink-0" style={{ borderTop: `1px solid ${SIDEBAR_BORDER}` }}>
          <div className="flex items-center gap-2.5 p-2 rounded-lg" style={{ background: 'rgba(0,217,255,0.05)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(0,217,255,0.12)', border: '1px solid rgba(0,217,255,0.25)' }}>
              <User className="w-3.5 h-3.5" style={{ color: CYAN }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{displayName}</p>
              <p className="text-[10px] truncate font-medium" style={{ color: modeColor }}>{modeLabel}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="h-14 flex items-center justify-between px-4 sticky top-0 z-30 flex-shrink-0"
          style={{ background: HEADER_BG, borderBottom: `1px solid ${SIDEBAR_BORDER}` }}>

          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg" style={{ color: '#a0aec0' }}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5 w-52"
              style={{ background: 'rgba(0,217,255,0.05)', border: '1px solid rgba(0,217,255,0.12)' }}>
              <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#4a5568' }} />
              <input type="text" placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-full placeholder-[#4a5568]"
                style={{ color: '#e2e8f0' }} />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={toggle} className="p-2 rounded-lg" style={{ color: '#a0aec0' }}>
              {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="p-2 rounded-lg relative" style={{ color: '#a0aec0' }}>
                <Bell className="w-4 h-4" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: '#ef4444' }}>{unread > 9 ? '9+' : unread}</span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto"
                  style={{ background: '#0d1628', border: '1px solid rgba(0,217,255,0.2)' }}>
                  <div className="p-3 flex items-center justify-between sticky top-0"
                    style={{ background: '#0d1628', borderBottom: '1px solid rgba(0,217,255,0.12)' }}>
                    <h3 className="font-bold text-sm text-white">Notifications</h3>
                    <button onClick={markAllRead} className="text-xs" style={{ color: CYAN }}>Mark all read</button>
                  </div>
                  {notifications.length === 0 && (
                    <div className="p-6 text-center">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2" style={{ color: '#10b981' }} />
                      <p className="text-sm" style={{ color: '#4a5568' }}>All caught up!</p>
                    </div>
                  )}
                  {notifications.map(n => (
                    <div key={n.id} onClick={() => markOneRead(n.id)}
                      className="p-3 cursor-pointer transition-colors"
                      style={{
                        borderBottom: '1px solid rgba(0,217,255,0.07)',
                        background: !n.read ? 'rgba(0,217,255,0.04)' : 'transparent',
                      }}>
                      <div className="flex items-center gap-2">
                        {!n.read && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: CYAN }} />}
                        <p className="text-sm font-medium text-white flex-1 truncate">{n.title}</p>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: '#8a94a6' }}>{n.body}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: '#4a5568' }}>
                        {new Date(n.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg">
                <div className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,217,255,0.12)', border: '1px solid rgba(0,217,255,0.3)' }}>
                  <User className="w-3.5 h-3.5" style={{ color: CYAN }} />
                </div>
                <span className="hidden sm:block text-sm font-medium" style={{ color: '#e2e8f0' }}>{displayName}</span>
                <ChevronDown className="w-3.5 h-3.5 hidden sm:block" style={{ color: '#4a5568' }} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 rounded-xl shadow-2xl z-50 overflow-hidden"
                  style={{ background: '#0d1628', border: '1px solid rgba(0,217,255,0.2)' }}>
                  <div className="px-3 py-2.5" style={{ borderBottom: '1px solid rgba(0,217,255,0.1)' }}>
                    <p className="text-sm font-medium text-white">{displayName}</p>
                    <p className="text-xs truncate" style={{ color: '#4a5568' }}>{user?.email}</p>
                  </div>
                  <Link href="/settings"
                    className="flex items-center gap-2 p-3 text-sm"
                    style={{ color: '#e2e8f0' }}
                    onClick={() => setProfileOpen(false)}>
                    <Settings className="w-4 h-4" style={{ color: CYAN }} /> Settings
                  </Link>
                  <button
                    className="w-full flex items-center gap-2 p-3 text-sm"
                    style={{ color: '#ef4444' }}
                    onClick={() => { setProfileOpen(false); logout(); }}>
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
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

      {/* ── Floating AI Button ─────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        {aiOpen && (
          <div className="absolute bottom-14 right-0 w-72 rounded-xl shadow-2xl p-4 mb-2"
            style={{ background: '#0d1628', border: '1px solid rgba(0,217,255,0.25)', boxShadow: '0 0 30px rgba(0,217,255,0.15)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-5 h-5" style={{ color: CYAN }} />
              <h4 className="font-bold text-sm text-white">M20 AI Assistant</h4>
              <button onClick={() => setAiOpen(false)} className="ml-auto" style={{ color: '#4a5568' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs mb-3" style={{ color: '#8a94a6' }}>
              Hi{user ? `, ${displayName}` : ''}! How can I help you today?
            </p>
            <div className="space-y-1.5 mb-3">
              {['Analyze top products', 'Suggest keywords', 'What is a good ACOS?'].map(q => (
                <Link key={q} href="/support"
                  className="block text-xs px-3 py-2 rounded-lg transition-colors"
                  style={{ background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.15)', color: '#e2e8f0' }}
                  onClick={() => setAiOpen(false)}>
                  {q}
                </Link>
              ))}
            </div>
            <Link href="/support" onClick={() => setAiOpen(false)}
              className="block text-center text-xs" style={{ color: CYAN }}>
              Open full chat →
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
