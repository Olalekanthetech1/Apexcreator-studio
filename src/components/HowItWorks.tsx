import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, MousePointerClick, PackageCheck, CreditCard, LineChart } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { theme, setView } = useApp();
  const isLight = theme === 'light';

  const steps = [
    {
      step: '01',
      title: '1. Choose a Service',
      desc: 'Browse our catalog of YouTube, Twitch, Social Media, and Branding services tailored specifically for creators, streamers, and businesses.',
      icon: MousePointerClick,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      step: '02',
      title: '2. Select or Negotiate Price',
      desc: 'Select standard package rates (Basic $70, Standard $230, Premium $460) or propose your own custom price offer. ApexCreator Studio works flexibly with creator budgets.',
      icon: PackageCheck,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      step: '03',
      title: '3. Place Your Order',
      desc: 'Fill out our clean 8-point order form with your channel link and project goals. Complete payment through our secure encrypted checkout.',
      icon: CreditCard,
      color: 'from-purple-500 to-pink-500'
    },
    {
      step: '04',
      title: '4. Track Your Project',
      desc: 'Log into your Customer Dashboard with your unique Order ID to track real-time status updates, message your team, and download finished files.',
      icon: LineChart,
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  return (
    <section className={`py-10 lg:py-14 relative transition-colors duration-300 ${
      isLight ? 'bg-white text-slate-900' : 'bg-slate-950 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-600">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Seamless Service Process</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            How ApexCreator Works
          </h2>

          <p className={`text-base sm:text-lg ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            A simple 4-step process designed to elevate your digital presence quickly, securely, and professionally.
          </p>
        </div>

        {/* 4 Steps Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {steps.map((s, idx) => {
            const IconComponent = s.icon;
            return (
              <div
                key={idx}
                className={`relative rounded-2xl border p-6 space-y-4 transition-all shadow-sm group flex flex-col justify-between ${
                  isLight ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-tr ${s.color} text-white shadow-lg`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`text-3xl font-black font-mono transition-colors ${
                      isLight ? 'text-slate-300 group-hover:text-indigo-400' : 'text-slate-700 group-hover:text-blue-500/40'
                    }`}>
                      {s.step}
                    </span>
                  </div>

                  <h3 className={`text-lg font-bold group-hover:text-indigo-600 transition-colors ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    {s.title}
                  </h3>

                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {s.desc}
                  </p>
                </div>

                <div className={`pt-3 border-t text-[11px] font-semibold text-indigo-600 flex items-center gap-1 ${
                  isLight ? 'border-slate-200' : 'border-slate-800/60'
                }`}>
                  <span>Step {s.step} Execution</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className={`p-8 rounded-3xl border text-center space-y-4 max-w-4xl mx-auto shadow-sm ${
          isLight
            ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-indigo-200'
            : 'bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 border border-blue-500/30'
        }`}>
          <h3 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Ready To Scale Your Online Presence?</h3>
          <p className={`text-sm max-w-xl mx-auto ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            Choose a service package today and let our team of specialized digital strategists, designers, and channel auditors build your brand.
          </p>
          <button
            onClick={() => setView('services')}
            className="px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all inline-flex items-center gap-2"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
