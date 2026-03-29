import { auditLog } from '@/data/mock';
import { History, User, Bot } from 'lucide-react';

const CARD = { background: 'rgba(0,217,255,0.04)', border: '1px solid rgba(0,217,255,0.12)', borderRadius: '0.875rem' } as const;

export default function Audit() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5" style={{ color: '#00d9ff' }} /> Change Log
        </h1>
        <p className="text-sm" style={{ color: '#8a94a6' }}>All changes made to campaigns and keywords</p>
      </div>

      <div style={{ ...CARD, overflow: 'hidden' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: 'rgba(0,217,255,0.04)', borderBottom: '1px solid rgba(0,217,255,0.1)' }}>
              <tr>
                {['Action', 'Target', 'Details', 'Reason', 'Source', 'Date'].map(h => (
                  <th key={h} className="text-left py-2.5 px-4 font-medium" style={{ color: '#8a94a6' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditLog.map(log => (
                <tr key={log.id}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid rgba(0,217,255,0.06)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(0,217,255,0.03)'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}>
                  <td className="py-3 px-4">
                    <span className="font-medium text-white">{log.action}</span>
                  </td>
                  <td className="py-3 px-4 max-w-[150px]">
                    <p className="truncate" style={{ color: '#a0aec0' }}>{log.target}</p>
                  </td>
                  <td className="py-3 px-4 max-w-[200px]">
                    <p className="truncate" style={{ color: '#a0aec0' }}>{log.details}</p>
                  </td>
                  <td className="py-3 px-4 max-w-[160px]">
                    <p className="truncate text-xs" style={{ color: '#4a5568' }}>{log.reason}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-medium"
                      style={log.source === 'AI System'
                        ? { background: 'rgba(0,217,255,0.1)', color: '#00d9ff', border: '1px solid rgba(0,217,255,0.2)' }
                        : { background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>
                      {log.source === 'AI System' ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {log.source}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs" style={{ color: '#4a5568' }}>{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
