import { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/lib/i18n';
import Head from 'next/head';

const CONTENT = {
  ar: {
    eyebrow: 'مركز المساعدة',
    title: 'كيف يمكننا مساعدتك؟',
    subtitle: 'ابحث في مئات المقالات أو تصفح الأقسام أدناه',
    searchPh: 'ابحث في المساعدة...',
    navTitle: 'الأقسام',
    sections: [
      {
        id: 'start', nav: 'البداية السريعة', icon: '🚀',
        title: 'البداية السريعة', desc: 'كل ما تحتاجه للبدء مع M20 Autopilot',
        items: [
          { title: 'ربط حساب أمازون Seller Central', body: 'اذهب إلى صفحة Amazon Connect، اضغط "ربط الحساب"، وسيتم توجيهك لتسجيل الدخول إلى أمازون. بعد المصادقة، ستُضاف بيانات اعتمادك بأمان.' },
          { title: 'استيراد حملاتك الإعلانية', body: 'بعد ربط الحساب، اضغط "مزامنة الآن" في لوحة التحكم. تستغرق المزامنة الأولى من 2 إلى 5 دقائق حسب عدد حملاتك.' },
          { title: 'إعداد أهداف ACOS', body: 'في صفحة الإعدادات، حدد ACOS المستهدف لكل حملة. سيستخدم الذكاء الاصطناعي هذا الهدف لتحسين عروض الأسعار تلقائياً.' },
          { title: 'تفعيل وضع الأتمتة', body: 'تتوفر ثلاثة أوضاع: آمن (توصيات فقط)، شبه تلقائي (موافقة قبل التطبيق)، تلقائي كامل. يُنصح بالبدء بالوضع الآمن.' },
        ],
      },
      {
        id: 'campaigns', nav: 'إدارة الحملات', icon: '📊',
        title: 'إدارة الحملات', desc: 'تحكم كامل بحملاتك الإعلانية',
        items: [
          { title: 'قراءة مؤشرات الأداء (KPIs)', body: 'تعرض لوحة التحكم: CTR، CPC، ACOS، ROAS، والإنفاق اليومي. الأخضر يعني الأداء ضمن الهدف، والأحمر يعني تجاوز العتبة.' },
          { title: 'إيقاف الحملات الضعيفة تلقائياً', body: 'في حال تجاوز ACOS نسبة 60%، أو 15 نقرة بدون طلبات، يقوم النظام بإيقاف الحملة تلقائياً وتسجيل السبب.' },
          { title: 'جدولة الميزانية (Dayparting)', body: 'يحلل النظام أداء كل ساعة ويرفع الميزانية 30% في أفضل الساعات، ويخفضها 40% في أسوأها.' },
          { title: 'تصدير تقارير الحملات', body: 'من صفحة التقارير، اختر نطاق التاريخ والحملات المطلوبة واضغط "تصدير CSV".' },
        ],
      },
      {
        id: 'keywords', nav: 'الكلمات المفتاحية', icon: '🔑',
        title: 'تحليل الكلمات المفتاحية', desc: 'ذكاء اصطناعي يحلل كل كلمة مفتاحية',
        items: [
          { title: 'حصاد عبارات البحث', body: 'يراقب النظام حملات Auto ويحصد العبارات التي حققت 3+ طلبات بـ ACOS ≤ 25% وينقلها كـ EXACT keyword للحملات اليدوية.' },
          { title: 'الكلمات السلبية التلقائية', body: 'أي كلمة سجّلت 12 نقرة بدون طلبات تُضاف تلقائياً كـ Negative Keyword لتوفير الميزانية.' },
          { title: 'تعديل عروض الأسعار', body: 'ACOS < 15% → رفع العرض 20%. ACOS مرتفع → تخفيض للهدف. ACOS > 60% → إيقاف الكلمة.' },
          { title: 'قائمة الحظر (Blacklist)', body: 'من صفحة القائمة السوداء، أضف أي كلمة تريد استبعادها نهائياً من جميع حملاتك.' },
        ],
      },
      {
        id: 'ai', nav: 'محرك الذكاء الاصطناعي', icon: '🧠',
        title: 'محرك الذكاء الاصطناعي', desc: 'GPT-4o mini لتحليل متقدم وتوليد محتوى إعلاني',
        items: [
          { title: 'تحليل الحملات بالذكاء الاصطناعي', body: 'في صفحة AI Engine، اكتب سؤالك أو اطلب تحليلاً لأي حملة. يعيد النظام رداً منظماً: ملخص، تحليل، توصيات، ملاحظات.' },
          { title: 'توليد نصوص إعلانية', body: 'في Ad Generator، أدخل اسم المنتج والمزايا والكلمات المستهدفة. يولد النظام عنوان + وصف محسّن لأمازون.' },
          { title: 'حدود الاستفسارات الشهرية', body: 'الخطة المجانية: 20 استفساراً/شهر. Pro: 500. Enterprise: غير محدود. يُعاد العداد في بداية كل دورة فوترة.' },
          { title: 'التعلم التكيّفي', body: 'يسجّل النظام كل قرار ويقيّمه بعد 7 أيام. إذا كان صحيحاً، يضبط العتبات تلقائياً لتحسين مستمر.' },
        ],
      },
      {
        id: 'billing', nav: 'الفوترة والاشتراك', icon: '💳',
        title: 'الفوترة والاشتراك', desc: 'إدارة خطتك ومدفوعاتك',
        items: [
          { title: 'الترقية لخطة Pro أو Enterprise', body: 'من صفحة الاشتراكات، اضغط "الترقية الآن". ستُحوَّل لـ Stripe Checkout لإتمام الدفع بأمان. يُفعَّل الاشتراك فوراً.' },
          { title: 'إدارة الفاتورة وإلغاء الاشتراك', body: 'اضغط "إدارة الفاتورة" من صفحة الاشتراكات للوصول لبوابة Stripe: تعديل بيانات الدفع، إلغاء الاشتراك، وعرض الفواتير السابقة.' },
          { title: 'العملة والأسعار', body: 'جميع الأسعار بالريال السعودي (SAR). Pro: 49 ريال/شهر. Enterprise: 199 ريال/شهر.' },
          { title: 'ماذا يحدث عند انتهاء الاشتراك؟', body: 'تعود حسابك للخطة المجانية تلقائياً. تُحفظ بياناتك كاملةً لمدة 30 يوماً.' },
        ],
      },
    ],
  },
  en: {
    eyebrow: 'Help Center',
    title: 'How can we help you?',
    subtitle: 'Search hundreds of articles or browse sections below',
    searchPh: 'Search help...',
    navTitle: 'Sections',
    sections: [
      {
        id: 'start', nav: 'Quick Start', icon: '🚀',
        title: 'Quick Start', desc: 'Everything you need to get started with M20 Autopilot',
        items: [
          { title: 'Connect your Amazon Seller Central', body: 'Go to the Amazon Connect page, click "Connect Account", and you will be redirected to log in to Amazon. After authentication, your credentials are stored securely.' },
          { title: 'Import your ad campaigns', body: 'After connecting, click "Sync Now" on the dashboard. The first sync takes 2–5 minutes depending on how many campaigns you have.' },
          { title: 'Set ACOS targets', body: 'In Settings, define a target ACOS per campaign. The AI will use this target to auto-optimize bids.' },
          { title: 'Enable automation mode', body: 'Three modes: Safe (recommendations only), Semi-Auto (approve before applying), Full Auto (runs without intervention). We recommend starting with Safe mode.' },
        ],
      },
      {
        id: 'campaigns', nav: 'Campaign Management', icon: '📊',
        title: 'Campaign Management', desc: 'Full control over your advertising campaigns',
        items: [
          { title: 'Reading KPIs', body: 'The dashboard shows CTR, CPC, ACOS, ROAS, and daily spend. Green = on-target, red = threshold exceeded.' },
          { title: 'Auto-pause underperforming campaigns', body: 'If ACOS exceeds 60%, or 15 clicks with no orders occur, the system pauses the campaign automatically and logs the reason.' },
          { title: 'Budget scheduling (Dayparting)', body: 'The system analyzes hourly performance and raises the budget +30% in peak hours while cutting it -40% in the worst hours.' },
          { title: 'Export campaign reports', body: 'From the Reports page, choose a date range and campaigns, then click "Export CSV".' },
        ],
      },
      {
        id: 'keywords', nav: 'Keywords', icon: '🔑',
        title: 'Keyword Intelligence', desc: 'AI that analyzes every keyword for you',
        items: [
          { title: 'Search term harvesting', body: 'The system monitors Auto campaigns and harvests search terms with 3+ orders and ACOS ≤ 25%, adding them as EXACT keywords to Manual campaigns.' },
          { title: 'Automatic negative keywords', body: 'Any keyword with 12 clicks and no orders is automatically added as a Negative Keyword to save budget.' },
          { title: 'Bid adjustments', body: 'ACOS < 15% → raise bid 20%. High ACOS → reduce to target. ACOS > 60% → pause keyword.' },
          { title: 'Blacklist', body: 'From the Blacklist page, add any keyword you want permanently excluded from all campaigns.' },
        ],
      },
      {
        id: 'ai', nav: 'AI Engine', icon: '🧠',
        title: 'AI Engine', desc: 'GPT-4o mini for advanced analysis and ad content generation',
        items: [
          { title: 'AI campaign analysis', body: 'On the AI Engine page, type a question or request an analysis. The system returns: Summary, Analysis, Recommendations, Notes.' },
          { title: 'Ad copy generation', body: 'In Ad Generator, enter the product name, features, and target keywords. The system generates an optimized Amazon title + description.' },
          { title: 'Monthly query limits', body: 'Free: 20 queries/month. Pro: 500. Enterprise: unlimited. Counter resets at the start of each billing cycle.' },
          { title: 'Adaptive learning', body: 'The system logs every decision and evaluates it after 7 days, auto-adjusting thresholds for continuous improvement.' },
        ],
      },
      {
        id: 'billing', nav: 'Billing & Subscription', icon: '💳',
        title: 'Billing & Subscription', desc: 'Manage your plan and payments',
        items: [
          { title: 'Upgrade to Pro or Enterprise', body: 'From the Subscriptions page, click "Upgrade Now". You will be redirected to Stripe Checkout for secure payment. The subscription activates immediately.' },
          { title: 'Manage billing and cancel', body: 'Click "Manage Billing" from the Subscriptions page to access the Stripe portal: update payment details, cancel, and view past invoices.' },
          { title: 'Currency and pricing', body: 'All prices in SAR. Pro: 49 SAR/month. Enterprise: 199 SAR/month.' },
          { title: 'What happens when a subscription ends?', body: 'Your account reverts to the Free plan. Your data is preserved for 30 days.' },
        ],
      },
    ],
  },
};

export default function Help() {
  const { lang: appLang } = useI18n();
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [search, setSearch] = useState('');
  const [active, setActive] = useState('start');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => { setLang(appLang === 'ar' ? 'ar' : 'en'); }, [appLang]);

  const tx = CONTENT[lang];
  const isAr = lang === 'ar';

  const filtered = tx.sections.map(s => ({
    ...s,
    items: s.items.filter(it =>
      !search ||
      it.title.toLowerCase().includes(search.toLowerCase()) ||
      it.body.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(s => s.items.length > 0);

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(id);
  };

  return (
    <>
      <Head><title>{tx.eyebrow} — M20 Autopilot</title></Head>
      <style>{`
        .hc-wrap{color:#dbeafe;font-family:'Segoe UI',system-ui,sans-serif;line-height:1.9;position:relative;}
        .hc-orb{position:fixed;border-radius:50%;filter:blur(90px);opacity:.18;pointer-events:none;z-index:0;}
        .hc-orb1{width:500px;height:500px;background:radial-gradient(circle,#22D3EE,transparent 70%);top:-160px;right:-120px;animation:hcF1 16s ease-in-out infinite;}
        .hc-orb2{width:440px;height:440px;background:radial-gradient(circle,#38BDF8,transparent 70%);bottom:-140px;left:-120px;animation:hcF2 20s ease-in-out infinite;}
        @keyframes hcF1{50%{transform:translate(-40px,60px)}}
        @keyframes hcF2{50%{transform:translate(50px,-50px)}}
        .hc-grid{position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(56,189,248,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,.04) 1px,transparent 1px);background-size:46px 46px;mask:radial-gradient(circle at 50% 0%,#000 30%,transparent 80%);}
        .hc-inner{position:relative;z-index:2;}
        .hc-hero{padding:50px 26px 36px;text-align:center;}
        .hc-eyebrow{display:inline-block;font-size:12px;letter-spacing:3px;color:#22D3EE;border:1px solid rgba(56,189,248,.18);padding:7px 20px;border-radius:30px;background:rgba(34,211,238,.06);margin-bottom:16px;font-weight:700;}
        .hc-title{font-size:clamp(26px,5vw,48px);font-weight:700;line-height:1.25;background:linear-gradient(120deg,#fff 30%,#7dd3fc);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:12px;}
        .hc-subtitle{color:#7b93b8;max-width:540px;margin:0 auto;font-size:clamp(14px,2vw,16px);}
        .hc-search-wrap{max-width:500px;margin:24px auto 0;position:relative;}
        .hc-search-wrap input{width:100%;padding:14px 50px 14px 20px;border-radius:14px;border:1px solid rgba(56,189,248,.18);background:rgba(14,24,48,.55);color:#dbeafe;font-size:15px;font-family:inherit;outline:none;transition:.25s;backdrop-filter:blur(10px);box-sizing:border-box;}
        .hc-search-wrap input:focus{border-color:#22D3EE;box-shadow:0 0 0 4px rgba(34,211,238,.12);}
        .hc-search-wrap input::placeholder{color:#7b93b8;}
        .hc-search-ico{position:absolute;top:50%;right:18px;transform:translateY(-50%);color:#22D3EE;pointer-events:none;}
        [dir="rtl"] .hc-search-wrap input{padding:14px 20px 14px 50px;}
        [dir="rtl"] .hc-search-ico{right:auto;left:18px;}
        .hc-layout{display:grid;grid-template-columns:252px 1fr;gap:32px;max-width:1160px;margin:0 auto;padding:20px 26px 80px;align-items:start;}
        .hc-side{position:sticky;top:20px;background:rgba(14,24,48,.55);border:1px solid rgba(56,189,248,.18);border-radius:18px;padding:18px;backdrop-filter:blur(14px);}
        .hc-side h4{font-size:11px;letter-spacing:2px;color:#22D3EE;text-transform:uppercase;font-weight:700;margin:10px 6px 6px;}
        .hc-side h4:first-of-type{margin-top:0;}
        .hc-side-link{display:block;padding:9px 12px;border-radius:10px;font-size:14px;color:#7b93b8;transition:.2s;cursor:pointer;border:none;background:none;text-align:inherit;width:100%;font-family:inherit;}
        .hc-side-link:hover{background:rgba(34,211,238,.08);color:#e0f2fe;}
        .hc-side-link.active{background:rgba(34,211,238,.12);color:#22D3EE;font-weight:600;}
        .hc-lang{display:flex;gap:5px;background:rgba(56,189,248,.06);border:1px solid rgba(56,189,248,.18);border-radius:30px;padding:4px;margin-bottom:14px;}
        .hc-lang button{flex:1;border:none;cursor:pointer;font-weight:700;font-size:13px;padding:7px 0;border-radius:24px;background:transparent;color:#7b93b8;transition:.2s;font-family:inherit;}
        .hc-lang button.act{background:linear-gradient(90deg,#38BDF8,#22D3EE);color:#04121f;}
        .hc-content{display:flex;flex-direction:column;gap:22px;}
        .hc-card{background:rgba(14,24,48,.55);border:1px solid rgba(56,189,248,.18);border-radius:18px;padding:28px 30px;backdrop-filter:blur(12px);position:relative;overflow:hidden;}
        .hc-card::before{content:"";position:absolute;top:0;right:0;width:120px;height:120px;background:radial-gradient(circle at top right,rgba(34,211,238,.1),transparent 70%);pointer-events:none;}
        .hc-card-head{display:flex;align-items:center;gap:12px;margin-bottom:6px;}
        .hc-card-head .em{font-size:26px;}
        .hc-card h2{font-size:clamp(18px,2.5vw,24px);font-weight:700;color:#f0f9ff;}
        .hc-card-desc{color:#7b93b8;font-size:14px;margin-bottom:18px;}
        .hc-items{display:grid;gap:12px;}
        .hc-item{padding:16px 18px;border:1px solid rgba(56,189,248,.18);border-radius:12px;background:rgba(56,189,248,.03);}
        .hc-item h3{font-size:15px;font-weight:600;color:#e0f2fe;margin-bottom:5px;}
        .hc-item p{font-size:14px;color:#b8cce8;line-height:1.7;}
        .hc-support{display:flex;align-items:center;gap:14px;margin-top:10px;padding:16px 18px;border:1px solid rgba(56,189,248,.18);border-radius:12px;background:linear-gradient(120deg,rgba(34,211,238,.08),rgba(56,189,248,.03));}
        .hc-support .mail{font-weight:700;font-size:16px;color:#22D3EE;}
        .hc-empty{text-align:center;padding:60px 20px;color:#7b93b8;}
        @media(max-width:860px){.hc-layout{grid-template-columns:1fr;}.hc-side{position:static;}}
      `}</style>

      <div className="hc-wrap" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="hc-orb hc-orb1" />
        <div className="hc-orb hc-orb2" />
        <div className="hc-grid" />
        <div className="hc-inner">
          <div className="hc-hero">
            <div className="hc-eyebrow">{tx.eyebrow}</div>
            <h1 className="hc-title">{tx.title}</h1>
            <p className="hc-subtitle">{tx.subtitle}</p>
            <div className="hc-search-wrap">
              <input type="text" placeholder={tx.searchPh} value={search} onChange={e => setSearch(e.target.value)} />
              <span className="hc-search-ico">🔍</span>
            </div>
          </div>

          <div className="hc-layout">
            <aside className="hc-side">
              <div className="hc-lang">
                <button className={lang === 'ar' ? 'act' : ''} onClick={() => setLang('ar')}>العربية</button>
                <button className={lang === 'en' ? 'act' : ''} onClick={() => setLang('en')}>English</button>
              </div>
              <h4>{tx.navTitle}</h4>
              {tx.sections.map(s => (
                <button key={s.id} className={`hc-side-link${active === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>
                  {s.icon} {s.nav}
                </button>
              ))}
            </aside>

            <div className="hc-content">
              {filtered.length === 0 ? (
                <div className="hc-empty">
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                  <p style={{ fontSize: 16, color: '#e0f2fe', fontWeight: 600 }}>{isAr ? 'لا توجد نتائج' : 'No results found'}</p>
                  <p style={{ fontSize: 14, marginTop: 6 }}>{isAr ? 'جرّب كلمات مختلفة' : 'Try different keywords'}</p>
                </div>
              ) : filtered.map(section => (
                <div key={section.id} className="hc-card" ref={el => { sectionRefs.current[section.id] = el; }}>
                  <div className="hc-card-head">
                    <span className="em">{section.icon}</span>
                    <h2>{section.title}</h2>
                  </div>
                  <p className="hc-card-desc">{section.desc}</p>
                  <div className="hc-items">
                    {section.items.map((item, i) => (
                      <div key={i} className="hc-item">
                        <h3>{item.title}</h3>
                        <p>{item.body}</p>
                      </div>
                    ))}
                  </div>
                  {section.id === 'billing' && (
                    <div className="hc-support">
                      <div>
                        <p style={{ fontSize: 13, color: '#b8cce8', marginBottom: 3 }}>{isAr ? 'تواصل مع الدعم' : 'Contact Support'}</p>
                        <span className="mail">support@m20autopilot.com</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
