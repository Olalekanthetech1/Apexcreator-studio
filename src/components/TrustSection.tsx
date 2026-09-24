import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, Award, HeartHandshake, Eye, CheckCircle2, AlertTriangle } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const { theme } = useApp();
  const isLight = theme === 'light';

  const pillars = [
    {
      title: '100% Policy-Compliant Methods',
      desc: 'All strategy, optimization, design, and consulting practices follow official platform guidelines with zero spam or bot automation.',
      icon: ShieldCheck,
      color: 'text-emerald-600'
    },
    {
      title: 'No Passwords Required',
      desc: 'We never ask for your account passwords or personal credentials. Deliverables and channel access are managed via standard editor permissions or direct file downloads.',
      icon: Lock,
      color: 'text-indigo-600'
    },
    {
      title: 'Transparent USD Pricing',
      desc: 'No hidden fees or recurring traps. All packages (Basic $70, Standard $230, Premium $460) have clear deliverables defined before payment.',
      icon: Award,
      color: 'text-amber-600'
    },
    {
      title: 'Direct Support & Order Tracking',
      desc: 'Track your project status in real time via your private Customer Dashboard with built-in messaging with our agency team.',
      icon: HeartHandshake,
      color: 'text-purple-600'
    }
  ];

  return (
    <section className={`py-16 border-y transition-colors duration-300 relative ${
      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900/60 border-slate-800/80 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
            isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-800 border-slate-700/60 text-indigo-400'
          }`}>
            <Eye className="w-3.5 h-3.5" />
            <span>Why Creators Choose ApexCreator Studio</span>
          </div>
          <h2 className={`text-3xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Built On Integrity & Professional Standards
          </h2>
          <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            We operate as an independent digital agency focused on authentic growth, custom branding, and channel optimization.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => {
            const IconComp = p.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border space-y-3 shadow-sm ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800/80'
                }`}
              >
                <div className={`p-2.5 w-fit rounded-xl border ${p.color} ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                }`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{p.title}</h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* MANDATORY PARTNERSHIP DISCLAIMER */}
        <div className={`p-4 rounded-xl border max-w-3xl mx-auto flex items-start gap-3 text-xs ${
          isLight ? 'bg-amber-500/10 border-amber-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-400'
        }`}>
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Important Disclaimer:</strong> ApexCreator Studio is an independent digital growth and branding agency. We are not affiliated, endorsed, or officially partnered with YouTube, Twitch, Meta, Instagram, X, or any social media platform. All trademarks belong to their respective owners.
          </p>
        </div>

      </div>
    </section>
  );
};
