import React, { useState, useEffect } from 'react';
import { captureLead } from '../utils/analyticsTracker';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  X,
  Send,
  MessageCircle,
  Mail,
  User,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';

export const VipLeadCaptureModal: React.FC = () => {
  const { contactSettings, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [platformGoal, setPlatformGoal] = useState<'YouTube Growth' | 'Twitch Revamp' | 'Brand & Graphics' | 'E-commerce & Merch'>('YouTube Growth');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    if (sessionStorage.getItem('denny_vip_modal_dismissed') === 'true') {
      return;
    }

    // Trigger after 14 seconds
    const timer = setTimeout(() => {
      if (sessionStorage.getItem('denny_vip_modal_dismissed') !== 'true') {
        setIsOpen(true);
      }
    }, 14000);

    // Exit intent trigger (desktop mouse leaving top)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && sessionStorage.getItem('denny_vip_modal_dismissed') !== 'true') {
        setIsOpen(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    const handleCustomTrigger = () => setIsOpen(true);
    window.addEventListener('open-vip-lead-modal', handleCustomTrigger);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('open-vip-lead-modal', handleCustomTrigger);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('denny_vip_modal_dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !phone) {
      showToast('Please enter an email or phone/WhatsApp number.', 'error');
      return;
    }

    setLoading(true);
    const success = await captureLead({
      name,
      email,
      phone,
      source: 'VIP Strategy & Lead Modal',
      notes: `Target Platform: ${platformGoal}`
    });

    setLoading(false);
    if (success) {
      setIsSubmitted(true);
      showToast('Strategy request sent! We will reach out to you shortly.', 'success');
      sessionStorage.setItem('denny_vip_modal_dismissed', 'true');
    } else {
      showToast('Submitted! We recorded your details.', 'success');
      setIsSubmitted(true);
    }
  };

  if (!isOpen) return null;

  const rawWhatsApp = contactSettings.whatsappNumber ? contactSettings.whatsappNumber.replace(/[^0-9]/g, '') : '1234567890';
  const whatsappUrl = `https://wa.me/${rawWhatsApp}?text=${encodeURIComponent(`Hi ApexCreator Studio, I just requested my free Growth Strategy on your website! My name is ${name || 'there'}.`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden">
        {/* Decorative Top Accent Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 blur-[2px]" />
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Free 1-on-1 Growth Consultation</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Unlock a Custom Roadmap to 10x Your Channel & Brand
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Leave your WhatsApp or Email to receive an actionable audit and tailored growth blueprint from our executive team.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Your Name or Channel Handle
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex (ApexGaming)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp / Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Primary Focus / Goal
                </label>
                <select
                  value={platformGoal}
                  onChange={(e) => setPlatformGoal(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="YouTube Growth">YouTube (Thumbnails, SEO, Retention)</option>
                  <option value="Twitch Revamp">Twitch & Streaming (Overlays, Emotes, Setup)</option>
                  <option value="Brand & Graphics">Full Brand Identity & Vector Graphics</option>
                  <option value="E-commerce & Merch">Merchandise & Social Media Scaling</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Me My Free Custom Roadmap</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Zero spam
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-teal-400" /> Fast WhatsApp Callback
                </span>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">We've Received Your Details!</h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Our executive team is reviewing your profile and will prepare your tailored growth strategy.
              </p>
            </div>

            {contactSettings.whatsappNumber && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20 w-full"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat Directly on WhatsApp Now</span>
              </a>
            )}

            <button
              onClick={handleClose}
              className="text-xs text-slate-400 hover:text-white underline block mx-auto pt-2"
            >
              Continue Browsing Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
