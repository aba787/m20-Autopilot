import { useState, useRef, useEffect } from 'react';
import { chatMessages } from '@/data/mock';
import { Send, Bot, User } from 'lucide-react';

const quickQuestions = [
  'ما الفرق بين ACOS و ROAS؟',
  'كيف أخفض ACOS؟',
  'ما أفضل ميزانية لحملتي؟',
  'كيف أختار الكلمات المفتاحية؟',
];

const autoReplies: Record<string, string> = {
  'اشرح': 'بكل سرور! يرجى تحديد ما تريد شرحه وسأجيبك بالتفصيل.',
  'ACOS': 'ACOS = إنفاق الإعلان ÷ مبيعات الإعلان × 100\n\nكلما انخفض ACOS كان أفضل. الهدف المعقول عادةً بين 20-30% حسب هامش ربحك.\n\nمثال: أنفقت 200 ر.س وحققت 1000 ر.س → ACOS = 20%',
  'ROAS': 'ROAS = مبيعات الإعلان ÷ إنفاق الإعلان\n\nكلما ارتفع كان أفضل. ROAS 4 يعني كل ريال تنفقه يُعيد 4 ريالات مبيعات.',
  'ميزانية': 'لتحديد الميزانية المثالية:\n1. ابدأ بميزانية صغيرة (50-100 ر.س يومياً)\n2. راقب ACOS لأسبوع\n3. إذا كان ROAS أعلى من 4 — زِد الميزانية\n4. إذا كان ACOS أعلى من 40% — أوقف وراجع الكلمات',
  'كلمات': 'لاختيار الكلمات المفتاحية المثالية:\n1. ابدأ بـ Broad Match لاكتشاف ما يصلح\n2. انتقل لـ Phrase ثم Exact للكلمات الجيدة\n3. استخدم كلمات سلبية لحجب النقرات الغير مجدية\n4. راجع تقرير استعلامات البحث أسبوعياً',
};

function getBotReply(msg: string): string {
  for (const key of Object.keys(autoReplies)) {
    if (msg.includes(key)) return autoReplies[key];
  }
  return 'شكراً لسؤالك! سيرد عليك فريق M20 قريباً. في الوقت الحالي يمكنك مراجعة مركز المساعدة للإجابات الشائعة.';
}

export default function Support() {
  const [messages, setMessages] = useState(chatMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', message: msg }]);
    setTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', message: getBotReply(msg) }]);
      setTyping(false);
    }, 1000);
  };

  return (
    <div className="space-y-4 h-full flex flex-col max-h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2"><Bot className="w-5 h-5 text-green-600" /> المساعد الذكي</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">اسأل عن أي شيء متعلق بإعلانات أمازون والمنصة</p>
      </div>

      <div className="card flex-1 flex flex-col overflow-hidden" style={{ minHeight: '400px', maxHeight: '500px' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">M20 AI</p>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl rounded-tr-sm px-3 py-2 text-sm max-w-sm">
                مرحباً! أنا مساعد M20 الذكي. كيف يمكنني مساعدتك اليوم؟
              </div>
            </div>
          </div>

          {messages.map(m => (
            <div key={m.id} className={`flex gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${m.sender === 'bot' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-200 dark:bg-gray-700'}`}>
                {m.sender === 'bot' ? <Bot className="w-4 h-4 text-green-600" /> : <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
              </div>
              <div className={`flex-1 ${m.sender === 'user' ? 'flex flex-col items-end' : ''}`}>
                <p className="text-xs text-gray-400 mb-1">{m.sender === 'bot' ? 'M20 AI' : 'أنت'}</p>
                <div className={`inline-block rounded-xl px-3 py-2 text-sm max-w-xs lg:max-w-sm whitespace-pre-line ${m.sender === 'user' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-tl-sm' : 'bg-gray-100 dark:bg-gray-800 rounded-tr-sm'}`}>
                  {m.message}
                </div>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-green-600" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl rounded-tr-sm px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Questions */}
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 flex gap-1.5 overflow-x-auto">
          {quickQuestions.map(q => (
            <button key={q} onClick={() => send(q)}
              className="text-xs px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 whitespace-nowrap text-gray-600 dark:text-gray-400">
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder="اكتب سؤالك هنا..." className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-gray-900" />
            <button type="submit" disabled={!input.trim()}
              className="p-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg disabled:opacity-40 hover:opacity-90">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
