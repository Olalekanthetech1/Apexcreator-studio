import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Sliders,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowRight,
  Eye,
  Tv,
  Youtube,
  Share2,
  Palette
} from 'lucide-react';

interface TransformationItem {
  id: string;
  creatorName: string;
  niche: string;
  platform: 'YouTube' | 'Twitch' | 'Social Media' | 'Graphics';
  beforeImage: string;
  afterImage: string;
  beforeStats: string;
  afterStats: string;
  keyMetric: string;
  metricLabel: string;
  quote: string;
}

const TRANSFORMATIONS: TransformationItem[] = [
  {
    id: 'gaming-beast',
    creatorName: 'Aero Gaming (140k Subs)',
    niche: 'Gaming & Esport',
    platform: 'YouTube',
    beforeImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    beforeStats: '2.1% CTR • Generic Stock Thumbnails',
    afterStats: '11.8% CTR • Custom 4K Cinema Graphics',
    keyMetric: '+460%',
    metricLabel: 'CTR & Viewer Impressions',
    quote: 'ApexCreator Studio completely revitalized my channel aesthetics. Within 30 days, my YouTube click-through rate quadrupled!'
  },
  {
    id: 'twitch-streamer',
    creatorName: 'ValkyrieLive (Streamer)',
    niche: 'Twitch Partner',
    platform: 'Twitch',
    beforeImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    beforeStats: 'Static Free Overlay • Low Subs',
    afterStats: 'Animated Neo-Cyber Suite • Partnered',
    keyMetric: '3.5x',
    metricLabel: 'Sub Retention & Subscriptions',
    quote: 'The custom animated stream overlays gave my stream the high-end broadcast feel of a major esports studio.'
  },
  {
    id: 'tech-finance',
    creatorName: 'Wealth & Tech Daily',
    niche: 'Finance & Tech',
    platform: 'Social Media',
    beforeImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
    beforeStats: 'Inconsistent Fonts & Colors',
    afterStats: 'Unified Premium Brand Guideline',
    keyMetric: '$45,000+',
    metricLabel: 'New Sponsorship Deals Secured',
    quote: 'Brands started taking us seriously immediately after ApexCreator Studio redesigned our media kit and social channels.'
  }
];

export const BeforeAfterGallery: React.FC = () => {
  const { theme, setView, setSelectedCategory } = useApp();
  const isLight = theme === 'light';

  const [activeId, setActiveId] = useState<string>(TRANSFORMATIONS[0].id);
  const [sliderPos, setSliderPos] = useState<number>(50); // 0 to 100%
  const containerRef = useRef<HTMLDivElement>(null);

  const currentItem = TRANSFORMATIONS.find((t) => t.id === activeId) || TRANSFORMATIONS[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  return (
    <section id="transformation-gallery" className={`py-12 lg:py-16 relative border-t transition-colors duration-300 ${
      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-600">
            <Sliders className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Visual Transformations</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Before & After Channel Transformations
          </h2>

          <p className={`text-base sm:text-lg ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Drag the slider across real channel revamps to compare amateur visual setups against ApexCreator Studio 4K branding & channel optimization.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {TRANSFORMATIONS.map((item) => {
            const active = item.id === activeId;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveId(item.id);
                  setSliderPos(50);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : isLight
                    ? 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{item.creatorName}</span>
                <span className="text-[10px] opacity-80 uppercase tracking-wider">({item.platform})</span>
              </button>
            );
          })}
        </div>

        {/* Drag To Compare Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Interactive Comparison Slider Box (8 Cols) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
              <span className="text-red-500 flex items-center gap-1">
                ◀ BEFORE ApexCreator
              </span>
              <span className="text-slate-500 hidden sm:inline">Drag or hover slider to compare</span>
              <span className="text-emerald-500 flex items-center gap-1">
                AFTER ApexCreator Branding ▶
              </span>
            </div>

            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative w-full aspect-[16/9] sm:aspect-[16/9] rounded-3xl overflow-hidden cursor-col-resize select-none border border-slate-800 shadow-2xl bg-slate-950"
            >
              {/* After Image (Full Background) */}
              <img
                src={currentItem.afterImage}
                alt="After Channel Redesign"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-black shadow-lg">
                AFTER: ApexCreator Studio
              </div>

              {/* Before Image (Clipped overlay) */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white shadow-2xl z-20"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={currentItem.beforeImage}
                  alt="Before Channel Redesign"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
                />
                <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-slate-900/90 text-red-400 text-xs font-black shadow-lg">
                  BEFORE (Old Setup)
                </div>
              </div>

              {/* Drag Handle Bar */}
              <div
                className="absolute top-0 bottom-0 z-30 w-1 bg-white cursor-col-resize shadow-2xl pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl border-2 border-white text-xs font-bold">
                  ↔
                </div>
              </div>
            </div>
          </div>

          {/* Transformation Impact Details (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`p-6 rounded-3xl border shadow-xl space-y-6 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div>
                <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                  {currentItem.niche} • {currentItem.platform}
                </span>
                <h3 className={`text-2xl font-black mt-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {currentItem.creatorName}
                </h3>
              </div>

              {/* Metric Hero Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white space-y-1 shadow-lg">
                <div className="text-3xl font-black">{currentItem.keyMetric}</div>
                <div className="text-xs font-bold text-indigo-100 uppercase tracking-wider">
                  {currentItem.metricLabel}
                </div>
              </div>

              {/* Before vs After stats */}
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-semibold">
                  <strong>Before:</strong> {currentItem.beforeStats}
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <strong>After:</strong> {currentItem.afterStats}
                </div>
              </div>

              {/* Creator Quote */}
              <blockquote className={`text-xs italic leading-relaxed border-l-2 pl-3 ${
                isLight ? 'border-indigo-500 text-slate-600' : 'border-indigo-500 text-slate-300'
              }`}>
                "{currentItem.quote}"
              </blockquote>

              {/* Action Button */}
              <button
                onClick={() => {
                  setSelectedCategory(currentItem.platform === 'Graphics' ? 'Graphics & Branding' : currentItem.platform);
                  setView('services');
                }}
                className="w-full py-3.5 rounded-2xl text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>Transform My {currentItem.platform} Channel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
