import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceCategory, PackageOption } from '../types';
import {
  X,
  ShieldCheck,
  Calendar,
  User,
  Mail,
  Globe,
  FileText,
  Zap,
  ArrowRight,
  Sparkles,
  DollarSign
} from 'lucide-react';

export const OrderFormModal: React.FC = () => {
  const {
    theme,
    services,
    isOrderFormOpen,
    orderFormPrefill,
    closeOrderForm,
    submitOrder,
    activeCustomerEmail
  } = useApp();
  const isLight = theme === 'light';

  // Form Field States
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState(activeCustomerEmail || '');
  const [category, setCategory] = useState<ServiceCategory>('YouTube');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [packageType, setPackageType] = useState<PackageOption>('STANDARD');
  const [customOfferPrice, setCustomOfferPrice] = useState<number>(230);
  const [isCustomPrice, setIsCustomPrice] = useState(false);
  const [negotiationNote, setNegotiationNote] = useState('');
  const [socialUrl, setSocialUrl] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [preferredDeliveryDate, setPreferredDeliveryDate] = useState('');

  // Sync Prefills
  useEffect(() => {
    if (orderFormPrefill?.service) {
      setCategory(orderFormPrefill.service.category);
      setSelectedServiceId(orderFormPrefill.service.id);
    } else if (services.length > 0) {
      setSelectedServiceId(services[0].id);
      setCategory(services[0].category);
    }

    if (orderFormPrefill?.packageType) {
      setPackageType(orderFormPrefill.packageType);
      const pkgPrice = orderFormPrefill.service?.packages[orderFormPrefill.packageType]?.price || (orderFormPrefill.packageType === 'BASIC' ? 70 : orderFormPrefill.packageType === 'STANDARD' ? 230 : 460);
      setCustomOfferPrice(pkgPrice);
    }

    if (activeCustomerEmail) {
      setEmail(activeCustomerEmail);
    }

    // Default preferred date 5 days ahead
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 5);
    setPreferredDeliveryDate(defaultDate.toISOString().split('T')[0]);
  }, [orderFormPrefill, activeCustomerEmail, services]);

  // Update available services when category changes
  const categoryServices = services.filter((s) => s.category === category);

  const currentService =
    services.find((s) => s.id === selectedServiceId) ||
    categoryServices[0] ||
    services[0];

  const standardPkgPrice = currentService?.packages[packageType]?.price || (packageType === 'BASIC' ? 70 : packageType === 'STANDARD' ? 230 : 460);
  const finalPrice = isCustomPrice ? (customOfferPrice > 0 ? customOfferPrice : standardPkgPrice) : standardPkgPrice;

  // Package range info helper
  const getPackageRangeInfo = (type: PackageOption) => {
    if (type === 'BASIC') return { min: 1, max: 70, label: '$70 USD Rate' };
    if (type === 'STANDARD') return { min: 70, max: 230, label: '$230 USD Rate' };
    return { min: 230, max: 460, label: '$460 USD Rate' };
  };

  if (!isOrderFormOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !email || !currentService || !socialUrl || !projectDescription) {
      alert('Please fill in all required fields.');
      return;
    }

    submitOrder({
      customerName,
      email,
      category,
      serviceId: currentService.id,
      serviceTitle: currentService.title,
      packageType,
      price: finalPrice,
      offeredPrice: isCustomPrice ? customOfferPrice : undefined,
      isNegotiatedPrice: isCustomPrice,
      negotiationNote: negotiationNote || undefined,
      socialUrl,
      projectDescription: negotiationNote ? `${projectDescription}\n\n[Client Negotiation Offer Note]: ${negotiationNote}` : projectDescription,
      preferredDeliveryDate
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className={`relative w-full max-w-2xl border rounded-3xl shadow-2xl overflow-hidden my-8 transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        
        {/* Header */}
        <div className={`px-6 py-5 border-b flex items-center justify-between sticky top-0 z-10 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/90 border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-bold leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Place Your Project Order</h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>ApexCreator Studio Professional Digital Services</p>
            </div>
          </div>

          <button
            onClick={closeOrderForm}
            className={`p-2 rounded-xl border transition-colors ${
              isLight ? 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - STICKING STRICTLY TO REQUIRED FIELDS */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 1. Customer Name */}
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <User className="w-3.5 h-3.5 text-indigo-600" />
                1. Customer Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-indigo-500 transition-colors ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                }`}
              />
            </div>

            {/* 2. Email Address */}
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                2. Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-indigo-500 transition-colors ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                }`}
              />
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 3. Service Category */}
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                3. Service Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const newCat = e.target.value as ServiceCategory;
                  setCategory(newCat);
                  const firstOfCat = services.find((s) => s.category === newCat);
                  if (firstOfCat) setSelectedServiceId(firstOfCat.id);
                }}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-indigo-500 transition-colors ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                }`}
              >
                <option value="YouTube">YouTube Services</option>
                <option value="Twitch">Twitch Services</option>
                <option value="Social Media">Social Media Services</option>
                <option value="Graphics & Branding">Graphics & Branding</option>
              </select>
            </div>

            {/* 4. Selected Service */}
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                4. Selected Service <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-indigo-500 transition-colors ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                }`}
              >
                {categoryServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* 5. Selected Package & Custom Price Negotiation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                5. Selected Package <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Custom Negotiation Allowed
              </span>
            </div>

            {/* Package selector cards */}
            <div className="grid grid-cols-3 gap-2.5">
              {(['BASIC', 'STANDARD', 'PREMIUM'] as PackageOption[]).map((pType) => {
                const active = packageType === pType;
                const range = getPackageRangeInfo(pType);
                return (
                  <button
                    type="button"
                    key={pType}
                    onClick={() => {
                      setPackageType(pType);
                      const defaultVal = currentService?.packages[pType]?.price || range.max;
                      setCustomOfferPrice(defaultVal);
                    }}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      active
                        ? 'bg-indigo-600/10 border-indigo-600 text-indigo-600 shadow-md'
                        : isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[11px] font-bold uppercase">{pType}</div>
                    <div className={`text-xs font-bold mt-0.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>{range.label}</div>
                    {pType === 'BASIC' && (
                      <span className="text-[9px] font-extrabold text-emerald-600 block mt-0.5 uppercase">
                        Negotiable
                      </span>
                    )}
                    {pType === 'STANDARD' && (
                      <span className="text-[9px] font-extrabold text-indigo-600 block mt-0.5 uppercase">
                        Most Popular
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Negotiation Box */}
            <div className={`p-3.5 rounded-xl border space-y-3 ${
              isLight ? 'bg-slate-50 border-indigo-200' : 'bg-slate-950 border-indigo-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  Negotiate / Propose Your Custom Price
                </span>
                <label className={`text-[11px] flex items-center gap-2 cursor-pointer select-none ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  <input
                    type="checkbox"
                    checked={isCustomPrice}
                    onChange={(e) => {
                      setIsCustomPrice(e.target.checked);
                      if (e.target.checked && customOfferPrice <= 0) {
                        setCustomOfferPrice(standardPkgPrice);
                      }
                    }}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                  <span>Offer custom negotiated price</span>
                </label>
              </div>

              {isCustomPrice ? (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sm text-emerald-600">$</span>
                      <input
                        type="number"
                        min={1}
                        max={10000}
                        value={customOfferPrice}
                        onChange={(e) => setCustomOfferPrice(Math.max(1, parseInt(e.target.value) || 0))}
                        className={`w-full pl-7 pr-4 py-2.5 rounded-lg border text-sm font-bold text-emerald-600 focus:outline-none focus:border-emerald-500 ${
                          isLight ? 'bg-white border-emerald-300' : 'bg-slate-900 border-emerald-500/50'
                        }`}
                        placeholder="Enter your price offer (e.g., 35)"
                      />
                    </div>
                    <span className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>USD Offered</span>
                  </div>
                </div>
              ) : (
                <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Standard {packageType} rate is <strong className={isLight ? 'text-slate-900' : 'text-white'}>${standardPkgPrice} USD</strong>. Check the box above if you want to enter a custom negotiated price.
                </p>
              )}
            </div>
          </div>

          {/* 6. Social Media / Channel URL */}
          <div className="space-y-1.5">
            <label className={`text-xs font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              6. Social Media / Channel URL <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              required
              value={socialUrl}
              onChange={(e) => setSocialUrl(e.target.value)}
              placeholder="https://youtube.com/@yourchannel or https://twitch.tv/username"
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-indigo-500 transition-colors ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
              }`}
            />
          </div>

          {/* 7. Project Description */}
          <div className="space-y-1.5">
            <label className={`text-xs font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              7. Project Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe your project goals, niche, aesthetic preferences, and any details..."
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
              }`}
            />
          </div>

          {/* 8. Preferred Delivery Date */}
          <div className="space-y-1.5">
            <label className={`text-xs font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              8. Preferred Delivery Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={preferredDeliveryDate}
              onChange={(e) => setPreferredDeliveryDate(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-indigo-500 transition-colors ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
              }`}
            />
          </div>

          {/* Order Summary Box */}
          <div className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800/80'
          }`}>
            <div>
              <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Service Total:</span>
              <span className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {currentService?.title} ({packageType})
              </span>
              {isCustomPrice && (
                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                  Custom Negotiated Offer Applied
                </span>
              )}
            </div>
            <div className="text-right">
              <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total Due:</span>
              <span className="text-2xl font-black text-emerald-600">${finalPrice} USD</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl text-[11px] flex items-center gap-2 ${
            isLight ? 'bg-slate-50 text-slate-600 border border-slate-200' : 'bg-slate-950 text-slate-400'
          }`}>
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Secure Checkout • Instant Order Tracking ID Generation • No Password Needed</span>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeOrderForm}
              className={`px-5 py-3 rounded-xl text-xs font-semibold border transition-colors ${
                isLight ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-indigo-600/25 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-white text-white" />
              <span>Proceed to Checkout (${finalPrice})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
