import { auditLog } from '@/data/mock';
import { History, User, Bot, Settings } from 'lucide-react';

export default function Audit() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">سجل التعديلات</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">متابعة جميع التعديلات والتحسينات على حملاتك</p>
      </div>

      <div className="card p-4">
        <div className="space-y-0">
          {auditLog.map((entry, i) => (
            <div key={entry.id} className="flex gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-lg transition-colors">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${entry.source === 'النظام الذكي' ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-brand-100 dark:bg-brand-900/30'}`}>
                  {entry.source === 'النظام الذكي' ? <Bot className="w-5 h-5 text-purple-600" /> : <User className="w-5 h-5 text-brand-600" />}
                </div>
                {i < auditLog.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-2" />}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h4 className="font-bold text-sm">{entry.action}</h4>
                    <p className="text-sm text-brand-600 dark:text-brand-400">{entry.target}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500">{entry.date}</p>
                    <span className={`text-xs ${entry.source === 'النظام الذكي' ? 'badge-info' : 'badge-success'} mt-1 inline-block`}>
                      {entry.source}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{entry.details}</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Settings className="w-3 h-3" /> السبب: {entry.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
