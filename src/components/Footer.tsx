import { Link } from 'react-router-dom';
import { Instagram, Mail, ArrowUp, Send, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/10 bg-ink-950 text-ink-100 mt-32 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-gold-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Col 1 & 2: Brand Identity */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3.5 group">
              <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-ink-900 border border-gold-500/40 group-hover:border-gold-500 transition-all duration-500 overflow-hidden shrink-0 shadow-md">
                <img src="/img/logo.jpeg?v=2" alt="Nous Art Logo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-title text-2xl tracking-[0.25em] text-ink-50">
                  NOUS <span className="gold-text-gradient font-bold">ART</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.35em] text-ink-300">
                  Contemporary Art Gallery
                </span>
              </div>
            </Link>

            <p className="text-sm text-ink-200 leading-relaxed max-w-md font-light">
              A curated exhibition and acquisition space dedicated to contemporary creation. We assist collectors and enthusiasts in discovering exceptional original works.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-ink-200 hover:text-gold-300 hover:border-gold-500/50 hover:bg-gold-500/10 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="mailto:hello@nousart.gallery"
                className="w-10 h-10 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-ink-200 hover:text-gold-300 hover:border-gold-500/50 hover:bg-gold-500/10 transition-all duration-300"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="font-title text-xs uppercase tracking-widest2 gold-text-gradient mb-6 font-semibold">
              Navigation
            </h4>
            <ul className="space-y-3.5">
              <li>
                <Link to="/" className="text-sm text-ink-200 hover:text-gold-300 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-sm text-ink-200 hover:text-gold-300 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Collection
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-ink-200 hover:text-gold-300 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  About & Philosophy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-ink-200 hover:text-gold-300 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact & Visit
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Visit & Location */}
          <div>
            <h4 className="font-title text-xs uppercase tracking-widest2 gold-text-gradient mb-6 font-semibold">
              Gallery Location
            </h4>
            <div className="space-y-4 text-xs text-ink-200">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-gold-500 mt-0.5 shrink-0" />
                <span>2719 Tropical Point<br />Fort Worth, TX, USA</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-gold-500 mt-0.5 shrink-0" />
                <span>Tuesday – Saturday<br />11:00 AM – 7:00 PM</span>
              </div>
            </div>
          </div>

          {/* Col 5: Gazette & Newsletter */}
          <div>
            <h4 className="font-title text-xs uppercase tracking-widest2 gold-text-gradient mb-6 font-semibold">
              Newsletter
            </h4>
            <p className="text-xs text-ink-200 leading-relaxed mb-4">
              Subscribe to receive private view invitations and exclusive preview announcements.
            </p>
            {subscribed ? (
              <div className="p-3 bg-gold-500/10 border border-gold-500/30 rounded text-xs text-gold-300">
                Thank you. Your subscription has been confirmed.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-ink-900 border border-white/10 rounded-sm py-2.5 px-3 pr-10 text-xs text-ink-50 placeholder-ink-300 focus:outline-none focus:border-gold-500 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gold-500 hover:text-gold-300 p-1"
                  aria-label="Subscribe"
                >
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ink-300">
          <p>© {new Date().getFullYear()} NOUS ART GALLERY. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 md:gap-6 mt-4 md:mt-0">
            <Link to="/terms" className="hover:text-gold-300 transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-gold-300 transition-colors">
              Privacy
            </Link>
            <Link to="/admin" className="hover:text-gold-300 transition-colors">
              Admin Portal
            </Link>
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 text-ink-200 hover:text-gold-300 transition-colors focus:outline-none"
              aria-label="Back to top"
            >
              <span className="uppercase tracking-widest text-[10px]">Back to top</span>
              <div className="w-7 h-7 rounded-full bg-ink-900 border border-white/10 group-hover:border-gold-500 flex items-center justify-center transition-colors">
                <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
