import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertTriangle } from 'lucide-react';
import { useAuth, authFetch } from '@/lib/useAuth';
import { useI18n } from '@/lib/i18n';
import ReactMarkdown from 'react-markdown';

const CARD = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)' } as const;

const quickQuestionsEn = [
  "What's the difference between ACOS and ROAS?",
  "How do I lower my ACOS?",
  "What's a good daily budget?",
  "How do I choose the best keywords?",
  "What does the AI Engine do?",
];

const quickQuestionsAr = [
  "ما الفرق بين ACOS و ROAS؟",
  "كيف أخفض الـ ACOS؟",
  "كم الميزانية اليومية المناسبة؟",
  "كيف أختار أفضل الكلمات المفتاحية؟",
  "ماذا يفعل محرك الذكاء الاصطناعي؟",
];

const faqEn: Record<string, string> = {
  "what's the difference between acos and roas": "ACOS and ROAS are inverses of each other:\n\n• ACOS = Spend ÷ Sales × 100 (lower is better)\n• ROAS = Sales ÷ Spend (higher is better)\n\nExample: You spent $100 and made $500 in sales:\n- ACOS = 20%\n- ROAS = 5.0",
  "how do i lower my acos": "Here are proven strategies to lower your ACOS:\n\n1. Add negative keywords to stop irrelevant clicks\n2. Focus on high-converting keywords\n3. Reduce bids on keywords with high ACOS\n4. Improve your product listing (title, images, A+ content)\n5. Use the AI Engine to get personalized recommendations",
  "what's a good daily budget": "A good daily budget depends on your goals:\n\n• Starting out: $20-30/day per campaign\n• Growing: $40-60/day per campaign\n• Scaling: $100+/day per campaign\n\nTip: For best results, we recommend a daily budget of at least 40 SAR.",
  "how do i choose the best keywords": "To choose the best keywords:\n\n1. Start with your product's main features\n2. Use Amazon's auto-suggest and search term report\n3. Focus on keywords with high CTR and good ROAS\n4. Add irrelevant terms as negative keywords\n5. Check the AI Engine for keyword suggestions",
  "what does the ai engine do": "The AI Engine analyzes your campaigns using:\n\n1. Rule-based logic (fast, deterministic decisions)\n2. GPT-4o mini AI analysis (deeper insights)\n\nIt can recommend: pausing weak campaigns, scaling profitable ones, adjusting bids, and adding negative keywords.",
};

const faqAr: Record<string, string> = {
  "ما الفرق بين acos و roas": "ACOS و ROAS هما عكس بعضهما:\n\n• ACOS = الإنفاق ÷ المبيعات × 100 (الأقل أفضل)\n• ROAS = المبيعات ÷ الإنفاق (الأعلى أفضل)\n\nمثال: أنفقت 100$ وحققت 500$ مبيعات:\n- ACOS = 20%\n- ROAS = 5.0",
  "كيف أخفض الـ acos": "استراتيجيات مجربة لتخفيض ACOS:\n\n1. إضافة كلمات مفتاحية سلبية لمنع النقرات غير المناسبة\n2. التركيز على الكلمات المفتاحية عالية التحويل\n3. تقليل العطاءات للكلمات ذات ACOS عالي\n4. تحسين قائمة المنتج (العنوان، الصور، المحتوى)\n5. استخدم محرك الذكاء للحصول على توصيات مخصصة",
  "كم الميزانية اليومية المناسبة": "الميزانية المناسبة تعتمد على أهدافك:\n\n• البداية: 75-110 ريال يوميًا لكل حملة\n• النمو: 150-225 ريال يوميًا لكل حملة\n• التوسع: 375+ ريال يوميًا لكل حملة\n\nنصيحة: للحصول على أفضل نتائج، ننصح بميزانية يومية لا تقل عن 40 ريال.",
  "كيف أختار أفضل الكلمات المفتاحية": "لاختيار أفضل الكلمات المفتاحية:\n\n1. ابدأ بالميزات الرئيسية لمنتجك\n2. استخدم اقتراحات أمازون التلقائية وتقرير مصطلحات البحث\n3. ركّز على الكلمات ذات CTR عالي و ROAS جيد\n4. أضف المصطلحات غير المناسبة ككلمات سلبية\n5. تحقق من محرك الذكاء لاقتراحات الكلمات",
  "ماذا يفعل محرك الذكاء الاصطناعي": "محرك الذكاء الاصطناعي يحلل حملاتك باستخدام:\n\n1. منطق قائم على القواعد (قرارات سريعة وحاسمة)\n2. تحليل GPT-4o mini (رؤى أعمق)\n\nيمكنه التوصية بـ: إيقاف الحملات الضعيفة، توسيع الحملات المربحة، تعديل العطاءات، وإضافة كلمات سلبية.",
};

interface Message {
  id: number;
  sender: 'user' | 'bot';
  message: string;
  loading?: boolean;
}

function detectLang(text: string): 'ar' | 'en' {
  const arabicChars = (text.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g) || []).length;
  const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
  if (arabicChars === 0 && latinChars === 0) return 'en';
  return arabicChars >= latinChars ? 'ar' : 'en';
}

function findFaqAnswer(msg: string): string | null {
  const detected = detectLang(msg);
  const normalizedMsg = msg.toLowerCase().replace(/[?؟!.]/g, '').trim();
  const faq = detected === 'ar' ? faqAr : faqEn;
  for (const [key, answer] of Object.entries(faq)) {
    const normalizedKey = key.toLowerCase().replace(/[?؟!.]/g, '').trim();
    if (normalizedMsg.includes(normalizedKey) || normalizedKey.includes(normalizedMsg)) {
      return answer;
    }
  }
  return null;
}

export default function Support() {
  const { token } = useAuth();
  const apiFetch = authFetch(token);
  const { t, lang, tone } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [history,  setHistory]  = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const quickQuestions = lang === 'ar' ? quickQuestionsAr : quickQuestionsEn;

  const welcomeMessage = lang === 'ar'
    ? 'أهلاً! أنا المساعد الذكي M20 — خبير إعلانات أمازون. أقدر أساعدك في الحملات، الكلمات المفتاحية، ACOS/ROAS، واستخدام المنصة. كيف أقدر أساعدك؟'
    : "Hello! I'm the M20 AI Assistant — your Amazon advertising expert. I can help you with campaigns, keywords, ACOS/ROAS, and how to use the platform. What would you like to know?";

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setError('');

    const userMsg: Message = { id: Date.now(), sender: 'user', message: msg };
    const tempBotId = Date.now() + 1;

    const faqAnswer = findFaqAnswer(msg);
    if (faqAnswer) {
      setMessages(prev => [...prev, userMsg, { id: tempBotId, sender: 'bot', message: faqAnswer }]);
      setHistory(prev => [
        ...prev,
        { role: 'user' as const, content: msg },
        { role: 'assistant' as const, content: faqAnswer },
      ].slice(-24));
      return;
    }

    setMessages(prev => [...prev, userMsg, { id: tempBotId, sender: 'bot', message: '', loading: true }]);
    setLoading(true);

    try {
      const res  = await apiFetch('/api/support-chat', {
        method: 'POST',
        body: JSON.stringify({ message: msg, history, language: lang, tone }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      const reply = data.reply as string;

      setHistory(prev => [
        ...prev,
        { role: 'user'      as const, content: msg   },
        { role: 'assistant' as const, content: reply },
      ].slice(-24));

      setMessages(prev => prev.map(m => m.id === tempBotId
        ? { ...m, message: reply, loading: false }
        : m
      ));
    } catch (e: any) {
      setError(e.message);
      setMessages(prev => prev.filter(m => m.id !== tempBotId));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col" style={{ maxHeight: 'calc(100vh - 6rem)' }}>
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Bot className="w-7 h-7" style={{ color: 'var(--accent)' }} /> {t('bot.title')}
        </h1>
      </div>

      {error && (
        <div className="p-3 text-sm flex items-center gap-2 rounded-xl flex-shrink-0"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: 'var(--error)' }}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{error}</span>
          {error.toLowerCase().includes('quota') && (
            <a href="https://platform.openai.com/billing" target="_blank" rel="noreferrer"
              className="underline whitespace-nowrap text-xs" style={{ color: 'var(--error)' }}>
              Add billing →
            </a>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden" style={{ ...CARD, minHeight: '420px', maxHeight: '560px' }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--accent-bg-strong)', border: '1px solid var(--accent-border)' }}>
              <Bot className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>M20 AI</p>
              <div className="rounded-xl rounded-tl-sm px-4 py-3 text-sm max-w-sm"
                style={{ background: 'var(--accent-bg)', border: '1px solid var(--input-border)', color: 'var(--text-secondary)' }}>
                {welcomeMessage}
              </div>
            </div>
          </div>

          {messages.map(m => (
            <div key={m.id} className={`flex gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={m.sender === 'bot'
                  ? { background: 'var(--accent-bg-strong)', border: '1px solid var(--accent-border)' }
                  : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {m.sender === 'bot'
                  ? <Bot className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  : <User className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
              </div>
              <div className={`flex-1 ${m.sender === 'user' ? 'flex flex-col items-end' : ''}`}>
                <p className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>
                  {m.sender === 'bot' ? 'M20 AI' : (lang === 'ar' ? 'أنت' : 'You')}
                </p>
                {m.loading ? (
                  <div className="rounded-xl rounded-tl-sm px-4 py-3"
                    style={{ background: 'var(--input-bg)', border: '1px solid var(--card-border)' }}>
                    <div className="flex gap-1">
                      {[0, 150, 300].map(d => (
                        <div key={d} className="w-2 h-2 rounded-full animate-bounce"
                          style={{ background: 'var(--accent)', animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={`inline-block rounded-xl px-4 py-3 text-sm max-w-xs lg:max-w-sm ${m.sender === 'bot' ? 'page-markdown' : 'whitespace-pre-line'}`}
                    style={m.sender === 'user'
                      ? { background: 'var(--accent-bg-strong)', border: '1px solid var(--accent-border)', color: 'var(--text-secondary)', borderTopRightRadius: '4px' }
                      : { background: 'var(--card-bg)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)', borderTopLeftRadius: '4px' }}>
                    {m.sender === 'bot' ? <ReactMarkdown>{m.message}</ReactMarkdown> : m.message}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="px-4 py-2 flex gap-1.5 overflow-x-auto flex-shrink-0"
          style={{ borderTop: '1px solid var(--border-subtle)' }}>
          {quickQuestions.map(q => (
            <button key={q} onClick={() => send(q)} disabled={loading}
              className="text-xs px-2.5 py-1.5 rounded-full whitespace-nowrap transition-colors"
              style={{ border: '1px solid var(--input-border)', color: 'var(--text-muted)', background: 'var(--card-bg)' }}>
              {q}
            </button>
          ))}
        </div>

        <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: '1px solid var(--border-primary)' }}>
          <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder={t('bot.placeholder')}
              disabled={loading}
              className="flex-1 rounded-lg px-3 py-2 text-sm outline-none text-white placeholder-[#4a5568]"
              style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)' }} />
            <button type="submit" disabled={!input.trim() || loading}
              className="p-2 rounded-lg text-[#0a0612] transition-all flex-shrink-0"
              style={{
                background: input.trim() && !loading ? 'var(--accent-gradient)' : 'var(--accent-gradient-dim)',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              }}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>

      <p className="text-xs text-center flex-shrink-0" style={{ color: 'var(--text-dim)' }}>
        {t('bot.scope')}
        {' '}{lang === 'ar' ? 'لمشاكل الفواتير أو الحساب، تواصل عبر' : 'For billing or account issues, email'}{' '}
        <span style={{ color: 'var(--accent)' }}>support@m20.ai</span>
      </p>
    </div>
  );
}
