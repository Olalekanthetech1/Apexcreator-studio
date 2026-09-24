import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Crown,
  Users,
  Award,
  Sparkles,
  ShieldCheck,
  Target,
  ArrowRight,
  Video,
  Palette,
  ShoppingBag
} from 'lucide-react';

export const AboutFounderSection: React.FC = () => {
  const { theme, setView, team } = useApp();
  const isLight = theme === 'light';

  const founder = team.find(m => m.id.includes('apexcreator') || m.id.includes('denny')) || team[0];

  const methodologySteps = [
    {
      num: '01',
      title: 'Diagnostic Channel Audit',
      desc: 'We analyze your viewer drop-off points, CTR metrics, niche keyword gaps, and competitor packaging.',
      icon: Target,
      color: 'text-blue-400'
    },
    {
      num: '02',
      title: 'Strategic Blueprint & Hook Engineering',
      desc: 'We craft bespoke thumbnail concepts, title curiosity gaps, and retention hook structures.',
      icon: Sparkles,
      color: 'text-amber-400'
    },
    {
      num: '03',
      title: 'Bespoke Asset Production',
      desc: 'Our design and video team produces 4K graphics, motion overlays, and broadcast-ready stream packages.',
      icon: Palette,
      color: 'text-purple-400'
    },
    {
      num: '04',
      title: 'Launch & Growth Tracking',
      desc: 'Deliverables are applied directly. Track progress and talk with our strategists inside your private dashboard.',
      icon: Award,
      color: 'text-emerald-400'
    }
  ];

  return (
    <section className={`py-16 border-b transition-colors duration-300 ${
      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-900 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Founder Story Spotlight */}
        <div className={`p-8 sm:p-12 rounded-3xl border relative overflow-hidden shadow-2xl ${
          isLight ? 'bg-slate-900 text-white border-slate-800' : 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/60 border-slate-800'
        }`}>
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Founder Avatar & Stats */}
            <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
              <div className="relative inline-block">
                {founder && (
                  <img
                    src={founder.avatar}
                    alt="ApexCreator Founder"
                    className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl object-cover mx-auto border-4 border-indigo-500/40 shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute -bottom-3 right-1/2 lg:right-0 translate-x-1/2 lg:translate-x-0 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Agency Director</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white">ApexCreator</h3>
                <p className="text-xs font-semibold text-indigo-400">Founder & Chief Growth Strategist</p>
                <div className="flex items-center justify-center lg:justify-start gap-2 pt-2 text-[11px] text-slate-400 font-medium">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">8+ Years Industry Experience</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">500+ Channels Serviced</span>
                </div>
              </div>
            </div>

            {/* Founder Story Message */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400">
                <Users className="w-3.5 h-3.5" />
                <span>Humanizing Digital Services</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                "We Build Digital Brands With The Same Care We Apply To Our Own Channels."
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                ApexCreator Studio was founded to bridge the gap between creative passion and strategic execution. After years of running content channels and navigating algorithm shifts across YouTube and Twitch, we recognized that creators don't need generic visual templates — they need high-converting channel packaging, strategic title engineering, and reliable team support.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-xs">
                <div>
                  <div className="font-black text-white text-base">99.4%</div>
                  <div className="text-[11px] text-slate-400">Client Satisfaction</div>
                </div>
                <div>
                  <div className="font-black text-emerald-400 text-base">100%</div>
                  <div className="text-[11px] text-slate-400">Policy Compliant</div>
                </div>
                <div>
                  <div className="font-black text-indigo-400 text-base">24-48 Hours</div>
                  <div className="text-[11px] text-slate-400">Fast Turnaround</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Strategy Team Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl font-black">Meet Our Lead Strategists & Designers</h3>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Every order is assigned to experienced specialists in graphic design, video editing, and e-commerce architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m) => (
              <div
                key={m.id}
                className={`p-6 rounded-3xl border space-y-4 shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="relative">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-24 h-24 rounded-2xl object-cover mx-auto border-2 border-indigo-500/30"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-600 text-white shadow">
                    {m.experienceYears}
                  </span>
                </div>

                <div className="text-center space-y-1 pt-1">
                  <h4 className="font-black text-sm">{m.name}</h4>
                  <p className="text-[11px] font-bold text-indigo-500">{m.role}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{m.specialty}</p>
                </div>

                <p className={`text-xs leading-relaxed text-center ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {m.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Behind-The-Scenes Agency Methodology */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Behind-The-Scenes Methodology</span>
            </div>
            <h3 className="text-2xl font-black">How ApexCreator Delivers Measurable Growth</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {methodologySteps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.num}
                  className={`p-6 rounded-3xl border space-y-3 relative overflow-hidden shadow-md ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-500 opacity-40 font-mono">{step.num}</span>
                    <div className={`p-2.5 rounded-2xl bg-slate-950 border border-slate-800 ${step.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  <h4 className="font-extrabold text-sm">{step.title}</h4>
                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
