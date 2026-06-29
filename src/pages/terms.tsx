import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const SUPPORT_EMAIL = 'support@m20autopilot.com';
const BILLING_EMAIL = 'support@m20autopilot.com';
const EFFECTIVE_DATE = 'May 5, 2026';

const en = {
  title: 'Terms & Conditions',
  effective: `Effective Date: ${EFFECTIVE_DATE}`,
  intro:
    'The entire M20 Autopilot team is delighted to have you on board. These Terms & Conditions ("T&Cs") govern the business relationship between you (the "Customer" or "User") and M20 Autopilot ("M20", "we", "us", "our") and describe the rights and responsibilities of M20 and the Customer in connection with the use of the automated optimization service offered through the M20 web platform and mobile applications (together, the "M20 Technology") and the assistance provided by our Customer Success Team.',
  sections: [
    {
      h: 'About Us — M20 Autopilot Technology & Our Team',
      p: 'M20 enables its Clients to optimize the advertising offers of eCommerce platforms (in particular Amazon Advertising) through machine learning and AI. The M20 Technology offers two main services: (i) Automated optimization of your advertising campaigns — based on a Target ACOS chosen by the User of a Client account, M20 automates the creation, updating and stopping of the Client\'s advertising campaigns on eCommerce platforms; and (ii) Performance Visualization — alongside the optimization, M20 provides a dashboard to visualize the results of your campaigns. We provide our Clients access to our technology for their teams via a User Account that allows them to set up media-buying strategies, track actions taken by the M20 Technology and view results. If you have any questions about these T&Cs, please contact us at ' + SUPPORT_EMAIL + '.',
    },
    {
      h: 'Help Desk',
      p: `A user support service is available from Sunday to Thursday, from 9:00 AM to 6:00 PM (Riyadh time). This service can be reached by email at ${SUPPORT_EMAIL}. Any User who has a complaint about the operation of the platform or any publication on it may submit it in writing, with all relevant details, to ${SUPPORT_EMAIL}. Complaints will be dealt with as soon as possible and M20 will respond within a maximum of ten (10) calendar days.`,
    },
    {
      h: 'Language',
      p: 'These Terms & Conditions are drafted in English and Arabic. In case of discrepancy between the two versions, the English version will prevail for the application and interpretation of the Terms.',
    },
    {
      h: 'Applicable Law — Jurisdiction',
      p: 'These Terms & Conditions are governed by the laws of the Kingdom of Saudi Arabia, without regard to its conflict-of-laws principles. In the event of a dispute, the competent courts of Riyadh, Saudi Arabia, shall have exclusive jurisdiction.',
    },
    {
      h: 'Intellectual Property Rights',
      p: 'M20 grants to the Customer and to any User covered by the Customer\'s subscription, for the duration of the subscription, a non-exclusive, non-transferable and non-assignable license to access and use the M20 Technology within the limits of the subscribed Services, worldwide, subject to the other provisions of these Terms. The Customer and any User acknowledges that they do not acquire any rights whatsoever in the object code or source code of the M20 Technology, which remain the exclusive property of M20. All content on the M20 platform is protected and is the exclusive property of M20. Unless expressly authorized, all reproduction, representation or use other than as permitted herein is prohibited.',
    },
    {
      h: 'Force Majeure',
      p: 'Neither M20 nor the Customer or any User shall be liable for any failure or delay in performance under these Terms in the event of Force Majeure. In particular, M20 may immediately suspend access to the platform and Services in such event without incurring liability. "Force Majeure" means any unforeseeable, irresistible event external to the parties, including but not limited to natural disasters, acts of war or terrorism, governmental actions, and major outages of internet infrastructure or third-party APIs (including Amazon).',
    },
    {
      h: '1. Acceptance',
      p: 'Acceptance of these Terms & Conditions is an essential and mandatory prerequisite to the use of the M20 Technology and its Services. You expressly acknowledge that you have read, understood and accepted these T&Cs, which apply to all services performed by M20 for the Customer. The T&Cs shall prevail over any contrary terms that may appear in any document issued by the Customer.',
    },
    {
      h: '2. Modifications',
      p: 'The Terms applicable to the Customer are those in force at the date of subscription. Any modification made by M20 will not apply to a current subscription unless expressly agreed by the Customer. We recommend that the Customer save and/or print these Terms for safe and durable storage. Continued use of the platform after a Terms update constitutes acceptance of the updated Terms.',
    },
    {
      h: '3. Pricing & Payment',
      p: 'The use of the M20 Technology is a paid service charged by subscription. M20 currently offers Free, Pro and Enterprise plans. Prices are denominated in U.S. Dollars and Saudi Riyals and are calculated exclusive of taxes; applicable VAT will be added based on the billing information provided by the Customer. Subscriptions are monthly or annual. Fixed fees are billed on the first day of the subscription and on each renewal date. Payment can be made by credit card, debit card, supported digital wallets, or, for Enterprise customers, by bank transfer (IBAN) against an issued invoice. M20 reserves the right to update its pricing at any time, provided that the price contracted at subscription continues to apply until the end of the current period. New pricing applicable upon automatic renewal will be communicated to the Customer in advance.',
    },
    {
      h: '4. Billing & Default of Payment',
      p: `The Customer agrees to receive invoices in electronic format. The Customer agrees to provide accurate billing information so that M20 can charge applicable taxes. Payments are made automatically on the anniversary date of the subscription. In the event of non-payment, we will send a reminder by email. If the Customer has not paid five (5) calendar days after the anniversary date, we will suspend access to the M20 Technology and stop all optimization actions. The payment corresponding to the duration of the Customer\'s subscription will still be due. If the Customer encounters payment difficulties, they may contact us at ${BILLING_EMAIL} to regularize the situation.`,
    },
    {
      h: '5. Duration & Automatic Renewal',
      p: 'Subscriptions can be monthly or annual. Any subscription period started is invoiced in its entirety. Renewal is tacit and automatic, unless terminated by the Customer in accordance with the provisions herein. Upon renewal, the contract is extended for a period equivalent to the billing period initially chosen by the Customer.',
    },
    {
      h: '6. Termination',
      p: 'A subscription may be terminated either by the Customer or by M20. (a) Termination by the Customer: For monthly subscriptions, cancellation must be made at least seven (7) calendar days before the anniversary date; the subscription will end on the last day of the monthly period. For annual subscriptions, cancellation must be made at least thirty (30) calendar days before the anniversary date. Cancellation requests can be submitted from the Subscriptions page in the dashboard or by email to ' + SUPPORT_EMAIL + '. (b) Termination by M20: M20 reserves the right to terminate a Customer at any time, automatically and without formality, including (without limitation) if M20 has reasonable grounds to believe that the Customer fails to comply with these T&Cs (in particular payment obligations), has their Amazon Advertising account suspended or terminated, misrepresents their identity, or engages in inappropriate or unlawful behavior on the platform.',
    },
    {
      h: '7. Specific Obligations of the Customer',
      p: 'The Customer agrees to: (i) conduct a lawful business in accordance with applicable laws and the terms of the eCommerce platforms used; (ii) delegate to M20 the access rights to the eCommerce platform necessary for the operation of the Service (in particular on Amazon: Advertising API, Selling Partner API, etc.); and (iii) grant a right of use of the M20 Service to any User authorized to manage advertising campaigns. The Customer is responsible for the actions of its Users and is responsible for removing access rights of Users who no longer need to use the M20 Service.',
    },
    {
      h: '8. Responsibilities of M20',
      p: 'M20 will use its best efforts to provide its Customers with a quality service. M20\'s liability to the Customer is limited to the direct damages proven by the Customer that are directly attributable to M20, and is in any event limited to the amounts paid by the Customer for the Service during the six (6) months preceding the claim. M20 shall not be liable for any indirect damages, including loss of revenue, loss of profit, brand-image damage, or increased advertising expenses. M20 shall not be liable for damages resulting from misuse of the Services by the Customer, acts of third parties, malfunctions of any eCommerce platform (including Amazon API changes), or non-compliance by the Customer with personal-data regulations. The Customer acknowledges that the proper functioning of M20 is subject to internet conditions at the Customer\'s expense.',
    },
    {
      h: '9. Service Level',
      p: 'The M20 Technology is available on a controlled-access basis 24 hours a day, 7 days a week, subject to maintenance windows. M20 uses its best efforts to ensure optimal availability of the Service. In case of urgency, Force Majeure, computer failures, or telecommunications problems, access to the M20 Technology may be temporarily interrupted to perform urgent maintenance, backup or improvement operations. Such interruptions will not entitle the Customer to any compensation.',
    },
    {
      h: '10. Confidentiality',
      p: 'The Customer and M20 agree to treat all documents and information exchanged in connection with this Agreement as strictly confidential and will not disclose any part of their content to any third party without the prior consent of the other party, except where required by law or competent authority. Each party agrees to limit dissemination of confidential information to its employees whose intervention is necessary, to inform them in advance of the confidential nature of the information, and to impose on them the same obligations of confidentiality.',
    },
    {
      h: '11. Marketing References',
      p: 'The Customer grants M20 the right to use the Customer\'s company name and logo as a reference for marketing or promotional purposes on the M20 website and in other public or private communications with existing or potential clients, subject to any standard brand guidelines provided by the Customer. If the Customer does not wish to be used as a reference, the Customer may email ' + SUPPORT_EMAIL + ' at any time with a clear opt-out request.',
    },
    {
      h: '12. User Account Management',
      p: `To access the M20 platform, Users sign in with their business email and the password they set during registration. Users agree to provide true, accurate, and current information and not to use false names or addresses. Each User undertakes to maintain strict confidentiality of their login credentials and is solely responsible for access through their account, unless fraud is proven. Users agree not to make available or distribute any illegal, defamatory, or harmful content (such as viruses). Users may at any time request modification of their authentication details or deletion of their account by emailing ${SUPPORT_EMAIL}. M20 will complete account deletion within five (5) calendar days. Any account inactive for more than twelve (12) months may be terminated by M20 after thirty (30) days of unanswered notification.`,
    },
    {
      h: '13. Site & Service Availability',
      p: 'The platform is accessible to Users on a permanent basis, except in cases of Force Majeure, computer failures, or problems related to telecommunications networks. M20 may interrupt access in order to carry out maintenance, backup or improvement operations. Maintenance and service interruptions do not entitle the User or Customer to any compensation. The User may use the M20 Technology and Services as long as the Customer has an active subscription with M20.',
    },
    {
      h: '14. User Obligations & AI Recommendations',
      p: 'Access to the M20 Technology is the sole responsibility of the person connecting to it. Each User must (i) take all appropriate measures to protect their own data and equipment, (ii) comply with all applicable laws, (iii) make reasonable and good-faith use of the Services, and (iv) carefully select the parameters necessary for the M20 algorithm — in particular the Target ACOS, budget caps, and any automation rules. M20 uses rule-based logic and large language models (e.g. GPT-4o family) to generate recommendations. AI output may contain errors. Always review recommendations before applying them. Automated actions, when enabled, execute within the limits the User configures. M20 does not warrant any specific advertising results, ROAS, ACOS, or revenue outcome.',
    },
    {
      h: '15. Privacy & Personal Data',
      p: `Certain personal data, identified as mandatory in our forms, is necessary to use the M20 platform and Services. This data may include: full name, email, billing information, and language preference. M20 may record User Activities (logins, actions taken in the platform, actions taken by the M20 Technology on the User\'s behalf) for security and operational purposes. The history of these Activities may be retained in identifiable form for a maximum period of one (1) year and will be permanently destroyed upon deletion of the account. M20 is committed to protecting User personal data and complies with applicable data-protection regulations (including the Saudi PDPL and the EU GDPR where applicable). Users have the right to access, rectify, restrict, object to processing, withdraw consent, and request deletion of their personal data. Users may exercise these rights at any time by contacting ${SUPPORT_EMAIL}. For full details, please consult our `,
      link: { href: '/privacy', en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
    },
    {
      h: '16. Amazon Connection',
      p: 'When you connect your Amazon Advertising account, you authorize M20 to access campaign, keyword, product and reporting data on your behalf via Amazon\'s official APIs. You can revoke this access at any time from your Amazon account or from the M20 Settings page. M20 does not store your Amazon password. M20 acts within the limits of permissions granted by Amazon and is not responsible for any modifications, technical changes or restrictions imposed by Amazon on its APIs.',
    },
    {
      h: '17. Cookies & Hyperlinks',
      p: 'When the User browses the M20 Technology or its websites, information may be recorded or read on the User\'s terminal through cookies, depending on the choices made in the User\'s browser. Cookies enable us to recognize the terminal and improve the user experience. The M20 site may contain hyperlinks to third-party sites; M20 does not review or select the content of those sites and is not responsible for their content.',
    },
    {
      h: '18. Disclaimer of Warranties & Limitation of Liability',
      p: 'The Service is provided "as is" and "as available". To the maximum extent permitted by law, M20 disclaims all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. To the maximum extent permitted by law, M20 will not be liable for any indirect, incidental, special, consequential or punitive damages, or for lost profits, lost revenue or lost data. Our total aggregate liability for any claim arising out of or relating to the Service is limited to the amount you paid M20 in the twelve (12) months preceding the claim.',
    },
    {
      h: '19. Contact',
      p: `For any questions regarding these Terms & Conditions, please contact us at ${SUPPORT_EMAIL}.`,
    },
  ],
};

const ar = {
  title: 'الشروط والأحكام',
  effective: `تاريخ السريان: ${EFFECTIVE_DATE}`,
  intro:
    'يسرّ فريق M20 Autopilot بانضمامك إلينا. تحكم هذه الشروط والأحكام ("الشروط") العلاقة التجارية بينك (يشار إليك بـ"العميل" أو "المستخدم") وبين M20 Autopilot ("M20"، "نحن"، "خدمتنا")، وتحدد حقوق والتزامات كلٍّ من M20 والعميل فيما يتعلق باستخدام خدمة التحسين الآلي المقدّمة عبر منصة M20 الإلكترونية وتطبيقاتها (يُشار إليها مجتمعةً بـ"تقنية M20") والدعم المقدَّم من فريق نجاح العملاء لدينا.',
  sections: [
    {
      h: 'عنّا — تقنية M20 Autopilot وفريقنا',
      p: 'تساعد M20 عملاءها على تحسين العروض الإعلانية في منصات التجارة الإلكترونية (وبالأخص إعلانات أمازون) من خلال تقنيات التعلم الآلي والذكاء الاصطناعي. تقدّم تقنية M20 خدمتين رئيسيتين: (1) التحسين الآلي للحملات الإعلانية اعتمادًا على ACOS المستهدف الذي يحدده المستخدم، حيث تتولى M20 إنشاء الحملات وتحديثها وإيقافها تلقائيًا في منصات التجارة الإلكترونية؛ و(2) عرض الأداء عبر لوحة تحكم تتيح متابعة نتائج الحملات بصورة واضحة. نوفّر للعملاء الوصول إلى التقنية لفرقهم عبر حساب مستخدم يتيح ضبط استراتيجيات الشراء الإعلامي، ومتابعة الإجراءات التي تنفّذها تقنية M20، وعرض النتائج. لأي استفسار حول هذه الشروط، تواصل معنا عبر ' + SUPPORT_EMAIL + '.',
    },
    {
      h: 'الدعم الفني',
      p: `يتوفّر الدعم من الأحد إلى الخميس، من الساعة 9:00 صباحًا حتى 6:00 مساءً بتوقيت الرياض، عبر البريد الإلكتروني ${SUPPORT_EMAIL}. يحق لأي مستخدم تقديم شكوى مكتوبة بشأن تشغيل المنصة أو أي محتوى منشور عليها إلى ${SUPPORT_EMAIL} مع جميع التفاصيل ذات الصلة. ستُعالج الشكاوى في أقرب وقت ممكن، وسترد M20 خلال مدة أقصاها عشرة (10) أيام تقويمية.`,
    },
    {
      h: 'اللغة',
      p: 'حُرّرت هذه الشروط والأحكام باللغتين الإنجليزية والعربية. في حال وجود اختلاف بين النسختين، تُعتمد النسخة الإنجليزية في تطبيق وتفسير الشروط.',
    },
    {
      h: 'القانون الحاكم — الاختصاص القضائي',
      p: 'تخضع هذه الشروط والأحكام لأنظمة المملكة العربية السعودية، دون اعتبار لمبادئ تنازع القوانين. وفي حال نشوء أي نزاع، تختص حصريًا محاكم مدينة الرياض في المملكة العربية السعودية بالنظر فيه.',
    },
    {
      h: 'حقوق الملكية الفكرية',
      p: 'تمنح M20 العميل وأي مستخدم مشمول باشتراكه، طوال مدة الاشتراك، ترخيصًا غير حصري وغير قابل للنقل أو التحويل للوصول إلى تقنية M20 واستخدامها ضمن حدود الخدمات المشتركة، حول العالم، وفقًا لباقي أحكام هذه الشروط. يُقرّ العميل وأي مستخدم بأنه لا يكتسب أي حقوق على الإطلاق في الشيفرة المصدرية أو الكائنية لتقنية M20، التي تظل ملكًا حصريًا لـ M20. جميع المحتويات المنشورة على منصة M20 محمية وملك حصري لـ M20، وأي استنساخ أو عرض أو استخدام دون إذن صريح يُعد محظورًا.',
    },
    {
      h: 'القوة القاهرة',
      p: 'لا تتحمل M20 ولا العميل ولا أي مستخدم المسؤولية عن أي إخفاق أو تأخّر في تنفيذ التزاماته بموجب هذه الشروط في حالات القوة القاهرة. ويحق لـ M20 في مثل هذه الحالات تعليق الوصول إلى المنصة والخدمات فورًا دون أن يرتّب ذلك أي مسؤولية. يُقصد بـ"القوة القاهرة" أي حدث غير متوقع وخارج عن إرادة الأطراف، ومنها الكوارث الطبيعية، والحروب أو الإرهاب، والإجراءات الحكومية، والانقطاعات الكبيرة في البنية التحتية للإنترنت أو في واجهات الأطراف الخارجية (بما فيها أمازون).',
    },
    {
      h: '1. القبول',
      p: 'يُعدّ قبول هذه الشروط شرطًا جوهريًا وإلزاميًا لاستخدام تقنية M20 وخدماتها. تُقرّ صراحةً بأنك قرأت هذه الشروط وفهمتها ووافقت عليها، وأنها تنطبق على جميع الخدمات التي تؤدّيها M20 للعميل. تسود هذه الشروط على أي بنود مخالفة قد ترد في أي وثيقة صادرة عن العميل.',
    },
    {
      h: '2. التعديلات',
      p: 'الشروط السارية على العميل هي تلك المعمول بها في تاريخ الاشتراك. لا تنطبق أي تعديلات تجريها M20 على اشتراك جارٍ ما لم يوافق العميل صراحةً عليها. ننصح بحفظ و/أو طباعة هذه الشروط للرجوع إليها عند الحاجة. يُعدّ استمرار استخدام المنصة بعد تحديث الشروط قبولًا للنسخة المحدّثة.',
    },
    {
      h: '3. التسعير والدفع',
      p: 'استخدام تقنية M20 خدمة مدفوعة عبر اشتراك. تقدّم M20 حاليًا خططًا مجانية و Pro و Enterprise. الأسعار مقومة بالدولار الأمريكي والريال السعودي ولا تشمل الضرائب؛ وتُضاف ضريبة القيمة المضافة المعمول بها بناءً على بيانات الفوترة المقدّمة من العميل. الاشتراكات شهرية أو سنوية. تُحصَّل الرسوم الثابتة في اليوم الأول من الاشتراك وفي كل تاريخ تجديد. يمكن الدفع عبر بطاقات الائتمان أو الخصم أو محافظ الدفع المدعومة، أو – لعملاء Enterprise – عبر التحويل البنكي (IBAN) مقابل فاتورة رسمية. تحتفظ M20 بحقها في تعديل الأسعار في أي وقت، مع استمرار سريان السعر المتعاقد عليه عند الاشتراك حتى نهاية الفترة الحالية. يُبلَّغ العميل بالأسعار الجديدة المطبّقة عند التجديد التلقائي مسبقًا.',
    },
    {
      h: '4. الفوترة وعدم السداد',
      p: `يوافق العميل على استلام الفواتير بصيغة إلكترونية، ويلتزم بتقديم بيانات فوترة دقيقة لتمكين M20 من احتساب الضرائب المطبّقة. تُسحب المدفوعات تلقائيًا في تاريخ تجديد الاشتراك. في حال عدم السداد، نرسل تذكيرًا عبر البريد الإلكتروني. وإذا لم يسدّد العميل اشتراكه خلال خمسة (5) أيام تقويمية بعد تاريخ التجديد، نقوم بتعليق الوصول إلى تقنية M20 وإيقاف جميع عمليات التحسين، مع استحقاق المبلغ المقابل للفترة المتبقية من الاشتراك. في حال واجه العميل صعوبة في السداد، يمكنه التواصل معنا عبر ${BILLING_EMAIL} لتسوية وضعه.`,
    },
    {
      h: '5. المدة والتجديد التلقائي',
      p: 'الاشتراكات شهرية أو سنوية. أي فترة اشتراك تبدأ تُحتسب كاملةً. يكون التجديد ضمنيًا وتلقائيًا ما لم يُلغِه العميل وفقًا لهذه الشروط. عند التجديد، يُمدَّد العقد لفترة مساوية للفترة الأصلية التي اختارها العميل.',
    },
    {
      h: '6. الإنهاء',
      p: 'يمكن إنهاء الاشتراك من قِبَل العميل أو من قِبَل M20. (أ) الإنهاء من قِبَل العميل: للاشتراكات الشهرية، يجب الإلغاء قبل سبعة (7) أيام تقويمية على الأقل من تاريخ التجديد، وينتهي الاشتراك في آخر يوم من الفترة الشهرية. للاشتراكات السنوية، يجب الإلغاء قبل ثلاثين (30) يومًا تقويميًا. يمكن تقديم طلب الإلغاء من صفحة الاشتراكات داخل لوحة التحكم أو عبر البريد الإلكتروني ' + SUPPORT_EMAIL + '. (ب) الإنهاء من قِبَل M20: تحتفظ M20 بحقها في إنهاء اشتراك العميل في أي وقت ودون إجراءات شكلية، خاصةً إذا كان لديها أسباب معقولة للاعتقاد بأن العميل لم يلتزم بهذه الشروط (لا سيما التزامات الدفع)، أو عُلّق حسابه على إعلانات أمازون أو أُغلق، أو قدّم بيانات هوية مغلوطة، أو تصرّف بشكل غير لائق أو غير قانوني على المنصة.',
    },
    {
      h: '7. التزامات العميل المحددة',
      p: 'يلتزم العميل بـ: (1) ممارسة نشاط تجاري قانوني وفق الأنظمة المعمول بها وشروط منصات التجارة الإلكترونية المستخدمة؛ (2) تفويض M20 بحقوق الوصول إلى منصة التجارة الإلكترونية اللازمة لتشغيل الخدمة (لا سيما واجهات Amazon Advertising وSelling Partner)؛ (3) منح حق استخدام خدمة M20 لأي مستخدم مفوّض بإدارة الحملات الإعلانية. العميل مسؤول عن تصرفات مستخدميه ويتحمّل مسؤولية إزالة صلاحيات المستخدمين الذين لم تعد ثمة حاجة لاستخدامهم خدمة M20.',
    },
    {
      h: '8. مسؤوليات M20',
      p: 'تبذل M20 قصارى جهدها لتقديم خدمة عالية الجودة لعملائها. تقتصر مسؤولية M20 تجاه العميل على الأضرار المباشرة المثبتة المنسوبة مباشرةً إلى M20، وتُحدَّد في جميع الأحوال بالمبلغ الذي دفعه العميل مقابل الخدمة خلال الستة (6) أشهر السابقة لتقديم المطالبة. لا تتحمل M20 المسؤولية عن أي أضرار غير مباشرة، بما فيها فقدان الإيرادات أو الأرباح أو الإضرار بالعلامة التجارية أو زيادة المصروفات الإعلانية. كما لا تتحمل المسؤولية عن الأضرار الناجمة عن سوء استخدام الخدمات من قِبَل العميل، أو أفعال الغير، أو أعطال أي منصة تجارة إلكترونية (بما فيها تغييرات واجهات أمازون)، أو عدم التزام العميل بأنظمة حماية البيانات الشخصية. يُقرّ العميل بأن حسن سير M20 يخضع لشروط الوصول إلى الإنترنت على نفقته.',
    },
    {
      h: '9. مستوى الخدمة',
      p: 'تتوفر تقنية M20 على مدار الساعة طوال أيام الأسبوع ضمن آلية وصول مُتحكَّم بها، باستثناء فترات الصيانة. تبذل M20 قصارى جهدها لضمان توافر مثالي للخدمة. في حالات الطوارئ أو القوة القاهرة أو الأعطال أو مشاكل شبكات الاتصال، قد يُقطع الوصول إلى تقنية M20 مؤقتًا لإجراء صيانة عاجلة أو نسخ احتياطي أو تحسينات. لا تترتّب على هذه الانقطاعات أي تعويضات للعميل.',
    },
    {
      h: '10. السرية',
      p: 'يتعهّد العميل و M20 بالتعامل مع جميع الوثائق والمعلومات المتبادلة بصفتها سرية للغاية، وعدم الإفصاح عن أي جزء منها لأي طرف ثالث دون موافقة مسبقة من الطرف الآخر، باستثناء ما يفرضه القانون أو السلطات المختصة. يلتزم كل طرف بقصر تداول المعلومات السرية على موظفيه الذين يستلزم عملهم ذلك، وبإبلاغهم مسبقًا بطبيعتها السرية، وفرض التزامات السرية ذاتها عليهم.',
    },
    {
      h: '11. الإشارات التسويقية',
      p: 'يمنح العميل M20 الحق في استخدام اسم شركته وشعارها كمرجع لأغراض التسويق أو الترويج على موقع M20 وفي الاتصالات العامة أو الخاصة الأخرى مع العملاء الحاليين أو المحتملين، مع مراعاة أي إرشادات للعلامة التجارية يقدمها العميل. إذا لم يرغب العميل في الإشارة إليه كمرجع، يمكنه إرسال طلب صريح في أي وقت إلى ' + SUPPORT_EMAIL + '.',
    },
    {
      h: '12. إدارة حساب المستخدم',
      p: `للوصول إلى منصة M20، يُسجّل المستخدمون الدخول ببريدهم الإلكتروني وكلمة المرور التي حدّدوها عند التسجيل. يلتزم المستخدم بتقديم بيانات صحيحة ودقيقة ومحدّثة، وعدم استخدام أسماء أو عناوين مزيّفة. كل مستخدم مسؤول وحده عن سرّية بيانات الدخول، ومسؤول وحده عن أي وصول يتم بحسابه ما لم يَثبُت احتيال. يلتزم المستخدمون بعدم إتاحة أو توزيع أي محتوى غير مشروع أو تشهيري أو ضار (كالفيروسات). يمكن للمستخدم في أي وقت طلب تعديل بيانات المصادقة أو حذف الحساب عبر إرسال بريد إلكتروني إلى ${SUPPORT_EMAIL}. تُتمّ M20 إجراءات الحذف خلال خمسة (5) أيام تقويمية. كما يحق لـ M20 إغلاق أي حساب غير نشط لأكثر من اثني عشر (12) شهرًا بعد إشعار غير مُجاب عليه خلال ثلاثين (30) يومًا.`,
    },
    {
      h: '13. توافر الموقع والخدمات',
      p: 'المنصة متاحة للمستخدمين بشكل دائم، باستثناء حالات القوة القاهرة أو الأعطال التقنية أو مشاكل شبكات الاتصال. قد توقف M20 الوصول لإجراء عمليات صيانة أو نسخ احتياطي أو تحسين. لا تُرتّب فترات الصيانة وانقطاع الخدمة أي تعويض للمستخدم أو العميل. يحق للمستخدم استخدام تقنية M20 ما دام للعميل اشتراك ساري المفعول.',
    },
    {
      h: '14. التزامات المستخدم وتوصيات الذكاء الاصطناعي',
      p: 'الوصول إلى تقنية M20 مسؤولية حصرية للشخص الذي يتصل بها. على كل مستخدم: (1) اتخاذ كافة التدابير المناسبة لحماية بياناته ومعداته؛ (2) الالتزام بجميع الأنظمة المعمول بها؛ (3) الاستخدام المعقول وحسن النية للخدمات؛ (4) اختيار المعلمات اللازمة لخوارزمية M20 بعناية، خصوصًا ACOS المستهدف، وحدود الميزانية، وقواعد الأتمتة. تستخدم M20 منطقًا قائمًا على القواعد ونماذج لغوية كبيرة (مثل عائلة GPT-4o) لتوليد التوصيات. قد تحتوي مخرجات الذكاء الاصطناعي على أخطاء، لذلك يُرجى دائمًا مراجعة التوصيات قبل تطبيقها. الإجراءات التلقائية، عند تفعيلها، تُنفَّذ ضمن الحدود التي يضبطها المستخدم. لا تضمن M20 أي نتائج إعلانية محدّدة كـ ROAS أو ACOS أو الإيرادات.',
    },
    {
      h: '15. الخصوصية والبيانات الشخصية',
      p: `بعض البيانات الشخصية المحدّدة كإلزامية في نماذجنا ضرورية لاستخدام منصة وخدمات M20، وقد تشمل: الاسم الكامل، البريد الإلكتروني، بيانات الفوترة، وتفضيل اللغة. قد تُسجّل M20 أنشطة المستخدم (تسجيلات الدخول، الإجراءات المتخذة في المنصة، الإجراءات التي تنفّذها تقنية M20 نيابةً عنه) لأغراض أمنية وتشغيلية. يُحتفظ بسجل هذه الأنشطة بشكل قابل للتحديد لمدة أقصاها سنة (1) واحدة، ويُتلَف نهائيًا عند حذف الحساب. تلتزم M20 بحماية البيانات الشخصية للمستخدمين، وتمتثل لأنظمة حماية البيانات المعمول بها (بما فيها نظام حماية البيانات الشخصية السعودي PDPL ولائحة GDPR الأوروبية حيثما انطبقت). للمستخدمين الحق في الوصول إلى بياناتهم وتصحيحها وتقييد معالجتها والاعتراض عليها وسحب الموافقة وطلب الحذف، ويمكن ممارسة هذه الحقوق في أي وقت عبر التواصل مع ${SUPPORT_EMAIL}. لمزيد من التفاصيل يُرجى مراجعة `,
      link: { href: '/privacy', en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
    },
    {
      h: '16. الربط بأمازون',
      p: 'عند ربط حساب أمازون الإعلاني، فإنك تأذن لـ M20 بالوصول إلى بيانات الحملات والكلمات المفتاحية والمنتجات والتقارير نيابةً عنك عبر واجهات أمازون الرسمية. يمكنك سحب هذا الإذن في أي وقت من حساب أمازون أو من صفحة الإعدادات في M20. لا تخزّن M20 كلمة مرور أمازون. تعمل M20 ضمن حدود الصلاحيات التي تمنحها أمازون، ولا تتحمل المسؤولية عن أي تعديلات أو تغييرات تقنية أو قيود تفرضها أمازون على واجهاتها.',
    },
    {
      h: '17. ملفات تعريف الارتباط والروابط الخارجية',
      p: 'عند تصفّح المستخدم لتقنية M20 أو مواقعها، قد تُسجَّل أو تُقرأ معلومات على جهازه عبر ملفات تعريف الارتباط بحسب اختيارات متصفّحه. تتيح هذه الملفات التعرّف على الجهاز وتحسين تجربة الاستخدام. قد يحتوي موقع M20 على روابط لمواقع طرف ثالث؛ ولا تراجع M20 محتوى هذه المواقع ولا تتحمل المسؤولية عنها.',
    },
    {
      h: '18. إخلاء الضمانات وحدود المسؤولية',
      p: 'تُقدَّم الخدمة "كما هي" و"حسب التوفر". إلى أقصى حد يسمح به القانون، تخلي M20 مسؤوليتها من جميع الضمانات الصريحة أو الضمنية بما فيها القابلية للتسويق والملاءمة لغرض معين وعدم الانتهاك. وإلى أقصى حد يسمح به القانون، لن تكون M20 مسؤولة عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية أو عقابية، أو عن خسائر الأرباح أو الإيرادات أو البيانات. تقتصر مسؤوليتنا الإجمالية عن أي مطالبة على المبلغ الذي دفعته لـ M20 خلال الاثني عشر (12) شهرًا السابقة للمطالبة.',
    },
    {
      h: '19. التواصل',
      p: `لأي استفسار حول هذه الشروط والأحكام، يُرجى التواصل معنا عبر ${SUPPORT_EMAIL}.`,
    },
  ],
};

type Section = { h: string; p: string; link?: { href: string; en: string; ar: string } };

export default function TermsOfService() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const t = lang === 'ar' ? ar : en;
  const isAr = lang === 'ar';

  return (
    <>
      <Head>
        <title>Terms & Conditions — M20 Autopilot</title>
        <meta name="description" content="Terms & Conditions for M20 Autopilot, an Amazon Advertising optimization SaaS platform." />
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
            lineHeight: 1.85,
            marginBottom: 32,
            padding: '16px 20px',
            background: 'rgba(0,217,255,0.04)',
            border: '1px solid rgba(0,217,255,0.18)',
            borderRadius: 12,
          }}>{t.intro}</p>

          {(t.sections as Section[]).map((s, i) => (
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
                lineHeight: 1.9,
              }}>
                {s.p}
                {s.link && (
                  <>
                    <Link href={s.link.href} style={{ color: '#00d9ff', textDecoration: 'underline' }}>
                      {isAr ? s.link.ar : s.link.en}
                    </Link>
                    {'.'}
                  </>
                )}
              </p>
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
