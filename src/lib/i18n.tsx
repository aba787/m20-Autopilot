import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

export type Lang = 'en' | 'ar';
export type Tone = 'friendly' | 'professional' | 'brief';

const translations: Record<string, Record<Lang, string>> = {
  'nav.dashboard': { en: 'Dashboard', ar: 'لوحة التحكم' },
  'nav.campaigns': { en: 'Campaigns', ar: 'الحملات' },
  'nav.products': { en: 'Products & Keywords', ar: 'المنتجات والكلمات المفتاحية' },
  'nav.blacklist': { en: 'Blacklist', ar: 'القائمة السوداء' },
  'nav.aiEngine': { en: 'AI Engine', ar: 'محرك الذكاء' },
  'nav.adGenerator': { en: 'Ad Generator', ar: 'منشئ الإعلانات' },
  'nav.accounting': { en: 'Accounting', ar: 'المحاسبة' },
  'nav.alerts': { en: 'Alerts', ar: 'التنبيهات' },
  'nav.reports': { en: 'Reports', ar: 'التقارير' },
  'nav.amazonNews': { en: 'Amazon News', ar: 'أخبار أمازون' },
  'nav.amazonConnect': { en: 'Amazon Connect', ar: 'ربط أمازون' },
  'nav.changeLog': { en: 'Change Log', ar: 'سجل التغييرات' },
  'nav.aiAssistant': { en: 'AI Assistant', ar: 'المساعد الذكي' },
  'nav.helpCenter': { en: 'Help Center', ar: 'مركز المساعدة' },
  'nav.settings': { en: 'Settings', ar: 'الإعدادات' },
  'nav.adminPanel': { en: 'Admin Panel', ar: 'لوحة الإدارة' },

  'dash.title': { en: 'Dashboard', ar: 'لوحة التحكم' },
  'dash.welcome': { en: 'Welcome, Ahmed — Last updated: Today 14:30', ar: 'أهلاً أحمد — آخر تحديث: اليوم 14:30' },
  'dash.monthly': { en: 'Monthly', ar: 'شهري' },
  'dash.twoWeeks': { en: '2 Weeks', ar: 'أسبوعين' },
  'dash.sales': { en: 'Sales', ar: 'المبيعات' },
  'dash.orders': { en: 'Orders', ar: 'الطلبات' },
  'dash.cost': { en: 'Cost', ar: 'التكلفة' },
  'dash.acos': { en: 'ACOS', ar: 'ACOS' },
  'dash.clicks': { en: 'Clicks', ar: 'النقرات' },
  'dash.profit': { en: 'Profit', ar: 'الربح' },
  'dash.adSpend': { en: 'Ad Spend', ar: 'الإنفاق الإعلاني' },
  'dash.unitsSold': { en: 'Units Sold', ar: 'الوحدات المباعة' },
  'dash.tacos': { en: 'TACoS', ar: 'TACoS' },
  'dash.dailyBudget': { en: 'Daily Budget', ar: 'الميزانية اليومية' },
  'dash.salesAndSpend': { en: 'Sales & Spend', ar: 'المبيعات والإنفاق' },
  'dash.campaignMix': { en: 'Campaign Mix', ar: 'توزيع الحملات' },
  'dash.alerts': { en: 'Alerts', ar: 'التنبيهات' },
  'dash.viewAll': { en: 'View all →', ar: 'عرض الكل ←' },
  'dash.productPerformance': { en: 'Product Performance', ar: 'أداء المنتجات' },
  'dash.spend': { en: 'Spend', ar: 'الإنفاق' },
  'dash.units': { en: 'Units', ar: 'الوحدات' },
  'dash.product': { en: 'Product', ar: 'المنتج' },
  'dash.today': { en: 'Today', ar: 'اليوم' },
  'dash.last7Days': { en: 'Last 7 Days', ar: 'آخر 7 أيام' },
  'dash.last30Days': { en: 'Last 30 Days', ar: 'آخر 30 يوم' },
  'dash.custom': { en: 'Custom', ar: 'مخصص' },

  'budget.lowWarning': {
    en: '⚠️ Current budget is low. For better results, it is recommended to have at least 40 SAR daily per product.',
    ar: '⚠️ الميزانية الحالية منخفضة. للحصول على نتائج أفضل، يفضل أن تكون 40 ريال يوميًا لكل منتج.'
  },

  'auto.on': { en: 'Automation ON', ar: 'الأتمتة مفعّلة' },
  'auto.off': { en: 'Stop Automation', ar: 'إيقاف الأتمتة' },
  'auto.warning': {
    en: '⚠️ Bot is active — if you don\'t stop it, it will manage campaigns automatically.',
    ar: '⚠️ البوت مفعل — إذا ما أوقفته، راح يدير الحملات تلقائيًا'
  },
  'auto.title': { en: 'Automation Control', ar: 'التحكم بالأتمتة' },
  'auto.desc': { en: 'Enable or disable automatic campaign management', ar: 'تفعيل أو تعطيل إدارة الحملات التلقائية' },

  'settings.title': { en: 'Settings', ar: 'الإعدادات' },
  'settings.subtitle': { en: 'Account settings and preferences', ar: 'إعدادات الحساب والتفضيلات' },
  'settings.language': { en: 'Language', ar: 'اللغة' },
  'settings.tone': { en: 'Response Style', ar: 'أسلوب الرد' },
  'settings.toneFriendly': { en: 'Friendly', ar: 'ودّي' },
  'settings.toneProfessional': { en: 'Professional', ar: 'رسمي' },
  'settings.toneBrief': { en: 'Brief', ar: 'مختصر' },
  'settings.amazonStore': { en: 'Amazon Store Link', ar: 'رابط متجر أمازون' },
  'settings.currency': { en: 'Currency & Region', ar: 'العملة والمنطقة' },
  'settings.perfGoals': { en: 'Performance Goals', ar: 'أهداف الأداء' },
  'settings.notifications': { en: 'Notifications', ar: 'الإشعارات' },
  'settings.emailAlerts': { en: 'Email Alerts', ar: 'تنبيهات البريد' },
  'settings.autoOptimize': { en: 'Auto-Optimize', ar: 'التحسين التلقائي' },
  'settings.dangerZone': { en: 'Danger Zone', ar: 'منطقة الخطر' },
  'settings.save': { en: 'Save Settings', ar: 'حفظ الإعدادات' },
  'settings.saved': { en: '✓ Saved!', ar: '✓ تم الحفظ!' },

  'products.title': { en: 'Products & Keywords', ar: 'المنتجات والكلمات المفتاحية' },
  'products.search': { en: 'Search by name or ASIN...', ar: 'البحث بالاسم أو ASIN...' },
  'products.brand': { en: 'Brand:', ar: 'العلامة:' },
  'products.allStatus': { en: 'All Status', ar: 'كل الحالات' },
  'products.active': { en: 'Active', ar: 'نشط' },
  'products.weak': { en: 'Weak', ar: 'ضعيف' },
  'products.poor': { en: 'Poor', ar: 'سيئ' },
  'products.details': { en: 'Product Details', ar: 'تفاصيل المنتج' },
  'products.exclude': { en: 'Exclude', ar: 'استبعاد' },
  'products.moveBlacklist': { en: 'Move to Blacklist', ar: 'نقل للقائمة السوداء' },
  'products.keywords': { en: 'Keywords', ar: 'الكلمات المفتاحية' },
  'products.negKeywords': { en: 'Negative Keywords', ar: 'كلمات مفتاحية سلبية' },

  'bot.title': { en: 'AI Assistant', ar: 'المساعد الذكي' },
  'bot.subtitle': { en: 'Powered by GPT-4o mini — ask anything about Amazon advertising or the platform', ar: 'مدعوم بـ GPT-4o mini — اسأل أي شيء عن إعلانات أمازون أو المنصة' },
  'bot.welcomeEn': { en: 'Hello! I\'m the M20 AI Assistant — your Amazon advertising expert. I can help you with campaigns, keywords, ACOS/ROAS, and how to use the platform. What would you like to know?', ar: '' },
  'bot.welcomeAr': { en: '', ar: 'أهلاً! أنا المساعد الذكي M20 — خبير إعلانات أمازون. أقدر أساعدك في الحملات، الكلمات المفتاحية، ACOS/ROAS، واستخدام المنصة. كيف أقدر أساعدك؟' },
  'bot.placeholder': { en: 'Ask anything about Amazon advertising...', ar: 'اسأل أي شيء عن إعلانات أمازون...' },
  'bot.scope': {
    en: 'This assistant only answers questions about Amazon advertising and the M20 platform.',
    ar: 'هذا المساعد يجيب فقط على أسئلة إعلانات أمازون ومنصة M20.'
  },

  'common.search': { en: 'Search...', ar: 'بحث...' },
  'common.notifications': { en: 'Notifications', ar: 'الإشعارات' },
  'common.markAllRead': { en: 'Mark all read', ar: 'تحديد الكل كمقروء' },
  'common.allCaughtUp': { en: 'All caught up!', ar: 'لا يوجد إشعارات جديدة!' },
  'common.logOut': { en: 'Log Out', ar: 'تسجيل الخروج' },
};

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  tone: Tone;
  setTone: (t: Tone) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
  isRtl: boolean;
  automationEnabled: boolean;
  setAutomationEnabled: (v: boolean) => void;
}

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  setLang: () => {},
  tone: 'friendly',
  setTone: () => {},
  t: (k) => k,
  dir: 'ltr',
  isRtl: false,
  automationEnabled: false,
  setAutomationEnabled: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  const [tone, setToneState] = useState<Tone>('friendly');
  const [automationEnabled, setAutomationEnabledState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('m20_prefs');
      if (saved) {
        const prefs = JSON.parse(saved);
        if (prefs.lang) setLangState(prefs.lang);
        if (prefs.tone) setToneState(prefs.tone);
        if (prefs.automationEnabled !== undefined) setAutomationEnabledState(prefs.automationEnabled);
      }
    } catch {}
    setHydrated(true);
  }, []);

  const persist = useCallback((updates: Record<string, any>) => {
    try {
      const saved = localStorage.getItem('m20_prefs');
      const prefs = saved ? JSON.parse(saved) : {};
      localStorage.setItem('m20_prefs', JSON.stringify({ ...prefs, ...updates }));
    } catch {}
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    persist({ lang: l });
  }, [persist]);

  const setTone = useCallback((t: Tone) => {
    setToneState(t);
    persist({ tone: t });
  }, [persist]);

  const setAutomationEnabled = useCallback((v: boolean) => {
    setAutomationEnabledState(v);
    persist({ automationEnabled: v });
  }, [persist]);

  const t = useCallback((key: string) => {
    return translations[key]?.[lang] || key;
  }, [lang]);

  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const isRtl = lang === 'ar';

  return (
    <I18nContext.Provider value={{ lang, setLang, tone, setTone, t, dir, isRtl, automationEnabled, setAutomationEnabled }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
