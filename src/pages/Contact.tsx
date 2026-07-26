import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Mail, Send, Sparkles, CheckCircle2, Clock } from 'lucide-react';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const artworkParam = searchParams.get('artwork');

  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: artworkParam ? `Hello, I would like to inquire about the work "${artworkParam}".` : '',
  });

  useEffect(() => {
    if (artworkParam) {
      setForm((prev) => ({
        ...prev,
        message: `Hello, I would like to inquire about the work "${artworkParam}".`,
      }));
    }
  }, [artworkParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="pt-32 pb-28 bg-ink-950 text-ink-50 font-sans">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="max-w-2xl fade-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-[10px] uppercase tracking-widest font-semibold mb-6">
            <Sparkles size={12} />
            <span>Advisory Concierge</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-ink-50 font-light leading-tight">
            Begin a <span className="font-serif italic gold-text-gradient">conversation</span>
          </h1>
          <p className="text-ink-300 mt-6 leading-relaxed font-light text-base">
            Whether you are enquiring about a specific work, seeking advice on a collection, or wish to visit the gallery in person — we would be glad to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mt-16">
          {/* Form */}
          <div className="lg:col-span-7">
            {sent ? (
              <div className="glass-panel-gold p-12 rounded-xl border border-gold-500/40 text-center space-y-6 fade-up">
                <div className="w-16 h-16 mx-auto rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-display text-3xl gold-text-gradient font-medium">Thank You</h3>
                <p className="text-ink-200 font-light text-base leading-relaxed max-w-md mx-auto">
                  Your message has been received. A curator from NOUS ART Gallery will be in touch with you shortly.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({ name: '', email: '', message: '' });
                  }}
                  className="btn-outline-gold rounded-sm !py-2.5 !px-6 text-xs uppercase"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-panel p-8 sm:p-10 rounded-xl border border-white/10 space-y-8 fade-up">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="font-title text-sm uppercase tracking-widest text-gold-400 font-semibold">
                    Inquiry Form
                  </h3>
                  <p className="text-xs text-ink-400 font-light mt-1">
                    Please provide your contact details below.
                  </p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-ink-300 font-medium mb-3">
                    Name <span className="text-gold-400">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-ink-900/80 border border-white/10 rounded-md py-3.5 px-4 text-ink-50 placeholder-ink-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-ink-300 font-medium mb-3">
                    Email Address <span className="text-gold-400">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="jane.doe@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-ink-900/80 border border-white/10 rounded-md py-3.5 px-4 text-ink-50 placeholder-ink-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-ink-300 font-medium mb-3">
                    Message <span className="text-gold-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Detail your inquiry or requested appointment date..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-ink-900/80 border border-white/10 rounded-md py-3.5 px-4 text-ink-50 placeholder-ink-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-gold rounded-sm w-full group flex items-center justify-center gap-3 !py-4"
                >
                  <span>Send Message</span>
                  <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </div>

          {/* Info Side */}
          <div className="lg:col-span-5 space-y-8 fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="glass-panel p-8 rounded-xl border border-white/10 space-y-8">
              <h3 className="font-title text-sm uppercase tracking-widest text-gold-400 font-semibold border-b border-white/10 pb-4">
                Gallery Location & Info
              </h3>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-ink-300 font-medium mb-1">Gallery Address</h4>
                  <p className="text-ink-100 font-light text-sm leading-relaxed">
                    2719 Tropical Point<br />
                    Fort Worth, TX, USA
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-ink-300 font-medium mb-1">Email</h4>
                  <p className="text-ink-100 font-light text-sm">hello@nousart.gallery</p>
                </div>
              </div>

              <div className="flex gap-4 items-start pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-ink-300 font-medium mb-1">Opening Hours</h4>
                  <p className="text-ink-100 font-light text-sm leading-relaxed">
                    Tuesday – Saturday<br />
                    11:00 AM – 7:00 PM (or by appointment)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
