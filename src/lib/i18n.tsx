import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

export type Lang = string;
export type Tone = 'friendly' | 'professional' | 'brief';

export interface LangConfig {
  code: string;
  label: string;
  nativeLabel: string;
  dir: 'ltr' | 'rtl';
}

export const supportedLanguages: LangConfig[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', dir: 'rtl' },
];

const translations: Record<string, Record<string, string>> = {
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
  'dash.salesLabel': { en: 'Sales', ar: 'المبيعات' },
  'dash.spendLabel': { en: 'Spend', ar: 'الإنفاق' },
  'dash.lineChart': { en: 'Line Chart', ar: 'خط بياني' },
  'dash.barChart': { en: 'Bar Chart', ar: 'أعمدة بيانية' },

  'budget.lowWarning': {
    en: '⚠️ Current budget is low. For better results, it is recommended to have at least 40 SAR daily per product.',
    ar: '⚠️ الميزانية الحالية منخفضة. للحصول على نتائج أفضل، يفضل أن تكون 40 ريال يوميًا لكل منتج.'
  },

  'auto.on': { en: 'Automation ON', ar: 'الأتمتة مفعّلة' },
  'auto.off': { en: 'Stop Automation', ar: 'إيقاف الأتمتة' },
  'auto.warning': {
    en: "⚠️ Bot is active — if you don't stop it, it will manage campaigns automatically.",
    ar: '⚠️ البوت مفعل — إذا ما أوقفته، راح يدير الحملات تلقائيًا'
  },
  'auto.title': { en: 'Automation Control', ar: 'التحكم بالأتمتة' },
  'auto.desc': { en: 'Enable or disable automatic campaign management', ar: 'تفعيل أو تعطيل إدارة الحملات التلقائية' },
  'auto.banner': { en: 'Bot is managing campaigns automatically', ar: 'البوت يدير الحملات تلقائيًا' },

  'settings.title': { en: 'Settings', ar: 'الإعدادات' },
  'settings.subtitle': { en: 'Account settings and preferences', ar: 'إعدادات الحساب والتفضيلات' },
  'settings.language': { en: 'Language', ar: 'اللغة' },
  'settings.tone': { en: 'Response Style', ar: 'أسلوب الرد' },
  'settings.toneFriendly': { en: 'Friendly', ar: 'ودّي' },
  'settings.toneProfessional': { en: 'Professional', ar: 'رسمي' },
  'settings.toneBrief': { en: 'Brief', ar: 'مختصر' },
  'settings.amazonStore': { en: 'Amazon Store Link', ar: 'رابط متجر أمازون' },
  'settings.storeUrl': { en: 'Store URL', ar: 'رابط المتجر' },
  'settings.storeUrlPlaceholder': { en: 'https://www.amazon.com/...', ar: 'https://www.amazon.sa/...' },
  'settings.currency': { en: 'Currency & Region', ar: 'العملة والمنطقة' },
  'settings.currencyLabel': { en: 'Currency', ar: 'العملة' },
  'settings.timezone': { en: 'Timezone', ar: 'المنطقة الزمنية' },
  'settings.perfGoals': { en: 'Performance Goals', ar: 'أهداف الأداء' },
  'settings.targetAcos': { en: 'Target ACOS (%)', ar: 'ACOS المستهدف (%)' },
  'settings.notifications': { en: 'Notifications', ar: 'الإشعارات' },
  'settings.emailAlerts': { en: 'Email Alerts', ar: 'تنبيهات البريد' },
  'settings.emailAlertsDesc': { en: 'Get instant alerts when performance declines', ar: 'احصل على تنبيهات فورية عند تراجع الأداء' },
  'settings.autoOptimize': { en: 'Auto-Optimize', ar: 'التحسين التلقائي' },
  'settings.autoOptimizeDesc': { en: 'Allow AI to apply recommendations automatically', ar: 'السماح للذكاء الاصطناعي بتطبيق التوصيات تلقائيًا' },
  'settings.dangerZone': { en: 'Danger Zone', ar: 'منطقة الخطر' },
  'settings.deleteAll': { en: 'Delete All Data', ar: 'حذف جميع البيانات' },
  'settings.deleteAllDesc': { en: 'Permanently delete all account data — cannot be undone', ar: 'حذف جميع بيانات الحساب نهائيًا — لا يمكن التراجع' },
  'settings.deleteAccount': { en: 'Delete Account', ar: 'حذف الحساب' },
  'settings.save': { en: 'Save Settings', ar: 'حفظ الإعدادات' },
  'settings.saved': { en: '✓ Saved!', ar: '✓ تم الحفظ!' },
  'settings.langAndTone': { en: 'Language & Tone', ar: 'اللغة والنبرة' },
  'settings.deleteDesc': { en: 'Permanently delete your account and all data', ar: 'حذف حسابك وجميع بياناتك نهائياً' },
  'settings.sarOption': { en: 'Saudi Riyal (SAR)', ar: 'ريال سعودي (SAR)' },
  'settings.usdOption': { en: 'US Dollar (USD)', ar: 'دولار أمريكي (USD)' },
  'settings.aedOption': { en: 'UAE Dirham (AED)', ar: 'درهم إماراتي (AED)' },

  'products.title': { en: 'Products & Keywords', ar: 'المنتجات والكلمات المفتاحية' },
  'products.search': { en: 'Search by name or ASIN...', ar: 'البحث بالاسم أو ASIN...' },
  'products.brand': { en: 'Brand:', ar: 'العلامة:' },
  'products.allBrands': { en: 'All', ar: 'الكل' },
  'products.allStatus': { en: 'All Status', ar: 'كل الحالات' },
  'products.active': { en: 'Active', ar: 'نشط' },
  'products.weak': { en: 'Weak', ar: 'ضعيف' },
  'products.poor': { en: 'Poor', ar: 'سيئ' },
  'products.details': { en: 'Product Details', ar: 'تفاصيل المنتج' },
  'products.exclude': { en: 'Exclude', ar: 'استبعاد' },
  'products.moveBlacklist': { en: 'Move to Blacklist', ar: 'نقل للقائمة السوداء' },
  'products.keywords': { en: 'Keywords', ar: 'الكلمات المفتاحية' },
  'products.negKeywords': { en: 'Negative Keywords', ar: 'كلمات مفتاحية سلبية' },
  'products.asin': { en: 'ASIN', ar: 'ASIN' },
  'products.status': { en: 'Status', ar: 'الحالة' },
  'products.action': { en: 'Action', ar: 'الإجراء' },
  'products.none': { en: 'None', ar: 'لا يوجد' },

  'bot.title': { en: 'AI Assistant', ar: 'المساعد الذكي' },
  'bot.subtitle': { en: 'Powered by GPT-4o mini — ask anything about Amazon advertising or the platform', ar: 'مدعوم بـ GPT-4o mini — اسأل أي شيء عن إعلانات أمازون أو المنصة' },
  'bot.welcomeEn': { en: "Hello! I'm the M20 AI Assistant — your Amazon advertising expert. I can help you with campaigns, keywords, ACOS/ROAS, and how to use the platform. What would you like to know?", ar: '' },
  'bot.welcomeAr': { en: '', ar: 'أهلاً! أنا المساعد الذكي M20 — خبير إعلانات أمازون. أقدر أساعدك في الحملات، الكلمات المفتاحية، ACOS/ROAS، واستخدام المنصة. كيف أقدر أساعدك؟' },
  'bot.placeholder': { en: 'Ask anything about Amazon advertising...', ar: 'اسأل أي شيء عن إعلانات أمازون...' },
  'bot.scope': {
    en: 'This assistant only answers questions about Amazon advertising and the M20 platform.',
    ar: 'هذا المساعد يجيب فقط على أسئلة إعلانات أمازون ومنصة M20.'
  },
  'bot.billingContact': { en: 'For billing or account issues, email', ar: 'لمشاكل الفواتير أو الحساب، تواصل عبر' },
  'bot.you': { en: 'You', ar: 'أنت' },
  'bot.send': { en: 'Send', ar: 'إرسال' },
  'bot.typing': { en: 'Typing...', ar: 'يكتب...' },

  'common.search': { en: 'Search...', ar: 'بحث...' },
  'common.notifications': { en: 'Notifications', ar: 'الإشعارات' },
  'common.markAllRead': { en: 'Mark all read', ar: 'تحديد الكل كمقروء' },
  'common.allCaughtUp': { en: 'All caught up!', ar: 'لا يوجد إشعارات جديدة!' },
  'common.logOut': { en: 'Log Out', ar: 'تسجيل الخروج' },
  'common.user': { en: 'User', ar: 'المستخدم' },
  'common.guest': { en: 'Guest', ar: 'ضيف' },
  'common.openFullChat': { en: 'Open full chat →', ar: 'افتح المحادثة ←' },
  'common.hi': { en: 'Hi', ar: 'أهلاً' },
  'common.howCanIHelp': { en: 'How can I help you today?', ar: 'كيف أقدر أساعدك اليوم؟' },
  'common.noResults': { en: 'No results found', ar: 'لا توجد نتائج' },
  'common.loading': { en: 'Loading...', ar: 'جاري التحميل...' },
  'common.save': { en: 'Save', ar: 'حفظ' },
  'common.cancel': { en: 'Cancel', ar: 'إلغاء' },
  'common.delete': { en: 'Delete', ar: 'حذف' },
  'common.edit': { en: 'Edit', ar: 'تعديل' },
  'common.add': { en: 'Add', ar: 'إضافة' },
  'common.all': { en: 'All', ar: 'الكل' },
  'common.active': { en: 'Active', ar: 'نشط' },
  'common.paused': { en: 'Paused', ar: 'متوقف' },
  'common.status': { en: 'Status', ar: 'الحالة' },

  'campaigns.title': { en: 'Campaigns', ar: 'الحملات' },
  'campaigns.count': { en: 'campaigns', ar: 'حملة' },
  'campaigns.search': { en: 'Search campaigns...', ar: 'البحث في الحملات...' },
  'campaigns.allStatus': { en: 'All Status', ar: 'كل الحالات' },
  'campaigns.allTypes': { en: 'All Types', ar: 'كل الأنواع' },
  'campaigns.campaign': { en: 'Campaign', ar: 'الحملة' },
  'campaigns.budget': { en: 'Budget', ar: 'الميزانية' },
  'campaigns.roas': { en: 'ROAS', ar: 'ROAS' },
  'campaigns.ctr': { en: 'CTR', ar: 'نسبة النقر' },
  'campaigns.impressions': { en: 'Impressions', ar: 'مرات الظهور' },
  'campaigns.noMatch': { en: 'No campaigns match your search', ar: 'لا توجد حملات تطابق البحث' },

  'accounting.title': { en: 'Accounting', ar: 'المحاسبة' },
  'accounting.subtitle': { en: 'Revenue, costs, and profit analysis', ar: 'تحليل الإيرادات والتكاليف والأرباح' },
  'accounting.overview': { en: 'Overview', ar: 'نظرة عامة' },
  'accounting.daily': { en: 'Daily', ar: 'يومي' },
  'accounting.byProduct': { en: 'By Product', ar: 'حسب المنتج' },
  'accounting.revenue': { en: 'Revenue', ar: 'الإيرادات' },
  'accounting.productCost': { en: 'Product Cost', ar: 'تكلفة المنتج' },
  'accounting.netProfit': { en: 'Net Profit', ar: 'صافي الربح' },
  'accounting.margin': { en: 'Margin', ar: 'الهامش' },
  'accounting.aiInsight': { en: 'AI Insight', ar: 'رؤية الذكاء الاصطناعي' },
  'accounting.dailyPerformance': { en: 'Daily Performance', ar: 'الأداء اليومي' },
  'accounting.productProfit': { en: 'Product Profit', ar: 'أرباح المنتجات' },
  'accounting.date': { en: 'Date', ar: 'التاريخ' },

  'alerts.title': { en: 'Alerts', ar: 'التنبيهات' },
  'alerts.unread': { en: 'unread', ar: 'غير مقروءة' },
  'alerts.markAllRead': { en: 'Mark all as read', ar: 'تحديد الكل كمقروء' },
  'alerts.allFilter': { en: 'All', ar: 'الكل' },
  'alerts.unreadFilter': { en: 'Unread', ar: 'غير المقروءة' },
  'alerts.allTypes': { en: 'All Types', ar: 'كل الأنواع' },
  'alerts.critical': { en: 'Critical', ar: 'حرجة' },
  'alerts.warning': { en: 'Warning', ar: 'تحذير' },
  'alerts.good': { en: 'Good', ar: 'جيد' },
  'alerts.noAlerts': { en: 'No Alerts', ar: 'لا توجد تنبيهات' },
  'alerts.allGood': { en: 'All good! Everything is running smoothly', ar: 'كل شيء على ما يرام! الأمور تسير بسلاسة' },

  'reports.title': { en: 'Reports', ar: 'التقارير' },
  'reports.subtitle': { en: 'Performance & spend reports', ar: 'تقارير الأداء والإنفاق' },
  'reports.exportCsv': { en: 'Export CSV', ar: 'تصدير CSV' },
  'reports.dailyToggle': { en: 'Daily', ar: 'يومي' },
  'reports.weeklyToggle': { en: 'Weekly', ar: 'أسبوعي' },
  'reports.monthlyToggle': { en: 'Monthly', ar: 'شهري' },
  'reports.totalSales': { en: 'Total Sales', ar: 'إجمالي المبيعات' },
  'reports.totalSpend': { en: 'Total Spend', ar: 'إجمالي الإنفاق' },
  'reports.avgRoas': { en: 'Avg ROAS', ar: 'متوسط ROAS' },
  'reports.totalOrders': { en: 'Total Orders', ar: 'إجمالي الطلبات' },
  'reports.salesAndSpend': { en: 'Sales & Spend', ar: 'المبيعات والإنفاق' },
  'reports.roasOverTime': { en: 'ROAS Over Time', ar: 'ROAS عبر الزمن' },

  'help.title': { en: 'Help Center', ar: 'مركز المساعدة' },
  'help.subtitle': { en: 'Answers to frequently asked questions', ar: 'إجابات على الأسئلة الشائعة' },
  'help.search': { en: 'Search help articles...', ar: 'البحث في مقالات المساعدة...' },
  'help.noResults': { en: 'No Results Found', ar: 'لا توجد نتائج' },
  'help.tryDifferent': { en: 'Try a different search term...', ar: 'جرب مصطلح بحث مختلف...' },
  'help.notFound': { en: "Didn't find what you're looking for?", ar: 'ما وجدت اللي تبحث عنه؟' },
  'help.chatWithAi': { en: 'Chat with AI Assistant', ar: 'تحدث مع المساعد الذكي' },

  'aiEngine.title': { en: 'AI Engine', ar: 'محرك الذكاء الاصطناعي' },
  'aiEngine.subtitle': { en: 'Intelligent campaign analysis and optimization', ar: 'تحليل وتحسين الحملات الذكي' },
  'aiEngine.analyzeAll': { en: 'Analyze All Campaigns', ar: 'تحليل جميع الحملات' },
  'aiEngine.analyzing': { en: 'Analyzing...', ar: 'جاري التحليل...' },
  'aiEngine.campaignsAnalyzed': { en: 'Campaigns Analyzed', ar: 'حملات تم تحليلها' },
  'aiEngine.criticalAction': { en: 'Critical — Needs Action', ar: 'حرجة — تحتاج إجراء' },
  'aiEngine.readyToScale': { en: 'Ready to Scale', ar: 'جاهزة للتوسع' },
  'aiEngine.applied': { en: 'Applied', ar: 'تم التطبيق' },
  'aiEngine.ruleDecision': { en: 'Rule Decision', ar: 'قرار القاعدة' },
  'aiEngine.gptAnalysis': { en: 'GPT-4o mini Analysis', ar: 'تحليل GPT-4o mini' },
  'aiEngine.markApplied': { en: 'Mark as Applied', ar: 'تحديد كمُطبق' },
  'aiEngine.howItWorks': { en: 'How the Engine Works', ar: 'كيف يعمل المحرك' },
  'aiEngine.step1': { en: 'Calculate Metrics', ar: 'حساب المقاييس' },
  'aiEngine.step2': { en: 'Rule-Based Decision', ar: 'قرار قائم على القواعد' },
  'aiEngine.step3': { en: 'GPT-4o Refinement', ar: 'تحسين بـ GPT-4o' },
  'aiEngine.pause': { en: 'Pause', ar: 'إيقاف' },
  'aiEngine.scaleUp': { en: 'Scale Up', ar: 'توسيع' },
  'aiEngine.decreaseBid': { en: 'Decrease Bid', ar: 'تقليل المزايدة' },
  'aiEngine.addNegative': { en: 'Add Negative', ar: 'إضافة كلمة سلبية' },
  'aiEngine.keep': { en: 'Keep Running', ar: 'استمرار التشغيل' },
  'aiEngine.topPerforming': { en: 'Top Performing Products', ar: 'المنتجات الأفضل أداءً' },
  'aiEngine.needsAttention': { en: 'Needs Attention', ar: 'تحتاج اهتمام' },
  'aiEngine.startAnalysis': { en: 'Start Analysis', ar: 'ابدأ التحليل' },
  'aiEngine.startDesc': { en: 'Click "Analyze All" or press play next to any campaign.', ar: 'انقر "تحليل الكل" أو اضغط تشغيل بجانب أي حملة.' },

  'adGen.title': { en: 'Ad Generator', ar: 'منشئ الإعلانات' },
  'adGen.subtitle': { en: 'AI-powered Amazon ad content generator', ar: 'منشئ محتوى إعلاني مدعوم بالذكاء الاصطناعي' },
  'adGen.productDetails': { en: 'Product Details', ar: 'تفاصيل المنتج' },
  'adGen.productName': { en: 'Product Name *', ar: 'اسم المنتج *' },
  'adGen.category': { en: 'Category (optional)', ar: 'الفئة (اختياري)' },
  'adGen.brand': { en: 'Brand (optional)', ar: 'العلامة التجارية (اختياري)' },
  'adGen.generate': { en: 'Generate Ad Content', ar: 'إنشاء محتوى إعلاني' },
  'adGen.generating': { en: 'Generating...', ar: 'جاري الإنشاء...' },
  'adGen.keywords': { en: 'Keywords', ar: 'الكلمات المفتاحية' },
  'adGen.headlines': { en: 'Headlines', ar: 'العناوين' },
  'adGen.description': { en: 'Description', ar: 'الوصف' },
  'adGen.targeting': { en: 'Targeting', ar: 'الاستهداف' },
  'adGen.namePlaceholder': { en: 'e.g. Wireless Noise-Cancelling Headphones', ar: 'مثال: سماعات لاسلكية عازلة للضوضاء' },

  'news.title': { en: 'Amazon News', ar: 'أخبار أمازون' },
  'news.subtitle': { en: 'Latest updates and changes for sellers', ar: 'آخر التحديثات والتغييرات للبائعين' },
  'news.important': { en: 'Important for Sellers', ar: 'مهم للبائعين' },
  'news.allNews': { en: 'All News', ar: 'كل الأخبار' },
  'news.readMore': { en: 'Read more', ar: 'اقرأ المزيد' },

  'connect.title': { en: 'Amazon Connect', ar: 'ربط أمازون' },
  'connect.subtitle': { en: 'Manage Amazon account connections', ar: 'إدارة اتصالات حسابات أمازون' },
  'connect.connectedStores': { en: 'Connected Stores', ar: 'المتاجر المرتبطة' },
  'connect.connected': { en: 'Connected', ar: 'مرتبط' },
  'connect.lastSync': { en: 'Last sync', ar: 'آخر مزامنة' },
  'connect.autoSync': { en: 'Auto Sync', ar: 'مزامنة تلقائية' },
  'connect.syncNow': { en: 'Sync Now', ar: 'مزامنة الآن' },
  'connect.syncing': { en: 'Syncing...', ar: 'جاري المزامنة...' },
  'connect.security': { en: 'Security & Permissions', ar: 'الأمان والصلاحيات' },
  'connect.readData': { en: 'Read advertising data', ar: 'قراءة بيانات الإعلانات' },
  'connect.manageCampaigns': { en: 'Manage campaigns', ar: 'إدارة الحملات' },
  'connect.accessReports': { en: 'Access reports', ar: 'الوصول للتقارير' },
  'connect.health': { en: 'Health', ar: 'الصحة' },
  'connect.syncHistory': { en: 'Sync History', ar: 'سجل المزامنة' },

  'audit.title': { en: 'Change Log', ar: 'سجل التغييرات' },
  'audit.subtitle': { en: 'All changes made to campaigns and settings', ar: 'جميع التغييرات على الحملات والإعدادات' },
  'audit.action': { en: 'Action', ar: 'الإجراء' },
  'audit.target': { en: 'Target', ar: 'الهدف' },
  'audit.details': { en: 'Details', ar: 'التفاصيل' },
  'audit.reason': { en: 'Reason', ar: 'السبب' },
  'audit.source': { en: 'Source', ar: 'المصدر' },

  'admin.title': { en: 'Admin Dashboard', ar: 'لوحة الإدارة' },
  'admin.userManagement': { en: 'User Management', ar: 'إدارة المستخدمين' },
  'admin.totalUsers': { en: 'Total Users', ar: 'إجمالي المستخدمين' },
  'admin.activeAccounts': { en: 'Active Accounts', ar: 'الحسابات النشطة' },
  'admin.totalCampaigns': { en: 'Total Campaigns', ar: 'إجمالي الحملات' },
  'admin.actionsLogged': { en: 'Actions Logged', ar: 'الإجراءات المسجلة' },
  'admin.search': { en: 'Search email or name...', ar: 'البحث بالبريد أو الاسم...' },
  'admin.allRoles': { en: 'All Roles', ar: 'كل الأدوار' },
  'admin.promote': { en: 'Promote', ar: 'ترقية' },
  'admin.demote': { en: 'Demote', ar: 'تخفيض' },
  'admin.deleteUser': { en: 'Delete user', ar: 'حذف المستخدم' },

  'blacklist.title': { en: 'Blacklist', ar: 'القائمة السوداء' },
  'blacklist.subtitle': { en: 'Excluded products from advertising', ar: 'المنتجات المستبعدة من الإعلانات' },
  'blacklist.addManually': { en: 'Add Manually', ar: 'إضافة يدوية' },
  'blacklist.asinLabel': { en: 'ASIN *', ar: 'ASIN *' },
  'blacklist.nameLabel': { en: 'Product Name *', ar: 'اسم المنتج *' },
  'blacklist.reasonLabel': { en: 'Reason', ar: 'السبب' },
  'blacklist.empty': { en: 'Blacklist is Empty', ar: 'القائمة السوداء فارغة' },
  'blacklist.emptyDesc': { en: 'Exclude products from the Products page to add them here', ar: 'استبعد منتجات من صفحة المنتجات لإضافتها هنا' },

  'layout.appName': { en: 'M20 Autopilot', ar: 'M20 Autopilot' },
  'layout.appSubtitle': { en: 'Amazon Ad Dashboard', ar: 'لوحة إعلانات أمازون' },
  'layout.botMode': { en: 'Bot', ar: 'البوت' },
  'layout.aiAssistantTitle': { en: 'M20 AI Assistant', ar: 'المساعد الذكي M20' },
  'layout.quickSuggest1': { en: 'Analyze top products', ar: 'تحليل أفضل المنتجات' },
  'layout.quickSuggest2': { en: 'Suggest keywords', ar: 'اقتراح كلمات مفتاحية' },
  'layout.quickSuggest3': { en: 'What is a good ACOS?', ar: 'ما هو ACOS الجيد؟' },
};

export function addTranslations(newTranslations: Record<string, Record<string, string>>) {
  for (const [key, value] of Object.entries(newTranslations)) {
    translations[key] = { ...translations[key], ...value };
  }
}

export function addLanguage(config: LangConfig) {
  if (!supportedLanguages.find(l => l.code === config.code)) {
    supportedLanguages.push(config);
  }
}

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
    return translations[key]?.[lang] || translations[key]?.['en'] || key;
  }, [lang]);

  const langConfig = supportedLanguages.find(l => l.code === lang);
  const dir = langConfig?.dir || 'ltr';
  const isRtl = dir === 'rtl';

  return (
    <I18nContext.Provider value={{ lang, setLang, tone, setTone, t, dir, isRtl, automationEnabled, setAutomationEnabled }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
