import { useState } from 'react';
import { helpSections } from '@/data/mock';
import { HelpCircle, ChevronDown, ChevronUp, Search, BookOpen } from 'lucide-react';

export default function Help() {
  const [openSection, setOpenSection] = useState<number | null>(0);
  const [openArticle, setOpenArticle] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filteredSections = helpSections.map(s => ({
    ...s,
    articles: s.articles.filter(a => a.title.includes(search) || a.content.includes(search)),
  })).filter(s => s.articles.length > 0 || !search);

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <BookOpen className="w-12 h-12 text-brand-600 mx-auto mb-3" />
        <h1 className="text-2xl font-bold">مركز المساعدة</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">ابحث عن إجابات لأسئلتك حول منصة أدفلو</p>
        <div className="mt-4 flex items-center gap-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3 shadow-sm">
          <Search className="w-5 h-5 text-gray-400" />
          <input type="text" placeholder="ابحث في مركز المساعدة..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {filteredSections.map((section, si) => (
          <div key={si} className="card overflow-hidden">
            <button onClick={() => setOpenSection(openSection === si ? null : si)}
              className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <h2 className="font-bold flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-600" /> {section.title}
              </h2>
              {openSection === si ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {openSection === si && (
              <div className="border-t border-gray-200 dark:border-gray-800">
                {section.articles.map((article, ai) => {
                  const key = `${si}-${ai}`;
                  return (
                    <div key={ai} className="border-b border-gray-100 dark:border-gray-800/50 last:border-0">
                      <button onClick={() => setOpenArticle(openArticle === key ? null : key)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <span className="text-sm font-medium">{article.title}</span>
                        {openArticle === key ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </button>
                      {openArticle === key && (
                        <div className="px-4 pb-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                            {article.content}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
