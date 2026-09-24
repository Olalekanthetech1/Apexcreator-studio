import React, { useState, useEffect } from 'react';
import { useApp, getPaystackEnvPublicKey } from '../context/AppContext';
import {
  ServiceItem,
  ProofItem,
  Testimonial,
  FAQItem,
  OrderStatus,
  ServiceCategory,
  PackageOption
} from '../types';
import { validateCryptoAddress } from '../utils/cryptoValidation';
import { AdminAnalyticsSection } from './AdminAnalyticsSection';
import { AdminNeonDatabaseSection } from './AdminNeonDatabaseSection';
import { AdminFirebaseSection } from './AdminFirebaseSection';
import { LiveChatAdminSection } from './LiveChatAdminSection';
import {
  ShieldCheck,
  Flame,
  Lock,
  LogOut,
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  Edit,
  Upload,
  Send,
  Eye,
  EyeOff,
  Star,
  Search,
  MessageSquare,
  HelpCircle,
  BarChart3,
  RefreshCw,
  Wallet,
  CreditCard,
  Building2,
  AlertCircle,
  XCircle,
  FileText,
  Zap,
  Coins,
  QrCode,
  Key,
  Save,
  Copy,
  Check,
  MessageCircle,
  Activity,
  Globe,
  Database,
  Server
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    theme,
    toggleTheme,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    orders,
    services,
    proofs,
    testimonials,
    faqs,
    processPayment,
    autoVerifyPayments,
    toggleAutoVerifyPayments,
    cryptoSettings,
    updateCryptoSettings,
    contactSettings,
    updateContactSettings,
    bankSettings,
    updateBankSettings,
    paystackSettings,
    updatePaystackSettings,
    updateOrderStatus,
    addOrderMessage,
    uploadDeliverable,
    saveService,
    deleteService,
    saveProof,
    deleteProof,
    saveTestimonial,
    deleteTestimonial,
    saveFAQ,
    deleteFAQ,
    resetDataToDefaults,
    showToast
  } = useApp();

  const isLight = theme === 'light';

  // Login Form Password State
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'services' | 'proofs' | 'testimonials' | 'faqs' | 'crypto-settings' | 'paystack-settings' | 'platform-settings' | 'firebase-settings' | 'database-settings' | 'live-chat'>('analytics');

  // Platform & Bank Settings States
  const [editableContact, setEditableContact] = useState(contactSettings);
  const [editableBank, setEditableBank] = useState(bankSettings);
  const [bankTab, setBankTab] = useState<'USD' | 'GBP' | 'EUR'>('USD');

  // Paystack Gateway Admin Form States
  const [editablePaystack, setEditablePaystack] = useState(paystackSettings);
  const [showPaystackSecret, setShowPaystackSecret] = useState(false);

  // Keep admin form states synced with incoming database/central settings
  useEffect(() => {
    if (paystackSettings) {
      const envKey = getPaystackEnvPublicKey();
      setEditablePaystack({
        ...paystackSettings,
        publicKey: (paystackSettings.publicKey || envKey || '').trim()
      });
    }
  }, [paystackSettings]);

  useEffect(() => {
    if (bankSettings) {
      setEditableBank(bankSettings);
    }
  }, [bankSettings]);
  const [paystackTestStatus, setPaystackTestStatus] = useState<{ loading: boolean; success?: boolean; message?: string } | null>(null);
  const [copiedPaystackUrl, setCopiedPaystackUrl] = useState<string | null>(null);
  const [webhookLogs, setWebhookLogs] = useState<any[]>([]);
  const [loadingWebhookLogs, setLoadingWebhookLogs] = useState(false);
  const [isFetchingForex, setIsFetchingForex] = useState(false);
  const [liveForexInfo, setLiveForexInfo] = useState<{ rate?: number; lastUpdated?: string } | null>(null);

  const handleFetchLiveForex = async () => {
    setIsFetchingForex(true);
    try {
      const res = await fetch('/api/forex/rates');
      const data = await res.json();
      if (data.usdToNgn) {
        setLiveForexInfo({ rate: data.usdToNgn, lastUpdated: new Date().toLocaleTimeString() });
        setEditablePaystack(prev => ({ ...prev, usdToNgnRate: data.usdToNgn }));
        showToast?.(`Live FX Rate fetched: $1 USD = ₦${data.usdToNgn.toLocaleString()} NGN`, 'success');
      }
    } catch (e: any) {
      showToast?.('Could not reach forex service. Preserving current exchange rate.', 'error');
    } finally {
      setIsFetchingForex(false);
    }
  };

  const fetchWebhookLogs = async () => {
    setLoadingWebhookLogs(true);
    try {
      const res = await fetch('/api/payments/paystack/webhook-logs');
      const data = await res.json();
      if (data.success) {
        setWebhookLogs(data.logs || []);
      }
    } catch (e) {
      console.warn('Failed to load webhook logs', e);
    } finally {
      setLoadingWebhookLogs(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPaystackUrl(label);
    setTimeout(() => setCopiedPaystackUrl(null), 2500);
  };

  const handleTestPaystackConnection = async () => {
    setPaystackTestStatus({ loading: true });
    try {
      const res = await fetch('/api/payments/paystack/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey: (editablePaystack.secretKey || '').trim() })
      });
      const data = await res.json();
      if (data.success) {
        setPaystackTestStatus({
          loading: false,
          success: true,
          message: data.message || 'Connected to Paystack successfully! Secret Key is valid and active.'
        });
      } else {
        setPaystackTestStatus({
          loading: false,
          success: false,
          message: data.message || 'Paystack connection failed. Check your Secret Key.'
        });
      }
    } catch (err: any) {
      setPaystackTestStatus({
        loading: false,
        success: false,
        message: `Connection Error: ${err.message}`
      });
    }
  };

  const handleSavePaystackSettings = () => {
    const envKey = getPaystackEnvPublicKey();
    const effectivePub = (editablePaystack.publicKey || envKey || '').trim();
    updatePaystackSettings({
      ...editablePaystack,
      publicKey: effectivePub,
      secretKey: editablePaystack.secretKey.trim(),
      usdToNgnRate: Number(editablePaystack.usdToNgnRate) || 1550,
      currencyMode: editablePaystack.currencyMode || 'auto_convert_ngn',
      useLiveMarketRate: !!editablePaystack.useLiveMarketRate
    });
    showToast?.('Paystack settings saved and synced successfully!', 'success');
  };

  // Crypto Gateway Admin Form States
  const [bybitApiKey, setBybitApiKey] = useState(cryptoSettings.bybitApiKey || '');
  const [bybitApiSecret, setBybitApiSecret] = useState(cryptoSettings.bybitApiSecret || '');
  const [cryptoGatewayEnabled, setCryptoGatewayEnabled] = useState(cryptoSettings.enabled);
  const [editableCoins, setEditableCoins] = useState(cryptoSettings.coins);
  const [testConnStatus, setTestConnStatus] = useState<{ loading: boolean; success?: boolean; message?: string } | null>(null);

  // Function to test Bybit V5 API Connection
  const handleTestBybitConnection = async () => {
    setTestConnStatus({ loading: true });
    try {
      const res = await fetch('/api/payments/bybit/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: bybitApiKey, apiSecret: bybitApiSecret })
      });
      const data = await res.json();
      if (data.success) {
        setTestConnStatus({
          loading: false,
          success: true,
          message: data.message || 'Bybit V5 API Connection successful! Credentials valid.'
        });
      } else {
        setTestConnStatus({
          loading: false,
          success: false,
          message: data.message || 'Bybit V5 API Connection failed. Check key and permissions.'
        });
      }
    } catch (err: any) {
      setTestConnStatus({
        loading: false,
        success: false,
        message: `Connection Error: ${err.message}`
      });
    }
  };

  // Save all Crypto Settings
  const handleSaveCryptoSettings = () => {
    updateCryptoSettings({
      enabled: cryptoGatewayEnabled,
      bybitApiKey: bybitApiKey.trim(),
      bybitApiSecret: bybitApiSecret.trim(),
      coins: editableCoins
    });
  };

  // Admin Order State
  const [orderSearch, setOrderSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [manualPayMethod, setManualPayMethod] = useState<string>('Credit / Debit Card');
  const [manualRefIdInput, setManualRefIdInput] = useState<string>('');
  const [selectedAdminOrderId, setSelectedAdminOrderId] = useState<string | null>(null);
  const [adminMsgText, setAdminMsgText] = useState('');
  const [delivTitle, setDelivTitle] = useState('');
  const [delivUrl, setDelivUrl] = useState('');
  const [delivNote, setDelivNote] = useState('');

  // Service Edit Modal
  const [isEditingService, setIsEditingService] = useState(false);
  const [editingServiceData, setEditingServiceData] = useState<Partial<ServiceItem>>({});

  // Proof Edit Modal
  const [isEditingProof, setIsEditingProof] = useState(false);
  const [editingProofData, setEditingProofData] = useState<Partial<ProofItem>>({});

  // Testimonial Edit Modal
  const [isEditingTestimonial, setIsEditingTestimonial] = useState(false);
  const [editingTestimonialData, setEditingTestimonialData] = useState<Partial<Testimonial>>({});

  // FAQ Edit Modal
  const [isEditingFAQ, setIsEditingFAQ] = useState(false);
  const [editingFAQData, setEditingFAQData] = useState<Partial<FAQItem>>({});

  // IF NOT LOGGED IN SHOW SECURE LOGIN CARD
  if (!isAdminLoggedIn) {
    return (
      <div className={`py-20 min-h-[80vh] flex items-center justify-center p-4 transition-colors ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-white'
      }`}>
        <div className={`w-full max-w-md p-8 rounded-3xl border space-y-6 shadow-2xl transition-colors ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div className="text-center space-y-1">
            <h1 className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>ApexCreator Studio Admin Portal</h1>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Enter password to access agency management suite.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginAdmin(password);
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Admin Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password (e.g. admin123)"
                  className={`w-full pl-4 pr-10 py-3 rounded-xl border text-sm outline-none transition-colors ${
                    isLight 
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500' 
                      : 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500'
                  }`}
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-500/20 transition-all"
            >
              Authenticate & Access Admin
            </button>
          </form>

          <div className={`p-3 rounded-xl text-[11px] text-center ${
            isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-950 text-slate-400'
          }`}>
            Default Password: <code className="text-emerald-500 font-bold">admin123</code>
          </div>
        </div>
      </div>
    );
  }

  // CALCULATE REVENUE & STATS
  const totalRevenue = (orders || [])
    .filter((o) => o && o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + (o.price || 0), 0);

  const pendingOrdersCount = (orders || []).filter((o) => o && (o.status === 'Pending' || o.status === 'Payment Confirmed')).length;
  const completedOrdersCount = (orders || []).filter((o) => o && (o.status === 'Completed' || o.status === 'Delivered')).length;

  const filteredOrders = (orders || []).filter((o) => {
    if (!o) return false;
    const matchesFilter =
      paymentFilter === 'all'
        ? true
        : paymentFilter === 'pending'
        ? o.paymentStatus === 'Pending'
        : o.paymentStatus === 'Paid';

    if (!matchesFilter) return false;

    if (!orderSearch) return true;
    const q = orderSearch.toLowerCase();
    return (
      (o.id && o.id.toLowerCase().includes(q)) ||
      (o.customerName && o.customerName.toLowerCase().includes(q)) ||
      (o.email && o.email.toLowerCase().includes(q)) ||
      (o.serviceTitle && o.serviceTitle.toLowerCase().includes(q)) ||
      (o.paymentMethod && o.paymentMethod.toLowerCase().includes(q)) ||
      (o.paymentReference && o.paymentReference.toLowerCase().includes(q))
    );
  });

  const activeAdminOrder = (orders || []).find((o) => o && o.id === selectedAdminOrderId) || filteredOrders[0] || null;

  return (
    <div className={`py-12 min-h-[85vh] transition-colors ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Administrator Control Panel</h1>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-500 rounded border border-emerald-500/30">
                  Active
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Manage orders, services, pricing, proof portfolio, testimonials, & FAQs.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isLight 
                  ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
              title="Toggle Theme"
            >
              {isLight ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>

            <button
              onClick={resetDataToDefaults}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                isLight 
                  ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
              title="Reset sample data"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              Reset Defaults
            </button>

            <button
              onClick={logoutAdmin}
              className="px-4 py-2 rounded-xl text-xs font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </button>
          </div>
        </div>

        {/* Executive Stats Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-5 rounded-2xl border space-y-1 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
            <span className={`text-xs font-medium block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total Revenue</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-500">${totalRevenue} USD</div>
            <span className={`text-[10px] block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>From paid orders</span>
          </div>

          <div className={`p-5 rounded-2xl border space-y-1 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
            <span className={`text-xs font-medium block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total Orders</span>
            <div className={`text-2xl sm:text-3xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{orders.length}</div>
            <span className={`text-[10px] block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Lifetime count</span>
          </div>

          <div className={`p-5 rounded-2xl border space-y-1 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
            <span className={`text-xs font-medium block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Pending / Action</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-500">{pendingOrdersCount}</div>
            <span className={`text-[10px] block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Requires fulfillment</span>
          </div>

          <div className={`p-5 rounded-2xl border space-y-1 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
            <span className={`text-xs font-medium block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Completed / Delivered</span>
            <div className="text-2xl sm:text-3xl font-black text-blue-500">{completedOrdersCount}</div>
            <span className={`text-[10px] block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Finished projects</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex flex-wrap items-center gap-2 border-b pb-2 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-600 text-white shadow-lg shadow-indigo-500/20'
                : isLight ? 'bg-white border border-slate-200 text-indigo-600 hover:bg-slate-100' : 'bg-slate-900 text-indigo-300 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Live Analytics & Leads</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : isLight ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'services'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : isLight ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Services & Pricing ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('proofs')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'proofs'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : isLight ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Proof Gallery ({proofs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'testimonials'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : isLight ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Star className="w-4 h-4 text-amber-500" />
            <span>Testimonials ({testimonials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'faqs'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : isLight ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQs ({faqs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('crypto-settings')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'crypto-settings'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                : isLight ? 'bg-white border border-slate-200 text-emerald-600 hover:bg-slate-100' : 'bg-slate-900 text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <Coins className="w-4 h-4 text-emerald-500" />
            <span>Crypto Gateway Settings</span>
            <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-500 text-[10px] uppercase font-black rounded">⚡ Bybit</span>
          </button>

          <button
            onClick={() => setActiveTab('paystack-settings')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'paystack-settings'
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/20'
                : isLight ? 'bg-white border border-slate-200 text-teal-600 hover:bg-slate-100' : 'bg-slate-900 text-teal-400 hover:text-teal-300'
            }`}
          >
            <CreditCard className="w-4 h-4 text-teal-500" />
            <span>Paystack Gateway Settings</span>
            <span className="px-1.5 py-0.2 bg-teal-500/20 text-teal-500 text-[10px] uppercase font-black rounded">🌐 USD Cards</span>
          </button>
          
          <button
            onClick={() => setActiveTab('platform-settings')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'platform-settings'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : isLight ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Contact & Bank Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('firebase-settings')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'firebase-settings'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/20'
                : isLight ? 'bg-white border border-slate-200 text-amber-600 hover:bg-slate-100' : 'bg-slate-900 text-amber-400 hover:text-amber-300'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Firebase Cloud</span>
            <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[10px] uppercase font-black rounded">🔥 Active</span>
          </button>

          <button
            onClick={() => setActiveTab('database-settings')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'database-settings'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                : isLight ? 'bg-white border border-slate-200 text-cyan-600 hover:bg-slate-100' : 'bg-slate-900 text-cyan-400 hover:text-cyan-300'
            }`}
          >
            <Database className="w-4 h-4 text-cyan-500" />
            <span>Neon PostgreSQL Database</span>
            <span className="px-1.5 py-0.2 bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 text-[10px] uppercase font-black rounded">⚡ Cloud</span>
          </button>

          <button
            onClick={() => setActiveTab('live-chat')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'live-chat'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20'
                : isLight ? 'bg-white border border-slate-200 text-purple-600 hover:bg-slate-100' : 'bg-slate-900 text-purple-400 hover:text-purple-300'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-purple-500" />
            <span>Live Chat Support</span>
            <span className="px-1.5 py-0.2 bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[10px] uppercase font-black rounded">💬 Chat</span>
          </button>
        </div>

        {/* TAB 0: LIVE ANALYTICS & LEADS */}
        {activeTab === 'analytics' && (
          <AdminAnalyticsSection showToast={showToast} />
        )}

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Payment Verification Mode Control Banner */}
            <div className={`p-5 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-3 rounded-2xl border ${
                  autoVerifyPayments
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                }`}>
                  <Zap className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Payment Verification System Mode</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      autoVerifyPayments
                        ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-600 border border-amber-500/30'
                    }`}>
                      {autoVerifyPayments ? '⚡ Instant Auto-Verification' : '🛡️ Manual Audit Guard'}
                    </span>
                  </div>

                  <p className={`text-xs mt-1 max-w-2xl ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {autoVerifyPayments
                      ? 'Automated Mode ACTIVE: Crypto and Card checkout payments automatically confirm immediately upon submission so customers receive instant confirmation even when admin is offline.'
                      : 'Manual Mode ACTIVE: Card payments require admin manual review and confirmation before order status changes to Paid.'}
                  </p>
                </div>
              </div>

              <button
                onClick={toggleAutoVerifyPayments}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 ${
                  autoVerifyPayments
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                }`}
              >
                <span>{autoVerifyPayments ? 'Switch to Manual Audit Mode' : 'Enable Instant Auto-Verification'}</span>
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Orders List */}
            <div className="lg:col-span-5 space-y-3">
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by ID, name, email, ref..."
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs outline-none transition-colors ${
                      isLight 
                        ? 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500' 
                        : 'bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-blue-500'
                    }`}
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                  <button
                    onClick={() => setPaymentFilter('all')}
                    className={`px-2.5 py-1 rounded-lg border transition-all ${
                      paymentFilter === 'all'
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({(orders || []).length})
                  </button>

                  <button
                    onClick={() => setPaymentFilter('pending')}
                    className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                      paymentFilter === 'pending'
                        ? 'bg-amber-500 border-amber-400 text-slate-950 font-extrabold'
                        : isLight ? 'bg-white border-slate-200 text-amber-700 hover:bg-slate-100' : 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                    }`}
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>Pending ({(orders || []).filter(o => o && o.paymentStatus === 'Pending').length})</span>
                  </button>

                  <button
                    onClick={() => setPaymentFilter('paid')}
                    className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                      paymentFilter === 'paid'
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : isLight ? 'bg-white border-slate-200 text-emerald-700 hover:bg-slate-100' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Paid ({(orders || []).filter(o => o && o.paymentStatus === 'Paid').length})</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                {filteredOrders.length === 0 ? (
                  <div className={`p-8 text-center rounded-2xl border text-xs ${
                    isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-900/50 border-slate-800 text-slate-500'
                  }`}>
                    No orders found matching filter criteria.
                  </div>
                ) : (
                  filteredOrders.map((ord) => {
                    const isSelected = activeAdminOrder?.id === ord.id;
                    const isPaid = ord.paymentStatus === 'Paid';

                    return (
                      <button
                        key={ord.id}
                        onClick={() => setSelectedAdminOrderId(ord.id)}
                        className={`w-full p-4 rounded-2xl text-left border transition-all space-y-2 ${
                          isSelected
                            ? isLight ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-400' : 'bg-blue-600/15 border-blue-500 shadow-lg'
                            : isLight ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm text-slate-900' : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-blue-500">{ord.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            isPaid
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse'
                          }`}>
                            {isPaid ? 'Paid' : 'Pending Verification'}
                          </span>
                        </div>

                        <div>
                          <div className={`text-sm font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{ord.customerName}</div>
                          <div className={`text-xs truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{ord.serviceTitle} (${ord.price})</div>
                        </div>

                        <div className={`flex items-center justify-between pt-1 text-[11px] border-t ${
                          isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800/60 text-slate-400'
                        }`}>
                          <span className={`flex items-center gap-1 font-semibold truncate max-w-[170px] ${
                            isLight ? 'text-amber-700' : 'text-amber-300'
                          }`}>
                            <Wallet className="w-3 h-3 text-amber-500 shrink-0" />
                            {ord.paymentMethod || 'Manual Verification'}
                          </span>
                          <span className="font-mono text-slate-400 text-[10px]">{ord.status}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Selected Order Admin Action Panel */}
            {activeAdminOrder && (
              <div className="lg:col-span-7 space-y-6">
                
                {/* Manual Order Payment Verification Panel */}
                <div className={`p-6 rounded-3xl border space-y-4 shadow-xl ${
                  isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
                }`}>
                  <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-amber-500" />
                      <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Manual Payment Verification Panel</h3>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      activeAdminOrder.paymentStatus === 'Paid'
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse'
                    }`}>
                      {activeAdminOrder.paymentStatus === 'Paid' ? 'Payment Verified (Paid)' : 'Pending Verification'}
                    </span>
                  </div>

                  {/* Payment Metadata Grid */}
                  <div className={`p-4 rounded-2xl border space-y-3 text-xs ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800/80'
                  }`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className={`block font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Order Total:</span>
                        <span className="text-emerald-500 font-black text-lg">${activeAdminOrder.price} USD</span>
                      </div>

                      <div>
                        <span className={`block font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Recorded Payment Channel:</span>
                        <span className={`font-bold flex items-center gap-1.5 mt-0.5 ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
                          <Wallet className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          {activeAdminOrder.paymentMethod || 'Manual Verification'}
                        </span>
                      </div>

                      <div className="sm:col-span-2">
                        <span className={`block font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Transaction / Wire Reference ID:</span>
                        <span className={`font-mono font-bold mt-0.5 block p-2 rounded-lg border ${
                          isLight ? 'bg-white border-slate-200 text-blue-600' : 'bg-slate-900 border-slate-800 text-blue-400'
                        }`}>
                          {activeAdminOrder.paymentReference || 'No reference recorded yet'}
                        </span>
                      </div>
                    </div>

                    {/* Verification Controls */}
                    {activeAdminOrder.paymentStatus === 'Pending' ? (
                      <div className={`pt-3 border-t space-y-3 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                        <div className={`text-[11px] p-3 rounded-xl border flex items-start gap-2 ${
                          isLight ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                        }`}>
                          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <strong className="block text-amber-600 font-bold mb-0.5">Manual Verification Requirement:</strong>
                            Cross-check receipt of <strong>${activeAdminOrder.price} USD</strong>. Click below to verify and confirm order.
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className={`text-[11px] font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Confirm Payment Method:</label>
                            <select
                              value={manualPayMethod}
                              onChange={(e) => setManualPayMethod(e.target.value)}
                              className={`w-full px-3 py-2 rounded-xl text-xs outline-none focus:border-amber-500 border ${
                                isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                              }`}
                            >
                              <option value="Credit / Debit Card">Credit / Debit Card</option>
                              <option value="Manual Bank Wire">Manual Bank Wire</option>
                              <option value="Crypto (Manual)">Crypto (Manual)</option>
                            </select>
                          </div>

                          <div>
                            <label className={`text-[11px] font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Transaction Ref / Audit Note:</label>
                            <input
                              type="text"
                              value={manualRefIdInput}
                              onChange={(e) => setManualRefIdInput(e.target.value)}
                              placeholder={activeAdminOrder.paymentReference || "e.g. TX-98124021"}
                              className={`w-full px-3 py-2 rounded-xl text-xs outline-none focus:border-amber-500 font-mono border ${
                                isLight ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-900 border-slate-800 text-white placeholder-slate-600'
                              }`}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const ref = manualRefIdInput.trim() || activeAdminOrder.paymentReference || `VERIFIED-${Math.floor(100000 + Math.random() * 900000)}`;
                            processPayment(activeAdminOrder.id, manualPayMethod, ref);
                            setManualRefIdInput('');
                          }}
                          className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          <span>Confirm & Mark Payment Received (${activeAdminOrder.price} USD)</span>
                        </button>
                      </div>
                    ) : (
                      <div className={`pt-2 border-t flex items-center justify-between text-xs ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Payment Verified & Accounted</span>
                        </div>
                        <button
                          onClick={() => {
                            updateOrderStatus(activeAdminOrder.id, 'In Progress');
                            showToast(`Order ${activeAdminOrder.id} status set to In Progress`, 'info');
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors ${
                            isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          Start Execution
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Details & Customer Info */}
                <div className={`p-6 rounded-3xl border space-y-4 shadow-xl ${
                  isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
                }`}>
                  <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
                    <div>
                      <span className="text-xs font-mono font-bold text-blue-500">{activeAdminOrder.id}</span>
                      <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{activeAdminOrder.serviceTitle}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-500">${activeAdminOrder.price}</span>
                      <span className={`text-xs block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{activeAdminOrder.paymentStatus}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Customer Name:</span>
                      <strong className={isLight ? 'text-slate-900' : 'text-white'}>{activeAdminOrder.customerName}</strong>
                    </div>
                    <div>
                      <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Email:</span>
                      <strong className={isLight ? 'text-slate-900' : 'text-white'}>{activeAdminOrder.email}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Social / Channel URL:</span>
                      <a href={activeAdminOrder.socialUrl} target="_blank" rel="noreferrer" className="text-blue-500 font-mono hover:underline">
                        {activeAdminOrder.socialUrl}
                      </a>
                    </div>
                    {activeAdminOrder.isNegotiatedPrice && (
                      <div className={`col-span-2 p-3 rounded-xl border ${
                        isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-amber-600">
                          <span>⚡ Custom Negotiated Price Offer</span>
                        </div>
                        <div className={`text-xs font-semibold mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          Offered Price: ${activeAdminOrder.offeredPrice || activeAdminOrder.price} USD
                        </div>
                        {activeAdminOrder.negotiationNote && (
                          <p className={`text-[11px] mt-1 italic ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                            "{activeAdminOrder.negotiationNote}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Order Status Select Controls */}
                  <div className={`p-4 rounded-2xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                    <label className={`text-xs font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Update Order Fulfillment Status:</label>
                    <div className="flex flex-wrap gap-2">
                      {(['Pending', 'Payment Confirmed', 'In Progress', 'Delivered', 'Completed', 'Cancelled'] as OrderStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => updateOrderStatus(activeAdminOrder.id, st)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            activeAdminOrder.status === st
                              ? 'bg-blue-600 border-blue-500 text-white'
                              : isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upload Deliverable Link */}
                <div className={`p-6 rounded-3xl border space-y-4 shadow-xl ${
                  isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
                }`}>
                  <h4 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    <Upload className="w-4 h-4 text-emerald-500" />
                    Upload Deliverable File / Asset Link
                  </h4>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={delivTitle}
                      onChange={(e) => setDelivTitle(e.target.value)}
                      placeholder="Asset Title (e.g. Master YouTube Thumbnail PNGs & Strategy PDF)"
                      className={`w-full px-4 py-2.5 rounded-xl text-xs outline-none border ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-950 border-slate-800 text-white placeholder-slate-600'
                      }`}
                    />
                    <input
                      type="url"
                      value={delivUrl}
                      onChange={(e) => setDelivUrl(e.target.value)}
                      placeholder="Download URL (e.g. https://drive.google.com/file/d/... or ZIP link)"
                      className={`w-full px-4 py-2.5 rounded-xl text-xs outline-none border ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-950 border-slate-800 text-white placeholder-slate-600'
                      }`}
                    />
                    <input
                      type="text"
                      value={delivNote}
                      onChange={(e) => setDelivNote(e.target.value)}
                      placeholder="Optional note for client..."
                      className={`w-full px-4 py-2.5 rounded-xl text-xs outline-none border ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-950 border-slate-800 text-white placeholder-slate-600'
                      }`}
                    />

                    <button
                      onClick={() => {
                        if (!delivTitle || !delivUrl) {
                          showToast('Please provide deliverable title and download URL.', 'error');
                          return;
                        }
                        uploadDeliverable(activeAdminOrder.id, {
                          title: delivTitle,
                          downloadUrl: delivUrl,
                          note: delivNote
                        });
                        setDelivTitle('');
                        setDelivUrl('');
                        setDelivNote('');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload & Mark Deliverable</span>
                    </button>
                  </div>
                </div>

                {/* Send Admin Message */}
                <div className={`p-6 rounded-3xl border space-y-3 shadow-xl ${
                  isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
                }`}>
                  <h4 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    Send Customer Direct Message
                  </h4>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={adminMsgText}
                      onChange={(e) => setAdminMsgText(e.target.value)}
                      placeholder="Type message to customer..."
                      className={`flex-1 px-4 py-2.5 rounded-xl text-xs outline-none border ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-950 border-slate-800 text-white placeholder-slate-600'
                      }`}
                    />
                    <button
                      onClick={() => {
                        if (!adminMsgText.trim()) return;
                        addOrderMessage(activeAdminOrder.id, adminMsgText.trim(), 'admin');
                        setAdminMsgText('');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
                    >
                      Send
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
        )}

        {/* TAB 2: SERVICES & PRICING MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Service Catalog & Package Pricing Editor</h2>
              <button
                onClick={() => {
                  setEditingServiceData({
                    id: `service-${Date.now()}`,
                    title: 'New Service',
                    category: 'YouTube',
                    iconName: 'Youtube',
                    shortDesc: 'Short description for new service',
                    fullDesc: 'Full detailed description',
                    deliveryInfo: 'Delivered in 2-3 business days',
                    whatIsIncluded: ['Included Feature 1', 'Included Feature 2'],
                    packages: {
                      BASIC: { name: 'Basic', price: 70, deliveryDays: '3 Days', revisions: '1 Revision', features: ['Basic feature'] },
                      STANDARD: { name: 'Standard', price: 230, deliveryDays: '2 Days', revisions: '2 Revisions', badge: 'Most Popular', features: ['Standard feature'] },
                      PREMIUM: { name: 'Premium', price: 460, deliveryDays: '1 Day', revisions: '3 Revisions', features: ['Premium feature'] }
                    }
                  });
                  setIsEditingService(true);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((srv) => (
                <div key={srv.id} className={`p-6 rounded-3xl border space-y-4 shadow-xl ${
                  isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 uppercase">
                        {srv.category}
                      </span>
                      <h3 className={`text-lg font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{srv.title}</h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingServiceData(srv);
                          setIsEditingService(true);
                        }}
                        className={`p-2 rounded-xl border transition-colors ${
                          isLight ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200' : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                        }`}
                        title="Edit Service"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteService(srv.id)}
                        className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{srv.shortDesc}</p>

                  <div className={`grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
                    <div className={`p-2 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                      <span className="text-slate-400 block text-[10px]">BASIC</span>
                      <strong className={isLight ? 'text-slate-900' : 'text-white'}>${srv.packages.BASIC.price}</strong>
                    </div>
                    <div className={`p-2 rounded-xl border ${isLight ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-950 border-blue-500/40'}`}>
                      <span className="text-blue-500 block text-[10px]">STANDARD</span>
                      <strong className={isLight ? 'text-slate-900' : 'text-white'}>${srv.packages.STANDARD.price}</strong>
                    </div>
                    <div className={`p-2 rounded-xl border ${isLight ? 'bg-purple-50/50 border-purple-200' : 'bg-slate-950 border-purple-500/40'}`}>
                      <span className="text-purple-500 block text-[10px]">PREMIUM</span>
                      <strong className={isLight ? 'text-slate-900' : 'text-white'}>${srv.packages.PREMIUM.price}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROOF / PORTFOLIO GALLERY MANAGEMENT */}
        {activeTab === 'proofs' && (
          <div className="space-y-6">
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl border shadow-sm ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Proof of Work Portfolio Entries</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    {proofs.length} Published Case Studies
                  </span>
                </div>
                <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Upload project results, before/after screenshots, and client growth proof. These appear live on the public Proof Page.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProofData({
                    id: `proof-${Date.now()}`,
                    title: 'New Client Project Proof',
                    category: 'YouTube Services',
                    platform: 'YouTube',
                    serviceProvided: 'Channel Branding & Growth',
                    description: 'Client channel revamped with custom graphics, video overlays, and optimized metadata.',
                    beforeImage: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80',
                    afterImage: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&auto=format&fit=crop&q=80',
                    dateCompleted: new Date().toISOString().split('T')[0],
                    hidden: false
                  });
                  setIsEditingProof(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 shrink-0 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Work Proof</span>
              </button>
            </div>

            {proofs.length === 0 ? (
              <div className={`text-center py-12 rounded-3xl border space-y-3 ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/50 border-slate-800'
              }`}>
                <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
                <p className={`font-bold text-sm ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>No Work Proof Entries Yet</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Click "Upload New Work Proof" above to publish before & after screenshots, analytics metrics, and completed project showcases.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {proofs.map((p) => (
                  <div key={p.id} className={`p-6 rounded-3xl border space-y-4 shadow-xl flex flex-col justify-between relative group transition-all ${
                    isLight ? 'bg-white border-slate-200 hover:border-amber-500/50 shadow-sm' : 'bg-slate-900 border-slate-800 hover:border-amber-500/30'
                  }`}>
                    
                    <div className="space-y-3">
                      {/* Image Thumbnails Pair */}
                      <div className={`grid grid-cols-2 gap-2 rounded-2xl p-2 border ${
                        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                      }`}>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Before</span>
                          <div className={`h-28 rounded-xl overflow-hidden border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                            {p.beforeImage ? (
                              <img src={p.beforeImage} alt="Before" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">No Before Image</div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">After / Result</span>
                          <div className={`h-28 rounded-xl overflow-hidden border ${isLight ? 'bg-slate-100 border-emerald-400' : 'bg-slate-900 border-emerald-500/30'}`}>
                            {p.afterImage || p.resultImage ? (
                              <img src={p.afterImage || p.resultImage} alt="After" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">No After Image</div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Header Badges & Actions */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              {p.platform}
                            </span>
                            <span className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                              {p.category}
                            </span>
                            {p.hidden && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-500 border border-rose-500/30">
                                Hidden
                              </span>
                            )}
                          </div>
                          <h3 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{p.title}</h3>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => saveProof({ ...p, hidden: !p.hidden })}
                            className={`p-2 rounded-xl border text-xs transition-colors ${
                              p.hidden
                                ? isLight ? 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700' : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-white'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            }`}
                            title={p.hidden ? 'Publish to Public Site' : 'Hide from Public Site'}
                          >
                            {p.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => {
                              setEditingProofData(p);
                              setIsEditingProof(true);
                            }}
                            className={`p-2 rounded-xl border transition-colors ${
                              isLight ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200' : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                            }`}
                            title="Edit Proof"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => deleteProof(p.id)}
                            className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 transition-colors"
                            title="Delete Proof"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Service Provided */}
                      <div className={`text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Service Delivered: <span className="text-amber-500 font-bold">{p.serviceProvided}</span>
                      </div>

                      {/* Description */}
                      <p className={`text-xs leading-relaxed line-clamp-3 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                        {p.description}
                      </p>
                    </div>

                    <div className={`pt-3 border-t flex items-center justify-between text-[11px] font-mono ${
                      isLight ? 'border-slate-100 text-slate-400' : 'border-slate-800/80 text-slate-500'
                    }`}>
                      <span>ID: {p.id}</span>
                      <span>Completed: {p.dateCompleted || 'Recent'}</span>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TESTIMONIALS MANAGEMENT */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Client Testimonials Editor</h2>
              <button
                onClick={() => {
                  setEditingTestimonialData({
                    id: `testi-${Date.now()}`,
                    name: 'Client Name',
                    channelOrBusiness: 'Channel / Business Name',
                    platform: 'YouTube',
                    rating: 5,
                    testimonial: 'Exemplary service delivered quickly and professionally.',
                    date: new Date().toISOString().split('T')[0]
                  });
                  setIsEditingTestimonial(true);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Testimonial</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((t) => (
                <div key={t.id} className={`p-5 rounded-2xl border space-y-2 shadow-sm ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.name}</h4>
                      <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.channelOrBusiness} ({t.platform})</p>
                    </div>
                    <button onClick={() => deleteTestimonial(t.id)} className="text-rose-500 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className={`text-xs italic ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>"{t.testimonial}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FAQ MANAGEMENT */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>FAQ Editor</h2>
              <button
                onClick={() => {
                  setEditingFAQData({
                    id: `faq-${Date.now()}`,
                    question: 'New Question?',
                    answer: 'Detailed answer response...'
                  });
                  setIsEditingFAQ(true);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add FAQ</span>
              </button>
            </div>

            <div className="space-y-3">
              {faqs.map((f) => (
                <div key={f.id} className={`p-4 rounded-2xl border space-y-1 shadow-sm ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                }`}>
                  <div className="flex justify-between items-start">
                    <h4 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{f.question}</h4>
                    <button onClick={() => deleteFAQ(f.id)} className="text-rose-500 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: BYBIT CRYPTO GATEWAY SETTINGS */}
        {activeTab === 'crypto-settings' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header Banner */}
            <div className={`p-6 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-lg font-black flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    <span>Bybit Multi-Currency Crypto Gateway</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                      V5 API Enabled
                    </span>
                  </h3>
                  <p className={`text-xs mt-1 max-w-2xl ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Configure your Bybit Read-Only API keys and deposit wallet addresses. Customer transfers across USDT, BTC, TRX, ETH, SOL, etc. will be automatically verified against Bybit deposit records!
                  </p>
                </div>
              </div>

              <button
                onClick={handleSaveCryptoSettings}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Save Crypto Settings</span>
              </button>
            </div>

            {/* SECTION 1: BYBIT API CREDENTIALS */}
            <div className={`p-6 rounded-3xl border space-y-6 shadow-lg ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-500" />
                  <h4 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Bybit V5 Read-Only API Credentials</h4>
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold">
                  🛡️ Read-Only Safe
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                {/* Bybit API Key */}
                <div className="space-y-1.5">
                  <label className={`font-semibold flex items-center justify-between ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    <span>Bybit API Key</span>
                    <span className="text-[10px] text-slate-400">From Bybit API Management</span>
                  </label>
                  <input
                    type="text"
                    value={bybitApiKey}
                    onChange={(e) => setBybitApiKey(e.target.value)}
                    placeholder="e.g. 8x92a3b4c5d6e7f8"
                    className={`w-full px-4 py-3 rounded-xl border font-mono focus:outline-none focus:border-emerald-500 transition-colors ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>

                {/* Bybit API Secret */}
                <div className="space-y-1.5">
                  <label className={`font-semibold flex items-center justify-between ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    <span>Bybit API Secret</span>
                    <span className="text-[10px] text-slate-400">Keep secret (Server Only)</span>
                  </label>
                  <input
                    type="password"
                    value={bybitApiSecret}
                    onChange={(e) => setBybitApiSecret(e.target.value)}
                    placeholder="e.g. 9f8e7d6c5b4a3210..."
                    className={`w-full px-4 py-3 rounded-xl border font-mono focus:outline-none focus:border-emerald-500 transition-colors ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>

              </div>

              {/* Test Connection Result Feedback */}
              {testConnStatus && (
                <div
                  className={`p-4 rounded-2xl text-xs flex items-start gap-2.5 border ${
                    testConnStatus.loading
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-200'
                      : testConnStatus.success
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-200'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-200'
                  }`}
                >
                  {testConnStatus.loading ? (
                    <RefreshCw className="w-4 h-4 text-blue-500 animate-spin shrink-0 mt-0.5" />
                  ) : testConnStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block">
                      {testConnStatus.loading
                        ? 'Testing Bybit API Connection...'
                        : testConnStatus.success
                        ? 'Connection Verified!'
                        : 'Connection Error'}
                    </span>
                    <p className="text-[11px] opacity-90 mt-0.5">{testConnStatus.message}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleTestBybitConnection}
                  disabled={testConnStatus?.loading || !bybitApiKey.trim()}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50 ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Test Bybit Connection</span>
                </button>

                <p className="text-[11px] text-slate-500">
                  Ensure <strong>Assets / Deposit</strong> permissions are set to Read-Only on your Bybit API Key.
                </p>
              </div>

            </div>

            {/* SECTION 2: COIN & NETWORK DEPOSIT WALLET ADDRESSES */}
            <div className={`p-6 rounded-3xl border space-y-6 shadow-lg ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-emerald-500" />
                  <h4 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Deposit Wallet Addresses by Coin & Network</h4>
                </div>
                <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Customizable per Currency</span>
              </div>

              <div className="space-y-6">
                {editableCoins.map((coin, coinIdx) => (
                  <div key={coin.symbol} className={`p-5 rounded-2xl border space-y-4 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-extrabold text-xs border border-emerald-500/30">
                          {coin.symbol}
                        </span>
                        <h5 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{coin.name}</h5>
                      </div>

                      {/* Enable/Disable Coin */}
                      <label className={`flex items-center gap-2 text-xs cursor-pointer ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        <input
                          type="checkbox"
                          checked={coin.enabled}
                          onChange={(e) => {
                            const updated = [...editableCoins];
                            updated[coinIdx].enabled = e.target.checked;
                            setEditableCoins(updated);
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                        />
                        <span>Enabled for Checkout</span>
                      </label>
                    </div>

                    {/* Network Address Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {coin.networks.map((net, netIdx) => {
                        const val = validateCryptoAddress(net.address, net.id);
                        const isLive = !!net.isActive && val.isValid;

                        return (
                          <div key={net.id} className={`p-3.5 rounded-xl border space-y-2 ${
                            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
                          }`}>
                            <div className="flex items-center justify-between text-xs">
                              <div>
                                <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{net.name}</span>
                                <span className="ml-2 text-[10px] text-slate-400 font-mono">Network: {net.id}</span>
                              </div>
                              
                              {/* Draft / Live Toggle */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                  isLive 
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                }`}>
                                  {isLive ? '🟢 LIVE' : '🔒 DRAFT (Hidden)'}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer" title={net.isActive ? "Hide from checkout" : "Publish to customer checkout"}>
                                  <input
                                    type="checkbox"
                                    checked={!!net.isActive}
                                    onChange={(e) => {
                                      const updated = [...editableCoins];
                                      const targetNet = updated[coinIdx].networks[netIdx];
                                      
                                      if (e.target.checked) {
                                        const validation = validateCryptoAddress(targetNet.address, targetNet.id);
                                        if (!validation.isValid) {
                                          alert(`Cannot set to Live: ${validation.message}`);
                                          return;
                                        }
                                      }
                                      
                                      targetNet.isActive = e.target.checked;
                                      setEditableCoins(updated);
                                    }}
                                    className="sr-only peer"
                                  />
                                  <div className="w-8 h-4 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <input
                                type="text"
                                value={net.address}
                                onChange={(e) => {
                                  const updated = [...editableCoins];
                                  const targetNet = updated[coinIdx].networks[netIdx];
                                  targetNet.address = e.target.value;
                                  
                                  // Automatically switch to draft if address becomes invalid or empty
                                  const validation = validateCryptoAddress(e.target.value, targetNet.id);
                                  if (!validation.isValid) {
                                    targetNet.isActive = false;
                                  }
                                  
                                  setEditableCoins(updated);
                                }}
                                placeholder={`Paste official ${coin.symbol} (${net.id}) Deposit Address`}
                                className={`w-full px-3 py-2 rounded-lg border text-xs font-mono focus:outline-none transition-colors ${
                                  val.status === 'valid'
                                    ? isLight ? 'bg-emerald-50 border-emerald-400 text-emerald-900 focus:border-emerald-500' : 'bg-emerald-950/20 border-emerald-500/50 text-emerald-300 focus:border-emerald-500'
                                    : val.status === 'invalid' || val.status === 'mismatch'
                                    ? isLight ? 'bg-rose-50 border-rose-400 text-rose-900 focus:border-rose-500' : 'bg-red-950/20 border-red-500/50 text-red-300 focus:border-red-500'
                                    : isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500' : 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500'
                                }`}
                              />
                            </div>

                            {/* Dynamic Validation Message */}
                            <div className="flex items-center justify-between text-[11px] pt-0.5">
                              {val.status === 'valid' && (
                                <span className="text-emerald-500 flex items-center gap-1 font-mono font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                  {val.message}
                                </span>
                              )}
                              {(val.status === 'invalid' || val.status === 'mismatch') && (
                                <span className="text-red-500 flex items-center gap-1 font-medium">
                                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                  {val.message}
                                </span>
                              )}
                              {val.status === 'empty' && (
                                <span className="text-slate-400">
                                  Status: Empty (Hidden from checkout)
                                </span>
                              )}
                              
                              {val.isValid && (
                                <span className="text-slate-400 flex items-center gap-1 shrink-0">
                                  <QrCode className="w-3 h-3 text-emerald-500" />
                                  QR Auto-Ready
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleSaveCryptoSettings}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Crypto Settings</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* TAB: PAYSTACK PAYMENT GATEWAY SETTINGS */}
        {activeTab === 'paystack-settings' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top Overview Banner */}
            <div className={`p-6 rounded-3xl border space-y-4 shadow-sm ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-500 flex items-center justify-center">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Paystack Payment Gateway</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                        editablePaystack.enabled
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
                          : isLight ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {editablePaystack.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Accept Nigerian Cards, Virtual Bank Transfer, USSD, plus Global International Cards (Visa, Mastercard, Amex, Apple Pay).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Enable Paystack on Checkout:</span>
                  <button
                    type="button"
                    onClick={() => setEditablePaystack({ ...editablePaystack, enabled: !editablePaystack.enabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      editablePaystack.enabled ? 'bg-teal-500' : isLight ? 'bg-slate-300' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        editablePaystack.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* API Keys Configuration */}
            <div className={`p-6 rounded-3xl border space-y-6 shadow-sm ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div>
                <h4 className={`font-bold text-sm flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <Key className="w-4 h-4 text-teal-500" />
                  Paystack API Credentials (Live / Test)
                </h4>
                <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Get your keys from your <strong>Paystack Dashboard &rarr; Settings &rarr; API Keys & Webhooks</strong>. Use Test Keys (<code className="text-teal-500 dark:text-teal-300">pk_test_...</code>) for staging or Live Keys (<code className="text-emerald-500 dark:text-emerald-300">pk_live_...</code>) to process real payments.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Public Key */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={`font-bold flex items-center gap-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      <span>Public Key</span>
                      {(editablePaystack.publicKey || getPaystackEnvPublicKey()) && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                          ● Active {(editablePaystack.publicKey || getPaystackEnvPublicKey()).startsWith('pk_live_') ? 'Live' : 'Test'} Gateway
                        </span>
                      )}
                    </label>
                    <span className="text-[10px] text-slate-400">Client-Side Checkout</span>
                  </div>
                  <input
                    type="text"
                    value={editablePaystack.publicKey}
                    onChange={(e) => setEditablePaystack({ ...editablePaystack, publicKey: e.target.value })}
                    placeholder="pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className={`w-full px-4 py-3 border rounded-xl font-mono text-xs focus:border-teal-500 focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                  <span className={`text-[11px] block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {editablePaystack.publicKey 
                      ? 'Saved in database. Automatically syncs across all customer checkout sessions.' 
                      : 'Automatically utilizing system environment key fallback (PAYSTACK_PUBLIC_KEY).'}
                  </span>
                </div>

                {/* Secret Key */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={`font-bold flex items-center gap-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      <span>Secret Key</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                        ● Server Protected
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPaystackSecret(!showPaystackSecret)}
                      className="text-[10px] text-teal-500 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {showPaystackSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {showPaystackSecret ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPaystackSecret ? 'text' : 'password'}
                      value={editablePaystack.secretKey}
                      onChange={(e) => setEditablePaystack({ ...editablePaystack, secretKey: e.target.value })}
                      placeholder="sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      className={`w-full px-4 py-3 border rounded-xl font-mono text-xs focus:border-teal-500 focus:outline-none pr-10 ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                      }`}
                    />
                  </div>
                  <span className={`text-[11px] block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {editablePaystack.secretKey 
                      ? 'Custom secret key configured for webhook verification and settlement.'
                      : 'Utilizing environment variable PAYSTACK_SECRET_KEY for webhook verification.'}
                  </span>
                </div>
              </div>

              {/* Test Connection Button & Status */}
              <div className={`pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t pt-4 ${
                isLight ? 'border-slate-100' : 'border-slate-800'
              }`}>
                <button
                  type="button"
                  onClick={handleTestPaystackConnection}
                  disabled={paystackTestStatus?.loading}
                  className={`px-5 py-2.5 rounded-xl text-teal-600 dark:text-teal-300 font-bold text-xs flex items-center gap-2 border disabled:opacity-50 transition-colors ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 border-slate-700'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${paystackTestStatus?.loading ? 'animate-spin' : ''}`} />
                  <span>{paystackTestStatus?.loading ? 'Testing Connection...' : 'Test Paystack Connection'}</span>
                </button>

                {paystackTestStatus && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border max-w-xl ${
                    paystackTestStatus.success
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-300'
                  }`}>
                    {paystackTestStatus.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                    <span>{paystackTestStatus.message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Currency & Exchange Rate Configuration */}
            <div className={`p-6 rounded-3xl border space-y-6 shadow-sm ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
                <div>
                  <h4 className={`font-bold text-sm flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    <Coins className="w-4 h-4 text-amber-500" />
                    Currency Settlement Architecture & FX Engine
                  </h4>
                  <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Configure how dollar package amounts are presented and processed through your Paystack merchant gateway.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleFetchLiveForex}
                  disabled={isFetchingForex}
                  className={`px-4 py-2 text-teal-600 dark:text-teal-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors shrink-0 disabled:opacity-50 ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 border-slate-700'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFetchingForex ? 'animate-spin' : ''}`} />
                  <span>{isFetchingForex ? 'Fetching FX...' : 'Fetch Live Market FX'}</span>
                </button>
              </div>

              {/* Settlement Mode Selection */}
              <div className="space-y-2">
                <label className={`font-bold text-xs block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Select Paystack Settlement Mode:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Option 1: Auto Convert to NGN */}
                  <div
                    onClick={() => setEditablePaystack({ ...editablePaystack, currencyMode: 'auto_convert_ngn' })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      editablePaystack.currencyMode !== 'direct_usd'
                        ? 'bg-teal-500/10 border-teal-500 text-slate-900 dark:text-white shadow-lg shadow-teal-500/10'
                        : isLight ? 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-sm">
                        <span>⚡ Option 1: Dynamic Auto-Convert (Recommended)</span>
                      </span>
                      <span className="text-[10px] bg-teal-500/20 text-teal-600 dark:text-teal-300 px-2 py-0.5 rounded-full font-extrabold uppercase">
                        100% Card Acceptance
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                      Calculates the exact Naira equivalent at checkout using real-time interbank rates. Accepts <strong>All Nigerian Cards, Virtual Bank Transfer, USSD</strong>, and <strong>All Foreign Cards (USA, UK, Canada, Europe)</strong> without USD account rejection.
                    </p>
                  </div>

                  {/* Option 2: Direct USD */}
                  <div
                    onClick={() => setEditablePaystack({ ...editablePaystack, currencyMode: 'direct_usd' })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      editablePaystack.currencyMode === 'direct_usd'
                        ? 'bg-teal-500/10 border-teal-500 text-slate-900 dark:text-white shadow-lg shadow-teal-500/10'
                        : isLight ? 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-sm">
                        <span>🌐 Option 2: Direct USD Settlement</span>
                      </span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-300 px-2 py-0.5 rounded-full font-extrabold uppercase">
                        Requires USD Bank
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                      Sends direct USD currency charge requests to Paystack. Only supported if your registered Paystack business has an approved USD Domiciliary settlement bank account attached.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                {/* USD to NGN Exchange Rate */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      USD to NGN Exchange Rate
                    </label>
                    {liveForexInfo?.lastUpdated && (
                      <span className="text-[10px] text-teal-500">Live @ {liveForexInfo.lastUpdated}</span>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-slate-400 font-bold">₦</span>
                    <input
                      type="number"
                      value={editablePaystack.usdToNgnRate}
                      onChange={(e) => setEditablePaystack({ ...editablePaystack, usdToNgnRate: Number(e.target.value) || 0 })}
                      placeholder="1550"
                      className={`w-full pl-8 pr-4 py-3 border rounded-xl font-mono text-xs focus:border-teal-500 focus:outline-none ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                      }`}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="useLiveMarketRate"
                      checked={!!editablePaystack.useLiveMarketRate}
                      onChange={(e) => setEditablePaystack({ ...editablePaystack, useLiveMarketRate: e.target.checked })}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-teal-500 focus:ring-teal-500"
                    />
                    <label htmlFor="useLiveMarketRate" className={`text-[11px] cursor-pointer ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Auto-sync with live interbank FX rates
                    </label>
                  </div>
                </div>

                {/* Default Checkout Currency */}
                <div className="space-y-1.5">
                  <label className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Default Currency at Checkout</label>
                  <select
                    value={editablePaystack.defaultCurrency}
                    onChange={(e) => setEditablePaystack({ ...editablePaystack, defaultCurrency: e.target.value as 'NGN' | 'USD' })}
                    className={`w-full px-4 py-3 border rounded-xl text-xs focus:border-teal-500 focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  >
                    <option value="NGN">🇳🇬 NGN (Naira) - Auto-Converted for Universal Acceptance</option>
                    <option value="USD">🌐 USD ($) - Direct Dollar Charge</option>
                  </select>
                  <span className="text-[10px] text-slate-400 block">
                    Clients will see the package price converted with transparent currency badges.
                  </span>
                </div>

                {/* Accepted Payment Channels */}
                <div className="space-y-2">
                  <label className={`font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Accepted Payment Channels</label>
                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editablePaystack.allowNgnPayment}
                        onChange={(e) => setEditablePaystack({ ...editablePaystack, allowNgnPayment: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-teal-500 focus:ring-teal-500"
                      />
                      <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>Accept <strong>Nigerian Cards & Transfers</strong></span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editablePaystack.allowUsdPayment}
                        onChange={(e) => setEditablePaystack({ ...editablePaystack, allowUsdPayment: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-teal-500 focus:ring-teal-500"
                      />
                      <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>Accept <strong>Global Foreign Cards (Visa/MC/Amex)</strong></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Real-time Rate Preview Calculator */}
              <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className={`font-bold flex items-center justify-between ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  <span>Live Price Conversion Preview (Checkout View):</span>
                  <span className="text-teal-600 dark:text-teal-400 font-mono font-bold">$1 USD = ₦{(editablePaystack.usdToNgnRate || 1550).toLocaleString()} NGN</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
                  <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    <span className="text-slate-400 text-[10px] block">$70 Basic Package</span>
                    <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>₦{(70 * (editablePaystack.usdToNgnRate || 1550)).toLocaleString()}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    <span className="text-slate-400 text-[10px] block">$150 Standard Package</span>
                    <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>₦{(150 * (editablePaystack.usdToNgnRate || 1550)).toLocaleString()}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    <span className="text-slate-400 text-[10px] block">$300 Pro Package</span>
                    <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>₦{(300 * (editablePaystack.usdToNgnRate || 1550)).toLocaleString()}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    <span className="text-slate-400 text-[10px] block">$500 Premium Package</span>
                    <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>₦{(500 * (editablePaystack.usdToNgnRate || 1550)).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Webhook & Callback URLs Configuration */}
            <div className={`p-6 rounded-3xl border space-y-6 shadow-sm ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div>
                <div className="flex items-center justify-between">
                  <h4 className={`font-bold text-sm flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    <Zap className="w-4 h-4 text-amber-500" />
                    Live Webhook & Callback Configuration (Paystack Dashboard)
                  </h4>
                  <span className="text-[10px] bg-teal-500/20 text-teal-600 dark:text-teal-300 px-2.5 py-1 rounded-lg font-bold border border-teal-500/30">
                    Auto-Verification Active
                  </span>
                </div>
                <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Copy and paste these exact URLs into your <strong>Paystack Dashboard &rarr; Settings &rarr; API Keys & Webhooks</strong> tab under <em>Live Callback URL</em> and <em>Live Webhook URL</em>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Live Callback URL */}
                <div className={`space-y-1.5 p-4 rounded-2xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <label className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      <span>Live Callback URL</span>
                    </label>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">Redirects Customer</span>
                  </div>
                  <p className={`text-[11px] leading-tight ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Where Paystack returns the customer's browser immediately after they complete payment.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/`}
                      className={`flex-1 px-3 py-2 border rounded-xl font-mono text-xs select-all focus:outline-none ${
                        isLight ? 'bg-white border-slate-200 text-teal-700' : 'bg-slate-900 border-slate-700 text-teal-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(`${window.location.origin}/`, 'callback')}
                      className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer ${
                        isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      {copiedPaystackUrl === 'callback' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Live Webhook URL */}
                <div className={`space-y-1.5 p-4 rounded-2xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <label className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      <span>Live Webhook URL</span>
                    </label>
                    <span className="text-[10px] text-amber-500 font-mono">Server-to-Server Event</span>
                  </div>
                  <p className={`text-[11px] leading-tight ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Paystack's automated server notification sent instantly when a charge completes (`charge.success`).
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/api/payments/paystack/webhook`}
                      className={`flex-1 px-3 py-2 border rounded-xl font-mono text-xs select-all focus:outline-none ${
                        isLight ? 'bg-white border-slate-200 text-amber-700' : 'bg-slate-900 border-slate-700 text-amber-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(`${window.location.origin}/api/payments/paystack/webhook`, 'webhook')}
                      className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer ${
                        isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      {copiedPaystackUrl === 'webhook' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Webhook Activity & Real-time Logs */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className={`font-bold text-xs flex items-center gap-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    <Activity className="w-4 h-4 text-teal-500" />
                    <span>Recent Incoming Paystack Webhook Logs</span>
                  </div>
                  <button
                    type="button"
                    onClick={fetchWebhookLogs}
                    disabled={loadingWebhookLogs}
                    className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingWebhookLogs ? 'animate-spin' : ''}`} />
                    <span>Refresh Logs</span>
                  </button>
                </div>

                {webhookLogs.length === 0 ? (
                  <div className="py-4 text-center text-slate-400 text-xs">
                    No webhooks received yet. Once Paystack sends events (like test or live payments), they will be logged here automatically in real-time.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {webhookLogs.map((log: any) => (
                      <div key={log.id} className={`p-2.5 rounded-xl border text-xs flex items-center justify-between font-mono ${
                        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-600 dark:text-teal-300 text-[10px] font-bold">
                            {log.event}
                          </span>
                          <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>{log.reference || 'No Reference'}</span>
                          {log.amount && (
                            <span className="text-emerald-500 font-bold">
                              {log.currency || 'USD'} ${log.amount}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(log.receivedAt).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* International Payment Guide Callout */}
              <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                <div className="font-bold text-teal-600 dark:text-teal-300 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-teal-500" />
                  <span>How Webhooks Work & Protect Your Store</span>
                </div>
                <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Webhooks are essential because they notify your server when a client pays even if they accidentally close their browser tab before redirecting. Paystack calls your <strong>Live Webhook URL</strong> securely behind the scenes, ensuring 100% reliable order confirmations.
                </p>
              </div>

              <div className={`flex justify-end pt-4 border-t ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
                <button
                  type="button"
                  onClick={handleSavePaystackSettings}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Paystack Settings</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 7: PLATFORM & BANK SETTINGS */}
        {activeTab === 'platform-settings' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border space-y-6 shadow-sm ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <h3 className={`font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <MessageCircle className="w-5 h-5 text-blue-500" />
                VIP Contact Support Handles
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                These handles are automatically displayed to customers who require VIP manual verification after choosing a Bank Transfer payment method.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>WhatsApp Number (inc. country code)</label>
                  <input
                    type="text"
                    value={editableContact.whatsappNumber}
                    onChange={(e) => setEditableContact({ ...editableContact, whatsappNumber: e.target.value })}
                    placeholder="e.g. 1234567890"
                    className={`w-full px-4 py-3 text-xs border rounded-xl font-mono focus:border-blue-500 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Telegram Handle</label>
                  <input
                    type="text"
                    value={editableContact.telegramHandle}
                    onChange={(e) => setEditableContact({ ...editableContact, telegramHandle: e.target.value })}
                    placeholder="e.g. apexcreator"
                    className={`w-full px-4 py-3 text-xs border rounded-xl font-mono focus:border-blue-500 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => updateContactSettings(editableContact)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Save Contact Settings
              </button>
            </div>

            <div className={`p-6 rounded-3xl border space-y-6 shadow-sm ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <h3 className={`font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Building2 className="w-5 h-5 text-indigo-500" />
                Global Receiving Accounts
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Configure your USD, GBP, and EUR bank accounts. These are displayed dynamically during checkout when customers select "Bank Wire".
              </p>

              <div className={`flex items-center gap-2 border-b pb-4 ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
                {(['USD', 'GBP', 'EUR'] as const).map(curr => (
                  <button
                    key={curr}
                    onClick={() => setBankTab(curr)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      bankTab === curr
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                        : isLight ? 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {curr === 'USD' ? '🇺🇸' : curr === 'GBP' ? '🇬🇧' : '🇪🇺'} {curr} Account
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Beneficiary Name (Account Holder)</label>
                    <input
                      type="text"
                      value={editableBank[bankTab.toLowerCase() as keyof typeof editableBank].beneficiary || ''}
                      onChange={(e) => setEditableBank({
                        ...editableBank,
                        [bankTab.toLowerCase()]: { ...editableBank[bankTab.toLowerCase() as keyof typeof editableBank], beneficiary: e.target.value }
                      })}
                      className={`w-full px-4 py-3 border rounded-xl focus:border-indigo-500 ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Bank Name</label>
                    <input
                      type="text"
                      value={editableBank[bankTab.toLowerCase() as keyof typeof editableBank].bankName || ''}
                      onChange={(e) => setEditableBank({
                        ...editableBank,
                        [bankTab.toLowerCase()]: { ...editableBank[bankTab.toLowerCase() as keyof typeof editableBank], bankName: e.target.value }
                      })}
                      className={`w-full px-4 py-3 border rounded-xl focus:border-indigo-500 ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Account Number</label>
                    <input
                      type="text"
                      value={editableBank[bankTab.toLowerCase() as keyof typeof editableBank].accountNumber || ''}
                      onChange={(e) => setEditableBank({
                        ...editableBank,
                        [bankTab.toLowerCase()]: { ...editableBank[bankTab.toLowerCase() as keyof typeof editableBank], accountNumber: e.target.value }
                      })}
                      className={`w-full px-4 py-3 border rounded-xl font-mono focus:border-indigo-500 ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Account Type (Optional e.g. Checking)</label>
                    <input
                      type="text"
                      value={editableBank[bankTab.toLowerCase() as keyof typeof editableBank].accountType || ''}
                      onChange={(e) => setEditableBank({
                        ...editableBank,
                        [bankTab.toLowerCase()]: { ...editableBank[bankTab.toLowerCase() as keyof typeof editableBank], accountType: e.target.value }
                      })}
                      placeholder="e.g. Checking"
                      className={`w-full px-4 py-3 border rounded-xl focus:border-indigo-500 ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                      }`}
                    />
                  </div>

                  {bankTab === 'USD' && (
                    <>
                      <div className="space-y-1.5">
                        <label className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>ACH & Wire Routing Number (ABA)</label>
                        <input
                          type="text"
                          value={editableBank.usd.routingNumber || ''}
                          onChange={(e) => setEditableBank({
                            ...editableBank,
                            usd: { ...editableBank.usd, routingNumber: e.target.value, achRouting: e.target.value, wireRouting: e.target.value }
                          })}
                          className={`w-full px-4 py-3 border rounded-xl font-mono focus:border-indigo-500 ${
                            isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                          }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Bank Address</label>
                        <input
                          type="text"
                          value={editableBank.usd.bankAddress || ''}
                          onChange={(e) => setEditableBank({
                            ...editableBank,
                            usd: { ...editableBank.usd, bankAddress: e.target.value }
                          })}
                          placeholder="e.g. 1801 Main St., Kansas City, MO 64108"
                          className={`w-full px-4 py-3 border rounded-xl focus:border-indigo-500 ${
                            isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                          }`}
                        />
                      </div>
                    </>
                  )}

                  {bankTab === 'GBP' && (
                    <>
                      <div className="space-y-1.5">
                        <label className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Sort Code</label>
                        <input
                          type="text"
                          value={editableBank.gbp.sortCode || ''}
                          onChange={(e) => setEditableBank({
                            ...editableBank,
                            gbp: { ...editableBank.gbp, sortCode: e.target.value }
                          })}
                          className={`w-full px-4 py-3 border rounded-xl font-mono focus:border-indigo-500 ${
                            isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                          }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>IBAN</label>
                        <input
                          type="text"
                          value={editableBank.gbp.iban || ''}
                          onChange={(e) => setEditableBank({
                            ...editableBank,
                            gbp: { ...editableBank.gbp, iban: e.target.value }
                          })}
                          className={`w-full px-4 py-3 border rounded-xl font-mono focus:border-indigo-500 ${
                            isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                          }`}
                        />
                      </div>
                    </>
                  )}

                  {bankTab === 'EUR' && (
                    <>
                      <div className="space-y-1.5">
                        <label className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Sort Code</label>
                        <input
                          type="text"
                          value={editableBank.eur.sortCode || ''}
                          onChange={(e) => setEditableBank({
                            ...editableBank,
                            eur: { ...editableBank.eur, sortCode: e.target.value }
                          })}
                          className={`w-full px-4 py-3 border rounded-xl font-mono focus:border-indigo-500 ${
                            isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                          }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>IBAN</label>
                        <input
                          type="text"
                          value={editableBank.eur.iban || ''}
                          onChange={(e) => setEditableBank({
                            ...editableBank,
                            eur: { ...editableBank.eur, iban: e.target.value }
                          })}
                          className={`w-full px-4 py-3 border rounded-xl font-mono focus:border-indigo-500 ${
                            isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                          }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>SWIFT / BIC Code</label>
                        <input
                          type="text"
                          value={editableBank.eur.swiftCode || ''}
                          onChange={(e) => setEditableBank({
                            ...editableBank,
                            eur: { ...editableBank.eur, swiftCode: e.target.value }
                          })}
                          className={`w-full px-4 py-3 border rounded-xl font-mono focus:border-indigo-500 ${
                            isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                          }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Bank Address</label>
                        <input
                          type="text"
                          value={editableBank.eur.bankAddress || ''}
                          onChange={(e) => setEditableBank({
                            ...editableBank,
                            eur: { ...editableBank.eur, bankAddress: e.target.value }
                          })}
                          placeholder="Bank full address"
                          className={`w-full px-4 py-3 border rounded-xl focus:border-indigo-500 ${
                            isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                          }`}
                        />
                      </div>
                    </>
                  )}

                </div>
                <div className={`pt-4 border-t flex justify-end ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
                  <button
                    type="button"
                    onClick={() => updateBankSettings(editableBank)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                  >
                    Save All Bank Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: FIREBASE CLOUD FIRESTORE & AUTH */}
        {activeTab === 'firebase-settings' && (
          <AdminFirebaseSection />
        )}

        {/* TAB 8B: NEON POSTGRESQL CLOUD DATABASE */}
        {activeTab === 'database-settings' && (
          <AdminNeonDatabaseSection />
        )}

        {/* TAB 9: LIVE CHAT SUPPORT & SETTINGS */}
        {activeTab === 'live-chat' && (
          <LiveChatAdminSection />
        )}

      </div>

      {/* SERVICE EDIT MODAL */}
      {isEditingService && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl border rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Edit Service & Package Pricing</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className={isLight ? 'text-slate-700 font-semibold' : 'text-slate-400'}>Service Title</label>
                <input
                  type="text"
                  value={editingServiceData.title || ''}
                  onChange={(e) => setEditingServiceData({ ...editingServiceData, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={isLight ? 'text-slate-700 font-semibold' : 'text-slate-400'}>Category</label>
                <select
                  value={editingServiceData.category || 'YouTube'}
                  onChange={(e) => setEditingServiceData({ ...editingServiceData, category: e.target.value as ServiceCategory })}
                  className={`w-full px-3 py-2 rounded-xl border ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                >
                  <option value="YouTube">YouTube</option>
                  <option value="Twitch">Twitch</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Graphics & Branding">Graphics & Branding</option>
                </select>
              </div>

              <div>
                <label className={isLight ? 'text-slate-700 font-semibold' : 'text-slate-400'}>Basic Price ($ USD)</label>
                <input
                  type="number"
                  value={editingServiceData.packages?.BASIC?.price || 70}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setEditingServiceData({
                      ...editingServiceData,
                      packages: {
                        ...editingServiceData.packages!,
                        BASIC: { ...editingServiceData.packages!.BASIC, price: val }
                      }
                    });
                  }}
                  className={`w-full px-3 py-2 rounded-xl border ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={isLight ? 'text-slate-700 font-semibold' : 'text-slate-400'}>Standard Price ($ USD)</label>
                <input
                  type="number"
                  value={editingServiceData.packages?.STANDARD?.price || 230}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setEditingServiceData({
                      ...editingServiceData,
                      packages: {
                        ...editingServiceData.packages!,
                        STANDARD: { ...editingServiceData.packages!.STANDARD, price: val }
                      }
                    });
                  }}
                  className={`w-full px-3 py-2 rounded-xl border ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={isLight ? 'text-slate-700 font-semibold' : 'text-slate-400'}>Premium Price ($ USD)</label>
                <input
                  type="number"
                  value={editingServiceData.packages?.PREMIUM?.price || 460}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setEditingServiceData({
                      ...editingServiceData,
                      packages: {
                        ...editingServiceData.packages!,
                        PREMIUM: { ...editingServiceData.packages!.PREMIUM, price: val }
                      }
                    });
                  }}
                  className={`w-full px-3 py-2 rounded-xl border ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsEditingService(false)} className={`px-4 py-2 rounded-xl text-xs ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-300'
              }`}>Cancel</button>
              <button
                onClick={() => {
                  if (editingServiceData.id && editingServiceData.title) {
                    saveService(editingServiceData as ServiceItem);
                    setIsEditingService(false);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-500/20"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROOF EDIT MODAL WITH FILE UPLOAD & LIVE PREVIEW */}
      {isEditingProof && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl border rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            
            <div className={`flex items-center justify-between border-b pb-4 ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {editingProofData.id && proofs.some((p) => p.id === editingProofData.id)
                    ? 'Edit Work Proof Entry'
                    : 'Publish New Work Proof Showcase'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditingProof(false)}
                className={`p-2 rounded-xl border ${
                  isLight ? 'bg-slate-100 text-slate-500 hover:text-slate-900 border-slate-200' : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
                }`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Title & Service Delivered */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Project / Proof Title</label>
                  <input
                    type="text"
                    required
                    value={editingProofData.title || ''}
                    onChange={(e) => setEditingProofData({ ...editingProofData, title: e.target.value })}
                    placeholder="e.g. 500K Subscriber Channel Overhaul"
                    className={`w-full px-3.5 py-2.5 rounded-xl border focus:border-amber-500 focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Service Delivered</label>
                  <input
                    type="text"
                    value={editingProofData.serviceProvided || ''}
                    onChange={(e) => setEditingProofData({ ...editingProofData, serviceProvided: e.target.value })}
                    placeholder="e.g. Channel Branding & Banner Design"
                    className={`w-full px-3.5 py-2.5 rounded-xl border focus:border-amber-500 focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>
              </div>

              {/* Platform & Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Platform</label>
                  <select
                    value={editingProofData.platform || 'YouTube'}
                    onChange={(e) => setEditingProofData({ ...editingProofData, platform: e.target.value as any })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border focus:border-amber-500 focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="Twitch">Twitch</option>
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Branding">Branding</option>
                    <option value="Graphics">Graphics</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Service Category</label>
                  <select
                    value={editingProofData.category || 'YouTube Services'}
                    onChange={(e) => setEditingProofData({ ...editingProofData, category: e.target.value as any })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border focus:border-amber-500 focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  >
                    <option value="YouTube Services">YouTube Services</option>
                    <option value="Graphics & Branding">Graphics & Branding</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Twitch & Kick">Twitch & Kick</option>
                    <option value="Channel Growth & SEO">Channel Growth & SEO</option>
                    <option value="Social Media Management">Social Media Management</option>
                    <option value="Growth & Optimization">Growth & Optimization</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Date Completed</label>
                  <input
                    type="date"
                    value={editingProofData.dateCompleted || ''}
                    onChange={(e) => setEditingProofData({ ...editingProofData, dateCompleted: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border focus:border-amber-500 focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Description / Case Study Details</label>
                <textarea
                  rows={3}
                  value={editingProofData.description || ''}
                  onChange={(e) => setEditingProofData({ ...editingProofData, description: e.target.value })}
                  placeholder="Describe the client initial state, strategy applied, and final result achieved..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:border-amber-500 focus:outline-none ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
              </div>

              {/* BEFORE IMAGE UPLOADER */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <label className={`font-extrabold flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    <Upload className="w-4 h-4 text-amber-500" />
                    <span>Before Image (Initial State Screenshot)</span>
                  </label>
                  {editingProofData.beforeImage && (
                    <button
                      type="button"
                      onClick={() => setEditingProofData({ ...editingProofData, beforeImage: '' })}
                      className="text-rose-500 text-xs font-semibold hover:underline"
                    >
                      Clear Image
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-stretch">
                  {/* Primary Gallery Upload Button Card */}
                  <div className="sm:col-span-8">
                    <label className="relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-amber-500/5 hover:bg-amber-500/10 rounded-2xl cursor-pointer transition-all text-center group h-32">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditingProofData((prev) => ({ ...prev, beforeImage: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="sr-only"
                      />
                      <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-500 group-hover:scale-110 transition-transform mb-1.5">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className={`text-xs font-bold ${isLight ? 'text-slate-900 group-hover:text-amber-600' : 'text-white group-hover:text-amber-300'}`}>
                        📁 Choose Photo from Gallery / Device
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        Tap to open camera or photo gallery (JPG, PNG, WEBP)
                      </span>
                    </label>
                  </div>

                  {/* Thumbnail Preview */}
                  <div className={`sm:col-span-4 h-32 rounded-2xl border overflow-hidden flex items-center justify-center relative ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                  }`}>
                    {editingProofData.beforeImage ? (
                      <img src={editingProofData.beforeImage} alt="Before Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="text-center p-2 text-slate-400 text-xs font-medium">No Before Image</div>
                    )}
                  </div>
                </div>

                {/* Optional URL Paste */}
                <details className="text-[11px] text-slate-400 pt-1">
                  <summary className="cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 font-medium">Or paste an image web URL instead...</summary>
                  <input
                    type="url"
                    value={editingProofData.beforeImage || ''}
                    onChange={(e) => setEditingProofData({ ...editingProofData, beforeImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className={`w-full mt-2 px-3 py-2 rounded-xl border focus:outline-none focus:border-amber-500 ${
                      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                    }`}
                  />
                </details>
              </div>

              {/* AFTER / RESULT IMAGE UPLOADER */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <label className={`font-extrabold flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    <Upload className="w-4 h-4 text-emerald-500" />
                    <span>After / Result Image (Optimized Outcome Screenshot)</span>
                  </label>
                  {(editingProofData.afterImage || editingProofData.resultImage) && (
                    <button
                      type="button"
                      onClick={() => setEditingProofData({ ...editingProofData, afterImage: '', resultImage: '' })}
                      className="text-rose-500 text-xs font-semibold hover:underline"
                    >
                      Clear Image
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-stretch">
                  {/* Primary Gallery Upload Button Card */}
                  <div className="sm:col-span-8">
                    <label className="relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-2xl cursor-pointer transition-all text-center group h-32">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const res = reader.result as string;
                              setEditingProofData((prev) => ({ ...prev, afterImage: res, resultImage: res }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="sr-only"
                      />
                      <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-500 group-hover:scale-110 transition-transform mb-1.5">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className={`text-xs font-bold ${isLight ? 'text-slate-900 group-hover:text-emerald-600' : 'text-white group-hover:text-emerald-300'}`}>
                        📁 Choose Photo from Gallery / Device
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        Tap to open camera or photo gallery (JPG, PNG, WEBP)
                      </span>
                    </label>
                  </div>

                  {/* Thumbnail Preview */}
                  <div className={`sm:col-span-4 h-32 rounded-2xl border overflow-hidden flex items-center justify-center relative ${
                    isLight ? 'bg-white border-emerald-500/30' : 'bg-slate-900 border-emerald-500/30'
                  }`}>
                    {editingProofData.afterImage || editingProofData.resultImage ? (
                      <img src={editingProofData.afterImage || editingProofData.resultImage} alt="After Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="text-center p-2 text-slate-400 text-xs font-medium">No After Image</div>
                    )}
                  </div>
                </div>

                {/* Optional URL Paste */}
                <details className="text-[11px] text-slate-400 pt-1">
                  <summary className="cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 font-medium">Or paste an image web URL instead...</summary>
                  <input
                    type="url"
                    value={editingProofData.afterImage || editingProofData.resultImage || ''}
                    onChange={(e) => setEditingProofData({ ...editingProofData, afterImage: e.target.value, resultImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className={`w-full mt-2 px-3 py-2 rounded-xl border focus:outline-none focus:border-emerald-500 ${
                      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                    }`}
                  />
                </details>
              </div>

              {/* Visibility Switch */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="proof-hidden-check"
                  checked={!editingProofData.hidden}
                  onChange={(e) => setEditingProofData({ ...editingProofData, hidden: !e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-slate-300"
                />
                <label htmlFor="proof-hidden-check" className={`font-bold cursor-pointer ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  Publish publicly on Proof Page & Home Showcase
                </label>
              </div>

            </div>

            <div className={`flex items-center justify-end gap-3 border-t pb-2 pt-4 ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
              <button
                type="button"
                onClick={() => setIsEditingProof(false)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={() => {
                  if (!editingProofData.title) return;
                  saveProof(editingProofData as ProofItem);
                  setIsEditingProof(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20"
              >
                Save Work Proof Entry
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TESTIMONIAL EDIT MODAL */}
      {isEditingTestimonial && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-md border rounded-3xl p-6 space-y-4 shadow-2xl ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Edit Testimonial</h3>
            <div className="space-y-3 text-xs">
              <input
                type="text"
                value={editingTestimonialData.name || ''}
                onChange={(e) => setEditingTestimonialData({ ...editingTestimonialData, name: e.target.value })}
                placeholder="Client Name"
                className={`w-full px-3 py-2 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                }`}
              />
              <textarea
                value={editingTestimonialData.testimonial || ''}
                onChange={(e) => setEditingTestimonialData({ ...editingTestimonialData, testimonial: e.target.value })}
                placeholder="Testimonial text..."
                className={`w-full px-3 py-2 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                }`}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditingTestimonial(false)} className={`px-4 py-2 rounded-xl text-xs ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-300'
              }`}>Cancel</button>
              <button
                onClick={() => {
                  saveTestimonial(editingTestimonialData as Testimonial);
                  setIsEditingTestimonial(false);
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 font-bold text-xs text-white shadow-lg shadow-blue-500/20"
              >
                Save Testimonial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ EDIT MODAL */}
      {isEditingFAQ && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-md border rounded-3xl p-6 space-y-4 shadow-2xl ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Edit FAQ</h3>
            <div className="space-y-3 text-xs">
              <input
                type="text"
                value={editingFAQData.question || ''}
                onChange={(e) => setEditingFAQData({ ...editingFAQData, question: e.target.value })}
                placeholder="Question"
                className={`w-full px-3 py-2 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                }`}
              />
              <textarea
                value={editingFAQData.answer || ''}
                onChange={(e) => setEditingFAQData({ ...editingFAQData, answer: e.target.value })}
                placeholder="Answer"
                className={`w-full px-3 py-2 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                }`}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditingFAQ(false)} className={`px-4 py-2 rounded-xl text-xs ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-300'
              }`}>Cancel</button>
              <button
                onClick={() => {
                  saveFAQ(editingFAQData as FAQItem);
                  setIsEditingFAQ(false);
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 font-bold text-xs text-white shadow-lg shadow-blue-500/20"
              >
                Save FAQ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
