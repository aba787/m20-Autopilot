import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const SECURITY_EMAIL = 'security@m20autopilot.com';
const UPDATED_DATE = 'June 2026';

const en = {
  title: 'Security & Privacy',
  subtitle: 'Security & Privacy at M20 Autopilot',
  updated: `Last updated: ${UPDATED_DATE}`,
  intro:
    'M20 Autopilot is built on a security-first foundation. We protect your Amazon advertising data, account access, and business metrics with strong encryption, strict access controls, and continuous monitoring. This page explains how we keep your data safe and how we respect your privacy.',
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
      h: 'Data Isolation & AI Privacy',
      p: "Every seller's data is logically isolated. Your advertising data is never mixed with another customer's data, and it is never used to train AI models that benefit other sellers.",
    },
    {
      h: 'Your Control Over Your Data',
      p: "You stay in charge at all times. You can connect securely through Amazon's official flow, grant only the permissions the AI agent needs, disconnect M20 from your account at any time, and request a full export or permanent deletion of your data whenever you wish.",
    },
    {
      h: 'Compliance & Standards',
      p: 'Our controls are aligned with SOC 2 Type II practices, and we honor data protection rights under GDPR and CCPA. Our Amazon integration is a certified SP-API integration, and all traffic is encrypted with TLS 1.3.',
    },
    {
      h: 'Reporting a Security Issue',
      p: `If you discover a potential security issue, please email our security team at ${SECURITY_EMAIL}. We review every report and respond promptly to verified disclosures.`,
    },
  ],
  nav: {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    security: 'Security',
  },
  langToggle: 'العربية',
  copyright: `© ${new Date().getFullYear()} M20 Autopilot. All rights reserved.`,
};

const ar = {
  title: 'الأمان والخصوصية',
  subtitle: 'الأمان والخصوصية في M20 Autopilot',
  updated: `آخر تحديث: يونيو 2026`,
  intro:
    'تم بناء M20 Autopilot على أساس يضع الأمان أولاً. نحمي بيانات إعلاناتك على أمازون والوصول إلى حسابك ومؤشرات أعمالك بتشفير قوي وضوابط وصول صارمة ومراقبة مستمرة. توضّح هذه الصفحة كيف نحافظ على أمان بياناتك وكيف نحترم خصوصيتك.',
  sections: [
    {
      h: 'تشفير البيانات',
      p: 'تُشفَّر جميع بياناتك أثناء النقل باستخدام TLS 1.3 وتُشفَّر أثناء التخزين باستخدام AES-256. لا تُخزَّن مؤشرات حملاتك وبيانات إعلاناتك كنص واضح أبداً، سواء أثناء انتقالها بين الأنظمة أو أثناء وجودها في قواعد بياناتنا.',
    },
    {
      h: 'الوصول إلى حساب أمازون',
      p: 'نتصل بحساب أمازون الخاص بك عبر واجهة SP-API الرسمية من أمازون باستخدام OAuth الآمن. لا نرى أو نخزّن كلمة مرور أمازون الخاصة بك، ويمكنك إلغاء وصولنا في أي وقت مباشرةً من حساب أمازون.',
    },
    {
      h: 'ضوابط الوصول',
      p: 'نطبّق وصولاً صارماً قائماً على الأدوار وصلاحيات بأقل امتياز. المصادقة متعددة العوامل إلزامية لكل نظام داخلي يتعامل مع بياناتك، بحيث لا يصل إليها إلا الأشخاص المصرّح لهم فعلاً.',
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
      h: 'عزل البيانات وخصوصية الذكاء الاصطناعي',
      p: 'بيانات كل بائع معزولة منطقياً. لا تُخلط بياناتك الإعلانية مع بيانات عميل آخر أبداً، ولا تُستخدم لتدريب نماذج ذكاء اصطناعي تفيد بائعين آخرين.',
    },
    {
      h: 'تحكّمك في بياناتك',
      p: 'تبقى أنت المتحكم في كل الأوقات. يمكنك الاتصال بأمان عبر التدفق الرسمي من أمازون، ومنح الصلاحيات التي يحتاجها وكيل الذكاء الاصطناعي فقط، وفصل M20 عن حسابك في أي وقت، وطلب تصدير بياناتك بالكامل أو حذفها نهائياً متى شئت.',
    },
    {
      h: 'الامتثال والمعايير',
      p: 'تتوافق ضوابطنا مع ممارسات SOC 2 Type II، ونحترم حقوق حماية البيانات بموجب GDPR وCCPA. تكاملنا مع أمازون هو تكامل معتمد عبر SP-API، وجميع البيانات مشفّرة باستخدام TLS 1.3.',
    },
    {
      h: 'الإبلاغ عن مشكلة أمنية',
      p: `إذا اكتشفت مشكلة أمنية محتملة، يُرجى مراسلة فريق الأمان لدينا على ${SECURITY_EMAIL}. نراجع كل بلاغ ونستجيب بسرعة للإفصاحات المُتحقَّق منها.`,
    },
  ],
  nav: {
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الخدمة',
    security: 'الأمان',
  },
  langToggle: 'English',
  copyright: `© ${new Date().getFullYear()} M20 Autopilot. جميع الحقوق محفوظة.`,
};

const highlights = [
  { en: 'TLS 1.3 Encryption', ar: 'تشفير TLS 1.3', icon: '🔒' },
  { en: 'AES-256 at Rest', ar: 'AES-256 في التخزين', icon: '🛡️' },
  { en: 'SOC 2 Aligned', ar: 'متوافق مع SOC 2', icon: '✅' },
  { en: 'Zero-Knowledge OAuth', ar: 'OAuth بدون رؤية كلمة المرور', icon: '🔑' },
];

export default function SecurityPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const t = lang === 'ar' ? ar : en;
  const isAr = lang === 'ar';

  return (
    <>
      <Head>
        <title>Security &amp; Privacy — M20 Autopilot</title>
        <meta
          name="description"
          content="Security and privacy practices at M20 Autopilot — how we protect your Amazon advertising data with encryption, access controls, and continuous monitoring."
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
              maxWidth: 920,
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

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/privacy" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 13 }}>
                {t.nav.privacy}
              </Link>
              <Link href="/terms" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 13 }}>
                {t.nav.terms}
              </Link>
              <button
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
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
                {t.langToggle}
              </button>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: 820, margin: '0 auto', padding: '56px 24px 96px' }}>
          <div style={{ marginBottom: 8 }}>
            <span
              style={{
                fontSize: 12,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: '#00d9ff',
                fontWeight: 700,
              }}
            >
              {t.title}
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 800,
              color: '#fff',
              marginBottom: 10,
              lineHeight: 1.2,
              letterSpacing: isAr ? '0' : '-0.01em',
            }}
          >
            {t.subtitle}
          </h1>

          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 32 }}>{t.updated}</p>

          <p
            style={{
              color: '#cbd5e1',
              fontSize: 16,
              lineHeight: 1.85,
              marginBottom: 40,
              padding: '16px 20px',
              background: 'rgba(0,217,255,0.04)',
              border: '1px solid rgba(0,217,255,0.18)',
              borderRadius: 12,
            }}
          >
            {t.intro}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: 12,
              marginBottom: 48,
            }}
          >
            {highlights.map((h, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(0,217,255,0.05)',
                  border: '1px solid rgba(0,217,255,0.15)',
                  borderRadius: 12,
                  padding: '16px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>{h.icon}</div>
                <p style={{ color: '#00d9ff', fontWeight: 700, fontSize: 13 }}>
                  {isAr ? h.ar : h.en}
                </p>
              </div>
            ))}
          </div>

          {t.sections.map((s, i) => (
            <section key={i} style={{ marginBottom: 28 }}>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#00d9ff',
                  marginBottom: 10,
                  paddingBottom: 10,
                  borderBottom: '1px solid rgba(0,217,255,0.15)',
                }}
              >
                {s.h}
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: 15.5, lineHeight: 1.85 }}>{s.p}</p>
            </section>
          ))}

          <div
            style={{
              marginTop: 56,
              padding: '24px',
              background: 'rgba(0,217,255,0.05)',
              border: '1px solid rgba(0,217,255,0.25)',
              borderRadius: 12,
              textAlign: 'center',
            }}
          >
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 6 }}>
              {isAr ? 'تواصل مع فريق الأمان' : 'Contact our security team'}
            </p>
            <a
              href={`mailto:${SECURITY_EMAIL}`}
              style={{
                color: '#00d9ff',
                fontWeight: 700,
                fontSize: 18,
                textDecoration: 'none',
                wordBreak: 'break-all',
              }}
            >
              {SECURITY_EMAIL}
            </a>
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
          {t.copyright}
          {' · '}
          <Link href="/privacy" style={{ color: '#94a3b8', textDecoration: 'none' }}>
            {t.nav.privacy}
          </Link>
          {' · '}
          <Link href="/terms" style={{ color: '#94a3b8', textDecoration: 'none' }}>
            {t.nav.terms}
          </Link>
        </footer>
      </div>
    </>
  );
}
