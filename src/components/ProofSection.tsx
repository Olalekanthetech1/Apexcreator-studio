import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProofItem } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Calendar, Filter, Image as ImageIcon } from 'lucide-react';

export const ProofSection: React.FC = () => {
  const { proofs, setView, theme } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProof, setSelectedProof] = useState<ProofItem | null>(null);

  const isLight = theme === 'light';
  const visibleProofs = proofs.filter((p) => !p.hidden);

  const filterCategories = [
    'All',
    'YouTube',
    'Twitch',
    'Social Media',
    'Branding',
    'Graphics',
    'Growth & Optimization'
  ];

  const filteredProofs = visibleProofs.filter((item) => {
    if (activeCategory === 'All') return true;
    return (
      item.category === activeCategory ||
      item.platform === activeCategory ||
      (activeCategory === 'Graphics' && item.category === 'Graphics & Branding')
    );
  });

  return (
    <section id="proof-section" className={`py-10 lg:py-14 relative transition-colors duration-300 ${
      isLight ? 'bg-white text-slate-900' : 'bg-slate-950 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Verified Portfolio & Client Work</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Proof of Our Work
          </h2>

          <p className={`text-base sm:text-lg ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            See examples of projects we’ve completed and the results delivered for our clients across YouTube, Twitch, social platforms, and custom branding.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {filterCategories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : isLight
                    ? 'bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Proof Items Gallery */}
        {filteredProofs.length === 0 ? (
          <div className={`text-center py-12 rounded-2xl border space-y-2 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/40 border-slate-800'
          }`}>
            <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
            <p className={`font-semibold text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Your project proof will appear here.
            </p>
            <p className="text-slate-500 text-xs">No entries found for category "{activeCategory}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredProofs.map((item) => (
              <div
                key={item.id}
                className={`group rounded-3xl border overflow-hidden shadow-sm transition-all flex flex-col justify-between ${
                  isLight ? 'bg-slate-50 border-slate-200 hover:border-amber-500/50' : 'bg-slate-900 border-slate-800 hover:border-amber-500/40'
                }`}
              >
                {/* Images Container */}
                <div className="relative bg-slate-950 aspect-[16/9] overflow-hidden grid grid-cols-2 gap-0.5 border-b border-slate-800">
                  
                  {/* Before Screenshot */}
                  <div className="relative h-full overflow-hidden group/img">
                    <img
                      src={item.beforeImage || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80'}
                      alt="Before"
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border border-slate-800">
                      Before
                    </div>
                  </div>

                  {/* After Screenshot */}
                  <div className="relative h-full overflow-hidden group/img">
                    <img
                      src={item.afterImage || item.resultImage || 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&auto=format&fit=crop&q=80'}
                      alt="After/Result"
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-emerald-500/90 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-white shadow">
                      Optimized / Result
                    </div>
                  </div>

                </div>

                {/* Details Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-600 border border-blue-500/20">
                      {item.platform}
                    </span>
                    <span className={`flex items-center gap-1 font-mono text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      <Calendar className="w-3.5 h-3.5" />
                      Completed {item.dateCompleted}
                    </span>
                  </div>

                  <h3 className={`text-lg font-bold group-hover:text-amber-500 transition-colors ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    {item.title}
                  </h3>

                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    {item.description}
                  </p>

                  <div className={`pt-2 text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Service Delivered:{' '}
                    <span className="text-amber-600 font-bold">{item.serviceProvided}</span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className={`p-4 border-t flex items-center justify-between text-xs ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800/80'
                }`}>
                  <span className={`font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Verified Agency Work</span>
                  <button
                    onClick={() => setSelectedProof(item)}
                    className="text-amber-600 hover:text-amber-500 font-bold flex items-center gap-1"
                  >
                    <span>View Full Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* View More Results Action Button */}
        <div className="text-center pt-4">
          <button
            onClick={() => setView('proofs')}
            className="px-8 py-3.5 rounded-2xl text-xs font-bold text-amber-300 bg-slate-900 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-500/60 shadow-xl transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>View All Client Results & Proof Archive</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* MANDATORY DISCLAIMER FROM PROMPT */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center max-w-3xl mx-auto space-y-1">
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            <span>Transparency & Performance Disclaimer</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed italic">
            "Results shown are examples of previous work. Individual results may vary depending on the platform, content, niche, audience, and other factors."
          </p>
        </div>

      </div>

      {/* Detail Modal Preview if clicked */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-white">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase text-amber-400">{selectedProof.platform} • {selectedProof.category}</span>
                <h3 className="text-xl font-bold">{selectedProof.title}</h3>
              </div>
              <button onClick={() => setSelectedProof(null)} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-400 font-bold block mb-1">BEFORE WORK:</span>
                <img src={selectedProof.beforeImage} alt="Before" className="w-full rounded-xl border border-slate-800" referrerPolicy="no-referrer" />
              </div>
              <div>
                <span className="text-xs text-amber-400 font-bold block mb-1">AFTER WORK / RESULT:</span>
                <img src={selectedProof.afterImage || selectedProof.resultImage} alt="After" className="w-full rounded-xl border border-slate-800" referrerPolicy="no-referrer" />
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{selectedProof.description}</p>
            
            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedProof(null)} className="px-5 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold">Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
