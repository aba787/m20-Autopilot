import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from './ThemeProvider';
import {
  LayoutDashboard, Megaphone, Package, Lightbulb, Bell, FileText,
  Link2, History, HeadphonesIcon, HelpCircle,
  Settings, Moon, Sun, Menu, X, ChevronDown, User, LogOut, Search,
  Calculator, Newspaper, ShieldOff, Bot, Zap, Sparkles, CheckCircle,
  ShieldCheck, Globe, Send, Loader2, Crown,
} from 'lucide-react';
import { useAuth, authFetch } from '@/lib/useAuth';
import { useI18n, supportedLanguages } from '@/lib/i18n';
import ReactMarkdown from 'react-markdown';

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
  { href: '/help',          key: 'nav.helpCenter',     icon: HelpCircle      },
  { href: '/subscriptions', key: 'nav.subscriptions',  icon: Crown           },
  { href: '/settings',      key: 'nav.settings',       icon: Settings        },
];

interface DBNotif { id: string; title: string; body: string; type: string; read: boolean; created_at: string; }

interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  message: string;
  loading?: boolean;
}

const quickQuestionsEn = [
  "How to lower ACOS?",
  "Suggest keywords",
  "What is a good ACOS?",
];
const quickQuestionsAr = [
  "كيف أخفض الـ ACOS؟",
  "اقتراح كلمات مفتاحية",
  "ما هو ACOS الجيد؟",
];

const faqEn: Record<string, string> = {
  "how to lower acos": "Here are proven strategies to lower your ACOS:\n\n1. Add negative keywords to stop irrelevant clicks\n2. Focus on high-converting keywords\n3. Reduce bids on keywords with high ACOS\n4. Improve your product listing\n5. Use the AI Engine for recommendations",
  "suggest keywords": "To find the best keywords:\n\n1. Start with your product's main features\n2. Use Amazon's auto-suggest\n3. Focus on high CTR and good ROAS\n4. Check the AI Engine for suggestions",
  "what is a good acos": "A good ACOS depends on your margin:\n\n• Excellent: < 15%\n• Good: 15-25%\n• Average: 25-35%\n• Poor: > 35%\n\nTarget ACOS should be below your profit margin.",
};

const faqAr: Record<string, string> = {
  "كيف أخفض الـ acos": "استراتيجيات لتخفيض ACOS:\n\n1. إضافة كلمات سلبية\n2. التركيز على الكلمات عالية التحويل\n3. تقليل العطاءات للكلمات ذات ACOS عالي\n4. تحسين قائمة المنتج\n5. استخدم محرك الذكاء",
  "اقتراح كلمات مفتاحية": "لاختيار أفضل الكلمات:\n\n1. ابدأ بميزات المنتج الرئيسية\n2. استخدم اقتراحات أمازون\n3. ركّز على CTR عالي و ROAS جيد\n4. تحقق من محرك الذكاء",
  "ما هو acos الجيد": "الـ ACOS الجيد يعتمد على هامش الربح:\n\n• ممتاز: أقل من 15%\n• جيد: 15-25%\n• متوسط: 25-35%\n• ضعيف: أكثر من 35%",
};

function detectLang(text: string): 'ar' | 'en' {
  const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
  return arabicChars >= latinChars && arabicChars > 0 ? 'ar' : 'en';
}

function findFaqAnswer(msg: string): string | null {
  const detected = detectLang(msg);
  const normalized = msg.toLowerCase().replace(/[?؟!.]/g, '').trim();
  const faq = detected === 'ar' ? faqAr : faqEn;
  for (const [key, answer] of Object.entries(faq)) {
    const nk = key.toLowerCase().replace(/[?؟!.]/g, '').trim();
    if (normalized.includes(nk) || nk.includes(normalized)) return answer;
  }
  return null;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [langOpen,     setLangOpen]     = useState(false);
  const [notifications, setNotifications] = useState<DBNotif[]>([]);
  const [unread,       setUnread]       = useState(0);

  const [chatOpen,     setChatOpen]     = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput,    setChatInput]    = useState('');
  const [chatLoading,  setChatLoading]  = useState(false);
  const [chatHistory,  setChatHistory]  = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { dark, toggle } = useTheme();
  const { user, token, logout } = useAuth();
  const af = authFetch(token);
  const { t, lang, setLang, dir, automationEnabled } = useI18n();

  useEffect(() => {
    if (!user?.id) return;
    try {
      const stored = localStorage.getItem(`m20_chat_${user.id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.messages) setChatMessages(parsed.messages);
        if (parsed.history) setChatHistory(parsed.history);
      }
    } catch {}
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || chatMessages.length === 0) return;
    try {
      localStorage.setItem(`m20_chat_${user.id}`, JSON.stringify({
        messages: chatMessages.filter(m => !m.loading).slice(-50),
        history: chatHistory.slice(-24),
      }));
    } catch {}
  }, [chatMessages, chatHistory, user?.id]);

  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

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

  const sendChat = useCallback(async (text?: string) => {
    const msg = text || chatInput.trim();
    if (!msg || chatLoading) return;
    setChatInput('');

    const userMsg: ChatMessage = { id: Date.now(), sender: 'user', message: msg };
    const tempBotId = Date.now() + 1;

    const faqAnswer = findFaqAnswer(msg);
    if (faqAnswer) {
      setChatMessages(prev => [...prev, userMsg, { id: tempBotId, sender: 'bot', message: faqAnswer }]);
      setChatHistory(prev => [...prev, { role: 'user' as const, content: msg }, { role: 'assistant' as const, content: faqAnswer }].slice(-24));
      return;
    }

    setChatMessages(prev => [...prev, userMsg, { id: tempBotId, sender: 'bot', message: '', loading: true }]);
    setChatLoading(true);

    try {
      const res = await af('/api/support-chat', {
        method: 'POST',
        body: JSON.stringify({ message: msg, history: chatHistory, language: lang, tone: 'friendly' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      const reply = data.reply as string;
      setChatHistory(prev => [...prev, { role: 'user' as const, content: msg }, { role: 'assistant' as const, content: reply }].slice(-24));
      setChatMessages(prev => prev.map(m => m.id === tempBotId ? { ...m, message: reply, loading: false } : m));
    } catch {
      setChatMessages(prev => prev.filter(m => m.id !== tempBotId));
    } finally {
      setChatLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatInput, chatLoading, chatHistory, lang, token]);

  const displayName = user?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? t('common.user');
  const modeLabel   = user?.bot_mode ? `${t('layout.botMode')}: ${user.bot_mode}` : t('common.guest');
  const modeColor   = user?.bot_mode === 'auto' ? 'var(--success)' : user?.bot_mode === 'semi' ? 'var(--warning)' : 'var(--accent)';

  const quickSuggestions = lang === 'ar' ? quickQuestionsAr : quickQuestionsEn;
  const welcomeMessage = lang === 'ar'
    ? 'أهلاً! أنا المساعد الذكي M20. كيف أقدر أساعدك؟'
    : "Hi! I'm the M20 AI Assistant. How can I help you?";

  const closeAllPopups = () => { setNotifOpen(false); setProfileOpen(false); setLangOpen(false); };

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
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', boxShadow: 'var(--accent-glow)' }}>
              <Zap className="w-5 h-5" style={{ color: 'var(--btn-text)' }} />
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
                <ShieldCheck className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--warning)' }} />
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
                <Icon className="w-5 h-5 flex-shrink-0" style={active ? { color: 'var(--accent)' } : {}} />
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
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--accent-bg-strong)', border: '1px solid var(--accent-border)' }}>
              <User className="w-4 h-4" style={{ color: 'var(--accent)' }} />
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
              <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-dim)' }} />
              <input type="text" placeholder={t('common.search')}
                className="bg-transparent border-none outline-none text-sm w-full"
                style={{ color: 'var(--text-secondary)' }} />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <div className="relative">
              <button onClick={() => { setLangOpen(!langOpen); setNotifOpen(false); setProfileOpen(false); }}
                className="p-2 rounded-lg flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <Globe className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-medium">{supportedLanguages.find(l => l.code === lang)?.nativeLabel}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-12 w-44 rounded-xl shadow-2xl z-50 overflow-hidden"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent-border)' }}>
                  {supportedLanguages.map(l => (
                    <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors"
                      style={{
                        color: lang === l.code ? 'var(--accent)' : 'var(--text-secondary)',
                        background: lang === l.code ? 'var(--accent-bg-strong)' : 'transparent',
                        borderBottom: '1px solid var(--border-subtle)',
                      }}>
                      <span className="font-medium">{l.nativeLabel}</span>
                      <span className="text-xs" style={{ color: 'var(--text-dim)' }}>({l.label})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={toggle} className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}>
              {dark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="relative">
              <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); setLangOpen(false); }}
                className="p-2 rounded-lg relative" style={{ color: 'var(--text-muted)' }}>
                <Bell className="w-5 h-5" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
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
              <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); setLangOpen(false); }}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg">
                <div className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--accent-bg-strong)', border: '1px solid var(--accent-border)' }}>
                  <User className="w-4 h-4" style={{ color: 'var(--accent)' }} />
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
                    <Settings className="w-5 h-5" style={{ color: 'var(--accent)' }} /> {t('nav.settings')}
                  </Link>
                  <button
                    className="w-full flex items-center gap-2 p-3 text-sm"
                    style={{ color: 'var(--error)' }}
                    onClick={() => { setProfileOpen(false); logout(); }}>
                    <LogOut className="w-5 h-5" /> {t('common.logOut')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {automationEnabled && (
          <div className="px-4 py-2 flex items-center gap-2 text-sm font-medium"
            style={{ background: 'rgba(16,185,129,0.08)', borderBottom: '1px solid rgba(16,185,129,0.2)', color: 'var(--success)' }}>
            <Bot className="w-5 h-5" />
            <span>🟢 {t('auto.on')} — {t('auto.banner')}</span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 lg:p-6" style={{ background: 'var(--bg-primary)' }}>
          {children}
        </main>
      </div>

      <div className={`fixed bottom-6 z-50 ${dir === 'rtl' ? 'left-6' : 'right-6'}`}>
        {chatOpen && (
          <div className={`absolute bottom-16 w-[340px] rounded-2xl shadow-2xl overflow-hidden flex flex-col ${dir === 'rtl' ? 'left-0' : 'right-0'}`}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--accent-border)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
              height: '480px',
            }}>
            <div className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))' }}>
              <Bot className="w-5 h-5" style={{ color: 'var(--btn-text)' }} />
              <h4 className="font-bold text-sm flex-1" style={{ color: 'var(--btn-text)' }}>
                {t('layout.aiAssistantTitle')}
              </h4>
              <button onClick={() => setChatOpen(false)} style={{ color: 'var(--btn-text)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--accent-bg-strong)', border: '1px solid var(--accent-border)' }}>
                  <Bot className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="rounded-xl rounded-tl-sm px-3 py-2 text-sm max-w-[240px]"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}>
                  {welcomeMessage}
                </div>
              </div>

              {chatMessages.length === 0 && (
                <div className="space-y-1.5 pt-1">
                  {quickSuggestions.map(q => (
                    <button key={q} onClick={() => sendChat(q)} disabled={chatLoading}
                      className="block w-full text-start text-xs px-3 py-2 rounded-lg transition-colors"
                      style={{ border: '1px solid var(--input-border)', color: 'var(--text-muted)', background: 'var(--card-bg)' }}>
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {chatMessages.map(m => (
                <div key={m.id} className={`flex gap-2 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={m.sender === 'bot'
                      ? { background: 'var(--accent-bg-strong)', border: '1px solid var(--accent-border)' }
                      : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {m.sender === 'bot'
                      ? <Bot className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                      : <User className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />}
                  </div>
                  <div>
                    {m.loading ? (
                      <div className="rounded-xl rounded-tl-sm px-3 py-2"
                        style={{ background: 'var(--input-bg)', border: '1px solid var(--card-border)' }}>
                        <div className="flex gap-1">
                          {[0, 150, 300].map(d => (
                            <div key={d} className="w-1.5 h-1.5 rounded-full animate-bounce"
                              style={{ background: 'var(--accent)', animationDelay: `${d}ms` }} />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className={`rounded-xl px-3 py-2 text-sm max-w-[260px] ${m.sender === 'bot' ? 'chat-markdown' : 'whitespace-pre-line'}`}
                        style={m.sender === 'user'
                          ? { background: 'var(--accent-bg-strong)', border: '1px solid var(--accent-border)', color: 'var(--text-secondary)', borderTopRightRadius: '4px' }
                          : { background: 'var(--card-bg)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)', borderTopLeftRadius: '4px' }}>
                        {m.sender === 'bot' ? <ReactMarkdown>{m.message}</ReactMarkdown> : m.message}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            <div className="px-3 py-2.5 flex-shrink-0" style={{ borderTop: '1px solid var(--border-primary)' }}>
              <form onSubmit={e => { e.preventDefault(); sendChat(); }} className="flex gap-2">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                  placeholder={t('bot.placeholder')}
                  disabled={chatLoading}
                  className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }} />
                <button type="submit" disabled={!chatInput.trim() || chatLoading}
                  className="p-2 rounded-lg transition-all flex-shrink-0"
                  style={{
                    background: chatInput.trim() && !chatLoading ? 'linear-gradient(135deg, var(--accent), var(--accent-light))' : 'var(--input-bg)',
                    cursor: chatInput.trim() && !chatLoading ? 'pointer' : 'not-allowed',
                    color: 'var(--btn-text)',
                  }}>
                  {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </div>
        )}
        <button onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
            boxShadow: chatOpen ? '0 0 30px rgba(0,217,255,0.5)' : '0 0 18px rgba(0,217,255,0.35)',
          }}>
          {chatOpen ? <X className="w-6 h-6" style={{ color: 'var(--btn-text)' }} /> : <Bot className="w-6 h-6" style={{ color: 'var(--btn-text)' }} />}
        </button>
      </div>
    </div>
  );
}
