import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceItem } from '../types';
import {
  Layers,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Percent,
  Clock,
  Plus,
  Trash2,
  Calculator,
  Check,
  Star,
  Award,
  Crown,
  Flame,
  CheckCircle
} from 'lucide-react';

interface CuratedBundle {
  id: string;
  title: string;
  badge: string;
  category: 'YouTube' | 'Twitch' | 'Full Agency';
  popular?: boolean;
  price: number;
  originalPrice: number;
  turnaroundDays: string;
  shortDesc: string;
  deliverables: string[];
}

const CURATED_BUNDLES: CuratedBundle[] = [
  {
    id: 'bundle-yt-starter',
    title: 'YouTube Creator Growth Kit',
    badge: '🚀 Most Popular',
    category: 'YouTube',
    popular: true,
    price: 180,
    originalPrice: 250,
    turnaroundDays: '2-3 Business Days',
    shortDesc: 'Designed for YouTube creators wanting high CTR thumbnails and channel authority.',
    deliverables: [
      '5 Custom High-CTR 4K Thumbnails',
      '4K Channel Banner & Avatar Logo',
      'Channel SEO & Keyword Audit',
      'Custom Video Endscreen & Subscribe Watermark'
    ]
  },
  {
    id: 'bundle-full-rebrand',
    title: 'Full Channel Rebrand & SEO Suite',
    badge: '🔥 Best Value',
    category: 'Full Agency',
    popular: false,
    price: 290,
    originalPrice: 390,
    turnaroundDays: '3-4 Business Days',
    shortDesc: 'Complete visual identity transformation and algorithm keyword optimization.',
    deliverables: [
      'Full 4K Channel Rebrand Suite',
      '10-Page Comprehensive SEO Audit & Tag Matrix',
      'Cross-Platform Social Media Kit (X, IG, TikTok)',
      'Custom 30s Animated Intro & SFX'
    ]
  },
  {
    id: 'bundle-twitch-pro',
    title: 'Streamer Pro Growth Pack',
    badge: '🎮 Streamer Favorite',
    category: 'Twitch',
    popular: false,
    price: 240,
    originalPrice: 330,
    turnaroundDays: '2-3 Business Days',
    shortDesc: 'Broadcast-quality animated stream graphics for Twitch and Kick streamers.',
    deliverables: [
      'Twitch Animated Overlays & Webcam Frames',
      'Animated Stream Alerts & Panels',
      'Starting Soon, BRB & Offline Screens',
      'Matching Social Media Header Graphics'
    ]
  },
  {
    id: 'bundle-vip-agency',
    title: 'Ultimate Viral Empire VIP Bundle',
    badge: '👑 VIP Agency Tier',
    category: 'Full Agency',
    popular: false,
    price: 490,
    originalPrice: 680,
    turnaroundDays: '4-5 Business Days',
    shortDesc: 'The ultimate agency growth engine including 1-on-1 strategy call with ApexCreator Lead Strategist.',
    deliverables: [
      '1-on-1 Monetization Strategy Session with ApexCreator Lead Strategist',
      'Full YouTube Channel Rebrand & 10 Thumbnail Pack',
      'Complete SEO Audit & Title Formula Vault',
      '30s Broadcast Intro + Twitch Stream Suite',
      '24/7 Priority VIP Agency Support & Revisions'
    ]
  }
];

export const CustomBundleBuilder: React.FC = () => {
  const { theme, openOrderForm, saveService } = useApp();
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState<'all' | 'YouTube' | 'Twitch' | 'Full Agency'>('all');

  const filteredBundles = activeTab === 'all' 
    ? CURATED_BUNDLES 
    : CURATED_BUNDLES.filter(b => b.category === activeTab);

  const handleOrderCuratedBundle = (bundle: CuratedBundle) => {
    const customBundleService: ServiceItem = {
      id: `curated-${bundle.id}-${Date.now()}`,
      title: bundle.title,
      category: bundle.category === 'Twitch' ? 'Twitch' : 'YouTube',
      shortDesc: bundle.shortDesc,
      fullDesc: `${bundle.title} - Special Agency Growth Bundle featuring: ${bundle.deliverables.join(', ')}.`,
      iconName: 'Zap',
      deliveryInfo: `Turnaround: ${bundle.turnaroundDays}`,
      whatIsIncluded: bundle.deliverables,
      faqs: [
        {
          question: 'What happens after I place my order?',
          answer: 'Our agency design team immediately begins working on your brand assets. You will receive progress updates and deliverables in your Customer Dashboard.'
        }
      ],
      packages: {
        BASIC: {
          id: `pkg-b-${Date.now()}`,
          name: 'BASIC',
          price: Math.round(bundle.price * 0.75),
          deliveryDays: '4 Days',
          revisions: '1 Revision',
          features: bundle.deliverables.slice(0, 2)
        },
        STANDARD: {
          id: `pkg-s-${Date.now()}`,
          name: 'STANDARD',
          price: bundle.price,
          deliveryDays: bundle.turnaroundDays,
          revisions: '2 Revisions',
          features: bundle.deliverables
        },
        PREMIUM: {
          id: `pkg-p-${Date.now()}`,
          name: 'PREMIUM',
          price: Math.round(bundle.price * 1.35),
          deliveryDays: '1-2 Days (Express)',
          revisions: 'Unlimited Revisions',
          features: ['24-Hour Express Turnaround', 'Source File Delivery', ...bundle.deliverables]
        }
      }
    };

    saveService(customBundleService);
    openOrderForm(customBundleService, 'STANDARD');
  };

  return (
    <section id="bundle-builder" className={`py-14 lg:py-20 relative border-t transition-colors duration-300 ${
      isLight ? 'bg-slate-50/80 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-500">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Curated Agency Growth Packages</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            High-Impact Creator Growth Bundles
          </h2>

          <p className={`text-base sm:text-lg ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Save up to <span className="font-extrabold text-emerald-500">35% off</span> with our all-in-one agency packages. Designed to scale your channel visuals, CTR, and audience engagement fast.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {(['all', 'YouTube', 'Twitch', 'Full Agency'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                  activeTab === cat
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400 shadow-md shadow-emerald-500/20'
                    : isLight
                    ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Packages' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Curated Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBundles.map((bundle) => {
            return (
              <div
                key={bundle.id}
                className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-6 relative ${
                  bundle.popular
                    ? isLight
                      ? 'bg-white border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/30'
                      : 'bg-slate-900 border-emerald-500/60 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                    : isLight
                    ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Top Badge */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {bundle.badge}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      {bundle.turnaroundDays}
                    </span>
                  </div>

                  <div>
                    <h3 className={`font-black text-xl leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {bundle.title}
                    </h3>
                    <p className={`text-xs mt-2 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {bundle.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-emerald-400">${bundle.price}</span>
                    <span className="text-sm font-semibold text-slate-500 line-through">${bundle.originalPrice}</span>
                    <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded ml-auto">
                      SAVE ${bundle.originalPrice - bundle.price}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-medium">All deliverables included • No hidden fees</span>
                </div>

                {/* Deliverables Checklist */}
                <div className="space-y-2.5 text-xs">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    What's Included:
                  </span>
                  {bundle.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-snug font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Order Button */}
                <button
                  onClick={() => handleOrderCuratedBundle(bundle)}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                    bundle.popular
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/25'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto shadow-xl">
          <div className="flex items-center gap-3 text-left">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">100% Satisfaction & Speed Guarantee</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Full revisions included until you are completely satisfied with your brand deliverables.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-4 py-2.5 rounded-xl border border-emerald-500/20 shrink-0">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Instant Bybit & Crypto Payment Ready</span>
          </div>
        </div>

      </div>
    </section>
  );
};

