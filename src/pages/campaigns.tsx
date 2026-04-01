import { useState } from 'react';
import { campaigns } from '@/data/mock';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

type SortKey = 'spend' | 'sales' | 'roas' | 'acos' | 'ctr';

const CARD = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)' } as const;
const CUR = 'SAR';

export default function Campaigns() {
  const { t } = useI18n();
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter]   = useState('all');
  const [sortKey, setSortKey]         = useState<SortKey>('sales');
  const [sortDir, setSortDir]         = useState<'asc' | 'desc'>('desc');

  const types = ['all', ...Array.from(new Set(campaigns.map(c => c.type)))];

  const filtered = campaigns
    .filter(c => {
      const ms  = c.name.toLowerCase().includes(search.toLowerCase());
      const mst = statusFilter === 'all' || c.status === statusFilter;
      const mt  = typeFilter === 'all' || c.type === typeFilter;
      return ms && mst && mt;
    })
    .sort((a, b) => sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(k); setSortDir('desc'); }
  };

  const Th = ({ label, k }: { label: string; k: SortKey }) => (
    <th className="text-left py-2.5 px-3 font-medium cursor-pointer whitespace-nowrap"
      style={{ color: 'var(--text-muted)' }}
      onClick={() => toggleSort(k)}>
      <div className="flex items-center gap-1">
        {label}
        {sortKey === k
          ? (sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)
          : <ChevronDown className="w-3 h-3 opacity-30" />}
      </div>
    </th>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{t('campaigns.title')}</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{filtered.length} {t('campaigns.count')}</p>
        </div>
      </div>

      <div className="p-3 flex flex-wrap gap-2" style={CARD}>
        <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 flex-1 min-w-48"
          style={{ background: 'var(--input-bg)', border: '1px solid var(--border-primary)' }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-dim)' }} />
          <input type="text" placeholder={t('campaigns.search')} value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-[#4a5568]" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="rounded-lg px-3 py-1.5 text-sm outline-none text-white"
          style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}>
          <option value="all">{t('campaigns.allStatus')}</option>
          <option value="active">{t('common.active')}</option>
          <option value="paused">{t('common.paused')}</option>
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="rounded-lg px-3 py-1.5 text-sm outline-none text-white"
          style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}>
          {types.map(tp => <option key={tp} value={tp}>{tp === 'all' ? t('campaigns.allTypes') : tp}</option>)}
        </select>
      </div>

      <div style={{ ...CARD, overflow: 'hidden' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border-primary)' }}>
              <tr>
                <th className="text-left py-2.5 px-3 font-medium" style={{ color: 'var(--text-muted)' }}>{t('campaigns.campaign')}</th>
                <th className="text-left py-2.5 px-3 font-medium" style={{ color: 'var(--text-muted)' }}>{t('common.status')}</th>
                <th className="text-left py-2.5 px-3 font-medium" style={{ color: 'var(--text-muted)' }}>{t('campaigns.budget')}</th>
                <Th label={t('dash.spend')}  k="spend" />
                <Th label={t('dash.sales')}  k="sales" />
                <Th label={t('campaigns.roas')}   k="roas"  />
                <Th label={t('dash.acos')}   k="acos"  />
                <Th label={t('campaigns.ctr')}    k="ctr"   />
                <th className="text-left py-2.5 px-3 font-medium" style={{ color: 'var(--text-muted)' }}>{t('dash.clicks')}</th>
                <th className="text-left py-2.5 px-3 font-medium" style={{ color: 'var(--text-muted)' }}>{t('dash.orders')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--hover-bg)'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}>
                  <td className="py-3 px-3">
                    <p className="font-medium text-white">{c.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{c.type}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                      style={c.status === 'active'
                        ? { background: 'rgba(16,185,129,0.12)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.25)' }
                        : { background: 'rgba(100,116,139,0.12)', color: '#64748b', border: '1px solid rgba(100,116,139,0.25)' }}>
                      {c.status === 'active' ? `● ${t('common.active')}` : `○ ${t('common.paused')}`}
                    </span>
                  </td>
                  <td className="py-3 px-3" style={{ color: 'var(--text-muted)' }}>{c.budget.toLocaleString()} {CUR}</td>
                  <td className="py-3 px-3 text-white">{c.spend.toLocaleString()} {CUR}</td>
                  <td className="py-3 px-3 font-medium" style={{ color: 'var(--success)' }}>{c.sales.toLocaleString()} {CUR}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold" style={{ color: c.roas >= 4 ? '#10b981' : c.roas >= 2 ? '#f59e0b' : '#ef4444' }}>{c.roas}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span style={{ color: c.acos <= 25 ? '#10b981' : c.acos <= 40 ? '#f59e0b' : '#ef4444' }}>{c.acos}%</span>
                  </td>
                  <td className="py-3 px-3 text-white">{c.ctr}%</td>
                  <td className="py-3 px-3 text-white">{c.clicks.toLocaleString()}</td>
                  <td className="py-3 px-3 text-white">{c.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--text-dim)' }}>
            <p>{t('campaigns.noMatch')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
