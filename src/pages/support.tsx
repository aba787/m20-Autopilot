import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertTriangle } from 'lucide-react';

const CARD = { background: 'rgba(0,217,255,0.04)', border: '1px solid rgba(0,217,255,0.12)', borderRadius: '0.875rem' } as const;
const CYAN = '#00d9ff';

const quickQuestions = [
  "What's the difference between ACOS and ROAS?",
  "How do I lower my ACOS?",
  "What's a good daily budget?",
  "How do I choose the best keywords?",
  "What does the AI Engine do?",
];

interface Message {
  id: number;
  sender: 'user' | 'bot';
  message: string;
  loading?: boolean;
}

export default function Support() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [history,  setHistory]  = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setError('');

    const userMsg: Message = { id: Date.now(), sender: 'user', message: msg };
    const tempBotId = Date.now() + 1;
    setMessages(prev => [...prev, userMsg, { id: tempBotId, sender: 'bot', message: '', loading: true }]);
    setLoading(true);

    try {
      const res  = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      const reply = data.reply as string;

      // Update history
      setHistory(prev => [
        ...prev,
        { role: 'user'      as const, content: msg   },
        { role: 'assistant' as const, content: reply },
      ].slice(-12));  // keep last 12 turns

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
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Bot className="w-5 h-5" style={{ color: CYAN }} /> AI Assistant
        </h1>
        <p className="text-sm" style={{ color: '#8a94a6' }}>
          Powered by GPT-4o mini — ask anything about Amazon advertising or the platform
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm flex items-center gap-2 rounded-xl flex-shrink-0"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{error}</span>
          {error.toLowerCase().includes('quota') && (
            <a href="https://platform.openai.com/billing" target="_blank" rel="noreferrer"
              className="underline whitespace-nowrap text-xs" style={{ color: '#ef4444' }}>
              Add billing →
            </a>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden" style={{ ...CARD, minHeight: '420px', maxHeight: '560px' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Welcome message */}
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(0,217,255,0.1)', border: '1px solid rgba(0,217,255,0.25)' }}>
              <Bot className="w-4 h-4" style={{ color: CYAN }} />
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: '#4a5568' }}>M20 AI</p>
              <div className="rounded-xl rounded-tl-sm px-3 py-2.5 text-sm max-w-sm"
                style={{ background: 'rgba(0,217,255,0.08)', border: '1px solid rgba(0,217,255,0.15)', color: '#e2e8f0' }}>
                Hello! I'm the M20 AI Assistant — your Amazon advertising expert. I can help you with campaigns, keywords, ACOS/ROAS, and how to use the platform. What would you like to know?
              </div>
            </div>
          </div>

          {messages.map(m => (
            <div key={m.id} className={`flex gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={m.sender === 'bot'
                  ? { background: 'rgba(0,217,255,0.1)', border: '1px solid rgba(0,217,255,0.25)' }
                  : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {m.sender === 'bot'
                  ? <Bot className="w-4 h-4" style={{ color: CYAN }} />
                  : <User className="w-4 h-4" style={{ color: '#8a94a6' }} />}
              </div>
              <div className={`flex-1 ${m.sender === 'user' ? 'flex flex-col items-end' : ''}`}>
                <p className="text-xs mb-1" style={{ color: '#4a5568' }}>{m.sender === 'bot' ? 'M20 AI' : 'You'}</p>
                {m.loading ? (
                  <div className="rounded-xl rounded-tl-sm px-4 py-3"
                    style={{ background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.12)' }}>
                    <div className="flex gap-1">
                      {[0, 150, 300].map(d => (
                        <div key={d} className="w-2 h-2 rounded-full animate-bounce"
                          style={{ background: CYAN, animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="inline-block rounded-xl px-3 py-2.5 text-sm max-w-xs lg:max-w-sm whitespace-pre-line"
                    style={m.sender === 'user'
                      ? { background: 'rgba(0,217,255,0.15)', border: '1px solid rgba(0,217,255,0.25)', color: '#e2e8f0', borderTopRightRadius: '4px' }
                      : { background: 'rgba(0,217,255,0.05)', border: '1px solid rgba(0,217,255,0.1)', color: '#e2e8f0', borderTopLeftRadius: '4px' }}>
                    {m.message}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Quick questions */}
        <div className="px-4 py-2 flex gap-1.5 overflow-x-auto flex-shrink-0"
          style={{ borderTop: '1px solid rgba(0,217,255,0.08)' }}>
          {quickQuestions.map(q => (
            <button key={q} onClick={() => send(q)} disabled={loading}
              className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
              style={{ border: '1px solid rgba(0,217,255,0.15)', color: '#8a94a6', background: 'rgba(0,217,255,0.04)' }}>
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(0,217,255,0.1)' }}>
          <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about Amazon advertising..."
              disabled={loading}
              className="flex-1 rounded-lg px-3 py-2 text-sm outline-none text-white placeholder-[#4a5568]"
              style={{ background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.15)' }} />
            <button type="submit" disabled={!input.trim() || loading}
              className="p-2 rounded-lg text-[#0a0612] transition-all flex-shrink-0"
              style={{
                background: input.trim() && !loading ? 'linear-gradient(135deg,#00d9ff,#00f0ff)' : 'rgba(0,217,255,0.2)',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              }}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>

      {/* Scope notice */}
      <p className="text-xs text-center flex-shrink-0" style={{ color: '#4a5568' }}>
        This assistant only answers questions about Amazon advertising and the M20 platform.
        For billing or account issues, email <span style={{ color: CYAN }}>support@m20.ai</span>
      </p>
    </div>
  );
}
