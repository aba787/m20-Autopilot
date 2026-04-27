import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const SUPPORT_EMAIL = 'm20.m.devlet@gmail.com';
const EFFECTIVE_DATE = 'April 27, 2026';

const en = {
  title: 'Privacy Policy',
  effective: `Effective Date: ${EFFECTIVE_DATE}`,
  intro:
    'This Privacy Policy explains how M20 Autopilot ("M20", "we", "us") collects, uses, shares, and protects your information when you use our website, dashboard, mobile app, and related services (the "Service"). By using the Service, you agree to this Policy.',
  sections: [
    {
      h: '1. Information We Collect',
      p: 'We collect information you provide (name, email, password hash, billing details, support messages), information generated when you use the Service (logins, page views, AI queries, settings, audit logs), and information from third-party integrations you authorize (Amazon Advertising campaigns, keywords, products, performance reports). We do NOT collect your Amazon password.',
    },
    {
      h: '2. How We Use Your Information',
      p: 'We use your information to: (a) operate and personalize the Service; (b) generate analytics and AI recommendations; (c) execute automated optimizations you have explicitly enabled; (d) provide customer support; (e) send transactional emails (account, billing, security alerts); (f) detect fraud and abuse; (g) comply with legal obligations.',
    },
    {
      h: '3. AI Processing',
      p: 'When you use AI features (recommendations, ad copy generator, support chatbot), relevant data may be sent to our AI provider (OpenAI). We send the minimum data required and never share your account credentials. AI providers are contractually prohibited from training their general models on your data.',
    },
    {
      h: '4. Sharing of Information',
      p: 'We do not sell your personal information. We share information only with: (a) service providers acting on our behalf under confidentiality (hosting, database, email, payments, analytics, AI); (b) Amazon, when you authorize a connection, strictly to deliver the integration; (c) authorities when required by law or to protect rights and safety; (d) successors in case of a merger or acquisition (with notice).',
    },
    {
      h: '5. Data Storage & Security',
      p: 'Data is stored in encrypted form on managed cloud infrastructure (Supabase / PostgreSQL) with row-level security. We use TLS in transit, hashed passwords (managed by Supabase Auth), access controls, and audit logs. No system is 100% secure; report any suspected vulnerability to the support email below.',
    },
    {
      h: '6. Data Retention',
      p: 'We retain account data while your account is active and for a reasonable period afterwards to comply with legal, tax, and audit requirements. You may request deletion of your account at any time from Settings → Danger Zone, or by emailing us. After deletion, anonymized aggregate data may be retained.',
    },
    {
      h: '7. Your Rights',
      p: 'Subject to applicable law, you have the right to access, correct, export, restrict, or delete your personal data, and to object to or withdraw consent for certain processing. You can exercise these rights from your account settings or by contacting us at the support email.',
    },
    {
      h: '8. Children',
      p: 'The Service is intended for businesses and adults aged 18 or older. We do not knowingly collect personal information from children. If you believe a child has provided us data, contact us and we will delete it.',
    },
    {
      h: '9. International Transfers',
      p: 'M20 may process and store data on servers outside your country. Where required, we rely on appropriate safeguards (such as Standard Contractual Clauses) to protect international transfers.',
    },
    {
      h: '10. Cookies & Local Storage',
      p: 'We use essential cookies and browser local storage to keep you signed in, remember your language and theme preferences, and protect against abuse. We do not use third-party advertising cookies. You can clear storage at any time from your browser settings.',
    },
    {
      h: '11. Third-Party Services',
      p: 'When you connect Amazon Advertising or other third-party services, those services are governed by their own terms and privacy policies. We encourage you to review them. M20 is not responsible for third-party practices outside our control.',
    },
    {
      h: '12. Changes to This Policy',
      p: 'We may update this Policy from time to time. Material changes will be communicated by email or in-app notice at least 14 days before they take effect. The "Effective Date" at the top reflects the latest version.',
    },
    {
      h: '13. Contact Us',
      p: `For privacy questions or to exercise your rights, contact us at ${SUPPORT_EMAIL}.`,
    },
  ],
};

const ar = {
  title: 'سياسة الخصوصية',
  effective: `تاريخ السريان: ${EFFECTIVE_DATE}`,
  intro:
    'توضح سياسة الخصوصية هذه كيف يقوم M20 Autopilot ("M20"، "نحن") بجمع معلوماتك واستخدامها ومشاركتها وحمايتها عند استخدامك للموقع ولوحة التحكم وتطبيق الجوال والخدمات المرتبطة ("الخدمة"). باستخدامك للخدمة فإنك توافق على هذه السياسة.',
  sections: [
    {
      h: '1. المعلومات التي نجمعها',
      p: 'نجمع المعلومات التي تقدمها (الاسم، البريد، تجزئة كلمة المرور، بيانات الفوترة، رسائل الدعم)، والمعلومات الناتجة عن استخدامك (تسجيلات الدخول، مشاهدات الصفحات، استفسارات الذكاء الاصطناعي، الإعدادات، سجلات التدقيق)، والمعلومات من التكاملات الخارجية التي تأذن بها (حملات أمازون الإعلانية، الكلمات المفتاحية، المنتجات، تقارير الأداء). لا نقوم بجمع كلمة مرور أمازون.',
    },
    {
      h: '2. كيف نستخدم معلوماتك',
      p: 'نستخدم معلوماتك من أجل: (أ) تشغيل الخدمة وتخصيصها؛ (ب) توليد التحليلات وتوصيات الذكاء الاصطناعي؛ (ج) تنفيذ التحسينات التلقائية التي فعّلتها صراحةً؛ (د) تقديم الدعم الفني؛ (هـ) إرسال رسائل تشغيلية (الحساب، الفوترة، تنبيهات الأمان)؛ (و) اكتشاف الاحتيال وسوء الاستخدام؛ (ز) الامتثال للالتزامات القانونية.',
    },
    {
      h: '3. معالجة الذكاء الاصطناعي',
      p: 'عند استخدام ميزات الذكاء الاصطناعي (التوصيات، مولد الإعلانات، شات الدعم)، قد تُرسل البيانات اللازمة إلى مزود الذكاء الاصطناعي (OpenAI). نرسل الحد الأدنى من البيانات المطلوبة ولا نشارك بيانات الاعتماد. ويُحظر تعاقديًا على مزودي الذكاء الاصطناعي تدريب نماذجهم العامة على بياناتك.',
    },
    {
      h: '4. مشاركة المعلومات',
      p: 'نحن لا نبيع معلوماتك الشخصية. نشاركها فقط مع: (أ) مزودي الخدمة العاملين نيابة عنا تحت بنود السرية (الاستضافة، قاعدة البيانات، البريد، المدفوعات، التحليلات، الذكاء الاصطناعي)؛ (ب) أمازون عند ربط حسابك، فقط لتشغيل التكامل؛ (ج) الجهات الرسمية عند الإلزام القانوني أو لحماية الحقوق والسلامة؛ (د) خلَف قانوني في حالة الاندماج أو الاستحواذ (مع إشعار).',
    },
    {
      h: '5. تخزين البيانات والأمان',
      p: 'تُخزَّن البيانات بصورة مشفّرة على بنية سحابية مُدارة (Supabase / PostgreSQL) مع أمان على مستوى الصف. نستخدم TLS أثناء النقل، وتجزئة كلمات المرور (عبر Supabase Auth)، وضوابط الوصول، وسجلات التدقيق. لا يوجد نظام آمن بنسبة 100%، لذا يُرجى الإبلاغ عن أي ثغرة عبر بريد الدعم أدناه.',
    },
    {
      h: '6. الاحتفاظ بالبيانات',
      p: 'نحتفظ ببيانات الحساب طوال فترة نشاطه ولفترة معقولة بعدها للامتثال للالتزامات القانونية والمحاسبية والتدقيقية. يمكنك طلب حذف حسابك في أي وقت من الإعدادات → منطقة الخطر، أو عبر مراسلتنا. بعد الحذف، قد نحتفظ ببيانات إجمالية مجهولة الهوية.',
    },
    {
      h: '7. حقوقك',
      p: 'وفقًا للأنظمة المعمول بها، يحق لك الوصول إلى بياناتك الشخصية وتصحيحها وتصديرها وتقييدها أو حذفها، والاعتراض على بعض المعالجات أو سحب الموافقة. يمكنك ممارسة هذه الحقوق من إعدادات حسابك أو عبر التواصل مع بريد الدعم.',
    },
    {
      h: '8. الأطفال',
      p: 'الخدمة موجَّهة للشركات والأشخاص البالغين 18 عامًا فأكثر. لا نقوم عن علم بجمع معلومات شخصية من الأطفال. إذا كنت تعتقد أن طفلًا قدم بيانات لنا، فيرجى التواصل معنا وسنحذفها.',
    },
    {
      h: '9. النقل الدولي للبيانات',
      p: 'قد يقوم M20 بمعالجة وتخزين البيانات على خوادم خارج بلدك. وعند الحاجة، نعتمد على ضمانات مناسبة (مثل البنود التعاقدية المعيارية) لحماية عمليات النقل الدولية.',
    },
    {
      h: '10. ملفات تعريف الارتباط والتخزين المحلي',
      p: 'نستخدم ملفات تعريف ارتباط أساسية وتخزينًا محليًا في المتصفح للحفاظ على تسجيل دخولك، وتذكر تفضيلات اللغة والمظهر، وحمايتك من سوء الاستخدام. لا نستخدم ملفات تعريف ارتباط للإعلانات من أطراف ثالثة. يمكنك مسح التخزين في أي وقت من إعدادات المتصفح.',
    },
    {
      h: '11. خدمات الأطراف الثالثة',
      p: 'عند ربط أمازون الإعلاني أو أي خدمات خارجية، فإن تلك الخدمات تخضع لشروطها وسياسات الخصوصية الخاصة بها. ننصح بمراجعتها. لا يتحمل M20 مسؤولية ممارسات الأطراف الثالثة خارج نطاق سيطرتنا.',
    },
    {
      h: '12. التعديلات على السياسة',
      p: 'قد نقوم بتحديث هذه السياسة من وقت لآخر. سنبلغك بالتعديلات الجوهرية عبر البريد الإلكتروني أو إشعار داخل التطبيق قبل 14 يومًا على الأقل من سريانها. يعكس "تاريخ السريان" أعلاه أحدث نسخة.',
    },
    {
      h: '13. تواصل معنا',
      p: `للاستفسارات المتعلقة بالخصوصية أو لممارسة حقوقك، تواصل معنا عبر ${SUPPORT_EMAIL}.`,
    },
  ],
};

export default function PrivacyPolicy() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const t = lang === 'ar' ? ar : en;
  const isAr = lang === 'ar';

  return (
    <>
      <Head>
        <title>Privacy Policy — M20 Autopilot</title>
        <meta name="description" content="Privacy Policy for M20 Autopilot, an Amazon Advertising optimization SaaS platform." />
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
        }}>
        <header style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(0,217,255,0.15)',
          background: 'rgba(10,6,18,0.85)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <div style={{
            maxWidth: 920,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}>
            <Link href="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 700,
              letterSpacing: '0.02em',
            }}>
              <span style={{
                display: 'inline-flex',
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #00d9ff, #7c3aed)',
                boxShadow: '0 0 18px rgba(0,217,255,0.35)',
              }} />
              M20 Autopilot
            </Link>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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
                }}>
                {lang === 'en' ? 'العربية' : 'English'}
              </button>
              <Link href="/terms" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 13 }}>
                {isAr ? 'شروط الاستخدام' : 'Terms of Service'}
              </Link>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: 820, margin: '0 auto', padding: '48px 24px 96px' }}>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 800,
            color: '#fff',
            marginBottom: 8,
            letterSpacing: isAr ? '0' : '-0.01em',
          }}>{t.title}</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 32 }}>{t.effective}</p>

          <p style={{
            color: '#cbd5e1',
            fontSize: 16,
            lineHeight: 1.8,
            marginBottom: 32,
            padding: '16px 20px',
            background: 'rgba(0,217,255,0.04)',
            border: '1px solid rgba(0,217,255,0.18)',
            borderRadius: 12,
          }}>{t.intro}</p>

          {t.sections.map((s, i) => (
            <section key={i} style={{ marginBottom: 28 }}>
              <h2 style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#00d9ff',
                marginBottom: 10,
              }}>{s.h}</h2>
              <p style={{
                color: '#cbd5e1',
                fontSize: 15.5,
                lineHeight: 1.85,
              }}>{s.p}</p>
            </section>
          ))}

          <div style={{
            marginTop: 48,
            padding: '20px 24px',
            background: 'rgba(0,217,255,0.05)',
            border: '1px solid rgba(0,217,255,0.25)',
            borderRadius: 12,
            textAlign: 'center',
          }}>
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 6 }}>
              {isAr ? 'البريد الإلكتروني للدعم' : 'Support Email'}
            </p>
            <a href={`mailto:${SUPPORT_EMAIL}`} style={{
              color: '#00d9ff',
              fontWeight: 700,
              fontSize: 18,
              textDecoration: 'none',
              wordBreak: 'break-all',
            }}>{SUPPORT_EMAIL}</a>
          </div>
        </main>

        <footer style={{
          padding: '24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
          color: '#64748b',
          fontSize: 13,
        }}>
          © {new Date().getFullYear()} M20 Autopilot. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          {' · '}
          <Link href="/terms" style={{ color: '#94a3b8' }}>
            {isAr ? 'شروط الاستخدام' : 'Terms of Service'}
          </Link>
        </footer>
      </div>
    </>
  );
}
