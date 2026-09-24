import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  X,
  Send,
  Crown,
  Zap,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  Clock,
  RotateCcw,
  Flame,
  ArrowRight,
  ShieldCheck,
  Coins,
  FileCheck,
  Check
} from 'lucide-react';
import { ChatMessageData } from '../types';
import { DEFAULT_CHAT_CONFIG } from '../data/initialData';

export const LiveChatWidget: React.FC = () => {
  const { theme, setView, openOrderForm, openNegotiateModal, openAuditModal, services, chatConfig: contextChatConfig } = useApp();
  const chatConfig = contextChatConfig || DEFAULT_CHAT_CONFIG;
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => {
    let sid = localStorage.getItem('apex_chat_session_id');
    if (!sid) {
      sid = `apex-chat-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('apex_chat_session_id', sid);
    }
    return sid;
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isLight = theme === 'light';

  // Always active live AI strategist
  const isOnline = true;

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 6000);
      return () => clearInterval(interval);
    }
  }, [isOpen, sessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat/messages/${sessionId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.warn('Failed to fetch chat messages:', err);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsgId = `msg-user-${Date.now()}`;
    const newMsg: ChatMessageData = {
      id: userMsgId,
      sessionId,
      sender: 'user',
      text,
      created_at: new Date().toISOString()
    };

    // Optimistically show user message
    setMessages(prev => [...prev, newMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: text,
          currentUrl: window.location.pathname
        })
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const aiMsg: ChatMessageData = {
          id: data.messageId || `msg-ai-${Date.now()}`,
          sessionId,
          sender: 'admin',
          text: data.reply,
          created_at: new Date().toISOString()
        };
        setMessages(prev => {
          // Avoid duplicates if fetchMessages also picked it up
          if (prev.some(m => m.id === aiMsg.id)) return prev;
          return [...prev, aiMsg];
        });
      } else {
        // Fallback fetch to sync state
        await fetchMessages();
      }
    } catch (err) {
      console.error('Failed to communicate with AI Assistant:', err);
      await fetchMessages();
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = async () => {
    const newSid = `apex-chat-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('apex_chat_session_id', newSid);
    setSessionId(newSid);
    setMessages([]);
  };

  const starterPrompts = [
    {
      icon: <Flame className="w-3.5 h-3.5 text-amber-400" />,
      title: 'YouTube Thumbnails',
      prompt: 'What is included in the YouTube Thumbnails packages and what are the pricing tiers?'
    },
    {
      icon: <Zap className="w-3.5 h-3.5 text-indigo-400" />,
      title: 'Delivery Speed',
      prompt: 'How fast is your turnaround time and do you offer 24-hour rush delivery?'
    },
    {
      icon: <Coins className="w-3.5 h-3.5 text-emerald-400" />,
      title: 'Crypto Payments',
      prompt: 'Which cryptocurrency networks (USDT, BTC, SOL) do you accept and how does instant verification work?'
    },
    {
      icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" />,
      title: 'Price Negotiation',
      prompt: 'How does price negotiation and making custom price offers work for high volume or creators on a budget?'
    },
    {
      icon: <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />,
      title: 'Free Channel Audit',
      prompt: 'How can I claim a Free Channel & CTR Visual Audit with ApexCreator Studio?'
    }
  ];

  if (chatConfig?.enabled === false) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open ApexCreator Live Growth Chat"
          className="relative group p-4 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-indigo-500/40"
        >
          {/* Pulsing Live Badge */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950" />
          </span>
          <MessageSquare className="w-6 h-6 group-hover:rotate-6 transition-transform" />
          
          {/* Hover Tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold whitespace-nowrap shadow-xl border border-slate-800 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
            💬 Chat with AI Growth Strategist
          </span>
        </button>
      )}

      {/* Live Chat Window */}
      {isOpen && (
        <div className={`w-[360px] sm:w-[420px] h-[580px] max-h-[90vh] rounded-3xl border flex flex-col justify-between shadow-2xl overflow-hidden animate-fadeIn backdrop-blur-xl transition-all duration-300 ${
          isLight 
            ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/50' 
            : 'bg-slate-950/95 border-slate-800/90 text-white shadow-black/80'
        }`}>
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-center justify-between shrink-0 shadow-lg relative overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                <Crown className="w-5 h-5 text-amber-300 fill-amber-300/30" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm tracking-tight">ApexCreator Studio</h4>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    AI Live
                  </span>
                </div>
                <p className="text-[11px] text-indigo-100 font-medium flex items-center gap-1">
                  <span>Growth Strategy Assistant</span>
                  <span className="opacity-60">•</span>
                  <span className="text-emerald-300">Instant answers</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 relative z-10">
              <button
                onClick={handleClearChat}
                title="Start New Conversation"
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors text-xs flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages & Interactive Area */}
          <div ref={scrollRef} className="p-4 flex-grow overflow-y-auto space-y-4 text-xs scrollbar-thin">
            
            {/* Lively Welcome Hero (When chat is empty) */}
            {messages.length === 0 && (
              <div className="space-y-4 animate-fadeIn">
                <div className={`p-4 rounded-2xl border transition-all ${
                  isLight ? 'bg-gradient-to-b from-indigo-50/70 to-slate-50 border-indigo-100' : 'bg-gradient-to-b from-indigo-950/40 to-slate-900 border-indigo-900/40'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs">ApexCreator Concierge</h5>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        Grounded in live services & catalog
                      </span>
                    </div>
                  </div>
                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Welcome to <strong>ApexCreator Studio</strong>! Ask me any question about our video editing, viral thumbnail designs, pricing tiers, crypto payments, price negotiation, or channel audit options.
                  </p>
                </div>

                {/* Quick-tap Starter Modules */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Popular Enquiries
                    </span>
                    <span className="text-[10px] text-indigo-400 font-semibold">1-Click Ask</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {starterPrompts.map((sp, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sp.prompt)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between group transition-all duration-200 ${
                          isLight
                            ? 'bg-slate-50 hover:bg-indigo-50/70 border-slate-200 hover:border-indigo-200 text-slate-800'
                            : 'bg-slate-900/80 hover:bg-indigo-950/50 border-slate-800 hover:border-indigo-800/80 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`p-1.5 rounded-lg ${isLight ? 'bg-white shadow-sm' : 'bg-slate-800'}`}>
                            {sp.icon}
                          </div>
                          <div>
                            <span className="font-bold text-xs block">{sp.title}</span>
                            <span className="text-[10px] text-slate-400 block line-clamp-1">{sp.prompt}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Studio Highlights Mini Banner */}
                <div className={`p-3 rounded-xl border flex items-center justify-between text-[10px] font-medium ${
                  isLight ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <Coins className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Crypto (USDT, BTC, SOL) & Cards Accepted</span>
                  </div>
                  <span className="font-black text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 uppercase">Bybit Verified</span>
                </div>
              </div>
            )}

            {/* Conversation Messages */}
            {messages.map((m) => {
              const isUser = m.sender === 'user' || m.sender === 'customer';
              return (
                <div key={m.id} className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                  
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`p-3.5 rounded-2xl max-w-[85%] space-y-1.5 shadow-sm ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-tr-sm'
                      : isLight 
                        ? 'bg-slate-100 text-slate-800 rounded-tl-sm border border-slate-200/80' 
                        : 'bg-slate-900 text-slate-100 rounded-tl-sm border border-slate-800'
                  }`}>
                    <div className="leading-relaxed whitespace-pre-wrap font-normal text-xs space-y-1">
                      {m.text}
                    </div>
                    <div className="flex items-center justify-between pt-1 text-[9px] opacity-60">
                      <span>{isUser ? 'You' : 'ApexCreator AI'}</span>
                      <span>
                        {new Date(m.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-2.5 justify-start animate-fadeIn">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className={`p-3 rounded-2xl border ${
                  isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[10px] font-semibold text-slate-400 ml-1.5">Analyzing studio catalog...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Chips (Always available at bottom) */}
          <div className={`px-3 py-2 border-t border-b flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 ${
            isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950 border-slate-800/80'
          }`}>
            <button
              onClick={() => handleSend('Show me the full price list for all packages')}
              className="px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-colors shrink-0 flex items-center gap-1"
            >
              <Flame className="w-3 h-3 text-amber-400" />
              Full Pricing
            </button>
            <button
              onClick={() => handleSend('How does price negotiation work for custom creator budgets?')}
              className="px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 transition-colors shrink-0 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              Negotiate Offer
            </button>
            <button
              onClick={() => handleSend('What crypto addresses and currencies do you support?')}
              className="px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors shrink-0 flex items-center gap-1"
            >
              <Coins className="w-3 h-3 text-emerald-400" />
              Crypto Options
            </button>
            <button
              onClick={() => handleSend('I want a free channel and CTR audit')}
              className="px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 transition-colors shrink-0 flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-cyan-400" />
              Free Audit
            </button>
          </div>

          {/* Chat Input Bar */}
          <div className={`p-3 flex flex-col gap-2 shrink-0 border-t ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask any enquiry or project question..."
                disabled={isTyping}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20'
                    : 'bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:bg-slate-900/90 focus:ring-2 focus:ring-indigo-500/20'
                }`}
              />

              <button
                onClick={() => handleSend()}
                disabled={isTyping || !inputText.trim()}
                aria-label="Send message"
                className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:hover:from-indigo-600 disabled:hover:to-purple-600 text-white shrink-0 shadow-md transition-all active:scale-95 flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between px-1 text-[9px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ApexCreator AI Online
              </span>
              <span>Press Enter ↵ to send</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
