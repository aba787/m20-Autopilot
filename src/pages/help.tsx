import { useState } from 'react';
import { helpSections } from '@/data/mock';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';

export default function Help() {
  const [search, setSearch] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [openArticles, setOpenArticles] = useState<Record<string, boolean>>({});

  const toggleSection = (t: string) => setOpenSections(p => ({ ...p, [t]: !p[t] }));
  const toggleArticle = (k: string) => setOpenArticles(p => ({ ...p, [k]: !p[k] }));

  const filtered = helpSections.map(s => ({
    ...s,
    articles: s.articles.filter(a =>
      !search || a.title.includes(search) || a.content.includes(search)
    ),
  })).filter(s => s.articles.length > 0);

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2"><HelpCircle className="w-5 h-5 text-brand-600" /> مركز المساعدة</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">إجابات على الأسئلة الأكثر شيوعاً</p>
      </div>

      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2.5">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input type="text" placeholder="ابحث في المساعدة..." value={search} onChange={e => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-sm w-full" />
      </div>

      {filtered.length === 0 && (
        <div className="card p-10 text-center">
          <HelpCircle className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="font-bold">لا توجد نتائج</p>
          <p className="text-sm text-gray-500 mt-1">جرّب كلمة بحث أخرى أو تواصل معنا مباشرة.</p>
        </div>
      )}

      {filtered.map(section => (
        <div key={section.title} className="card overflow-hidden">
          <button onClick={() => toggleSection(section.title)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-right">
            <span className="font-bold text-sm">{section.title}</span>
            {openSections[section.title] ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {openSections[section.title] && (
            <div className="border-t border-gray-100 dark:border-gray-800">
              {section.articles.map(article => {
                const key = section.title + article.title;
                return (
                  <div key={article.title} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <button onClick={() => toggleArticle(key)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-right">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{article.title}</span>
                      {openArticles[key] ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                    </button>
                    {openArticles[key] && (
                      <div className="px-4 pb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{article.content}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      <div className="card p-4 text-center">
        <p className="text-sm font-medium mb-1">لم تجد إجابتك؟</p>
        <p className="text-xs text-gray-500 mb-3">فريق الدعم جاهز لمساعدتك</p>
        <a href="/support" className="inline-flex items-center gap-1.5 text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg font-medium hover:opacity-90">
          تحدث مع المساعد الذكي →
        </a>
      </div>
    </div>
  );
}
