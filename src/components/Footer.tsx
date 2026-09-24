import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceCategory } from '../types';
import { Crown, Heart, Sparkles, ExternalLink } from 'lucide-react';

export const Footer: React.FC<{
  onOpenPolicy: (type: 'terms' | 'privacy' | 'refund' | 'disclaimer') => void;
}> = ({ onOpenPolicy }) => {
  const { setView, setSelectedCategory, isAdminLoggedIn, theme } = useApp();
  const [secretTapCount, setSecretTapCount] = useState(0);
  const isLight = theme === 'light';

  const handleNav = (view: any, cat?: ServiceCategory | 'All') => {
    setView(view);
    if (cat) setSelectedCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Secret 3-tap gesture on the copyright to open Admin privately on mobile
  const handleSecretTap = () => {
    const nextCount = secretTapCount + 1;
    setSecretTapCount(nextCount);
    if (nextCount >= 3) {
      setSecretTapCount(0);
      handleNav('admin');
    } else {
      setTimeout(() => setSecretTapCount(0), 2000);
    }
  };

  return (
    <footer className={`border-t pt-16 pb-12 transition-colors duration-300 ${
      isLight ? 'bg-white text-slate-900 border-slate-200' : 'bg-slate-950 text-white border-slate-800/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-blue-500/20">
                <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                  isLight ? 'bg-white' : 'bg-slate-950'
                }`}>
                  <Crown className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <div>
                <span className={`font-extrabold text-xl tracking-tight transition-colors ${
                  isLight ? 'text-slate-900 group-hover:text-indigo-600' : 'text-white group-hover:text-blue-400'
                }`}>
                  ApexCreator Studio
                </span>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Digital Growth & Creator Services</p>
              </div>
            </button>

            <p className={`text-xs leading-relaxed max-w-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Professional YouTube, Twitch, social media, branding, and digital growth services designed to help creators and businesses build a stronger online presence.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs">
              <span className={`px-2.5 py-1 rounded-lg border font-bold ${
                isLight ? 'bg-slate-50 border-slate-200 text-indigo-700' : 'bg-slate-900 border-slate-800 text-blue-400'
              }`}>
                100% Policy-Compliant
              </span>
              <span className={`px-2.5 py-1 rounded-lg border font-bold ${
                isLight ? 'bg-slate-50 border-slate-200 text-emerald-700' : 'bg-slate-900 border-slate-800 text-emerald-400'
              }`}>
                No Passwords Needed
              </span>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h3 className={`text-xs font-extrabold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>
              Navigation
            </h3>
            <ul className={`space-y-2 text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-indigo-600 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services', 'All')} className="hover:text-indigo-600 transition-colors">
                  All Services
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('pricing')} className="hover:text-indigo-600 transition-colors">
                  Pricing Packages
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('proofs')} className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Proof & Results
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('how-it-works')} className="hover:text-indigo-600 transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-indigo-600 transition-colors">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Categories */}
          <div className="space-y-3">
            <h3 className={`text-xs font-extrabold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>
              Service Categories
            </h3>
            <ul className={`space-y-2 text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <li>
                <button onClick={() => handleNav('services', 'YouTube')} className="hover:text-red-500 transition-colors">
                  YouTube Growth & Design
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services', 'Twitch')} className="hover:text-purple-600 transition-colors">
                  Twitch Stream Services
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services', 'Social Media')} className="hover:text-indigo-600 transition-colors">
                  Social Media Strategy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services', 'Graphics & Branding')} className="hover:text-emerald-600 transition-colors">
                  Graphics & Identity Branding
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Dashboard */}
          <div className="space-y-3">
            <h3 className={`text-xs font-extrabold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>
              Policies & Portals
            </h3>
            <ul className={`space-y-2 text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <li>
                <button onClick={() => onOpenPolicy('terms')} className="hover:text-indigo-600 transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('privacy')} className="hover:text-indigo-600 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('refund')} className="hover:text-indigo-600 transition-colors">
                  Refund & Guarantee Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('disclaimer')} className="hover:text-indigo-600 transition-colors">
                  Platform Disclaimer
                </button>
              </li>
              <li className={`pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
                <button onClick={() => handleNav('my-orders')} className="text-indigo-600 hover:text-indigo-500 font-bold block">
                  Customer Dashboard
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* MANDATORY FOOTER PLATFORM DISCLAIMER */}
        <div className={`p-4 rounded-2xl border text-[11px] leading-relaxed text-center ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
        }`}>
          <strong>Disclaimer:</strong> ApexCreator Studio is an independent digital services platform. We are not affiliated with, authorized, maintained, sponsored, or endorsed by YouTube, Twitch, Meta, Instagram, X, TikTok, or any other third-party social media platform. All product and company names are trademarks or registered trademarks of their respective holders.
        </div>

        {/* Bottom Bar */}
        <div className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
          isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800/80 text-slate-400'
        }`}>
          <div className="flex items-center gap-2">
            <span 
              onClick={handleSecretTap}
              className="cursor-default select-none"
              title=""
            >
              © 2026 <strong>ApexCreator Studio</strong>. All rights reserved. Premium Digital Agency & Marketplace.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>Built with precision for creators & businesses</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
