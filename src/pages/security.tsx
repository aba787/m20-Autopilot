import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const SECURITY_EMAIL = 'security@m20autopilot.com';
const SUPPORT_EMAIL = 'support@m20autopilot.com';
const UPDATED_DATE = 'June 2026';

type Section = { h: string; p: string };
type Group = { label: string; sections: Section[] };

const enGroups: Group[] = [
  {
    label: 'Protection & Infrastructure',
    sections: [
      {
        h: 'Data Encryption',
        p: 'All your data is encrypted in transit using TLS 1.3 and encrypted at rest using AES-256. Your campaign metrics and advertising data are never stored in plain text, whether moving between systems or sitting in our databases.',
      },
      {
        h: 'Amazon Account Access',
        p: 'We connect to your Amazon account through the official Amazon SP-API using secure OAuth. We never see or store your Amazon password, and you can revoke our access at any time directly from your Amazon account.',
      },
      {
        h: 'Access Controls',
        p: 'We apply strict role-based access and least-privilege permissions. Multi-factor authentication is mandatory for every internal system that touches your data, so only authorized people can access what they truly need.',
      },
      {
        h: 'Secure Infrastructure',
        p: 'Our platform runs on hardened cloud infrastructure with isolated environments, automated security patching, and continuous intrusion monitoring across every region we operate in.',
      },
      {
        h: 'Continuous Monitoring',
        p: 'We use real-time logging, anomaly detection, and automated alerts to identify and respond to suspicious activity quickly, often before it can become a problem.',
      },
      {
        h: 'Session & Token Security',
        p: 'User sessions expire after 24 hours of inactivity and require re-authentication. Amazon OAuth tokens are rotated automatically before expiry. All refresh tokens are stored encrypted and are invalidated immediately upon account disconnection or deletion.',
      },
      {
        h: 'Penetration Testing',
        p: 'We conduct structured security assessments every 6 months, covering API endpoints, authentication flows, and data access paths. Critical findings are remediated within 72 hours and high-severity findings within 14 days. Results are reviewed by the Security Owner.',
      },
    ],
  },
  {
    label: 'Data & Privacy',
    sections: [
      {
        h: 'Data Isolation & AI Privacy',
        p: "Every seller's data is logically isolated using row-level security. Your advertising data is never mixed with another customer's data, and it is never used to train AI models that benefit other sellers. When AI features process your data, only the minimum required context is sent to our AI provider.",
      },
      {
        h: 'Third-party Subprocessors',
        p: 'We work with a limited set of vetted subprocessors to deliver the service: Supabase (database & authentication — EU/US infrastructure), OpenAI (AI features — data is not used for model training), and Resend (transactional email). All subprocessors are bound by data processing agreements and may not use your data for any other purpose.',
      },
      {
        h: 'Data Residency',
        p: 'Your data is stored on Supabase-managed PostgreSQL databases hosted on AWS infrastructure. Primary storage is in the US East region. If your business requires a specific data residency region, contact us at the support email and we will advise on available options.',
      },
      {
        h: 'Cookies & Local Storage',
        p: 'We use browser local storage solely to maintain your session, remember your language and theme preferences, and store your chatbot conversation history (up to 24 messages). We do not use third-party advertising cookies or tracking pixels. You can clear all stored data at any time through your browser settings — this will sign you out of the platform.',
      },
    ],
  },
  {
    label: 'Your Rights',
    sections: [
      {
        h: 'Data Export',
        p: 'You have the right to a full export of your data at any time. To request your export, go to Settings → Account → Export My Data, or email us at the support address below. Exports are delivered as a structured JSON file within 7 business days and include your profile, campaign data, AI query history, and audit logs.',
      },
      {
        h: 'Account & Data Deletion',
        p: 'You may permanently delete your account and all associated data at any time from Settings → Danger Zone → Delete Account. Once confirmed, your personal data, campaign data, Amazon connection, and AI history are permanently erased within 30 days. Anonymized aggregate statistics (no personally identifiable information) may be retained for internal analytics. To request deletion by email, write to the support address below.',
      },
      {
        h: 'Your Control Over Your Data',
        p: "You stay in charge at all times. You can connect securely through Amazon's official OAuth flow, grant only the permissions the AI agent needs, disconnect M20 from your Amazon account at any time, export your full data on request, and request permanent account deletion whenever you wish. All these actions are available from your account settings without needing to contact us.",
      },
    ],
  },
  {
    label: 'Compliance & Disclosure',
    sections: [
      {
        h: 'Breach Notification',
        p: 'In the unlikely event of a data breach that affects your personal or advertising data, we will notify you by email within 72 hours of confirmed discovery — in line with GDPR requirements. The notification will describe what data was affected, what steps we have taken, and what actions (if any) you should take. We will also notify the relevant supervisory authorities as required by law.',
      },
      {
        h: 'Compliance & Standards',
        p: 'Our controls are aligned with SOC 2 Type II practices, and we honor data protection rights under GDPR and CCPA. Our Amazon integration is a certified SP-API integration. All traffic is encrypted with TLS 1.3, and we undergo a structured security review every 6 months.',
      },
      {
        h: 'Reporting a Security Issue',
        p: `If you discover a potential security issue, please email our security team at ${SECURITY_EMAIL}. We review every report, acknowledge receipt within 24 hours, and respond with our assessment within 5 business days. We are committed to responsible disclosure and will not pursue legal action against good-faith security researchers.`,
      },
    ],
  },
];

const arGroups: Group[] = [
  {
    label: 'الحماية والبنية التحتية',
    sections: [
      {
        h: 'تشفير البيانات',
        p: 'تُشفَّر جميع بياناتك أثناء النقل باستخدام TLS 1.3 وتُشفَّر أثناء التخزين باستخدام AES-256. لا تُخزَّن مؤشرات حملاتك وبيانات إعلاناتك كنص واضح أبداً، سواء أثناء انتقالها بين الأنظمة أو أثناء وجودها في قواعد بياناتنا.',
      },
      {
        h: 'الوصول إلى حساب أمازون',
        p: 'نتصل بحساب أمازون الخاص بك عبر واجهة SP-API الرسمية باستخدام OAuth الآمن. لا نرى أو نخزّن كلمة مرور أمازون الخاصة بك أبداً، ويمكنك إلغاء وصولنا في أي وقت مباشرةً من حساب أمازون.',
      },
      {
        h: 'ضوابط الوصول',
        p: 'نطبّق وصولاً صارماً قائماً على الأدوار وصلاحيات بأقل امتياز ممكن. المصادقة متعددة العوامل إلزامية لكل نظام داخلي يتعامل مع بياناتك، بحيث لا يصل إليها إلا الأشخاص المصرّح لهم فعلاً.',
      },
      {
        h: 'بنية تحتية آمنة',
        p: 'تعمل منصتنا على بنية سحابية محصّنة مع بيئات معزولة وتحديثات أمنية تلقائية ومراقبة مستمرة للاختراق في كل منطقة نعمل فيها.',
      },
      {
        h: 'مراقبة مستمرة',
        p: 'نستخدم تسجيلاً لحظياً واكتشافاً للشذوذ وتنبيهات تلقائية لرصد النشاط المشبوه والاستجابة له بسرعة، غالباً قبل أن يتحوّل إلى مشكلة.',
      },
      {
        h: 'أمان الجلسات والرموز',
        p: 'تنتهي صلاحية جلسات المستخدمين بعد 24 ساعة من الخمول وتتطلب إعادة المصادقة. تُجدَّد رموز Amazon OAuth تلقائياً قبل انتهاء صلاحيتها. جميع رموز التحديث مُخزَّنة بصورة مشفّرة وتُلغى فوراً عند فصل الحساب أو حذفه.',
      },
      {
        h: 'اختبارات الاختراق الدورية',
        p: 'نُجري تقييمات أمنية منظمة كل 6 أشهر تشمل نقاط API وتدفقات المصادقة ومسارات الوصول إلى البيانات. تُعالَج النتائج الحرجة خلال 72 ساعة والنتائج عالية الخطورة خلال 14 يوماً، وتُراجع النتائج من قِبل مسؤول الأمان.',
      },
    ],
  },
  {
    label: 'البيانات والخصوصية',
    sections: [
      {
        h: 'عزل البيانات وخصوصية الذكاء الاصطناعي',
        p: 'بيانات كل بائع معزولة منطقياً عبر أمان على مستوى الصف. لا تُخلط بياناتك الإعلانية مع بيانات عميل آخر أبداً، ولا تُستخدم لتدريب نماذج ذكاء اصطناعي تفيد بائعين آخرين. عند معالجة ميزات الذكاء الاصطناعي لبياناتك، لا يُرسَل إلى مزوّد الذكاء الاصطناعي إلا الحد الأدنى من السياق المطلوب.',
      },
      {
        h: 'مزودو الخدمة الخارجيون',
        p: 'نعمل مع مجموعة محدودة من مزودي الخدمة الموثوقين لتقديم المنصة: Supabase (قاعدة البيانات والمصادقة — بنية تحتية في الاتحاد الأوروبي والولايات المتحدة)، وOpenAI (ميزات الذكاء الاصطناعي — لا تُستخدم البيانات لتدريب النماذج)، وResend (البريد الإلكتروني التشغيلي). جميع مزودي الخدمة مُلزَمون باتفاقيات معالجة البيانات ولا يحق لهم استخدام بياناتك لأي غرض آخر.',
      },
      {
        h: 'موقع تخزين البيانات',
        p: 'تُخزَّن بياناتك في قواعد بيانات PostgreSQL المُدارة عبر Supabase على بنية AWS التحتية. التخزين الأساسي في منطقة US East. إذا كان عملك يتطلب منطقة جغرافية محددة لتخزين البيانات، تواصل معنا على بريد الدعم وسنرشدك إلى الخيارات المتاحة.',
      },
      {
        h: 'ملفات الارتباط والتخزين المحلي',
        p: 'نستخدم التخزين المحلي في المتصفح حصراً للحفاظ على جلستك وتذكر تفضيلات اللغة والمظهر وحفظ محادثات الشات (حتى 24 رسالة). لا نستخدم ملفات تعريف ارتباط إعلانية من أطراف ثالثة أو بيكسلات تتبع. يمكنك مسح جميع البيانات المُخزَّنة في أي وقت من إعدادات المتصفح — سيؤدي ذلك إلى تسجيل خروجك من المنصة.',
      },
    ],
  },
  {
    label: 'حقوقك',
    sections: [
      {
        h: 'تصدير البيانات',
        p: `يحق لك تصدير كامل بياناتك في أي وقت. لطلب التصدير، انتقل إلى الإعدادات ← الحساب ← تصدير بياناتي، أو راسلنا على بريد الدعم أدناه. تُسلَّم الصادرات كملف JSON منظَّم خلال 7 أيام عمل وتشمل ملفك الشخصي وبيانات الحملات وسجل استفسارات الذكاء الاصطناعي وسجلات التدقيق.`,
      },
      {
        h: 'حذف الحساب والبيانات',
        p: 'يمكنك حذف حسابك وجميع بياناتك المرتبطة به بشكل دائم في أي وقت من الإعدادات ← منطقة الخطر ← حذف الحساب. بعد التأكيد، تُمحى بياناتك الشخصية وبيانات الحملات وربط أمازون وسجل الذكاء الاصطناعي نهائياً خلال 30 يوماً. قد تُحتفظ إحصاءات إجمالية مجهولة الهوية (لا تتضمن أي معلومات تعريفية) للتحليل الداخلي. لطلب الحذف عبر البريد الإلكتروني، راسلنا على عنوان الدعم أدناه.',
      },
      {
        h: 'تحكّمك الكامل في بياناتك',
        p: 'تبقى أنت المتحكم في كل الأوقات. يمكنك الاتصال بأمان عبر التدفق الرسمي لأمازون، ومنح الصلاحيات التي يحتاجها وكيل الذكاء الاصطناعي فقط، وفصل M20 عن حسابك في أي وقت، وتصدير بياناتك الكاملة عند الطلب، وطلب حذف الحساب نهائياً متى شئت. جميع هذه الإجراءات متاحة من إعدادات حسابك دون الحاجة للتواصل معنا.',
      },
    ],
  },
  {
    label: 'الامتثال والإفصاح',
    sections: [
      {
        h: 'إشعار الاختراق',
        p: 'في الحالة غير المرجوة لاختراق أمني يؤثر على بياناتك الشخصية أو الإعلانية، سنبلّغك عبر البريد الإلكتروني خلال 72 ساعة من تأكيد الاكتشاف — امتثالاً لمتطلبات GDPR. سيتضمن الإشعار وصفاً للبيانات المتأثرة والإجراءات التي اتخذناها وما قد تحتاج إلى فعله. وسنبلّغ أيضاً الجهات الرقابية المختصة وفقاً للقانون.',
      },
      {
        h: 'الامتثال والمعايير',
        p: 'تتوافق ضوابطنا مع ممارسات SOC 2 Type II، ونحترم حقوق حماية البيانات بموجب GDPR وCCPA. تكاملنا مع أمازون هو تكامل معتمد عبر SP-API. جميع البيانات مشفّرة باستخدام TLS 1.3، ونخضع لمراجعة أمنية منظّمة كل 6 أشهر.',
      },
      {
        h: 'الإبلاغ عن مشكلة أمنية',
        p: `إذا اكتشفت مشكلة أمنية محتملة، يُرجى مراسلة فريق الأمان لدينا على ${SECURITY_EMAIL}. نراجع كل بلاغ ونؤكد استلامه خلال 24 ساعة ونردّ بتقييمنا خلال 5 أيام عمل. نلتزم بالإفصاح المسؤول ولن نتخذ إجراءات قانونية ضد باحثي الأمان الذين يتصرفون بحسن نية.`,
      },
    ],
  },
];

const highlights = [
  { en: 'TLS 1.3 Encryption', ar: 'تشفير TLS 1.3', icon: '🔒' },
  { en: 'AES-256 at Rest', ar: 'AES-256 في التخزين', icon: '🛡️' },
  { en: 'SOC 2 Aligned', ar: 'متوافق مع SOC 2', icon: '✅' },
  { en: 'Zero-Knowledge OAuth', ar: 'OAuth بدون كلمة مرور', icon: '🔑' },
  { en: 'Breach Notice < 72h', ar: 'إشعار اختراق < 72 ساعة', icon: '🔔' },
  { en: 'Data Deletion in 30d', ar: 'حذف البيانات خلال 30 يوم', icon: '🗑️' },
  { en: 'Pen Tested Biannually', ar: 'اختبار اختراق كل 6 أشهر', icon: '🔍' },
  { en: '3 Vetted Subprocessors', ar: '3 مزودين موثوقين فقط', icon: '🤝' },
];

const enMeta = {
  eyebrow: 'Security & Privacy',
  title: 'Security & Privacy at M20 Autopilot',
  updated: `Last updated: ${UPDATED_DATE}`,
  intro:
    'M20 Autopilot is built on a security-first foundation. We protect your Amazon advertising data, account access, and business metrics with strong encryption, strict access controls, and continuous monitoring. This page explains exactly how we keep your data safe, what rights you have over it, and how we respond when things go wrong.',
  contactLabel: 'Security team',
  supportLabel: 'Support',
  nav: { privacy: 'Privacy Policy', terms: 'Terms of Service' },
  langToggle: 'العربية',
  copyright: `© ${new Date().getFullYear()} M20 Autopilot. All rights reserved.`,
};

const arMeta = {
  eyebrow: 'الأمان والخصوصية',
  title: 'الأمان والخصوصية في M20 Autopilot',
  updated: `آخر تحديث: يونيو 2026`,
  intro:
    'تم بناء M20 Autopilot على أساس يضع الأمان أولاً. نحمي بيانات إعلاناتك على أمازون والوصول إلى حسابك ومؤشرات أعمالك بتشفير قوي وضوابط وصول صارمة ومراقبة مستمرة. توضّح هذه الصفحة بالتفصيل كيف نحافظ على أمان بياناتك، وما هي حقوقك عليها، وكيف نتصرف عند حدوث أي طارئ.',
  contactLabel: 'فريق الأمان',
  supportLabel: 'الدعم',
  nav: { privacy: 'سياسة الخصوصية', terms: 'شروط الخدمة' },
  langToggle: 'English',
  copyright: `© ${new Date().getFullYear()} M20 Autopilot. جميع الحقوق محفوظة.`,
};

const GROUP_COLORS: Record<number, string> = {
  0: 'rgba(0,217,255,0.08)',
  1: 'rgba(124,58,237,0.08)',
  2: 'rgba(34,197,94,0.08)',
  3: 'rgba(249,115,22,0.08)',
};
const GROUP_BORDER: Record<number, string> = {
  0: 'rgba(0,217,255,0.2)',
  1: 'rgba(124,58,237,0.2)',
  2: 'rgba(34,197,94,0.2)',
  3: 'rgba(249,115,22,0.2)',
};
const GROUP_TEXT: Record<number, string> = {
  0: '#00d9ff',
  1: '#a78bfa',
  2: '#4ade80',
  3: '#fb923c',
};

export default function SecurityPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const isAr = lang === 'ar';
  const meta = isAr ? arMeta : enMeta;
  const groups = isAr ? arGroups : enGroups;

  return (
    <>
      <Head>
        <title>Security &amp; Privacy — M20 Autopilot</title>
        <meta
          name="description"
          content="Security and privacy practices at M20 Autopilot — encryption, data deletion, breach notification, subprocessors, and your rights over your data."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <div
        dir={isAr ? 'rtl' : 'ltr'}
        style={{
          minHeight: '100vh',
          background: '#0a0612',
          color: '#e5e7eb',
          fontFamily: isAr
            ? "'Noto Kufi Arabic', 'Tajawal', system-ui, sans-serif"
            : "system-ui, -apple-system, 'Segoe UI', sans-serif",
        }}
      >
        <header
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(0,217,255,0.15)',
            background: 'rgba(10,6,18,0.85)',
            backdropFilter: 'blur(8px)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div
            style={{
              maxWidth: 960,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 700,
                letterSpacing: '0.02em',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #00d9ff, #7c3aed)',
                  boxShadow: '0 0 18px rgba(0,217,255,0.35)',
                  flexShrink: 0,
                }}
              />
              M20 Autopilot
            </Link>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/privacy" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 13 }}>
                {meta.nav.privacy}
              </Link>
              <Link href="/terms" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 13 }}>
                {meta.nav.terms}
              </Link>
              <button
                onClick={() => setLang(isAr ? 'en' : 'ar')}
                style={{
                  background: 'transparent',
                  color: '#00d9ff',
                  border: '1px solid rgba(0,217,255,0.4)',
                  padding: '6px 14px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 13,
                  fontFamily: 'inherit',
                }}
              >
                {meta.langToggle}
              </button>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: 860, margin: '0 auto', padding: '56px 24px 96px' }}>
          <span
            style={{
              fontSize: 11,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#00d9ff',
              fontWeight: 700,
            }}
          >
            {meta.eyebrow}
          </span>

          <h1
            style={{
              fontSize: 'clamp(26px, 4vw, 42px)',
              fontWeight: 800,
              color: '#fff',
              margin: '12px 0 10px',
              lineHeight: 1.2,
              letterSpacing: isAr ? '0' : '-0.01em',
            }}
          >
            {meta.title}
          </h1>

          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28 }}>{meta.updated}</p>

          <p
            style={{
              color: '#cbd5e1',
              fontSize: 15.5,
              lineHeight: 1.85,
              marginBottom: 40,
              padding: '16px 20px',
              background: 'rgba(0,217,255,0.04)',
              border: '1px solid rgba(0,217,255,0.18)',
              borderRadius: 12,
            }}
          >
            {meta.intro}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))',
              gap: 10,
              marginBottom: 52,
            }}
          >
            {highlights.map((h, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(0,217,255,0.04)',
                  border: '1px solid rgba(0,217,255,0.13)',
                  borderRadius: 12,
                  padding: '14px 12px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 7 }}>{h.icon}</div>
                <p style={{ color: '#00d9ff', fontWeight: 700, fontSize: 12, lineHeight: 1.4 }}>
                  {isAr ? h.ar : h.en}
                </p>
              </div>
            ))}
          </div>

          {groups.map((group, gi) => (
            <div key={gi} style={{ marginBottom: 44 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    height: 1,
                    flex: 1,
                    background: GROUP_BORDER[gi],
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 2.5,
                    textTransform: 'uppercase',
                    color: GROUP_TEXT[gi],
                    padding: '4px 12px',
                    background: GROUP_COLORS[gi],
                    border: `1px solid ${GROUP_BORDER[gi]}`,
                    borderRadius: 20,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {group.label}
                </span>
                <div
                  style={{
                    height: 1,
                    flex: 1,
                    background: GROUP_BORDER[gi],
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {group.sections.map((s, si) => (
                  <section key={si}>
                    <h2
                      style={{
                        fontSize: 19,
                        fontWeight: 700,
                        color: GROUP_TEXT[gi],
                        marginBottom: 8,
                        paddingBottom: 8,
                        borderBottom: `1px solid ${GROUP_BORDER[gi]}`,
                      }}
                    >
                      {s.h}
                    </h2>
                    <p style={{ color: '#cbd5e1', fontSize: 15, lineHeight: 1.9 }}>{s.p}</p>
                  </section>
                ))}
              </div>
            </div>
          ))}

          <div
            style={{
              marginTop: 48,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
            }}
          >
            <div
              style={{
                padding: '20px 22px',
                background: 'rgba(0,217,255,0.05)',
                border: '1px solid rgba(0,217,255,0.22)',
                borderRadius: 12,
                textAlign: 'center',
              }}
            >
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 6 }}>{meta.contactLabel}</p>
              <a
                href={`mailto:${SECURITY_EMAIL}`}
                style={{ color: '#00d9ff', fontWeight: 700, fontSize: 15, textDecoration: 'none', wordBreak: 'break-all' }}
              >
                {SECURITY_EMAIL}
              </a>
            </div>
            <div
              style={{
                padding: '20px 22px',
                background: 'rgba(124,58,237,0.05)',
                border: '1px solid rgba(124,58,237,0.22)',
                borderRadius: 12,
                textAlign: 'center',
              }}
            >
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 6 }}>{meta.supportLabel}</p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                style={{ color: '#a78bfa', fontWeight: 700, fontSize: 15, textDecoration: 'none', wordBreak: 'break-all' }}
              >
                {SUPPORT_EMAIL}
              </a>
            </div>
          </div>
        </main>

        <footer
          style={{
            padding: '24px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            textAlign: 'center',
            color: '#64748b',
            fontSize: 13,
          }}
        >
          {meta.copyright}
          {' · '}
          <Link href="/privacy" style={{ color: '#94a3b8', textDecoration: 'none' }}>
            {meta.nav.privacy}
          </Link>
          {' · '}
          <Link href="/terms" style={{ color: '#94a3b8', textDecoration: 'none' }}>
            {meta.nav.terms}
          </Link>
        </footer>
      </div>
    </>
  );
}
