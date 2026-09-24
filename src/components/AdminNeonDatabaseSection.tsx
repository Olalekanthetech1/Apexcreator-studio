import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  Zap,
  Lock,
  Copy,
  Check,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const AdminNeonDatabaseSection: React.FC = () => {
  const { dbStatus, refreshDbStatus, saveDatabaseUrl, showToast, orders, theme } = useApp();
  const isLight = theme === 'light';
  const [customUrl, setCustomUrl] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSample, setCopiedSample] = useState(false);

  const sampleConnectionTemplate = 'postgresql://neondb_owner:npg_password@ep-cool-snowflake-123456.us-east-2.aws.neon.tech/neondb?sslmode=require';

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) {
      showToast?.('Please enter a valid Neon PostgreSQL connection string.', 'error');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const res = await saveDatabaseUrl(customUrl.trim());
    setIsTesting(false);
    setTestResult(res);

    if (res.success) {
      showToast?.('Connected to Neon PostgreSQL successfully!', 'success');
      await refreshDbStatus();
    } else {
      showToast?.(`Connection failed: ${res.message}`, 'error');
    }
  };

  const handleRefresh = async () => {
    setIsTesting(true);
    await refreshDbStatus();
    setIsTesting(false);
    showToast?.('Database status refreshed.', 'info');
  };

  const copySample = () => {
    navigator.clipboard.writeText(sampleConnectionTemplate);
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Database className="w-3.5 h-3.5" />
              <span>Neon PostgreSQL Cloud Database</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Systematic & Dynamic Neon Integration</h2>
            <p className="text-sm text-slate-300 max-w-2xl">
              Real-time persistent PostgreSQL storage for client orders, payment transactions, centralized gateway configurations, and visitor session audit trails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isTesting}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all shadow-md ${
                isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
            <a
              href="https://console.neon.tech"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Neon Console</span>
            </a>
          </div>
        </div>
      </div>

      {/* Live Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Connection Health */}
        <div className={`p-5 rounded-2xl border transition-all ${
          dbStatus?.connected
            ? isLight ? 'bg-emerald-50 border-emerald-300 shadow-sm' : 'bg-emerald-950/20 border-emerald-500/30'
            : isLight ? 'bg-amber-50 border-amber-300 shadow-sm' : 'bg-amber-950/20 border-amber-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Connection Status</span>
            <div className={`w-3 h-3 rounded-full ${dbStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${dbStatus?.connected ? 'bg-emerald-500/20 text-emerald-600' : 'bg-amber-500/20 text-amber-600'}`}>
              {dbStatus?.connected ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            </div>
            <div>
              <div className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {dbStatus?.connected ? 'Neon PostgreSQL Connected' : (dbStatus?.databaseUrlConfigured ? 'Connecting / Retrying...' : 'Resilient Local Fallback Active')}
              </div>
              <div className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {dbStatus?.connected
                  ? 'Live scale-to-zero serverless database'
                  : (dbStatus?.error ? `Diagnostic: ${dbStatus.error}` : 'DATABASE_URL is ready to configure')}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Synced Orders */}
        <div className={`p-5 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Synced Orders</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-3">
            <div className={`text-3xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{dbStatus?.ordersCount ?? orders.length}</div>
            <div className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Client orders stored with full deliverable logs</div>
          </div>
        </div>

        {/* Card 3: Dynamic Tables & Schemas */}
        <div className={`p-5 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Managed Tables</span>
            <Server className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-3">
            <div className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>3 Auto-Migrated Tables:</div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${isLight ? 'bg-slate-100 text-cyan-700 border border-slate-200' : 'bg-slate-800 text-cyan-300'}`}>app_settings</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${isLight ? 'bg-slate-100 text-cyan-700 border border-slate-200' : 'bg-slate-800 text-cyan-300'}`}>client_orders</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${isLight ? 'bg-slate-100 text-cyan-700 border border-slate-200' : 'bg-slate-800 text-cyan-300'}`}>payment_webhook_logs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Database URL Configuration Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
        <div className="space-y-1">
          <h3 className={`text-lg font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <Lock className="w-4 h-4 text-cyan-500" />
            <span>Dynamic Neon Connection String Setup</span>
          </h3>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Paste your Neon connection string below or supply <code className={`${isLight ? 'text-cyan-700 bg-cyan-50 px-1 py-0.5 rounded' : 'text-cyan-300'} font-mono`}>DATABASE_URL</code> in environment variables.
          </p>
        </div>

        <form onSubmit={handleTestAndSave} className="space-y-4">
          <div className="space-y-2">
            <label className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Neon Connection URI (PostgreSQL):</label>
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="postgresql://user:password@ep-cool-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"
              className={`w-full px-4 py-3 rounded-xl text-sm font-mono transition-colors focus:outline-none focus:border-cyan-500 ${
                isLight 
                  ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400' 
                  : 'bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600'
              }`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
              * Supports automatic SSL encryption, pooling, and instant dynamic reconnect.
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isTesting}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Connecting & Verifying Schemas...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Connect & Verify Neon Database</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {testResult && (
          <div className={`p-4 rounded-xl text-xs flex items-start gap-3 border ${
            testResult.success
              ? isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              : isLight ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
          }`}>
            {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            <div>
              <div className="font-bold">{testResult.success ? 'Success' : 'Connection Error'}</div>
              <div>{testResult.message}</div>
            </div>
          </div>
        )}
      </div>

      {/* How it works & Architecture Guide */}
      <div className={`p-6 rounded-3xl border space-y-4 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-slate-800'}`}>
        <h4 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          <Sparkles className="w-4 h-4 text-cyan-500" />
          <span>How Systematic Neon Storage Works</span>
        </h4>
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          <div className={`p-4 rounded-2xl border space-y-1.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
            <div className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>1. Instant Schema Bootstrap</div>
            <p>On connection, the server automatically issues <code className={`${isLight ? 'text-cyan-700 bg-cyan-50 px-1 rounded' : 'text-cyan-300'} font-mono`}>CREATE TABLE IF NOT EXISTS</code> for tables, indexes, and JSONB payloads.</p>
          </div>
          <div className={`p-4 rounded-2xl border space-y-1.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
            <div className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>2. Centralized Gateway Sync</div>
            <p>Admin settings (Paystack public keys, FX rates, Bybit crypto wallet addresses) are dynamically synced to the database so all visitors receive live data.</p>
          </div>
          <div className={`p-4 rounded-2xl border space-y-1.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
            <div className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>3. Zero-Downtime Resilience</div>
            <p>If the database URL is ever missing or disconnected, the system seamlessly uses local fallback storage so users never experience disruption.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
