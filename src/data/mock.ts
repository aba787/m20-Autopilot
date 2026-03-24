// ============================
// M20 Autopilot - Mock Data
// ============================

export const kpiData = {
  sales: 187450,
  orders: 1290,
  cost: 45230,
  acos: 24.1,
  clicks: 42800,
  profit: 62800,
  spend: 45230,
  unitsSold: 3840,
};

export const salesChartMonthly = [
  { date: 'يناير', sales: 12000, spend: 3200 },
  { date: 'فبراير', sales: 15000, spend: 3800 },
  { date: 'مارس', sales: 18000, spend: 4200 },
  { date: 'أبريل', sales: 22000, spend: 5100 },
  { date: 'مايو', sales: 19000, spend: 4500 },
  { date: 'يونيو', sales: 25000, spend: 5800 },
  { date: 'يوليو', sales: 28000, spend: 6200 },
  { date: 'أغسطس', sales: 31000, spend: 6800 },
  { date: 'سبتمبر', sales: 27000, spend: 5900 },
  { date: 'أكتوبر', sales: 33000, spend: 7100 },
  { date: 'نوفمبر', sales: 38000, spend: 8200 },
  { date: 'ديسمبر', sales: 42000, spend: 9400 },
];

export const salesChartTwoWeeks = [
  { date: '23 فبراير', sales: 4800, spend: 1100 },
  { date: '24 فبراير', sales: 5200, spend: 1250 },
  { date: '25 فبراير', sales: 4100, spend: 980 },
  { date: '26 فبراير', sales: 6300, spend: 1480 },
  { date: '27 فبراير', sales: 5800, spend: 1350 },
  { date: '28 فبراير', sales: 7100, spend: 1620 },
  { date: '1 مارس', sales: 6500, spend: 1500 },
  { date: '2 مارس', sales: 5900, spend: 1380 },
  { date: '3 مارس', sales: 7800, spend: 1800 },
  { date: '4 مارس', sales: 6200, spend: 1450 },
  { date: '5 مارس', sales: 8100, spend: 1900 },
  { date: '6 مارس', sales: 7400, spend: 1700 },
  { date: '7 مارس', sales: 6900, spend: 1600 },
  { date: '8 مارس', sales: 7600, spend: 1750 },
];

export const campaignBreakdown = [
  { name: 'Sponsored Products', value: 58, fill: '#22c55e' },
  { name: 'Sponsored Brands', value: 25, fill: '#3b82f6' },
  { name: 'Sponsored Display', value: 12, fill: '#f59e0b' },
  { name: 'Video', value: 5, fill: '#8b5cf6' },
];

export const campaigns = [
  { id: 1, name: 'SP - منتج رئيسي - دقيق', status: 'active', type: 'Sponsored Products', budget: 5000, spend: 3450, sales: 21200, roas: 6.14, acos: 16.3, ctr: 4.2, clicks: 4820, impressions: 114762, orders: 145 },
  { id: 2, name: 'SP - عروض موسمية', status: 'active', type: 'Sponsored Products', budget: 3000, spend: 2100, sales: 12180, roas: 5.8, acos: 17.2, ctr: 3.8, clicks: 3200, impressions: 84210, orders: 88 },
  { id: 3, name: 'SB - علامة تجارية', status: 'active', type: 'Sponsored Brands', budget: 4000, spend: 2800, sales: 14280, roas: 5.1, acos: 19.6, ctr: 3.5, clicks: 2900, impressions: 82857, orders: 76 },
  { id: 4, name: 'SB - منتجات جديدة', status: 'active', type: 'Sponsored Brands', budget: 2000, spend: 1200, sales: 8400, roas: 7.0, acos: 14.3, ctr: 5.1, clicks: 2100, impressions: 41176, orders: 58 },
  { id: 5, name: 'SP - كلمات عامة', status: 'paused', type: 'Sponsored Products', budget: 3500, spend: 2800, sales: 3360, roas: 1.2, acos: 83.3, ctr: 1.1, clicks: 1800, impressions: 163636, orders: 12 },
  { id: 6, name: 'SP - استهداف منافسين', status: 'paused', type: 'Sponsored Products', budget: 2500, spend: 1900, sales: 2850, roas: 1.5, acos: 66.7, ctr: 1.4, clicks: 1400, impressions: 100000, orders: 10 },
  { id: 7, name: 'SD - إعادة استهداف', status: 'active', type: 'Sponsored Display', budget: 2000, spend: 1400, sales: 9800, roas: 7.0, acos: 14.3, ctr: 4.8, clicks: 2450, impressions: 51041, orders: 55 },
  { id: 8, name: 'SD - اكتشاف', status: 'active', type: 'Sponsored Display', budget: 1500, spend: 980, sales: 1764, roas: 1.8, acos: 55.6, ctr: 2.0, clicks: 820, impressions: 41000, orders: 8 },
  { id: 9, name: 'SBV - فيديو', status: 'active', type: 'Sponsored Brands Video', budget: 3000, spend: 2200, sales: 11000, roas: 5.0, acos: 20.0, ctr: 3.2, clicks: 1900, impressions: 59375, orders: 62 },
  { id: 10, name: 'SP - رمضان 2025', status: 'paused', type: 'Sponsored Products', budget: 8000, spend: 6500, sales: 39000, roas: 6.0, acos: 16.7, ctr: 4.5, clicks: 9800, impressions: 217777, orders: 265 },
];

export const products = [
  { id: 1, name: 'وسادة نوم فاخرة - مضادة للحساسية - مقاس كبير', asin: 'B0CK82XYLP', brand: 'LuxeSleep', price: 189, sales: 34500, cost: 8200, profit: 12400, units: 182, acos: 23.7, status: 'active', keywords: ['وسادة نوم', 'وسادة فاخرة', 'وسادة مضادة للحساسية'], negKeywords: ['وسادة رخيصة', 'وسادة أطفال'] },
  { id: 2, name: 'كريم مرطب طبيعي بزيت الأرغان للبشرة الجافة 200ml', asin: 'B0BX9MNKRT', brand: 'NatureCare', price: 95, sales: 28900, cost: 6100, profit: 9800, units: 304, acos: 21.1, status: 'active', keywords: ['كريم مرطب', 'زيت أرغان', 'ترطيب البشرة'], negKeywords: ['كريم رخيص', 'كريم للرجال'] },
  { id: 3, name: 'سماعات بلوتوث لاسلكية مع إلغاء الضوضاء - أسود', asin: 'B0D3FKLP22', brand: 'SoundMax', price: 349, sales: 52000, cost: 15600, profit: 18200, units: 149, acos: 30.0, status: 'active', keywords: ['سماعات بلوتوث', 'سماعات لاسلكية', 'إلغاء الضوضاء'], negKeywords: ['سماعة سلكية', 'سماعة رخيصة'] },
  { id: 4, name: 'عطر رجالي فاخر - Oud Noir - 100ml', asin: 'B0CDK39MXP', brand: 'ArabiScents', price: 420, sales: 41000, cost: 12300, profit: 15600, units: 97, acos: 30.0, status: 'active', keywords: ['عطر رجالي', 'عطر عود', 'عطر فاخر'], negKeywords: ['عطر نسائي', 'عطر رخيص'] },
  { id: 5, name: 'مكواة شعر احترافية ببخار - سيراميك - 230 درجة', asin: 'B0BZ7WQPKY', brand: 'StylePro', price: 265, sales: 18400, cost: 5200, profit: 6100, units: 69, acos: 28.3, status: 'active', keywords: ['مكواة شعر', 'مكواة بخار', 'مكواة سيراميك'], negKeywords: [] },
  { id: 6, name: 'حقيبة سفر بعجلات - مقاس 24 إنش - أزرق', asin: 'B0CFP8LQZX', brand: 'TravelMate', price: 310, sales: 8200, cost: 3800, profit: 1200, units: 26, acos: 46.3, status: 'weak', keywords: ['حقيبة سفر', 'شنطة سفر'], negKeywords: ['حقيبة رخيصة'] },
  { id: 7, name: 'واقي شمس SPF 50+ للبشرة الدهنية - 50ml', asin: 'B0CL8KPQMN', brand: 'SunGuard', price: 78, sales: 22000, cost: 5500, profit: 8200, units: 282, acos: 25.0, status: 'active', keywords: ['واقي شمس', 'كريم شمس', 'SPF 50'], negKeywords: [] },
  { id: 8, name: 'ساعة ذكية رياضية مع قياس ضغط الدم - أسود', asin: 'B0BYK4MNZP', brand: 'FitTech', price: 520, sales: 31000, cost: 9300, profit: 11400, units: 59, acos: 30.0, status: 'active', keywords: ['ساعة ذكية', 'ساعة رياضية', 'قياس ضغط الدم'], negKeywords: ['ساعة رخيصة'] },
  { id: 9, name: 'زيت أرغان المغربي للشعر - علاج مكثف - 100ml', asin: 'B0CMNLPQWX', brand: 'MarocBeauty', price: 115, sales: 19800, cost: 4200, profit: 7900, units: 172, acos: 21.2, status: 'active', keywords: ['زيت أرغان', 'زيت شعر', 'علاج الشعر'], negKeywords: [] },
  { id: 10, name: 'مكنسة كهربائية لاسلكية خفيفة - للسيارة والمنزل', asin: 'B0CPX7ZNMK', brand: 'CleanPro', price: 198, sales: 4100, cost: 2900, profit: -380, units: 20, acos: 70.7, status: 'poor', keywords: ['مكنسة كهربائية', 'مكنسة لاسلكية'], negKeywords: ['مكنسة رخيصة'] },
  { id: 11, name: 'مجموعة أدوات طبخ - 5 قطع - ستيل', asin: 'B0CQK2XZPN', brand: 'ChefMate', price: 245, sales: 15600, cost: 4700, profit: 5200, units: 63, acos: 30.1, status: 'active', keywords: ['أدوات طبخ', 'مقلاة', 'طنجرة'], negKeywords: [] },
  { id: 12, name: 'كتاب تعلم البرمجة بالعربي - للمبتدئين', asin: 'B0CRZ8MQKP', brand: 'ArabicBooks', price: 65, sales: 3200, cost: 1200, profit: 820, units: 49, acos: 37.5, status: 'weak', keywords: ['كتاب برمجة', 'تعلم البرمجة'], negKeywords: [] },
];

export const blacklist = [
  { id: 1, name: 'كاميرا مراقبة - جودة منخفضة', asin: 'B0CXP2ZNKL', reason: 'منافسة عالية + ربح منخفض', date: '2026-02-15' },
  { id: 2, name: 'سماعة بلوتوث رخيصة', asin: 'B0CFP1QLMN', reason: 'ACOS > 80%', date: '2026-02-20' },
  { id: 3, name: 'حقيبة ظهر عادية', asin: 'B0CKZ8PLNM', reason: 'لا مبيعات خلال 30 يوم', date: '2026-03-01' },
];

export const keywords = [
  { id: 1, keyword: 'وسادة نوم فاخرة', product: 'وسادة نوم فاخرة', cpc: 2.5, ctr: 4.8, conversions: 120, acos: 15.2, roas: 6.58, status: 'active', type: 'broad' },
  { id: 2, keyword: 'كريم مرطب طبيعي', product: 'كريم مرطب طبيعي', cpc: 1.8, ctr: 3.5, conversions: 85, acos: 18.4, roas: 5.43, status: 'active', type: 'phrase' },
  { id: 3, keyword: 'سماعات بلوتوث', product: 'سماعات بلوتوث', cpc: 3.2, ctr: 5.1, conversions: 200, acos: 12.8, roas: 7.81, status: 'active', type: 'exact' },
  { id: 4, keyword: 'حقيبة سفر رخيصة', product: 'حقيبة سفر', cpc: 4.1, ctr: 0.8, conversions: 5, acos: 92.0, roas: 1.09, status: 'paused', type: 'broad' },
  { id: 5, keyword: 'ساعة ذكية', product: 'ساعة ذكية رياضية', cpc: 5.5, ctr: 1.2, conversions: 12, acos: 78.5, roas: 1.27, status: 'active', type: 'broad' },
  { id: 6, keyword: 'زيت أرغان للشعر', product: 'زيت أرغان المغربي', cpc: 1.2, ctr: 6.2, conversions: 95, acos: 10.5, roas: 9.52, status: 'active', type: 'exact' },
  { id: 7, keyword: 'واقي شمس SPF 50', product: 'واقي شمس', cpc: 2.0, ctr: 3.8, conversions: 60, acos: 22.1, roas: 4.52, status: 'active', type: 'phrase' },
  { id: 8, keyword: 'مكنسة كهربائية', product: 'مكنسة كهربائية', cpc: 6.0, ctr: 1.5, conversions: 8, acos: 85.0, roas: 1.18, status: 'paused', type: 'broad' },
];

export const aiSuggestions = [
  { id: 1, product: 'وسادة نوم فاخرة', type: 'keyword', title: 'إضافة كلمة مفتاحية', suggestion: 'إضافة "وسادة مريحة للنوم" - حجم بحث مرتفع ومنافسة منخفضة', impact: '+18% ظهور', priority: 'high' },
  { id: 2, product: 'مكنسة كهربائية', type: 'warning', title: 'منتج ضعيف الأداء', suggestion: 'ACOS 70.7% ومبيعات منخفضة - يُنصح بالإيقاف أو إضافته للقائمة السوداء', impact: 'توفير 900 ر.س شهرياً', priority: 'critical' },
  { id: 3, product: 'سماعات بلوتوث', type: 'budget', title: 'زيادة الميزانية', suggestion: 'ROAS ممتاز (7.81) - الميزانية تنفد قبل الظهر يومياً', impact: '+35% مبيعات محتملة', priority: 'high' },
  { id: 4, product: 'عطر رجالي فاخر', type: 'keyword', title: 'كلمة مفتاحية موسمية', suggestion: 'استهداف "عطر رجالي هدية" قبل موسم الأعياد', impact: '+22% معدل تحويل', priority: 'medium' },
  { id: 5, product: 'كريم مرطب طبيعي', type: 'negative', title: 'إضافة كلمات سلبية', suggestion: 'إضافة "كريم رجال" و"كريم صنصكرين" ككلمات سلبية لتقليل النقرات الغير مجدية', impact: '-12% إنفاق غير مفيد', priority: 'medium' },
  { id: 6, product: 'حقيبة سفر', type: 'warning', title: 'أداء ضعيف', suggestion: 'ACOS 46% مع هامش ربح ضيق - تحتاج تعديل التسعير أو إيقاف الإعلان', impact: 'تجنب خسارة 200 ر.س', priority: 'high' },
];

export const accounting = {
  summary: {
    revenue: 187450,
    adSpend: 45230,
    productCost: 68200,
    profit: 62800,
    profitMargin: 33.5,
    unitsSold: 3840,
  },
  daily: [
    { date: '8 مارس', revenue: 6840, adSpend: 1520, productCost: 2480, profit: 2840, orders: 45 },
    { date: '7 مارس', revenue: 5520, adSpend: 1380, productCost: 2010, profit: 2130, orders: 38 },
    { date: '6 مارس', revenue: 7425, adSpend: 1650, productCost: 2700, profit: 3075, orders: 52 },
    { date: '5 مارس', revenue: 4800, adSpend: 1200, productCost: 1750, profit: 1850, orders: 33 },
    { date: '4 مارس', revenue: 6660, adSpend: 1480, productCost: 2420, profit: 2760, orders: 46 },
    { date: '3 مارس', revenue: 7800, adSpend: 1900, productCost: 2840, profit: 3060, orders: 54 },
    { date: '2 مارس', revenue: 5100, adSpend: 1250, productCost: 1860, profit: 1990, orders: 35 },
  ],
  byProduct: [
    { name: 'سماعات بلوتوث', revenue: 52000, adSpend: 15600, productCost: 19240, profit: 17160, units: 149 },
    { name: 'عطر رجالي فاخر', revenue: 41000, adSpend: 12300, productCost: 15990, profit: 12710, units: 97 },
    { name: 'وسادة نوم فاخرة', revenue: 34500, adSpend: 8200, productCost: 12740, profit: 13560, units: 182 },
    { name: 'ساعة ذكية', revenue: 31000, adSpend: 9300, productCost: 11470, profit: 10230, units: 59 },
    { name: 'كريم مرطب', revenue: 28900, adSpend: 6100, productCost: 10693, profit: 12107, units: 304 },
  ],
};

export const amazonNews = [
  { id: 1, title: 'أمازون تطلق برنامج دعم جديد للبائعين في السعودية', summary: 'أعلنت أمازون عن برنامج شراكة جديد يتيح للبائعين في المملكة الوصول إلى تمويل مرن وأدوات تحليل متقدمة.', date: '8 مارس 2026', category: 'بائعون', important: true },
  { id: 2, title: 'تحديث خوارزمية البحث في أمازون - ما يجب على البائعين معرفته', summary: 'أجرت أمازون تحديثاً جوهرياً على خوارزمية البحث يؤثر على ترتيب المنتجات. أبرز التغييرات وكيفية التكيف معها.', date: '7 مارس 2026', category: 'خوارزمية', important: true },
  { id: 3, title: 'رسوم FBA الجديدة لعام 2026 - الجدول الكامل', summary: 'نشرت أمازون جدول رسوم FBA المحدث لعام 2026 مع زيادات طفيفة في فئات معينة وخصومات في فئات أخرى.', date: '6 مارس 2026', category: 'رسوم', important: false },
  { id: 4, title: 'موسم رمضان 2026 - توقعات المبيعات وأفضل الفرص', summary: 'تقرير شامل حول فرص البيع خلال موسم رمضان 2026 مع قائمة بأكثر الفئات مبيعاً وتوصيات للبائعين.', date: '5 مارس 2026', category: 'موسمي', important: false },
  { id: 5, title: 'أمازون تعلن عن خدمة Amazon Accelerate للبائعين العرب', summary: 'برنامج جديد مصمم خصيصاً لمساعدة البائعين في منطقة الخليج على التوسع في الأسواق الدولية.', date: '4 مارس 2026', category: 'بائعون', important: true },
  { id: 6, title: 'كيف تحسّن قوائم منتجاتك للظهور في الصفحة الأولى', summary: 'دليل عملي محدث لعام 2026 حول تحسين عناوين المنتجات والصور والكلمات المفتاحية في الـ backend.', date: '3 مارس 2026', category: 'تحسين', important: false },
];

export const alerts = [
  { id: 1, type: 'roas_drop', title: 'انخفاض ROAS', message: 'انخفض ROAS لحملة "SP - استهداف منافسين" من 2.5 إلى 1.5 خلال آخر 7 أيام', severity: 'critical', time: 'منذ ساعة', read: false },
  { id: 2, type: 'acos_increase', title: 'ارتفاع ACOS', message: 'ارتفع ACOS لحملة "SP - كلمات عامة" إلى 83.3% وهو أعلى من الهدف (35%)', severity: 'critical', time: 'منذ ساعتين', read: false },
  { id: 3, type: 'no_sales', title: 'لا مبيعات', message: 'لم تسجل "مكنسة كهربائية" أي مبيعات خلال آخر 48 ساعة رغم إنفاق 180 ر.س', severity: 'warning', time: 'منذ 3 ساعات', read: false },
  { id: 4, type: 'budget_alert', title: 'الميزانية على وشك النفاد', message: 'ميزانية "SP - منتج رئيسي - دقيق" استُهلكت بنسبة 92% ولم ينتهِ اليوم', severity: 'warning', time: 'منذ 4 ساعات', read: true },
  { id: 5, type: 'performance_up', title: 'تحسن في الأداء', message: 'تحسن ROAS لحملة "SB - علامة تجارية" بنسبة 25% هذا الأسبوع', severity: 'success', time: 'منذ 5 ساعات', read: true },
];

export const auditLog = [
  { id: 1, action: 'تعديل العرض', target: 'كلمة "سماعات بلوتوث"', details: 'تم زيادة العرض من 2.8 إلى 3.2 ر.س', reason: 'ROAS ممتاز والكلمة تحقق أداءً عالياً', date: '2026-03-08 14:30', source: 'النظام الذكي' },
  { id: 2, action: 'إيقاف كلمة مفتاحية', target: 'كلمة "مكنسة كهربائية"', details: 'تم إيقاف الكلمة المفتاحية', reason: 'ACOS يتجاوز 85% مع تحويلات منخفضة', date: '2026-03-08 12:15', source: 'النظام الذكي' },
  { id: 3, action: 'زيادة الميزانية', target: 'SP - منتج رئيسي - دقيق', details: 'تم زيادة الميزانية من 4,000 إلى 5,000 ر.س', reason: 'الميزانية تنفد قبل نهاية اليوم والحملة ممتازة', date: '2026-03-07 16:45', source: 'أحمد محمد' },
  { id: 4, action: 'إضافة كلمة مفتاحية', target: 'SP - منتجات جديدة', details: 'تم إضافة كلمة "كريم مرطب عضوي"', reason: 'كلمة مقترحة من تحليل المنافسين', date: '2026-03-07 10:20', source: 'النظام الذكي' },
  { id: 5, action: 'إضافة للقائمة السوداء', target: 'سماعة بلوتوث رخيصة', details: 'تم نقل المنتج للقائمة السوداء', reason: 'ACOS > 80% باستمرار خلال شهر', date: '2026-03-06 09:00', source: 'أحمد محمد' },
];

export const stores = [
  { id: 1, name: 'متجر الجمال العربي', marketplace: 'Amazon.sa', status: 'connected', lastSync: '2026-03-08 14:30', totalSales: 125000, activeCampaigns: 8, health: 92 },
  { id: 2, name: 'متجر التقنية', marketplace: 'Amazon.ae', status: 'connected', lastSync: '2026-03-08 13:45', totalSales: 78000, activeCampaigns: 6, health: 85 },
];

export const notifications = [
  { id: 1, title: 'تنبيه أداء', message: 'انخفض ROAS لحملة المنافسين', time: 'منذ دقيقتين', read: false },
  { id: 2, title: 'توصية ذكية', message: 'يوجد 6 توصيات جديدة لتحسين الأداء', time: 'منذ 15 دقيقة', read: false },
  { id: 3, title: 'مزامنة ناجحة', message: 'تم مزامنة بيانات متجر الجمال العربي', time: 'منذ ساعة', read: false },
  { id: 4, title: 'تحديث الاشتراك', message: 'اشتراكك سيتجدد خلال 5 أيام', time: 'منذ 3 ساعات', read: true },
];

export const subscriptionPlans = [
  {
    name: 'Starter',
    nameAr: 'الأساسي',
    monthlyPrice: 199,
    yearlyPrice: 1990,
    features: ['متجر واحد', 'حتى 10 حملات', 'تقارير أساسية', 'تنبيهات بريد إلكتروني', 'دعم بالبريد الإلكتروني'],
    current: false,
  },
  {
    name: 'Professional',
    nameAr: 'الاحترافي',
    monthlyPrice: 499,
    yearlyPrice: 4990,
    features: ['حتى 3 متاجر', 'حملات غير محدودة', 'تقارير متقدمة', 'ذكاء اصطناعي', 'دعم أولوية', 'تحسين تلقائي', 'تصدير التقارير', 'نظام محاسبة'],
    current: true,
  },
  {
    name: 'Enterprise',
    nameAr: 'المؤسسات',
    monthlyPrice: 999,
    yearlyPrice: 9990,
    features: ['متاجر غير محدودة', 'حملات غير محدودة', 'تقارير مخصصة', 'ذكاء اصطناعي متقدم', 'مدير حساب مخصص', 'API كامل', 'تحسين تلقائي متقدم', 'تدريب شخصي', 'SLA 99.9%'],
    current: false,
  },
];

export const helpSections = [
  { title: 'البدء السريع', articles: [
    { title: 'كيف أبدأ باستخدام M20 Autopilot؟', content: 'سجل الدخول، ثم اربط حسابك على أمازون. بعد المزامنة الأولى، ستظهر بياناتك تلقائياً في لوحة التحكم.' },
    { title: 'ما هي المتطلبات الأساسية؟', content: 'تحتاج إلى حساب بائع نشط على أمازون مع حملات إعلانية قائمة.' },
  ]},
  { title: 'ربط أمازون', articles: [
    { title: 'كيف أربط حسابي على أمازون؟', content: 'اذهب إلى الإعدادات وأدخل رابط متجرك على أمازون. سنطلب الصلاحيات اللازمة تلقائياً.' },
    { title: 'ما هي الصلاحيات المطلوبة؟', content: 'نحتاج صلاحيات قراءة بيانات الإعلانات وإدارة الحملات فقط.' },
  ]},
  { title: 'مقاييس الإعلانات', articles: [
    { title: 'ما هو ACOS؟', content: 'ACOS = إنفاق الإعلان ÷ مبيعات الإعلان × 100. كلما انخفض كان أفضل.' },
    { title: 'ما هو ROAS؟', content: 'ROAS = مبيعات الإعلان ÷ إنفاق الإعلان. ROAS أعلى = عائد أفضل. ROAS 5 يعني كل ريال ينتج 5 ريالات.' },
  ]},
  { title: 'الذكاء الاصطناعي', articles: [
    { title: 'كيف يعمل نظام الذكاء الاصطناعي؟', content: 'يحلل النظام أداء منتجاتك وحملاتك يومياً ويقترح تحسينات مبنية على البيانات الفعلية.' },
    { title: 'هل يمكن التطبيق التلقائي؟', content: 'نعم، في الخطة الاحترافية يمكنك تفعيل التطبيق التلقائي للتوصيات ذات الثقة العالية.' },
  ]},
];

export const chatMessages = [
  { id: 1, sender: 'user', message: 'ما الفرق بين ACOS و ROAS؟' },
  { id: 2, sender: 'bot', message: 'ACOS و ROAS هما عكس بعضهما:\n\n• ACOS = الإنفاق ÷ المبيعات × 100 (كلما انخفض أفضل)\n• ROAS = المبيعات ÷ الإنفاق (كلما ارتفع أفضل)\n\nمثال: أنفقت 100 ر.س وحققت 500 ر.س مبيعات:\n- ACOS = 20%\n- ROAS = 5.0' },
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
