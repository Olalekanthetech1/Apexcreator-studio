import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  X,
  Sparkles,
  Zap,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Compass,
  Youtube,
  Tv,
  Share2,
  Palette,
  DollarSign,
  Clock,
  Send,
  UserCheck,
  TrendingUp
} from 'lucide-react';

interface ConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GrowthConciergeModal: React.FC<ConciergeModalProps> = ({ isOpen, onClose }) => {
  const { theme, services, openOrderForm, getAiRecommendation } = useApp();
  const isLight = theme === 'light';

  const [step, setStep] = useState<number>(1);
  const [platform, setPlatform] = useState<string>('YouTube');
  const [goal, setGoal] = useState<string>('');
  const [niche, setNiche] = useState<string>('');
  const [channelUrl, setChannelUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiRecommendation, setAiRecommendation] = useState<{
    analysis: string;
    recommendations: {
      serviceId: string;
      reason: string;
      expectedImpact: string;
    }[];
    proTip: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleGetAiRecommendation = async () => {
    setIsLoading(true);
    const result = await getAiRecommendation({
      channelUrl,
      niche,
      goals: goal,
      currentChallenges: 'Stagnant growth'
    });
    setAiRecommendation(result);
    setIsLoading(false);
    if (result) setStep(4);
  };

  const handleSelectRecommendation = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId) || services[0];
    openOrderForm(service, 'STANDARD');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden z-10 transition-all ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
      }`}>
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">Growth Concierge Assistant</h3>
                <span className="px-2 py-0.5 text-[9px] font-black tracking-wider uppercase rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Match your creator goals with the exact ApexCreator Studio package.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase text-indigo-500">Step 1 of 3</span>
                <h4 className="text-xl font-bold">Which primary platform do you create for?</h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'YouTube', icon: Youtube, color: 'text-red-500' },
                  { name: 'Twitch', icon: Tv, color: 'text-purple-400' },
                  { name: 'Social Media', icon: Share2, color: 'text-sky-400' },
                  { name: 'Branding', icon: Palette, color: 'text-emerald-400' }
                ].map((p) => (
                  <button
                    key={p.name}
                    onClick={() => {
                      setPlatform(p.name);
                      setStep(2);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col items-center justify-center gap-2 text-center ${
                      platform === p.name
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/30'
                        : isLight
                        ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <p.icon className={`w-6 h-6 ${platform === p.name ? 'text-white' : p.color}`} />
                    <span className="text-xs font-bold">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase text-indigo-500">Step 2 of 3</span>
                <h4 className="text-xl font-bold">Tell us more about your channel</h4>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Channel / Social URL</label>
                  <input
                    type="text"
                    value={channelUrl}
                    onChange={(e) => setChannelUrl(e.target.value)}
                    placeholder="youtube.com/@channelname"
                    className={`w-full px-4 py-3 rounded-2xl border transition-colors focus:outline-none focus:border-indigo-500 text-xs font-bold ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
                    }`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Niche / Category</label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="e.g. Gaming, Tech, Finance..."
                    className={`w-full px-4 py-3 rounded-2xl border transition-colors focus:outline-none focus:border-indigo-500 text-xs font-bold ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  disabled={!channelUrl || !niche}
                  onClick={() => setStep(3)}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Continue to Goals</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="w-full text-xs text-slate-400 hover:underline pt-3"
                >
                  ← Back to Platform
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase text-indigo-500">Step 3 of 3</span>
                <h4 className="text-xl font-bold">What is your biggest current channel goal?</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'CTR & 4K Visual Rebrand',
                  'Monetization & Watch Time',
                  'Live Stream Alert Suite',
                  'Sponsorship & Media Kit'
                ].map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setGoal(g);
                      handleGetAiRecommendation();
                    }}
                    disabled={isLoading}
                    className={`p-4 rounded-2xl border text-left transition-all font-bold text-xs flex items-center justify-between ${
                      goal === g
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : isLight
                        ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    } ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    <span>{g}</span>
                    {isLoading && goal === g ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4 opacity-70" />
                    )}
                  </button>
                ))}
              </div>

              <button
                disabled={isLoading}
                onClick={() => setStep(2)}
                className="text-xs text-slate-400 hover:underline pt-2"
              >
                ← Back to Channel Info
              </button>
            </div>
          )}

          {step === 4 && aiRecommendation && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase text-emerald-500">AI Personalization Complete</span>
                <h4 className="text-2xl font-black">Your Personalized Growth Roadmap</h4>
              </div>

              <div className={`p-5 rounded-2xl border ${isLight ? 'bg-indigo-50 border-indigo-100' : 'bg-indigo-500/5 border-indigo-500/20'}`}>
                <p className="text-xs italic leading-relaxed text-slate-400">
                  "{aiRecommendation.analysis}"
                </p>
              </div>

              <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Recommended Agency Packages:</h5>
                <div className="grid grid-cols-1 gap-4">
                  {aiRecommendation.recommendations.map((rec, idx) => {
                    const service = services.find(s => s.id === rec.serviceId);
                    if (!service) return null;
                    return (
                      <div key={idx} className={`p-5 rounded-3xl border transition-all hover:border-indigo-500/50 ${
                        isLight ? 'bg-white border-slate-200' : 'bg-slate-900/50 border-slate-800'
                      }`}>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h6 className="font-black text-sm text-indigo-400">{service.title}</h6>
                            <p className="text-[11px] text-slate-300 mt-1">{rec.reason}</p>
                            <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-emerald-500">
                              <TrendingUp className="w-3 h-3" />
                              <span>{rec.expectedImpact}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSelectRecommendation(service.id)}
                            className="shrink-0 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black transition-all"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pro Tip Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 text-amber-500">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider">AI Growth Alpha Tip</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {aiRecommendation.proTip}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => setStep(1)}
                  className={`w-full sm:flex-1 py-3.5 rounded-2xl text-xs font-extrabold border transition-colors ${
                    isLight ? 'bg-white border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  Start Over
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs font-bold text-slate-400"
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
