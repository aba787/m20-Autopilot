import { useState } from 'react';
import { helpSections } from '@/data/mock';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const CARD = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)' } as const;

export default function Help() {
  const { t } = useI18n();
  const [search, setSearch]             = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [openArticles, setOpenArticles] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => setOpenSections(p => ({ ...p, [title]: !p[title] }));
  const toggleArticle = (k: string) => setOpenArticles(p => ({ ...p, [k]: !p[k] }));

  const filtered = helpSections.map(s => ({
    ...s,
    articles: s.articles.filter(a =>
      !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(s => s.articles.length > 0);

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5" style={{ color: 'var(--accent)' }} /> {t('help.title')}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('help.subtitle')}</p>
      </div>

      <div className="flex items-center gap-2 rounded-lg px-3 py-2.5"
        style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}>
        <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-dim)' }} />
        <input type="text" placeholder={t('help.search')} value={search} onChange={e => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-[#4a5568]" />
      </div>

      {filtered.length === 0 && (
        <div className="p-10 text-center" style={CARD}>
          <HelpCircle className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-dim)' }} />
          <p className="font-bold text-white">{t('help.noResults')}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{t('help.tryDifferent')}</p>
        </div>
      )}

      {filtered.map(section => (
        <div key={section.title} style={{ ...CARD, overflow: 'hidden' }}>
          <button onClick={() => toggleSection(section.title)}
            className="w-full flex items-center justify-between p-4 text-left transition-colors"
            style={{ borderBottom: openSections[section.title] ? '1px solid var(--accent-bg-strong)' : 'none' }}>
            <span className="font-bold text-sm text-white">{section.title}</span>
            {openSections[section.title]
              ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-dim)' }} />
              : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-dim)' }} />}
          </button>
          {openSections[section.title] && (
            <div>
              {section.articles.map(article => {
                const key = section.title + article.title;
                return (
                  <div key={article.title} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <button onClick={() => toggleArticle(key)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors">
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{article.title}</span>
                      {openArticles[key]
                        ? <ChevronUp className="w-3.5 h-3.5" style={{ color: 'var(--text-dim)' }} />
                        : <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--text-dim)' }} />}
                    </button>
                    {openArticles[key] && (
                      <div className="px-4 pb-4">
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{article.content}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      <div className="p-4 text-center" style={CARD}>
        <p className="text-sm font-medium text-white mb-1">{t('help.notFound')}</p>
        <p className="text-xs mb-3" style={{ color: 'var(--text-dim)' }}></p>
        <a href="/support"
          className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg font-semibold text-[#0a0612]"
          style={{ background: 'var(--accent-gradient)' }}>
          {t('help.chatWithAi')}
        </a>
      </div>
    </div>
  );
}
