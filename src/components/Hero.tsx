import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Shield,
  Star,
  Zap,
  Youtube,
  Tv,
  Share2,
  Palette
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { theme, setView, setSelectedCategory } = useApp();
  const isLight = theme === 'light';

  return (
    <section className={`relative overflow-hidden pt-8 pb-12 lg:pt-12 lg:pb-16 transition-colors duration-300 ${
      isLight ? 'bg-white text-slate-900' : 'bg-slate-950 text-white'
    }`}>
      {/* Background Decorative Lighting Gradients */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none ${
        isLight ? 'bg-blue-200/40' : 'bg-blue-600/15'
      }`} />
      <div className={`absolute top-1/3 right-10 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none ${
        isLight ? 'bg-purple-200/40' : 'bg-purple-600/15'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center max-w-4xl mx-auto">
          
          {/* Hero Content */}
          <div className="w-full space-y-6 text-center">
            
            {/* Trust Pill Badge */}
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm ${
              isLight ? 'bg-indigo-50 border border-indigo-200 text-indigo-700' : 'bg-slate-900/90 border border-indigo-500/30 text-indigo-300'
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Digital Agency for Creators • Fixed Rates & Price Negotiation</span>
            </div>

            {/* Main Headline */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Grow Your Digital Presence With{' '}
              <span className="block mt-1 sm:mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                Professional Services
              </span>
            </h1>

            {/* Subheadline */}
            <p className={`text-sm sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}>
              Professional YouTube, Twitch, social media, branding, and digital growth services designed to help creators and businesses build a stronger online presence.
            </p>

            {/* CTA Buttons Stack */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => setView('services')}
                className="px-6 py-3.5 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Browse Services</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setView('pricing')}
                className={`px-5 py-3.5 rounded-2xl text-sm font-extrabold transition-all flex items-center justify-center gap-2 shadow-sm ${
                  isLight ? 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300' : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80'
                }`}
              >
                <span>View Packages</span>
              </button>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-lead-magnet'));
                }}
                className="px-5 py-3.5 rounded-2xl text-sm font-extrabold text-amber-700 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Free Growth Playbook</span>
              </button>
            </div>

            {/* Industry Credentials Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Industry Credentials:</span>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border flex items-center gap-1.5 shadow-sm ${
                isLight ? 'bg-slate-100 border-slate-200 text-red-700' : 'bg-slate-900 border-slate-800 text-red-400'
              }`}>
                <Youtube className="w-3.5 h-3.5 text-red-500 shrink-0" /> YouTube Certified
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border flex items-center gap-1.5 shadow-sm ${
                isLight ? 'bg-slate-100 border-slate-200 text-emerald-700' : 'bg-slate-900 border-slate-800 text-emerald-400'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Shopify Select Partner
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border flex items-center gap-1.5 shadow-sm ${
                isLight ? 'bg-slate-100 border-slate-200 text-purple-700' : 'bg-slate-900 border-slate-800 text-purple-400'
              }`}>
                <Tv className="w-3.5 h-3.5 text-purple-500 shrink-0" /> Twitch Specialist
              </span>
            </div>

            {/* Platform Quick Filter Chips */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
              <span className={`font-bold text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Explore Platforms:</span>
              <button
                onClick={() => {
                  setSelectedCategory('YouTube');
                  setView('services');
                }}
                className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                  isLight
                    ? 'bg-slate-100 hover:bg-red-50 border-slate-200 hover:border-red-300 text-slate-800 hover:text-red-700'
                    : 'bg-slate-900/90 hover:bg-red-500/10 border-slate-800 hover:border-red-500/30 text-slate-200 hover:text-red-400'
                }`}
              >
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                YouTube
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('Twitch');
                  setView('services');
                }}
                className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                  isLight
                    ? 'bg-slate-100 hover:bg-purple-50 border-slate-200 hover:border-purple-300 text-slate-800 hover:text-purple-700'
                    : 'bg-slate-900/90 hover:bg-purple-500/10 border-slate-800 hover:border-purple-500/30 text-slate-200 hover:text-purple-400'
                }`}
              >
                <Tv className="w-3.5 h-3.5 text-purple-500" />
                Twitch
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('Social Media');
                  setView('services');
                }}
                className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                  isLight
                    ? 'bg-slate-100 hover:bg-blue-50 border-slate-200 hover:border-blue-300 text-slate-800 hover:text-blue-700'
                    : 'bg-slate-900/90 hover:bg-blue-500/10 border-slate-800 hover:border-blue-500/30 text-slate-200 hover:text-blue-400'
                }`}
              >
                <Share2 className="w-3.5 h-3.5 text-blue-500" />
                Social Media
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('Graphics & Branding');
                  setView('services');
                }}
                className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                  isLight
                    ? 'bg-slate-100 hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-700'
                    : 'bg-slate-900/90 hover:bg-emerald-500/10 border-slate-800 hover:border-emerald-500/30 text-slate-200 hover:text-emerald-400'
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-emerald-500" />
                Graphics & Branding
              </button>
            </div>

            {/* Quick Feature Proof Points */}
            <div className={`pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-bold ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Policy-Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>No Passwords Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Custom Delivery Dashboard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Agency Trust Metric Ticker */}
        <div className={`mt-10 pt-6 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-center ${
          isLight ? 'border-slate-200' : 'border-slate-800/80'
        }`}>
          <div className={`p-4 rounded-2xl border transition-all shadow-sm ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className={`text-2xl sm:text-3xl font-black ${
              isLight ? 'text-indigo-600' : 'text-blue-400'
            }`}>
              500+
            </div>
            <div className={`text-xs sm:text-sm font-bold mt-1 ${
              isLight ? 'text-slate-800' : 'text-slate-200'
            }`}>
              Channels Serviced
            </div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all shadow-sm ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className={`text-2xl sm:text-3xl font-black ${
              isLight ? 'text-purple-600' : 'text-purple-400'
            }`}>
              99.4%
            </div>
            <div className={`text-xs sm:text-sm font-bold mt-1 ${
              isLight ? 'text-slate-800' : 'text-slate-200'
            }`}>
              Client Satisfaction
            </div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all shadow-sm ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className={`text-2xl sm:text-3xl font-black ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              $70 – $460
            </div>
            <div className={`text-xs sm:text-sm font-bold mt-1 ${
              isLight ? 'text-emerald-700' : 'text-emerald-400'
            }`}>
              Rates + Custom Negotiation
            </div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all shadow-sm ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className={`text-2xl sm:text-3xl font-black ${
              isLight ? 'text-amber-600' : 'text-amber-400'
            }`}>
              100%
            </div>
            <div className={`text-xs sm:text-sm font-bold mt-1 ${
              isLight ? 'text-slate-800' : 'text-slate-200'
            }`}>
              Policy Compliant
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
