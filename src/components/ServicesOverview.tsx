import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceCategory, ServiceItem } from '../types';
import {
  Youtube,
  Tv,
  Share2,
  Palette,
  Search,
  Sparkles,
  ArrowRight,
  Check,
  Star,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Compass,
  DollarSign,
  LineChart,
  CheckCircle,
  Layers,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Smile,
  Sliders,
  TrendingUp,
  Instagram,
  Video,
  Facebook,
  Twitter,
  Calendar,
  Layout,
  UserCheck,
  PenTool,
  Box,
  BookOpen,
  Megaphone,
  FileText
} from 'lucide-react';

export const IconRenderer: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Youtube': return <Youtube className={className} />;
    case 'Tv': return <Tv className={className} />;
    case 'Share2': return <Share2 className={className} />;
    case 'Palette': return <Palette className={className} />;
    case 'BarChart3': return <BarChart3 className={className} />;
    case 'Search': return <Search className={className} />;
    case 'Compass': return <Compass className={className} />;
    case 'DollarSign': return <DollarSign className={className} />;
    case 'LineChart': return <LineChart className={className} />;
    case 'CheckCircle': return <CheckCircle className={className} />;
    case 'Layers': return <Layers className={className} />;
    case 'PlayCircle': return <PlayCircle className={className} />;
    case 'PauseCircle': return <PauseCircle className={className} />;
    case 'StopCircle': return <StopCircle className={className} />;
    case 'Smile': return <Smile className={className} />;
    case 'Sliders': return <Sliders className={className} />;
    case 'TrendingUp': return <TrendingUp className={className} />;
    case 'Instagram': return <Instagram className={className} />;
    case 'Video': return <Video className={className} />;
    case 'Facebook': return <Facebook className={className} />;
    case 'Twitter': return <Twitter className={className} />;
    case 'Calendar': return <Calendar className={className} />;
    case 'Layout': return <Layout className={className} />;
    case 'UserCheck': return <UserCheck className={className} />;
    case 'PenTool': return <PenTool className={className} />;
    case 'Box': return <Box className={className} />;
    case 'BookOpen': return <BookOpen className={className} />;
    case 'Megaphone': return <Megaphone className={className} />;
    case 'FileText': return <FileText className={className} />;
    default: return <Sparkles className={className} />;
  }
};

export const ServicesOverview: React.FC = () => {
  const {
    theme,
    services,
    selectedCategory,
    setSelectedCategory,
    openServiceDetail,
    openOrderForm
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isLight = theme === 'light';

  const categories: ServiceCategory[] = [
    'YouTube',
    'Twitch',
    'Social Media',
    'Graphics & Branding'
  ];

  const activeCategory = selectedCategory === 'All' ? 'YouTube' : selectedCategory;

  const filteredServices = services.filter((service) => {
    const matchesCategory = service.category === activeCategory;
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="services-section" className={`py-10 lg:py-14 relative transition-colors duration-300 ${
      isLight ? 'bg-white text-slate-900' : 'bg-slate-950 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-600">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Full Digital Service Catalog</span>
          </div>

          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Professional Growth & Branding Solutions
          </h2>

          <p className={`text-sm sm:text-base ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Select a service category below to view specific solutions. Fixed baseline packages ($70 Basic, $230 Standard, $460 Premium) with <strong className="text-indigo-600">custom price negotiation</strong> accepted on all orders.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className={`flex flex-col md:flex-row items-center justify-between gap-4 p-3.5 rounded-2xl border backdrop-blur-xl ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-slate-800'
        }`}>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : isLight
                      ? 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                      : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {cat === 'YouTube' && <Youtube className="w-3.5 h-3.5 text-red-500" />}
                  {cat === 'Twitch' && <Tv className="w-3.5 h-3.5 text-purple-600" />}
                  {cat === 'Social Media' && <Share2 className="w-3.5 h-3.5 text-indigo-600" />}
                  {cat === 'Graphics & Branding' && <Palette className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-64">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className={`w-full pl-9 pr-3.5 py-2 rounded-xl text-xs transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isLight
                  ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400'
                  : 'bg-slate-950 border border-slate-800 text-white placeholder-slate-500'
              }`}
            />
          </div>

        </div>

        {/* Services Horizontal Scroll Carousel */}
        {filteredServices.length === 0 ? (
          <div className={`text-center py-12 rounded-2xl border space-y-3 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/40 border-slate-800'
          }`}>
            <Search className="w-8 h-8 text-slate-400 mx-auto" />
            <p className={`font-semibold text-base ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
              No services found matching your criteria.
            </p>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
              Try resetting your search query or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Horizontal Navigation Controls Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                  {activeCategory} Services
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-300'
                }`}>
                  {filteredServices.length} Total
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  (Swipe or use arrows to scroll horizontally)
                </span>
              </div>

              {/* Scroll Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scroll('left')}
                  className={`p-2 rounded-xl border transition-all ${
                    isLight
                      ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className={`p-2 rounded-xl border transition-all ${
                    isLight
                      ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Scroll Track */}
            <div
              ref={scrollContainerRef}
              className="flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 scrollbar-none scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filteredServices.map((service) => {
                const basicMaxPrice = service.packages.BASIC.price;
                const isPopular = service.popular;

                return (
                  <div
                    key={service.id}
                    className={`shrink-0 w-[290px] sm:w-[330px] snap-start group relative rounded-2xl border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden shadow-md hover:shadow-xl ${
                      isPopular
                        ? 'border-indigo-500/50 shadow-indigo-500/10 hover:border-indigo-500'
                        : isLight
                        ? 'bg-white border-slate-200/90 hover:border-slate-300'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Card Content */}
                    <div className="p-4 sm:p-5 space-y-3">
                      
                      {/* Top Row: Category & Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isLight ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-slate-800 text-slate-300 border border-slate-700/60'
                        }`}>
                          {service.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            Negotiable
                          </span>
                          {isPopular && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-600 text-white shadow-sm flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-white text-white" />
                              Popular
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Icon */}
                      <div className="flex items-start gap-2.5 pt-0.5">
                        <div className={`p-2.5 rounded-xl border text-indigo-600 shrink-0 group-hover:scale-105 transition-all ${
                          isLight ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-950 border-slate-800'
                        }`}>
                          <IconRenderer name={service.iconName} className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className={`text-sm sm:text-base font-bold group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2 ${
                            isLight ? 'text-slate-900' : 'text-white'
                          }`}>
                            {service.title}
                          </h3>
                          <p className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{service.deliveryInfo}</p>
                        </div>
                      </div>

                      {/* Short Description */}
                      <p className={`text-xs leading-relaxed line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                        {service.shortDesc || service.fullDesc || ''}
                      </p>

                      {/* Key Features Bullet List */}
                      <div className={`pt-2 border-t space-y-1 text-[11px] ${
                        isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800/80 text-slate-400'
                      }`}>
                        {(service.whatIsIncluded || service.features || []).slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{item}</span>
                          </div>
                        ))}
                      </div>

                    </div>

                    {/* Card Footer: Price & CTA */}
                    <div className={`p-4 pt-3 border-t flex items-center justify-between gap-2 ${
                      isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-900/90 border-slate-800/40'
                    }`}>
                      <div>
                        <span className={`text-[9px] uppercase tracking-wider font-semibold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          Basic Rate
                        </span>
                        <div className="flex items-baseline gap-0.5">
                          <span className={`text-base sm:text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>${basicMaxPrice}</span>
                          <span className={`text-[9px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>USD</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openServiceDetail(service)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            isLight
                              ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                              : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                          }`}
                        >
                          Details
                        </button>

                        <button
                          onClick={() => openOrderForm(service, 'BASIC')}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <span>Negotiate</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
