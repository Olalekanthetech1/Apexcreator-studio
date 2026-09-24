import React from 'react';
import { useApp } from '../context/AppContext';
import { ServiceCategory } from '../types';
import {
  Crown,
  X,
  Home,
  Store,
  Package,
  ShoppingCart,
  Mail,
  Zap,
  Tag,
  BarChart3,
  Gift,
  Building2,
  MessageCircle,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Compass,
  Youtube,
  Tv,
  Share2,
  Palette,
  FileText,
  User,
  Sun,
  Moon,
  Bot,
  Sliders,
  Calculator
} from 'lucide-react';

interface LeftSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeftSidebarDrawer: React.FC<LeftSidebarDrawerProps> = ({ isOpen, onClose }) => {
  const {
    theme,
    toggleTheme,
    currentView,
    setView,
    setSelectedCategory,
    isAdminLoggedIn,
    orders
  } = useApp();

  if (!isOpen) return null;

  const isLight = theme === 'light';
  const pendingOrdersCount = (orders || []).filter((o) => o && (o.status === 'Pending' || o.status === 'In Progress')).length;

  const handleNav = (view: any, category?: ServiceCategory | 'All') => {
    setView(view);
    if (category) {
      setSelectedCategory(category);
    }
    onClose();
  };

  const handleRecommender = () => {
    window.dispatchEvent(new CustomEvent('open-recommender'));
    onClose();
  };

  const handleLeadMagnet = () => {
    window.dispatchEvent(new CustomEvent('open-lead-magnet'));
    onClose();
  };

  // 5 Distinct Menu Modules
  const menuModules = [
    {
      moduleTitle: "1. Core Navigation",
      items: [
        {
          label: "Home Overview",
          icon: Home,
          action: () => handleNav('home'),
          active: currentView === 'home',
          color: "text-indigo-500"
        },
        {
          label: "All Services Catalogue",
          icon: Store,
          action: () => handleNav('services', 'All'),
          active: currentView === 'services',
          color: "text-blue-500"
        },
        {
          label: "Pricing & Growth Packages",
          icon: Tag,
          action: () => handleNav('pricing'),
          active: currentView === 'pricing',
          color: "text-emerald-500"
        },
        {
          label: "Quick Order Checkout",
          icon: ShoppingCart,
          action: () => handleNav('pricing'),
          active: false,
          color: "text-amber-500"
        },
        {
          label: "Case Studies & Success",
          icon: BarChart3,
          action: () => handleNav('case-studies'),
          active: currentView === 'case-studies',
          color: "text-purple-500"
        }
      ]
    },
    {
      moduleTitle: "2. Growth & AI Strategy",
      items: [
        {
          label: "AI Growth Concierge Assistant",
          icon: Bot,
          action: () => {
            onClose();
            window.dispatchEvent(new CustomEvent('open-concierge'));
          },
          active: false,
          color: "text-amber-400",
          badge: "AI Live"
        },
        {
          label: "Custom Package & Bundle Builder",
          icon: Calculator,
          action: () => {
            handleNav('pricing');
            setTimeout(() => {
              document.getElementById('bundle-builder')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          },
          active: false,
          color: "text-indigo-400",
          badge: "Up to 25% OFF"
        },
        {
          label: "Before & After Transformation Gallery",
          icon: Sliders,
          action: () => {
            handleNav('proofs');
            setTimeout(() => {
              document.getElementById('transformation-gallery')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          },
          active: false,
          color: "text-emerald-400"
        },
        {
          label: "Find My Match (Growth Wizard)",
          icon: Compass,
          action: handleRecommender,
          active: false,
          color: "text-indigo-400"
        },
        {
          label: "Proof & Results Portfolio",
          icon: Sparkles,
          action: () => handleNav('proofs'),
          active: currentView === 'proofs',
          color: "text-amber-400"
        },
        {
          label: "Free Channel Audit Guide",
          icon: Gift,
          action: handleLeadMagnet,
          active: false,
          color: "text-emerald-400",
          badge: "Free"
        }
      ]
    },
    {
      moduleTitle: "3. Platform Specializations",
      items: [
        {
          label: "YouTube Channel Growth",
          icon: Youtube,
          action: () => handleNav('services', 'YouTube'),
          active: false,
          color: "text-red-500"
        },
        {
          label: "Twitch Streaming Services",
          icon: Tv,
          action: () => handleNav('services', 'Twitch'),
          active: false,
          color: "text-purple-400"
        },
        {
          label: "Social Media Strategy",
          icon: Share2,
          action: () => handleNav('services', 'Social Media'),
          active: false,
          color: "text-sky-400"
        },
        {
          label: "Graphics & Branding Identity",
          icon: Palette,
          action: () => handleNav('services', 'Graphics & Branding'),
          active: false,
          color: "text-emerald-400"
        }
      ]
    },
    {
      moduleTitle: "4. Client Orders & Community",
      items: [
        {
          label: "My Orders & Delivery Portal",
          icon: Package,
          action: () => handleNav('my-orders'),
          active: currentView === 'my-orders',
          color: "text-indigo-400",
          countBadge: orders.length
        },
        {
          label: "Discord Creator Community",
          icon: MessageCircle,
          action: () => window.open('https://discord.gg', '_blank'),
          active: false,
          color: "text-indigo-400",
          badge: "Live Chat"
        },
        {
          label: "Official Payouts & Guarantees",
          icon: Building2,
          action: () => handleNav('how-it-works'),
          active: false,
          color: "text-emerald-400"
        }
      ]
    },
    {
      moduleTitle: "5. Agency & Support",
      items: [
        {
          label: "About ApexCreator & Founder",
          icon: User,
          action: () => handleNav('about'),
          active: currentView === 'about',
          color: "text-purple-400"
        },
        {
          label: "How ApexCreator Works",
          icon: FileText,
          action: () => handleNav('how-it-works'),
          active: currentView === 'how-it-works',
          color: "text-blue-400"
        },
        {
          label: "Contact Direct Support",
          icon: Mail,
          action: () => handleNav('contact'),
          active: currentView === 'contact',
          color: "text-sky-400"
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex animate-fadeIn">
      {/* Dark Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Left Sidebar Drawer */}
      <aside className={`relative w-80 max-w-[85vw] h-full flex flex-col z-10 shadow-2xl transition-transform duration-300 border-r ${
        isLight
          ? 'bg-slate-900 border-indigo-500/30 text-white'
          : 'bg-slate-950 border-indigo-500/20 text-white'
      }`}>
        {/* Drawer Top Header */}
        <div className="p-4 sm:p-5 border-b border-indigo-500/30 bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 p-0.5 shadow-md shadow-indigo-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Crown className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-base tracking-tight text-white">
                  ApexCreator
                </span>
                <span className="px-1.5 py-0.5 text-[8px] font-black tracking-wider uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  STUDIO
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                Digital Growth & Branding
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Toggle Theme"
            >
              {isLight ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Links with Horizontal Dividers */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 scrollbar-thin">
          {menuModules.map((module, mIdx) => (
            <div key={mIdx} className="py-2">
              <div className="px-5 py-2 text-[10px] font-black uppercase tracking-wider text-indigo-400/90 flex items-center justify-between">
                <span>{module.moduleTitle}</span>
              </div>

              <div>
                {module.items.map((item, iIdx) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={iIdx}
                      onClick={item.action}
                      className={`w-full px-5 py-3.5 flex items-center justify-between transition-all border-b border-indigo-500/10 hover:bg-indigo-500/10 group ${
                        item.active
                          ? 'bg-indigo-500/20 text-white font-bold border-l-4 border-l-indigo-500'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComp className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${item.color}`} />
                        <span className="text-xs font-semibold tracking-wide text-left">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {item.countBadge !== undefined && item.countBadge > 0 && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500 text-white shadow-sm">
                            {item.countBadge}
                          </span>
                        )}
                        {item.badge && (
                          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Drawer Bottom Footer Action */}
        <div className="p-4 border-t border-indigo-500/30 bg-slate-950 space-y-2 shrink-0">
          <button
            onClick={() => handleNav('services', 'All')}
            className="w-full py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-white text-white" />
            <span>Explore All Agency Services</span>
          </button>
          <div className="text-center text-[10px] text-slate-400 font-medium pt-1">
            © 2026 ApexCreator Studio • 100% Policy Compliant
          </div>
        </div>
      </aside>
    </div>
  );
};
