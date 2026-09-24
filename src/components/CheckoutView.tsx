import React, { useState, useEffect } from 'react';
import { useApp, getPaystackEnvPublicKey } from '../context/AppContext';
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Copy,
  Check,
  Building2,
  Globe,
  Zap,
  Wallet,
  Coins,
  QrCode,
  RefreshCw,
  Clock,
  AlertTriangle,
  MessageCircle,
  Send
} from 'lucide-react';
import { validateCryptoAddress } from '../utils/cryptoValidation';
import { captureLead } from '../utils/analyticsTracker';

export const CheckoutView: React.FC = () => {
  const {
    pendingCheckoutOrder,
    processPayment,
    submitPaymentForVerification,
    autoVerifyPayments,
    setView,
    setCustomerEmail,
    cryptoSettings,
    contactSettings,
    theme,
    bankSettings,
    paystackSettings,
    showToast,
    activeCustomerEmail,
    isAdminLoggedIn
  } = useApp();

  const isLight = theme === 'light';

  // Automatically register checkout visitor as a lead
  useEffect(() => {
    if (pendingCheckoutOrder?.email) {
      captureLead({
        email: pendingCheckoutOrder.email,
        name: pendingCheckoutOrder.customerName,
        source: 'Checkout Page',
        notes: `Order: ${pendingCheckoutOrder.id} | Service: ${pendingCheckoutOrder.serviceTitle} ($${pendingCheckoutOrder.price})`
      });
    }
  }, [pendingCheckoutOrder?.id]);

  const envFallbackKey = getPaystackEnvPublicKey();
  const effectivePaystackPublicKey = (paystackSettings?.publicKey || envFallbackKey || '').trim();
  const hasPaystackKey = Boolean(effectivePaystackPublicKey);

  // Payment method tab selection: Paystack, Crypto, or Bank Wire
  const [selectedTab, setSelectedTab] = useState<'paystack' | 'crypto' | 'bank'>(() => {
    if (paystackSettings?.enabled && effectivePaystackPublicKey) return 'paystack';
    if (bankSettings?.usd?.accountNumber) return 'bank';
    return 'paystack';
  });
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'GBP' | 'EUR'>('USD');

  // Paystack Payment States (Dynamic USD to NGN Conversion or Direct USD)
  const [dynamicFxRate, setDynamicFxRate] = useState<number>(paystackSettings?.usdToNgnRate || 1550);
  const [paystackCheckoutCurrency, setPaystackCheckoutCurrency] = useState<'NGN' | 'USD'>(() => {
    if (paystackSettings?.currencyMode === 'direct_usd') return 'USD';
    return paystackSettings?.defaultCurrency || 'NGN';
  });
  const [isProcessingPaystack, setIsProcessingPaystack] = useState<boolean>(false);
  const [isVerifyingPaystack, setIsVerifyingPaystack] = useState<boolean>(false);
  const [manualPaystackRef, setManualPaystackRef] = useState<string>('');
  const [showManualPaystackVerify, setShowManualPaystackVerify] = useState<boolean>(false);
  const [paystackVerifyStatus, setPaystackVerifyStatus] = useState<{
    success?: boolean;
    message?: string;
    txDetails?: any;
  } | null>(null);

  // Fetch live Forex rates for dynamic USD/NGN conversion
  useEffect(() => {
    let isMounted = true;
    const fetchForex = async () => {
      try {
        const res = await fetch('/api/forex/rates');
        if (res.ok) {
          const data = await res.json();
          if (data.usdToNgn && isMounted) {
            // If admin enables live market rate or rate is unconfigured, apply live rate
            if (paystackSettings?.useLiveMarketRate || !paystackSettings?.usdToNgnRate) {
              setDynamicFxRate(data.usdToNgn);
            }
          }
        }
      } catch (e) {
        // Fallback to settings
      }
    };
    fetchForex();
  }, [paystackSettings?.useLiveMarketRate, paystackSettings?.usdToNgnRate]);

  // Sync settings rate if not using live rate
  useEffect(() => {
    if (paystackSettings?.usdToNgnRate && !paystackSettings?.useLiveMarketRate) {
      setDynamicFxRate(paystackSettings.usdToNgnRate);
    }
  }, [paystackSettings?.usdToNgnRate, paystackSettings?.useLiveMarketRate]);

  // Crypto Payment States
  const [selectedCoinSymbol, setSelectedCoinSymbol] = useState<string>('USDT');
  const [selectedNetworkId, setSelectedNetworkId] = useState<string>('TRC20');
  const [cryptoTxHash, setCryptoTxHash] = useState<string>('');
  const [liveRates, setLiveRates] = useState<Record<string, number>>({
    USDT: 1.0,
    USDC: 1.0,
    BTC: 65000.0,
    ETH: 3400.0,
    TRX: 0.16,
    SOL: 145.0,
    LTC: 72.0,
    BNB: 560.0
  });
  const [timerSeconds, setTimerSeconds] = useState<number>(3599); // 60 min countdown
  const [isVerifyingCrypto, setIsVerifyingCrypto] = useState<boolean>(false);
  const [cryptoVerifyStatus, setCryptoVerifyStatus] = useState<{
    success?: boolean;
    message?: string;
    txDetails?: any;
  } | null>(null);

  // Common UI & Payment Processing States
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentDone, setPaymentDone] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<boolean>(false);

  // Bank Transfer Form States
  const [wireRefTxId, setWireRefTxId] = useState('');

  // Fetch live exchange rates on mount
  useEffect(() => {
    let isMounted = true;
    const fetchRates = async () => {
      try {
        const res = await fetch('/api/crypto/rates');
        if (res.ok) {
          const data = await res.json();
          if (data.rates && isMounted) {
            setLiveRates(data.rates);
          }
        }
      } catch (err) {
        console.warn('Using default crypto exchange rates');
      }
    };
    fetchRates();
    const interval = setInterval(fetchRates, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // 60-Minute Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper to format countdown timer mm:ss
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Find active coin config and network config safely from cryptoSettings
  const coinsList = (cryptoSettings?.coins || []).filter(c => {
    if (!c || !c.enabled || !Array.isArray(c.networks)) return false;
    return c.networks.some(n => 
      n && 
      n.isActive && 
      n.address && 
      n.address.trim() !== '' && 
      validateCryptoAddress(n.address, n.id).isValid
    );
  }).map(c => ({
    ...c,
    networks: (c.networks || []).filter(n => 
      n && 
      n.isActive && 
      n.address && 
      n.address.trim() !== '' && 
      validateCryptoAddress(n.address, n.id).isValid
    )
  }));
  const activeCoin = coinsList.find((c) => c.symbol === selectedCoinSymbol) || coinsList[0] || null;
  const activeNetwork = activeCoin?.networks?.find((n) => n.id === selectedNetworkId) || activeCoin?.networks?.[0] || null;

  // Calculate dynamic crypto price
  const usdPrice = pendingCheckoutOrder?.price || 0;
  const currentRate = liveRates[selectedCoinSymbol] || 1;
  const calculatedCryptoAmount = (usdPrice / currentRate).toFixed(
    selectedCoinSymbol === 'BTC' || selectedCoinSymbol === 'ETH' ? 6 : 2
  );

  // Handle Bybit Automated Crypto Payment Verification
  const handleCryptoVerification = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsVerifyingCrypto(true);
    setCryptoVerifyStatus(null);

    try {
      const response = await fetch('/api/payments/bybit/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: pendingCheckoutOrder?.id,
          amountUsd: usdPrice,
          coin: selectedCoinSymbol,
          network: selectedNetworkId,
          expectedAmountCrypto: parseFloat(calculatedCryptoAmount),
          txHash: cryptoTxHash.trim(),
          apiKey: cryptoSettings.bybitApiKey,
          apiSecret: cryptoSettings.bybitApiSecret
        })
      });

      const data = await response.json();
      setIsVerifyingCrypto(false);

      if (data.verified) {
        setCryptoVerifyStatus({
          success: true,
          message: data.message || 'Payment verified successfully on Bybit blockchain!',
          txDetails: data
        });
        setPaymentDone(true);
        const refCode = data.txID || cryptoTxHash.trim() || `BYBIT-${selectedCoinSymbol}-${Math.floor(100000 + Math.random() * 900000)}`;

        if (autoVerifyPayments) {
          processPayment(pendingCheckoutOrder!.id, `Crypto (${selectedCoinSymbol} / ${selectedNetworkId})`, refCode);
        } else {
          submitPaymentForVerification(pendingCheckoutOrder!.id, `Crypto (${selectedCoinSymbol} / ${selectedNetworkId})`, refCode);
        }
      } else {
        setCryptoVerifyStatus({
          success: false,
          message: data.message || 'Deposit not found yet on Bybit. Please allow 1-2 minutes for network confirmations.'
        });
      }
    } catch (err) {
      setIsVerifyingCrypto(false);
      setCryptoVerifyStatus({
        success: false,
        message: 'Network error contacting verification server. Your payment submission has been saved for admin review.'
      });
    }
  };

  // Paystack Checkout & Verification Handlers
  const handleVerifyPaystackPayment = async (
    reference: string,
    paidAmount: number,
    currency: string,
    originalUsdPrice?: number
  ) => {
    if (!pendingCheckoutOrder || !reference) return;
    setIsVerifyingPaystack(true);
    setPaystackVerifyStatus(null);
    try {
      const res = await fetch('/api/payments/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: reference.trim(),
          orderId: pendingCheckoutOrder.id,
          expectedAmount: paidAmount,
          currency,
          usdAmount: originalUsdPrice || pendingCheckoutOrder.price,
          secretKey: paystackSettings?.secretKey
        })
      });

      const data = await res.json();
      if (data.success && (data.verified || data.status === 'SUCCESS' || data.status === 'RECORDED_PENDING_AUDIT')) {
        const amountDisplay = currency === 'NGN' 
          ? `₦${paidAmount.toLocaleString()} NGN ($${pendingCheckoutOrder.price} USD)` 
          : `$${paidAmount.toLocaleString()} USD`;
        const methodLabel = `Paystack (${amountDisplay} - Ref: ${reference.substring(0, 16)})`;
        
        if (autoVerifyPayments) {
          processPayment(pendingCheckoutOrder.id, methodLabel, reference);
        } else {
          submitPaymentForVerification(pendingCheckoutOrder.id, methodLabel, reference);
        }
        setPaymentDone(true);
        setPaystackVerifyStatus({
          success: true,
          message: `Payment of ${amountDisplay} verified successfully! Order is confirmed.`,
          txDetails: data
        });
        showToast?.(`Payment of ${amountDisplay} verified!`, 'success');
      } else {
        setPaystackVerifyStatus({
          success: false,
          message: data.message || 'Payment could not be verified automatically. Please check your reference or contact support.'
        });
        showToast?.(data.message || 'Verification could not confirm payment.', 'error');
      }
    } catch (err: any) {
      const methodLabel = `Paystack (${currency} - Ref: ${reference.substring(0, 16)})`;
      submitPaymentForVerification(pendingCheckoutOrder.id, methodLabel, reference);
      setPaymentDone(true);
      showToast?.('Payment submitted for manual audit.', 'info');
    } finally {
      setIsVerifyingPaystack(false);
      setIsProcessingPaystack(false);
    }
  };

  const handlePayWithPaystack = () => {
    if (!pendingCheckoutOrder) return;
    setIsProcessingPaystack(true);
    setPaystackVerifyStatus(null);

    const isDirectUsd = paystackSettings?.currencyMode === 'direct_usd';
    const effectiveRate = dynamicFxRate || paystackSettings?.usdToNgnRate || 1550;
    const usdAmount = pendingCheckoutOrder.price;
    const ngnAmount = Math.round(usdAmount * effectiveRate);

    const chargeCurrency = isDirectUsd ? 'USD' : 'NGN';
    const chargeAmount = isDirectUsd ? usdAmount : ngnAmount;
    const amountInSubunits = Math.round(chargeAmount * 100);

    const email = pendingCheckoutOrder.email || activeCustomerEmail || 'customer@gmail.com';
    const name = pendingCheckoutOrder.customerName || 'Customer';
    const publicKey = (effectivePaystackPublicKey || paystackSettings?.publicKey || '').trim();

    if (!publicKey) {
      // Graceful instant order placement: Do not block customer or throw error!
      setIsProcessingPaystack(false);
      const invoiceRef = `CARD-INV-${Date.now().toString().slice(-6)}`;
      submitPaymentForVerification(
        pendingCheckoutOrder.id,
        'Card / Direct Payment Invoice',
        invoiceRef
      );
      setPaymentDone(true);
      showToast?.(`Order ${pendingCheckoutOrder.id} submitted successfully! Your order has been registered.`, 'success');
      return;
    }

    const openPaystackModal = () => {
      try {
        const handler = (window as any).PaystackPop.setup({
          key: publicKey,
          email: email,
          amount: amountInSubunits,
          currency: chargeCurrency,
          ref: `DEN-PSTK-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`,
          metadata: {
            custom_fields: [
              { display_name: 'Customer Name', variable_name: 'customer_name', value: name },
              { display_name: 'Order ID', variable_name: 'order_id', value: pendingCheckoutOrder.id },
              { display_name: 'Package Price USD', variable_name: 'usd_price', value: `$${usdAmount} USD` },
              { display_name: 'Exchange Rate', variable_name: 'exchange_rate', value: `₦${effectiveRate.toLocaleString()} / $1 USD` },
              { display_name: 'Service', variable_name: 'service_title', value: pendingCheckoutOrder.serviceTitle }
            ]
          },
          callback: function (response: { reference: string; status?: string }) {
            handleVerifyPaystackPayment(response.reference, chargeAmount, chargeCurrency, usdAmount);
          },
          onClose: function () {
            setIsProcessingPaystack(false);
          }
        });
        handler.openIframe();
      } catch (err: any) {
        setIsProcessingPaystack(false);
        showToast?.(`Error launching Paystack: ${err.message}`, 'error');
      }
    };

    if (typeof (window as any).PaystackPop === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => openPaystackModal();
      script.onerror = () => {
        setIsProcessingPaystack(false);
        showToast?.('Could not load Paystack inline checkout. Please check network.', 'error');
      };
      document.body.appendChild(script);
    } else {
      openPaystackModal();
    }
  };

  const handleManualPaystackVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPaystackRef.trim()) {
      showToast?.('Please enter your Paystack transaction reference ID.', 'error');
      return;
    }
    const isDirectUsd = paystackSettings?.currencyMode === 'direct_usd';
    const effectiveRate = dynamicFxRate || paystackSettings?.usdToNgnRate || 1550;
    const usdAmount = pendingCheckoutOrder.price;
    const ngnAmount = Math.round(usdAmount * effectiveRate);
    const chargeAmount = isDirectUsd ? usdAmount : ngnAmount;
    const chargeCurrency = isDirectUsd ? 'USD' : 'NGN';

    handleVerifyPaystackPayment(manualPaystackRef.trim(), chargeAmount, chargeCurrency, usdAmount);
  };

  // Copy helper
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    if (fieldName === 'orderId') {
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2500);
    } else {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  // Handle Bank Wire submission
  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingCheckoutOrder) return;
    setIsProcessing(true);

    setTimeout(() => {
      const ref = wireRefTxId.trim() || `WIRE-${selectedCurrency}-${Math.floor(100000 + Math.random() * 900000)}`;
      
      if (autoVerifyPayments) {
        processPayment(pendingCheckoutOrder.id, `Bank Wire (${selectedCurrency})`, ref);
      } else {
        submitPaymentForVerification(pendingCheckoutOrder.id, `Bank Wire (${selectedCurrency})`, ref);
      }

      setIsProcessing(false);
      setPaymentDone(true);
    }, 1200);
  };

  if (!pendingCheckoutOrder) {
    return (
      <div className={`min-h-[80vh] flex flex-col items-center justify-center p-6 text-center ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-white'
      }`}>
        <div className={`p-8 rounded-3xl border max-w-md w-full space-y-4 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">No Active Checkout Order</h2>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Please select a service from our catalog or custom order proposal to proceed with secure payment.
          </p>
          <button
            onClick={() => setView('services')}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Services Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Active bank details based on currency
  const currKey = selectedCurrency.toLowerCase() as keyof typeof bankSettings;
  const currentBankSetting = bankSettings?.[currKey];
  const bankAccountDetails = {
    currency: selectedCurrency,
    beneficiary: currentBankSetting?.beneficiary || 'reuben sunday yisa',
    bankName: currentBankSetting?.bankName || (selectedCurrency === 'USD' ? 'Lead' : 'Clear Junction Limited'),
    accountType: currentBankSetting?.accountType || (selectedCurrency === 'USD' ? 'Checking' : undefined),
    accountNumber: currentBankSetting?.accountNumber || (selectedCurrency === 'USD' ? '218146795820' : '43448333'),
    routingNumber: currentBankSetting?.routingNumber || (selectedCurrency === 'USD' ? '101019644' : undefined),
    achRouting: currentBankSetting?.achRouting || (selectedCurrency === 'USD' ? '101019644' : undefined),
    wireRouting: currentBankSetting?.wireRouting || (selectedCurrency === 'USD' ? '101019644' : undefined),
    sortCode: currentBankSetting?.sortCode || (selectedCurrency !== 'USD' ? '041307' : undefined),
    iban: currentBankSetting?.iban || (selectedCurrency !== 'USD' ? 'GB92CLJU04130743448333' : undefined),
    swiftCode: currentBankSetting?.swiftCode || (selectedCurrency === 'EUR' ? 'CLJUGB21XXX' : undefined),
    bankAddress: currentBankSetting?.bankAddress || (selectedCurrency === 'USD' ? '1801 Main St., Kansas City, MO 64108' : selectedCurrency === 'EUR' ? '4th Floor Imperial House, 15 Kingsway, London, United Kingdom, WC2B 6UN' : undefined),
    referenceNote: `ORDER-#${pendingCheckoutOrder.id}`
  };

  return (
    <div className={`py-12 lg:py-20 min-h-[85vh] flex items-center ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-white'
    }`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        
        {/* Step Indicator */}
        <div className="text-center space-y-2">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold ${
            isLight ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
          }`}>
            <Lock className="w-3.5 h-3.5" />
            <span>Encrypted 256-Bit SSL Checkout • Secure Payment Gateway</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {paymentDone ? 'Payment Confirmed' : 'Order Checkout'}
          </h1>
        </div>

        {paymentDone ? (
          /* PAYMENT SUCCESS & VERIFICATION STATUS SCREEN */
          <div className={`max-w-2xl mx-auto p-8 rounded-3xl border text-center space-y-6 shadow-2xl animate-fadeIn ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            
            {pendingCheckoutOrder.paymentStatus === 'Paid' ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Payment Verified & Confirmed
                  </span>
                  <h2 className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Thank You For Your Order!</h2>
                  <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    Your payment has been successfully confirmed. ApexCreator Studio and team are actively executing your project.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/40 mx-auto flex items-center justify-center animate-pulse">
                  <Wallet className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    Payment Details Submitted • Verification Pending
                  </span>
                  <h2 className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Order Submitted Successfully!</h2>
                  <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    Your payment details have been logged. The ApexCreator Studio admin team is cross-checking receipt before confirming payment and delivering your order.
                  </p>
                </div>
              </>
            )}

            {/* Verification Steps Explanation Banner */}
            <div className={`p-4 rounded-2xl border text-left space-y-3 text-xs ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className={`font-extrabold uppercase tracking-wider text-[11px] flex items-center gap-2 ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}>
                <Zap className="w-4 h-4 text-amber-500" />
                <span>How Payment Verification Works:</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px]">
                <div className={`p-3 rounded-xl border space-y-1 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                }`}>
                  <span className="font-bold text-amber-500 block">1. Payment Submitted</span>
                  <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>Customer submits payment reference or invoice link.</p>
                </div>

                <div className={`p-3 rounded-xl border space-y-1 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                }`}>
                  <span className="font-bold text-blue-500 block">2. Admin Verification</span>
                  <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>Admin checks account balance/wire receipt.</p>
                </div>

                <div className={`p-3 rounded-xl border space-y-1 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                }`}>
                  <span className="font-bold text-emerald-500 block">3. Status: Confirmed</span>
                  <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>Admin updates status to "Paid", service is completed & delivered.</p>
                </div>
              </div>
            </div>

            {/* Order Summary Details */}
            <div className={`p-6 rounded-2xl border text-left space-y-3 text-sm ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800/80'
            }`}>
              <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <span className={`font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Order Reference ID:</span>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500 font-mono font-bold">{pendingCheckoutOrder.id}</span>
                  <button
                    onClick={() => handleCopy(pendingCheckoutOrder.id, 'orderId')}
                    className={`p-1 rounded border ${
                      isLight ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                    title="Copy Order ID"
                  >
                    {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <span className={`font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Service Name:</span>
                <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{pendingCheckoutOrder.serviceTitle}</span>
              </div>

              <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <span className={`font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Package Tier:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase">{pendingCheckoutOrder.packageType}</span>
              </div>

              <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <span className={`font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Payment Method:</span>
                <span className="text-amber-500 font-bold flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-amber-500" />
                  {pendingCheckoutOrder.paymentMethod || 'Manual Verification'}
                </span>
              </div>

              {pendingCheckoutOrder.paymentReference && (
                <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                  <span className={`font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Transaction Ref ID:</span>
                  <span className={`font-mono text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{pendingCheckoutOrder.paymentReference}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className={`font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Total Amount:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black text-base">${pendingCheckoutOrder.price} USD</span>
              </div>
            </div>

            {/* VIP Contact Box */}
            {pendingCheckoutOrder.paymentStatus !== 'Paid' && (
              <div className={`p-5 rounded-2xl border text-left space-y-4 ${
                isLight ? 'bg-blue-50 border-blue-200' : 'bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-blue-500/30'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    isLight ? 'bg-blue-100 border-blue-200 text-blue-600' : 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                  }`}>
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Need Expedited Verification?</h4>
                    <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                      Your order is safely recorded and awaiting manual clearance. For instant access or VIP service, send your payment receipt directly to our team via Telegram or WhatsApp.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={`https://wa.me/${contactSettings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20ApexCreator%20Studio,%20I%20just%20made%20a%20payment%20of%20$${pendingCheckoutOrder.price}%20for%20Order%20%23${pendingCheckoutOrder.id}.%20Here%20is%20my%20receipt.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp Receipt
                  </a>
                  <a
                    href={`https://t.me/${contactSettings.telegramHandle.replace('@', '')}?text=Hello%20ApexCreator%20Studio,%20I%20just%20made%20a%20payment%20of%20$${pendingCheckoutOrder.price}%20for%20Order%20%23${pendingCheckoutOrder.id}.%20Here%20is%20my%20receipt.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#0088cc] hover:bg-[#0077b3] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#0088cc]/20"
                  >
                    <Send className="w-4 h-4" /> Telegram Receipt
                  </a>
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  setCustomerEmail(pendingCheckoutOrder.email);
                  setView('my-orders');
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Track Order in Customer Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM WITH CRYPTO, BANK & CARD OPTIONS */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Order Summary Panel */}
            <div className={`lg:col-span-5 p-6 rounded-3xl border space-y-6 shadow-xl ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className={`flex items-center gap-2 border-b pb-4 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <Sparkles className="w-5 h-5 text-blue-500" />
                <h2 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Order Summary</h2>
              </div>

              <div className="space-y-4 text-sm">
                <div className={`p-4 rounded-xl border space-y-2 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800/80'
                }`}>
                  <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    isLight ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                  }`}>
                    {pendingCheckoutOrder.category}
                  </span>
                  <div className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{pendingCheckoutOrder.serviceTitle}</div>
                  <div className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Package: <strong className="text-indigo-600 dark:text-indigo-300 uppercase">{pendingCheckoutOrder.packageType}</strong></div>
                </div>

                <div className={`space-y-2 pt-2 text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  <div className="flex justify-between">
                    <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Order Reference:</span>
                    <span className="font-mono text-blue-500 font-semibold">{pendingCheckoutOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Customer Name:</span>
                    <span className={isLight ? 'text-slate-900' : 'text-white'}>{pendingCheckoutOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Email:</span>
                    <span className={isLight ? 'text-slate-900' : 'text-white'}>{pendingCheckoutOrder.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Social Channel:</span>
                    <span className="text-blue-500 truncate max-w-[180px]">{pendingCheckoutOrder.socialUrl}</span>
                  </div>
                </div>

                <div className={`pt-4 border-t flex items-center justify-between ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                  <div>
                    <span className={`text-base font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Total Amount:</span>
                    {pendingCheckoutOrder.isNegotiatedPrice && (
                      <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase">
                        Custom Price Negotiated
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${pendingCheckoutOrder.price}</span>
                    <span className={`text-xs block font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>USD</span>
                  </div>
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Guaranteed Delivery • ApexCreator Studio Official Agency</span>
              </div>
            </div>

            {/* Right: Payment Method Selector & Interactive Payment Gateway */}
            <div className={`lg:col-span-7 p-6 sm:p-8 rounded-3xl border space-y-6 shadow-xl ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              
              {/* Header */}
              <div className={`flex items-center justify-between border-b pb-4 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <div>
                  <h2 className={`text-lg font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    <Wallet className="w-5 h-5 text-amber-500" />
                    <span>Select Payment Method</span>
                  </h2>
                  <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Secure Global Payment Options</p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 font-bold">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Checkout Ready</span>
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div className="flex flex-col gap-3">
                
                {/* Paystack Payment Option */}
                {paystackSettings?.enabled !== false && (
                  <button
                    type="button"
                    onClick={() => setSelectedTab('paystack')}
                    className={`w-full p-4 rounded-2xl transition-all flex items-center justify-between border ${
                      selectedTab === 'paystack'
                        ? 'bg-teal-500/10 border-teal-500 text-slate-900 dark:text-white shadow-lg shadow-teal-500/10'
                        : isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                        selectedTab === 'paystack' 
                          ? 'bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 border-teal-400 font-black' 
                          : 'bg-slate-100 dark:bg-slate-900 text-teal-500 border-slate-200 dark:border-slate-800'
                      }`}>
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className={`font-extrabold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {hasPaystackKey ? 'Cards / Paystack' : 'Cards & Instant Order'}
                          </span>
                        </div>
                        <div className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {hasPaystackKey 
                            ? 'Credit / Debit Cards (Visa, Mastercard, Amex, Apple Pay)' 
                            : 'Credit / Debit Cards, Apple Pay & Direct Invoice'}
                        </div>
                      </div>
                    </div>
                    <span className="hidden sm:flex text-[10px] bg-teal-500/20 text-teal-600 dark:text-teal-300 px-2.5 py-1 rounded-lg font-extrabold uppercase border border-teal-500/20 items-center gap-1">
                      {hasPaystackKey ? (
                        <><Zap className="w-3 h-3 text-teal-500" /> Auto-Verify</>
                      ) : (
                        <><Sparkles className="w-3 h-3 text-teal-500" /> Instant Order</>
                      )}
                    </span>
                  </button>
                )}

                {/* Crypto Payment */}
                <button
                  type="button"
                  onClick={() => setSelectedTab('crypto')}
                  className={`w-full p-4 rounded-2xl transition-all flex items-center justify-between border ${
                    selectedTab === 'crypto'
                      ? 'bg-emerald-500/10 border-emerald-500 text-slate-900 dark:text-white shadow-lg shadow-emerald-500/10'
                      : isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                      selectedTab === 'crypto' 
                        ? 'bg-emerald-500 text-white border-emerald-400' 
                        : 'bg-slate-100 dark:bg-slate-900 text-emerald-500 border-slate-200 dark:border-slate-800'
                    }`}>
                      <Coins className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className={`font-extrabold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>Crypto Pay</div>
                      <div className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>USDT, BTC, ETH & more</div>
                    </div>
                  </div>
                  <span className="hidden sm:flex text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 px-2.5 py-1 rounded-lg font-extrabold uppercase border border-emerald-500/20 items-center gap-1">
                    <Zap className="w-3 h-3" /> Bybit Auto
                  </span>
                </button>

                {/* Bank Wire */}
                <button
                  type="button"
                  onClick={() => setSelectedTab('bank')}
                  className={`w-full p-4 rounded-2xl transition-all flex items-center justify-between border ${
                    selectedTab === 'bank'
                      ? 'bg-blue-500/10 border-blue-500 text-slate-900 dark:text-white shadow-lg shadow-blue-500/10'
                      : isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                      selectedTab === 'bank' 
                        ? 'bg-blue-600 text-white border-blue-500' 
                        : 'bg-slate-100 dark:bg-slate-900 text-blue-500 border-slate-200 dark:border-slate-800'
                    }`}>
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className={`font-extrabold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>Bank Wire</div>
                      <div className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Direct Transfer (USD/EUR/GBP)</div>
                    </div>
                  </div>
                  <span className="hidden sm:flex text-[10px] bg-blue-500/20 text-blue-600 dark:text-blue-300 px-2.5 py-1 rounded-lg font-extrabold uppercase border border-blue-500/20 items-center gap-1">
                    Manual
                  </span>
                </button>

              </div>

              {/* TAB: PAYSTACK PAYMENT GATEWAY (CLEAN USD GLOBAL PRESENTATION) */}
              {selectedTab === 'paystack' && (() => {
                const usdAmount = pendingCheckoutOrder.price;

                return (
                  <div className="space-y-5 animate-fadeIn">
                    {/* Top Payment Info Banner */}
                    <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                      isLight 
                        ? 'bg-teal-50 border-teal-200 text-teal-900' 
                        : 'bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-slate-900 border-teal-500/30 text-teal-200'
                    }`}>
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <CreditCard className="w-4 h-4 text-teal-500" />
                        <span>Credit / Debit Card & Apple Pay</span>
                      </div>
                      <p className={`text-[11px] leading-relaxed ${isLight ? 'text-teal-700' : 'text-slate-300'}`}>
                        Pay securely with any Visa, Mastercard, American Express, Apple Pay, or Bank Transfer.
                      </p>
                    </div>

                    {/* Order Price Info Card (Clean USD) */}
                    <div className={`p-4 rounded-2xl border space-y-2.5 text-xs ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Package Price:</span>
                        <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>${usdAmount} USD</span>
                      </div>

                      <div className={`flex items-center justify-between pt-2 border-t font-bold text-sm ${
                        isLight ? 'border-slate-200 text-slate-900' : 'border-slate-800 text-white'
                      }`}>
                        <span>Payable Total:</span>
                        <span className="text-teal-500 font-mono text-base font-black">
                          ${usdAmount} USD
                        </span>
                      </div>
                    </div>

                    {/* Paystack Primary Action CTA Button / Instant Order Fallback */}
                    {!hasPaystackKey ? (
                      <div className="space-y-4">
                        <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                          isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        }`}>
                          <div className="flex items-center gap-2 font-bold text-sm text-amber-600 dark:text-amber-400">
                            <Sparkles className="w-4 h-4" />
                            <span>Instant Order Placement & Payment Routing</span>
                          </div>
                          <p className="leading-relaxed">
                            Complete your order now! Click below to confirm order <strong>#{pendingCheckoutOrder.id}</strong>. Our billing desk will reserve your service immediately and provide your direct payment options (Card Invoice link, Bank Wire, or WhatsApp).
                          </p>
                        </div>

                        {/* Primary Action Button */}
                        <button
                          type="button"
                          onClick={handlePayWithPaystack}
                          disabled={isProcessingPaystack}
                          className="w-full py-4 rounded-2xl text-base font-extrabold text-slate-950 bg-gradient-to-r from-teal-400 via-teal-300 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 shadow-xl shadow-teal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                          <CreditCard className="w-5 h-5 text-slate-950" />
                          <span>Submit Order & Pay ${usdAmount} USD</span>
                        </button>

                        {/* Fast switch alternatives */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          <button
                            type="button"
                            onClick={() => setSelectedTab('bank')}
                            className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                              isLight ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' : 'bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20'
                            }`}
                          >
                            <Building2 className="w-4 h-4" />
                            <span>Pay via Bank Wire (USD/GBP)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedTab('crypto')}
                            className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                              isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                            }`}
                          >
                            <Coins className="w-4 h-4" />
                            <span>Pay with Crypto (USDT)</span>
                          </button>
                        </div>

                        {isAdminLoggedIn && (
                          <div className={`p-3 rounded-xl border text-[11px] flex items-center justify-between ${
                            isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800/60 border-slate-700 text-slate-300'
                          }`}>
                            <span className="flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-teal-400" />
                              <span>Admin Notice: Paystack Public Key not configured yet. Enter keys to enable inline popups.</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setView('admin')}
                              className="text-teal-400 font-bold underline hover:text-teal-300 ml-2 whitespace-nowrap cursor-pointer"
                            >
                              Configure in Admin
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handlePayWithPaystack}
                        disabled={isProcessingPaystack || isVerifyingPaystack}
                        className="w-full py-4 rounded-2xl text-base font-extrabold text-slate-950 bg-gradient-to-r from-teal-400 via-teal-300 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 shadow-xl shadow-teal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                      >
                        {isProcessingPaystack || isVerifyingPaystack ? (
                          <span className="flex items-center gap-2">
                            <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
                            <span>{isVerifyingPaystack ? 'Verifying Transaction with Paystack...' : 'Opening Secure Checkout...'}</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-slate-950" />
                            <span>Pay ${usdAmount} with Card</span>
                          </span>
                        )}
                      </button>
                    )}

                    {/* Verification status feedback if present */}
                    {paystackVerifyStatus && (
                      <div className={`p-4 rounded-2xl text-xs flex items-start gap-3 border ${
                        paystackVerifyStatus.success
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      }`}>
                        {paystackVerifyStatus.success ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1">
                          <div className="font-bold">{paystackVerifyStatus.success ? 'Payment Verified' : 'Verification Issue'}</div>
                          <div>{paystackVerifyStatus.message}</div>
                        </div>
                      </div>
                    )}

                    {/* Manual Reference Recovery Accordion */}
                    <div className={`pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                      <button
                        type="button"
                        onClick={() => setShowManualPaystackVerify(!showManualPaystackVerify)}
                        className={`text-xs font-semibold flex items-center justify-between w-full py-1 text-left ${
                          isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>Already paid or have a Paystack Transaction Reference?</span>
                        <span className="text-[11px] text-teal-500 font-bold">{showManualPaystackVerify ? 'Hide ▲' : 'Verify Reference ▼'}</span>
                      </button>

                      {showManualPaystackVerify && (
                        <form onSubmit={handleManualPaystackVerify} className="mt-3 space-y-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                          <label className="text-slate-300 font-semibold block">Enter Paystack Reference ID (e.g. DEN-PSTK-... or ref number):</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={manualPaystackRef}
                              onChange={(e) => setManualPaystackRef(e.target.value)}
                              placeholder="e.g. DEN-PSTK-17123910293 or 34912049"
                              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-teal-500 focus:outline-none"
                            />
                            <button
                              type="submit"
                              disabled={isVerifyingPaystack}
                              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shrink-0 disabled:opacity-50 cursor-pointer"
                            >
                              {isVerifyingPaystack ? 'Checking...' : 'Verify'}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                    {/* Security Assurance footer */}
                    <div className={`p-3 rounded-xl border flex items-center justify-between text-[11px] ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-500" />
                        <span>PCI-DSS Level 1 Certified • 256-Bit SSL</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
                        <span>VISA</span>
                        <span>•</span>
                        <span>MASTERCARD</span>
                        <span>•</span>
                        <span>VERVE</span>
                        <span>•</span>
                        <span>AMEX</span>
                        <span>•</span>
                        <span>APPLE PAY</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* TAB 0: CRYPTO BYBIT MULTI-CURRENCY PAYMENT GATEWAY */}
              {selectedTab === 'crypto' && (
                <div className="space-y-5 animate-fadeIn">
                  
                  {/* Top Banner */}
                  <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                    isLight 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                      : 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-slate-900 border-emerald-500/30 text-emerald-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 text-xs">
                        <Coins className="w-4 h-4 text-emerald-500" /> Bybit Multi-Currency Crypto Gateway
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30 font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3 text-emerald-500" /> Auto-Verified
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isLight ? 'text-emerald-800' : 'text-slate-300'}`}>
                      Select your preferred Cryptocurrency and Network below. Payment will be automatically queried and verified via Bybit API deposit records upon transfer.
                    </p>
                  </div>

                  {coinsList.length === 0 ? (
                    <div className="p-4 rounded-xl border flex items-center gap-3 bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-200">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                      <p className="text-xs">
                        Crypto deposit addresses are currently undergoing maintenance or awaiting admin configuration. Please select <strong>Bank Transfer</strong> or check back shortly.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* 1. Select Cryptocurrency */}
                      <div className="space-y-2">
                        <label className={`text-xs font-bold flex items-center justify-between ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                          <span>1. Select Cryptocurrency</span>
                          <span className={`text-[11px] font-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            1 {selectedCoinSymbol} ≈ ${liveRates[selectedCoinSymbol]?.toLocaleString() || '1.00'} USD
                          </span>
                        </label>

                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                          {coinsList.map((coin) => {
                            const isSelected = selectedCoinSymbol === coin.symbol;
                            return (
                              <button
                                key={coin.symbol}
                                type="button"
                                onClick={() => {
                                  setSelectedCoinSymbol(coin.symbol);
                                  const firstNet = coin.networks[0]?.id || 'TRC20';
                                  setSelectedNetworkId(firstNet);
                                }}
                                className={`p-2 rounded-xl text-center border transition-all flex flex-col items-center gap-1 ${
                                  isSelected
                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-extrabold shadow-md'
                                    : isLight
                                      ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                                }`}
                              >
                                <span className="text-xs font-bold">{coin.symbol}</span>
                                <span className="text-[9px] opacity-75">{coin.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2. Select Network */}
                      {activeCoin && (activeCoin.networks?.length || 0) > 0 && (
                        <div className="space-y-2">
                          <label className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>2. Select Transfer Network</label>
                          <div className="flex flex-wrap gap-2">
                            {(activeCoin.networks || []).map((net) => {
                              const isNetSelected = selectedNetworkId === net.id;
                              return (
                                <button
                                  key={net.id}
                                  type="button"
                                  onClick={() => setSelectedNetworkId(net.id)}
                                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                                    isNetSelected
                                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                                      : isLight
                                        ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                                  }`}
                                >
                                  <span>{net.name}</span>
                                  {isNetSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Payment Details Box (QR Code, Wallet Address, Amount, Timer) */}
                  {coinsList.length > 0 && (
                    <div className={`p-5 rounded-2xl border space-y-4 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                    }`}>
                    
                    {/* Expiration Timer Banner */}
                    <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl text-xs text-amber-700 dark:text-amber-300">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
                        <span>Payment Deposit Session Active</span>
                      </div>
                      <div className="font-mono font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
                        Expires in {formatTimer(timerSeconds)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                      
                      {/* Left: Scannable QR Code */}
                      <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200 shadow-inner text-center">
                        {activeNetwork?.address ? (
                          <>
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                                activeNetwork.address
                              )}`}
                              alt="Deposit QR Code"
                              className="w-36 h-36 rounded-lg object-contain"
                            />
                            <span className="text-[10px] text-slate-600 font-bold mt-1.5 flex items-center gap-1">
                              <QrCode className="w-3 h-3 text-slate-800" /> Scan with Crypto App
                            </span>
                          </>
                        ) : (
                          <div className={`w-36 h-36 flex items-center justify-center text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'} text-center`}>
                            Address not configured
                          </div>
                        )}
                      </div>

                      {/* Right: Exact Amount & Wallet Address */}
                      <div className="sm:col-span-7 space-y-3.5 text-xs">
                        
                        {/* Amount Box */}
                        <div className={`p-3 rounded-xl border space-y-1 ${
                          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                        }`}>
                          <span className={`text-[11px] font-medium block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Exact Amount to Send:</span>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-mono font-black text-emerald-600 dark:text-emerald-400">
                              {calculatedCryptoAmount} {selectedCoinSymbol}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(calculatedCryptoAmount, 'cryptoAmount')}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors border ${
                                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                              }`}
                            >
                              {copiedField === 'cryptoAmount' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedField === 'cryptoAmount' ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                          <span className="text-[10px] text-slate-500 block">
                            Equivalent to ${usdPrice} USD (${liveRates[selectedCoinSymbol]?.toLocaleString() || '1'} USD/{selectedCoinSymbol})
                          </span>
                        </div>

                        {/* Deposit Address Box */}
                        <div className={`p-3 rounded-xl border space-y-1 ${
                          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                        }`}>
                          <span className={`text-[11px] font-medium flex items-center justify-between ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            <span>Recipient {selectedCoinSymbol} Address ({selectedNetworkId}):</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <code className={`text-[11px] font-mono p-2 rounded-lg border break-all flex-1 ${
                              isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                            }`}>
                              {activeNetwork?.address || 'Contact admin to obtain wallet address'}
                            </code>
                            <button
                              type="button"
                              onClick={() => handleCopy(activeNetwork?.address || '', 'cryptoAddr')}
                              className="px-2.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all shrink-0"
                            >
                              {copiedField === 'cryptoAddr' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedField === 'cryptoAddr' ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* Notice */}
                    <p className={`text-[11px] p-2.5 rounded-xl border leading-relaxed ${
                      isLight ? 'bg-amber-50 border-amber-200 text-amber-800' : 'text-amber-400/90 bg-amber-500/5 border-amber-500/10'
                    }`}>
                      ⚠️ <strong>Important:</strong> Only send <strong>{selectedCoinSymbol}</strong> via the <strong>{selectedNetworkId}</strong> network to this address. Sending via any other network may result in loss of funds.
                    </p>

                  </div>
                  )}

                  {/* Transaction Hash Input (Optional for manual input) */}
                  <div className="space-y-1.5">
                    <label className={`text-xs font-semibold flex items-center justify-between ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      <span>Transaction Hash / TXID (Optional)</span>
                      <span className="text-[10px] text-slate-500">Provide for instant blockchain lookup</span>
                    </label>
                    <input
                      type="text"
                      value={cryptoTxHash}
                      onChange={(e) => setCryptoTxHash(e.target.value)}
                      placeholder="e.g. 0x8f2a... or 7d21... (Paste your transfer transaction ID)"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono transition-colors focus:outline-none focus:border-emerald-500 ${
                        isLight ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                      }`}
                    />
                  </div>

                  {/* Error or Status Feedback */}
                  {cryptoVerifyStatus && (
                    <div
                      className={`p-4 rounded-2xl text-xs space-y-1.5 border ${
                        cryptoVerifyStatus.success
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold">
                        {cryptoVerifyStatus.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-500" />
                        )}
                        <span>{cryptoVerifyStatus.success ? 'Payment Confirmed!' : 'Verification Result'}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">{cryptoVerifyStatus.message}</p>
                    </div>
                  )}

                  {/* Verification Button */}
                  <button
                    type="button"
                    onClick={handleCryptoVerification}
                    disabled={isVerifyingCrypto || paymentDone}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-extrabold text-sm hover:from-emerald-400 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isVerifyingCrypto ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Querying Bybit Blockchain Deposits...</span>
                      </>
                    ) : paymentDone ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>Payment Confirmed & Verified</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-amber-300" />
                        <span>I Have Sent Payment — Verify Automatically</span>
                      </>
                    )}
                  </button>

                </div>
              )}

              {/* TAB 1: BANK WIRE TRANSFER */}
              {selectedTab === 'bank' && (
                <form onSubmit={handleBankSubmit} className="space-y-4 animate-fadeIn">
                  
                  <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                    isLight ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-blue-500/10 border-blue-500/30 text-blue-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" /> Bank Wire Receiving Account Details
                      </span>
                      <span className="text-[10px] bg-blue-500/20 text-blue-700 dark:text-blue-300 font-mono px-2 py-0.5 rounded border border-blue-500/30">
                        USD / GBP / EUR
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isLight ? 'text-blue-800' : 'text-slate-300'}`}>
                      Transfer directly to ApexCreator Studio's local receiving accounts via ACH, BACS, SEPA, or international wire transfer.
                    </p>
                  </div>

                  <div className={`flex items-center gap-2 p-1 rounded-xl border ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
                  }`}>
                    {(['USD', 'GBP', 'EUR'] as const).map((curr) => (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => setSelectedCurrency(curr)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          selectedCurrency === curr
                            ? 'bg-blue-600 text-white shadow-md'
                            : isLight 
                              ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200' 
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {curr === 'USD' ? '🇺🇸' : curr === 'GBP' ? '🇬🇧' : '🇪🇺'} {curr}
                      </button>
                    ))}
                  </div>

                  {/* Account credentials box */}
                  <div className={`p-4 rounded-2xl border space-y-3 text-xs ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    
                    <div className={`flex items-center justify-between pb-2 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                      <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Beneficiary Name:</span>
                      <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{bankAccountDetails.beneficiary}</span>
                    </div>

                    <div className={`flex items-center justify-between pb-2 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                      <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Bank Name:</span>
                      <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{bankAccountDetails.bankName}</span>
                    </div>

                    {bankAccountDetails.accountType && (
                      <div className={`flex items-center justify-between pb-2 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                        <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Account Type:</span>
                        <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{bankAccountDetails.accountType}</span>
                      </div>
                    )}

                    {bankAccountDetails.routingNumber && (
                      <div className={`flex items-center justify-between pb-2 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                        <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Routing Number (ACH & Wire):</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{bankAccountDetails.routingNumber}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(bankAccountDetails.routingNumber!, 'routing')}
                            className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                              isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                            }`}
                          >
                            {copiedField === 'routing' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    )}

                    {bankAccountDetails.sortCode && (
                      <div className={`flex items-center justify-between pb-2 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                        <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Sort Code:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{bankAccountDetails.sortCode}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(bankAccountDetails.sortCode!, 'sortcode')}
                            className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                              isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                            }`}
                          >
                            {copiedField === 'sortcode' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    )}

                    {bankAccountDetails.accountNumber && (
                      <div className={`flex items-center justify-between pb-2 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                        <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Account Number:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{bankAccountDetails.accountNumber}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(bankAccountDetails.accountNumber!, 'account')}
                            className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                              isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                            }`}
                          >
                            {copiedField === 'account' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    )}

                    {bankAccountDetails.iban && (
                      <div className={`flex items-center justify-between pb-2 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                        <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>IBAN:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{bankAccountDetails.iban}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(bankAccountDetails.iban!, 'iban')}
                            className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                              isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                            }`}
                          >
                            {copiedField === 'iban' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    )}

                    {bankAccountDetails.swiftCode && (
                      <div className={`flex items-center justify-between pb-2 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                        <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>SWIFT / BIC Code:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{bankAccountDetails.swiftCode}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(bankAccountDetails.swiftCode!, 'swift')}
                            className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                              isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                            }`}
                          >
                            {copiedField === 'swift' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    )}

                    {bankAccountDetails.bankAddress && (
                      <div className={`flex items-start justify-between pb-2 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                        <span className={`shrink-0 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Bank Address:</span>
                        <div className="flex items-center gap-2 text-right">
                          <span className={`font-mono text-[11px] ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{bankAccountDetails.bankAddress}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(bankAccountDetails.bankAddress!, 'address')}
                            className={`px-2 py-0.5 rounded text-[10px] border transition-colors shrink-0 ${
                              isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                            }`}
                          >
                            {copiedField === 'address' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Payment Reference Code:</span>
                      <span className="font-mono text-amber-600 dark:text-amber-400 font-extrabold">{bankAccountDetails.referenceNote}</span>
                    </div>

                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Enter Your Transfer Reference / Transaction ID
                    </label>
                    <input
                      type="text"
                      value={wireRefTxId}
                      onChange={(e) => setWireRefTxId(e.target.value)}
                      placeholder="e.g. ACH-9812405 or Wire Ref #"
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-mono transition-colors focus:outline-none focus:border-blue-500 ${
                        isLight ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-950 border-slate-800 text-white placeholder-slate-600'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Confirming Wire Transfer...
                      </span>
                    ) : (
                      <span>Submit Transfer & Confirm Order (${pendingCheckoutOrder.price} USD)</span>
                    )}
                  </button>

                </form>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
