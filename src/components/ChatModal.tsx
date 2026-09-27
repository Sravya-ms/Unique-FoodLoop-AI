import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/roomDatabase';
import { ChatMessage, FoodRequest } from '../types';
import { Send, X, ShieldCheck, Clock, MessageSquare, Truck, PackageCheck } from 'lucide-react';

interface ChatModalProps {
  request: FoodRequest;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ request, onClose }) => {
  const { currentUser, t } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isDonor = currentUser?.id === request.donorId;
  const isConsumer = currentUser?.id === request.consumerId;
  const participantName = isDonor ? request.consumerName : request.donorName;
  const participantRole = isDonor ? 'Food Consumer' : 'Food Donor';

  const loadMessages = () => {
    const list = db.chatDao.getByRequestId(request.id);
    setMessages(list);
  };

  useEffect(() => {
    loadMessages();
    const unsubscribe = db.subscribe(() => {
      loadMessages();
    });
    return unsubscribe;
  }, [request.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !currentUser) return;

    db.chatDao.insert({
      id: `chat-${Date.now()}`,
      requestId: request.id,
      donationId: request.donationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    });

    setInputText('');
  };

  const handleQuickSnippet = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl h-[620px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              {participantName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-sm">{participantName}</h3>
                <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                  <ShieldCheck className="w-3 h-3 mr-0.5" />
                  Verified
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{participantRole}</span>
                <span>·</span>
                <span>Request {request.id}</span>
                <span>·</span>
                <span className="text-emerald-700 font-medium">Request Accepted</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Coordination Notice */}
        <div className="px-4 py-2 bg-amber-50/80 border-b border-amber-100 flex items-center gap-2 text-xs text-amber-900">
          <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>
            Active coordination channel for <strong>{request.requestedPlates} plates</strong>. Please confirm pickup time and container requirements.
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>Chat initialized. Send a message to coordinate pickup timing and packaging.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = currentUser?.id === msg.senderId;
              return (
                <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5 px-1">
                    <span className="font-medium text-slate-600">{msg.senderName}</span>
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                      isMine
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Coordination Chips */}
        <div className="p-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-600">
          <span className="text-[10px] text-slate-400 shrink-0">Quick reply:</span>
          {isDonor ? (
            <>
              <button
                onClick={() => handleQuickSnippet('Food is hot and packed in thermal insulated containers at Main Gate.')}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 shrink-0 transition-colors"
              >
                Food ready at Gate
              </button>
              <button
                onClick={() => handleQuickSnippet('Please carry your own utensils or trays for transfer.')}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 shrink-0 transition-colors"
              >
                Carry utensils
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleQuickSnippet('Our transport vehicle will arrive in approximately 10 minutes.')}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 shrink-0 transition-colors"
              >
                Arriving in 10 mins
              </button>
              <button
                onClick={() => handleQuickSnippet('Courier has been assigned. Rider details: AP 07 TX 4590.')}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 shrink-0 transition-colors"
              >
                Courier assigned
              </button>
            </>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('chat_placeholder')}
            className="flex-1 text-xs px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
          >
            <span>{t('chat_send')}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
