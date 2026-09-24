import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesOverview } from './components/ServicesOverview';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { OrderFormModal } from './components/OrderFormModal';
import { CheckoutView } from './components/CheckoutView';
import { PricingSection } from './components/PricingSection';
import { HowItWorks } from './components/HowItWorks';
import { ProofSection } from './components/ProofSection';
import { TrustSection } from './components/TrustSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { HomeTabbedSections } from './components/HomeTabbedSections';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { AboutFounderSection } from './components/AboutFounderSection';
import { InsightsHubSection } from './components/InsightsHubSection';
import { LeadMagnetModal } from './components/LeadMagnetModal';
import { PackageRecommenderModal } from './components/PackageRecommenderModal';
import { CustomBundleBuilder } from './components/CustomBundleBuilder';
import { BeforeAfterGallery } from './components/BeforeAfterGallery';
import { GrowthConciergeModal } from './components/GrowthConciergeModal';
import { VipLeadCaptureModal } from './components/VipLeadCaptureModal';
import { LiveChatWidget } from './components/LiveChatWidget';
import { Footer } from './components/Footer';
import { PolicyModals } from './components/PolicyModals';
import { Toast } from './components/Toast';
import { initAnalyticsTracker } from './utils/analyticsTracker';

const MainContent: React.FC = () => {
  const { currentView, theme } = useApp();
  const [activePolicy, setActivePolicy] = useState<'terms' | 'privacy' | 'refund' | 'disclaimer' | null>(null);
  const [isLeadMagnetOpen, setIsLeadMagnetOpen] = useState(false);
  const [isRecommenderOpen, setIsRecommenderOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);

  useEffect(() => {
    // Initialize real-time analytics tracker & auto lead listener
    initAnalyticsTracker();

    const handleOpenLeadMagnet = () => setIsLeadMagnetOpen(true);
    const handleOpenRecommender = () => setIsRecommenderOpen(true);
    const handleOpenConcierge = () => setIsConciergeOpen(true);

    window.addEventListener('open-lead-magnet', handleOpenLeadMagnet);
    window.addEventListener('open-recommender', handleOpenRecommender);
    window.addEventListener('open-concierge', handleOpenConcierge);

    return () => {
      window.removeEventListener('open-lead-magnet', handleOpenLeadMagnet);
      window.removeEventListener('open-recommender', handleOpenRecommender);
      window.removeEventListener('open-concierge', handleOpenConcierge);
    };
  }, []);

  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-300 ${
      isLight ? 'bg-white text-slate-900 selection:bg-indigo-600 selection:text-white' : 'bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white'
    }`}>
      <Header />

      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            <Hero />
            <ServicesOverview />
            <CustomBundleBuilder />
            <BeforeAfterGallery />
            <HomeTabbedSections />
          </>
        )}

        {currentView === 'services' && (
          <>
            <ServicesOverview />
            <CustomBundleBuilder />
            <TrustSection />
          </>
        )}

        {currentView === 'pricing' && (
          <>
            <PricingSection />
            <CustomBundleBuilder />
            <HowItWorks />
            <FAQSection />
          </>
        )}

        {currentView === 'case-studies' && (
          <>
            <BeforeAfterGallery />
            <CaseStudiesSection />
            <TestimonialsSection />
          </>
        )}

        {currentView === 'about' && (
          <>
            <AboutFounderSection />
            <TrustSection />
          </>
        )}

        {currentView === 'insights' && (
          <>
            <InsightsHubSection />
            <FAQSection />
          </>
        )}

        {currentView === 'how-it-works' && (
          <>
            <HowItWorks />
            <FAQSection />
          </>
        )}

        {currentView === 'proofs' && (
          <>
            <ProofSection />
            <BeforeAfterGallery />
            <TestimonialsSection />
            <CaseStudiesSection />
          </>
        )}

        {currentView === 'contact' && (
          <>
            <ContactSection />
            <FAQSection />
          </>
        )}

        {currentView === 'checkout' && <CheckoutView />}

        {currentView === 'my-orders' && <CustomerDashboard />}

        {currentView === 'admin' && <AdminDashboard />}
      </main>

      <Footer onOpenPolicy={(type) => setActivePolicy(type)} />

      {/* Global Modals, Chat Widget & Notifications */}
      <ServiceDetailModal />
      <OrderFormModal />
      <VipLeadCaptureModal />
      <LeadMagnetModal isOpen={isLeadMagnetOpen} onClose={() => setIsLeadMagnetOpen(false)} />
      <PackageRecommenderModal isOpen={isRecommenderOpen} onClose={() => setIsRecommenderOpen(false)} />
      <GrowthConciergeModal isOpen={isConciergeOpen} onClose={() => setIsConciergeOpen(false)} />
      <LiveChatWidget />
      <PolicyModals policyType={activePolicy} onClose={() => setActivePolicy(null)} />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
