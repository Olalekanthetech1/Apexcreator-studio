import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Youtube,
  Tv,
  ShoppingBag,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  PieChart
} from 'lucide-react';

export const ChannelRoiCalculator: React.FC = () => {
  const { theme, openOrderForm, showToast } = useApp();
  const isLight = theme === 'light';

  // Calculator State
  const [platform, setPlatform] = useState<'youtube' | 'twitch' | 'ecommerce'>('youtube');
  const [monthlyViews, setMonthlyViews] = useState<number>(25000);
  const [currentRevenue, setCurrentRevenue] = useState<number>(350);
  const [ctrImprovement, setCtrImprovement] = useState<number>(2.5); // multiplier e.g. 2.5x CTR
  const [selectedPackageTier, setSelectedPackageTier] = useState<string>('Pro Agency Growth');

  // Calculations
  const estimatedViewsAfter = Math.round(monthlyViews * ctrImprovement);
  const estimatedAdRevenue = Math.round(currentRevenue * (ctrImprovement * 0.85 + 0.3));
  const estimatedSponsorRevenue = Math.round((estimatedViewsAfter / 1000) * 18); // ~$18 CPM avg sponsor rate
  const totalProjectedMonthly = estimatedAdRevenue + estimatedSponsorRevenue;
  const netMonthlyGain = totalProjectedMonthly - currentRevenue;

  const agencyServiceFee = selectedPackageTier === 'Starter' ? 149 : selectedPackageTier === 'Pro Agency Growth' ? 399 : 799;
  const roiMultiplier = ((netMonthlyGain / agencyServiceFee) * 100).toFixed(0);

  const handleApplyProjectionToOrder = () => {
    const projectionSummary = `[ROI Projection] Platform: ${platform.toUpperCase()} | Current Views: ${monthlyViews.toLocaleString()} -> Est: ${estimatedViewsAfter.toLocaleString()} | Projected Monthly Revenue: $${totalProjectedMonthly.toLocaleString()} (Estimated ${roiMultiplier}% ROI)`;
    showToast('Projections applied! Redirecting to custom order form...', 'success');
    openOrderForm(undefined, undefined, projectionSummary);
  };

  return (
    <section className={`py-16 border-b transition-colors duration-300 ${
      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-900 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-400">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Channel Revenue & CTR Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Estimate Your Channel Growth & Monetization Potential
          </h2>
          <p className={`text-sm max-w-2xl mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Calculate how professional thumbnail redesigns, SEO keyword optimization, and stream packaging directly impact your views and revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className={`lg:col-span-6 p-6 sm:p-8 rounded-3xl border space-y-6 shadow-xl ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <h3 className="text-lg font-black flex items-center gap-2 border-b pb-4 border-slate-800">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Configure Your Channel Metrics</span>
            </h3>

            {/* Platform Selector */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Primary Platform
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPlatform('youtube')}
                  className={`py-3 px-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all ${
                    platform === 'youtube'
                      ? 'bg-red-500/10 border-red-500 text-red-400 shadow-md'
                      : isLight ? 'bg-white border-slate-300 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Youtube className="w-4 h-4 text-red-500" />
                  <span>YouTube</span>
                </button>

                <button
                  onClick={() => setPlatform('twitch')}
                  className={`py-3 px-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all ${
                    platform === 'twitch'
                      ? 'bg-purple-500/10 border-purple-500 text-purple-400 shadow-md'
                      : isLight ? 'bg-white border-slate-300 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Tv className="w-4 h-4 text-purple-400" />
                  <span>Twitch</span>
                </button>

                <button
                  onClick={() => setPlatform('ecommerce')}
                  className={`py-3 px-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all ${
                    platform === 'ecommerce'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md'
                      : isLight ? 'bg-white border-slate-300 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>E-commerce</span>
                </button>
              </div>
            </div>

            {/* Slider 1: Monthly Views */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-slate-400 uppercase tracking-wider">Current Monthly Impressions / Views</span>
                <span className="text-indigo-400 text-sm">{monthlyViews.toLocaleString()} views/mo</span>
              </div>
              <input
                type="range"
                min={2000}
                max={500000}
                step={2000}
                value={monthlyViews}
                onChange={(e) => setMonthlyViews(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                <span>2,000</span>
                <span>250,000</span>
                <span>500,000+</span>
              </div>
            </div>

            {/* Slider 2: Current Monthly Revenue */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-slate-400 uppercase tracking-wider">Current Monthly Earnings ($)</span>
                <span className="text-emerald-400 text-sm">${currentRevenue.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min={0}
                max={10000}
                step={100}
                value={currentRevenue}
                onChange={(e) => setCurrentRevenue(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                <span>$0</span>
                <span>$5,000</span>
                <span>$10,000+</span>
              </div>
            </div>

            {/* CTR Boost Target Selection */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                ApexCreator Optimization Target
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Moderate (+1.8x)', val: 1.8 },
                  { label: 'Aggressive (+2.5x)', val: 2.5 },
                  { label: 'Maximum (+3.5x)', val: 3.5 }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setCtrImprovement(item.val)}
                    className={`py-2.5 px-2 rounded-xl border text-[11px] font-black transition-all ${
                      ctrImprovement === item.val
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : isLight ? 'bg-white border-slate-300 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Package Fee */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Agency Package Investment Tier
              </label>
              <select
                value={selectedPackageTier}
                onChange={(e) => setSelectedPackageTier(e.target.value)}
                className={`w-full p-3 rounded-2xl border text-xs font-extrabold outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-950 border-slate-800 text-white'
                }`}
              >
                <option value="Starter">Starter Optimization Package ($149)</option>
                <option value="Pro Agency Growth">Pro Agency Growth Package ($399)</option>
                <option value="Enterprise Domination">Enterprise Domination Suite ($799)</option>
              </select>
            </div>

          </div>

          {/* ROI Results Display Column */}
          <div className={`lg:col-span-6 p-6 sm:p-8 rounded-3xl border space-y-6 shadow-2xl relative overflow-hidden ${
            isLight ? 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-slate-200' : 'bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 border-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-4 border-slate-800">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-black">Projected Performance Output</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ApexCreator Verified Matrix
              </span>
            </div>

            {/* Big ROI Multiplier Banner */}
            <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <div className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Zap className="w-4 h-4 fill-emerald-400" />
                <span>Estimated First-Quarter Return</span>
              </div>
              <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight">
                +{roiMultiplier}% ROI
              </div>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Based on agency average benchmark of {ctrImprovement}x higher CTR and SEO discoverability index.
              </p>
            </div>

            {/* Comparison Metrics Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Projected Views Card */}
              <div className="p-4 rounded-2xl border space-y-1 bg-slate-900 border border-slate-800">
                <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                  <span>Projected Views</span>
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-indigo-400">
                  {estimatedViewsAfter.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  From {monthlyViews.toLocaleString()}/mo
                </div>
              </div>

              {/* Projected Monthly Earnings Card */}
              <div className="p-4 rounded-2xl border space-y-1 bg-slate-900 border border-slate-800">
                <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                  <span>Total Est. Monthly</span>
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400">
                  ${totalProjectedMonthly.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  +${netMonthlyGain.toLocaleString()} net increase
                </div>
              </div>
            </div>

            {/* Strategy Deliverables Included */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Included Growth Drivers:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>High-CTR Thumbnail Designs</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>YouTube SEO Keyword Titles</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Brand Identity & Channel Art</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Sponsorship Kit & Rate Card</span>
                </div>
              </div>
            </div>

            {/* Direct Order CTA */}
            <button
              onClick={handleApplyProjectionToOrder}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600 hover:from-emerald-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2.5 transition-all group"
            >
              <span>Lock In Growth & Order Custom Service</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};
