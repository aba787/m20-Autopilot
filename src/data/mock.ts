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
  tacos: 18.2,
  dailyBudget: 35,
};

export const salesChartMonthly = [
  { date: 'Jan', sales: 12000, spend: 3200 },
  { date: 'Feb', sales: 15000, spend: 3800 },
  { date: 'Mar', sales: 18000, spend: 4200 },
  { date: 'Apr', sales: 22000, spend: 5100 },
  { date: 'May', sales: 19000, spend: 4500 },
  { date: 'Jun', sales: 25000, spend: 5800 },
  { date: 'Jul', sales: 28000, spend: 6200 },
  { date: 'Aug', sales: 31000, spend: 6800 },
  { date: 'Sep', sales: 27000, spend: 5900 },
  { date: 'Oct', sales: 33000, spend: 7100 },
  { date: 'Nov', sales: 38000, spend: 8200 },
  { date: 'Dec', sales: 42000, spend: 9400 },
];

export const salesChartTwoWeeks = [
  { date: 'Feb 23', sales: 4800, spend: 1100 },
  { date: 'Feb 24', sales: 5200, spend: 1250 },
  { date: 'Feb 25', sales: 4100, spend: 980 },
  { date: 'Feb 26', sales: 6300, spend: 1480 },
  { date: 'Feb 27', sales: 5800, spend: 1350 },
  { date: 'Feb 28', sales: 7100, spend: 1620 },
  { date: 'Mar 1',  sales: 6500, spend: 1500 },
  { date: 'Mar 2',  sales: 5900, spend: 1380 },
  { date: 'Mar 3',  sales: 7800, spend: 1800 },
  { date: 'Mar 4',  sales: 6200, spend: 1450 },
  { date: 'Mar 5',  sales: 8100, spend: 1900 },
  { date: 'Mar 6',  sales: 7400, spend: 1700 },
  { date: 'Mar 7',  sales: 6900, spend: 1600 },
  { date: 'Mar 8',  sales: 7600, spend: 1750 },
];

export const campaignBreakdown = [
  { name: 'Sponsored Products', value: 58, fill: '#22c55e' },
  { name: 'Sponsored Brands',   value: 25, fill: '#3b82f6' },
  { name: 'Sponsored Display',  value: 12, fill: '#f59e0b' },
  { name: 'Video',              value: 5,  fill: '#8b5cf6' },
];

export const campaigns = [
  { id: 1,  name: 'SP - Main Product - Exact',    status: 'active', type: 'Sponsored Products',      budget: 5000, spend: 3450, sales: 21200, roas: 6.14, acos: 16.3, ctr: 4.2, clicks: 4820,  impressions: 114762, orders: 145 },
  { id: 2,  name: 'SP - Seasonal Deals',          status: 'active', type: 'Sponsored Products',      budget: 3000, spend: 2100, sales: 12180, roas: 5.8,  acos: 17.2, ctr: 3.8, clicks: 3200,  impressions: 84210,  orders: 88  },
  { id: 3,  name: 'SB - Brand Awareness',         status: 'active', type: 'Sponsored Brands',        budget: 4000, spend: 2800, sales: 14280, roas: 5.1,  acos: 19.6, ctr: 3.5, clicks: 2900,  impressions: 82857,  orders: 76  },
  { id: 4,  name: 'SB - New Products',            status: 'active', type: 'Sponsored Brands',        budget: 2000, spend: 1200, sales: 8400,  roas: 7.0,  acos: 14.3, ctr: 5.1, clicks: 2100,  impressions: 41176,  orders: 58  },
  { id: 5,  name: 'SP - Generic Keywords',        status: 'paused', type: 'Sponsored Products',      budget: 3500, spend: 2800, sales: 3360,  roas: 1.2,  acos: 83.3, ctr: 1.1, clicks: 1800,  impressions: 163636, orders: 12  },
  { id: 6,  name: 'SP - Competitor Targeting',   status: 'paused', type: 'Sponsored Products',      budget: 2500, spend: 1900, sales: 2850,  roas: 1.5,  acos: 66.7, ctr: 1.4, clicks: 1400,  impressions: 100000, orders: 10  },
  { id: 7,  name: 'SD - Retargeting',            status: 'active', type: 'Sponsored Display',       budget: 2000, spend: 1400, sales: 9800,  roas: 7.0,  acos: 14.3, ctr: 4.8, clicks: 2450,  impressions: 51041,  orders: 55  },
  { id: 8,  name: 'SD - Discovery',              status: 'active', type: 'Sponsored Display',       budget: 1500, spend: 980,  sales: 1764,  roas: 1.8,  acos: 55.6, ctr: 2.0, clicks: 820,   impressions: 41000,  orders: 8   },
  { id: 9,  name: 'SBV - Video Ad',              status: 'active', type: 'Sponsored Brands Video',  budget: 3000, spend: 2200, sales: 11000, roas: 5.0,  acos: 20.0, ctr: 3.2, clicks: 1900,  impressions: 59375,  orders: 62  },
  { id: 10, name: 'SP - Prime Day 2025',         status: 'paused', type: 'Sponsored Products',      budget: 8000, spend: 6500, sales: 39000, roas: 6.0,  acos: 16.7, ctr: 4.5, clicks: 9800,  impressions: 217777, orders: 265 },
];

export const products = [
  { id: 1,  name: 'Luxury Sleep Pillow - Anti-Allergy - King Size',    asin: 'B0CK82XYLP', brand: 'LuxeSleep',    price: 189, sales: 34500, cost: 8200,  profit: 12400, units: 182, acos: 23.7, tacos: 15.2, spend: 8200,  status: 'active', image: 'https://images.unsplash.com/photo-1592789705501-f9ae4278a9e9?w=120&h=120&fit=crop', keywords: ['sleep pillow', 'luxury pillow', 'anti-allergy pillow'],     negKeywords: ['cheap pillow', 'kids pillow'] },
  { id: 2,  name: 'Natural Moisturizing Cream with Argan Oil 200ml',   asin: 'B0BX9MNKRT', brand: 'NatureCare',   price: 95,  sales: 28900, cost: 6100,  profit: 9800,  units: 304, acos: 21.1, tacos: 12.8, spend: 6100,  status: 'active', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=120&h=120&fit=crop', keywords: ['moisturizer', 'argan oil', 'skin hydration'],              negKeywords: ['cheap cream', 'mens cream'] },
  { id: 3,  name: 'Wireless Bluetooth Headphones with Noise Cancelling', asin: 'B0D3FKLP22', brand: 'SoundMax',  price: 349, sales: 52000, cost: 15600, profit: 18200, units: 149, acos: 30.0, tacos: 22.1, spend: 15600, status: 'active', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&h=120&fit=crop', keywords: ['bluetooth headphones', 'wireless headphones', 'noise cancelling'], negKeywords: ['wired headphones', 'cheap headphones'] },
  { id: 4,  name: 'Luxury Men\'s Oud Noir Perfume 100ml',              asin: 'B0CDK39MXP', brand: 'ArabiScents', price: 420, sales: 41000, cost: 12300, profit: 15600, units: 97,  acos: 30.0, tacos: 20.5, spend: 12300, status: 'active', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=120&h=120&fit=crop', keywords: ['mens perfume', 'oud perfume', 'luxury fragrance'],         negKeywords: ['womens perfume', 'cheap perfume'] },
  { id: 5,  name: 'Professional Steam Hair Straightener Ceramic 230°C', asin: 'B0BZ7WQPKY', brand: 'StylePro',   price: 265, sales: 18400, cost: 5200,  profit: 6100,  units: 69,  acos: 28.3, tacos: 19.4, spend: 5200,  status: 'active', image: 'https://images.unsplash.com/photo-1522338242992-e1a54571e3f4?w=120&h=120&fit=crop', keywords: ['hair straightener', 'steam iron', 'ceramic flat iron'],     negKeywords: [] },
  { id: 6,  name: 'Rolling Travel Luggage 24 Inch - Blue',             asin: 'B0CFP8LQZX', brand: 'TravelMate', price: 310, sales: 8200,  cost: 3800,  profit: 1200,  units: 26,  acos: 46.3, tacos: 35.8, spend: 3800,  status: 'weak',   image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=120&h=120&fit=crop', keywords: ['travel luggage', 'suitcase'],                               negKeywords: ['cheap luggage'] },
  { id: 7,  name: 'SPF 50+ Sunscreen for Oily Skin 50ml',              asin: 'B0CL8KPQMN', brand: 'SunGuard',   price: 78,  sales: 22000, cost: 5500,  profit: 8200,  units: 282, acos: 25.0, tacos: 16.7, spend: 5500,  status: 'active', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=120&h=120&fit=crop', keywords: ['sunscreen', 'sun cream', 'SPF 50'],                        negKeywords: [] },
  { id: 8,  name: 'Smart Sports Watch with Blood Pressure Monitor',    asin: 'B0BYK4MNZP', brand: 'FitTech',    price: 520, sales: 31000, cost: 9300,  profit: 11400, units: 59,  acos: 30.0, tacos: 21.3, spend: 9300,  status: 'active', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&h=120&fit=crop', keywords: ['smart watch', 'sports watch', 'blood pressure monitor'],   negKeywords: ['cheap watch'] },
  { id: 9,  name: 'Moroccan Argan Oil Hair Treatment 100ml',           asin: 'B0CMNLPQWX', brand: 'MarocBeauty', price: 115, sales: 19800, cost: 4200, profit: 7900,  units: 172, acos: 21.2, tacos: 14.1, spend: 4200,  status: 'active', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=120&h=120&fit=crop', keywords: ['argan oil', 'hair oil', 'hair treatment'],                 negKeywords: [] },
  { id: 10, name: 'Lightweight Cordless Vacuum - Car & Home',          asin: 'B0CPX7ZNMK', brand: 'CleanPro',   price: 198, sales: 4100,  cost: 2900,  profit: -380,  units: 20,  acos: 70.7, tacos: 52.3, spend: 2900,  status: 'poor',   image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=120&h=120&fit=crop', keywords: ['vacuum cleaner', 'cordless vacuum'],                       negKeywords: ['cheap vacuum'] },
  { id: 11, name: '5-Piece Stainless Steel Cookware Set',              asin: 'B0CQK2XZPN', brand: 'ChefMate',   price: 245, sales: 15600, cost: 4700,  profit: 5200,  units: 63,  acos: 30.1, tacos: 20.8, spend: 4700,  status: 'active', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=120&h=120&fit=crop', keywords: ['cookware', 'frying pan', 'cooking pot'],                   negKeywords: [] },
  { id: 12, name: 'Python Programming for Beginners - Paperback',      asin: 'B0CRZ8MQKP', brand: 'TechBooks',  price: 65,  sales: 3200,  cost: 1200,  profit: 820,   units: 49,  acos: 37.5, tacos: 28.1, spend: 1200,  status: 'weak',   image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120&h=120&fit=crop', keywords: ['programming book', 'learn python'],                        negKeywords: [] },
];

export const blacklist = [
  { id: 1, name: 'Security Camera - Low Quality',  asin: 'B0CXP2ZNKL', reason: 'High competition + low profit',  date: '2026-02-15' },
  { id: 2, name: 'Cheap Bluetooth Speaker',        asin: 'B0CFP1QLMN', reason: 'ACOS > 80%',                     date: '2026-02-20' },
  { id: 3, name: 'Basic Backpack',                 asin: 'B0CKZ8PLNM', reason: 'No sales in 30 days',            date: '2026-03-01' },
];

export const keywords = [
  { id: 1, keyword: 'luxury sleep pillow',    product: 'Luxury Sleep Pillow',     cpc: 2.5, ctr: 4.8, conversions: 120, acos: 15.2, roas: 6.58, status: 'active', type: 'broad'  },
  { id: 2, keyword: 'natural moisturizer',    product: 'Natural Moisturizing Cream', cpc: 1.8, ctr: 3.5, conversions: 85,  acos: 18.4, roas: 5.43, status: 'active', type: 'phrase' },
  { id: 3, keyword: 'bluetooth headphones',   product: 'Wireless Headphones',      cpc: 3.2, ctr: 5.1, conversions: 200, acos: 12.8, roas: 7.81, status: 'active', type: 'exact'  },
  { id: 4, keyword: 'cheap travel luggage',   product: 'Rolling Travel Luggage',   cpc: 4.1, ctr: 0.8, conversions: 5,   acos: 92.0, roas: 1.09, status: 'paused', type: 'broad'  },
  { id: 5, keyword: 'smart watch',            product: 'Smart Sports Watch',       cpc: 5.5, ctr: 1.2, conversions: 12,  acos: 78.5, roas: 1.27, status: 'active', type: 'broad'  },
  { id: 6, keyword: 'argan oil for hair',     product: 'Moroccan Argan Oil',       cpc: 1.2, ctr: 6.2, conversions: 95,  acos: 10.5, roas: 9.52, status: 'active', type: 'exact'  },
  { id: 7, keyword: 'sunscreen SPF 50',       product: 'SPF 50+ Sunscreen',        cpc: 2.0, ctr: 3.8, conversions: 60,  acos: 22.1, roas: 4.52, status: 'active', type: 'phrase' },
  { id: 8, keyword: 'cordless vacuum cleaner',product: 'Cordless Vacuum',          cpc: 6.0, ctr: 1.5, conversions: 8,   acos: 85.0, roas: 1.18, status: 'paused', type: 'broad'  },
];

export const aiSuggestions = [
  { id: 1, product: 'Luxury Sleep Pillow',   type: 'keyword',  title: 'Add Keyword',          suggestion: 'Add "comfortable memory foam pillow" — high search volume, low competition', impact: '+18% impressions', priority: 'high'     },
  { id: 2, product: 'Cordless Vacuum',        type: 'warning',  title: 'Poor Performer',       suggestion: 'ACOS 70.7% with low sales — recommend pausing or blacklisting',           impact: 'Save $250/mo',     priority: 'critical' },
  { id: 3, product: 'Wireless Headphones',    type: 'budget',   title: 'Increase Budget',      suggestion: 'Excellent ROAS (7.81) — budget runs out before noon daily',                impact: '+35% potential sales', priority: 'high' },
  { id: 4, product: 'Oud Noir Perfume',       type: 'keyword',  title: 'Seasonal Keyword',     suggestion: 'Target "mens gift perfume" ahead of holiday season',                       impact: '+22% conversion',  priority: 'medium'   },
  { id: 5, product: 'Moisturizing Cream',     type: 'negative', title: 'Add Negative Keywords',suggestion: 'Add "mens cream" and "sunscreen" as negatives to cut irrelevant clicks',    impact: '-12% wasted spend',priority: 'medium'   },
  { id: 6, product: 'Travel Luggage',         type: 'warning',  title: 'Weak Performance',     suggestion: 'ACOS 46% with thin margin — adjust pricing or pause advertising',          impact: 'Avoid $200 loss',  priority: 'high'     },
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
    { date: 'Mar 8', revenue: 6840, adSpend: 1520, productCost: 2480, profit: 2840, orders: 45 },
    { date: 'Mar 7', revenue: 5520, adSpend: 1380, productCost: 2010, profit: 2130, orders: 38 },
    { date: 'Mar 6', revenue: 7425, adSpend: 1650, productCost: 2700, profit: 3075, orders: 52 },
    { date: 'Mar 5', revenue: 4800, adSpend: 1200, productCost: 1750, profit: 1850, orders: 33 },
    { date: 'Mar 4', revenue: 6660, adSpend: 1480, productCost: 2420, profit: 2760, orders: 46 },
    { date: 'Mar 3', revenue: 7800, adSpend: 1900, productCost: 2840, profit: 3060, orders: 54 },
    { date: 'Mar 2', revenue: 5100, adSpend: 1250, productCost: 1860, profit: 1990, orders: 35 },
  ],
  byProduct: [
    { name: 'Wireless Headphones',  revenue: 52000, adSpend: 15600, productCost: 19240, profit: 17160, units: 149 },
    { name: 'Oud Noir Perfume',     revenue: 41000, adSpend: 12300, productCost: 15990, profit: 12710, units: 97  },
    { name: 'Luxury Sleep Pillow',  revenue: 34500, adSpend: 8200,  productCost: 12740, profit: 13560, units: 182 },
    { name: 'Smart Sports Watch',   revenue: 31000, adSpend: 9300,  productCost: 11470, profit: 10230, units: 59  },
    { name: 'Moisturizing Cream',   revenue: 28900, adSpend: 6100,  productCost: 10693, profit: 12107, units: 304 },
  ],
};

export const amazonNews = [
  { id: 1, title: 'Amazon Launches New Seller Support Program',         summary: 'Amazon announced a new partnership program providing sellers with flexible financing and advanced analytics tools.', date: 'Mar 8, 2026',  category: 'Sellers',    important: true  },
  { id: 2, title: 'Amazon Search Algorithm Update — What Sellers Need to Know', summary: 'Amazon made a significant update to its search algorithm affecting product rankings. Key changes and how to adapt.', date: 'Mar 7, 2026', category: 'Algorithm',  important: true  },
  { id: 3, title: 'New FBA Fee Schedule for 2026 — Full Breakdown',    summary: 'Amazon published updated FBA fees for 2026 with slight increases in some categories and discounts in others.', date: 'Mar 6, 2026', category: 'Fees',       important: false },
  { id: 4, title: 'Prime Day 2026 — Sales Forecasts & Best Opportunities', summary: 'Comprehensive report on Prime Day 2026 opportunities with top-selling categories and seller recommendations.', date: 'Mar 5, 2026', category: 'Seasonal',   important: false },
  { id: 5, title: 'Amazon Announces Accelerate Program for Sellers',    summary: 'New program designed to help sellers expand into international markets with dedicated support and tools.', date: 'Mar 4, 2026', category: 'Sellers',    important: true  },
  { id: 6, title: 'How to Optimize Your Listings for Page 1 Results',  summary: 'Updated 2026 practical guide on improving product titles, images, and backend keywords for better search ranking.', date: 'Mar 3, 2026', category: 'Optimize',   important: false },
];

export const alerts = [
  { id: 1, type: 'roas_drop',     title: 'ROAS Drop',         message: 'ROAS for "SP - Competitor Targeting" dropped from 2.5 to 1.5 over the last 7 days',     severity: 'critical', time: '1 hour ago',   read: false },
  { id: 2, type: 'acos_increase', title: 'High ACOS',         message: 'ACOS for "SP - Generic Keywords" reached 83.3% — far above the 35% target',             severity: 'critical', time: '2 hours ago',  read: false },
  { id: 3, type: 'no_sales',      title: 'No Sales',          message: '"Cordless Vacuum" has had zero sales in the last 48 hours despite spending $180',       severity: 'warning',  time: '3 hours ago',  read: false },
  { id: 4, type: 'budget_alert',  title: 'Budget Depleting',  message: '"SP - Main Product" budget is 92% consumed and the day is not over yet',                severity: 'warning',  time: '4 hours ago',  read: true  },
  { id: 5, type: 'performance_up',title: 'Performance Boost', message: 'ROAS for "SB - Brand Awareness" improved by 25% this week',                             severity: 'success',  time: '5 hours ago',  read: true  },
];

export const auditLog = [
  { id: 1, action: 'Bid Adjustment',    target: '"bluetooth headphones" keyword', details: 'Bid increased from $2.80 to $3.20',               reason: 'Excellent ROAS — keyword performing well',           date: '2026-03-08 14:30', source: 'AI System' },
  { id: 2, action: 'Keyword Paused',    target: '"cordless vacuum" keyword',      details: 'Keyword paused',                                    reason: 'ACOS above 85% with very low conversions',           date: '2026-03-08 12:15', source: 'AI System' },
  { id: 3, action: 'Budget Increased',  target: 'SP - Main Product - Exact',     details: 'Budget raised from $4,000 to $5,000',              reason: 'Budget depleting before end of day — great campaign', date: '2026-03-07 16:45', source: 'Ahmed M.'   },
  { id: 4, action: 'Keyword Added',     target: 'SP - New Products',             details: 'Added keyword "organic moisturizing cream"',        reason: 'Suggested by competitor analysis',                    date: '2026-03-07 10:20', source: 'AI System' },
  { id: 5, action: 'Blacklisted',       target: 'Cheap Bluetooth Speaker',       details: 'Product moved to blacklist',                        reason: 'ACOS > 80% consistently for one month',               date: '2026-03-06 09:00', source: 'Ahmed M.'   },
];

export const stores = [
  { id: 1, name: 'Beauty & Wellness Store', marketplace: 'Amazon.sa', status: 'connected', lastSync: '2026-03-08 14:30', totalSales: 125000, activeCampaigns: 8, health: 92 },
  { id: 2, name: 'Tech Gadgets Store',      marketplace: 'Amazon.ae', status: 'connected', lastSync: '2026-03-08 13:45', totalSales: 78000,  activeCampaigns: 6, health: 85 },
];

export const notifications = [
  { id: 1, title: 'Performance Alert',     message: 'ROAS dropped for Competitor Targeting campaign',         time: '2 min ago',   read: false },
  { id: 2, title: 'AI Recommendation',     message: '6 new recommendations available to boost performance',  time: '15 min ago',  read: false },
  { id: 3, title: 'Sync Successful',       message: 'Beauty & Wellness Store data synced successfully',      time: '1 hour ago',  read: false },
  { id: 4, title: 'Subscription Reminder', message: 'Your plan renews in 5 days',                            time: '3 hours ago', read: true  },
];

export const helpSections = [
  { title: 'Getting Started', articles: [
    { title: 'How do I start using M20 Autopilot?',      content: 'Log in, then connect your Amazon account. After the first sync, your data will appear automatically in the dashboard.' },
    { title: 'What are the basic requirements?',          content: 'You need an active Amazon seller account with running ad campaigns.' },
  ]},
  { title: 'Amazon Integration', articles: [
    { title: 'How do I connect my Amazon account?',       content: 'Go to Settings and enter your Amazon store URL. We will request the necessary permissions automatically.' },
    { title: 'What permissions are required?',            content: 'We need read access to advertising data and campaign management permissions only.' },
  ]},
  { title: 'Ad Metrics', articles: [
    { title: 'What is ACOS?',                             content: 'ACOS = Ad Spend ÷ Ad Sales × 100. Lower is better. A typical target is 20–30% depending on your margin.' },
    { title: 'What is ROAS?',                             content: 'ROAS = Ad Sales ÷ Ad Spend. Higher is better. A ROAS of 5 means every $1 spent generates $5 in sales.' },
  ]},
  { title: 'AI Engine', articles: [
    { title: 'How does the AI system work?',              content: 'The system analyzes your products and campaigns daily and suggests improvements based on real performance data.' },
    { title: 'Can recommendations be applied automatically?', content: 'Yes, on the Professional plan you can enable auto-apply for high-confidence recommendations.' },
  ]},
];

export const chatMessages = [
  { id: 1, sender: 'user', message: 'What is the difference between ACOS and ROAS?' },
  { id: 2, sender: 'bot',  message: 'ACOS and ROAS are inverses of each other:\n\n• ACOS = Spend ÷ Sales × 100 (lower is better)\n• ROAS = Sales ÷ Spend (higher is better)\n\nExample: You spent $100 and made $500 in sales:\n- ACOS = 20%\n- ROAS = 5.0' },
];

export const reportsData = {
  daily: [
    { date: 'Mar 8', spend: 1520, sales: 6840, roas: 4.5, acos: 22.2, orders: 45 },
    { date: 'Mar 7', spend: 1380, sales: 5520, roas: 4.0, acos: 25.0, orders: 38 },
    { date: 'Mar 6', spend: 1650, sales: 7425, roas: 4.5, acos: 22.2, orders: 52 },
    { date: 'Mar 5', spend: 1200, sales: 4800, roas: 4.0, acos: 25.0, orders: 33 },
    { date: 'Mar 4', spend: 1480, sales: 6660, roas: 4.5, acos: 22.2, orders: 46 },
  ],
  weekly: [
    { date: 'Week 1', spend: 9800,  sales: 44100,  roas: 4.5, acos: 22.2, orders: 310 },
    { date: 'Week 2', spend: 10200, sales: 51000,  roas: 5.0, acos: 20.0, orders: 350 },
    { date: 'Week 3', spend: 11500, sales: 57500,  roas: 5.0, acos: 20.0, orders: 395 },
    { date: 'Week 4', spend: 13700, sales: 61650,  roas: 4.5, acos: 22.2, orders: 420 },
  ],
  monthly: [
    { date: 'Jan', spend: 32000, sales: 128000, roas: 4.0, acos: 25.0, orders: 880  },
    { date: 'Feb', spend: 38000, sales: 171000, roas: 4.5, acos: 22.2, orders: 1170 },
    { date: 'Mar', spend: 45230, sales: 187450, roas: 4.14,acos: 24.1, orders: 1290 },
  ],
};
