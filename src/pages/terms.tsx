import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const SUPPORT_EMAIL = 'm20.m.devlet@gmail.com';
const EFFECTIVE_DATE = 'April 27, 2026';

const en = {
  title: 'Terms of Service',
  effective: `Effective Date: ${EFFECTIVE_DATE}`,
  intro:
    'Welcome to M20 Autopilot ("M20", "we", "us", "our"), an Amazon advertising optimization SaaS platform. By accessing or using our website, dashboard, mobile app, or any related service (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not use the Service.',
  sections: [
    {
      h: '1. Eligibility & Account',
      p: 'You must be at least 18 years old and authorized to act on behalf of any business you represent. You are responsible for safeguarding your login credentials and for all activity that occurs under your account. Notify us immediately at the support email below if you suspect unauthorized access.',
    },
    {
      h: '2. The Service',
      p: 'M20 Autopilot connects to your Amazon Advertising account (with your consent) and provides analytics, AI-powered recommendations, and optional automation for ad campaigns, keywords, products, budgets, and reports. Recommendations are decision-support tools — you remain solely responsible for advertising spend and outcomes.',
    },
    {
      h: '3. Subscriptions & Billing',
      p: 'M20 offers Free, Pro, and Enterprise plans. Paid plans are billed in advance on a recurring basis. You may cancel at any time from your account settings; cancellations take effect at the end of the current billing period. Fees already paid are non-refundable except where required by law.',
    },
    {
      h: '4. Acceptable Use',
      p: 'You agree not to: (a) use the Service to violate Amazon Advertising policies, applicable laws, or third-party rights; (b) attempt to reverse engineer, scrape, or interfere with the Service; (c) upload malicious code; (d) resell or sublicense access without our written consent; or (e) use the Service to send spam or unsolicited communications.',
    },
    {
      h: '5. Amazon Connection & Data',
      p: 'When you connect your Amazon Advertising account, you authorize M20 to access campaign, keyword, product, and reporting data on your behalf via Amazon\'s official APIs. You can revoke this access at any time from your Amazon account or from the M20 Settings page. M20 does not store your Amazon password.',
    },
    {
      h: '6. AI Recommendations',
      p: 'M20 uses rule-based logic and large language models (e.g. GPT-4o mini) to generate suggestions. AI output may contain errors. Always review recommendations before applying them. Automated actions, when enabled, execute within the limits you configure (target ACOS, budget caps, etc.).',
    },
    {
      h: '7. Intellectual Property',
      p: 'M20 and its licensors own all rights in the Service, including software, design, trademarks, and content. You retain ownership of data you submit. You grant M20 a limited license to process that data solely to operate, improve, and secure the Service.',
    },
    {
      h: '8. Disclaimer of Warranties',
      p: 'The Service is provided "as is" and "as available". To the maximum extent permitted by law, M20 disclaims all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant any specific advertising results, ROAS, ACOS, or revenue outcome.',
    },
    {
      h: '9. Limitation of Liability',
      p: 'To the maximum extent permitted by law, M20 will not be liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, lost revenue, or lost data. Our total aggregate liability for any claim arising out of or relating to the Service is limited to the amount you paid us in the twelve (12) months preceding the claim.',
    },
    {
      h: '10. Termination',
      p: 'You may stop using the Service at any time. We may suspend or terminate your account if you breach these Terms, abuse the Service, or as required by law. Upon termination, your right to access the Service ends immediately; sections that by their nature should survive termination will survive.',
    },
    {
      h: '11. Changes to These Terms',
      p: 'We may update these Terms from time to time. Material changes will be communicated by email or through an in-app notice at least 14 days before they take effect. Continued use of the Service after the effective date constitutes acceptance of the updated Terms.',
    },
    {
      h: '12. Governing Law',
      p: 'These Terms are governed by the laws of the Kingdom of Saudi Arabia, without regard to conflict-of-laws principles. Any dispute arising out of or relating to these Terms will be resolved in the competent courts of Riyadh, Saudi Arabia.',
    },
    {
      h: '13. Contact',
      p: `Questions about these Terms? Contact us at ${SUPPORT_EMAIL}.`,
    },
  ],
};

const ar = {
  title: 'شروط الاستخدام',
  effective: `تاريخ السريان: ${EFFECTIVE_DATE}`,
  intro:
    'مرحبًا بك في M20 Autopilot ("M20"، "نحن"، "خدمتنا")، منصة SaaS لتحسين الإعلانات على أمازون. باستخدامك للموقع أو لوحة التحكم أو تطبيق الجوال أو أي خدمة مرتبطة (يُشار إليها معًا بـ"الخدمة")، فإنك توافق على الالتزام بشروط الاستخدام هذه ("الشروط"). إذا كنت لا توافق، فلا تستخدم الخدمة.',
  sections: [
    {
      h: '1. الأهلية والحساب',
      p: 'يجب ألا يقل عمرك عن 18 عامًا، وأن تكون مفوضًا بالتصرف نيابة عن أي جهة تمثلها. أنت مسؤول عن حماية بيانات الدخول وعن جميع الأنشطة التي تتم عبر حسابك. أبلغنا فورًا عبر البريد الإلكتروني للدعم في حال الاشتباه بأي وصول غير مصرّح به.',
    },
    {
      h: '2. عن الخدمة',
      p: 'يتصل M20 Autopilot بحساب أمازون الإعلاني الخاص بك (بموافقتك) ويوفر تحليلات وتوصيات مدعومة بالذكاء الاصطناعي وأتمتة اختيارية للحملات والكلمات المفتاحية والمنتجات والميزانيات والتقارير. التوصيات هي أدوات لدعم القرار، وتبقى أنت المسؤول الكامل عن الإنفاق الإعلاني ونتائجه.',
    },
    {
      h: '3. الاشتراكات والفوترة',
      p: 'يقدم M20 خططًا مجانية و Pro و Enterprise. تُحصَّل الخطط المدفوعة مقدمًا بشكل دوري. يمكنك الإلغاء في أي وقت من إعدادات الحساب، ويسري الإلغاء في نهاية فترة الفوترة الحالية. الرسوم المدفوعة غير قابلة للاسترداد إلا حيث يفرض القانون ذلك.',
    },
    {
      h: '4. الاستخدام المقبول',
      p: 'توافق على عدم: (أ) استخدام الخدمة لمخالفة سياسات أمازون الإعلانية أو الأنظمة المعمول بها أو حقوق الغير؛ (ب) محاولة الهندسة العكسية أو الكشط أو إعاقة الخدمة؛ (ج) رفع أي شفرة خبيثة؛ (د) إعادة بيع الوصول دون موافقتنا الكتابية؛ (هـ) استخدام الخدمة لإرسال رسائل مزعجة.',
    },
    {
      h: '5. الاتصال ببيانات أمازون',
      p: 'عند ربط حساب أمازون الإعلاني، فإنك تأذن لـ M20 بالوصول إلى بيانات الحملات والكلمات المفتاحية والمنتجات والتقارير عبر واجهات أمازون الرسمية. يمكنك سحب هذا الإذن في أي وقت من حساب أمازون أو من صفحة الإعدادات في M20. لا يقوم M20 بتخزين كلمة مرور أمازون.',
    },
    {
      h: '6. توصيات الذكاء الاصطناعي',
      p: 'يستخدم M20 منطقًا قائمًا على القواعد ونماذج لغوية كبيرة (مثل GPT-4o mini) لتوليد المقترحات. قد تحتوي مخرجات الذكاء الاصطناعي على أخطاء. يُرجى دائمًا مراجعة التوصيات قبل تطبيقها. الإجراءات التلقائية، عند تفعيلها، تُنفَّذ ضمن الحدود التي تحددها (ACOS المستهدف، حدود الميزانية، إلخ).',
    },
    {
      h: '7. الملكية الفكرية',
      p: 'يملك M20 ومرخصوه جميع الحقوق في الخدمة بما يشمل البرمجيات والتصميم والعلامات التجارية والمحتوى. أنت تحتفظ بملكية البيانات التي ترسلها. وتمنح M20 ترخيصًا محدودًا لمعالجتها لأغراض تشغيل الخدمة وتحسينها وحمايتها فقط.',
    },
    {
      h: '8. إخلاء الضمانات',
      p: 'تُقدَّم الخدمة "كما هي" و"حسب التوفر". إلى أقصى حد يسمح به القانون، يخلي M20 مسؤوليته من جميع الضمانات الصريحة أو الضمنية بما في ذلك القابلية للتسويق والملاءمة لغرض معين وعدم الانتهاك. لا نضمن أي نتائج إعلانية محددة أو ROAS أو ACOS أو إيرادات.',
    },
    {
      h: '9. حدود المسؤولية',
      p: 'إلى أقصى حد يسمح به القانون، لن يكون M20 مسؤولًا عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية أو عقابية، ولا عن خسائر الأرباح أو الإيرادات أو البيانات. تقتصر مسؤوليتنا الإجمالية عن أي مطالبة على المبلغ الذي دفعته لنا خلال الاثني عشر (12) شهرًا السابقة للمطالبة.',
    },
    {
      h: '10. الإنهاء',
      p: 'يمكنك التوقف عن استخدام الخدمة في أي وقت. ويحق لنا تعليق حسابك أو إنهاؤه إذا انتهكت هذه الشروط أو أسأت استخدام الخدمة أو متى اشترط القانون ذلك. عند الإنهاء، ينتهي حقك في الوصول للخدمة فورًا، وتظل الأحكام التي تستوجب طبيعتها الاستمرار سارية.',
    },
    {
      h: '11. التعديلات على الشروط',
      p: 'قد نقوم بتحديث هذه الشروط من وقت لآخر. سنبلغك بالتعديلات الجوهرية عبر البريد الإلكتروني أو إشعار داخل التطبيق قبل 14 يومًا على الأقل من سريانها. استمرار استخدامك للخدمة بعد تاريخ السريان يُعدّ موافقة على الشروط المحدّثة.',
    },
    {
      h: '12. القانون الحاكم',
      p: 'تخضع هذه الشروط لأنظمة المملكة العربية السعودية، دون اعتبار لمبادئ تنازع القوانين. وتختص محاكم مدينة الرياض المختصة بالنظر في أي نزاع ينشأ عن هذه الشروط أو يتعلق بها.',
    },
    {
      h: '13. التواصل',
      p: `لأي استفسار حول هذه الشروط، تواصل معنا عبر ${SUPPORT_EMAIL}.`,
    },
  ],
};

export default function TermsOfService() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const t = lang === 'ar' ? ar : en;
  const isAr = lang === 'ar';

  return (
    <>
      <Head>
        <title>Terms of Service — M20 Autopilot</title>
        <meta name="description" content="Terms of Service for M20 Autopilot, an Amazon Advertising optimization SaaS platform." />
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
              <Link href="/privacy" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 13 }}>
                {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
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
          <Link href="/privacy" style={{ color: '#94a3b8' }}>
            {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </Link>
        </footer>
      </div>
    </>
  );
}
