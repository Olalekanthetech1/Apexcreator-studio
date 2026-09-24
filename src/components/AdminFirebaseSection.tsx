import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Database,
  Lock,
  Layers,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';
import { db, firebaseConfig, isFirebaseConfigured } from '../services/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const AdminFirebaseSection: React.FC = () => {
  const { orders, showToast, theme } = useApp();
  const isLight = theme === 'light';
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedRules, setCopiedRules] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);

  const previewDomain = typeof window !== 'undefined' ? window.location.hostname : 'ais-dev-q32nhunlg5p2u57nv34xww-93781823438.europe-west2.run.app';

  const firestoreRulesText = `rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Global Test Probes (Admin Connection Healthcheck)
    match /system_probes/{probeId} {
      allow read, write: if true;
    }

    // Orders Collection
    match /orders/{orderId} {
      allow read, create, update: if true;
    }

    // Live Chat Sessions & Subcollections
    match /chat_sessions/{sessionId} {
      allow read, write: if true;

      match /messages/{messageId} {
        allow read, write: if true;
      }
    }

    // Leads & VIP Growth Playbook Downloads
    match /leads/{leadId} {
      allow create, read, update, delete: if true;
    }

    // Catalog Content & Settings
    match /services/{serviceId} {
      allow read, write: if true;
    }

    match /settings/{settingId} {
      allow read, write: if true;
    }
  }
}`;

  const handleTestConnection = async () => {
    if (!db) {
      setTestResult({
        success: false,
        message: 'Firestore instance is not initialized. Please verify configuration.'
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const probeId = `probe-${Date.now()}`;
      const probeRef = doc(db, 'system_probes', probeId);
      await setDoc(probeRef, {
        timestamp: new Date().toISOString(),
        testedBy: 'ApexCreator Studio Admin',
        projectId: firebaseConfig.projectId
      });

      const snap = await getDoc(probeRef);
      if (snap.exists()) {
        setTestResult({
          success: true,
          message: `Firestore read/write test successful! Connected to project "${firebaseConfig.projectId}".`
        });
        showToast('Firestore connected & responding normally!', 'success');
      } else {
        setTestResult({
          success: false,
          message: 'Document was written but could not be read back.'
        });
      }
    } catch (err: any) {
      console.error('Firebase test error:', err);
      const isPermissionDenied = err?.code === 'permission-denied';
      setTestResult({
        success: false,
        message: isPermissionDenied
          ? 'Firestore returned permission-denied. Please copy and paste the Firestore Rules below into your Firebase Console.'
          : (err.message || 'Unable to communicate with Firestore.')
      });
      showToast(isPermissionDenied ? 'Permission denied: Please update Firestore Rules' : 'Firebase test failed', 'error');
    } finally {
      setTesting(false);
    }
  };

  const copyRules = () => {
    navigator.clipboard.writeText(firestoreRulesText);
    setCopiedRules(true);
    showToast('Firestore security rules copied to clipboard!', 'success');
    setTimeout(() => setCopiedRules(false), 2500);
  };

  const copyDomain = (domain: string) => {
    navigator.clipboard.writeText(domain);
    setCopiedDomain(domain);
    showToast(`Domain copied: ${domain}`, 'success');
    setTimeout(() => setCopiedDomain(null), 2000);
  };

  const isConfigured = isFirebaseConfigured();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>Firebase Cloud Firestore & Auth</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Firebase Integration Suite</h2>
            <p className="text-sm text-slate-400 max-w-2xl">
              Real-time persistent database syncing orders, client messages, support chat threads, and captured leads across all client screens simultaneously.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing Firestore...' : 'Test Connection'}</span>
            </button>

            <a
              href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700"
            >
              <span>Firebase Console</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Test Status Banner */}
      {testResult && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
            testResult.success
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}
        >
          {testResult.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1 text-xs">
            <p className="font-bold">{testResult.success ? 'Connection Validated' : 'Connection Alert'}</p>
            <p className="text-slate-300">{testResult.message}</p>
          </div>
        </div>
      )}

      {/* Configuration & Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Project Card */}
        <div className={`p-5 rounded-2xl border space-y-3 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Project ID</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </div>
          <p className={`text-lg font-black font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{firebaseConfig.projectId}</p>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Spark Plan (Permanent Free Tier)</p>
        </div>

        {/* Database Status Card */}
        <div className={`p-5 rounded-2xl border space-y-3 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Realtime Listener</span>
            <Layers className="w-4 h-4 text-amber-500" />
          </div>
          <p className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Active (onSnapshot)</p>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{orders.length} orders tracked in state</p>
        </div>

        {/* Auth Domain Card */}
        <div className={`p-5 rounded-2xl border space-y-3 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Auth Domain</span>
            <Lock className="w-4 h-4 text-cyan-500" />
          </div>
          <p className={`text-xs font-mono truncate ${isLight ? 'text-cyan-700 font-semibold' : 'text-cyan-300'}`}>{firebaseConfig.authDomain}</p>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Ready for OAuth & Email Sign-in</p>
        </div>
      </div>

      {/* Security Rules Section */}
      <div className={`p-6 rounded-3xl border space-y-4 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Firestore Security Rules</h3>
            </div>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Paste these rules into your Firebase Console (<span className="text-amber-500 font-semibold">Firestore Database &gt; Rules</span>) to permit order creation, messages, and lead capture.
            </p>
          </div>

          <button
            onClick={copyRules}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border self-start sm:self-auto ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' 
                : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
            }`}
          >
            {copiedRules ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copiedRules ? 'Copied Rules!' : 'Copy Rules'}</span>
          </button>
        </div>

        <pre className={`p-4 rounded-2xl border text-xs font-mono overflow-x-auto max-h-64 leading-relaxed ${
          isLight 
            ? 'bg-slate-900 border-slate-800 text-emerald-300' 
            : 'bg-slate-950 border-slate-800/80 text-emerald-300/90'
        }`}>
          {firestoreRulesText}
        </pre>
      </div>

      {/* Authorized Domains Helper */}
      <div className={`p-6 rounded-3xl border space-y-4 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-500" />
            <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Authorized Domains for Authentication</h3>
          </div>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            In your Firebase Console, navigate to <span className="text-cyan-600 font-semibold">Authentication &gt; Settings &gt; Authorized domains</span> and add these domains:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
            <div className="truncate">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Current Preview Host</p>
              <p className={`text-xs font-mono truncate ${isLight ? 'text-slate-900 font-bold' : 'text-white'}`}>{previewDomain}</p>
            </div>
            <button
              onClick={() => copyDomain(previewDomain)}
              className={`p-2 rounded-lg transition-colors shrink-0 ${isLight ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'}`}
              title="Copy Host"
            >
              {copiedDomain === previewDomain ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
            <div className="truncate">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Localhost (Development)</p>
              <p className={`text-xs font-mono truncate ${isLight ? 'text-slate-900 font-bold' : 'text-white'}`}>localhost</p>
            </div>
            <button
              onClick={() => copyDomain('localhost')}
              className={`p-2 rounded-lg transition-colors shrink-0 ${isLight ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'}`}
              title="Copy localhost"
            >
              {copiedDomain === 'localhost' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
