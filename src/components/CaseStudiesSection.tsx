import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CaseStudy } from '../types';
import {
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  X,
  Zap,
  Award,
  Clock
} from 'lucide-react';

export const CaseStudiesSection: React.FC = () => {
  const { theme, openOrderForm, caseStudies } = useApp();
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);

  const isLight = theme === 'light';

  return (
    <section className={`py-16 border-b transition-colors duration-300 ${
      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950/80 border-slate-900 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-extrabold text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Dedicated Case Studies & Verified Results</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Real Creator Transformations & Strategy Breakdowns
          </h2>
          <p className={`text-sm max-w-2xl mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Explore how ApexCreator Studio diagnoses channel bottlenecks, engineers high-CTR packaging, and delivers measurable audience growth.
          </p>
        </div>

        {/* Case Studies Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {caseStudies.map((cs) => (
            <div
              key={cs.id}
              className={`rounded-3xl border p-6 space-y-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xl relative group ${
                isLight ? 'bg-white border-slate-200 hover:border-emerald-500/50' : 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/50'
              }`}
            >
              <div className="space-y-4">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {cs.platform} • {cs.timeframe}
                  </span>
                  <span className={`text-xs font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {cs.clientHandle}
                  </span>
                </div>

                {/* Title & Summary */}
                <h3 className="text-lg font-black leading-snug group-hover:text-emerald-400 transition-colors">
                  {cs.title}
                </h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {cs.summary}
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/60">
                  {cs.metrics.map((m, i) => (
                    <div key={i} className={`p-2.5 rounded-2xl border text-center ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                    }`}>
                      <div className="text-xs font-black text-emerald-400">{m.value}</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 line-clamp-1">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedCaseStudy(cs)}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md group/btn"
              >
                <span>Read Full Strategy Case Study</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Modal Deep-Dive Viewer */}
        {selectedCaseStudy && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className={`w-full max-w-3xl rounded-3xl border p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
            }`}>
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b pb-4 border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {selectedCaseStudy.platform} Strategy Case Study
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {selectedCaseStudy.clientName} ({selectedCaseStudy.clientHandle})
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black">{selectedCaseStudy.title}</h3>
                </div>

                <button
                  onClick={() => setSelectedCaseStudy(null)}
                  className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Verified Metrics Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                {selectedCaseStudy.metrics.map((m, idx) => (
                  <div key={idx} className="text-center space-y-0.5">
                    <div className="text-2xl font-black text-emerald-400">{m.value}</div>
                    <div className="text-xs font-bold text-slate-300">{m.label}</div>
                    <div className="text-[10px] font-bold text-emerald-500">{m.change}</div>
                  </div>
                ))}
              </div>

              {/* Challenge & Strategy */}
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <h4 className="font-extrabold text-amber-400 flex items-center gap-2 text-xs uppercase tracking-wider">
                    <BarChart3 className="w-4 h-4" />
                    <span>The Initial Bottleneck & Challenge</span>
                  </h4>
                  <p className="text-slate-300 leading-relaxed">{selectedCaseStudy.challenge}</p>
                </div>

                <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <h4 className="font-extrabold text-emerald-400 flex items-center gap-2 text-xs uppercase tracking-wider">
                    <Zap className="w-4 h-4" />
                    <span>ApexCreator Custom Studio Strategy</span>
                  </h4>
                  <p className="text-slate-300 leading-relaxed">{selectedCaseStudy.strategy}</p>
                </div>

                {/* Execution Steps */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-200 text-xs uppercase tracking-wider">
                    Tactical Execution Plan Delivered
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedCaseStudy.execution.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-300 leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonial Quote */}
                {selectedCaseStudy.testimonialQuote && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-purple-500/10 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Award className="w-4 h-4" />
                      <span className="text-xs font-bold">Verified Client Feedback</span>
                    </div>
                    <p className="text-xs italic text-slate-200">
                      "{selectedCaseStudy.testimonialQuote}"
                    </p>
                    <div className="text-[11px] font-bold text-emerald-400">
                      — {selectedCaseStudy.clientName}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Ready to achieve similar results for your channel?</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedCaseStudy(null);
                    openOrderForm();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get Strategy For My Channel</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
