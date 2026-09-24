import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { captureLead } from '../utils/analyticsTracker';
import {
  Download,
  Sparkles,
  CheckCircle2,
  X,
  FileText,
  Mail,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadMagnetModal: React.FC<LeadMagnetModalProps> = ({ isOpen, onClose }) => {
  const { theme, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [selectedResource, setSelectedResource] = useState<'youtube-playbook' | 'shopify-audit' | 'channel-review'>('youtube-playbook');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const isLight = theme === 'light';

  const resources = [
    {
      id: 'youtube-playbook',
      title: '2026 YouTube Growth & CTR Playbook',
      subtitle: 'PDF Guide • 18 Pages',
      desc: 'Master visual psychology, 3-second hook structures, and title curiosity gaps that consistently drive 8%+ CTR.',
      badge: 'Most Downloaded'
    },
    {
      id: 'shopify-audit',
      title: 'Shopify Creator Store Conversion Checklist',
      subtitle: 'Interactive Template',
      desc: 'Step-by-step audit framework to optimize mobile merchandise checkouts and turn followers into paying buyers.',
      badge: 'E-commerce'
    },
    {
      id: 'channel-review',
      title: 'Request 15-Min Channel Video Strategy Review',
      subtitle: 'Direct Agency Audit',
      desc: 'Receive a personalized video teardown of your channel thumbnails, keywords, and layout from ApexCreator team.',
      badge: 'Free Audit'
    }
  ] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    captureLead({
      email,
      notes: `Resource: ${selectedResource}`,
      source: 'Free Resource / Lead Magnet'
    });

    // Save lead locally
    const existingLeads = JSON.parse(localStorage.getItem('denny_leads') || '[]');
    existingLeads.push({
      id: `lead-${Date.now()}`,
      email,
      resourceRequested: selectedResource,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('denny_leads', JSON.stringify(existingLeads));

    setSubmitted(true);
    showToast('Success! Your free growth resource is ready below.', 'success');
  };

  return (
    <div className={`fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn ${
      isLight ? 'bg-slate-900/60' : 'bg-slate-950/80'
    }`}>
      <div className={`w-full max-w-2xl rounded-3xl border p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        
        {/* Header */}
        <div className={`flex items-start justify-between gap-4 border-b pb-4 ${
          isLight ? 'border-slate-200' : 'border-slate-800/80'
        }`}>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Free Creator Resource Hub</span>
            </div>
            <h3 className={`text-xl sm:text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Accelerate Your Channel Growth
            </h3>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition-colors ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600' : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
            
            {/* Resource Selector Cards */}
            <div className="space-y-3">
              <label className={`font-extrabold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Select Your Free Strategy Resource:</label>
              <div className="grid grid-cols-1 gap-3">
                {resources.map((res) => {
                  const isSelected = selectedResource === res.id;
                  return (
                    <div
                      key={res.id}
                      onClick={() => setSelectedResource(res.id as any)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                          : isLight
                          ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                        isSelected 
                          ? 'bg-amber-500 text-slate-950' 
                          : isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-900 text-amber-400 border border-slate-800'
                      }`}>
                        <FileText className="w-5 h-5" />
                      </div>

                      <div className="space-y-1 flex-grow">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`font-extrabold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{res.title}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                            {res.badge}
                          </span>
                        </div>
                        <div className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{res.subtitle}</div>
                        <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                          {res.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className={`font-extrabold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Enter Your Email Address To Receive Instant Access:</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com or channel@creator.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-2xl border transition-colors focus:outline-none focus:border-amber-500 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                  }`}
                />
              </div>
              <p className={`text-[11px] flex items-center gap-1.5 pt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Privacy Guaranteed. Zero spam. Instant download access provided immediately.</span>
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>Unlock Free Growth Resource Now</span>
            </button>

          </form>
        ) : (
          /* Submission Success View with Instant Access Links */
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className={`text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Your Growth Resource Is Unlocked!</h4>
              <p className={`text-xs max-w-md mx-auto ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                We have registered your email (<span className="text-amber-600 dark:text-amber-400 font-bold">{email}</span>). You can view or download your free guide instantly using the link below:
              </p>
            </div>

            <div className={`p-4 rounded-2xl border space-y-3 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-emerald-500/30'
            }`}>
              <div className={`flex items-center justify-between text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>2026_YouTube_Growth_Playbook_ApexCreator.pdf</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400">18 Pages • Ready</span>
              </div>

              <a
                href="#download-playbook"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Downloading 2026 YouTube Growth Playbook...', 'info');
                }}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Download Playbook PDF Directly</span>
              </a>
            </div>

            <button
              onClick={onClose}
              className={`text-xs underline pt-2 ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              Close and return to site
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
