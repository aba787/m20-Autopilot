import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from './ThemeProvider';
import {
  LayoutDashboard, Megaphone, Package, Lightbulb, Bell, FileText,
  Link2, History, HeadphonesIcon, HelpCircle,
  Settings, Moon, Sun, Menu, X, ChevronDown, User, LogOut, Search,
  Calculator, Newspaper, ShieldOff, Bot, Zap, Sparkles, CheckCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAuth, authFetch } from '@/lib/useAuth';
import { useI18n } from '@/lib/i18n';

const menuKeys = [
  { href: '/dashboard',     key: 'nav.dashboard',      icon: LayoutDashboard },
  { href: '/campaigns',     key: 'nav.campaigns',      icon: Megaphone       },
  { href: '/products',      key: 'nav.products',       icon: Package         },
  { href: '/blacklist',     key: 'nav.blacklist',      icon: ShieldOff       },
  { href: '/ai-engine',     key: 'nav.aiEngine',       icon: Lightbulb       },
  { href: '/ads-generator', key: 'nav.adGenerator',    icon: Sparkles        },
  { href: '/accounting',    key: 'nav.accounting',     icon: Calculator      },
  { href: '/alerts',        key: 'nav.alerts',         icon: Bell            },
  { href: '/reports',       key: 'nav.reports',        icon: FileText        },
  { href: '/amazon-news',   key: 'nav.amazonNews',     icon: Newspaper       },
  { href: '/integration',   key: 'nav.amazonConnect',  icon: Link2           },
  { href: '/audit',         key: 'nav.changeLog',      icon: History         },
  { href: '/support',       key: 'nav.aiAssistant',    icon: HeadphonesIcon  },
  { href: '/help',          key: 'nav.helpCenter',     icon: HelpCircle      },
  { href: '/settings',      key: 'nav.settings',       icon: Settings        },
];

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
  const { t, lang, dir, automationEnabled } = useI18n();

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

  const displayName = user?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? t('common.user');
  const modeLabel   = user?.bot_mode ? `${t('layout.botMode')}: ${user.bot_mode}` : t('common.guest');
  const modeColor   = user?.bot_mode === 'auto' ? 'var(--success)' : user?.bot_mode === 'semi' ? 'var(--warning)' : 'var(--accent)';

  const quickSuggestions = [t('layout.quickSuggest1'), t('layout.quickSuggest2'), t('layout.quickSuggest3')];

  return (
    <div className="flex h-screen overflow-hidden" dir={dir}>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed lg:static inset-y-0 ${lang === 'ar' ? 'right-0' : 'left-0'} z-50 w-60 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : (lang === 'ar' ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')} flex flex-col`}
        style={{ background: 'var(--bg-secondary)', borderRight: lang === 'ar' ? 'none' : '1px solid var(--border-primary)', borderLeft: lang === 'ar' ? '1px solid var(--border-primary)' : 'none' }}>

        <div className="p-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--border-primary)' }}>
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', boxShadow: 'var(--accent-glow)' }}>
              <Zap className="w-4 h-4" style={{ color: 'var(--btn-text)' }} />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>M20 Autopilot</h1>
              <p className="text-[10px] leading-tight" style={{ color: 'var(--text-dim)' }}>
                {t('layout.appSubtitle')}
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {user?.role === 'admin' && (() => {
            const active = router.pathname === '/admin';
            return (
              <Link href="/admin"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg mb-1 text-sm font-medium transition-all duration-200"
                style={active ? {
                  background: 'rgba(245,158,11,0.12)', color: 'var(--warning)',
                  border: '1px solid rgba(245,158,11,0.3)', boxShadow: '0 0 12px rgba(245,158,11,0.1)',
                } : { color: 'var(--warning)', border: '1px solid transparent', background: 'rgba(245,158,11,0.05)' }}>
                <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--warning)' }} />
                <span className="flex-1 truncate">{t('nav.adminPanel')}</span>
              </Link>
            );
          })()}
          {menuKeys.map(item => {
            const active = router.pathname === item.href;
            const Icon   = item.icon;
            return (
              <Link key={item.href} href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-sm font-medium transition-all duration-200"
                style={active ? {
                  background: 'var(--accent-bg-strong)', color: 'var(--accent)',
                  border: '1px solid var(--accent-border)', boxShadow: '0 0 12px rgba(0,217,255,0.1)',
                } : { color: 'var(--text-muted)', border: '1px solid transparent' }}>
                <Icon className="w-4 h-4 flex-shrink-0" style={active ? { color: 'var(--accent)' } : {}} />
                <span className="flex-1 truncate">{t(item.key)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 flex-shrink-0" style={{ borderTop: '1px solid var(--border-primary)' }}>
          {automationEnabled && (
            <div className="mb-2 px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.25)' }}>
              <span>🟢</span> {t('auto.on')}
            </div>
          )}
          <div className="flex items-center gap-2.5 p-2 rounded-lg" style={{ background: 'var(--card-bg)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--accent-bg-strong)', border: '1px solid var(--accent-border)' }}>
              <User className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{displayName}</p>
              <p className="text-[10px] truncate font-medium" style={{ color: modeColor }}>{modeLabel}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center justify-between px-4 sticky top-0 z-30 flex-shrink-0"
          style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-primary)' }}>

          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5 w-52"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-dim)' }} />
              <input type="text" placeholder={t('common.search')}
                className="bg-transparent border-none outline-none text-sm w-full"
                style={{ color: 'var(--text-secondary)' }} />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={toggle} className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}>
              {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="relative">
              <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="p-2 rounded-lg relative" style={{ color: 'var(--text-muted)' }}>
                <Bell className="w-4 h-4" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: 'var(--error)' }}>{unread > 9 ? '9+' : unread}</span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent-border)' }}>
                  <div className="p-3 flex items-center justify-between sticky top-0"
                    style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
                    <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{t('common.notifications')}</h3>
                    <button onClick={markAllRead} className="text-xs" style={{ color: 'var(--accent)' }}>{t('common.markAllRead')}</button>
                  </div>
                  {notifications.length === 0 && (
                    <div className="p-6 text-center">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--success)' }} />
                      <p className="text-sm" style={{ color: 'var(--text-dim)' }}>{t('common.allCaughtUp')}</p>
                    </div>
                  )}
                  {notifications.map(n => (
                    <div key={n.id} onClick={() => markOneRead(n.id)}
                      className="p-3 cursor-pointer transition-colors"
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        background: !n.read ? 'var(--card-bg)' : 'transparent',
                      }}>
                      <div className="flex items-center gap-2">
                        {!n.read && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />}
                        <p className="text-sm font-medium flex-1 truncate" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{n.body}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
                        {new Date(n.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg">
                <div className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--accent-bg-strong)', border: '1px solid var(--accent-border)' }}>
                  <User className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                </div>
                <span className="hidden sm:block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{displayName}</span>
                <ChevronDown className="w-3.5 h-3.5 hidden sm:block" style={{ color: 'var(--text-dim)' }} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 rounded-xl shadow-2xl z-50 overflow-hidden"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent-border)' }}>
                  <div className="px-3 py-2.5" style={{ borderBottom: '1px solid var(--border-primary)' }}>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{displayName}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-dim)' }}>{user?.email}</p>
                  </div>
                  <Link href="/settings"
                    className="flex items-center gap-2 p-3 text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                    onClick={() => setProfileOpen(false)}>
                    <Settings className="w-4 h-4" style={{ color: 'var(--accent)' }} /> {t('nav.settings')}
                  </Link>
                  <button
                    className="w-full flex items-center gap-2 p-3 text-sm"
                    style={{ color: 'var(--error)' }}
                    onClick={() => { setProfileOpen(false); logout(); }}>
                    <LogOut className="w-4 h-4" /> {t('common.logOut')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {automationEnabled && (
          <div className="px-4 py-2 flex items-center gap-2 text-sm font-medium"
            style={{ background: 'rgba(16,185,129,0.08)', borderBottom: '1px solid rgba(16,185,129,0.2)', color: 'var(--success)' }}>
            <Bot className="w-4 h-4" />
            <span>🟢 {t('auto.on')} — {t('auto.banner')}</span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 lg:p-6" style={{ background: 'var(--bg-primary)' }}>
          {children}
        </main>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        {aiOpen && (
          <div className="absolute bottom-14 right-0 w-80 rounded-xl shadow-2xl p-4 mb-2"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent-border)', boxShadow: '0 0 30px rgba(0,217,255,0.15)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                {t('layout.aiAssistantTitle')}
              </h4>
              <button onClick={() => setAiOpen(false)} className="ml-auto" style={{ color: 'var(--text-dim)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
              {`${t('common.hi')}${user ? ` ${displayName}` : ''}! ${t('common.howCanIHelp')}`}
            </p>
            <div className="space-y-1.5 mb-3">
              {quickSuggestions.map(q => (
                <Link key={q} href="/support"
                  className="block text-sm px-3 py-2 rounded-lg transition-colors"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-secondary)' }}
                  onClick={() => setAiOpen(false)}>
                  {q}
                </Link>
              ))}
            </div>
            <Link href="/support" onClick={() => setAiOpen(false)}
              className="block text-center text-sm font-medium" style={{ color: 'var(--accent)' }}>
              {t('common.openFullChat')}
            </Link>
          </div>
        )}
        <button onClick={() => setAiOpen(!aiOpen)}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
            boxShadow: aiOpen ? '0 0 30px rgba(0,217,255,0.5)' : '0 0 18px rgba(0,217,255,0.35)',
          }}>
          {aiOpen ? <X className="w-5 h-5" style={{ color: 'var(--btn-text)' }} /> : <Bot className="w-5 h-5" style={{ color: 'var(--btn-text)' }} />}
        </button>
      </div>
    </div>
  );
}
