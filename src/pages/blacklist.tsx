import { useState } from 'react';
import { blacklist as initialBlacklist } from '@/data/mock';
import { ShieldOff, Trash2, RotateCcw, Plus } from 'lucide-react';

const CARD = { background: 'rgba(0,217,255,0.04)', border: '1px solid rgba(0,217,255,0.12)', borderRadius: '0.875rem' } as const;

export default function Blacklist() {
  const [items, setItems]       = useState(initialBlacklist);
  const [newAsin, setNewAsin]   = useState('');
  const [newName, setNewName]   = useState('');
  const [newReason, setNewReason] = useState('');

  const remove = (id: number) => setItems(prev => prev.filter(i => i.id !== id));

  const add = () => {
    if (!newAsin || !newName) return;
    setItems(prev => [...prev, { id: Date.now(), name: newName, asin: newAsin, reason: newReason || 'Manual', date: new Date().toISOString().split('T')[0] }]);
    setNewAsin(''); setNewName(''); setNewReason('');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldOff className="w-5 h-5" style={{ color: '#ef4444' }} /> Blacklist
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#8a94a6' }}>Excluded products — AI automatically ignores these</p>
        </div>
        <span className="text-sm px-3 py-1 rounded-full font-medium"
          style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}>
          {items.length} products
        </span>
      </div>

      {/* Add manually */}
      <div className="p-4" style={CARD}>
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-white">
          <Plus className="w-4 h-4" style={{ color: '#00d9ff' }} /> Add Manually
        </h3>
        <div className="flex flex-wrap gap-2">
          <input type="text" placeholder="ASIN *" value={newAsin} onChange={e => setNewAsin(e.target.value)}
            className="rounded-lg px-3 py-1.5 text-sm outline-none w-40 font-mono text-white"
            style={{ background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.15)' }} />
          <input type="text" placeholder="Product Name *" value={newName} onChange={e => setNewName(e.target.value)}
            className="rounded-lg px-3 py-1.5 text-sm outline-none flex-1 min-w-40 text-white"
            style={{ background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.15)' }} />
          <input type="text" placeholder="Reason" value={newReason} onChange={e => setNewReason(e.target.value)}
            className="rounded-lg px-3 py-1.5 text-sm outline-none flex-1 min-w-40 text-white"
            style={{ background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.15)' }} />
          <button onClick={add}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold text-[#0a0612]"
            style={{ background: 'linear-gradient(135deg,#00d9ff,#00f0ff)' }}>
            Add
          </button>
        </div>
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="p-12 text-center" style={CARD}>
          <ShieldOff className="w-12 h-12 mx-auto mb-3" style={{ color: '#4a5568' }} />
          <h3 className="font-bold mb-1 text-white">Blacklist is Empty</h3>
          <p className="text-sm" style={{ color: '#8a94a6' }}>Exclude products from the Products page or add them manually above.</p>
        </div>
      ) : (
        <div style={{ ...CARD, overflow: 'hidden' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: 'rgba(0,217,255,0.04)', borderBottom: '1px solid rgba(0,217,255,0.1)' }}>
                <tr>
                  {['Product', 'ASIN', 'Reason', 'Date Added', 'Action'].map(h => (
                    <th key={h} className="text-left py-2.5 px-4 font-medium" style={{ color: '#8a94a6' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(0,217,255,0.06)' }}>
                    <td className="py-3 px-4 font-medium text-white">{item.name}</td>
                    <td className="py-3 px-4 font-mono text-xs" style={{ color: '#4a5568' }}>{item.asin}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-0.5 rounded"
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                        {item.reason}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs" style={{ color: '#4a5568' }}>{item.date}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => remove(item.id)} title="Restore"
                          className="p-1.5 rounded transition-colors" style={{ color: '#00d9ff' }}>
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => remove(item.id)} title="Delete permanently"
                          className="p-1.5 rounded transition-colors" style={{ color: '#ef4444' }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
