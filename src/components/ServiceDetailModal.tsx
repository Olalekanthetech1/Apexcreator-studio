import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PackageOption } from '../types';
import { IconRenderer } from './ServicesOverview';
import {
  X,
  Check,
  Zap,
  ArrowRight,
  ShieldCheck,
  Clock,
  RotateCcw,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

export const ServiceDetailModal: React.FC = () => {
  const {
    theme,
    selectedService,
    isDetailModalOpen,
    closeServiceDetail,
    openOrderForm
  } = useApp();
  const isLight = theme === 'light';

  const [selectedPkg, setSelectedPkg] = useState<PackageOption>('STANDARD');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  if (!isDetailModalOpen || !selectedService) return null;

  const defaultFallbackPkg = {
    name: selectedPkg,
    price: selectedPkg === 'BASIC' ? 70 : selectedPkg === 'STANDARD' ? 230 : 460,
    deliveryDays: '3 Days',
    revisions: '2 Revisions',
    features: ['Service Consultation', 'Standard Turnaround', 'Quality Review']
  };

  const pkg = (selectedService.packages && selectedService.packages[selectedPkg]) || defaultFallbackPkg;

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn ${
      isLight ? 'bg-slate-900/60' : 'bg-slate-950/80'
    }`}>
      <div className={`relative w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-8 border transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        
        {/* Modal Header */}
        <div className={`px-6 py-5 border-b flex items-center justify-between sticky top-0 z-10 transition-colors ${
          isLight ? 'bg-slate-50/95 border-slate-200' : 'bg-slate-950/90 border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isLight ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
            }`}>
              <IconRenderer name={selectedService.iconName} className="w-5 h-5" />
            </div>
            <div>
              <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>
                {selectedService.category} Service
              </span>
              <h2 className={`text-xl font-bold leading-tight mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {selectedService.title}
              </h2>
            </div>
          </div>

          <button
            onClick={closeServiceDetail}
            className={`p-2 rounded-xl border transition-colors ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-900' : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
          
          {/* Overview & Description */}
          <div className="space-y-3">
            <h3 className={`text-sm uppercase font-bold tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Service Description
            </h3>
            <p className={`leading-relaxed text-base ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              {selectedService.fullDesc}
            </p>
            <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800/80 text-slate-400'
            }`}>
              <Clock className="w-4 h-4 text-blue-500 shrink-0" />
              <span>{selectedService.deliveryInfo}</span>
            </div>
          </div>

          {/* What's Included Grid */}
          <div className="space-y-3">
            <h3 className={`text-sm uppercase font-bold tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              What's Included In This Service
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {(selectedService.whatIsIncluded || selectedService.features || []).map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-sm ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950/60 border-slate-800/60 text-slate-200'
                  }`}
                >
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Package Selection Tabs & Pricing Cards */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className={`text-sm uppercase font-bold tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Select Your Package Level
              </h3>
              <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Clear USD Pricing</span>
            </div>

            {/* 3 Package Selector Tabs */}
            <div className="grid grid-cols-3 gap-3">
              {(['BASIC', 'STANDARD', 'PREMIUM'] as PackageOption[]).map((pType) => {
                const pkgItem = (selectedService.packages && selectedService.packages[pType]) || {
                  name: pType,
                  price: pType === 'BASIC' ? 70 : pType === 'STANDARD' ? 230 : 460
                };
                const active = selectedPkg === pType;
                return (
                  <button
                    key={pType}
                    onClick={() => setSelectedPkg(pType)}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all ${
                      active
                        ? isLight 
                          ? 'bg-blue-50 border-blue-500 text-slate-900 shadow-md shadow-blue-500/10' 
                          : 'bg-blue-600/15 border-blue-500 text-white shadow-xl shadow-blue-500/10'
                        : isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {pkgItem.badge && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 text-[9px] font-extrabold uppercase bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow">
                        {pkgItem.badge}
                      </span>
                    )}
                    <div className="text-xs font-extrabold uppercase tracking-wider mb-1">
                      {pType}
                    </div>
                    <div className={`text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>${pkgItem.price} USD</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 uppercase">Negotiable Offer</div>
                  </button>
                );
              })}
            </div>

            {/* Active Selected Package Detail Card */}
            <div className={`p-6 rounded-2xl border space-y-4 relative overflow-hidden ${
              isLight ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-950 border border-blue-500/30'
            }`}>
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${
                isLight ? 'border-blue-100' : 'border-slate-800'
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{pkg.name} Package</span>
                    {pkg.badge && (
                      <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-blue-500 text-white rounded-full">
                        {pkg.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1`}>
                    Complete service coverage. You can propose your custom price offer during order checkout.
                  </p>
                </div>

                <div className="text-right">
                  <div className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>${pkg.price} USD</div>
                  <div className={`flex items-center gap-3 text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1 justify-end`}>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      {pkg.deliveryDays}
                    </span>
                    <span className="flex items-center gap-1">
                      <RotateCcw className="w-3.5 h-3.5 text-purple-500" />
                      {pkg.revisions}
                    </span>
                  </div>
                </div>
              </div>

              {/* Package Features List */}
              <div className="space-y-2">
                <span className={`text-xs font-semibold uppercase tracking-wider block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Package Features Included:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(pkg.features || []).map((feat, fIdx) => (
                    <div key={fIdx} className={`flex items-center gap-2 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Service Specific FAQs */}
          {selectedService.faqs && selectedService.faqs.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className={`text-sm uppercase font-bold tracking-wider flex items-center gap-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <HelpCircle className="w-4 h-4 text-blue-500" />
                Frequently Asked Questions
              </h3>
              <div className="space-y-2">
                {selectedService.faqs.map((faq, idx) => {
                  const isOpen = openFaqIdx === idx;
                  return (
                    <div
                      key={idx}
                      className={`rounded-xl border overflow-hidden ${
                        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                        className={`w-full px-4 py-3 text-left text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 ${
                          isLight ? 'text-slate-800 hover:text-indigo-600' : 'text-slate-200 hover:text-white'
                        }`}
                      >
                        <span>{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-blue-500' : 'text-slate-400'}`} />
                      </button>
                      {isOpen && (
                        <div className={`px-4 pb-3.5 text-xs leading-relaxed border-t pt-2 ${
                          isLight ? 'text-slate-600 border-slate-200' : 'text-slate-400 border-slate-800/60'
                        }`}>
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Disclaimer Banner */}
          <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Trust & Compliance Guarantee:</strong> ApexCreator Studio provides professional digital consulting, optimization, design, and growth planning. We operate 100% within official platform guidelines and never ask for account passwords.
            </p>
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className={`px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Selected: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{selectedPkg} Package</strong> (${pkg.price} USD)
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={closeServiceDetail}
              className={`w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold border transition-colors ${
                isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Cancel
            </button>

            <button
              onClick={() => openOrderForm(selectedService, selectedPkg)}
              className="w-full sm:w-auto px-8 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              <Zap className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
              <span>Order Now (${pkg.price})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
