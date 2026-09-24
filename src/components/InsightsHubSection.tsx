import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InsightArticle } from '../types';
import {
  BookOpen,
  Clock,
  User,
  CheckCircle2,
  ArrowRight,
  X,
  Sparkles,
  Zap,
  Share2
} from 'lucide-react';

export const InsightsHubSection: React.FC = () => {
  const { theme, openOrderForm, showToast, insights } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [readingArticle, setReadingArticle] = useState<InsightArticle | null>(null);

  const isLight = theme === 'light';

  const categories = ['All', 'YouTube Strategy', 'Twitch & Gaming', 'E-commerce & Merch'];

  const filteredArticles = selectedCategory === 'All'
    ? insights
    : insights.filter((a) => a.category === selectedCategory);

  return (
    <section className={`py-16 border-b transition-colors duration-300 ${
      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-900 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-black text-indigo-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Creator Resource & Strategy Insights</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Industry Guides, Channel SEO & Monetization Blueprints
          </h2>
          <p className={`text-sm max-w-2xl mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            In-depth guides written by ApexCreator Studio agency strategists to help content creators, streamers, and e-commerce stores scale.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : isLight
                    ? 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xl group ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}
            >
              {/* Cover Image */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={art.coverImage}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-slate-950/80 backdrop-blur text-indigo-400 border border-slate-800">
                  {art.category}
                </span>
              </div>

              {/* Content Body */}
              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      {art.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {art.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-black leading-snug group-hover:text-indigo-400 transition-colors">
                    {art.title}
                  </h3>

                  <p className={`text-xs leading-relaxed line-clamp-3 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    {art.summary}
                  </p>
                </div>

                <button
                  onClick={() => setReadingArticle(art)}
                  className="w-full mt-4 py-3 px-4 rounded-2xl bg-indigo-500/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 text-xs font-extrabold flex items-center justify-center gap-2 transition-all group/btn"
                >
                  <span>Read Strategy Blueprint</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Reader Modal */}
        {readingArticle && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className={`w-full max-w-3xl rounded-3xl border p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
            }`}>
              
              {/* Reader Header */}
              <div className="flex items-start justify-between gap-4 border-b pb-4 border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {readingArticle.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      By {readingArticle.author} • {readingArticle.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black">{readingArticle.title}</h3>
                </div>

                <button
                  onClick={() => setReadingArticle(null)}
                  className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cover Banner */}
              <div className="h-56 rounded-2xl overflow-hidden">
                <img
                  src={readingArticle.coverImage}
                  alt={readingArticle.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Key Takeaways Box */}
              <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-3">
                <h4 className="text-xs font-black text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Key Strategic Takeaways</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {readingArticle.keyTakeaways.map((takeaway, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Article Content Paragraphs */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {readingArticle.content.map((p, idx) => (
                  <p key={idx} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    {p}
                  </p>
                ))}
              </div>

              {/* Reader Footer CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showToast('Guide link copied to clipboard!', 'success');
                  }}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Guide</span>
                </button>

                <button
                  onClick={() => {
                    setReadingArticle(null);
                    openOrderForm();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Apply Strategy To My Channel</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
