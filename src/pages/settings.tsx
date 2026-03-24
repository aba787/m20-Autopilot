import { useState } from 'react';
import { Settings as SettingsIcon, Save, Link2, Globe, Bell, Shield } from 'lucide-react';

export default function Settings() {
  const [amazonLink, setAmazonLink] = useState('https://www.amazon.sa/s?me=XXXXXXXX');
  const [currency, setCurrency] = useState('SAR');
  const [timezone, setTimezone] = useState('Asia/Riyadh');
  const [targetAcos, setTargetAcos] = useState('25');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <div onClick={onChange}
      className={`w-11 h-6 rounded-full cursor-pointer transition-colors flex-shrink-0 ${value ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
      <div className={`w-4 h-4 bg-white rounded-full m-1 transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  );

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2"><SettingsIcon className="w-5 h-5" /> الإعدادات</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">إعدادات الحساب والتفضيلات</p>
      </div>

      <div className="card p-5">
        <h2 className="font-bold text-sm mb-4 flex items-center gap-2"><Link2 className="w-4 h-4 text-blue-600" /> ربط أمازون</h2>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">رابط المتجر على أمازون</label>
          <input type="url" value={amazonLink} onChange={e => setAmazonLink(e.target.value)}
            className="input-field font-mono text-sm" dir="ltr" placeholder="https://www.amazon.sa/..." />
          <p className="text-xs text-gray-500 mt-1">ستستخدم المنصة هذا الرابط للتحليل واقتراح التحسينات.</p>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-bold text-sm mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-green-600" /> العملة والمنطقة</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">العملة</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className="input-field">
              <option value="SAR">ريال سعودي (SAR)</option>
              <option value="USD">دولار أمريكي (USD)</option>
              <option value="AED">درهم إماراتي (AED)</option>
              <option value="EGP">جنيه مصري (EGP)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">المنطقة الزمنية</label>
            <select value={timezone} onChange={e => setTimezone(e.target.value)} className="input-field">
              <option value="Asia/Riyadh">الرياض (GMT+3)</option>
              <option value="Asia/Dubai">دبي (GMT+4)</option>
              <option value="Africa/Cairo">القاهرة (GMT+2)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-bold text-sm mb-4 flex items-center gap-2"><SettingsIcon className="w-4 h-4 text-amber-600" /> أهداف الأداء</h2>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">ACOS المستهدف (%)</label>
          <div className="flex items-center gap-3">
            <input type="number" value={targetAcos} onChange={e => setTargetAcos(e.target.value)}
              className="input-field w-28" min="5" max="100" dir="ltr" />
            <p className="text-xs text-gray-500">سيرسل النظام تنبيهاً عند تجاوز هذا الهدف.</p>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-bold text-sm mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-red-500" /> الإشعارات</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">تنبيهات البريد الإلكتروني</p>
              <p className="text-xs text-gray-500">تلقي تنبيهات فورية عند تراجع الأداء</p>
            </div>
            <Toggle value={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">التحسين التلقائي</p>
              <p className="text-xs text-gray-500">السماح للذكاء الاصطناعي بتطبيق التوصيات تلقائياً</p>
            </div>
            <Toggle value={autoOptimize} onChange={() => setAutoOptimize(!autoOptimize)} />
          </div>
        </div>
      </div>

      <div className="card p-5 border border-red-200 dark:border-red-800">
        <h2 className="font-bold text-sm mb-4 flex items-center gap-2 text-red-600"><Shield className="w-4 h-4" /> منطقة الخطر</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">حذف جميع البيانات</p>
            <p className="text-xs text-gray-500">حذف نهائي لجميع بيانات الحساب — لا يمكن التراجع</p>
          </div>
          <button className="text-sm text-red-600 border border-red-200 dark:border-red-800 px-3 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20">حذف الحساب</button>
        </div>
      </div>

      <button onClick={save}
        className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-lg font-medium hover:opacity-90 text-sm">
        {saved ? '✓ تم الحفظ' : <><Save className="w-4 h-4" /> حفظ الإعدادات</>}
      </button>
    </div>
  );
}
