import { kpiData, salesChartData, bestCampaigns, worstCampaigns, alerts, auditLog } from '@/data/mock';
import {
  DollarSign, TrendingUp, Target, Percent, MousePointerClick, Megaphone,
  ArrowUp, ArrowDown, Zap, Activity, Star, AlertTriangle, CheckCircle2, BarChart3, Settings
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Link from 'next/link';

const kpis = [
  { label: 'إجمالي الإنفاق', value: `${kpiData.totalSpend.toLocaleString()} ر.س`, icon: DollarSign, color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400', change: '+12%', up: true },
  { label: 'إجمالي المبيعات', value: `${kpiData.totalSales.toLocaleString()} ر.س`, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400', change: '+28%', up: true },
  { label: 'ROAS', value: kpiData.roas.toFixed(2), icon: Target, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400', change: '+0.3', up: true },
  { label: 'ACOS', value: `${kpiData.acos}%`, icon: Percent, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400', change: '-2.1%', up: false },
  { label: 'CTR', value: `${kpiData.ctr}%`, icon: MousePointerClick, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400', change: '+0.4%', up: true },
  { label: 'حملات نشطة', value: kpiData.activeCampaigns, icon: Megaphone, color: 'text-brand-600 bg-brand-100 dark:bg-brand-900/30 dark:text-brand-400', change: '+2', up: true },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">مرحباً أحمد، إليك ملخص أداء حملاتك</p>
        </div>
        <div className="flex gap-2">
          <Link href="/recommendations" className="btn-primary text-sm flex items-center gap-2">
            <Zap className="w-4 h-4" /> التوصيات الذكية
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="w-[18px] h-[18px]" />
              </div>
              <span className={`text-xs font-medium flex items-center gap-0.5 ${kpi.up ? 'text-emerald-600' : 'text-red-600'}`}>
                {kpi.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>
            <p className="text-lg font-bold">{kpi.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-4 border-2 border-brand-200 dark:border-brand-800">
        <div className="flex items-center gap-3 mb-1">
          <Activity className="w-5 h-5 text-brand-600" />
          <h3 className="font-bold">صحة الحساب</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-200 dark:text-gray-700" />
              <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="87, 100" className="text-brand-600" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">87%</span>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">حسابك في حالة جيدة. هناك 3 توصيات لتحسين الأداء.</p>
            <div className="flex gap-4 mt-2">
              <span className="badge-success">ROAS جيد</span>
              <span className="badge-warning">ACOS يحتاج تحسين</span>
              <span className="badge-success">CTR ممتاز</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-brand-600" /> المبيعات والإنفاق</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={salesChartData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3374ff" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3374ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => `${v.toLocaleString()} ر.س`} />
              <Area type="monotone" dataKey="sales" stroke="#3374ff" fill="url(#salesGrad)" strokeWidth={2} name="المبيعات" />
              <Area type="monotone" dataKey="spend" stroke="#f59e0b" fill="url(#spendGrad)" strokeWidth={2} name="الإنفاق" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-brand-600" /> ROAS الشهري</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salesChartData.map(d => ({ ...d, roas: +(d.sales / d.spend).toFixed(2) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="roas" fill="#3374ff" radius={[4, 4, 0, 0]} name="ROAS" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Star className="w-4 h-4 text-emerald-600" /> أفضل الحملات</h3>
          <div className="space-y-3">
            {bestCampaigns.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
                <div>
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-xs text-gray-500 mt-1">مبيعات: {c.sales.toLocaleString()} ر.س</p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-emerald-600">ROAS {c.roas}</p>
                  <p className="text-xs text-gray-500">ACOS {c.acos}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-600" /> أضعف الحملات</h3>
          <div className="space-y-3">
            {worstCampaigns.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30">
                <div>
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-xs text-gray-500 mt-1">مبيعات: {c.sales.toLocaleString()} ر.س</p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-red-600">ROAS {c.roas}</p>
                  <p className="text-xs text-gray-500">ACOS {c.acos}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-600" /> أحدث التنبيهات</h3>
            <Link href="/alerts" className="text-xs text-brand-600 hover:underline">عرض الكل</Link>
          </div>
          <div className="space-y-2">
            {alerts.slice(0, 4).map(a => (
              <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.severity === 'critical' ? 'bg-red-500' : a.severity === 'warning' ? 'bg-amber-500' : a.severity === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-gray-500 truncate">{a.message}</p>
                </div>
                <span className="text-[10px] text-gray-400 flex-shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-600" /> آخر التحسينات</h3>
            <Link href="/audit" className="text-xs text-brand-600 hover:underline">عرض الكل</Link>
          </div>
          <div className="space-y-2">
            {auditLog.slice(0, 4).map(a => (
              <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                  <Settings className="w-4 h-4 text-brand-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{a.action}</p>
                  <p className="text-xs text-gray-500 truncate">{a.target}</p>
                </div>
                <span className="text-[10px] text-gray-400 flex-shrink-0">{a.date.split(' ')[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-bold mb-4">إجراءات سريعة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/campaigns" className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/50 hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors text-center">
            <Megaphone className="w-6 h-6 text-brand-600 mx-auto mb-2" />
            <p className="text-sm font-medium">إدارة الحملات</p>
          </Link>
          <Link href="/recommendations" className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors text-center">
            <Zap className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-sm font-medium">تطبيق التوصيات</p>
          </Link>
          <Link href="/reports" className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors text-center">
            <BarChart3 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-medium">عرض التقارير</p>
          </Link>
          <Link href="/settings" className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-center">
            <Settings className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium">الإعدادات</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
