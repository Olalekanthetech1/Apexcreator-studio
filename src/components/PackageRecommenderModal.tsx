import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  X,
  Youtube,
  Tv,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Zap,
  RotateCcw
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PackageRecommenderModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { theme, services, openOrderForm, showToast } = useApp();
  const isLight = theme === 'light';

  // Step state
  const [step, setStep] = useState<number>(1);
  const [platform, setPlatform] = useState<string>('YouTube');
  const [channelStage, setChannelStage] = useState<string>('Growth / Monetization');
  const [budgetTier, setBudgetTier] = useState<string>('Flexible / Open to Negotiation');

  if (!isOpen) return null;

  // Recommendation logic
  const getRecommendation = () => {
    if (platform === 'YouTube') {
      return {
        title: 'YouTube Complete Channel Growth & CTR Package',
        badge: 'Recommended for You',
        matchPercent: '98% Strategic Match',
        description: 'Includes 5x High-CTR Custom Thumbnails, Channel Banner, SEO Titles & Tags, plus Video Intro/Outro Animation.',
        price: '$149 - $399',
        deliverables: [
          '3-5x Custom High-CTR Thumbnails',
          'Full Channel Branding & Logo Pack',
          'SEO Keyword & Metadata Audit',
          '24-48 Hour Rapid Turnaround'
        ]
      };
    } else if (platform === 'Twitch') {
      return {
        title: 'Twitch Broadcast Stream Branding Suite',
        badge: 'Twitch Specialist Match',
        matchPercent: '96% Strategic Match',
        description: 'Complete animated stream package: Overlay, Animated Stinger Transition, Emotes, Panels, and Offline Screen.',
        price: '$99 - $249',
        deliverables: [
          'Full Animated Stream Overlay',
          'Custom Twitch Panels & Alerts',
          'Subscriber Emotes & Badges',
          'OBS / Streamlabs Setup Guidance'
        ]
      };
    } else {
      return {
        title: 'E-commerce & Brand Conversion Redesign',
        badge: 'Shopify Select Match',
        matchPercent: '97% Strategic Match',
        description: 'Full Shopify/WooCommerce visual upgrade, ad creative graphics, product banners, and conversion rate optimization.',
        price: '$299 - $599',
        deliverables: [
          'Custom Store Banner & Hero Visuals',
          'Product High-Converting Ad Creatives',
          'Brand Style Guide & Logo Vector',
          'Conversion Rate Optimization Audit'
        ]
      };
    };
  };

  const rec = getRecommendation();

  const handleApplyRecommendation = () => {
    const note = `[Wizard Recommended Package] Platform: ${platform} | Stage: ${channelStage} | Budget Preference: ${budgetTier} -> Recommended: ${rec.title}`;
    showToast('Recommendation locked! Opening order form...', 'success');
    onClose();
    openOrderForm(undefined, undefined, note);
  };

  const handleReset = () => {
    setStep(1);
    setPlatform('YouTube');
    setChannelStage('Growth / Monetization');
    setBudgetTier('Flexible / Open to Negotiation');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-xl rounded-3xl border p-6 sm:p-8 space-y-6 shadow-2xl relative ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-800">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-black">Growth Package Recommendation Wizard</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs font-black">
          <span className="text-slate-400">Step {step} of 3</span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step ? 'w-6 bg-indigo-500' : s < step ? 'w-3 bg-emerald-500' : 'w-3 bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Question Step 1 */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="text-base font-black">What is your primary platform?</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'YouTube', icon: Youtube, color: 'text-red-500' },
                { name: 'Twitch', icon: Tv, color: 'text-purple-400' },
                { name: 'E-commerce', icon: ShoppingBag, color: 'text-emerald-400' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setPlatform(item.name)}
                  className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
                    platform === item.name
                      ? 'bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/30'
                      : isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                  <div className="text-xs font-black">{item.name}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-4 py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>Next: Channel Stage</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Wizard Question Step 2 */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="text-base font-black">What is your current main goal or stage?</h4>
            <div className="space-y-2">
              {[
                'New Channel Launch & Initial Setup',
                'Growth / Monetization (CTR & Subscribers)',
                'Rebranding & Enterprise Scale'
              ].map((stage) => (
                <button
                  key={stage}
                  onClick={() => setChannelStage(stage)}
                  className={`w-full p-4 rounded-2xl border text-left text-xs font-extrabold flex items-center justify-between transition-all ${
                    channelStage === stage
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                      : isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>{stage}</span>
                  {channelStage === stage && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-2xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800 text-xs font-bold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>Generate Tailored Recommendation</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Wizard Result Step 3 */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-5 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500 text-white">
                  {rec.badge}
                </span>
                <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {rec.matchPercent}
                </span>
              </div>

              <h4 className="text-lg font-black text-white">{rec.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>
              <div className="text-sm font-black text-indigo-400">Target Rates: {rec.price}</div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Key Deliverables Included:</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {rec.deliverables.map((d, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto p-3.5 rounded-2xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800 text-xs font-extrabold flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart Quiz</span>
              </button>

              <button
                onClick={handleApplyRecommendation}
                className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Order This Recommended Package</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
