import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PricingSection } from './PricingSection';
import { HowItWorks } from './HowItWorks';
import { ProofSection } from './ProofSection';
import { TrustSection } from './TrustSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FAQSection } from './FAQSection';
import { ContactSection } from './ContactSection';
import { CaseStudiesSection } from './CaseStudiesSection';
import { AboutFounderSection } from './AboutFounderSection';
import { InsightsHubSection } from './InsightsHubSection';
import { ChannelRoiCalculator } from './ChannelRoiCalculator';
import {
  DollarSign,
  Workflow,
  Award,
  ShieldCheck,
  Mail,
  Sparkles,
  TrendingUp,
  Users,
  BookOpen,
  Calculator
} from 'lucide-react';

export const HomeTabbedSections: React.FC = () => {
  const { theme } = useApp();
  const [activeTab, setActiveTab] = useState<'pricing' | 'roi' | 'case-studies' | 'about' | 'insights' | 'how-it-works' | 'proofs' | 'trust-faq' | 'contact'>('pricing');

  const isLight = theme === 'light';

  const tabs = [
    { id: 'pricing', label: 'Packages & Rates', icon: DollarSign, badge: 'Negotiable' },
    { id: 'roi', label: 'ROI Calculator', icon: Calculator, badge: 'Estimate' },
    { id: 'case-studies', label: 'Case Studies', icon: TrendingUp, badge: 'Results' },
    { id: 'about', label: 'About ApexCreator', icon: Users, badge: 'Founder Story' },
    { id: 'insights', label: 'Strategy Hub', icon: BookOpen, badge: 'SEO Guides' },
    { id: 'how-it-works', label: 'Order Process', icon: Workflow, badge: '3 Steps' },
    { id: 'proofs', label: 'Portfolio & Reviews', icon: Award, badge: 'Verified' },
    { id: 'trust-faq', label: 'Guarantees & FAQ', icon: ShieldCheck, badge: '100% Policy' },
    { id: 'contact', label: 'Contact', icon: Mail, badge: 'Live Support' },
  ] as const;

  return (
    <section className={`py-8 border-t transition-colors duration-300 ${
      isLight ? 'bg-slate-100/80 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-900 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Interactive Sticky Tab Navigation Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Agency Marketplace & Knowledge Hub</span>
          </div>
          
          {/* Tab Switcher Bar */}
          <div className={`p-1.5 rounded-2xl border flex items-center justify-start md:justify-center gap-1.5 overflow-x-auto scrollbar-none backdrop-blur-xl ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
          }`}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Display Area */}
        <div className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
          isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-slate-950 border-slate-800'
        }`}>
          {activeTab === 'pricing' && <PricingSection />}
          {activeTab === 'roi' && <ChannelRoiCalculator />}
          {activeTab === 'case-studies' && <CaseStudiesSection />}
          {activeTab === 'about' && <AboutFounderSection />}
          {activeTab === 'insights' && <InsightsHubSection />}
          {activeTab === 'how-it-works' && <HowItWorks />}
          {activeTab === 'proofs' && (
            <div>
              <ProofSection />
              <TestimonialsSection />
            </div>
          )}
          {activeTab === 'trust-faq' && (
            <div>
              <TrustSection />
              <FAQSection />
            </div>
          )}
          {activeTab === 'contact' && <ContactSection />}
        </div>

      </div>
    </section>
  );
};
