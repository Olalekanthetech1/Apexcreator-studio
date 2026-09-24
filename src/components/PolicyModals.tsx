import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PolicyModals: React.FC<{
  policyType: 'terms' | 'privacy' | 'refund' | 'disclaimer' | null;
  onClose: () => void;
}> = ({ policyType, onClose }) => {
  const { theme } = useApp();
  const isLight = theme === 'light';

  if (!policyType) return null;

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto backdrop-blur-md flex items-center justify-center p-4 ${
      isLight ? 'bg-slate-900/60' : 'bg-slate-950/80'
    }`}>
      <div className={`relative w-full max-w-3xl rounded-3xl p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto shadow-2xl border transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        
        <div className={`flex items-center justify-between border-b pb-4 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <h2 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {policyType === 'terms' && 'Terms of Service'}
              {policyType === 'privacy' && 'Privacy Policy'}
              {policyType === 'refund' && 'Refund & Guarantee Policy'}
              {policyType === 'disclaimer' && 'Official Platform Disclaimer'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition-colors ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-900' 
                : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`text-xs sm:text-sm space-y-4 leading-relaxed ${
          isLight ? 'text-slate-600' : 'text-slate-300'
        }`}>
          {policyType === 'terms' && (
            <>
              <p>Welcome to ApexCreator Studio. By placing an order or using our website, you agree to these Terms of Service.</p>
              <h3 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>1. Scope of Services</h3>
              <p>ApexCreator Studio provides digital strategy, channel optimization, graphic design, branding, and content consulting for creators, streamers, and businesses.</p>
              <h3 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>2. Account Credentials</h3>
              <p>We never request account passwords or sensitive credentials. All service delivery is performed externally or through official editor permissions provided by the client.</p>
              <h3 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>3. Deliverables & Revisions</h3>
              <p>Each package (Basic, Standard, Premium) specifies the included number of revisions and expected delivery timeframe.</p>
            </>
          )}

          {policyType === 'privacy' && (
            <>
              <p>ApexCreator Studio is committed to protecting your privacy and personal information.</p>
              <h3 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>1. Information We Collect</h3>
              <p>We collect your name, email address, social media channel URL, and project requirements solely to execute and fulfill your orders.</p>
              <h3 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>2. Financial Data Security</h3>
              <p>We do not store raw credit card or financial information. All transactions are securely processed via encrypted payment structures.</p>
            </>
          )}

          {policyType === 'refund' && (
            <>
              <p>At ApexCreator Studio, client satisfaction and transparent delivery are our highest priorities.</p>
              <h3 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>1. Order Cancellations</h3>
              <p>Full refunds are issued if an order is cancelled before project fulfillment has commenced.</p>
              <h3 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>2. Satisfaction & Revisions</h3>
              <p>If you are unsatisfied with deliverables, our team provides included revisions specified in your package (1-3 revisions based on tier) to ensure project alignment.</p>
            </>
          )}

          {policyType === 'disclaimer' && (
            <>
              <p>ApexCreator Studio operates as an independent digital services agency.</p>
              <h3 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>1. Non-Affiliation Notice</h3>
              <p>ApexCreator Studio is not affiliated with, endorsed by, or officially partnered with YouTube, Twitch, Meta, Instagram, X, TikTok, or any other social media platform.</p>
              <h3 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>2. Performance & Results</h3>
              <p>Results shown across our portfolio and proof section are previous client examples. Individual results may vary depending on platform algorithms, content quality, niche, and audience engagement.</p>
            </>
          )}
        </div>

        <div className={`pt-4 border-t flex justify-end ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 font-bold text-xs text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};
