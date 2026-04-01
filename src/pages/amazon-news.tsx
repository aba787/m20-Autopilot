import { amazonNews } from '@/data/mock';
import { Newspaper, ExternalLink, Star } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const CARD = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)' } as const;

const categoryColors: Record<string, React.CSSProperties> = {
  'Sellers':   { background: 'var(--accent-bg-strong)', color: 'var(--accent)',  border: '1px solid var(--accent-border)' },
  'Algorithm': { background: 'rgba(139,92,246,0.12)',color: '#8b5cf6',  border: '1px solid rgba(139,92,246,0.25)' },
  'Fees':      { background: 'rgba(239,68,68,0.12)', color: 'var(--error)',  border: '1px solid rgba(239,68,68,0.25)' },
  'Seasonal':  { background: 'rgba(245,158,11,0.12)',color: 'var(--warning)',  border: '1px solid rgba(245,158,11,0.25)' },
  'Optimize':  { background: 'rgba(16,185,129,0.12)',color: 'var(--success)',  border: '1px solid rgba(16,185,129,0.25)' },
};

const defaultCategory: React.CSSProperties = { background: 'rgba(100,116,139,0.12)', color: '#64748b', border: '1px solid rgba(100,116,139,0.25)' };

export default function AmazonNews() {
  const { t } = useI18n();
  const importantNews = amazonNews.filter(n => n.important);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Newspaper className="w-5 h-5" style={{ color: 'var(--accent)' }} /> {t('news.title')}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('news.subtitle')}</p>
      </div>

      {importantNews.length > 0 && (
        <div>
          <h2 className="font-bold text-sm mb-3 flex items-center gap-1.5" style={{ color: 'var(--warning)' }}>
            <Star className="w-4 h-4" /> {t('news.important')}
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {importantNews.map(n => (
              <div key={n.id} className="p-4 hover:shadow-md transition-all rounded-xl"
                style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.25)', borderLeft: '4px solid #f59e0b' }}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded font-medium"
                    style={categoryColors[n.category] ?? defaultCategory}>{n.category}</span>
                  <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{n.date}</span>
                </div>
                <h3 className="font-bold text-sm mb-2 leading-snug text-white">{n.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{n.summary}</p>
                <button className="mt-3 flex items-center gap-1 text-xs transition-colors" style={{ color: 'var(--accent)' }}>
                  {t('news.readMore')} <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-bold text-sm mb-3 text-white">{t('news.allNews')}</h2>
        <div className="space-y-2">
          {amazonNews.map(n => (
            <div key={n.id} className="p-4 transition-all rounded-xl"
              style={CARD}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--accent-bg)', border: '1px solid var(--input-border)' }}>
                  <Newspaper className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded font-medium"
                      style={categoryColors[n.category] ?? defaultCategory}>{n.category}</span>
                    <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{n.date}</span>
                  </div>
                  <h3 className="font-bold text-sm leading-snug mb-1 text-white">{n.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{n.summary}</p>
                </div>
                <button className="flex-shrink-0 mt-1 transition-colors" style={{ color: 'var(--accent)' }}>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
