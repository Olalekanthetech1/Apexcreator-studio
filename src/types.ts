export type ServiceCategory = 'YouTube' | 'Twitch' | 'Social Media' | 'Graphics & Branding';

export type PackageOption = 'BASIC' | 'STANDARD' | 'PREMIUM';

export interface ServicePackage {
  id: string;
  name: PackageOption;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  badge?: string;
  deliveryDays: string;
  revisions: string;
  features: string[];
}

export interface ServiceItem {
  id: string;
  category: ServiceCategory;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string; // Lucide icon name string
  deliveryInfo: string;
  whatIsIncluded: string[];
  packages: Record<PackageOption, ServicePackage>;
  faqs: { question: string; answer: string }[];
  popular?: boolean;
}

export type OrderStatus =
  | 'Pending'
  | 'Payment Confirmed'
  | 'In Progress'
  | 'Revision'
  | 'Completed'
  | 'Delivered';

export type PaymentStatus = 'Pending' | 'Paid' | 'Refunded';

export interface DeliverableFile {
  id: string;
  title: string;
  downloadUrl: string;
  fileSize?: string;
  uploadedAt: string;
  note?: string;
}

export interface OrderMessage {
  id: string;
  sender: 'customer' | 'admin';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Order {
  id: string; // DEN-2026-00001
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
  createdAt: string;
  expectedDeliveryDate: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentReference?: string;
  status: OrderStatus;
  deliverables: DeliverableFile[];
  messages: OrderMessage[];
}

export interface ProofItem {
  id: string;
  title: string;
  platform: 'YouTube' | 'Twitch' | 'Instagram' | 'TikTok' | 'Social Media' | 'Branding' | 'Graphics';
  category: ServiceCategory | 'Growth & Optimization';
  serviceProvided: string;
  beforeImage?: string;
  afterImage?: string;
  resultImage?: string;
  description: string;
  dateCompleted: string;
  hidden?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  handle: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
  platform: string;
  hidden?: boolean;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  hidden?: boolean;
}

export interface CaseStudy {
  id: string;
  clientName: string;
  clientHandle: string;
  platform: 'YouTube' | 'Twitch' | 'Shopify' | 'Social Media';
  serviceCategory: ServiceCategory;
  title: string;
  summary: string;
  challenge: string;
  strategy: string;
  execution: string[];
  metrics: {
    label: string;
    value: string;
    change: string;
    isPositive: boolean;
  }[];
  testimonialQuote?: string;
  beforeImage?: string;
  afterImage?: string;
  timeframe: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  bio: string;
  avatar: string;
  experienceYears: string;
  socialLink?: string;
}

export interface LeadMagnetLead {
  id: string;
  email: string;
  resourceRequested: string;
  createdAt: string;
}

export interface InsightArticle {
  id: string;
  title: string;
  slug: string;
  category: 'YouTube Strategy' | 'Twitch & Gaming' | 'E-commerce & Merch' | 'Social Media SEO';
  author: string;
  readTime: string;
  date: string;
  summary: string;
  keyTakeaways: string[];
  content: string[];
  coverImage: string;
}

export interface CryptoNetworkConfig {
  id: string; // e.g. 'TRC20', 'BEP20', 'ERC20', 'SOL', 'BTC'
  name: string; // e.g. 'TRON (TRC20)', 'BNB Smart Chain (BEP20)'
  address: string; // Deposit Wallet Address
  memoRequired?: boolean;
  memoValue?: string;
  isActive?: boolean; // Toggled by Admin to show/hide at checkout
}

export interface CryptoCoinConfig {
  symbol: string; // 'USDT' | 'BTC' | 'ETH' | 'TRX' | 'SOL' | 'LTC' | 'BNB' | 'USDC'
  name: string; // 'Tether USD', 'Bitcoin', 'Tron', etc.
  iconUrl?: string;
  enabled: boolean;
  networks: CryptoNetworkConfig[];
}

export interface CryptoGatewaySettings {
  enabled: boolean;
  bybitApiKey: string;
  bybitApiSecret: string;
  autoVerifyWithBybit: boolean;
  coins: CryptoCoinConfig[];
}

export interface PaystackSettings {
  enabled: boolean;
  publicKey: string;
  secretKey: string;
  usdToNgnRate: number;
  allowUsdPayment: boolean;
  allowNgnPayment: boolean;
  defaultCurrency: 'NGN' | 'USD';
  currencyMode: 'auto_convert_ngn' | 'direct_usd';
  useLiveMarketRate: boolean;
}

export interface ContactSettings {
  whatsappNumber: string;
  telegramHandle: string;
}

export interface BankAccountDetails {
  currency: 'USD' | 'GBP' | 'EUR';
  beneficiary: string;
  bankName: string;
  accountType?: string;
  routingNumber?: string;
  achRouting?: string;
  wireRouting?: string;
  accountNumber?: string;
  swiftCode?: string;
  iban?: string;
  sortCode?: string;
  bankAddress?: string;
  referenceNote?: string;
}

export interface BankSettings {
  usd: BankAccountDetails;
  gbp: BankAccountDetails;
  eur: BankAccountDetails;
}

export interface VisitorLead {
  id: string;
  sessionId: string;
  name?: string;
  email?: string;
  phone?: string;
  whatsappNumber?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  flag?: string;
  source?: string;
  campaign?: string;
  capturedAt: string;
  notes?: string;
  durationBeforeCapture?: number;
}

export interface VisitorSession {
  sessionId: string;
  ip: string;
  country: string;
  countryCode: string;
  flag: string;
  city: string;
  region?: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  os: string;
  firstSeen: number;
  lastSeen: number;
  durationSeconds: number;
  currentPage: string;
  referrer: string;
  utmSource?: string;
  utmCampaign?: string;
  utmMedium?: string;
  isOnline: boolean;
  lead?: {
    name?: string;
    email?: string;
    phone?: string;
    capturedAt?: string;
    source?: string;
  };
}

export interface AnalyticsStats {
  liveActiveNow: number;
  totalSessions: number;
  avgDurationSeconds: number;
  totalLeads: number;
  conversionRate: number;
  countries: {
    country: string;
    countryCode: string;
    flag: string;
    count: number;
    percentage: number;
  }[];
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  recentVisitors: VisitorSession[];
  allLeads: VisitorLead[];
  lastUpdated: number;
}

export interface ChatConfig {
  enabled: boolean;
  businessHours: {
    enabled: boolean;
    timezone: string;
    schedule: {
      day: string;
      start: string;
      end: string;
      closed: boolean;
    }[];
  };
  offlineMessage: string;
  welcomeMessage: string;
}

export interface ChatMessageData {
  id: string;
  sessionId: string;
  sender: 'user' | 'admin' | 'system';
  text: string;
  created_at: string;
}

export interface ChatSessionData {
  id: string;
  customer_name?: string;
  email?: string;
  last_message_at: string;
  created_at: string;
}


