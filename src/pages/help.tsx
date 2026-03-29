import { useState } from 'react';
import { helpSections } from '@/data/mock';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';

const CARD = { background: 'rgba(0,217,255,0.04)', border: '1px solid rgba(0,217,255,0.12)', borderRadius: '0.875rem' } as const;

export default function Help() {
  const [search, setSearch]             = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [openArticles, setOpenArticles] = useState<Record<string, boolean>>({});

  const toggleSection = (t: string) => setOpenSections(p => ({ ...p, [t]: !p[t] }));
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
          <HelpCircle className="w-5 h-5" style={{ color: '#00d9ff' }} /> Help Center
        </h1>
        <p className="text-sm" style={{ color: '#8a94a6' }}>Answers to frequently asked questions</p>
      </div>

      <div className="flex items-center gap-2 rounded-lg px-3 py-2.5"
        style={{ background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.15)' }}>
        <Search className="w-4 h-4 flex-shrink-0" style={{ color: '#4a5568' }} />
        <input type="text" placeholder="Search help articles..." value={search} onChange={e => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-[#4a5568]" />
      </div>

      {filtered.length === 0 && (
        <div className="p-10 text-center" style={CARD}>
          <HelpCircle className="w-10 h-10 mx-auto mb-3" style={{ color: '#4a5568' }} />
          <p className="font-bold text-white">No Results Found</p>
          <p className="text-sm mt-1" style={{ color: '#8a94a6' }}>Try a different search term or contact us directly.</p>
        </div>
      )}

      {filtered.map(section => (
        <div key={section.title} style={{ ...CARD, overflow: 'hidden' }}>
          <button onClick={() => toggleSection(section.title)}
            className="w-full flex items-center justify-between p-4 text-left transition-colors"
            style={{ borderBottom: openSections[section.title] ? '1px solid rgba(0,217,255,0.1)' : 'none' }}>
            <span className="font-bold text-sm text-white">{section.title}</span>
            {openSections[section.title]
              ? <ChevronUp className="w-4 h-4" style={{ color: '#4a5568' }} />
              : <ChevronDown className="w-4 h-4" style={{ color: '#4a5568' }} />}
          </button>
          {openSections[section.title] && (
            <div>
              {section.articles.map(article => {
                const key = section.title + article.title;
                return (
                  <div key={article.title} style={{ borderBottom: '1px solid rgba(0,217,255,0.06)' }}>
                    <button onClick={() => toggleArticle(key)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors">
                      <span className="text-sm" style={{ color: '#a0aec0' }}>{article.title}</span>
                      {openArticles[key]
                        ? <ChevronUp className="w-3.5 h-3.5" style={{ color: '#4a5568' }} />
                        : <ChevronDown className="w-3.5 h-3.5" style={{ color: '#4a5568' }} />}
                    </button>
                    {openArticles[key] && (
                      <div className="px-4 pb-4">
                        <p className="text-sm leading-relaxed" style={{ color: '#8a94a6' }}>{article.content}</p>
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
        <p className="text-sm font-medium text-white mb-1">Didn't find what you're looking for?</p>
        <p className="text-xs mb-3" style={{ color: '#4a5568' }}>Our support team is ready to help</p>
        <a href="/support"
          className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg font-semibold text-[#0a0612]"
          style={{ background: 'linear-gradient(135deg,#00d9ff,#00f0ff)' }}>
          Chat with AI Assistant →
        </a>
      </div>
    </div>
  );
}
