export const kpiData = {
  totalSpend: 45230,
  totalSales: 187450,
  roas: 4.14,
  acos: 24.1,
  ctr: 3.2,
  activeCampaigns: 18,
};

export const salesChartData = [
  { name: 'يناير', sales: 12000, spend: 3200 },
  { name: 'فبراير', sales: 15000, spend: 3800 },
  { name: 'مارس', sales: 18000, spend: 4200 },
  { name: 'أبريل', sales: 22000, spend: 5100 },
  { name: 'مايو', sales: 19000, spend: 4500 },
  { name: 'يونيو', sales: 25000, spend: 5800 },
  { name: 'يوليو', sales: 28000, spend: 6200 },
  { name: 'أغسطس', sales: 31000, spend: 6800 },
  { name: 'سبتمبر', sales: 27000, spend: 5900 },
  { name: 'أكتوبر', sales: 33000, spend: 7100 },
  { name: 'نوفمبر', sales: 38000, spend: 8200 },
  { name: 'ديسمبر', sales: 42000, spend: 9400 },
];

export const bestCampaigns = [
  { name: 'حملة المنتج الرئيسي', roas: 6.2, sales: 34500, acos: 16.1 },
  { name: 'حملة العروض الموسمية', roas: 5.8, sales: 28900, acos: 17.2 },
  { name: 'حملة المنتجات الجديدة', roas: 5.1, sales: 22300, acos: 19.6 },
];

export const worstCampaigns = [
  { name: 'حملة الكلمات العامة', roas: 1.2, sales: 3200, acos: 83.3 },
  { name: 'حملة المنافسين', roas: 1.5, sales: 4100, acos: 66.7 },
  { name: 'حملة الاستكشاف', roas: 1.8, sales: 5600, acos: 55.6 },
];

export const campaigns = [
  { id: 1, name: 'حملة المنتج الرئيسي', status: 'active', budget: 5000, spend: 3450, sales: 21200, roas: 6.14, acos: 16.3, ctr: 4.2, type: 'Sponsored Products' },
  { id: 2, name: 'حملة العروض الموسمية', status: 'active', budget: 3000, spend: 2100, sales: 12180, roas: 5.8, acos: 17.2, ctr: 3.8, type: 'Sponsored Products' },
  { id: 3, name: 'حملة المنتجات الجديدة', status: 'active', budget: 4000, spend: 2800, sales: 14280, roas: 5.1, acos: 19.6, ctr: 3.5, type: 'Sponsored Brands' },
  { id: 4, name: 'حملة العلامة التجارية', status: 'active', budget: 2000, spend: 1200, sales: 8400, roas: 7.0, acos: 14.3, ctr: 5.1, type: 'Sponsored Brands' },
  { id: 5, name: 'حملة الكلمات العامة', status: 'paused', budget: 3500, spend: 2800, sales: 3360, roas: 1.2, acos: 83.3, ctr: 1.1, type: 'Sponsored Products' },
  { id: 6, name: 'حملة المنافسين', status: 'paused', budget: 2500, spend: 1900, sales: 2850, roas: 1.5, acos: 66.7, ctr: 1.4, type: 'Sponsored Products' },
  { id: 7, name: 'حملة الاستكشاف', status: 'active', budget: 1500, spend: 980, sales: 1764, roas: 1.8, acos: 55.6, ctr: 2.0, type: 'Sponsored Display' },
  { id: 8, name: 'حملة إعادة الاستهداف', status: 'active', budget: 2000, spend: 1400, sales: 9800, roas: 7.0, acos: 14.3, ctr: 4.8, type: 'Sponsored Display' },
  { id: 9, name: 'حملة الفيديو', status: 'active', budget: 3000, spend: 2200, sales: 11000, roas: 5.0, acos: 20.0, ctr: 3.2, type: 'Sponsored Brands Video' },
  { id: 10, name: 'حملة رمضان', status: 'paused', budget: 8000, spend: 6500, sales: 39000, roas: 6.0, acos: 16.7, ctr: 4.5, type: 'Sponsored Products' },
];

export const keywords = [
  { id: 1, keyword: 'عطر رجالي فاخر', campaign: 'حملة المنتج الرئيسي', cpc: 2.5, ctr: 4.8, conversions: 120, acos: 15.2, roas: 6.58, status: 'active', recommendation: 'زيادة العرض بنسبة 15%' },
  { id: 2, keyword: 'كريم مرطب طبيعي', campaign: 'حملة المنتجات الجديدة', cpc: 1.8, ctr: 3.5, conversions: 85, acos: 18.4, roas: 5.43, status: 'active', recommendation: 'الحفاظ على العرض الحالي' },
  { id: 3, keyword: 'سماعات بلوتوث', campaign: 'حملة العروض الموسمية', cpc: 3.2, ctr: 5.1, conversions: 200, acos: 12.8, roas: 7.81, status: 'active', recommendation: 'زيادة الميزانية' },
  { id: 4, keyword: 'حقيبة سفر', campaign: 'حملة الكلمات العامة', cpc: 4.1, ctr: 0.8, conversions: 5, acos: 92.0, roas: 1.09, status: 'paused', recommendation: 'إيقاف الكلمة المفتاحية' },
  { id: 5, keyword: 'ساعة ذكية', campaign: 'حملة المنافسين', cpc: 5.5, ctr: 1.2, conversions: 12, acos: 78.5, roas: 1.27, status: 'active', recommendation: 'تقليل العرض بنسبة 40%' },
  { id: 6, keyword: 'زيت أرغان للشعر', campaign: 'حملة المنتج الرئيسي', cpc: 1.2, ctr: 6.2, conversions: 95, acos: 10.5, roas: 9.52, status: 'active', recommendation: 'زيادة العرض بنسبة 25%' },
  { id: 7, keyword: 'واقي شمس', campaign: 'حملة المنتجات الجديدة', cpc: 2.0, ctr: 3.8, conversions: 60, acos: 22.1, roas: 4.52, status: 'active', recommendation: 'تقليل العرض بنسبة 10%' },
  { id: 8, keyword: 'مكنسة كهربائية', campaign: 'حملة الاستكشاف', cpc: 6.0, ctr: 1.5, conversions: 8, acos: 85.0, roas: 1.18, status: 'paused', recommendation: 'إيقاف الكلمة المفتاحية' },
];

export const recommendations = [
  { id: 1, type: 'reduce_bid', campaign: 'حملة المنافسين', keyword: 'ساعة ذكية', reason: 'تكلفة النقرة مرتفعة جداً مع معدل تحويل منخفض. تقليل العرض سيحسن ACOS بنسبة كبيرة.', impact: 'توفير ~٢٠٠ ريال شهرياً', priority: 'high', icon: 'TrendingDown' },
  { id: 2, type: 'increase_budget', campaign: 'حملة المنتج الرئيسي', keyword: null, reason: 'الحملة تحقق ROAS ممتاز (6.14) والميزانية تنفد قبل نهاية اليوم. زيادة الميزانية ستزيد المبيعات.', impact: 'زيادة المبيعات ~٥,٠٠٠ ريال شهرياً', priority: 'high', icon: 'TrendingUp' },
  { id: 3, type: 'pause_keyword', campaign: 'حملة الكلمات العامة', keyword: 'حقيبة سفر', reason: 'ACOS يتجاوز 90% مع 5 تحويلات فقط خلال 30 يوم. الكلمة غير مربحة.', impact: 'توفير ~٣٥٠ ريال شهرياً', priority: 'critical', icon: 'PauseCircle' },
  { id: 4, type: 'add_keyword', campaign: 'حملة المنتج الرئيسي', keyword: 'عطر رجالي هدية', reason: 'كلمة مفتاحية مقترحة بناءً على تحليل المنافسين. حجم بحث مرتفع ومنافسة متوسطة.', impact: 'زيادة الظهور ~٣٠%', priority: 'medium', icon: 'Plus' },
  { id: 5, type: 'improve_structure', campaign: 'حملة الاستكشاف', keyword: null, reason: 'الحملة تحتوي على كلمات مفتاحية متنوعة جداً. فصلها إلى مجموعات إعلانية متخصصة سيحسن الأداء.', impact: 'تحسين ACOS بنسبة ~١٥%', priority: 'medium', icon: 'Settings' },
  { id: 6, type: 'increase_bid', campaign: 'حملة المنتج الرئيسي', keyword: 'زيت أرغان للشعر', reason: 'الكلمة تحقق أفضل ROAS (9.52) في الحساب. زيادة العرض ستزيد حصتك من الظهور.', impact: 'زيادة المبيعات ~٢,٠٠٠ ريال شهرياً', priority: 'high', icon: 'TrendingUp' },
];

export const alerts = [
  { id: 1, type: 'roas_drop', title: 'انخفاض ROAS', message: 'انخفض ROAS لحملة "حملة المنافسين" من 2.5 إلى 1.5 خلال آخر 7 أيام', severity: 'critical', time: 'منذ ساعة', read: false },
  { id: 2, type: 'acos_increase', title: 'ارتفاع ACOS', message: 'ارتفع ACOS لحملة "حملة الكلمات العامة" إلى 83.3% وهو أعلى من الهدف المحدد (35%)', severity: 'critical', time: 'منذ ساعتين', read: false },
  { id: 3, type: 'no_sales', title: 'لا مبيعات', message: 'لم تسجل حملة "حملة الاستكشاف" أي مبيعات خلال آخر 48 ساعة رغم إنفاق 180 ريال', severity: 'warning', time: 'منذ 3 ساعات', read: false },
  { id: 4, type: 'budget_alert', title: 'الميزانية على وشك النفاد', message: 'ميزانية حملة "حملة المنتج الرئيسي" استُهلكت بنسبة 92% ولم ينتهِ اليوم بعد', severity: 'warning', time: 'منذ 4 ساعات', read: true },
  { id: 5, type: 'performance_up', title: 'تحسن في الأداء', message: 'تحسن ROAS لحملة "حملة العلامة التجارية" بنسبة 25% هذا الأسبوع', severity: 'success', time: 'منذ 5 ساعات', read: true },
  { id: 6, type: 'new_competitor', title: 'منافس جديد', message: 'تم رصد منافس جديد يستهدف كلمة "عطر رجالي فاخر" بعروض أسعار مرتفعة', severity: 'info', time: 'منذ 6 ساعات', read: true },
];

export const auditLog = [
  { id: 1, action: 'تعديل العرض', target: 'كلمة "سماعات بلوتوث"', details: 'تم زيادة العرض من 2.8 إلى 3.2 ريال', reason: 'ROAS ممتاز والكلمة تحقق أداءً عالياً', date: '2026-03-08 14:30', source: 'النظام الذكي' },
  { id: 2, action: 'إيقاف كلمة مفتاحية', target: 'كلمة "مكنسة كهربائية"', details: 'تم إيقاف الكلمة المفتاحية', reason: 'ACOS يتجاوز 85% مع تحويلات منخفضة جداً', date: '2026-03-08 12:15', source: 'النظام الذكي' },
  { id: 3, action: 'زيادة الميزانية', target: 'حملة "حملة المنتج الرئيسي"', details: 'تم زيادة الميزانية من 4,000 إلى 5,000 ريال', reason: 'الميزانية تنفد قبل نهاية اليوم والحملة تحقق نتائج ممتازة', date: '2026-03-07 16:45', source: 'أحمد محمد' },
  { id: 4, action: 'إضافة كلمة مفتاحية', target: 'حملة "حملة المنتجات الجديدة"', details: 'تم إضافة كلمة "كريم مرطب عضوي"', reason: 'كلمة مقترحة من تحليل المنافسين بحجم بحث مرتفع', date: '2026-03-07 10:20', source: 'النظام الذكي' },
  { id: 5, action: 'تعديل الاستهداف', target: 'حملة "حملة إعادة الاستهداف"', details: 'تم تضييق الجمهور المستهدف', reason: 'تحسين معدل التحويل بالتركيز على الزوار الأكثر اهتماماً', date: '2026-03-06 09:00', source: 'أحمد محمد' },
  { id: 6, action: 'إيقاف حملة', target: 'حملة "حملة رمضان"', details: 'تم إيقاف الحملة مؤقتاً', reason: 'انتهاء موسم رمضان', date: '2026-03-05 18:30', source: 'أحمد محمد' },
];

export const stores = [
  { id: 1, name: 'متجر الجمال العربي', marketplace: 'Amazon.sa', status: 'connected', lastSync: '2026-03-08 14:30', totalSales: 125000, activeCampaigns: 8, health: 92 },
  { id: 2, name: 'متجر التقنية', marketplace: 'Amazon.ae', status: 'connected', lastSync: '2026-03-08 13:45', totalSales: 78000, activeCampaigns: 6, health: 85 },
  { id: 3, name: 'متجر المنزل', marketplace: 'Amazon.sa', status: 'disconnected', lastSync: '2026-03-01 09:00', totalSales: 45000, activeCampaigns: 0, health: 0 },
];

export const notifications = [
  { id: 1, title: 'تنبيه أداء', message: 'انخفض ROAS لحملة المنافسين', time: 'منذ دقيقتين', read: false },
  { id: 2, title: 'توصية ذكية', message: 'يوجد 3 توصيات جديدة لتحسين الأداء', time: 'منذ 15 دقيقة', read: false },
  { id: 3, title: 'مزامنة ناجحة', message: 'تم مزامنة بيانات متجر الجمال العربي', time: 'منذ ساعة', read: false },
  { id: 4, title: 'تحديث الاشتراك', message: 'اشتراكك Pro سيتجدد خلال 5 أيام', time: 'منذ 3 ساعات', read: true },
  { id: 5, title: 'تحسين تلقائي', message: 'تم تطبيق 2 توصيات تلقائياً', time: 'منذ 5 ساعات', read: true },
];

export const subscriptionPlans = [
  {
    name: 'Starter',
    nameAr: 'المبتدئ',
    monthlyPrice: 199,
    yearlyPrice: 1990,
    features: ['متجر واحد', 'حتى 10 حملات', 'تقارير أساسية', 'تنبيهات بريد إلكتروني', 'دعم بالبريد الإلكتروني'],
    current: false,
  },
  {
    name: 'Pro',
    nameAr: 'الاحترافي',
    monthlyPrice: 499,
    yearlyPrice: 4990,
    features: ['حتى 3 متاجر', 'حملات غير محدودة', 'تقارير متقدمة', 'توصيات ذكية', 'دعم أولوية', 'تحسين تلقائي', 'تصدير التقارير'],
    current: true,
  },
  {
    name: 'Enterprise',
    nameAr: 'المؤسسات',
    monthlyPrice: 999,
    yearlyPrice: 9990,
    features: ['متاجر غير محدودة', 'حملات غير محدودة', 'تقارير مخصصة', 'توصيات ذكية متقدمة', 'مدير حساب مخصص', 'API كامل', 'تحسين تلقائي متقدم', 'تدريب شخصي'],
    current: false,
  },
];

export const helpSections = [
  {
    title: 'البدء السريع',
    articles: [
      { title: 'كيف أبدأ باستخدام أدفلو؟', content: 'قم بتسجيل الدخول، ثم اربط حسابك على أمازون من صفحة "ربط أمازون". بعد المزامنة الأولى، ستظهر بياناتك في لوحة التحكم.' },
      { title: 'ما هي المتطلبات الأساسية؟', content: 'تحتاج إلى حساب بائع نشط على أمازون مع حملات إعلانية قائمة.' },
    ]
  },
  {
    title: 'ربط حساب أمازون',
    articles: [
      { title: 'كيف أربط حسابي على أمازون؟', content: 'اذهب إلى صفحة "ربط أمازون" واضغط على زر "ربط الحساب". ستتم إعادة توجيهك إلى أمازون لمنح الصلاحيات اللازمة.' },
      { title: 'ما هي الصلاحيات المطلوبة؟', content: 'نحتاج صلاحيات قراءة بيانات الإعلانات وإدارة الحملات فقط. لا نصل إلى بيانات المنتجات أو الطلبات.' },
    ]
  },
  {
    title: 'مقاييس الإعلانات',
    articles: [
      { title: 'ما هو ACOS؟', content: 'ACOS (تكلفة الإعلان كنسبة من المبيعات) = إنفاق الإعلان ÷ مبيعات الإعلان × 100. كلما انخفض ACOS، كانت الحملة أكثر ربحية.' },
      { title: 'ما هو ROAS؟', content: 'ROAS (العائد على الإنفاق الإعلاني) = مبيعات الإعلان ÷ إنفاق الإعلان. ROAS أعلى يعني عائد أفضل. مثلاً ROAS 5 يعني كل ريال إنفاق يحقق 5 ريالات مبيعات.' },
      { title: 'ما هو CTR؟', content: 'CTR (معدل النقر) = عدد النقرات ÷ عدد مرات الظهور × 100. CTR مرتفع يشير إلى أن إعلانك جاذب وملائم للجمهور.' },
    ]
  },
  {
    title: 'التوصيات الذكية',
    articles: [
      { title: 'كيف يعمل نظام التوصيات؟', content: 'يحلل النظام أداء حملاتك وكلماتك المفتاحية بشكل مستمر ويقارنها بأفضل الممارسات والمعايير المثالية لتقديم توصيات مخصصة.' },
      { title: 'هل يمكنني تطبيق التوصيات تلقائياً؟', content: 'نعم، في خطة Pro وEnterprise يمكنك تفعيل التطبيق التلقائي للتوصيات ذات الثقة العالية.' },
    ]
  },
  {
    title: 'الاشتراكات والفوترة',
    articles: [
      { title: 'كيف أغير خطتي؟', content: 'اذهب إلى صفحة "الاشتراكات" واختر الخطة المناسبة. يمكنك الترقية في أي وقت وسيتم احتساب الفرق بشكل تناسبي.' },
      { title: 'ما هي طرق الدفع المتاحة؟', content: 'نقبل بطاقات Visa و Mastercard و مدى. كما نوفر الدفع عبر التحويل البنكي لخطة Enterprise.' },
    ]
  },
  {
    title: 'الدعم الفني',
    articles: [
      { title: 'كيف أتواصل مع الدعم؟', content: 'يمكنك استخدام المساعد الذكي داخل التطبيق، أو إرسال تذكرة دعم، أو التواصل عبر البريد الإلكتروني support@adflow.sa' },
      { title: 'ما هي ساعات الدعم؟', content: 'الدعم متاح من الأحد إلى الخميس، من 9 صباحاً حتى 6 مساءً بتوقيت السعودية. خطة Enterprise تحصل على دعم 24/7.' },
    ]
  },
];

export const chatMessages = [
  { id: 1, sender: 'user', message: 'ما الفرق بين ACOS و ROAS؟' },
  { id: 2, sender: 'bot', message: 'سؤال ممتاز! ACOS و ROAS هما عكس بعضهما:\n\n• ACOS = الإنفاق ÷ المبيعات × 100 (كلما انخفض كان أفضل)\n• ROAS = المبيعات ÷ الإنفاق (كلما ارتفع كان أفضل)\n\nمثال: إذا أنفقت 100 ريال وحققت 500 ريال مبيعات:\n- ACOS = 20%\n- ROAS = 5.0\n\nالهدف هو خفض ACOS ورفع ROAS.' },
  { id: 3, sender: 'user', message: 'لماذا أوقف النظام كلمة "مكنسة كهربائية"؟' },
  { id: 4, sender: 'bot', message: 'تم إيقاف كلمة "مكنسة كهربائية" للأسباب التالية:\n\n1. ACOS مرتفع جداً: 85% (هدفك 35%)\n2. تحويلات منخفضة: 8 فقط خلال 30 يوم\n3. تكلفة النقرة مرتفعة: 6.0 ريال\n\nالكلمة كانت تستهلك ميزانية كبيرة دون عائد مناسب. إيقافها يوفر حوالي 400 ريال شهرياً يمكن تحويلها لكلمات أكثر ربحية.' },
];

export const reportsData = {
  daily: [
    { date: '8 مارس', spend: 1520, sales: 6840, roas: 4.5, acos: 22.2, orders: 45 },
    { date: '7 مارس', spend: 1380, sales: 5520, roas: 4.0, acos: 25.0, orders: 38 },
    { date: '6 مارس', spend: 1650, sales: 7425, roas: 4.5, acos: 22.2, orders: 52 },
    { date: '5 مارس', spend: 1200, sales: 4800, roas: 4.0, acos: 25.0, orders: 33 },
    { date: '4 مارس', spend: 1480, sales: 6660, roas: 4.5, acos: 22.2, orders: 46 },
  ],
  weekly: [
    { date: 'الأسبوع 1', spend: 9800, sales: 44100, roas: 4.5, acos: 22.2, orders: 310 },
    { date: 'الأسبوع 2', spend: 10200, sales: 51000, roas: 5.0, acos: 20.0, orders: 350 },
    { date: 'الأسبوع 3', spend: 11500, sales: 57500, roas: 5.0, acos: 20.0, orders: 395 },
    { date: 'الأسبوع 4', spend: 13700, sales: 61650, roas: 4.5, acos: 22.2, orders: 420 },
  ],
  monthly: [
    { date: 'يناير', spend: 32000, sales: 128000, roas: 4.0, acos: 25.0, orders: 880 },
    { date: 'فبراير', spend: 38000, sales: 171000, roas: 4.5, acos: 22.2, orders: 1170 },
    { date: 'مارس', spend: 45230, sales: 187450, roas: 4.14, acos: 24.1, orders: 1290 },
  ],
};
