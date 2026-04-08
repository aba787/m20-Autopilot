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
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', dir: 'ltr' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', dir: 'ltr' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', dir: 'ltr' },
  { code: 'tr', label: 'Turkish', nativeLabel: 'Türkçe', dir: 'ltr' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文', dir: 'ltr' },
];

const translations: Record<string, Record<string, string>> = {
  'nav.dashboard': { en: 'Dashboard', ar: 'لوحة التحكم', es: 'Panel', fr: 'Tableau de bord', de: 'Dashboard', tr: 'Gösterge Paneli', zh: '仪表盘' },
  'nav.campaigns': { en: 'Campaigns', ar: 'الحملات', es: 'Campañas', fr: 'Campagnes', de: 'Kampagnen', tr: 'Kampanyalar', zh: '广告活动' },
  'nav.products': { en: 'Products & Keywords', ar: 'المنتجات والكلمات المفتاحية', es: 'Productos y Palabras Clave', fr: 'Produits et Mots-clés', de: 'Produkte & Schlüsselwörter', tr: 'Ürünler ve Anahtar Kelimeler', zh: '产品与关键词' },
  'nav.blacklist': { en: 'Blacklist', ar: 'القائمة السوداء', es: 'Lista Negra', fr: 'Liste Noire', de: 'Schwarze Liste', tr: 'Kara Liste', zh: '黑名单' },
  'nav.aiEngine': { en: 'AI Engine', ar: 'محرك الذكاء', es: 'Motor IA', fr: 'Moteur IA', de: 'KI-Engine', tr: 'Yapay Zeka Motoru', zh: 'AI引擎' },
  'nav.adGenerator': { en: 'Ad Generator', ar: 'منشئ الإعلانات', es: 'Generador de Anuncios', fr: 'Générateur de Pub', de: 'Anzeigengenerator', tr: 'Reklam Oluşturucu', zh: '广告生成器' },
  'nav.accounting': { en: 'Accounting', ar: 'المحاسبة', es: 'Contabilidad', fr: 'Comptabilité', de: 'Buchhaltung', tr: 'Muhasebe', zh: '财务' },
  'nav.alerts': { en: 'Alerts', ar: 'التنبيهات', es: 'Alertas', fr: 'Alertes', de: 'Benachrichtigungen', tr: 'Uyarılar', zh: '提醒' },
  'nav.reports': { en: 'Reports', ar: 'التقارير', es: 'Informes', fr: 'Rapports', de: 'Berichte', tr: 'Raporlar', zh: '报告' },
  'nav.amazonNews': { en: 'Amazon News', ar: 'أخبار أمازون', es: 'Noticias Amazon', fr: 'Actualités Amazon', de: 'Amazon Nachrichten', tr: 'Amazon Haberleri', zh: '亚马逊新闻' },
  'nav.amazonConnect': { en: 'Amazon Connect', ar: 'ربط أمازون', es: 'Conectar Amazon', fr: 'Connexion Amazon', de: 'Amazon verbinden', tr: 'Amazon Bağlantısı', zh: '亚马逊连接' },
  'nav.changeLog': { en: 'Change Log', ar: 'سجل التغييرات', es: 'Registro de Cambios', fr: 'Journal des modifications', de: 'Änderungsprotokoll', tr: 'Değişiklik Günlüğü', zh: '变更日志' },
  'nav.aiAssistant': { en: 'AI Assistant', ar: 'المساعد الذكي', es: 'Asistente IA', fr: 'Assistant IA', de: 'KI-Assistent', tr: 'Yapay Zeka Asistanı', zh: 'AI助手' },
  'nav.helpCenter': { en: 'Help Center', ar: 'مركز المساعدة', es: 'Centro de Ayuda', fr: "Centre d'aide", de: 'Hilfecenter', tr: 'Yardım Merkezi', zh: '帮助中心' },
  'nav.subscriptions': { en: 'Subscriptions', ar: 'الاشتراكات', es: 'Suscripciones', fr: 'Abonnements', de: 'Abonnements', tr: 'Abonelikler', zh: '订阅' },
  'nav.settings': { en: 'Settings', ar: 'الإعدادات', es: 'Configuración', fr: 'Paramètres', de: 'Einstellungen', tr: 'Ayarlar', zh: '设置' },
  'nav.adminPanel': { en: 'Admin Panel', ar: 'لوحة الإدارة', es: 'Panel Admin', fr: "Panneau d'admin", de: 'Adminbereich', tr: 'Yönetim Paneli', zh: '管理面板' },

  'dash.title': { en: 'Dashboard', ar: 'لوحة التحكم', es: 'Panel', fr: 'Tableau de bord', de: 'Dashboard', tr: 'Gösterge Paneli', zh: '仪表盘' },
  'dash.welcome': { en: 'Welcome, Ahmed — Last updated: Today 14:30', ar: 'أهلاً أحمد — آخر تحديث: اليوم 14:30', es: 'Bienvenido, Ahmed — Última actualización: Hoy 14:30', fr: 'Bienvenue, Ahmed — Dernière mise à jour : Aujourd\'hui 14:30', de: 'Willkommen, Ahmed — Letztes Update: Heute 14:30', tr: 'Hoş geldin, Ahmed — Son güncelleme: Bugün 14:30', zh: '欢迎，Ahmed — 最后更新：今天 14:30' },
  'dash.monthly': { en: 'Monthly', ar: 'شهري', es: 'Mensual', fr: 'Mensuel', de: 'Monatlich', tr: 'Aylık', zh: '月度' },
  'dash.twoWeeks': { en: '2 Weeks', ar: 'أسبوعين', es: '2 Semanas', fr: '2 Semaines', de: '2 Wochen', tr: '2 Hafta', zh: '2周' },
  'dash.sales': { en: 'Sales', ar: 'المبيعات', es: 'Ventas', fr: 'Ventes', de: 'Umsatz', tr: 'Satışlar', zh: '销售额' },
  'dash.orders': { en: 'Orders', ar: 'الطلبات', es: 'Pedidos', fr: 'Commandes', de: 'Bestellungen', tr: 'Siparişler', zh: '订单' },
  'dash.cost': { en: 'Cost', ar: 'التكلفة', es: 'Costo', fr: 'Coût', de: 'Kosten', tr: 'Maliyet', zh: '成本' },
  'dash.acos': { en: 'ACOS', ar: 'ACOS', es: 'ACOS', fr: 'ACOS', de: 'ACOS', tr: 'ACOS', zh: 'ACOS' },
  'dash.clicks': { en: 'Clicks', ar: 'النقرات', es: 'Clics', fr: 'Clics', de: 'Klicks', tr: 'Tıklamalar', zh: '点击' },
  'dash.profit': { en: 'Profit', ar: 'الربح', es: 'Ganancia', fr: 'Profit', de: 'Gewinn', tr: 'Kâr', zh: '利润' },
  'dash.adSpend': { en: 'Ad Spend', ar: 'الإنفاق الإعلاني', es: 'Gasto en Ads', fr: 'Dépense Pub', de: 'Werbeausgaben', tr: 'Reklam Harcaması', zh: '广告支出' },
  'dash.unitsSold': { en: 'Units Sold', ar: 'الوحدات المباعة', es: 'Unidades Vendidas', fr: 'Unités Vendues', de: 'Verkaufte Einheiten', tr: 'Satılan Adet', zh: '已售数量' },
  'dash.tacos': { en: 'TACoS', ar: 'TACoS', es: 'TACoS', fr: 'TACoS', de: 'TACoS', tr: 'TACoS', zh: 'TACoS' },
  'dash.dailyBudget': { en: 'Daily Budget', ar: 'الميزانية اليومية', es: 'Presupuesto Diario', fr: 'Budget Quotidien', de: 'Tagesbudget', tr: 'Günlük Bütçe', zh: '每日预算' },
  'dash.salesAndSpend': { en: 'Sales & Spend', ar: 'المبيعات والإنفاق', es: 'Ventas y Gasto', fr: 'Ventes et Dépenses', de: 'Umsatz & Ausgaben', tr: 'Satış ve Harcama', zh: '销售与支出' },
  'dash.campaignMix': { en: 'Campaign Mix', ar: 'توزيع الحملات', es: 'Mezcla de Campañas', fr: 'Mix Campagnes', de: 'Kampagnen-Mix', tr: 'Kampanya Dağılımı', zh: '广告活动组合' },
  'dash.alerts': { en: 'Alerts', ar: 'التنبيهات', es: 'Alertas', fr: 'Alertes', de: 'Warnungen', tr: 'Uyarılar', zh: '提醒' },
  'dash.viewAll': { en: 'View all →', ar: 'عرض الكل ←', es: 'Ver todo →', fr: 'Tout voir →', de: 'Alle anzeigen →', tr: 'Tümünü gör →', zh: '查看全部 →' },
  'dash.productPerformance': { en: 'Product Performance', ar: 'أداء المنتجات', es: 'Rendimiento de Productos', fr: 'Performance Produits', de: 'Produktleistung', tr: 'Ürün Performansı', zh: '产品表现' },
  'dash.spend': { en: 'Spend', ar: 'الإنفاق', es: 'Gasto', fr: 'Dépense', de: 'Ausgaben', tr: 'Harcama', zh: '支出' },
  'dash.units': { en: 'Units', ar: 'الوحدات', es: 'Unidades', fr: 'Unités', de: 'Einheiten', tr: 'Adet', zh: '数量' },
  'dash.product': { en: 'Product', ar: 'المنتج', es: 'Producto', fr: 'Produit', de: 'Produkt', tr: 'Ürün', zh: '产品' },
  'dash.today': { en: 'Today', ar: 'اليوم', es: 'Hoy', fr: "Aujourd'hui", de: 'Heute', tr: 'Bugün', zh: '今天' },
  'dash.last7Days': { en: 'Last 7 Days', ar: 'آخر 7 أيام', es: 'Últimos 7 Días', fr: '7 Derniers Jours', de: 'Letzte 7 Tage', tr: 'Son 7 Gün', zh: '最近7天' },
  'dash.last30Days': { en: 'Last 30 Days', ar: 'آخر 30 يوم', es: 'Últimos 30 Días', fr: '30 Derniers Jours', de: 'Letzte 30 Tage', tr: 'Son 30 Gün', zh: '最近30天' },
  'dash.custom': { en: 'Custom', ar: 'مخصص', es: 'Personalizado', fr: 'Personnalisé', de: 'Benutzerdefiniert', tr: 'Özel', zh: '自定义' },
  'dash.salesLabel': { en: 'Sales', ar: 'المبيعات', es: 'Ventas', fr: 'Ventes', de: 'Umsatz', tr: 'Satışlar', zh: '销售额' },
  'dash.spendLabel': { en: 'Spend', ar: 'الإنفاق', es: 'Gasto', fr: 'Dépense', de: 'Ausgaben', tr: 'Harcama', zh: '支出' },
  'dash.lineChart': { en: 'Line Chart', ar: 'خط بياني', es: 'Gráfico de Línea', fr: 'Graphique en ligne', de: 'Liniendiagramm', tr: 'Çizgi Grafik', zh: '折线图' },
  'dash.barChart': { en: 'Bar Chart', ar: 'أعمدة بيانية', es: 'Gráfico de Barras', fr: 'Graphique en barres', de: 'Balkendiagramm', tr: 'Çubuk Grafik', zh: '柱状图' },

  'budget.lowWarning': {
    en: '⚠️ Current budget is low. For better results, it is recommended to have at least 40 SAR daily per product.',
    ar: '⚠️ الميزانية الحالية منخفضة. للحصول على نتائج أفضل، يفضل أن تكون 40 ريال يوميًا لكل منتج.',
    es: '⚠️ El presupuesto actual es bajo. Para mejores resultados, se recomienda al menos 40 SAR diarios por producto.',
    fr: '⚠️ Le budget actuel est faible. Pour de meilleurs résultats, il est recommandé d\'avoir au moins 40 SAR par jour et par produit.',
    de: '⚠️ Das aktuelle Budget ist niedrig. Für bessere Ergebnisse werden mindestens 40 SAR täglich pro Produkt empfohlen.',
    tr: '⚠️ Mevcut bütçe düşük. Daha iyi sonuçlar için ürün başına günlük en az 40 SAR önerilir.',
    zh: '⚠️ 当前预算偏低。为获得更好结果，建议每个产品每天至少40 SAR。'
  },

  'auto.on': { en: 'Automation ON', ar: 'الأتمتة مفعّلة', es: 'Automatización ACTIVADA', fr: 'Automatisation ACTIVÉE', de: 'Automatisierung AN', tr: 'Otomasyon AÇIK', zh: '自动化已开启' },
  'auto.off': { en: 'Stop Automation', ar: 'إيقاف الأتمتة', es: 'Detener Automatización', fr: "Arrêter l'automatisation", de: 'Automatisierung stoppen', tr: 'Otomasyonu Durdur', zh: '停止自动化' },
  'auto.warning': {
    en: "⚠️ Bot is active — if you don't stop it, it will manage campaigns automatically.",
    ar: '⚠️ البوت مفعل — إذا ما أوقفته، راح يدير الحملات تلقائيًا',
    es: '⚠️ El bot está activo — si no lo detienes, gestionará las campañas automáticamente.',
    fr: "⚠️ Le bot est actif — si vous ne l'arrêtez pas, il gérera les campagnes automatiquement.",
    de: '⚠️ Bot ist aktiv — wenn Sie ihn nicht stoppen, verwaltet er die Kampagnen automatisch.',
    tr: '⚠️ Bot aktif — durdurmazsanız kampanyaları otomatik yönetecek.',
    zh: '⚠️ 机器人已激活 — 如不停止，将自动管理广告活动。'
  },
  'auto.title': { en: 'Automation Control', ar: 'التحكم بالأتمتة', es: 'Control de Automatización', fr: "Contrôle d'automatisation", de: 'Automatisierungssteuerung', tr: 'Otomasyon Kontrolü', zh: '自动化控制' },
  'auto.desc': { en: 'Enable or disable automatic campaign management', ar: 'تفعيل أو تعطيل إدارة الحملات التلقائية', es: 'Activar o desactivar la gestión automática de campañas', fr: 'Activer ou désactiver la gestion automatique des campagnes', de: 'Automatische Kampagnenverwaltung aktivieren oder deaktivieren', tr: 'Otomatik kampanya yönetimini etkinleştir veya devre dışı bırak', zh: '启用或禁用自动广告活动管理' },
  'auto.banner': { en: 'Bot is managing campaigns automatically', ar: 'البوت يدير الحملات تلقائيًا', es: 'El bot gestiona las campañas automáticamente', fr: 'Le bot gère les campagnes automatiquement', de: 'Bot verwaltet Kampagnen automatisch', tr: 'Bot kampanyaları otomatik yönetiyor', zh: '机器人正在自动管理广告活动' },

  'settings.title': { en: 'Settings', ar: 'الإعدادات', es: 'Configuración', fr: 'Paramètres', de: 'Einstellungen', tr: 'Ayarlar', zh: '设置' },
  'settings.subtitle': { en: 'Account settings and preferences', ar: 'إعدادات الحساب والتفضيلات', es: 'Configuración de cuenta y preferencias', fr: 'Paramètres du compte et préférences', de: 'Kontoeinstellungen und Präferenzen', tr: 'Hesap ayarları ve tercihler', zh: '账户设置和偏好' },
  'settings.language': { en: 'Language', ar: 'اللغة', es: 'Idioma', fr: 'Langue', de: 'Sprache', tr: 'Dil', zh: '语言' },
  'settings.tone': { en: 'Response Style', ar: 'أسلوب الرد', es: 'Estilo de Respuesta', fr: 'Style de réponse', de: 'Antwortstil', tr: 'Yanıt Tarzı', zh: '回复风格' },
  'settings.toneFriendly': { en: 'Friendly', ar: 'ودّي', es: 'Amigable', fr: 'Amical', de: 'Freundlich', tr: 'Samimi', zh: '友好' },
  'settings.toneProfessional': { en: 'Professional', ar: 'رسمي', es: 'Profesional', fr: 'Professionnel', de: 'Professionell', tr: 'Profesyonel', zh: '专业' },
  'settings.toneBrief': { en: 'Brief', ar: 'مختصر', es: 'Breve', fr: 'Bref', de: 'Kurz', tr: 'Kısa', zh: '简洁' },
  'settings.amazonStore': { en: 'Amazon Store Link', ar: 'رابط متجر أمازون', es: 'Enlace de Tienda Amazon', fr: 'Lien Boutique Amazon', de: 'Amazon-Shop-Link', tr: 'Amazon Mağaza Bağlantısı', zh: '亚马逊店铺链接' },
  'settings.storeUrl': { en: 'Store URL', ar: 'رابط المتجر', es: 'URL de Tienda', fr: 'URL de la boutique', de: 'Shop-URL', tr: 'Mağaza URL', zh: '店铺URL' },
  'settings.storeUrlPlaceholder': { en: 'https://www.amazon.com/...', ar: 'https://www.amazon.sa/...', es: 'https://www.amazon.es/...', fr: 'https://www.amazon.fr/...', de: 'https://www.amazon.de/...', tr: 'https://www.amazon.com.tr/...', zh: 'https://www.amazon.cn/...' },
  'settings.currency': { en: 'Currency & Region', ar: 'العملة والمنطقة', es: 'Moneda y Región', fr: 'Devise et Région', de: 'Währung & Region', tr: 'Para Birimi ve Bölge', zh: '货币与地区' },
  'settings.currencyLabel': { en: 'Currency', ar: 'العملة', es: 'Moneda', fr: 'Devise', de: 'Währung', tr: 'Para Birimi', zh: '货币' },
  'settings.timezone': { en: 'Timezone', ar: 'المنطقة الزمنية', es: 'Zona Horaria', fr: 'Fuseau horaire', de: 'Zeitzone', tr: 'Saat Dilimi', zh: '时区' },
  'settings.perfGoals': { en: 'Performance Goals', ar: 'أهداف الأداء', es: 'Objetivos de Rendimiento', fr: 'Objectifs de performance', de: 'Leistungsziele', tr: 'Performans Hedefleri', zh: '绩效目标' },
  'settings.targetAcos': { en: 'Target ACOS (%)', ar: 'ACOS المستهدف (%)', es: 'ACOS Objetivo (%)', fr: 'ACOS Cible (%)', de: 'Ziel-ACOS (%)', tr: 'Hedef ACOS (%)', zh: '目标ACOS (%)' },
  'settings.notifications': { en: 'Notifications', ar: 'الإشعارات', es: 'Notificaciones', fr: 'Notifications', de: 'Benachrichtigungen', tr: 'Bildirimler', zh: '通知' },
  'settings.emailAlerts': { en: 'Email Alerts', ar: 'تنبيهات البريد', es: 'Alertas por Correo', fr: 'Alertes par e-mail', de: 'E-Mail-Benachrichtigungen', tr: 'E-posta Uyarıları', zh: '邮件提醒' },
  'settings.emailAlertsDesc': { en: 'Get instant alerts when performance declines', ar: 'احصل على تنبيهات فورية عند تراجع الأداء', es: 'Recibe alertas instantáneas cuando el rendimiento baja', fr: 'Recevez des alertes instantanées en cas de baisse des performances', de: 'Erhalten Sie sofortige Benachrichtigungen bei Leistungsabfall', tr: 'Performans düştüğünde anında uyarı alın', zh: '当绩效下降时获得即时提醒' },
  'settings.autoOptimize': { en: 'Auto-Optimize', ar: 'التحسين التلقائي', es: 'Auto-Optimizar', fr: 'Auto-Optimisation', de: 'Auto-Optimierung', tr: 'Otomatik Optimizasyon', zh: '自动优化' },
  'settings.autoOptimizeDesc': { en: 'Allow AI to apply recommendations automatically', ar: 'السماح للذكاء الاصطناعي بتطبيق التوصيات تلقائيًا', es: 'Permitir que la IA aplique recomendaciones automáticamente', fr: "Permettre à l'IA d'appliquer les recommandations automatiquement", de: 'KI erlauben, Empfehlungen automatisch anzuwenden', tr: 'Yapay zekanın önerileri otomatik uygulamasına izin ver', zh: '允许AI自动应用建议' },
  'settings.dangerZone': { en: 'Danger Zone', ar: 'منطقة الخطر', es: 'Zona de Peligro', fr: 'Zone de danger', de: 'Gefahrenzone', tr: 'Tehlikeli Bölge', zh: '危险区域' },
  'settings.deleteAll': { en: 'Delete All Data', ar: 'حذف جميع البيانات', es: 'Eliminar Todos los Datos', fr: 'Supprimer toutes les données', de: 'Alle Daten löschen', tr: 'Tüm Verileri Sil', zh: '删除所有数据' },
  'settings.deleteAllDesc': { en: 'Permanently delete all account data — cannot be undone', ar: 'حذف جميع بيانات الحساب نهائيًا — لا يمكن التراجع', es: 'Eliminar permanentemente todos los datos — no se puede deshacer', fr: 'Supprimer définitivement toutes les données — irréversible', de: 'Alle Kontodaten dauerhaft löschen — nicht rückgängig zu machen', tr: 'Tüm hesap verilerini kalıcı olarak sil — geri alınamaz', zh: '永久删除所有账户数据 — 不可撤销' },
  'settings.deleteAccount': { en: 'Delete Account', ar: 'حذف الحساب', es: 'Eliminar Cuenta', fr: 'Supprimer le compte', de: 'Konto löschen', tr: 'Hesabı Sil', zh: '删除账户' },
  'settings.save': { en: 'Save Settings', ar: 'حفظ الإعدادات', es: 'Guardar Configuración', fr: 'Enregistrer les paramètres', de: 'Einstellungen speichern', tr: 'Ayarları Kaydet', zh: '保存设置' },
  'settings.saved': { en: '✓ Saved!', ar: '✓ تم الحفظ!', es: '✓ ¡Guardado!', fr: '✓ Enregistré !', de: '✓ Gespeichert!', tr: '✓ Kaydedildi!', zh: '✓ 已保存！' },
  'settings.langAndTone': { en: 'Language & Tone', ar: 'اللغة والنبرة', es: 'Idioma y Tono', fr: 'Langue et Ton', de: 'Sprache & Ton', tr: 'Dil ve Ton', zh: '语言与语气' },
  'settings.deleteDesc': { en: 'Permanently delete your account and all data', ar: 'حذف حسابك وجميع بياناتك نهائياً', es: 'Eliminar permanentemente tu cuenta y todos los datos', fr: 'Supprimer définitivement votre compte et toutes les données', de: 'Konto und alle Daten dauerhaft löschen', tr: 'Hesabınızı ve tüm verilerinizi kalıcı olarak silin', zh: '永久删除您的账户和所有数据' },
  'settings.sarOption': { en: 'Saudi Riyal (SAR)', ar: 'ريال سعودي (SAR)', es: 'Riyal Saudí (SAR)', fr: 'Riyal Saoudien (SAR)', de: 'Saudi-Riyal (SAR)', tr: 'Suudi Riyali (SAR)', zh: '沙特里亚尔 (SAR)' },
  'settings.usdOption': { en: 'US Dollar (USD)', ar: 'دولار أمريكي (USD)', es: 'Dólar Estadounidense (USD)', fr: 'Dollar Américain (USD)', de: 'US-Dollar (USD)', tr: 'ABD Doları (USD)', zh: '美元 (USD)' },
  'settings.aedOption': { en: 'UAE Dirham (AED)', ar: 'درهم إماراتي (AED)', es: 'Dirham de los EAU (AED)', fr: 'Dirham des ÉAU (AED)', de: 'VAE-Dirham (AED)', tr: 'BAE Dirhemi (AED)', zh: '阿联酋迪拉姆 (AED)' },

  'products.title': { en: 'Products & Keywords', ar: 'المنتجات والكلمات المفتاحية', es: 'Productos y Palabras Clave', fr: 'Produits et Mots-clés', de: 'Produkte & Schlüsselwörter', tr: 'Ürünler ve Anahtar Kelimeler', zh: '产品与关键词' },
  'products.search': { en: 'Search by name or ASIN...', ar: 'البحث بالاسم أو ASIN...', es: 'Buscar por nombre o ASIN...', fr: 'Rechercher par nom ou ASIN...', de: 'Nach Name oder ASIN suchen...', tr: 'İsim veya ASIN ile ara...', zh: '按名称或ASIN搜索...' },
  'products.brand': { en: 'Brand:', ar: 'العلامة:', es: 'Marca:', fr: 'Marque :', de: 'Marke:', tr: 'Marka:', zh: '品牌：' },
  'products.allBrands': { en: 'All', ar: 'الكل', es: 'Todas', fr: 'Toutes', de: 'Alle', tr: 'Tümü', zh: '全部' },
  'products.allStatus': { en: 'All Status', ar: 'كل الحالات', es: 'Todos los Estados', fr: 'Tous les statuts', de: 'Alle Status', tr: 'Tüm Durumlar', zh: '所有状态' },
  'products.active': { en: 'Active', ar: 'نشط', es: 'Activo', fr: 'Actif', de: 'Aktiv', tr: 'Aktif', zh: '活跃' },
  'products.weak': { en: 'Weak', ar: 'ضعيف', es: 'Débil', fr: 'Faible', de: 'Schwach', tr: 'Zayıf', zh: '弱' },
  'products.poor': { en: 'Poor', ar: 'سيئ', es: 'Pobre', fr: 'Mauvais', de: 'Schlecht', tr: 'Kötü', zh: '差' },
  'products.details': { en: 'Product Details', ar: 'تفاصيل المنتج', es: 'Detalles del Producto', fr: 'Détails du produit', de: 'Produktdetails', tr: 'Ürün Detayları', zh: '产品详情' },
  'products.exclude': { en: 'Exclude', ar: 'استبعاد', es: 'Excluir', fr: 'Exclure', de: 'Ausschließen', tr: 'Hariç Tut', zh: '排除' },
  'products.moveBlacklist': { en: 'Move to Blacklist', ar: 'نقل للقائمة السوداء', es: 'Mover a Lista Negra', fr: 'Déplacer en liste noire', de: 'Zur Schwarzen Liste', tr: 'Kara Listeye Taşı', zh: '移至黑名单' },
  'products.keywords': { en: 'Keywords', ar: 'الكلمات المفتاحية', es: 'Palabras Clave', fr: 'Mots-clés', de: 'Schlüsselwörter', tr: 'Anahtar Kelimeler', zh: '关键词' },
  'products.negKeywords': { en: 'Negative Keywords', ar: 'كلمات مفتاحية سلبية', es: 'Palabras Clave Negativas', fr: 'Mots-clés négatifs', de: 'Negative Schlüsselwörter', tr: 'Negatif Anahtar Kelimeler', zh: '否定关键词' },
  'products.asin': { en: 'ASIN', ar: 'ASIN', es: 'ASIN', fr: 'ASIN', de: 'ASIN', tr: 'ASIN', zh: 'ASIN' },
  'products.status': { en: 'Status', ar: 'الحالة', es: 'Estado', fr: 'Statut', de: 'Status', tr: 'Durum', zh: '状态' },
  'products.action': { en: 'Action', ar: 'الإجراء', es: 'Acción', fr: 'Action', de: 'Aktion', tr: 'İşlem', zh: '操作' },
  'products.none': { en: 'None', ar: 'لا يوجد', es: 'Ninguno', fr: 'Aucun', de: 'Keine', tr: 'Yok', zh: '无' },

  'bot.title': { en: 'AI Assistant', ar: 'المساعد الذكي', es: 'Asistente IA', fr: 'Assistant IA', de: 'KI-Assistent', tr: 'Yapay Zeka Asistanı', zh: 'AI助手' },
  'bot.subtitle': { en: 'Powered by GPT-4o mini — ask anything about Amazon advertising or the platform', ar: 'مدعوم بـ GPT-4o mini — اسأل أي شيء عن إعلانات أمازون أو المنصة', es: 'Impulsado por GPT-4o mini — pregunta cualquier cosa sobre publicidad en Amazon', fr: 'Propulsé par GPT-4o mini — posez toute question sur la publicité Amazon', de: 'Powered by GPT-4o mini — fragen Sie alles über Amazon-Werbung', tr: 'GPT-4o mini ile güçlendirilmiş — Amazon reklamcılığı hakkında her şeyi sorun', zh: '由GPT-4o mini驱动 — 询问任何有关亚马逊广告的问题' },
  'bot.welcomeEn': { en: "Hello! I'm the M20 AI Assistant — your Amazon advertising expert. I can help you with campaigns, keywords, ACOS/ROAS, and how to use the platform. What would you like to know?", ar: '' },
  'bot.welcomeAr': { en: '', ar: 'أهلاً! أنا المساعد الذكي M20 — خبير إعلانات أمازون. أقدر أساعدك في الحملات، الكلمات المفتاحية، ACOS/ROAS، واستخدام المنصة. كيف أقدر أساعدك؟' },
  'bot.placeholder': { en: 'Ask anything about Amazon advertising...', ar: 'اسأل أي شيء عن إعلانات أمازون...', es: 'Pregunta cualquier cosa sobre publicidad en Amazon...', fr: 'Posez toute question sur la publicité Amazon...', de: 'Fragen Sie alles über Amazon-Werbung...', tr: 'Amazon reklamcılığı hakkında bir şey sorun...', zh: '询问有关亚马逊广告的任何问题...' },
  'bot.scope': {
    en: 'This assistant only answers questions about Amazon advertising and the M20 platform.',
    ar: 'هذا المساعد يجيب فقط على أسئلة إعلانات أمازون ومنصة M20.',
    es: 'Este asistente solo responde preguntas sobre publicidad en Amazon y la plataforma M20.',
    fr: "Cet assistant ne répond qu'aux questions sur la publicité Amazon et la plateforme M20.",
    de: 'Dieser Assistent beantwortet nur Fragen zu Amazon-Werbung und der M20-Plattform.',
    tr: 'Bu asistan sadece Amazon reklamcılığı ve M20 platformu hakkındaki soruları yanıtlar.',
    zh: '此助手仅回答有关亚马逊广告和M20平台的问题。'
  },
  'bot.billingContact': { en: 'For billing or account issues, email', ar: 'لمشاكل الفواتير أو الحساب، تواصل عبر', es: 'Para problemas de facturación o cuenta, envía un correo a', fr: 'Pour les problèmes de facturation ou de compte, envoyez un e-mail à', de: 'Bei Abrechnungs- oder Kontoproblemen, E-Mail an', tr: 'Fatura veya hesap sorunları için e-posta gönderin', zh: '如有账单或账户问题，请发送邮件至' },
  'bot.you': { en: 'You', ar: 'أنت', es: 'Tú', fr: 'Vous', de: 'Du', tr: 'Sen', zh: '你' },
  'bot.send': { en: 'Send', ar: 'إرسال', es: 'Enviar', fr: 'Envoyer', de: 'Senden', tr: 'Gönder', zh: '发送' },
  'bot.typing': { en: 'Typing...', ar: 'يكتب...', es: 'Escribiendo...', fr: 'Saisie...', de: 'Schreibt...', tr: 'Yazıyor...', zh: '输入中...' },

  'common.search': { en: 'Search...', ar: 'بحث...', es: 'Buscar...', fr: 'Rechercher...', de: 'Suchen...', tr: 'Ara...', zh: '搜索...' },
  'common.notifications': { en: 'Notifications', ar: 'الإشعارات', es: 'Notificaciones', fr: 'Notifications', de: 'Benachrichtigungen', tr: 'Bildirimler', zh: '通知' },
  'common.markAllRead': { en: 'Mark all read', ar: 'تحديد الكل كمقروء', es: 'Marcar todo como leído', fr: 'Tout marquer comme lu', de: 'Alle als gelesen markieren', tr: 'Tümünü okundu işaretle', zh: '全部标为已读' },
  'common.allCaughtUp': { en: 'All caught up!', ar: 'لا يوجد إشعارات جديدة!', es: '¡Todo al día!', fr: 'Tout est à jour !', de: 'Alles gelesen!', tr: 'Hepsi okundu!', zh: '全部已读！' },
  'common.logOut': { en: 'Log Out', ar: 'تسجيل الخروج', es: 'Cerrar Sesión', fr: 'Déconnexion', de: 'Abmelden', tr: 'Çıkış Yap', zh: '退出登录' },
  'common.user': { en: 'User', ar: 'المستخدم', es: 'Usuario', fr: 'Utilisateur', de: 'Benutzer', tr: 'Kullanıcı', zh: '用户' },
  'common.guest': { en: 'Guest', ar: 'ضيف', es: 'Invitado', fr: 'Invité', de: 'Gast', tr: 'Misafir', zh: '访客' },
  'common.openFullChat': { en: 'Open full chat →', ar: 'افتح المحادثة ←', es: 'Abrir chat completo →', fr: 'Ouvrir le chat complet →', de: 'Vollchat öffnen →', tr: 'Tam sohbeti aç →', zh: '打开完整聊天 →' },
  'common.hi': { en: 'Hi', ar: 'أهلاً', es: 'Hola', fr: 'Bonjour', de: 'Hallo', tr: 'Merhaba', zh: '你好' },
  'common.howCanIHelp': { en: 'How can I help you today?', ar: 'كيف أقدر أساعدك اليوم؟', es: '¿Cómo puedo ayudarte hoy?', fr: "Comment puis-je vous aider aujourd'hui ?", de: 'Wie kann ich Ihnen heute helfen?', tr: 'Bugün size nasıl yardımcı olabilirim?', zh: '今天我能帮您什么？' },
  'common.noResults': { en: 'No results found', ar: 'لا توجد نتائج', es: 'No se encontraron resultados', fr: 'Aucun résultat trouvé', de: 'Keine Ergebnisse gefunden', tr: 'Sonuç bulunamadı', zh: '未找到结果' },
  'common.loading': { en: 'Loading...', ar: 'جاري التحميل...', es: 'Cargando...', fr: 'Chargement...', de: 'Laden...', tr: 'Yükleniyor...', zh: '加载中...' },
  'common.save': { en: 'Save', ar: 'حفظ', es: 'Guardar', fr: 'Enregistrer', de: 'Speichern', tr: 'Kaydet', zh: '保存' },
  'common.cancel': { en: 'Cancel', ar: 'إلغاء', es: 'Cancelar', fr: 'Annuler', de: 'Abbrechen', tr: 'İptal', zh: '取消' },
  'common.delete': { en: 'Delete', ar: 'حذف', es: 'Eliminar', fr: 'Supprimer', de: 'Löschen', tr: 'Sil', zh: '删除' },
  'common.edit': { en: 'Edit', ar: 'تعديل', es: 'Editar', fr: 'Modifier', de: 'Bearbeiten', tr: 'Düzenle', zh: '编辑' },
  'common.add': { en: 'Add', ar: 'إضافة', es: 'Agregar', fr: 'Ajouter', de: 'Hinzufügen', tr: 'Ekle', zh: '添加' },
  'common.all': { en: 'All', ar: 'الكل', es: 'Todos', fr: 'Tous', de: 'Alle', tr: 'Tümü', zh: '全部' },
  'common.active': { en: 'Active', ar: 'نشط', es: 'Activo', fr: 'Actif', de: 'Aktiv', tr: 'Aktif', zh: '活跃' },
  'common.paused': { en: 'Paused', ar: 'متوقف', es: 'Pausado', fr: 'En pause', de: 'Pausiert', tr: 'Duraklatıldı', zh: '已暂停' },
  'common.status': { en: 'Status', ar: 'الحالة', es: 'Estado', fr: 'Statut', de: 'Status', tr: 'Durum', zh: '状态' },

  'campaigns.title': { en: 'Campaigns', ar: 'الحملات', es: 'Campañas', fr: 'Campagnes', de: 'Kampagnen', tr: 'Kampanyalar', zh: '广告活动' },
  'campaigns.count': { en: 'campaigns', ar: 'حملة', es: 'campañas', fr: 'campagnes', de: 'Kampagnen', tr: 'kampanya', zh: '个广告活动' },
  'campaigns.search': { en: 'Search campaigns...', ar: 'البحث في الحملات...', es: 'Buscar campañas...', fr: 'Rechercher des campagnes...', de: 'Kampagnen suchen...', tr: 'Kampanya ara...', zh: '搜索广告活动...' },
  'campaigns.allStatus': { en: 'All Status', ar: 'كل الحالات', es: 'Todos los Estados', fr: 'Tous les statuts', de: 'Alle Status', tr: 'Tüm Durumlar', zh: '所有状态' },
  'campaigns.allTypes': { en: 'All Types', ar: 'كل الأنواع', es: 'Todos los Tipos', fr: 'Tous les types', de: 'Alle Typen', tr: 'Tüm Türler', zh: '所有类型' },
  'campaigns.campaign': { en: 'Campaign', ar: 'الحملة', es: 'Campaña', fr: 'Campagne', de: 'Kampagne', tr: 'Kampanya', zh: '广告活动' },
  'campaigns.budget': { en: 'Budget', ar: 'الميزانية', es: 'Presupuesto', fr: 'Budget', de: 'Budget', tr: 'Bütçe', zh: '预算' },
  'campaigns.roas': { en: 'ROAS', ar: 'ROAS', es: 'ROAS', fr: 'ROAS', de: 'ROAS', tr: 'ROAS', zh: 'ROAS' },
  'campaigns.ctr': { en: 'CTR', ar: 'نسبة النقر', es: 'CTR', fr: 'CTR', de: 'CTR', tr: 'TO', zh: '点击率' },
  'campaigns.impressions': { en: 'Impressions', ar: 'مرات الظهور', es: 'Impresiones', fr: 'Impressions', de: 'Impressionen', tr: 'Gösterimler', zh: '展示次数' },
  'campaigns.noMatch': { en: 'No campaigns match your search', ar: 'لا توجد حملات تطابق البحث', es: 'No hay campañas que coincidan con tu búsqueda', fr: 'Aucune campagne ne correspond à votre recherche', de: 'Keine Kampagnen gefunden', tr: 'Aramanızla eşleşen kampanya yok', zh: '没有匹配的广告活动' },

  'accounting.title': { en: 'Accounting', ar: 'المحاسبة', es: 'Contabilidad', fr: 'Comptabilité', de: 'Buchhaltung', tr: 'Muhasebe', zh: '财务' },
  'accounting.subtitle': { en: 'Revenue, costs, and profit analysis', ar: 'تحليل الإيرادات والتكاليف والأرباح', es: 'Análisis de ingresos, costos y ganancias', fr: 'Analyse des revenus, coûts et profits', de: 'Umsatz-, Kosten- und Gewinnanalyse', tr: 'Gelir, maliyet ve kâr analizi', zh: '收入、成本和利润分析' },
  'accounting.overview': { en: 'Overview', ar: 'نظرة عامة', es: 'Resumen', fr: 'Aperçu', de: 'Übersicht', tr: 'Genel Bakış', zh: '概览' },
  'accounting.daily': { en: 'Daily', ar: 'يومي', es: 'Diario', fr: 'Quotidien', de: 'Täglich', tr: 'Günlük', zh: '每日' },
  'accounting.byProduct': { en: 'By Product', ar: 'حسب المنتج', es: 'Por Producto', fr: 'Par produit', de: 'Nach Produkt', tr: 'Ürüne Göre', zh: '按产品' },
  'accounting.revenue': { en: 'Revenue', ar: 'الإيرادات', es: 'Ingresos', fr: 'Revenus', de: 'Umsatz', tr: 'Gelir', zh: '收入' },
  'accounting.productCost': { en: 'Product Cost', ar: 'تكلفة المنتج', es: 'Costo del Producto', fr: 'Coût du produit', de: 'Produktkosten', tr: 'Ürün Maliyeti', zh: '产品成本' },
  'accounting.netProfit': { en: 'Net Profit', ar: 'صافي الربح', es: 'Ganancia Neta', fr: 'Bénéfice net', de: 'Nettogewinn', tr: 'Net Kâr', zh: '净利润' },
  'accounting.margin': { en: 'Margin', ar: 'الهامش', es: 'Margen', fr: 'Marge', de: 'Marge', tr: 'Marj', zh: '利润率' },
  'accounting.aiInsight': { en: 'AI Insight', ar: 'رؤية الذكاء الاصطناعي', es: 'Perspectiva IA', fr: 'Analyse IA', de: 'KI-Einblick', tr: 'Yapay Zeka Analizi', zh: 'AI洞察' },
  'accounting.dailyPerformance': { en: 'Daily Performance', ar: 'الأداء اليومي', es: 'Rendimiento Diario', fr: 'Performance quotidienne', de: 'Tägliche Leistung', tr: 'Günlük Performans', zh: '每日表现' },
  'accounting.productProfit': { en: 'Product Profit', ar: 'أرباح المنتجات', es: 'Ganancia por Producto', fr: 'Profit par produit', de: 'Produktgewinn', tr: 'Ürün Kârı', zh: '产品利润' },
  'accounting.date': { en: 'Date', ar: 'التاريخ', es: 'Fecha', fr: 'Date', de: 'Datum', tr: 'Tarih', zh: '日期' },

  'alerts.title': { en: 'Alerts', ar: 'التنبيهات', es: 'Alertas', fr: 'Alertes', de: 'Warnungen', tr: 'Uyarılar', zh: '提醒' },
  'alerts.unread': { en: 'unread', ar: 'غير مقروءة', es: 'sin leer', fr: 'non lues', de: 'ungelesen', tr: 'okunmamış', zh: '未读' },
  'alerts.markAllRead': { en: 'Mark all as read', ar: 'تحديد الكل كمقروء', es: 'Marcar todo como leído', fr: 'Tout marquer comme lu', de: 'Alle als gelesen markieren', tr: 'Tümünü okundu işaretle', zh: '全部标为已读' },
  'alerts.allFilter': { en: 'All', ar: 'الكل', es: 'Todas', fr: 'Toutes', de: 'Alle', tr: 'Tümü', zh: '全部' },
  'alerts.unreadFilter': { en: 'Unread', ar: 'غير المقروءة', es: 'Sin leer', fr: 'Non lues', de: 'Ungelesen', tr: 'Okunmamış', zh: '未读' },
  'alerts.allTypes': { en: 'All Types', ar: 'كل الأنواع', es: 'Todos los Tipos', fr: 'Tous les types', de: 'Alle Typen', tr: 'Tüm Türler', zh: '所有类型' },
  'alerts.critical': { en: 'Critical', ar: 'حرجة', es: 'Crítica', fr: 'Critique', de: 'Kritisch', tr: 'Kritik', zh: '严重' },
  'alerts.warning': { en: 'Warning', ar: 'تحذير', es: 'Advertencia', fr: 'Avertissement', de: 'Warnung', tr: 'Uyarı', zh: '警告' },
  'alerts.good': { en: 'Good', ar: 'جيد', es: 'Bueno', fr: 'Bon', de: 'Gut', tr: 'İyi', zh: '良好' },
  'alerts.noAlerts': { en: 'No Alerts', ar: 'لا توجد تنبيهات', es: 'Sin Alertas', fr: 'Aucune alerte', de: 'Keine Warnungen', tr: 'Uyarı Yok', zh: '无提醒' },
  'alerts.allGood': { en: 'All good! Everything is running smoothly', ar: 'كل شيء على ما يرام! الأمور تسير بسلاسة', es: '¡Todo bien! Todo funciona correctamente', fr: 'Tout va bien ! Tout fonctionne correctement', de: 'Alles gut! Alles läuft reibungslos', tr: 'Her şey yolunda! Her şey sorunsuz çalışıyor', zh: '一切正常！运行顺畅' },

  'reports.title': { en: 'Reports', ar: 'التقارير', es: 'Informes', fr: 'Rapports', de: 'Berichte', tr: 'Raporlar', zh: '报告' },
  'reports.subtitle': { en: 'Performance & spend reports', ar: 'تقارير الأداء والإنفاق', es: 'Informes de rendimiento y gasto', fr: 'Rapports de performance et de dépenses', de: 'Leistungs- & Ausgabenberichte', tr: 'Performans ve harcama raporları', zh: '绩效与支出报告' },
  'reports.exportCsv': { en: 'Export CSV', ar: 'تصدير CSV', es: 'Exportar CSV', fr: 'Exporter CSV', de: 'CSV exportieren', tr: 'CSV İndir', zh: '导出CSV' },
  'reports.dailyToggle': { en: 'Daily', ar: 'يومي', es: 'Diario', fr: 'Quotidien', de: 'Täglich', tr: 'Günlük', zh: '每日' },
  'reports.weeklyToggle': { en: 'Weekly', ar: 'أسبوعي', es: 'Semanal', fr: 'Hebdomadaire', de: 'Wöchentlich', tr: 'Haftalık', zh: '每周' },
  'reports.monthlyToggle': { en: 'Monthly', ar: 'شهري', es: 'Mensual', fr: 'Mensuel', de: 'Monatlich', tr: 'Aylık', zh: '月度' },
  'reports.totalSales': { en: 'Total Sales', ar: 'إجمالي المبيعات', es: 'Ventas Totales', fr: 'Ventes totales', de: 'Gesamtumsatz', tr: 'Toplam Satış', zh: '总销售额' },
  'reports.totalSpend': { en: 'Total Spend', ar: 'إجمالي الإنفاق', es: 'Gasto Total', fr: 'Dépenses totales', de: 'Gesamtausgaben', tr: 'Toplam Harcama', zh: '总支出' },
  'reports.avgRoas': { en: 'Avg ROAS', ar: 'متوسط ROAS', es: 'ROAS Promedio', fr: 'ROAS moyen', de: 'Durchschn. ROAS', tr: 'Ort. ROAS', zh: '平均ROAS' },
  'reports.totalOrders': { en: 'Total Orders', ar: 'إجمالي الطلبات', es: 'Pedidos Totales', fr: 'Commandes totales', de: 'Gesamtbestellungen', tr: 'Toplam Sipariş', zh: '总订单' },
  'reports.salesAndSpend': { en: 'Sales & Spend', ar: 'المبيعات والإنفاق', es: 'Ventas y Gasto', fr: 'Ventes et Dépenses', de: 'Umsatz & Ausgaben', tr: 'Satış ve Harcama', zh: '销售与支出' },
  'reports.roasOverTime': { en: 'ROAS Over Time', ar: 'ROAS عبر الزمن', es: 'ROAS en el Tiempo', fr: 'ROAS dans le temps', de: 'ROAS im Zeitverlauf', tr: 'Zaman İçinde ROAS', zh: 'ROAS趋势' },

  'help.title': { en: 'Help Center', ar: 'مركز المساعدة', es: 'Centro de Ayuda', fr: "Centre d'aide", de: 'Hilfecenter', tr: 'Yardım Merkezi', zh: '帮助中心' },
  'help.subtitle': { en: 'Answers to frequently asked questions', ar: 'إجابات على الأسئلة الشائعة', es: 'Respuestas a preguntas frecuentes', fr: 'Réponses aux questions fréquentes', de: 'Antworten auf häufig gestellte Fragen', tr: 'Sık sorulan soruların cevapları', zh: '常见问题解答' },
  'help.search': { en: 'Search help articles...', ar: 'البحث في مقالات المساعدة...', es: 'Buscar artículos de ayuda...', fr: "Rechercher dans les articles d'aide...", de: 'Hilfeartikel suchen...', tr: 'Yardım makalelerini ara...', zh: '搜索帮助文章...' },
  'help.noResults': { en: 'No Results Found', ar: 'لا توجد نتائج', es: 'Sin Resultados', fr: 'Aucun résultat', de: 'Keine Ergebnisse', tr: 'Sonuç Bulunamadı', zh: '未找到结果' },
  'help.tryDifferent': { en: 'Try a different search term...', ar: 'جرب مصطلح بحث مختلف...', es: 'Prueba un término diferente...', fr: 'Essayez un autre terme...', de: 'Versuchen Sie einen anderen Begriff...', tr: 'Farklı bir arama terimi deneyin...', zh: '尝试不同的搜索词...' },
  'help.notFound': { en: "Didn't find what you're looking for?", ar: 'ما وجدت اللي تبحث عنه؟', es: '¿No encontraste lo que buscabas?', fr: "Vous n'avez pas trouvé ce que vous cherchez ?", de: 'Nicht gefunden, was Sie suchen?', tr: 'Aradığınızı bulamadınız mı?', zh: '没找到您要找的内容？' },
  'help.chatWithAi': { en: 'Chat with AI Assistant', ar: 'تحدث مع المساعد الذكي', es: 'Chatear con Asistente IA', fr: "Discuter avec l'assistant IA", de: 'Mit KI-Assistent chatten', tr: 'Yapay Zeka Asistanı ile Sohbet', zh: '与AI助手聊天' },

  'aiEngine.title': { en: 'AI Engine', ar: 'محرك الذكاء الاصطناعي', es: 'Motor IA', fr: 'Moteur IA', de: 'KI-Engine', tr: 'Yapay Zeka Motoru', zh: 'AI引擎' },
  'aiEngine.subtitle': { en: 'Intelligent campaign analysis and optimization', ar: 'تحليل وتحسين الحملات الذكي', es: 'Análisis y optimización inteligente de campañas', fr: 'Analyse et optimisation intelligentes des campagnes', de: 'Intelligente Kampagnenanalyse und -optimierung', tr: 'Akıllı kampanya analizi ve optimizasyonu', zh: '智能广告活动分析与优化' },
  'aiEngine.analyzeAll': { en: 'Analyze All Campaigns', ar: 'تحليل جميع الحملات', es: 'Analizar Todas las Campañas', fr: 'Analyser toutes les campagnes', de: 'Alle Kampagnen analysieren', tr: 'Tüm Kampanyaları Analiz Et', zh: '分析所有广告活动' },
  'aiEngine.analyzing': { en: 'Analyzing...', ar: 'جاري التحليل...', es: 'Analizando...', fr: 'Analyse en cours...', de: 'Analysiere...', tr: 'Analiz ediliyor...', zh: '分析中...' },
  'aiEngine.campaignsAnalyzed': { en: 'Campaigns Analyzed', ar: 'حملات تم تحليلها', es: 'Campañas Analizadas', fr: 'Campagnes analysées', de: 'Kampagnen analysiert', tr: 'Analiz Edilen Kampanyalar', zh: '已分析广告活动' },
  'aiEngine.criticalAction': { en: 'Critical — Needs Action', ar: 'حرجة — تحتاج إجراء', es: 'Crítico — Necesita Acción', fr: 'Critique — Action nécessaire', de: 'Kritisch — Handlung erforderlich', tr: 'Kritik — İşlem Gerekli', zh: '严重 — 需要处理' },
  'aiEngine.readyToScale': { en: 'Ready to Scale', ar: 'جاهزة للتوسع', es: 'Listo para Escalar', fr: 'Prêt à évoluer', de: 'Bereit zum Skalieren', tr: 'Ölçeklemeye Hazır', zh: '准备扩展' },
  'aiEngine.applied': { en: 'Applied', ar: 'تم التطبيق', es: 'Aplicado', fr: 'Appliqué', de: 'Angewendet', tr: 'Uygulandı', zh: '已应用' },
  'aiEngine.ruleDecision': { en: 'Rule Decision', ar: 'قرار القاعدة', es: 'Decisión de Regla', fr: 'Décision de règle', de: 'Regelentscheidung', tr: 'Kural Kararı', zh: '规则决策' },
  'aiEngine.gptAnalysis': { en: 'GPT-4o mini Analysis', ar: 'تحليل GPT-4o mini', es: 'Análisis GPT-4o mini', fr: 'Analyse GPT-4o mini', de: 'GPT-4o mini Analyse', tr: 'GPT-4o mini Analizi', zh: 'GPT-4o mini分析' },
  'aiEngine.markApplied': { en: 'Mark as Applied', ar: 'تحديد كمُطبق', es: 'Marcar como Aplicado', fr: 'Marquer comme appliqué', de: 'Als angewendet markieren', tr: 'Uygulandı Olarak İşaretle', zh: '标记为已应用' },
  'aiEngine.howItWorks': { en: 'How the Engine Works', ar: 'كيف يعمل المحرك', es: 'Cómo Funciona el Motor', fr: 'Comment fonctionne le moteur', de: 'So funktioniert die Engine', tr: 'Motor Nasıl Çalışır', zh: '引擎工作原理' },
  'aiEngine.step1': { en: 'Calculate Metrics', ar: 'حساب المقاييس', es: 'Calcular Métricas', fr: 'Calculer les métriques', de: 'Metriken berechnen', tr: 'Metrikleri Hesapla', zh: '计算指标' },
  'aiEngine.step2': { en: 'Rule-Based Decision', ar: 'قرار قائم على القواعد', es: 'Decisión Basada en Reglas', fr: 'Décision basée sur les règles', de: 'Regelbasierte Entscheidung', tr: 'Kural Tabanlı Karar', zh: '基于规则的决策' },
  'aiEngine.step3': { en: 'GPT-4o Refinement', ar: 'تحسين بـ GPT-4o', es: 'Refinamiento GPT-4o', fr: 'Affinement GPT-4o', de: 'GPT-4o Verfeinerung', tr: 'GPT-4o İyileştirmesi', zh: 'GPT-4o优化' },
  'aiEngine.pause': { en: 'Pause', ar: 'إيقاف', es: 'Pausar', fr: 'Pause', de: 'Pausieren', tr: 'Duraklat', zh: '暂停' },
  'aiEngine.scaleUp': { en: 'Scale Up', ar: 'توسيع', es: 'Escalar', fr: 'Augmenter', de: 'Hochskalieren', tr: 'Ölçekle', zh: '扩展' },
  'aiEngine.decreaseBid': { en: 'Decrease Bid', ar: 'تقليل المزايدة', es: 'Reducir Puja', fr: 'Réduire l\'enchère', de: 'Gebot senken', tr: 'Teklifi Düşür', zh: '降低出价' },
  'aiEngine.addNegative': { en: 'Add Negative', ar: 'إضافة كلمة سلبية', es: 'Agregar Negativa', fr: 'Ajouter un négatif', de: 'Negativ hinzufügen', tr: 'Negatif Ekle', zh: '添加否定词' },
  'aiEngine.keep': { en: 'Keep Running', ar: 'استمرار التشغيل', es: 'Seguir Ejecutando', fr: 'Continuer', de: 'Weiterlaufen lassen', tr: 'Çalışmaya Devam', zh: '继续运行' },
  'aiEngine.topPerforming': { en: 'Top Performing Products', ar: 'المنتجات الأفضل أداءً', es: 'Productos de Mayor Rendimiento', fr: 'Produits les plus performants', de: 'Top-Produkte', tr: 'En İyi Performans Gösteren Ürünler', zh: '最佳表现产品' },
  'aiEngine.needsAttention': { en: 'Needs Attention', ar: 'تحتاج اهتمام', es: 'Necesita Atención', fr: 'Nécessite une attention', de: 'Benötigt Aufmerksamkeit', tr: 'Dikkat Gerekli', zh: '需要关注' },
  'aiEngine.startAnalysis': { en: 'Start Analysis', ar: 'ابدأ التحليل', es: 'Iniciar Análisis', fr: "Lancer l'analyse", de: 'Analyse starten', tr: 'Analizi Başlat', zh: '开始分析' },
  'aiEngine.startDesc': { en: 'Click "Analyze All" or press play next to any campaign.', ar: 'انقر "تحليل الكل" أو اضغط تشغيل بجانب أي حملة.', es: 'Haz clic en "Analizar Todo" o presiona reproducir junto a cualquier campaña.', fr: 'Cliquez sur "Analyser tout" ou appuyez sur lecture à côté d\'une campagne.', de: 'Klicken Sie auf "Alle analysieren" oder drücken Sie Play neben einer Kampagne.', tr: '"Tümünü Analiz Et" tıklayın veya herhangi bir kampanyanın yanındaki oynat düğmesine basın.', zh: '点击"分析所有"或按任何广告活动旁边的播放按钮。' },

  'adGen.title': { en: 'Ad Generator', ar: 'منشئ الإعلانات', es: 'Generador de Anuncios', fr: 'Générateur de Pub', de: 'Anzeigengenerator', tr: 'Reklam Oluşturucu', zh: '广告生成器' },
  'adGen.subtitle': { en: 'AI-powered Amazon ad content generator', ar: 'منشئ محتوى إعلاني مدعوم بالذكاء الاصطناعي', es: 'Generador de contenido publicitario con IA para Amazon', fr: 'Générateur de contenu publicitaire Amazon alimenté par IA', de: 'KI-gestützter Amazon-Anzeigeninhaltsgenerator', tr: 'Yapay zeka destekli Amazon reklam içerik oluşturucu', zh: 'AI驱动的亚马逊广告内容生成器' },
  'adGen.productDetails': { en: 'Product Details', ar: 'تفاصيل المنتج', es: 'Detalles del Producto', fr: 'Détails du produit', de: 'Produktdetails', tr: 'Ürün Detayları', zh: '产品详情' },
  'adGen.productName': { en: 'Product Name *', ar: 'اسم المنتج *', es: 'Nombre del Producto *', fr: 'Nom du produit *', de: 'Produktname *', tr: 'Ürün Adı *', zh: '产品名称 *' },
  'adGen.category': { en: 'Category (optional)', ar: 'الفئة (اختياري)', es: 'Categoría (opcional)', fr: 'Catégorie (optionnel)', de: 'Kategorie (optional)', tr: 'Kategori (opsiyonel)', zh: '分类（可选）' },
  'adGen.brand': { en: 'Brand (optional)', ar: 'العلامة التجارية (اختياري)', es: 'Marca (opcional)', fr: 'Marque (optionnel)', de: 'Marke (optional)', tr: 'Marka (opsiyonel)', zh: '品牌（可选）' },
  'adGen.generate': { en: 'Generate Ad Content', ar: 'إنشاء محتوى إعلاني', es: 'Generar Contenido de Anuncio', fr: 'Générer le contenu publicitaire', de: 'Anzeigeninhalt generieren', tr: 'Reklam İçeriği Oluştur', zh: '生成广告内容' },
  'adGen.generating': { en: 'Generating...', ar: 'جاري الإنشاء...', es: 'Generando...', fr: 'Génération...', de: 'Generiere...', tr: 'Oluşturuluyor...', zh: '生成中...' },
  'adGen.keywords': { en: 'Keywords', ar: 'الكلمات المفتاحية', es: 'Palabras Clave', fr: 'Mots-clés', de: 'Schlüsselwörter', tr: 'Anahtar Kelimeler', zh: '关键词' },
  'adGen.headlines': { en: 'Headlines', ar: 'العناوين', es: 'Titulares', fr: 'Titres', de: 'Überschriften', tr: 'Başlıklar', zh: '标题' },
  'adGen.description': { en: 'Description', ar: 'الوصف', es: 'Descripción', fr: 'Description', de: 'Beschreibung', tr: 'Açıklama', zh: '描述' },
  'adGen.targeting': { en: 'Targeting', ar: 'الاستهداف', es: 'Segmentación', fr: 'Ciblage', de: 'Targeting', tr: 'Hedefleme', zh: '定向' },
  'adGen.namePlaceholder': { en: 'e.g. Wireless Noise-Cancelling Headphones', ar: 'مثال: سماعات لاسلكية عازلة للضوضاء', es: 'Ej: Auriculares Inalámbricos con Cancelación de Ruido', fr: 'Ex : Casque sans fil à réduction de bruit', de: 'Z.B. Kabellose Noise-Cancelling-Kopfhörer', tr: 'Ör: Kablosuz Gürültü Önleyici Kulaklık', zh: '例如：无线降噪耳机' },

  'news.title': { en: 'Amazon News', ar: 'أخبار أمازون', es: 'Noticias Amazon', fr: 'Actualités Amazon', de: 'Amazon Nachrichten', tr: 'Amazon Haberleri', zh: '亚马逊新闻' },
  'news.subtitle': { en: 'Latest updates and changes for sellers', ar: 'آخر التحديثات والتغييرات للبائعين', es: 'Últimas actualizaciones y cambios para vendedores', fr: 'Dernières mises à jour et changements pour les vendeurs', de: 'Neueste Updates und Änderungen für Verkäufer', tr: 'Satıcılar için son güncellemeler ve değişiklikler', zh: '卖家最新更新和变化' },
  'news.important': { en: 'Important for Sellers', ar: 'مهم للبائعين', es: 'Importante para Vendedores', fr: 'Important pour les vendeurs', de: 'Wichtig für Verkäufer', tr: 'Satıcılar İçin Önemli', zh: '对卖家很重要' },
  'news.allNews': { en: 'All News', ar: 'كل الأخبار', es: 'Todas las Noticias', fr: 'Toutes les actualités', de: 'Alle Nachrichten', tr: 'Tüm Haberler', zh: '全部新闻' },
  'news.readMore': { en: 'Read more', ar: 'اقرأ المزيد', es: 'Leer más', fr: 'Lire la suite', de: 'Mehr lesen', tr: 'Devamını oku', zh: '阅读更多' },

  'connect.title': { en: 'Amazon Connect', ar: 'ربط أمازون', es: 'Conectar Amazon', fr: 'Connexion Amazon', de: 'Amazon verbinden', tr: 'Amazon Bağlantısı', zh: '亚马逊连接' },
  'connect.subtitle': { en: 'Manage Amazon account connections', ar: 'إدارة اتصالات حسابات أمازون', es: 'Gestionar conexiones de cuentas Amazon', fr: 'Gérer les connexions de comptes Amazon', de: 'Amazon-Kontoverbindungen verwalten', tr: 'Amazon hesap bağlantılarını yönetin', zh: '管理亚马逊账户连接' },
  'connect.connectedStores': { en: 'Connected Stores', ar: 'المتاجر المرتبطة', es: 'Tiendas Conectadas', fr: 'Boutiques connectées', de: 'Verbundene Shops', tr: 'Bağlı Mağazalar', zh: '已连接店铺' },
  'connect.connected': { en: 'Connected', ar: 'مرتبط', es: 'Conectado', fr: 'Connecté', de: 'Verbunden', tr: 'Bağlı', zh: '已连接' },
  'connect.lastSync': { en: 'Last sync', ar: 'آخر مزامنة', es: 'Última sincronización', fr: 'Dernière synchro.', de: 'Letzte Sync.', tr: 'Son senkronizasyon', zh: '最后同步' },
  'connect.autoSync': { en: 'Auto Sync', ar: 'مزامنة تلقائية', es: 'Sincronización Automática', fr: 'Synchro. automatique', de: 'Auto-Sync', tr: 'Otomatik Senkronizasyon', zh: '自动同步' },
  'connect.syncNow': { en: 'Sync Now', ar: 'مزامنة الآن', es: 'Sincronizar Ahora', fr: 'Synchroniser maintenant', de: 'Jetzt synchronisieren', tr: 'Şimdi Senkronize Et', zh: '立即同步' },
  'connect.syncing': { en: 'Syncing...', ar: 'جاري المزامنة...', es: 'Sincronizando...', fr: 'Synchronisation...', de: 'Synchronisiere...', tr: 'Senkronize ediliyor...', zh: '同步中...' },
  'connect.security': { en: 'Security & Permissions', ar: 'الأمان والصلاحيات', es: 'Seguridad y Permisos', fr: 'Sécurité et Permissions', de: 'Sicherheit & Berechtigungen', tr: 'Güvenlik ve İzinler', zh: '安全与权限' },
  'connect.readData': { en: 'Read advertising data', ar: 'قراءة بيانات الإعلانات', es: 'Leer datos publicitarios', fr: 'Lire les données publicitaires', de: 'Werbedaten lesen', tr: 'Reklam verilerini oku', zh: '读取广告数据' },
  'connect.manageCampaigns': { en: 'Manage campaigns', ar: 'إدارة الحملات', es: 'Gestionar campañas', fr: 'Gérer les campagnes', de: 'Kampagnen verwalten', tr: 'Kampanyaları yönet', zh: '管理广告活动' },
  'connect.accessReports': { en: 'Access reports', ar: 'الوصول للتقارير', es: 'Acceder a informes', fr: 'Accéder aux rapports', de: 'Auf Berichte zugreifen', tr: 'Raporlara eriş', zh: '访问报告' },
  'connect.health': { en: 'Health', ar: 'الصحة', es: 'Estado', fr: 'Santé', de: 'Status', tr: 'Sağlık', zh: '健康状态' },
  'connect.syncHistory': { en: 'Sync History', ar: 'سجل المزامنة', es: 'Historial de Sincronización', fr: 'Historique de synchro.', de: 'Synchronisierungsverlauf', tr: 'Senkronizasyon Geçmişi', zh: '同步历史' },

  'audit.title': { en: 'Change Log', ar: 'سجل التغييرات', es: 'Registro de Cambios', fr: 'Journal des modifications', de: 'Änderungsprotokoll', tr: 'Değişiklik Günlüğü', zh: '变更日志' },
  'audit.subtitle': { en: 'All changes made to campaigns and settings', ar: 'جميع التغييرات على الحملات والإعدادات', es: 'Todos los cambios realizados en campañas y configuración', fr: 'Toutes les modifications apportées aux campagnes et aux paramètres', de: 'Alle Änderungen an Kampagnen und Einstellungen', tr: 'Kampanyalarda ve ayarlarda yapılan tüm değişiklikler', zh: '对广告活动和设置的所有更改' },
  'audit.action': { en: 'Action', ar: 'الإجراء', es: 'Acción', fr: 'Action', de: 'Aktion', tr: 'İşlem', zh: '操作' },
  'audit.target': { en: 'Target', ar: 'الهدف', es: 'Objetivo', fr: 'Cible', de: 'Ziel', tr: 'Hedef', zh: '目标' },
  'audit.details': { en: 'Details', ar: 'التفاصيل', es: 'Detalles', fr: 'Détails', de: 'Details', tr: 'Detaylar', zh: '详情' },
  'audit.reason': { en: 'Reason', ar: 'السبب', es: 'Razón', fr: 'Raison', de: 'Grund', tr: 'Sebep', zh: '原因' },
  'audit.source': { en: 'Source', ar: 'المصدر', es: 'Fuente', fr: 'Source', de: 'Quelle', tr: 'Kaynak', zh: '来源' },

  'admin.title': { en: 'Admin Dashboard', ar: 'لوحة الإدارة', es: 'Panel de Administración', fr: "Tableau de bord d'admin", de: 'Admin-Dashboard', tr: 'Yönetim Paneli', zh: '管理后台' },
  'admin.userManagement': { en: 'User Management', ar: 'إدارة المستخدمين', es: 'Gestión de Usuarios', fr: 'Gestion des utilisateurs', de: 'Benutzerverwaltung', tr: 'Kullanıcı Yönetimi', zh: '用户管理' },
  'admin.totalUsers': { en: 'Total Users', ar: 'إجمالي المستخدمين', es: 'Usuarios Totales', fr: 'Utilisateurs totaux', de: 'Benutzer gesamt', tr: 'Toplam Kullanıcı', zh: '总用户数' },
  'admin.activeAccounts': { en: 'Active Accounts', ar: 'الحسابات النشطة', es: 'Cuentas Activas', fr: 'Comptes actifs', de: 'Aktive Konten', tr: 'Aktif Hesaplar', zh: '活跃账户' },
  'admin.totalCampaigns': { en: 'Total Campaigns', ar: 'إجمالي الحملات', es: 'Campañas Totales', fr: 'Campagnes totales', de: 'Kampagnen gesamt', tr: 'Toplam Kampanya', zh: '总广告活动' },
  'admin.actionsLogged': { en: 'Actions Logged', ar: 'الإجراءات المسجلة', es: 'Acciones Registradas', fr: 'Actions enregistrées', de: 'Protokollierte Aktionen', tr: 'Kaydedilen İşlemler', zh: '已记录操作' },
  'admin.search': { en: 'Search email or name...', ar: 'البحث بالبريد أو الاسم...', es: 'Buscar por correo o nombre...', fr: 'Rechercher par e-mail ou nom...', de: 'E-Mail oder Name suchen...', tr: 'E-posta veya isim ara...', zh: '搜索邮箱或姓名...' },
  'admin.allRoles': { en: 'All Roles', ar: 'كل الأدوار', es: 'Todos los Roles', fr: 'Tous les rôles', de: 'Alle Rollen', tr: 'Tüm Roller', zh: '所有角色' },
  'admin.promote': { en: 'Promote', ar: 'ترقية', es: 'Promover', fr: 'Promouvoir', de: 'Befördern', tr: 'Yükselt', zh: '提升' },
  'admin.demote': { en: 'Demote', ar: 'تخفيض', es: 'Degradar', fr: 'Rétrograder', de: 'Herabstufen', tr: 'Düşür', zh: '降级' },
  'admin.deleteUser': { en: 'Delete user', ar: 'حذف المستخدم', es: 'Eliminar usuario', fr: "Supprimer l'utilisateur", de: 'Benutzer löschen', tr: 'Kullanıcıyı sil', zh: '删除用户' },

  'blacklist.title': { en: 'Blacklist', ar: 'القائمة السوداء', es: 'Lista Negra', fr: 'Liste Noire', de: 'Schwarze Liste', tr: 'Kara Liste', zh: '黑名单' },
  'blacklist.subtitle': { en: 'Excluded products from advertising', ar: 'المنتجات المستبعدة من الإعلانات', es: 'Productos excluidos de la publicidad', fr: 'Produits exclus de la publicité', de: 'Von Werbung ausgeschlossene Produkte', tr: 'Reklamdan hariç tutulan ürünler', zh: '从广告中排除的产品' },
  'blacklist.addManually': { en: 'Add Manually', ar: 'إضافة يدوية', es: 'Agregar Manualmente', fr: 'Ajouter manuellement', de: 'Manuell hinzufügen', tr: 'Manuel Ekle', zh: '手动添加' },
  'blacklist.asinLabel': { en: 'ASIN *', ar: 'ASIN *', es: 'ASIN *', fr: 'ASIN *', de: 'ASIN *', tr: 'ASIN *', zh: 'ASIN *' },
  'blacklist.nameLabel': { en: 'Product Name *', ar: 'اسم المنتج *', es: 'Nombre del Producto *', fr: 'Nom du produit *', de: 'Produktname *', tr: 'Ürün Adı *', zh: '产品名称 *' },
  'blacklist.reasonLabel': { en: 'Reason', ar: 'السبب', es: 'Razón', fr: 'Raison', de: 'Grund', tr: 'Sebep', zh: '原因' },
  'blacklist.empty': { en: 'Blacklist is Empty', ar: 'القائمة السوداء فارغة', es: 'La Lista Negra está Vacía', fr: 'La liste noire est vide', de: 'Schwarze Liste ist leer', tr: 'Kara Liste Boş', zh: '黑名单为空' },
  'blacklist.emptyDesc': { en: 'Exclude products from the Products page to add them here', ar: 'استبعد منتجات من صفحة المنتجات لإضافتها هنا', es: 'Excluye productos de la página de Productos para agregarlos aquí', fr: 'Excluez des produits de la page Produits pour les ajouter ici', de: 'Schließen Sie Produkte von der Produktseite aus, um sie hier hinzuzufügen', tr: 'Ürünleri buraya eklemek için Ürünler sayfasından hariç tutun', zh: '从产品页面排除产品以添加到此处' },

  'layout.appName': { en: 'M20 Autopilot', ar: 'M20 Autopilot', es: 'M20 Autopilot', fr: 'M20 Autopilot', de: 'M20 Autopilot', tr: 'M20 Autopilot', zh: 'M20 Autopilot' },
  'layout.appSubtitle': { en: 'Amazon Ad Dashboard', ar: 'لوحة إعلانات أمازون', es: 'Panel de Anuncios Amazon', fr: 'Tableau de bord Amazon Ads', de: 'Amazon Anzeigen-Dashboard', tr: 'Amazon Reklam Paneli', zh: '亚马逊广告仪表盘' },
  'layout.botMode': { en: 'Bot', ar: 'البوت', es: 'Bot', fr: 'Bot', de: 'Bot', tr: 'Bot', zh: '机器人' },
  'layout.aiAssistantTitle': { en: 'M20 AI Assistant', ar: 'المساعد الذكي M20', es: 'Asistente IA M20', fr: 'Assistant IA M20', de: 'M20 KI-Assistent', tr: 'M20 Yapay Zeka Asistanı', zh: 'M20 AI助手' },
  'layout.quickSuggest1': { en: 'Analyze top products', ar: 'تحليل أفضل المنتجات', es: 'Analizar mejores productos', fr: 'Analyser les meilleurs produits', de: 'Top-Produkte analysieren', tr: 'En iyi ürünleri analiz et', zh: '分析热门产品' },
  'layout.quickSuggest2': { en: 'Suggest keywords', ar: 'اقتراح كلمات مفتاحية', es: 'Sugerir palabras clave', fr: 'Suggérer des mots-clés', de: 'Schlüsselwörter vorschlagen', tr: 'Anahtar kelime öner', zh: '建议关键词' },
  'layout.quickSuggest3': { en: 'What is a good ACOS?', ar: 'ما هو ACOS الجيد؟', es: '¿Qué es un buen ACOS?', fr: "Qu'est-ce qu'un bon ACOS ?", de: 'Was ist ein guter ACOS?', tr: 'İyi bir ACOS nedir?', zh: '什么是好的ACOS？' },

  'subs.title': { en: 'Subscription Plans', ar: 'خطط الاشتراك', es: 'Planes de Suscripción', fr: "Plans d'abonnement", de: 'Abonnementpläne', tr: 'Abonelik Planları', zh: '订阅计划' },
  'subs.subtitle': { en: 'Choose the plan that fits your needs', ar: 'اختر الخطة المناسبة لاحتياجاتك', es: 'Elige el plan que se adapte a tus necesidades', fr: 'Choisissez le plan adapté à vos besoins', de: 'Wählen Sie den passenden Plan', tr: 'İhtiyaçlarınıza uygun planı seçin', zh: '选择适合您需求的计划' },
  'subs.free': { en: 'Free', ar: 'مجاني', es: 'Gratis', fr: 'Gratuit', de: 'Kostenlos', tr: 'Ücretsiz', zh: '免费' },
  'subs.pro': { en: 'Pro', ar: 'احترافي', es: 'Pro', fr: 'Pro', de: 'Pro', tr: 'Pro', zh: '专业版' },
  'subs.enterprise': { en: 'Enterprise', ar: 'مؤسسات', es: 'Empresa', fr: 'Entreprise', de: 'Enterprise', tr: 'Kurumsal', zh: '企业版' },
  'subs.current': { en: 'Current Plan', ar: 'الخطة الحالية', es: 'Plan Actual', fr: 'Plan actuel', de: 'Aktueller Plan', tr: 'Mevcut Plan', zh: '当前计划' },
  'subs.upgrade': { en: 'Upgrade', ar: 'ترقية', es: 'Mejorar', fr: 'Améliorer', de: 'Upgraden', tr: 'Yükselt', zh: '升级' },
  'subs.campaigns': { en: 'campaigns', ar: 'حملة', es: 'campañas', fr: 'campagnes', de: 'Kampagnen', tr: 'kampanya', zh: '个广告活动' },
  'subs.keywords': { en: 'keywords', ar: 'كلمة مفتاحية', es: 'palabras clave', fr: 'mots-clés', de: 'Schlüsselwörter', tr: 'anahtar kelime', zh: '个关键词' },
  'subs.products': { en: 'products', ar: 'منتج', es: 'productos', fr: 'produits', de: 'Produkte', tr: 'ürün', zh: '个产品' },
  'subs.aiQueries': { en: 'AI queries/month', ar: 'استعلام ذكاء/شهر', es: 'consultas IA/mes', fr: 'requêtes IA/mois', de: 'KI-Abfragen/Monat', tr: 'Yapay zeka sorgusu/ay', zh: 'AI查询/月' },
  'subs.unlimited': { en: 'Unlimited', ar: 'غير محدود', es: 'Ilimitado', fr: 'Illimité', de: 'Unbegrenzt', tr: 'Sınırsız', zh: '无限' },
  'subs.perMonth': { en: '/month', ar: '/شهر', es: '/mes', fr: '/mois', de: '/Monat', tr: '/ay', zh: '/月' },

  'login.signIn': { en: 'Sign In', ar: 'تسجيل الدخول', es: 'Iniciar Sesión', fr: 'Se connecter', de: 'Anmelden', tr: 'Giriş Yap', zh: '登录' },
  'login.createAccount': { en: 'Create Account', ar: 'إنشاء حساب', es: 'Crear Cuenta', fr: 'Créer un compte', de: 'Konto erstellen', tr: 'Hesap Oluştur', zh: '创建账户' },
  'login.email': { en: 'Email', ar: 'البريد الإلكتروني', es: 'Correo Electrónico', fr: 'E-mail', de: 'E-Mail', tr: 'E-posta', zh: '邮箱' },
  'login.password': { en: 'Password', ar: 'كلمة المرور', es: 'Contraseña', fr: 'Mot de passe', de: 'Passwort', tr: 'Şifre', zh: '密码' },
  'login.forgotPassword': { en: 'Forgot password?', ar: 'نسيت كلمة المرور؟', es: '¿Olvidaste tu contraseña?', fr: 'Mot de passe oublié ?', de: 'Passwort vergessen?', tr: 'Şifrenizi mi unuttunuz?', zh: '忘记密码？' },
  'login.resetPassword': { en: 'Reset Password', ar: 'إعادة تعيين كلمة المرور', es: 'Restablecer Contraseña', fr: 'Réinitialiser le mot de passe', de: 'Passwort zurücksetzen', tr: 'Şifre Sıfırla', zh: '重置密码' },
  'login.resetSent': { en: 'Password reset link sent to your email', ar: 'تم إرسال رابط إعادة التعيين إلى بريدك', es: 'Enlace de restablecimiento enviado a tu correo', fr: 'Lien de réinitialisation envoyé à votre e-mail', de: 'Link zum Zurücksetzen des Passworts wurde gesendet', tr: 'Şifre sıfırlama bağlantısı e-postanıza gönderildi', zh: '密码重置链接已发送到您的邮箱' },
  'login.backToLogin': { en: 'Back to login', ar: 'العودة لتسجيل الدخول', es: 'Volver al inicio de sesión', fr: 'Retour à la connexion', de: 'Zurück zur Anmeldung', tr: 'Girişe geri dön', zh: '返回登录' },
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
