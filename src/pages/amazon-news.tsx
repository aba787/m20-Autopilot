import { amazonNews } from '@/data/mock';
import { Newspaper, ExternalLink, Star } from 'lucide-react';

const categoryColors: Record<string, string> = {
  'بائعون': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'خوارزمية': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'رسوم': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'موسمي': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'تحسين': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export default function AmazonNews() {
  const importantNews = amazonNews.filter(n => n.important);
  const allNews = amazonNews;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2"><Newspaper className="w-5 h-5 text-blue-600" /> أخبار أمازون</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">آخر المستجدات والتحديثات المهمة للبائعين</p>
      </div>

      {/* Important */}
      {importantNews.length > 0 && (
        <div>
          <h2 className="font-bold text-sm mb-3 flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500" /> مهم للبائعين</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {importantNews.map(n => (
              <div key={n.id} className="card p-4 border-l-4 border-amber-400 dark:border-amber-600 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${categoryColors[n.category] || 'bg-gray-100 text-gray-600'}`}>{n.category}</span>
                  <span className="text-xs text-gray-400">{n.date}</span>
                  <span className="mr-auto text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded">⭐ مهم</span>
                </div>
                <h3 className="font-bold text-sm mb-2 leading-snug">{n.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{n.summary}</p>
                <button className="mt-3 flex items-center gap-1 text-xs text-blue-600 hover:underline">
                  اقرأ المزيد <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All News */}
      <div>
        <h2 className="font-bold text-sm mb-3">جميع الأخبار</h2>
        <div className="space-y-2">
          {allNews.map(n => (
            <div key={n.id} className="card p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Newspaper className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${categoryColors[n.category] || 'bg-gray-100 text-gray-600'}`}>{n.category}</span>
                    <span className="text-xs text-gray-400">{n.date}</span>
                    {n.important && <span className="text-xs text-amber-600">⭐</span>}
                  </div>
                  <h3 className="font-bold text-sm leading-snug mb-1">{n.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{n.summary}</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 flex-shrink-0 mt-1">
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
