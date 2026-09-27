import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/roomDatabase';
import { Sparkles, X, Send, Bot, ArrowRight, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({ isOpen, onClose }) => {
  const { currentUser, navigate } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `Hello! I am FoodLoop AI Assistant. I can assist you with surplus discovery, checking active plate availability, understanding our strict safe-use cutoff windows (e.g. Evening at 8:30 PM), or guiding you through food requests and transport. How may I help you?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = { role: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const activeDonations = db.donationDao.getActiveAvailable();
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          userRole: currentUser?.role || 'visitor',
          contextData: {
            activeDonationsCount: activeDonations.length,
            sampleLocation: 'Narasaraopet',
            donations: activeDonations.map((d) => ({
              id: d.id,
              donor: d.donorName,
              plates: d.remainingPlates,
              meal: d.mealPeriod,
              availableUntil: d.availableUntil,
            })),
          },
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.text || 'I processed your request. Let me know if you need more details on active donations.',
        },
      ]);
    } catch {
      // Local fallback
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `In Narasaraopet, ABC Educational Institution currently has surplus Lunch plates available until 3:30 PM. Royal Heritage Caterers has 120 plates for Evening available until 8:30 PM. All requests require organization verification.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'Show nearby lunch donations',
    'How many plates are available?',
    'Which donations expire soon?',
    'Explain evening 8:30 PM cutoff rule',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">FoodLoop AI Assistant</h3>
              <p className="text-[11px] text-slate-500">Gemini 3.8 Flash · Surplus & Distribution Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative banner */}
        <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 text-[11px] text-emerald-800 flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Core workflow remains deterministic & verified. AI provides assistance and predictions.</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed shadow-xs ${
                  m.role === 'user'
                    ? 'bg-slate-900 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Analyzing live surplus database...</span>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="p-3 border-t border-slate-100 bg-white">
          <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Common Queries</div>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="text-[11px] text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-md text-left transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about food donations, rules, timings..."
              className="flex-1 text-xs px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
