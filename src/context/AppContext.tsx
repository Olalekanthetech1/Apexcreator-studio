import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ServiceItem,
  ProofItem,
  Testimonial,
  FAQItem,
  Order,
  ServiceCategory,
  PackageOption,
  OrderStatus,
  DeliverableFile,
  CaseStudy,
  TeamMember,
  InsightArticle,
  CryptoGatewaySettings,
  PaystackSettings,
  ContactSettings,
  BankSettings,
  BankAccountDetails,
  ChatConfig,
  ChatMessageData,
  ChatSessionData
} from '../types';
import { DEFAULT_CRYPTO_SETTINGS } from '../data/cryptoDefaults';
import { DEFAULT_CHAT_CONFIG } from '../data/initialData';
import {
  subscribeToOrders,
  saveOrderToFirestore,
  isFirebaseConfigured,
  firebaseConfig,
  subscribeToServices,
  fetchServicesFromFirestore,
  saveServiceToFirestore,
  deleteServiceFromFirestore,
  fetchCaseStudiesFromFirestore,
  fetchTeamFromFirestore,
  fetchInsightsFromFirestore,
  fetchProofsFromFirestore,
  fetchTestimonialsFromFirestore,
  fetchFaqsFromFirestore
} from '../services/firebase';

export type AppView =
  | 'home'
  | 'services'
  | 'pricing'
  | 'how-it-works'
  | 'proofs'
  | 'about'
  | 'case-studies'
  | 'insights'
  | 'contact'
  | 'my-orders'
  | 'checkout'
  | 'admin';

interface ToastInfo {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentView: AppView;
  setView: (view: AppView) => void;
  selectedCategory: ServiceCategory | 'All';
  setSelectedCategory: (cat: ServiceCategory | 'All') => void;
  services: ServiceItem[];
  proofs: ProofItem[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  orders: Order[];
  caseStudies: CaseStudy[];
  team: TeamMember[];
  insights: InsightArticle[];
  
  selectedService: ServiceItem | null;
  isDetailModalOpen: boolean;
  openServiceDetail: (service: ServiceItem) => void;
  closeServiceDetail: () => void;
  
  isOrderFormOpen: boolean;
  orderFormPrefill: {
    service?: ServiceItem;
    packageType?: PackageOption;
  } | null;
  openOrderForm: (service?: ServiceItem, packageType?: PackageOption) => void;
  closeOrderForm: () => void;
  
  pendingCheckoutOrder: Order | null;
  setPendingCheckoutOrder: (order: Order | null) => void;
  
  activeCustomerEmail: string;
  setCustomerEmail: (email: string) => void;
  
  autoVerifyPayments: boolean;
  toggleAutoVerifyPayments: () => void;
  
  cryptoSettings: CryptoGatewaySettings;
  updateCryptoSettings: (newSettings: Partial<CryptoGatewaySettings>) => void;

  paystackSettings: PaystackSettings;
  updatePaystackSettings: (newSettings: Partial<PaystackSettings>) => void;

  contactSettings: ContactSettings;
  updateContactSettings: (newSettings: Partial<ContactSettings>) => void;

  bankSettings: BankSettings;
  updateBankSettings: (newSettings: Partial<BankSettings>) => void;

  chatConfig: ChatConfig;
  updateChatConfig: (newSettings: Partial<ChatConfig>) => void;
  
  isAdminLoggedIn: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  
  toast: ToastInfo | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  
  // Data Mutations
  submitOrder: (data: {
    customerName: string;
    email: string;
    category: ServiceCategory;
    serviceId: string;
    serviceTitle: string;
    packageType: PackageOption;
    price: number;
    offeredPrice?: number;
    isNegotiatedPrice?: boolean;
    negotiationNote?: string;
    socialUrl: string;
    projectDescription: string;
    preferredDeliveryDate: string;
  }) => Order;
  
  processPayment: (orderId: string, paymentMethod?: string, paymentReference?: string) => void;
  submitPaymentForVerification: (orderId: string, paymentMethod: string, paymentReference?: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addOrderMessage: (orderId: string, text: string, sender: 'customer' | 'admin') => void;
  uploadDeliverable: (orderId: string, deliverable: { title: string; downloadUrl: string; fileSize?: string; note?: string }) => void;
  
  saveService: (service: ServiceItem) => void;
  deleteService: (serviceId: string) => void;
  updatePackagePricing: (serviceId: string, packageType: PackageOption, price: number, features: string[]) => void;
  
  saveProof: (proof: ProofItem) => void;
  deleteProof: (proofId: string) => void;
  
  saveTestimonial: (testimonial: Testimonial) => void;
  deleteTestimonial: (testimonialId: string) => void;
  
  saveFAQ: (faq: FAQItem) => void;
  deleteFAQ: (faqId: string) => void;
  
  resetDataToDefaults: () => void;

  // AI Recommendations
  getAiRecommendation: (data: {
    channelUrl: string;
    niche: string;
    goals: string;
    currentChallenges: string;
  }) => Promise<{
    analysis: string;
    recommendations: {
      serviceId: string;
      reason: string;
      expectedImpact: string;
    }[];
    proTip: string;
  } | null>;

  // Neon DB Integration
  dbStatus: {
    connected: boolean;
    databaseUrlConfigured: boolean;
    provider: string;
    error: string | null;
    ordersCount: number;
    settingsCount: number;
  } | null;
  refreshDbStatus: () => Promise<void>;
  saveDatabaseUrl: (url: string) => Promise<{ success: boolean; message: string }>;

  // Firebase Firestore Integration
  isFirebaseConnected: boolean;
  firebaseProjectId: string;
}

const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  whatsappNumber: '1234567890',
  telegramHandle: 'apexcreator'
};

// Declare global injected key from vite define or window
declare const __PAYSTACK_PUBLIC_KEY__: string | undefined;

export function getPaystackEnvPublicKey(): string {
  if (typeof window !== 'undefined') {
    const fromWindow = (window as any)?.__APP_ENV__?.PAYSTACK_PUBLIC_KEY;
    if (fromWindow && typeof fromWindow === 'string' && fromWindow.trim()) {
      return fromWindow.trim();
    }
  }
  try {
    if (typeof __PAYSTACK_PUBLIC_KEY__ !== 'undefined' && __PAYSTACK_PUBLIC_KEY__) {
      return String(__PAYSTACK_PUBLIC_KEY__).trim();
    }
  } catch {}
  try {
    const viteKey = (import.meta as any)?.env?.VITE_PAYSTACK_PUBLIC_KEY;
    if (viteKey && typeof viteKey === 'string' && viteKey.trim()) {
      return viteKey.trim();
    }
  } catch {}
  return '';
}

const DEFAULT_PAYSTACK_SETTINGS: PaystackSettings = {
  enabled: true,
  publicKey: getPaystackEnvPublicKey(),
  secretKey: '',
  usdToNgnRate: 1550,
  allowUsdPayment: true,
  allowNgnPayment: true,
  defaultCurrency: 'NGN',
  currencyMode: 'auto_convert_ngn',
  useLiveMarketRate: false
};

const DEFAULT_BANK_SETTINGS: BankSettings = {
  usd: {
    currency: 'USD',
    beneficiary: 'reuben sunday yisa',
    bankName: 'Lead',
    accountType: 'Checking',
    accountNumber: '218146795820',
    routingNumber: '101019644',
    achRouting: '101019644',
    wireRouting: '101019644',
    bankAddress: '1801 Main St., Kansas City, MO 64108'
  },
  gbp: {
    currency: 'GBP',
    beneficiary: 'reuben sunday yisa',
    bankName: 'Clear Junction Limited',
    accountNumber: '43448333',
    sortCode: '041307',
    iban: 'GB92CLJU04130743448333'
  },
  eur: {
    currency: 'EUR',
    beneficiary: 'reuben sunday yisa',
    bankName: 'Clear Junction Limited',
    accountNumber: '43448333',
    sortCode: '041307',
    iban: 'GB92CLJU04130743448333',
    swiftCode: 'CLJUGB21XXX',
    bankAddress: '4th Floor Imperial House, 15 Kingsway, London, United Kingdom, WC2B 6UN'
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('apex_theme') || localStorage.getItem('denny_theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return 'dark'; // Sleek dark theme default for ApexCreator Studio
  });
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    if (path.includes('/admin') || hash.includes('admin') || search.includes('admin')) {
      return 'admin';
    }
    const saved = localStorage.getItem('apex_current_view') || localStorage.getItem('denny_current_view');
    return (saved as AppView) || 'home';
  });

  // Global URL & Hotkey Router for Admin Access
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (path.includes('/admin') || hash.includes('admin') || search.includes('admin')) {
        setCurrentView('admin');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Hotkey: Ctrl+Shift+A or Cmd+Shift+A or Alt+A to open admin panel
      if ((e.ctrlKey || e.metaKey || e.altKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setCurrentView('admin');
        window.history.pushState({}, '', '/admin');
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('apex_theme', theme);
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('apex_current_view', currentView);
  }, [currentView]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'All'>('All');
  
  // Dynamic Content Stores (Fetched from Neon DB)
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [proofs, setProofs] = useState<ProofItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [insights, setInsights] = useState<InsightArticle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [isContentLoading, setIsContentLoading] = useState(true);

  // Helper to fetch all dynamic content from database
  const fetchAllContent = async () => {
    setIsContentLoading(true);
    try {
      const [
        servicesRes,
        caseStudiesRes,
        teamRes,
        insightsRes,
        proofsRes,
        testimonialsRes,
        faqsRes,
        ordersRes,
      ] = await Promise.all([
        fetch('/api/content/services').then(r => r.json()).catch(() => ({ success: false, services: [] })),
        fetch('/api/content/case-studies').then(r => r.json()).catch(() => ({ success: false, caseStudies: [] })),
        fetch('/api/content/team').then(r => r.json()).catch(() => ({ success: false, team: [] })),
        fetch('/api/content/insights').then(r => r.json()).catch(() => ({ success: false, insights: [] })),
        fetch('/api/content/proofs').then(r => r.json()).catch(() => ({ success: false, proofs: [] })),
        fetch('/api/content/testimonials').then(r => r.json()).catch(() => ({ success: false, testimonials: [] })),
        fetch('/api/content/faqs').then(r => r.json()).catch(() => ({ success: false, faqs: [] })),
        fetch('/api/orders').then(r => r.json()).catch(() => ({ success: false, orders: [] })),
      ]);

      if (servicesRes.success && servicesRes.services?.length > 0) {
        setServices(servicesRes.services);
      } else {
        const firestoreServices = await fetchServicesFromFirestore();
        if (firestoreServices.length > 0) setServices(firestoreServices);
      }

      if (caseStudiesRes.success && caseStudiesRes.caseStudies?.length > 0) {
        setCaseStudies(caseStudiesRes.caseStudies);
      } else {
        const fsCaseStudies = await fetchCaseStudiesFromFirestore();
        if (fsCaseStudies.length > 0) setCaseStudies(fsCaseStudies);
      }

      if (teamRes.success && teamRes.team?.length > 0) {
        setTeam(teamRes.team);
      } else {
        const fsTeam = await fetchTeamFromFirestore();
        if (fsTeam.length > 0) setTeam(fsTeam);
      }

      if (insightsRes.success && insightsRes.insights?.length > 0) {
        setInsights(insightsRes.insights);
      } else {
        const fsInsights = await fetchInsightsFromFirestore();
        if (fsInsights.length > 0) setInsights(fsInsights);
      }

      if (proofsRes.success && proofsRes.proofs?.length > 0) {
        setProofs(proofsRes.proofs);
      } else {
        const fsProofs = await fetchProofsFromFirestore();
        if (fsProofs.length > 0) setProofs(fsProofs);
      }

      if (testimonialsRes.success && testimonialsRes.testimonials?.length > 0) {
        setTestimonials(testimonialsRes.testimonials);
      } else {
        const fsTestimonials = await fetchTestimonialsFromFirestore();
        if (fsTestimonials.length > 0) setTestimonials(fsTestimonials);
      }

      if (faqsRes.success && faqsRes.faqs?.length > 0) {
        setFaqs(faqsRes.faqs);
      } else {
        const fsFaqs = await fetchFaqsFromFirestore();
        if (fsFaqs.length > 0) setFaqs(fsFaqs);
      }

      if (ordersRes.success && Array.isArray(ordersRes.orders)) {
        setOrders(ordersRes.orders.map((ord: Order) => ({
          ...ord,
          deliverables: Array.isArray(ord.deliverables) ? ord.deliverables : [],
          messages: Array.isArray(ord.messages) ? ord.messages : []
        })));
      }
    } catch (err) {
      console.warn('Failed to fetch dynamic content:', err);
    } finally {
      setIsContentLoading(false);
    }
  };

  // Real-time Firestore subscriptions for live services and catalog updates
  useEffect(() => {
    const unsubServices = subscribeToServices((liveServices) => {
      if (liveServices && liveServices.length > 0) {
        setServices(liveServices);
      }
    });
    return () => {
      unsubServices();
    };
  }, []);

  const getAiRecommendation = async (data: any) => {
    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      return result.success ? result.recommendation : null;
    } catch (err) {
      console.error('AI Recommendation fetch error:', err);
      return null;
    }
  };

  // UI Modals & State
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState<boolean>(false);
  const [orderFormPrefill, setOrderFormPrefill] = useState<{ service?: ServiceItem; packageType?: PackageOption } | null>(null);
  const [pendingCheckoutOrder, setPendingCheckoutOrder] = useState<Order | null>(null);
  
  const [activeCustomerEmail, setActiveCustomerEmail] = useState<string>(() => {
    return localStorage.getItem('denny_customer_email') || '';
  });

  const [autoVerifyPayments, setAutoVerifyPayments] = useState<boolean>(() => {
    const saved = localStorage.getItem('denny_auto_verify');
    return saved === null ? true : saved === 'true';
  });

  const toggleAutoVerifyPayments = () => {
    setAutoVerifyPayments((prev) => {
      const next = !prev;
      localStorage.setItem('denny_auto_verify', String(next));
      syncSettingToServer('autoVerify', next);
      showToast(
        next
          ? 'Automated Payment Verification ENABLED. Orders will confirm instantly.'
          : 'Manual Payment Verification ENABLED. Admin must audit each payment.',
        'info'
      );
      return next;
    });
  };

  const [cryptoSettings, setCryptoSettings] = useState<CryptoGatewaySettings>(() => {
    const saved = localStorage.getItem('denny_crypto_settings_v2');
    if (!saved) return DEFAULT_CRYPTO_SETTINGS;
    try {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.coins)) {
        return parsed;
      }
      return DEFAULT_CRYPTO_SETTINGS;
    } catch {
      return DEFAULT_CRYPTO_SETTINGS;
    }
  });

  const updateCryptoSettings = (newSettings: Partial<CryptoGatewaySettings>) => {
    setCryptoSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('denny_crypto_settings_v2', JSON.stringify(updated));
      syncSettingToServer('crypto', updated);
      return updated;
    });
    showToast('Crypto Gateway settings updated successfully!', 'success');
  };

  useEffect(() => {
    localStorage.setItem('denny_crypto_settings_v2', JSON.stringify(cryptoSettings));
  }, [cryptoSettings]);

  const [contactSettings, setContactSettings] = useState<ContactSettings>(() => {
    const saved = localStorage.getItem('denny_contact_settings');
    if (!saved) return DEFAULT_CONTACT_SETTINGS;
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_CONTACT_SETTINGS;
    }
  });

  const updateContactSettings = (newSettings: Partial<ContactSettings>) => {
    setContactSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('denny_contact_settings', JSON.stringify(updated));
      syncSettingToServer('contact', updated);
      return updated;
    });
    showToast('Contact settings updated successfully!', 'success');
  };

  useEffect(() => {
    localStorage.setItem('denny_contact_settings', JSON.stringify(contactSettings));
  }, [contactSettings]);

  const [bankSettings, setBankSettings] = useState<BankSettings>(() => {
    const saved = localStorage.getItem('denny_bank_settings_v2');
    if (!saved) {
      localStorage.removeItem('denny_bank_settings');
      return DEFAULT_BANK_SETTINGS;
    }
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.usd && parsed.usd.bankName === 'Lead' && parsed.usd.beneficiary === 'reuben sunday yisa') {
        return parsed;
      }
      return DEFAULT_BANK_SETTINGS;
    } catch {
      return DEFAULT_BANK_SETTINGS;
    }
  });

  const [chatConfig, setChatConfig] = useState<ChatConfig>(() => {
    const saved = localStorage.getItem('denny_chat_config');
    if (!saved) return DEFAULT_CHAT_CONFIG;
    try {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_CHAT_CONFIG,
        ...parsed,
        businessHours: {
          ...DEFAULT_CHAT_CONFIG.businessHours,
          ...(parsed?.businessHours || {})
        }
      };
    } catch {
      return DEFAULT_CHAT_CONFIG;
    }
  });

  const updateChatConfig = (newSettings: Partial<ChatConfig>) => {
    setChatConfig((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('denny_chat_config', JSON.stringify(updated));
      syncSettingToServer('chat', updated);
      return updated;
    });
    showToast('Chat configuration updated successfully!', 'success');
  };

  useEffect(() => {
    localStorage.setItem('denny_chat_config', JSON.stringify(chatConfig));
  }, [chatConfig]);

  const updateBankSettings = (newSettings: Partial<BankSettings>) => {
    setBankSettings((prev) => {
      const updated = { ...prev, ...(newSettings as BankSettings) };
      localStorage.setItem('denny_bank_settings_v2', JSON.stringify(updated));
      syncSettingToServer('bank', updated);
      return updated;
    });
    showToast('Bank settings updated successfully!', 'success');
  };

  useEffect(() => {
    localStorage.setItem('denny_bank_settings_v2', JSON.stringify(bankSettings));
  }, [bankSettings]);

  const [paystackSettings, setPaystackSettings] = useState<PaystackSettings>(() => {
    const envKey = getPaystackEnvPublicKey();
    const saved = localStorage.getItem('denny_paystack_settings');
    if (!saved) {
      return {
        ...DEFAULT_PAYSTACK_SETTINGS,
        publicKey: envKey || DEFAULT_PAYSTACK_SETTINGS.publicKey
      };
    }
    try {
      const parsed = JSON.parse(saved);
      const savedKey = (parsed.publicKey || '').trim();
      return {
        ...DEFAULT_PAYSTACK_SETTINGS,
        ...parsed,
        publicKey: savedKey || envKey || DEFAULT_PAYSTACK_SETTINGS.publicKey
      };
    } catch {
      return {
        ...DEFAULT_PAYSTACK_SETTINGS,
        publicKey: envKey
      };
    }
  });

  const updatePaystackSettings = (newSettings: Partial<PaystackSettings>) => {
    setPaystackSettings((prev) => {
      const envKey = getPaystackEnvPublicKey();
      const updatedKey = (newSettings.publicKey && newSettings.publicKey.trim())
        ? newSettings.publicKey.trim()
        : (prev.publicKey || envKey);

      const updated: PaystackSettings = {
        ...prev,
        ...newSettings,
        publicKey: updatedKey
      };
      localStorage.setItem('denny_paystack_settings', JSON.stringify(updated));
      syncSettingToServer('paystack', updated);
      return updated;
    });
    showToast('Paystack settings updated successfully!', 'success');
  };

  useEffect(() => {
    localStorage.setItem('denny_paystack_settings', JSON.stringify(paystackSettings));
  }, [paystackSettings]);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('denny_admin_session') === 'true';
  });

  const [toast, setToast] = useState<ToastInfo | null>(null);

  // Neon DB Connection Status State
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    databaseUrlConfigured: boolean;
    provider: string;
    error: string | null;
    ordersCount: number;
    settingsCount: number;
  } | null>(null);

  // Helper to fetch DB status
  const refreshDbStatus = async () => {
    try {
      const res = await fetch('/api/db/status');
      const data = await res.json();
      if (data.success && data.status) {
        setDbStatus(data.status);
      }
    } catch (err) {
      console.warn('Could not query Neon DB status:', err);
    }
  };

  // Helper to test / save custom database URL
  const saveDatabaseUrl = async (url: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/db/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ databaseUrl: url.trim() })
      });
      const data = await res.json();
      if (data.status) {
        setDbStatus(data.status);
      }
      return {
        success: !!data.success,
        message: data.message || (data.success ? 'Connected to Neon PostgreSQL!' : 'Failed to connect')
      };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error connecting to database.' };
    }
  };

  // Helper to sync setting to server / Neon DB
  const syncSettingToServer = async (key: string, value: any) => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
    } catch (e) {
      console.warn(`Failed to sync setting '${key}' to server:`, e);
    }
  };

  // Helper to sync order to server / Neon DB & Firebase Firestore
  const syncOrderToServer = async (order: Order) => {
    try {
      // 1. Sync to Firebase Cloud Firestore (realtime)
      saveOrderToFirestore(order).catch((err) =>
        console.warn(`Firestore sync note for order ${order.id}:`, err)
      );

      // 2. Sync to Server / Neon PostgreSQL
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
    } catch (e) {
      console.warn(`Failed to sync order ${order.id} to server:`, e);
    }
  };

  // Initial Load: Fetch remote central settings and orders from server / Neon DB
  useEffect(() => {
    refreshDbStatus();
    fetchAllContent();

    // 1. Fetch Central Settings
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          const envKey = getPaystackEnvPublicKey();
          if (data.settings.paystack) {
            setPaystackSettings((prev) => {
              const remoteKey = (data.settings.paystack.publicKey || '').trim();
              const resolvedKey = remoteKey || prev.publicKey || envKey;
              const merged = {
                ...prev,
                ...data.settings.paystack,
                publicKey: resolvedKey,
                secretKey: (data.settings.paystack.secretKey || prev.secretKey || '').trim()
              };
              localStorage.setItem('denny_paystack_settings', JSON.stringify(merged));
              return merged;
            });
          } else if (envKey) {
            setPaystackSettings((prev) => {
              const merged = { ...prev, publicKey: envKey, enabled: true };
              localStorage.setItem('denny_paystack_settings', JSON.stringify(merged));
              return merged;
            });
          }
          if (data.settings.crypto) {
            setCryptoSettings((prev) => ({ ...prev, ...data.settings.crypto }));
          }
          if (data.settings.bank) {
            setBankSettings((prev) => ({ ...prev, ...data.settings.bank }));
          }
          if (data.settings.contact) {
            setContactSettings((prev) => ({ ...prev, ...data.settings.contact }));
          }
          if (data.settings.autoVerify !== undefined) {
            setAutoVerifyPayments(data.settings.autoVerify);
          }
          if (data.settings.chat) {
            setChatConfig((prev) => ({
              ...DEFAULT_CHAT_CONFIG,
              ...prev,
              ...data.settings.chat,
              businessHours: {
                ...DEFAULT_CHAT_CONFIG.businessHours,
                ...(prev?.businessHours || {}),
                ...(data.settings.chat?.businessHours || {})
              }
            }));
          }
        }
      })
      .catch((err) => console.warn('Could not load central settings from server:', err));

    // Backup: Fetch client runtime config
    fetch('/api/config')
      .then((res) => res.json())
      .then((cfg) => {
        if (cfg.success && cfg.paystackPublicKey) {
          const key = cfg.paystackPublicKey.trim();
          if (key) {
            setPaystackSettings((prev) => {
              if (!prev.publicKey || !prev.publicKey.trim()) {
                const updated = { ...prev, publicKey: key, enabled: true };
                localStorage.setItem('denny_paystack_settings', JSON.stringify(updated));
                return updated;
              }
              return prev;
            });
          }
        }
      })
      .catch(() => {});

    // 2. Fetch Orders from Neon / Central DB
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
          setOrders((localOrders) => {
            // Merge remote orders with local orders, prioritizing newer / populated
            const orderMap = new Map<string, Order>();
            for (const ord of localOrders) {
              orderMap.set(ord.id, {
                ...ord,
                deliverables: Array.isArray(ord.deliverables) ? ord.deliverables : [],
                messages: Array.isArray(ord.messages) ? ord.messages : []
              });
            }
            for (const ord of data.orders) {
              orderMap.set(ord.id, {
                ...ord,
                deliverables: Array.isArray(ord.deliverables) ? ord.deliverables : [],
                messages: Array.isArray(ord.messages) ? ord.messages : []
              });
            }
            return Array.from(orderMap.values());
          });
        }
      })
      .catch((err) => console.warn('Could not load orders from server:', err));

    // 3. Connect Realtime Firebase Cloud Firestore Listener for Orders
    const unsubscribeFirestore = subscribeToOrders((firestoreOrders) => {
      if (Array.isArray(firestoreOrders) && firestoreOrders.length > 0) {
        setOrders((localOrders) => {
          const orderMap = new Map<string, Order>();
          for (const ord of localOrders) {
            orderMap.set(ord.id, {
              ...ord,
              deliverables: Array.isArray(ord.deliverables) ? ord.deliverables : [],
              messages: Array.isArray(ord.messages) ? ord.messages : []
            });
          }
          for (const ord of firestoreOrders) {
            orderMap.set(ord.id, {
              ...ord,
              deliverables: Array.isArray(ord.deliverables) ? ord.deliverables : [],
              messages: Array.isArray(ord.messages) ? ord.messages : []
            });
          }
          return Array.from(orderMap.values());
        });
      }
    });

    return () => {
      unsubscribeFirestore();
    };
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('denny_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('denny_proofs', JSON.stringify(proofs));
  }, [proofs]);

  useEffect(() => {
    localStorage.setItem('denny_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('denny_faqs', JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem('denny_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('denny_customer_email', activeCustomerEmail);
  }, [activeCustomerEmail]);

  useEffect(() => {
    localStorage.setItem('denny_admin_session', String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Nav helper
  const setView = (view: AppView) => {
    setCurrentView(view);
    localStorage.setItem('denny_current_view', view);
    if (view === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else {
      if (window.location.pathname.toLowerCase().includes('/admin')) {
        window.history.pushState({}, '', '/');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Service Detail Modal
  const openServiceDetail = (service: ServiceItem) => {
    setSelectedService(service);
    setIsDetailModalOpen(true);
  };

  const closeServiceDetail = () => {
    setIsDetailModalOpen(false);
  };

  // Order Form Modal
  const openOrderForm = (service?: ServiceItem, packageType: PackageOption = 'STANDARD') => {
    setIsDetailModalOpen(false);
    setOrderFormPrefill({
      service: service || selectedService || services[0],
      packageType
    });
    setIsOrderFormOpen(true);
  };

  const closeOrderForm = () => {
    setIsOrderFormOpen(false);
  };

  // Auth Admin
  const loginAdmin = (password: string): boolean => {
    if (password === 'admin123' || password === 'denny2026' || password === 'apex2026' || password === 'apexcreator') {
      setIsAdminLoggedIn(true);
      showToast('Admin login successful!', 'success');
      return true;
    }
    showToast('Invalid admin password. Try "admin123".', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    showToast('Admin logged out.', 'info');
    setView('home');
  };

  // Submit Order Creation
  const submitOrder = (data: {
    customerName: string;
    email: string;
    category: ServiceCategory;
    serviceId: string;
    serviceTitle: string;
    packageType: PackageOption;
    price: number;
    offeredPrice?: number;
    isNegotiatedPrice?: boolean;
    negotiationNote?: string;
    socialUrl: string;
    projectDescription: string;
    preferredDeliveryDate: string;
  }): Order => {
    const nextOrderNum = String(orders.length + 1).padStart(5, '0');
    const newOrderId = `APX-2026-${nextOrderNum}`;

    const today = new Date();
    const createdStr = today.toISOString().split('T')[0];

    // Compute expected delivery based on package
    let deliveryDays = 3;
    if (data.packageType === 'BASIC') deliveryDays = 3;
    if (data.packageType === 'STANDARD') deliveryDays = 2;
    if (data.packageType === 'PREMIUM') deliveryDays = 1;

    const expDate = new Date();
    expDate.setDate(today.getDate() + deliveryDays);
    const expStr = expDate.toISOString().split('T')[0];

    const newOrder: Order = {
      id: newOrderId,
      customerName: data.customerName,
      email: data.email,
      category: data.category,
      serviceId: data.serviceId,
      serviceTitle: data.serviceTitle,
      packageType: data.packageType,
      price: data.price,
      offeredPrice: data.offeredPrice,
      isNegotiatedPrice: data.isNegotiatedPrice,
      negotiationNote: data.negotiationNote,
      socialUrl: data.socialUrl,
      projectDescription: data.projectDescription,
      preferredDeliveryDate: data.preferredDeliveryDate,
      createdAt: createdStr,
      expectedDeliveryDate: expStr,
      paymentStatus: 'Pending',
      status: 'Pending',
      deliverables: [],
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'admin',
          senderName: 'ApexCreator Studio System',
          text: `Order ${newOrderId} created. Awaiting payment confirmation.`,
          timestamp: new Date().toLocaleString()
        }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveCustomerEmail(data.email);
    setPendingCheckoutOrder(newOrder);
    syncOrderToServer(newOrder);
    setIsOrderFormOpen(false);
    setView('checkout');
    showToast(`Order ${newOrderId} generated! Please complete payment.`, 'success');
    return newOrder;
  };

  // Submit Payment details for verification by admin
  const submitPaymentForVerification = (orderId: string, paymentMethod: string, paymentReference?: string) => {
    let targetOrder: Order | null = null;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const refInfo = paymentReference ? ` (Ref: ${paymentReference})` : '';
          const updatedMessages = [
            ...ord.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'customer' as const,
              senderName: ord.customerName,
              text: `Submitted payment details via ${paymentMethod}${refInfo}. Awaiting admin verification.`,
              timestamp: new Date().toLocaleString()
            }
          ];
          const updated: Order = {
            ...ord,
            paymentStatus: 'Pending' as const,
            paymentMethod: paymentMethod,
            paymentReference: paymentReference,
            status: 'Payment Pending' as const,
            messages: updatedMessages
          };
          targetOrder = updated;
          return updated;
        }
        return ord;
      })
    );

    if (targetOrder) {
      syncOrderToServer(targetOrder);
    }

    if (pendingCheckoutOrder && pendingCheckoutOrder.id === orderId) {
      setPendingCheckoutOrder({
        ...pendingCheckoutOrder,
        paymentStatus: 'Pending',
        paymentMethod: paymentMethod,
        paymentReference: paymentReference,
        status: 'Payment Pending'
      });
    }

    showToast(`Payment details submitted via ${paymentMethod}! Awaiting admin confirmation.`, 'info');
  };

  // Process Payment (Admin confirmation or instant auto-confirm)
  const processPayment = (orderId: string, paymentMethod: string = 'Card', paymentReference?: string) => {
    let targetOrder: Order | null = null;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const refInfo = paymentReference ? ` (Ref: ${paymentReference})` : '';
          const updatedMessages = [
            ...ord.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'admin' as const,
              senderName: 'ApexCreator Studio System',
              text: `Payment received successfully via ${paymentMethod}${refInfo}! Your order has been placed in line for processing.`,
              timestamp: new Date().toLocaleString()
            }
          ];
          const updated: Order = {
            ...ord,
            paymentStatus: 'Paid' as const,
            paymentMethod: paymentMethod,
            paymentReference: paymentReference,
            status: 'Payment Confirmed' as const,
            messages: updatedMessages
          };
          targetOrder = updated;
          return updated;
        }
        return ord;
      })
    );

    if (targetOrder) {
      syncOrderToServer(targetOrder);
    }

    if (pendingCheckoutOrder && pendingCheckoutOrder.id === orderId) {
      setPendingCheckoutOrder({
        ...pendingCheckoutOrder,
        paymentStatus: 'Paid',
        paymentMethod: paymentMethod,
        paymentReference: paymentReference,
        status: 'Payment Confirmed'
      });
    }

    showToast(`Payment confirmed via ${paymentMethod}! Redirecting to dashboard...`, 'success');
  };

  // Update Order Status (Admin)
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    let targetOrder: Order | null = null;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const statusMsg = {
            id: `msg-${Date.now()}`,
            sender: 'admin' as const,
            senderName: 'ApexCreator Studio Admin',
            text: `Order status updated to: ${status}`,
            timestamp: new Date().toLocaleString()
          };
          const updated: Order = {
            ...ord,
            status,
            messages: [...ord.messages, statusMsg]
          };
          targetOrder = updated;
          return updated;
        }
        return ord;
      })
    );

    if (targetOrder) {
      syncOrderToServer(targetOrder);
    }
    showToast(`Order ${orderId} status set to "${status}"`, 'info');
  };

  // Message on Order
  const addOrderMessage = (orderId: string, text: string, sender: 'customer' | 'admin') => {
    const senderName = sender === 'admin' ? 'ApexCreator Studio Support' : 'Customer';
    let targetOrder: Order | null = null;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            sender,
            senderName,
            text,
            timestamp: new Date().toLocaleString()
          };
          const updated: Order = {
            ...ord,
            messages: [...ord.messages, newMsg]
          };
          targetOrder = updated;
          return updated;
        }
        return ord;
      })
    );

    if (targetOrder) {
      syncOrderToServer(targetOrder);
    }
    showToast('Message sent!', 'success');
  };

  // Upload Deliverable
  const uploadDeliverable = (
    orderId: string,
    deliverable: { title: string; downloadUrl: string; fileSize?: string; note?: string }
  ) => {
    const newDeliverable: DeliverableFile = {
      id: `deliv-${Date.now()}`,
      title: deliverable.title,
      downloadUrl: deliverable.downloadUrl,
      fileSize: deliverable.fileSize || '2.5 MB',
      uploadedAt: new Date().toISOString().split('T')[0],
      note: deliverable.note
    };

    let targetOrder: Order | null = null;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedDelivs = [...ord.deliverables, newDeliverable];
          const autoMsg = {
            id: `msg-${Date.now()}`,
            sender: 'admin' as const,
            senderName: 'ApexCreator Studio Admin',
            text: `New deliverable file uploaded: "${deliverable.title}".`,
            timestamp: new Date().toLocaleString()
          };
          const updated: Order = {
            ...ord,
            deliverables: updatedDelivs,
            status: 'Delivered' as const,
            messages: [...ord.messages, autoMsg]
          };
          targetOrder = updated;
          return updated;
        }
        return ord;
      })
    );

    if (targetOrder) {
      syncOrderToServer(targetOrder);
    }
    showToast(`Deliverable uploaded for order ${orderId}`, 'success');
  };

  // Service Management with Live Database Persistence
  const saveService = (service: ServiceItem) => {
    setServices((prev) => {
      const exists = prev.find((s) => s.id === service.id);
      if (exists) {
        return prev.map((s) => (s.id === service.id ? service : s));
      } else {
        return [service, ...prev];
      }
    });

    // Save directly to Firestore
    saveServiceToFirestore(service).catch((err) =>
      console.warn('Failed to save service to Firestore:', err)
    );

    // Save to API
    fetch('/api/content/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service)
    }).catch((err) => console.warn('Failed to post service to API:', err));

    showToast(`Service "${service.title}" saved to database!`, 'success');
  };

  const deleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));

    // Delete directly from Firestore
    deleteServiceFromFirestore(serviceId).catch((err) =>
      console.warn('Failed to delete service from Firestore:', err)
    );

    // Delete from API
    fetch(`/api/content/services/${serviceId}`, {
      method: 'DELETE'
    }).catch((err) => console.warn('Failed to send delete to API:', err));

    showToast('Service deleted from database.', 'info');
  };

  const updatePackagePricing = (
    serviceId: string,
    packageType: PackageOption,
    price: number,
    features: string[]
  ) => {
    let updatedItem: ServiceItem | null = null;
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === serviceId) {
          const updated = {
            ...s,
            packages: {
              ...s.packages,
              [packageType]: {
                ...s.packages[packageType],
                price,
                features
              }
            }
          };
          updatedItem = updated;
          return updated;
        }
        return s;
      })
    );

    if (updatedItem) {
      saveServiceToFirestore(updatedItem).catch(console.warn);
      fetch('/api/content/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      }).catch(console.warn);
    }

    showToast(`Updated ${packageType} pricing to $${price} and synced to database!`, 'success');
  };

  // Proof Management
  const saveProof = (proof: ProofItem) => {
    setProofs((prev) => {
      const exists = prev.find((p) => p.id === proof.id);
      if (exists) {
        return prev.map((p) => (p.id === proof.id ? proof : p));
      } else {
        return [proof, ...prev];
      }
    });
    showToast(`Proof entry "${proof.title}" saved!`, 'success');
  };

  const deleteProof = (proofId: string) => {
    setProofs((prev) => prev.filter((p) => p.id !== proofId));
    showToast('Proof item deleted.', 'info');
  };

  // Testimonial Management
  const saveTestimonial = (testimonial: Testimonial) => {
    setTestimonials((prev) => {
      const exists = prev.find((t) => t.id === testimonial.id);
      if (exists) {
        return prev.map((t) => (t.id === testimonial.id ? testimonial : t));
      } else {
        return [testimonial, ...prev];
      }
    });
    showToast('Testimonial saved!', 'success');
  };

  const deleteTestimonial = (testimonialId: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== testimonialId));
    showToast('Testimonial removed.', 'info');
  };

  // FAQ Management
  const saveFAQ = (faq: FAQItem) => {
    setFaqs((prev) => {
      const exists = prev.find((f) => f.id === faq.id);
      if (exists) {
        return prev.map((f) => (f.id === faq.id ? faq : f));
      } else {
        return [faq, ...prev];
      }
    });
    showToast('FAQ saved!', 'success');
  };

  const deleteFAQ = (faqId: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== faqId));
    showToast('FAQ removed.', 'info');
  };

  // Reset helper
  const resetDataToDefaults = async () => {
    if (window.confirm('Reset all content and orders to factory defaults? This will refresh the page.')) {
      try {
        const res = await fetch('/api/admin/reset', { method: 'POST' });
        if (res.ok) {
          window.location.reload();
        } else {
          showToast('Reset failed', 'error');
        }
      } catch (err) {
        showToast('Reset failed', 'error');
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentView,
        setView,
        selectedCategory,
        setSelectedCategory,
        services,
        proofs,
        testimonials,
        faqs,
        orders,
        caseStudies,
        team,
        insights,
        selectedService,
        isDetailModalOpen,
        openServiceDetail,
        closeServiceDetail,
        isOrderFormOpen,
        orderFormPrefill,
        openOrderForm,
        closeOrderForm,
        pendingCheckoutOrder,
        setPendingCheckoutOrder,
        activeCustomerEmail,
        setCustomerEmail: setActiveCustomerEmail,
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
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        toast,
        showToast,
        submitOrder,
        processPayment,
        submitPaymentForVerification,
        updateOrderStatus,
        addOrderMessage,
        uploadDeliverable,
        saveService,
        deleteService,
        updatePackagePricing,
        saveProof,
        deleteProof,
        saveTestimonial,
        deleteTestimonial,
        saveFAQ,
        deleteFAQ,
        resetDataToDefaults,
        getAiRecommendation,
        chatConfig,
        updateChatConfig,
        dbStatus,
        refreshDbStatus,
        saveDatabaseUrl,
        isFirebaseConnected: isFirebaseConfigured(),
        firebaseProjectId: firebaseConfig.projectId
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
