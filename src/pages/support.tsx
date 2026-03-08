import { useState } from 'react';
import { chatMessages } from '@/data/mock';
import { Send, Bot, User, HelpCircle, ExternalLink, Headphones } from 'lucide-react';

const quickQuestions = [
  'ما هو ACOS وكيف أحسنه؟',
  'لماذا انخفض ROAS حملتي؟',
  'كيف أزيد المبيعات؟',
  'اشرح لي التوصيات الذكية',
  'كيف أربط حسابي بأمازون؟',
];

export default function Support() {
  const [messages, setMessages] = useState(chatMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMsg = { id: messages.length + 1, sender: 'user', message: text };
    setMessages([...messages, newMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const reply = {
        id: messages.length + 2,
        sender: 'bot',
        message: 'شكراً لسؤالك! بناءً على تحليل بيانات حسابك، يمكنني مساعدتك. هل تريد المزيد من التفاصيل حول هذا الموضوع؟',
      };
      setMessages(prev => [...prev, reply]);
      setTyping(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">خدمة العملاء الذكية</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">مساعد ذكي يجيب على أسئلتك حول حملاتك وإعلاناتك</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card flex flex-col" style={{ height: '600px' }}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                <Bot className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm">مساعد أدفلو الذكي</h3>
                <p className="text-xs text-emerald-600">متصل الآن</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(m => (
                <div key={m.id} className={`flex gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.sender === 'user' ? 'bg-brand-100 dark:bg-brand-900/30' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
                    {m.sender === 'user' ? <User className="w-4 h-4 text-brand-600" /> : <Bot className="w-4 h-4 text-purple-600" />}
                  </div>
                  <div className={`max-w-[75%] p-3 rounded-xl text-sm leading-relaxed whitespace-pre-line ${m.sender === 'user' ? 'bg-brand-600 text-white rounded-tl-sm' : 'bg-gray-100 dark:bg-gray-800 rounded-tr-sm'}`}>
                    {m.message}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl rounded-tr-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-wrap gap-2 mb-3">
                {quickQuestions.slice(0, 3).map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)}
                    className="text-xs px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-600 hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                  placeholder="اكتب سؤالك هنا..."
                  className="input-field flex-1" />
                <button onClick={() => sendMessage(input)} className="btn-primary px-4">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold mb-3 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-brand-600" /> أسئلة شائعة</h3>
            <div className="space-y-2">
              {quickQuestions.map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)}
                  className="w-full text-right text-sm p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold mb-3 flex items-center gap-2"><ExternalLink className="w-4 h-4 text-brand-600" /> روابط مفيدة</h3>
            <div className="space-y-2">
              <a href="/help" className="block text-sm text-brand-600 hover:underline p-2">مركز المساعدة</a>
              <a href="/help" className="block text-sm text-brand-600 hover:underline p-2">دليل البدء السريع</a>
              <a href="/help" className="block text-sm text-brand-600 hover:underline p-2">شرح مقاييس الإعلانات</a>
            </div>
          </div>

          <div className="card p-5 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3 mb-3">
              <Headphones className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-sm">تحتاج مساعدة بشرية؟</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">يمكنك تصعيد المحادثة لفريق الدعم</p>
            <button className="w-full btn-secondary text-sm">فتح تذكرة دعم</button>
          </div>
        </div>
      </div>
    </div>
  );
}
