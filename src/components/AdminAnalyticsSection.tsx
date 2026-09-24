import React, { useState, useEffect } from 'react';
import { AnalyticsStats, VisitorSession, VisitorLead } from '../types';
import { fetchAnalyticsStats, clearAnalyticsData } from '../utils/analyticsTracker';
import { useApp } from '../context/AppContext';
import {
  Activity,
  Users,
  Clock,
  UserCheck,
  TrendingUp,
  Globe,
  Smartphone,
  Laptop,
  Tablet,
  RefreshCw,
  Download,
  Trash2,
  Search,
  MessageCircle,
  Mail,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Radio,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface AdminAnalyticsSectionProps {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminAnalyticsSection: React.FC<AdminAnalyticsSectionProps> = ({ showToast }) => {
  const { theme } = useApp();
  const isLight = theme === 'light';
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [subTab, setSubTab] = useState<'live-stream' | 'leads' | 'countries' | 'sources'>('live-stream');
  
  // Leads Filter & Search
  const [leadSearch, setLeadSearch] = useState('');
  const [leadTypeFilter, setLeadTypeFilter] = useState<'all' | 'whatsapp' | 'email'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Visitors Filter & Search
  const [visitorSearch, setVisitorSearch] = useState('');
  const [visitorFilter, setVisitorFilter] = useState<'all' | 'online' | 'with-lead'>('all');

  const loadStats = async (isManual = false) => {
    if (isManual) setLoading(true);
    const data = await fetchAnalyticsStats();
    if (data) {
      setStats(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(() => {
      if (autoRefresh) {
        loadStats();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all analytics and captured leads data? This cannot be undone.')) {
      const ok = await clearAnalyticsData();
      if (ok) {
        showToast('Analytics data cleared successfully.', 'success');
        loadStats(true);
      } else {
        showToast('Failed to clear data.', 'error');
      }
    }
  };

  const formatDuration = (seconds: number = 0) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatRelativeTime = (timestamp: number) => {
    const diff = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
    if (diff < 15) return 'Active now';
    if (diff < 60) return `${diff}s ago`;
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ago`;
  };

  // Filtered Leads
  const filteredLeads = (stats?.allLeads || []).filter((lead) => {
    if (leadTypeFilter === 'whatsapp' && !lead.phone && !lead.whatsappNumber) return false;
    if (leadTypeFilter === 'email' && !lead.email) return false;
    if (!leadSearch) return true;
    const q = leadSearch.toLowerCase();
    return (
      (lead.name && lead.name.toLowerCase().includes(q)) ||
      (lead.email && lead.email.toLowerCase().includes(q)) ||
      (lead.phone && lead.phone.toLowerCase().includes(q)) ||
      (lead.country && lead.country.toLowerCase().includes(q)) ||
      (lead.source && lead.source.toLowerCase().includes(q))
    );
  });

  // Filtered Visitors
  const filteredVisitors = (stats?.recentVisitors || []).filter((visitor) => {
    if (visitorFilter === 'online' && !visitor.isOnline) return false;
    if (visitorFilter === 'with-lead' && !visitor.lead?.email && !visitor.lead?.phone) return false;
    if (!visitorSearch) return true;
    const q = visitorSearch.toLowerCase();
    return (
      visitor.sessionId.toLowerCase().includes(q) ||
      visitor.country.toLowerCase().includes(q) ||
      visitor.city.toLowerCase().includes(q) ||
      visitor.ip.toLowerCase().includes(q) ||
      visitor.currentPage.toLowerCase().includes(q) ||
      visitor.referrer.toLowerCase().includes(q) ||
      (visitor.lead?.email && visitor.lead.email.toLowerCase().includes(q)) ||
      (visitor.lead?.phone && visitor.lead.phone.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Controls & Status Bar */}
      <div className={`p-5 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-base sm:text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Live Visitor & Lead Generation Hub</h2>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Dynamic Sync
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Real-time telemetry tracking visitor country, duration, device, and captured contact leads.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              autoRefresh
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-500'
                : isLight ? 'bg-slate-100 border border-slate-300 text-slate-600' : 'bg-slate-950 border border-slate-800 text-slate-400'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-pulse text-emerald-500' : ''}`} />
            <span>Auto-Refresh: {autoRefresh ? 'ON (4s)' : 'OFF'}</span>
          </button>

          <button
            onClick={() => loadStats(true)}
            disabled={loading}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
              isLight 
                ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' 
                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-500' : ''}`} />
            <span>Refresh</span>
          </button>

          <a
            href="/api/analytics/export-csv"
            download
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-lg shadow-blue-500/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Leads CSV</span>
          </a>

          <button
            onClick={handleClearData}
            className="p-2 rounded-xl text-xs font-bold text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
            title="Clear all stored analytics"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Live Active Now */}
        <div className={`p-4 sm:p-5 rounded-2xl border space-y-1 relative overflow-hidden ${
          isLight ? 'bg-emerald-50/60 border-emerald-200' : 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-500 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Online Right Now
            </span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className={`text-2xl sm:text-3xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{stats?.liveActiveNow || 0}</div>
          <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Active in last 60s</span>
        </div>

        {/* Total Sessions */}
        <div className={`p-4 sm:p-5 rounded-2xl border space-y-1 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total Visitors</span>
            <Globe className="w-4 h-4 text-indigo-500" />
          </div>
          <div className={`text-2xl sm:text-3xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{stats?.totalSessions || 0}</div>
          <span className={`text-[10px] block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Lifetime sessions</span>
        </div>

        {/* Avg Duration */}
        <div className={`p-4 sm:p-5 rounded-2xl border space-y-1 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Avg Time on Site</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500">
            {formatDuration(stats?.avgDurationSeconds || 0)}
          </div>
          <span className={`text-[10px] block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Active engagement</span>
        </div>

        {/* Total Leads Captured */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-indigo-300 font-bold">Captured Leads</span>
            <UserCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-300">{stats?.totalLeads || 0}</div>
          <span className="text-[10px] text-slate-400 block">Phone / WhatsApp / Email</span>
        </div>

        {/* Lead Conversion Rate */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Lead Capture Rate</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal-400">{stats?.conversionRate || 0}%</div>
          <span className="text-[10px] text-slate-500 block">Visitors to contacts</span>
        </div>
      </div>

      {/* Analytics Sub-Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setSubTab('live-stream')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            subTab === 'live-stream'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Live Visitor Stream ({stats?.recentVisitors?.length || 0})</span>
        </button>

        <button
          onClick={() => setSubTab('leads')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            subTab === 'leads'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>Captured Leads Hub ({stats?.allLeads?.length || 0})</span>
          {stats?.allLeads && stats.allLeads.length > 0 && (
            <span className="px-1.5 py-0.2 bg-emerald-400 text-slate-950 font-black rounded-full text-[10px]">
              {stats.allLeads.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('countries')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            subTab === 'countries'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4 text-blue-400" />
          <span>Countries & Geography ({stats?.countries?.length || 0})</span>
        </button>

        <button
          onClick={() => setSubTab('sources')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            subTab === 'sources'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4 text-amber-400" />
          <span>Devices & Traffic Sources</span>
        </button>
      </div>

      {/* ========================================== */}
      {/* SUB-TAB 1: LIVE VISITOR STREAM */}
      {/* ========================================== */}
      {subTab === 'live-stream' && (
        <div className="space-y-4">
          {/* Visitor Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={visitorSearch}
                onChange={(e) => setVisitorSearch(e.target.value)}
                placeholder="Search by IP, Country, City, Page, or Contact..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setVisitorFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  visitorFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                All ({stats?.recentVisitors?.length || 0})
              </button>
              <button
                onClick={() => setVisitorFilter('online')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  visitorFilter === 'online' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Online ({stats?.liveActiveNow || 0})</span>
              </button>
              <button
                onClick={() => setVisitorFilter('with-lead')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  visitorFilter === 'with-lead' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Has Contact Info
              </button>
            </div>
          </div>

          {/* Visitors Stream Table */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Status & Visitor</th>
                    <th className="py-3.5 px-4">Country / Location</th>
                    <th className="py-3.5 px-4">Time on Site</th>
                    <th className="py-3.5 px-4">Current Page</th>
                    <th className="py-3.5 px-4">Device & OS</th>
                    <th className="py-3.5 px-4">Captured Details & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredVisitors.length > 0 ? (
                    filteredVisitors.map((v) => {
                      const cleanPhone = v.lead?.phone ? v.lead.phone.replace(/[^0-9]/g, '') : '';
                      const whatsappUrl = cleanPhone
                        ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${v.lead?.name || ''}, thank you for visiting ApexCreator Studio!`)}`
                        : null;
                      const mailtoUrl = v.lead?.email ? `mailto:${v.lead.email}` : null;

                      return (
                        <tr key={v.sessionId} className={`hover:bg-slate-800/30 transition-colors ${v.isOnline ? 'bg-emerald-950/10' : ''}`}>
                          {/* Status & Session ID */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              {v.isOnline ? (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                  Active Now
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-500">
                                  {formatRelativeTime(v.lastSeen)}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                              <span>{v.sessionId.slice(0, 10)}...</span>
                              <button
                                onClick={() => handleCopy(v.sessionId, v.sessionId)}
                                className="text-slate-500 hover:text-white"
                                title="Copy session ID"
                              >
                                {copiedId === v.sessionId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </td>

                          {/* Country / Location */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{v.flag || '🌐'}</span>
                              <div>
                                <div className="font-bold text-white flex items-center gap-1">
                                  <span>{v.country || 'Unknown'}</span>
                                  {v.countryCode && (
                                    <span className="text-[10px] text-slate-400 font-mono">({v.countryCode})</span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-500" />
                                  <span>{v.city || 'Direct IP'}</span>
                                  {v.ip && <span className="text-slate-600 font-mono">({v.ip})</span>}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Time on Site */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 font-bold text-amber-300">
                              <Clock className="w-3.5 h-3.5 text-amber-400" />
                              <span>{formatDuration(v.durationSeconds)}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 block">
                              First seen {new Date(v.firstSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>

                          {/* Current Page */}
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-indigo-300">
                              {v.currentPage || '/'}
                            </span>
                            <div className="text-[10px] text-slate-500 mt-1 truncate max-w-[140px]" title={v.referrer}>
                              Ref: {v.referrer || 'Direct'}
                            </div>
                          </td>

                          {/* Device & OS */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 font-medium text-slate-200">
                              {v.device === 'Mobile' ? (
                                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                              ) : v.device === 'Tablet' ? (
                                <Tablet className="w-3.5 h-3.5 text-teal-400" />
                              ) : (
                                <Laptop className="w-3.5 h-3.5 text-blue-400" />
                              )}
                              <span>{v.device}</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {v.os} • {v.browser}
                            </div>
                          </td>

                          {/* Captured Details & Actions */}
                          <td className="py-3.5 px-4">
                            {v.lead && (v.lead.email || v.lead.phone) ? (
                              <div className="space-y-1.5">
                                {v.lead.name && (
                                  <div className="font-bold text-white text-xs">{v.lead.name}</div>
                                )}
                                {v.lead.phone && (
                                  <div className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                                    <MessageCircle className="w-3 h-3" />
                                    <span>{v.lead.phone}</span>
                                  </div>
                                )}
                                {v.lead.email && (
                                  <div className="text-blue-300 text-[11px] flex items-center gap-1 truncate max-w-[180px]">
                                    <Mail className="w-3 h-3" />
                                    <span>{v.lead.email}</span>
                                  </div>
                                )}

                                <div className="flex items-center gap-1.5 pt-1">
                                  {whatsappUrl && (
                                    <a
                                      href={whatsappUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow-sm transition-all"
                                      title="Open WhatsApp Chat"
                                    >
                                      <MessageCircle className="w-3 h-3" />
                                      <span>WhatsApp</span>
                                    </a>
                                  )}
                                  {mailtoUrl && (
                                    <a
                                      href={mailtoUrl}
                                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 shadow-sm transition-all"
                                      title="Send Email"
                                    >
                                      <Mail className="w-3 h-3" />
                                      <span>Email</span>
                                    </a>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-500 italic">Browsing anonymously</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-500">
                        {loading ? 'Fetching live visitor stream...' : 'No visitor records match your filter.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-TAB 2: CAPTURED LEADS HUB */}
      {/* ========================================== */}
      {subTab === 'leads' && (
        <div className="space-y-4">
          {/* Leads Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                placeholder="Search leads by Name, Email, Phone, Country, Campaign..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLeadTypeFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  leadTypeFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                All ({stats?.allLeads?.length || 0})
              </button>
              <button
                onClick={() => setLeadTypeFilter('whatsapp')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  leadTypeFilter === 'whatsapp' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-emerald-400 hover:text-emerald-300'
                }`}
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp Ready</span>
              </button>
              <button
                onClick={() => setLeadTypeFilter('email')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  leadTypeFilter === 'email' ? 'bg-blue-600 text-white' : 'bg-slate-950 text-blue-400 hover:text-blue-300'
                }`}
              >
                <Mail className="w-3 h-3" />
                <span>Email Ready</span>
              </button>
            </div>
          </div>

          {/* Leads Grid Cards */}
          {filteredLeads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLeads.map((lead) => {
                const cleanPhone = lead.phone ? lead.phone.replace(/[^0-9]/g, '') : '';
                const whatsappUrl = cleanPhone
                  ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${lead.name || ''}, thanks for checking out ApexCreator Studio! Let's discuss your project.`)}`
                  : null;
                const mailtoUrl = lead.email ? `mailto:${lead.email}?subject=Your%20Project%20Inquiry%20-%20ApexCreator%20Studio` : null;

                return (
                  <div key={lead.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-xl">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{lead.flag || '🌐'}</span>
                        <div>
                          <h4 className="text-sm font-black text-white">{lead.name || 'Anonymous Visitor'}</h4>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <span>{lead.country || 'Global'}</span>
                            {lead.city && <span>• {lead.city}</span>}
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                        {lead.source || 'Ad Lead'}
                      </span>
                    </div>

                    <div className="space-y-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs">
                      {lead.phone && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> Phone:
                          </span>
                          <span className="font-mono font-bold text-emerald-400">{lead.phone}</span>
                        </div>
                      )}

                      {lead.email && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-blue-400" /> Email:
                          </span>
                          <span className="font-mono text-blue-300 truncate max-w-[180px]">{lead.email}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Time on site:
                        </span>
                        <span>{formatDuration(lead.durationBeforeCapture || 0)}</span>
                      </div>

                      {lead.notes && (
                        <div className="text-[11px] text-slate-400 italic bg-slate-900 p-2 rounded-lg border border-slate-800">
                          {lead.notes}
                        </div>
                      )}
                    </div>

                    {/* Direct Contact Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {whatsappUrl ? (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>WhatsApp Text</span>
                        </a>
                      ) : (
                        <button
                          disabled
                          className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-500 bg-slate-950 border border-slate-800 flex items-center justify-center gap-1.5 opacity-50 cursor-not-allowed"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>No Phone</span>
                        </button>
                      )}

                      {mailtoUrl ? (
                        <a
                          href={mailtoUrl}
                          className="py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Send Email</span>
                        </a>
                      ) : (
                        <button
                          disabled
                          className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-500 bg-slate-950 border border-slate-800 flex items-center justify-center gap-1.5 opacity-50 cursor-not-allowed"
                        >
                          <Mail className="w-4 h-4" />
                          <span>No Email</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No Captured Leads Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                As visitors browse from your ads, fill out forms, or enter contact details in the VIP Strategy Modal, their contact cards will instantly appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-TAB 3: GEOGRAPHIC COUNTRIES */}
      {/* ========================================== */}
      {subTab === 'countries' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Visitor Traffic by Country</h3>
                <p className="text-xs text-slate-400">Aggregated breakdown of global reach and audience origin.</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {stats?.countries?.length || 0} Countries Detected
              </span>
            </div>

            {stats?.countries && stats.countries.length > 0 ? (
              <div className="space-y-3 pt-2">
                {stats.countries.map((c) => (
                  <div key={c.countryCode} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold text-white">
                        <span className="text-base">{c.flag || '🌐'}</span>
                        <span>{c.country}</span>
                        <span className="text-slate-500 text-[10px] font-mono">({c.countryCode})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-slate-300">{c.count} visitors</span>
                        <span className="font-mono text-indigo-400 text-xs w-10 text-right">{c.percentage}%</span>
                      </div>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-all duration-500"
                        style={{ width: `${Math.max(4, c.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                No country data recorded yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-TAB 4: DEVICES & TRAFFIC SOURCES */}
      {/* ========================================== */}
      {subTab === 'sources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Device Distribution */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Device Breakdown</h3>
              <Smartphone className="w-5 h-5 text-indigo-400" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <Laptop className="w-5 h-5 text-blue-400 mx-auto" />
                <div className="text-lg font-black text-white">{stats?.devices?.desktop || 0}</div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Desktop</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <Smartphone className="w-5 h-5 text-emerald-400 mx-auto" />
                <div className="text-lg font-black text-white">{stats?.devices?.mobile || 0}</div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Mobile</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <Tablet className="w-5 h-5 text-teal-400 mx-auto" />
                <div className="text-lg font-black text-white">{stats?.devices?.tablet || 0}</div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Tablet</span>
              </div>
            </div>
          </div>

          {/* Ad Campaign URL Helper */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Ad & Campaign URL Builder</h3>
              <Zap className="w-5 h-5 text-amber-400" />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Use URL parameters in your Facebook Ads, TikTok Ads, or Google Ads to automatically capture leads the second they click:
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 select-all break-all">
              https://yourdomain.com/?utm_source=facebook_ads&utm_campaign=growth_promo
            </div>

            <div className="text-[11px] text-slate-400 space-y-1">
              <p>💡 <span className="text-slate-300 font-bold">Auto-Capture Tip:</span> If sending to an existing email list, add <code className="text-indigo-400">&email=user@email.com&phone=+123...</code> to automatically register their contact profile upon landing!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
