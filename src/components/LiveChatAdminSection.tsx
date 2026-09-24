import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  Clock, 
  Send, 
  User, 
  Search, 
  Settings, 
  Power,
  Calendar,
  Globe,
  Bell,
  CheckCircle2,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  Zap,
  Trash2,
  X,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { ChatSessionData, ChatMessageData } from '../types';
import { DEFAULT_CHAT_CONFIG } from '../data/initialData';

export const LiveChatAdminSection: React.FC = () => {
  const { chatConfig: contextChatConfig, updateChatConfig, theme, showToast } = useApp();
  const chatConfig = contextChatConfig || DEFAULT_CHAT_CONFIG;
  const [sessions, setSessions] = useState<ChatSessionData[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSessionData | null>(null);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isLight = theme === 'light';

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeSession) {
      fetchMessages(activeSession.id);
      const interval = setInterval(() => fetchMessages(activeSession.id), 5000);
      return () => clearInterval(interval);
    }
  }, [activeSession]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/chat/sessions');
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions);
      }
    } catch (err) {
      console.error('Failed to fetch chat sessions:', err);
    }
  };

  const fetchMessages = async (sid: string) => {
    try {
      const res = await fetch(`/api/chat/messages/${sid}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Failed to fetch chat messages:', err);
    }
  };

  const handleSendReply = async () => {
    if (!activeSession || !replyText.trim()) return;

    const msgId = `msg-admin-${Date.now()}`;
    const newMsg: ChatMessageData = {
      id: msgId,
      sessionId: activeSession.id,
      sender: 'admin',
      text: replyText,
      created_at: new Date().toISOString()
    };

    // Optimistic update
    setMessages(prev => [...prev, newMsg]);
    setReplyText('');

    try {
      await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg)
      });
      fetchMessages(activeSession.id);
    } catch (err) {
      console.error('Failed to send admin reply:', err);
      showToast('Failed to send message', 'error');
    }
  };

  const updateSchedule = (dayIdx: number, updates: any) => {
    const newSchedule = [...chatConfig.businessHours.schedule];
    newSchedule[dayIdx] = { ...newSchedule[dayIdx], ...updates };
    updateChatConfig({
      businessHours: {
        ...chatConfig.businessHours,
        schedule: newSchedule
      }
    });
  };

  const filteredSessions = sessions.filter(s => 
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-black flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <MessageSquare className="w-7 h-7 text-indigo-500" />
            Live Support Center
          </h2>
          <p className="text-sm text-slate-500">Manage real-time conversations and chat settings.</p>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            showSettings 
              ? 'bg-indigo-600 text-white' 
              : isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {showSettings ? <MessageSquare className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
          {showSettings ? 'View Chats' : 'Chat Settings'}
        </button>
      </div>

      {showSettings ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Main Config */}
          <div className={`lg:col-span-1 p-6 rounded-3xl border shadow-sm ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
            <h3 className={`text-lg font-bold flex items-center gap-2 mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Power className="w-5 h-5 text-indigo-500" />
              Core Configuration
            </h3>
            
            <div className="space-y-6">
              <div className={`flex items-center justify-between p-4 rounded-2xl border ${
                isLight ? 'bg-indigo-50/50 border-indigo-100' : 'bg-indigo-500/5 border-indigo-500/10'
              }`}>
                <div>
                  <p className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Live Chat Status</p>
                  <p className="text-xs text-slate-500">{chatConfig.enabled ? 'Active on all pages' : 'Currently disabled'}</p>
                </div>
                <button
                  onClick={() => updateChatConfig({ enabled: !chatConfig.enabled })}
                  className={`w-12 h-6 rounded-full relative transition-colors ${chatConfig.enabled ? 'bg-emerald-500' : isLight ? 'bg-slate-300' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${chatConfig.enabled ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Welcome Message</label>
                <textarea
                  value={chatConfig.welcomeMessage}
                  onChange={(e) => updateChatConfig({ welcomeMessage: e.target.value })}
                  className={`w-full p-3 rounded-xl border text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-24 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Offline Auto-Reply</label>
                <textarea
                  value={chatConfig.offlineMessage}
                  onChange={(e) => updateChatConfig({ offlineMessage: e.target.value })}
                  className={`w-full p-3 rounded-xl border text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-24 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className={`lg:col-span-2 p-6 rounded-3xl border shadow-sm ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Clock className="w-5 h-5 text-indigo-500" />
                Business Hours & Automation
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Enable Schedule</span>
                <button
                  onClick={() => updateChatConfig({ businessHours: { ...chatConfig.businessHours, enabled: !chatConfig.businessHours.enabled } })}
                  className={`w-10 h-5 rounded-full relative transition-colors ${chatConfig.businessHours.enabled ? 'bg-indigo-500' : isLight ? 'bg-slate-300' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${chatConfig.businessHours.enabled ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chatConfig.businessHours.schedule.map((s, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border flex items-center justify-between ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${s.closed ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    <span className={`font-bold text-sm w-20 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{s.day}</span>
                  </div>
                  
                  {!s.closed ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="time" 
                        value={s.start}
                        onChange={(e) => updateSchedule(idx, { start: e.target.value })}
                        className={`bg-transparent text-xs font-medium focus:outline-none ${isLight ? 'text-slate-900' : 'text-white'}`}
                      />
                      <span className="text-slate-400">-</span>
                      <input 
                        type="time" 
                        value={s.end}
                        onChange={(e) => updateSchedule(idx, { end: e.target.value })}
                        className={`bg-transparent text-xs font-medium focus:outline-none ${isLight ? 'text-slate-900' : 'text-white'}`}
                      />
                      <button 
                        onClick={() => updateSchedule(idx, { closed: true })}
                        className="ml-2 text-rose-500 hover:bg-rose-500/10 p-1 rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => updateSchedule(idx, { closed: false })}
                      className="text-indigo-500 text-xs font-bold hover:underline"
                    >
                      Set Open Hours
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className={`mt-6 p-4 rounded-2xl border flex items-start gap-3 ${
              isLight ? 'bg-amber-50 border-amber-200' : 'bg-amber-500/5 border-amber-500/10'
            }`}>
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className={`text-xs leading-relaxed ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                When "Business Hours" is enabled, the chat widget will show an "Offline" status and send your custom auto-reply if a user messages outside of these times. This ensures 24/7 engagement even when you're sleeping.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 h-[700px] animate-fadeIn">
          {/* Conversations List */}
          <div className={`lg:w-1/3 flex flex-col rounded-3xl border overflow-hidden shadow-sm ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
            <div className={`p-4 border-b space-y-4 ${isLight ? 'border-slate-100' : 'border-slate-800/50'}`}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500'
                  }`}
                />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto scrollbar-thin">
              {filteredSessions.length === 0 ? (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <MessageSquare className="w-10 h-10 mx-auto opacity-20" />
                  <p className="text-sm">No conversations found.</p>
                </div>
              ) : (
                filteredSessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSession(s)}
                    className={`w-full p-4 flex items-start gap-4 border-b transition-colors text-left ${
                      activeSession?.id === s.id 
                        ? isLight ? 'bg-indigo-50/80 border-indigo-200' : 'bg-indigo-600/10 border-indigo-600/30'
                        : isLight ? 'border-slate-100 hover:bg-slate-50' : 'border-slate-800 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <User className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold text-sm truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{s.customer_name || 'Guest User'}</span>
                        <span className="text-[10px] text-slate-500">{new Date(s.last_message_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mb-1">{s.email || s.id}</p>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] text-slate-400">Online</span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Active Chat Area */}
          <div className={`lg:w-2/3 flex flex-col rounded-3xl border overflow-hidden shadow-sm ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
            {activeSession ? (
              <>
                {/* Chat Header */}
                <div className={`p-4 border-b flex items-center justify-between ${isLight ? 'border-slate-100' : 'border-slate-800/50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 font-black">
                      {activeSession.customer_name?.[0] || 'G'}
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{activeSession.customer_name || 'Guest User'}</h4>
                      <p className="text-xs text-slate-500">{activeSession.email || 'No email provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className={`p-2 rounded-lg transition-colors ${
                      isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
                    }`}>
                      <MoreVertical className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className={`flex-grow overflow-y-auto p-6 space-y-4 scrollbar-thin ${isLight ? 'bg-slate-50/50' : 'bg-transparent'}`}>
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl space-y-1 ${
                        m.sender === 'admin' 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : isLight ? 'bg-white border border-slate-200 text-slate-800 shadow-sm' : 'bg-slate-950 text-slate-200 border border-slate-800'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                        <span className="text-[10px] opacity-60 block text-right">
                          {new Date(m.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Input */}
                <div className={`p-4 border-t flex items-center gap-3 ${
                  isLight ? 'border-slate-100 bg-white' : 'border-slate-800/50 bg-slate-950/20'
                }`}>
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                    placeholder={`Reply to ${activeSession.customer_name || 'Guest'}...`}
                    className={`flex-grow px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-slate-900 border-slate-800 text-white placeholder:text-slate-500'
                    }`}
                  />
                  <button
                    onClick={handleSendReply}
                    className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-grow flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    isLight ? 'bg-slate-100' : 'bg-slate-800'
                  }`}>
                    <MessageCircle className="w-10 h-10 text-slate-400" />
                  </div>
                  <h4 className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Select a conversation to start chatting</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">Click on a session from the list on the left to view the message history and reply to the user.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
