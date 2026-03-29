import { useState, useRef, useEffect } from 'react';
import { chatMessages } from '@/data/mock';
import { Send, Bot, User } from 'lucide-react';

const CARD = { background: 'rgba(0,217,255,0.04)', border: '1px solid rgba(0,217,255,0.12)', borderRadius: '0.875rem' } as const;

const quickQuestions = [
  "What's the difference between ACOS and ROAS?",
  "How do I lower my ACOS?",
  "What's a good daily budget?",
  "How do I choose the best keywords?",
];

const autoReplies: Record<string, string> = {
  'ACOS':    'ACOS = Ad Spend ÷ Ad Sales × 100\n\nLower is better. A typical target is 20–30% depending on your margin.\n\nExample: You spent $200 and made $1,000 → ACOS = 20%',
  'ROAS':    'ROAS = Ad Sales ÷ Ad Spend\n\nHigher is better. A ROAS of 5 means every $1 spent generates $5 in sales.',
  'budget':  'To find the ideal budget:\n1. Start small ($50–100/day)\n2. Monitor ACOS for a week\n3. If ROAS > 4 — increase budget\n4. If ACOS > 40% — pause and review keywords',
  'keyword': 'To choose the best keywords:\n1. Start with Broad Match to discover what works\n2. Move to Phrase then Exact for top performers\n3. Add negative keywords to block irrelevant clicks\n4. Review the Search Term Report weekly',
  'lower':   'To lower your ACOS:\n1. Pause low-converting keywords\n2. Add negative keywords to cut irrelevant clicks\n3. Increase bids on your best-performing keywords\n4. Improve your product listing quality',
};

function getBotReply(msg: string): string {
  const lower = msg.toLowerCase();
  for (const key of Object.keys(autoReplies)) {
    if (lower.includes(key.toLowerCase())) return autoReplies[key];
  }
  return "Thanks for your message! The M20 support team will get back to you shortly. In the meantime, check our Help Center for quick answers to common questions.";
}

export default function Support() {
  const [messages, setMessages] = useState(chatMessages);
  const [input, setInput]       = useState('');
  const [typing, setTyping]     = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);

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
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Bot className="w-5 h-5" style={{ color: '#00d9ff' }} /> AI Assistant
        </h1>
        <p className="text-sm" style={{ color: '#8a94a6' }}>Ask anything about Amazon advertising or the platform</p>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden" style={{ ...CARD, minHeight: '400px', maxHeight: '500px' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Welcome message */}
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(0,217,255,0.1)', border: '1px solid rgba(0,217,255,0.25)' }}>
              <Bot className="w-4 h-4" style={{ color: '#00d9ff' }} />
            </div>
            <div className="flex-1">
              <p className="text-xs mb-1" style={{ color: '#4a5568' }}>M20 AI</p>
              <div className="rounded-xl rounded-tl-sm px-3 py-2 text-sm max-w-sm"
                style={{ background: 'rgba(0,217,255,0.08)', border: '1px solid rgba(0,217,255,0.15)', color: '#e2e8f0' }}>
                Hello! I'm the M20 AI assistant. How can I help you today?
              </div>
            </div>
          </div>

          {messages.map(m => (
            <div key={m.id} className={`flex gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={m.sender === 'bot'
                  ? { background: 'rgba(0,217,255,0.1)', border: '1px solid rgba(0,217,255,0.25)' }
                  : { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {m.sender === 'bot'
                  ? <Bot className="w-4 h-4" style={{ color: '#00d9ff' }} />
                  : <User className="w-4 h-4" style={{ color: '#8a94a6' }} />}
              </div>
              <div className={`flex-1 ${m.sender === 'user' ? 'flex flex-col items-end' : ''}`}>
                <p className="text-xs mb-1" style={{ color: '#4a5568' }}>{m.sender === 'bot' ? 'M20 AI' : 'You'}</p>
                <div className="inline-block rounded-xl px-3 py-2 text-sm max-w-xs lg:max-w-sm whitespace-pre-line"
                  style={m.sender === 'user'
                    ? { background: 'linear-gradient(135deg,rgba(0,217,255,0.2),rgba(0,240,255,0.15))', border: '1px solid rgba(0,217,255,0.3)', color: '#e2e8f0', borderTopRightRadius: '4px' }
                    : { background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.12)', color: '#e2e8f0', borderTopLeftRadius: '4px' }}>
                  {m.message}
                </div>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,217,255,0.1)', border: '1px solid rgba(0,217,255,0.25)' }}>
                <Bot className="w-4 h-4" style={{ color: '#00d9ff' }} />
              </div>
              <div className="rounded-xl rounded-tl-sm px-4 py-3"
                style={{ background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.12)' }}>
                <div className="flex gap-1">
                  {[0, 150, 300].map(d => (
                    <div key={d} className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: '#00d9ff', animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Questions */}
        <div className="px-4 py-2 flex gap-1.5 overflow-x-auto" style={{ borderTop: '1px solid rgba(0,217,255,0.08)' }}>
          {quickQuestions.map(q => (
            <button key={q} onClick={() => send(q)}
              className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
              style={{ border: '1px solid rgba(0,217,255,0.15)', color: '#8a94a6', background: 'rgba(0,217,255,0.04)' }}>
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(0,217,255,0.1)' }}>
          <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder="Type your question here..."
              className="flex-1 rounded-lg px-3 py-2 text-sm outline-none text-white placeholder-[#4a5568]"
              style={{ background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.15)' }} />
            <button type="submit" disabled={!input.trim()}
              className="p-2 rounded-lg text-[#0a0612] transition-all"
              style={{ background: input.trim() ? 'linear-gradient(135deg,#00d9ff,#00f0ff)' : 'rgba(0,217,255,0.2)', cursor: input.trim() ? 'pointer' : 'not-allowed' }}>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
