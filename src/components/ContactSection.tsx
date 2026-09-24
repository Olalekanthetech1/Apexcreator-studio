import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { captureLead } from '../utils/analyticsTracker';
import { Mail, MessageSquare, Clock, Send, Sparkles, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { showToast, theme } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Question');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const isLight = theme === 'light';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please complete all contact fields.', 'error');
      return;
    }

    captureLead({
      email,
      name,
      notes: `Subject: ${subject} | Message: ${message}`,
      source: 'Contact Page Form'
    });

    setSent(true);
    showToast('Inquiry sent! Our support team will reply within 12-24 hours.', 'success');
  };

  return (
    <section className={`py-16 lg:py-24 relative transition-colors duration-300 ${
      isLight ? 'bg-white text-slate-900' : 'bg-slate-950 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-600">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Dedicated Client Support</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Get In Touch With ApexCreator Studio
          </h2>

          <p className={`text-base sm:text-lg ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Have questions before ordering or need custom agency enterprise packages? Reach out to our team directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Info Panel */}
          <div className={`p-8 rounded-3xl border space-y-6 shadow-sm ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Contact Channels</h3>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Official Support Email</h4>
                  <p className="text-xs text-blue-600 font-mono mt-0.5">support@apexcreator.studio</p>
                  <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Direct channel for order inquiries and custom quotes.</p>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Creator Community Discord</h4>
                  <p className="text-xs text-purple-600 font-mono mt-0.5">discord.gg/apexcreator</p>
                  <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Live chat with account managers and fellow creators.</p>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Guaranteed Response Time</h4>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">Within 12 - 24 Hours</p>
                  <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>24/7 ticket coverage across global time zones.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className={`p-8 rounded-3xl border shadow-sm space-y-6 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            {sent ? (
              <div className="text-center py-12 space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-600 border border-emerald-500/40 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Inquiry Received!</h3>
                <p className={`text-sm max-w-md mx-auto ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Thank you for contacting ApexCreator Studio. An agency team member will reach out to <strong>{email}</strong> within 12-24 hours.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setMessage('');
                  }}
                  className={`px-6 py-2.5 rounded-xl border text-xs font-semibold ${
                    isLight ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100' : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className={`text-xl font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Send Us A Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Rivera"
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-indigo-500 transition-colors ${
                        isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-indigo-500 transition-colors ${
                        isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-indigo-500 transition-colors ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  >
                    <option value="General Question">General Question</option>
                    <option value="Pre-Order Inquiry">Pre-Order Inquiry</option>
                    <option value="Custom Enterprise Package">Custom Enterprise Package</option>
                    <option value="Order Support">Existing Order Support</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Message</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your project or questions..."
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
