import { auditLog } from '@/data/mock';
import { History, User, Bot } from 'lucide-react';

export default function Audit() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2"><History className="w-5 h-5" /> سجل التعديلات</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">جميع التغييرات المُجراة على الحملات والكلمات المفتاحية</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="text-right py-2.5 px-4 font-medium text-gray-500">الإجراء</th>
                <th className="text-right py-2.5 px-4 font-medium text-gray-500">الهدف</th>
                <th className="text-right py-2.5 px-4 font-medium text-gray-500">التفاصيل</th>
                <th className="text-right py-2.5 px-4 font-medium text-gray-500">السبب</th>
                <th className="text-right py-2.5 px-4 font-medium text-gray-500">المصدر</th>
                <th className="text-right py-2.5 px-4 font-medium text-gray-500">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map(log => (
                <tr key={log.id} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{log.action}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400 max-w-[150px]">
                    <p className="truncate">{log.target}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400 max-w-[200px]">
                    <p className="truncate">{log.details}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400 max-w-[160px]">
                    <p className="truncate text-xs">{log.reason}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-medium ${log.source === 'النظام الذكي' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                      {log.source === 'النظام الذكي' ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {log.source}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-400">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
