import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, Sparkles, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, theme } = useApp();
  const isLight = theme === 'light';

  return (
    <section className={`py-16 lg:py-24 relative transition-colors ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold ${
            isLight ? 'bg-blue-50 border border-blue-200 text-blue-700' : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
          }`}>
            <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
            <span>Verified Client Feedback</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            What Creators & Businesses Say
          </h2>
          <p className={`text-base sm:text-lg ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Read feedback from YouTubers, Twitch streamers, content creators, and brand owners who have worked with ApexCreator Studio.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className={`p-6 rounded-3xl border space-y-4 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between ${
                isLight ? 'bg-white border-slate-200 hover:border-indigo-300' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-4">
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className={`w-6 h-6 ${isLight ? 'text-slate-300' : 'text-slate-700'}`} />
                </div>
                {/* Testimonial Quote */}
                <p className={`text-sm leading-relaxed italic ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                  "{t.text}"
                </p>
              </div>

              {/* Author Details */}
              <div className={`pt-4 border-t flex items-center justify-between text-xs ${
                isLight ? 'border-slate-100' : 'border-slate-800/80'
              }`}>
                <div>
                  <h4 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.name}</h4>
                  <p className={`${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.role} ({t.handle})</p>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider border block mb-1 ${
                    isLight ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {t.platform}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
