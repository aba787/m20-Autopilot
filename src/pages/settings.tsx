import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Settings as SettingsIcon, User, Bell, Shield, CreditCard, Target, Globe, Moon, Sun, Store } from 'lucide-react';

const tabs = [
  { key: 'profile', label: 'الملف الشخصي', icon: User },
  { key: 'targets', label: 'الأهداف', icon: Target },
  { key: 'notifications', label: 'الإشعارات', icon: Bell },
  { key: 'stores', label: 'المتاجر', icon: Store },
  { key: 'billing', label: 'الفوترة', icon: CreditCard },
  { key: 'security', label: 'الأمان', icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { dark, toggle } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">الإعدادات</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">إدارة إعدادات حسابك والتفضيلات</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="card p-2">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === t.key ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <Icon className="w-4 h-4" /> {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="card p-6 space-y-6">
              <h3 className="font-bold text-lg">الملف الشخصي</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">الاسم الكامل</label>
                  <input type="text" defaultValue="أحمد محمد" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">البريد الإلكتروني</label>
                  <input type="email" defaultValue="ahmed@example.com" className="input-field" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">رقم الهاتف</label>
                  <input type="tel" defaultValue="+966 50 123 4567" className="input-field" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">الشركة</label>
                  <input type="text" defaultValue="شركة التجارة الذكية" className="input-field" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  {dark ? <Moon className="w-5 h-5 text-brand-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
                  <div>
                    <p className="font-medium text-sm">الوضع الداكن</p>
                    <p className="text-xs text-gray-500">{dark ? 'مفعل' : 'معطل'}</p>
                  </div>
                </div>
                <button onClick={toggle}
                  className={`w-12 h-6 rounded-full transition-colors relative ${dark ? 'bg-brand-600' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${dark ? 'right-0.5' : 'right-[26px]'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-brand-500" />
                  <div>
                    <p className="font-medium text-sm">اللغة</p>
                    <p className="text-xs text-gray-500">لغة واجهة المستخدم</p>
                  </div>
                </div>
                <select className="input-field w-auto py-1.5 text-sm">
                  <option>العربية</option>
                  <option>English</option>
                </select>
              </div>

              <button className="btn-primary">حفظ التغييرات</button>
            </div>
          )}

          {activeTab === 'targets' && (
            <div className="card p-6 space-y-6">
              <h3 className="font-bold text-lg">إعدادات الأهداف</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">ACOS المستهدف (%)</label>
                  <input type="number" defaultValue={35} className="input-field w-48" />
                  <p className="text-xs text-gray-500 mt-1">سيتم تنبيهك عندما يتجاوز ACOS هذه القيمة</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">ROAS المستهدف</label>
                  <input type="number" defaultValue={3.0} step={0.1} className="input-field w-48" />
                  <p className="text-xs text-gray-500 mt-1">الحد الأدنى المطلوب من ROAS لاعتبار الحملة ناجحة</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">الميزانية اليومية القصوى (ر.س)</label>
                  <input type="number" defaultValue={5000} className="input-field w-48" />
                </div>
              </div>
              <button className="btn-primary">حفظ الأهداف</button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-6 space-y-4">
              <h3 className="font-bold text-lg">إعدادات الإشعارات</h3>
              {[
                { label: 'تنبيهات الأداء', desc: 'تنبيه عند انخفاض ROAS أو ارتفاع ACOS' },
                { label: 'تنبيهات الميزانية', desc: 'تنبيه عندما تقترب الميزانية من النفاد' },
                { label: 'التوصيات الذكية', desc: 'إشعار عند وجود توصيات جديدة' },
                { label: 'تقارير يومية', desc: 'استلام ملخص يومي بالبريد الإلكتروني' },
                { label: 'تقارير أسبوعية', desc: 'استلام تقرير أسبوعي شامل' },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div>
                    <p className="font-medium text-sm">{n.label}</p>
                    <p className="text-xs text-gray-500">{n.desc}</p>
                  </div>
                  <button className={`w-12 h-6 rounded-full transition-colors relative ${i < 3 ? 'bg-brand-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${i < 3 ? 'right-0.5' : 'right-[26px]'}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'stores' && (
            <div className="card p-6 space-y-4">
              <h3 className="font-bold text-lg">إدارة المتاجر</h3>
              {[
                { name: 'متجر الجمال العربي', market: 'Amazon.sa', active: true },
                { name: 'متجر التقنية', market: 'Amazon.ae', active: false },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <Store className="w-5 h-5 text-brand-500" />
                    <div>
                      <p className="font-medium text-sm">{s.name}</p>
                      <p className="text-xs text-gray-500">{s.market}</p>
                    </div>
                  </div>
                  <span className={s.active ? 'badge-success' : 'badge-info'}>{s.active ? 'نشط' : 'غير نشط'}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="card p-6 space-y-6">
              <h3 className="font-bold text-lg">الفوترة</h3>
              <div className="p-4 rounded-lg bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800">
                <p className="text-sm text-gray-500">خطتك الحالية</p>
                <p className="text-xl font-bold text-brand-600 mt-1">الاحترافي - Pro</p>
                <p className="text-sm text-gray-500 mt-1">499 ر.س / شهر - يتجدد في 1 أبريل 2026</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm font-medium mb-2">طريقة الدفع</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-blue-600 rounded text-white text-[8px] flex items-center justify-center font-bold">VISA</div>
                  <span className="text-sm" dir="ltr">**** **** **** 4532</span>
                </div>
              </div>
              <button className="btn-secondary text-sm">تغيير طريقة الدفع</button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card p-6 space-y-6">
              <h3 className="font-bold text-lg">الأمان</h3>
              <div>
                <label className="block text-sm font-medium mb-1.5">كلمة المرور الحالية</label>
                <input type="password" className="input-field max-w-md" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">كلمة المرور الجديدة</label>
                <input type="password" className="input-field max-w-md" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">تأكيد كلمة المرور</label>
                <input type="password" className="input-field max-w-md" dir="ltr" />
              </div>
              <button className="btn-primary">تحديث كلمة المرور</button>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div>
                    <p className="font-medium text-sm">المصادقة الثنائية</p>
                    <p className="text-xs text-gray-500">حماية إضافية لحسابك</p>
                  </div>
                  <button className="btn-secondary text-sm">تفعيل</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
