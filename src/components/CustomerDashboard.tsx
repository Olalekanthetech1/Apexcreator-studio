import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import {
  Search,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Send,
  MessageSquare,
  Globe,
  FileText,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Bot,
  Mic,
  ShieldCheck,
  Pin
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const {
    theme,
    orders,
    activeCustomerEmail,
    setCustomerEmail,
    addOrderMessage,
    setView,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState(activeCustomerEmail || '');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [isRecordingVoiceNote, setIsRecordingVoiceNote] = useState(false);

  const isLight = theme === 'light';

  // Filter orders matching search query (by email or order ID)
  const matchedOrders = orders.filter((ord) => {
    if (!searchQuery) return true;
    const q = searchQuery.trim().toLowerCase();
    return (
      ord.email.toLowerCase().includes(q) ||
      ord.id.toLowerCase().includes(q) ||
      ord.customerName.toLowerCase().includes(q)
    );
  });

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || matchedOrders[0] || null;

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !newMessageText.trim()) return;

    addOrderMessage(selectedOrder.id, newMessageText.trim(), 'customer');
    setNewMessageText('');
  };

  const handleToggleVoiceNote = () => {
    setIsRecordingVoiceNote(!isRecordingVoiceNote);
    if (!isRecordingVoiceNote) {
      showToast('Voice recording active. Speak your revision notes...', 'info');
    } else {
      showToast('Voice note attached to project revision log.', 'success');
      if (selectedOrder) {
        addOrderMessage(selectedOrder.id, '[Voice Recording Attached] Customer provided 0:24 audio revision note.', 'customer');
      }
    }
  };

  // Helper for progress bar
  const getProgressPercentage = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 15;
      case 'Payment Confirmed': return 35;
      case 'In Progress': return 65;
      case 'Revision': return 75;
      case 'Delivered': return 90;
      case 'Completed': return 100;
      default: return 20;
    }
  };

  return (
    <div className={`py-12 lg:py-20 min-h-[85vh] transition-colors duration-300 ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Dashboard Header */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-xs font-semibold text-indigo-600 border border-indigo-500/20 mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Customer Order Portal</span>
            </div>
            <h1 className={`text-3xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              My Orders & Project Deliverables
            </h1>
            <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Track real-time progress, download assets, and communicate with ApexCreator Studio Support.
            </p>
          </div>

          {/* Email/ID Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCustomerEmail(e.target.value);
              }}
              placeholder="Search by Email or Order ID..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isLight
                  ? 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-white placeholder-slate-500'
              }`}
            />
          </div>
        </div>

        {matchedOrders.length === 0 ? (
          <div className={`p-12 rounded-3xl border text-center space-y-4 max-w-xl mx-auto ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
          }`}>
            <ShoppingBag className={`w-12 h-12 mx-auto ${isLight ? 'text-slate-400' : 'text-slate-600'}`} />
            <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>No Orders Found</h3>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              We couldn't find any orders for "{searchQuery}". Try typing your exact Order ID (e.g. DEN-2026-00001) or email address.
            </p>
            <button
              onClick={() => setView('services')}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
            >
              Browse Services & Order Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Orders List Sidebar */}
            <div className="lg:col-span-4 space-y-3">
              <h2 className={`text-xs uppercase font-extrabold tracking-wider px-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Your Order History ({matchedOrders.length})
              </h2>

              <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                {matchedOrders.map((ord) => {
                  const isSelected = selectedOrder?.id === ord.id;
                  return (
                    <button
                      key={ord.id}
                      onClick={() => setSelectedOrderId(ord.id)}
                      className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between gap-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isSelected
                          ? isLight
                            ? 'bg-indigo-50 border-indigo-500 shadow-md'
                            : 'bg-indigo-600/15 border-indigo-500 shadow-lg shadow-indigo-500/10'
                          : isLight
                          ? 'bg-white border-slate-200 hover:border-slate-300'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-indigo-600">{ord.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              ord.status === 'Completed' || ord.status === 'Delivered'
                                ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/40'
                                : ord.status === 'In Progress'
                                ? 'bg-indigo-500/20 text-indigo-600 border border-indigo-500/40'
                                : 'bg-amber-500/20 text-amber-600 border border-amber-500/40'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                        <div className={`text-sm font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {ord.serviceTitle}
                        </div>
                        <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          Package: <span className="text-indigo-600 font-bold uppercase">{ord.packageType}</span> • ${ord.price}
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Order Detail View */}
            {selectedOrder && (
              <div className="lg:col-span-8 space-y-6">
                
                {/* Status & Progress Header Card */}
                <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 shadow-xl ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                }`}>
                  
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${
                    isLight ? 'border-slate-200' : 'border-slate-800'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-indigo-600">{selectedOrder.id}</span>
                        <button
                          onClick={() => handleCopyOrderId(selectedOrder.id)}
                          className={`p-1 rounded transition-colors ${
                            isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                          }`}
                          title="Copy Order ID"
                        >
                          {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <h2 className={`text-2xl font-black mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {selectedOrder.serviceTitle}
                      </h2>
                      <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Category: {selectedOrder.category}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className={`text-xs font-semibold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Total Package Amount
                      </span>
                      {/* Cyan Highlight for Currency */}
                      <span className="text-3xl font-black text-cyan-500 block">
                        ${selectedOrder.price} USD
                      </span>
                      {selectedOrder.isNegotiatedPrice && (
                        <span className="inline-block text-[10px] text-emerald-400 font-extrabold uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 my-1">
                          Custom Negotiated Price
                        </span>
                      )}
                      {/* Verified Escrow Green Badge */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 border border-emerald-500/40 text-[11px] font-bold mt-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        Escrow Verified: {selectedOrder.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Progress Stage Tracker */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <Clock className="w-4 h-4 text-indigo-600" />
                        Current Order Progress: <strong className="text-indigo-600">{selectedOrder.status}</strong>
                      </span>
                      <span className={`font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Exp. Delivery: {selectedOrder.expectedDeliveryDate}
                      </span>
                    </div>

                    {/* Completion Progress Bar with Cyan Accent */}
                    <div className={`w-full h-3 rounded-full overflow-hidden p-0.5 border ${
                      isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
                    }`}>
                      <div
                        className="h-full bg-gradient-to-r from-indigo-600 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${getProgressPercentage(selectedOrder.status)}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-4 text-[10px] text-slate-500 font-semibold text-center pt-1">
                      <span>Pending</span>
                      <span>Escrow Confirmed</span>
                      <span>In Progress</span>
                      <span>Delivered</span>
                    </div>
                  </div>

                  {/* Order Spec Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                    <div className={`p-4 rounded-2xl border space-y-1 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                    }`}>
                      <span className={`font-medium block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Channel / Social URL
                      </span>
                      <a
                        href={selectedOrder.socialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 font-semibold hover:underline flex items-center gap-1 truncate"
                      >
                        <Globe className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{selectedOrder.socialUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>

                    <div className={`p-4 rounded-2xl border space-y-1 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                    }`}>
                      <span className={`font-medium block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Package Tier
                      </span>
                      <span className="text-indigo-600 font-extrabold uppercase text-sm block">
                        {selectedOrder.packageType} Tier
                      </span>
                    </div>
                  </div>

                  {/* Project Description */}
                  <div className={`p-4 rounded-2xl border space-y-1.5 text-xs ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    <span className="font-bold uppercase tracking-wider block flex items-center gap-1 text-indigo-600">
                      <FileText className="w-3.5 h-3.5" />
                      Project Scope & Design Requirements
                    </span>
                    <p className={`leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                      {selectedOrder.projectDescription}
                    </p>
                  </div>

                </div>

                {/* Deep Purple AI Assistant & Proposal Theme Container */}
                <div className="p-6 sm:p-8 rounded-3xl bg-purple-950/90 border border-purple-500/40 space-y-4 shadow-xl text-purple-100">
                  <div className="flex items-center justify-between border-b border-purple-500/30 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                          AI Growth Proposal & Creative Recommendations
                        </h3>
                        <p className="text-xs text-purple-300">Automated ApexCreator AI Assistant analysis for {selectedOrder.serviceTitle}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      AI Studio Active
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-900/40 border border-purple-500/30 text-xs space-y-2.5 leading-relaxed">
                    <div className="flex items-center gap-2 text-purple-300 font-bold">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Suggested Creator Roadmap for Maximum Retention:</span>
                    </div>
                    <ul className="space-y-1.5 text-purple-100 pl-5 list-disc">
                      <li>Use high-contrast thumbnail framing with saturated cyan/gold overlays to boost CTR by ~18-24%.</li>
                      <li>Implement strict 3-second hook structures with custom animated motion graphics.</li>
                      <li>Optimize video descriptions with high-volume SEO keywords for YouTube & Twitch recommendation algorithms.</li>
                    </ul>
                  </div>
                </div>

                {/* Deliverables Section */}
                <div className={`p-6 sm:p-8 rounded-3xl border space-y-4 shadow-xl ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                }`}>
                  <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                    <h3 className={`text-lg font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      <Download className="w-5 h-5 text-emerald-500" />
                      Project Deliverables & Download Assets
                    </h3>
                    <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {selectedOrder.deliverables?.length || 0} File(s)
                    </span>
                  </div>

                  {(!selectedOrder.deliverables || selectedOrder.deliverables.length === 0) ? (
                    <div className={`p-6 rounded-2xl border text-center space-y-1 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                    }`}>
                      <Clock className="w-6 h-6 text-slate-400 mx-auto" />
                      <p className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                        No deliverables uploaded yet.
                      </p>
                      <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                        Our agency team is actively working on your order. Finished assets will appear here upon completion.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedOrder.deliverables.map((deliv) => (
                        <div
                          key={deliv.id}
                          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                            isLight
                              ? 'bg-emerald-50/50 border-emerald-300'
                              : 'bg-slate-950 border-emerald-500/30'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                              {deliv.title}
                            </div>
                            <div className={`text-xs flex items-center gap-3 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                              <span>Size: {deliv.fileSize}</span>
                              <span>Uploaded: {deliv.uploadedAt}</span>
                            </div>
                            {deliv.note && (
                              <p className="text-xs text-emerald-600 font-medium italic">"{deliv.note}"</p>
                            )}
                          </div>

                          <a
                            href={deliv.downloadUrl}
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Communication Workspace & Revision Voice Recording */}
                <div className={`p-6 sm:p-8 rounded-3xl border space-y-4 shadow-xl ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                }`}>
                  <div className={`flex flex-wrap items-center justify-between gap-2 border-b pb-3 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                    <h3 className={`text-lg font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      <MessageSquare className="w-5 h-5 text-indigo-600" />
                      Direct Support & Revision Chat
                    </h3>

                    {/* Rose Red Active Voice Recording / Pinned Revision Flags */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleToggleVoiceNote}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 focus:outline-none ${
                          isRecordingVoiceNote
                            ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30'
                            : 'bg-rose-500/10 text-rose-600 border border-rose-500/30 hover:bg-rose-500/20'
                        }`}
                        title="Record voice note for design revision"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>{isRecordingVoiceNote ? 'Recording Voice...' : 'Record Voice Note'}</span>
                      </button>

                      <span className="px-2.5 py-1 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-[11px] font-bold flex items-center gap-1">
                        <Pin className="w-3 h-3" />
                        <span>Pinned Revisions</span>
                      </span>
                    </div>
                  </div>

                  {/* Message History */}
                  <div className={`p-4 rounded-2xl border max-h-60 overflow-y-auto space-y-3 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    {(selectedOrder.messages || []).map((msg) => {
                      const isCustomer = msg.sender === 'customer';
                      return (
                        <div
                          key={msg.id}
                          className={`p-3.5 rounded-2xl text-xs space-y-1 max-w-[85%] ${
                            isCustomer
                              ? 'ml-auto bg-indigo-600/15 border border-indigo-500/30 text-indigo-950 font-medium'
                              : isLight
                              ? 'mr-auto bg-white border border-slate-300 text-slate-800 shadow-sm'
                              : 'mr-auto bg-slate-900 border border-slate-800 text-slate-200'
                          }`}
                        >
                          <div className={`flex items-center justify-between text-[10px] font-semibold ${
                            isLight ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            <span>{msg.senderName}</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <p className="leading-relaxed">{msg.text}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Message Input Form */}
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      placeholder="Type a message or request a revision..."
                      className={`flex-1 px-4 py-3 rounded-xl text-xs transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isLight
                          ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400'
                          : 'bg-slate-950 border border-slate-800 text-white placeholder-slate-500'
                      }`}
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
