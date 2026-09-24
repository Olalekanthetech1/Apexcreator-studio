import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceCategory } from '../types';
import { LeftSidebarDrawer } from './LeftSidebarDrawer';
import {
  Crown,
  Menu,
  X,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Sparkles,
  Sun,
  Moon,
  Compass,
  Bot,
  Calculator
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    currentView,
    setView,
    setSelectedCategory,
    isAdminLoggedIn,
    orders
  } = useApp();

  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [lastLogoClickTime, setLastLogoClickTime] = useState(0);

  const handleNavClick = (view: any, category?: ServiceCategory | 'All') => {
    setView(view);
    if (category) {
      setSelectedCategory(category);
    }
  };

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastLogoClickTime < 900) {
      const nextCount = logoClicks + 1;
      if (nextCount >= 4) {
        setView('admin');
        setLogoClicks(0);
        return;
      }
      setLogoClicks(nextCount);
    } else {
      setLogoClicks(1);
    }
    setLastLogoClickTime(now);
    
    // Normal navigation to home
    handleNavClick('home');
  };

  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending' || o.status === 'In Progress').length;
  const isLight = theme === 'light';

  return (
    <>
      <header className={`sticky top-0 z-40 w-full border-b transition-colors duration-300 ${
        isLight ? 'border-slate-200/80 bg-white/90 text-slate-900 backdrop-blur-xl shadow-sm' : 'border-slate-800/80 bg-slate-950/80 text-white backdrop-blur-xl'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Brand Logo & Left Menu Toggle */}
          <div className="flex items-center gap-3">
            {/* Left Drawer Toggle Button [≡] */}
            <button
              onClick={() => setIsLeftDrawerOpen(true)}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500 group ${
                isLight
                  ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200 hover:border-indigo-400'
                  : 'bg-slate-900 border-slate-800 text-slate-200 hover:text-white hover:border-indigo-500/50'
              }`}
              title="Open Left Navigation Sidebar (5 Modules)"
              aria-label="Open Left Navigation Drawer"
            >
              <Menu className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
            </button>

            {/* Brand Logo */}
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2 sm:gap-2.5 group text-left focus:outline-none shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all shrink-0">
                <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${isLight ? 'bg-white' : 'bg-slate-950'}`}>
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className={`font-black text-lg sm:text-xl tracking-tight transition-colors ${
                    isLight ? 'text-slate-900 group-hover:text-indigo-600' : 'text-white group-hover:text-indigo-400'
                  }`}>
                    ApexCreator
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-black tracking-wider uppercase rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                    STUDIO
                  </span>
                </div>
                <p className={`text-[10px] sm:text-[11px] font-medium mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Digital Growth & Branding
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className={`hidden xl:flex items-center gap-1.5 text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                currentView === 'home'
                  ? 'bg-indigo-500/10 text-indigo-600 font-semibold border border-indigo-500/20'
                  : isLight ? 'hover:text-slate-900 hover:bg-slate-100' : 'hover:text-white hover:bg-slate-900'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('services', 'All')}
              className={`px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                currentView === 'services'
                  ? 'bg-indigo-500/10 text-indigo-600 font-semibold border border-indigo-500/20'
                  : isLight ? 'hover:text-slate-900 hover:bg-slate-100' : 'hover:text-white hover:bg-slate-900'
              }`}
            >
              Services
            </button>

            <button
              onClick={() => handleNavClick('pricing')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentView === 'pricing'
                  ? 'bg-indigo-500/10 text-indigo-600 font-semibold border border-indigo-500/20'
                  : isLight ? 'hover:text-slate-900 hover:bg-slate-100' : 'hover:text-white hover:bg-slate-900'
              }`}
            >
              Pricing
            </button>

            <button
              onClick={() => handleNavClick('case-studies')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentView === 'case-studies'
                  ? 'bg-indigo-500/10 text-indigo-600 font-semibold border border-indigo-500/20'
                  : isLight ? 'hover:text-slate-900 hover:bg-slate-100' : 'hover:text-white hover:bg-slate-900'
              }`}
            >
              Case Studies
            </button>

            <button
              onClick={() => handleNavClick('proofs')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 ${
                currentView === 'proofs'
                  ? 'bg-indigo-500/10 text-indigo-600 font-semibold border border-indigo-500/20'
                  : isLight ? 'hover:text-slate-900 hover:bg-slate-100' : 'hover:text-white hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Proof & Results
            </button>

            <button
              onClick={() => handleNavClick('my-orders')}
              className={`px-3 py-2 rounded-lg transition-colors relative flex items-center gap-1.5 ${
                currentView === 'my-orders'
                  ? 'bg-indigo-500/10 text-indigo-600 font-semibold border border-indigo-500/20'
                  : isLight ? 'hover:text-slate-900 hover:bg-slate-100' : 'hover:text-white hover:bg-slate-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-indigo-600" />
              My Orders
              {pendingOrdersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              )}
            </button>
          </nav>

          {/* Right Header Action CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-concierge'));
              }}
              className="hidden sm:flex px-3 py-2 rounded-xl text-xs font-bold text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all items-center gap-1.5 focus:outline-none"
              title="AI Growth Assistant & Service Concierge"
            >
              <Bot className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Concierge</span>
            </button>

            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-recommender'));
              }}
              className="hidden md:flex px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all items-center gap-1.5 focus:outline-none"
              title="Growth Package Recommendation Wizard"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Find Match</span>
            </button>

            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isLight
                  ? 'bg-slate-100 border-slate-300 text-amber-600 hover:bg-slate-200'
                  : 'bg-slate-900 border-slate-800 text-amber-400 hover:text-amber-300 hover:border-slate-700'
              }`}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle theme"
            >
              {isLight ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={() => handleNavClick('services', 'All')}
              className="relative group px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 transition-all flex items-center gap-1.5 focus:outline-none"
            >
              <Zap className="w-3.5 h-3.5 fill-white text-white group-hover:rotate-12 transition-transform" />
              <span>Get Started</span>
            </button>
          </div>
        </div>
      </header>

      {/* Slide-over Left Navigation Drawer */}
      <LeftSidebarDrawer
        isOpen={isLeftDrawerOpen}
        onClose={() => setIsLeftDrawerOpen(false)}
      />
    </>
  );
};
