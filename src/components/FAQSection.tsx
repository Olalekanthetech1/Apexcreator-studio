import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const { faqs, theme } = useApp();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const isLight = theme === 'light';

  return (
    <section className={`py-10 lg:py-14 relative transition-colors ${
      isLight ? 'bg-white text-slate-900' : 'bg-slate-950 text-white'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold ${
            isLight ? 'bg-blue-50 border border-blue-200 text-blue-700' : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
          }`}>
            <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Frequently Asked Questions
          </h2>
          <p className={`text-base ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Everything you need to know about our digital agency services, delivery timelines, payment, and order tracking.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border overflow-hidden shadow-lg transition-all ${
                  isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-900/90'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className={`w-full p-5 text-left font-bold flex items-center justify-between gap-4 text-base sm:text-lg ${
                    isLight ? 'text-slate-900 hover:text-indigo-700' : 'text-slate-100 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className={`w-5 h-5 shrink-0 ${isLight ? 'text-indigo-600' : 'text-blue-400'}`} />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform shrink-0 ${
                      isOpen ? (isLight ? 'rotate-180 text-indigo-600' : 'rotate-180 text-blue-400') : 'text-slate-500'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className={`px-5 pb-5 pt-1 text-sm leading-relaxed border-t ${
                    isLight ? 'text-slate-600 border-slate-200' : 'text-slate-300 border-slate-800/80'
                  }`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
