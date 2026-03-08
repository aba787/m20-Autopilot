import { useState } from 'react';
import { Link2, CheckCircle2, Clock, ArrowLeft, Store, RefreshCw, Shield, Key } from 'lucide-react';

const syncHistory = [
  { date: '2026-03-08 14:30', status: 'success', items: 'تم مزامنة 18 حملة و 45 كلمة مفتاحية' },
  { date: '2026-03-08 08:00', status: 'success', items: 'تم مزامنة 18 حملة و 42 كلمة مفتاحية' },
  { date: '2026-03-07 20:00', status: 'success', items: 'تم مزامنة 17 حملة و 40 كلمة مفتاحية' },
  { date: '2026-03-07 14:00', status: 'error', items: 'فشلت المزامنة - خطأ في الاتصال' },
  { date: '2026-03-07 08:00', status: 'success', items: 'تم مزامنة 17 حملة و 38 كلمة مفتاحية' },
];

const steps = [
  { step: 1, title: 'إنشاء حساب على أدفلو', description: 'قم بتسجيل حساب جديد أو تسجيل الدخول', done: true },
  { step: 2, title: 'ربط حساب أمازون', description: 'اضغط على زر "ربط الحساب" وسجل الدخول لحسابك على أمازون', done: true },
  { step: 3, title: 'منح الصلاحيات', description: 'وافق على صلاحيات الوصول لبيانات الإعلانات', done: true },
  { step: 4, title: 'المزامنة الأولى', description: 'انتظر حتى يتم جلب بيانات حملاتك', done: true },
  { step: 5, title: 'بدء التحسين', description: 'ابدأ بمراجعة التوصيات وتحسين حملاتك', done: false },
];

export default function Integration() {
  const [activeStore, setActiveStore] = useState('Amazon.sa');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ربط أمازون</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">إدارة اتصال حسابك بأمازون</p>
      </div>

      <div className="card p-6 border-2 border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Link2 className="w-7 h-7 text-emerald-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold">حالة الاتصال</h2>
              <span className="badge-success flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> متصل</span>
            </div>
            <p className="text-sm text-gray-500">حسابك مرتبط بأمازون بنجاح</p>
          </div>
          <button className="btn-danger text-sm">فصل الحساب</button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> آخر مزامنة</p>
            <p className="font-bold text-sm mt-1">2026-03-08 14:30</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-xs text-gray-500 flex items-center gap-1"><Store className="w-3 h-3" /> المتجر النشط</p>
            <select value={activeStore} onChange={e => setActiveStore(e.target.value)}
              className="font-bold text-sm mt-1 bg-transparent border-none outline-none w-full">
              <option value="Amazon.sa">Amazon.sa</option>
              <option value="Amazon.ae">Amazon.ae</option>
            </select>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-xs text-gray-500 flex items-center gap-1"><Shield className="w-3 h-3" /> الصلاحيات</p>
            <p className="font-bold text-sm mt-1">قراءة + إدارة</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Key className="w-4 h-4 text-brand-600" /> خطوات الربط</h3>
        <div className="space-y-4">
          {steps.map(s => (
            <div key={s.step} className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                {s.done ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <span className="text-sm font-bold text-gray-400">{s.step}</span>}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${s.done ? 'text-emerald-600' : ''}`}>{s.title}</p>
                <p className="text-sm text-gray-500">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2"><RefreshCw className="w-4 h-4 text-brand-600" /> سجل المزامنة</h3>
          <button className="btn-primary text-sm flex items-center gap-2"><RefreshCw className="w-4 h-4" /> مزامنة الآن</button>
        </div>
        <div className="space-y-3">
          {syncHistory.map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className={`w-2 h-2 rounded-full ${s.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <div className="flex-1">
                <p className="text-sm">{s.items}</p>
              </div>
              <span className="text-xs text-gray-500">{s.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
