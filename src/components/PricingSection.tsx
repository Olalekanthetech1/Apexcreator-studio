import React from 'react';
import { useApp } from '../context/AppContext';
import { PackageOption } from '../types';
import { Check, Zap, Sparkles, Star, ShieldCheck, Clock, RotateCcw } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const { theme, setView, openOrderForm, services } = useApp();
  const isLight = theme === 'light';
  const targetService = (services && services.length > 0) ? services[0] : null;

  return (
    <section className={`py-10 lg:py-14 relative transition-colors duration-300 ${
      isLight ? 'bg-white text-slate-900' : 'bg-slate-950 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-600">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Negotiable Service Packages</span>
          </div>

          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Simple, Honest & Negotiable Tier Packages
          </h2>

          <p className={`text-sm sm:text-base ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Fixed baseline package rates with flexible custom price negotiation on all orders. You can propose your own budget during checkout.
          </p>
        </div>

        {/* 3 Tier Global Pricing Table */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-2">
          
          {/* BASIC TIER - $70 */}
          <div className={`rounded-3xl border p-6 flex flex-col justify-between space-y-5 shadow-xl transition-all ${
            isLight ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}>
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Essential Package
                </span>
                <h3 className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>BASIC</h3>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Perfect for single-focus channel tweaks and essential setup.</p>
              </div>

              <div className={`space-y-1 py-2 border-y ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>$70</span>
                  <span className={`text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>USD</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">
                  Custom Price Negotiation Allowed
                </span>
              </div>

              <div className={`space-y-2 text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Standard Delivery (2-3 Days)</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-purple-600" />
                  <span>1 Included Revision</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  What's Included:
                </span>
                <ul className={`space-y-2 text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Essential Service Execution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Standard Platform Delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Basic Metadata & Design Optimization</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => targetService ? openOrderForm(targetService, 'BASIC') : setView('services')}
              className={`w-full py-3 rounded-xl text-xs font-bold border transition-colors ${
                isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800'
              }`}
            >
              Order Basic ($70 USD) / Offer Price
            </button>
          </div>

          {/* STANDARD TIER - $230 (MOST POPULAR) */}
          <div className={`relative rounded-3xl border-2 border-indigo-600 p-6 flex flex-col justify-between space-y-5 shadow-2xl shadow-indigo-500/10 ${
            isLight ? 'bg-white' : 'bg-slate-900'
          }`}>
            
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg flex items-center gap-1.5">
              <Star className="w-3 h-3 fill-white text-white" />
              <span>Most Popular Choice</span>
            </div>

            <div className="space-y-4 pt-1">
              <div className="space-y-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                  Advanced Package
                </span>
                <h3 className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>STANDARD</h3>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Complete service optimization designed for active creators.</p>
              </div>

              <div className={`space-y-1 py-2 border-y ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>$230</span>
                  <span className={`text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>USD</span>
                </div>
                <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block">
                  Negotiable Offer Accepted
                </span>
              </div>

              <div className={`space-y-2 text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Accelerated Delivery (2 Days)</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-purple-600" />
                  <span>2 Included Revisions</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                  Everything In Basic, Plus:
                </span>
                <ul className={`space-y-2 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Advanced Optimization & Strategy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Additional Graphic & Copywriting Work</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Raw Source File Assets Included</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => targetService ? openOrderForm(targetService, 'STANDARD') : setView('services')}
              className="w-full py-3.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-white text-white" />
              <span>Order Standard ($230 USD)</span>
            </button>
          </div>

          {/* PREMIUM TIER - $460 */}
          <div className={`rounded-3xl border p-6 flex flex-col justify-between space-y-5 shadow-xl transition-all ${
            isLight ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}>
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-600">
                  Master Enterprise Package
                </span>
                <h3 className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>PREMIUM</h3>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Complete end-to-end master strategy and express delivery.</p>
              </div>

              <div className={`space-y-1 py-2 border-y ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>$460</span>
                  <span className={`text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>USD</span>
                </div>
                <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider block">
                  Negotiable Offer Accepted
                </span>
              </div>

              <div className={`space-y-2 text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Express Priority Delivery (1 Day)</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-purple-600" />
                  <span>3 Included Revisions</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 block">
                  Everything In Standard, Plus:
                </span>
                <ul className={`space-y-2 text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Complete Master Optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Premium Design & Branding Suite</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>1-on-1 Growth Strategy Advisory</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => targetService ? openOrderForm(targetService, 'PREMIUM') : setView('services')}
              className={`w-full py-3 rounded-xl text-xs font-bold border transition-colors ${
                isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800'
              }`}
            >
              Order Premium ($460 USD)
            </button>
          </div>

        </div>

        {/* Pricing Transparency Banner */}
        <div className={`p-5 rounded-2xl border text-center max-w-3xl mx-auto space-y-2 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-center gap-2 text-emerald-600 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Negotiable & Admin Managed Pricing</span>
          </div>
          <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            ApexCreator Studio accepts custom price proposals. Submit your price offer during checkout, and our strategy team will review and fulfill your request.
          </p>
        </div>

      </div>
    </section>
  );
};
