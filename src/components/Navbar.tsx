import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Instagram, Mail, MapPin, Clock, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 25);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile curtain menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const links = [
    { to: '/', label: 'Home', num: '01' },
    { to: '/gallery', label: 'Collection', num: '02' },
    { to: '/about', label: 'About', num: '03' },
    { to: '/contact', label: 'Contact', num: '04' },
  ];

  return (
    <>
      {/* Floating Capsule Header Container */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-10 pt-4 transition-all duration-500 pointer-events-none">
        <div
          className={`mx-auto max-w-7xl rounded-2xl pointer-events-auto transition-all duration-500 ${
            scrolled
              ? 'nav-glass-pill-scrolled py-3 px-5 sm:px-8'
              : 'nav-glass-pill py-4 px-6 sm:px-8'
          }`}
        >
          <nav className="flex items-center justify-between">
            {/* Official Logo Brand */}
            <Link to="/" className="group flex items-center gap-3.5 focus:outline-none">
              <div className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-ink-900 border border-gold-500/40 group-hover:border-gold-500 transition-all duration-500 shadow-md group-hover:shadow-[0_0_20px_rgba(212,173,118,0.4)] group-hover:scale-105 overflow-hidden shrink-0">
                <img
                  src="/img/logo.jpeg?v=2"
                  alt="Nous Art Logo"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-title text-xl md:text-2xl tracking-[0.25em] text-ink-50 group-hover:text-gold-300 transition-colors">
                    NOUS
                  </span>
                  <span className="font-title text-xl md:text-2xl tracking-[0.25em] gold-text-gradient font-bold gold-text-glow">
                    ART
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-[0.35em] text-ink-400 font-sans mt-0.5">
                  Contemporary Gallery
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3 bg-ink-900/60 p-1.5 rounded-full border border-white/5">
              {links.map((l) => {
                const isActive = location.pathname === l.to;
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`nav-link-item rounded-full text-xs uppercase tracking-widest2 font-medium transition-all duration-300 ${
                      isActive ? 'active text-gold-300 font-semibold' : 'text-ink-300 hover:text-ink-50'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse shadow-[0_0_8px_rgba(212,173,118,1)]" />}
                      {l.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Right Desktop Action Button */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/gallery"
                className="btn-gold rounded-full !py-2.5 !px-6 !text-[11px] shimmer-bar group shadow-lg"
              >
                <span className="relative z-10 font-semibold">Explore Works</span>
                <ArrowUpRight
                  size={15}
                  className="relative z-10 ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>

            {/* Mobile Animated Hamburger Button */}
            <button
              className="md:hidden relative z-50 w-11 h-11 flex items-center justify-center rounded-xl bg-ink-900 border border-white/10 text-ink-100 hover:text-gold-300 hover:border-gold-500/50 transition-all focus:outline-none group shadow-lg"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 relative flex flex-col justify-between items-center">
                <span
                  className={`w-full h-[2px] bg-gold-400 rounded-full transition-all duration-400 ${
                    open ? 'rotate-45 translate-y-[7px] bg-gold-300' : ''
                  }`}
                />
                <span
                  className={`w-full h-[2px] bg-ink-200 rounded-full transition-all duration-300 ${
                    open ? 'opacity-0 scale-x-0' : 'group-hover:bg-gold-400'
                  }`}
                />
                <span
                  className={`w-full h-[2px] bg-gold-400 rounded-full transition-all duration-400 ${
                    open ? '-rotate-45 -translate-y-[7px] bg-gold-300' : ''
                  }`}
                />
              </div>
            </button>
          </nav>
        </div>
      </header>

      {/* Fullscreen High-End Animated Mobile Curtain Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden bg-ink-950/98 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between p-6 sm:p-10 pt-28 ${
          open
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-full'
        }`}
      >
        {/* Background Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-gold-500/10 blur-[130px] rounded-full pointer-events-none" />

        {/* Staggered Navigation Links */}
        <div className="my-auto py-6 space-y-6 relative z-10">
          <div className="flex items-center gap-2 text-gold-400 text-xs uppercase tracking-[0.35em] font-semibold mb-4">
            <Sparkles size={14} />
            <span>Navigation</span>
          </div>

          {links.map((l, index) => {
            const isActive = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  transitionDelay: open ? `${index * 90 + 100}ms` : '0ms',
                }}
                className={`group flex items-center justify-between py-3 border-b border-white/10 transition-all duration-700 ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                <div className="flex items-center gap-5">
                  <span className="text-xs font-mono text-gold-500/80 bg-gold-500/10 px-2.5 py-1 rounded border border-gold-500/20">
                    {l.num}
                  </span>
                  <span
                    className={`font-display text-4xl sm:text-5xl tracking-wider transition-all duration-400 ${
                      isActive
                        ? 'gold-text-gradient font-medium italic'
                        : 'text-ink-100 group-hover:text-gold-300 group-hover:italic group-hover:translate-x-2'
                    }`}
                  >
                    {l.label}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center group-hover:border-gold-500 group-hover:bg-gold-500/10 transition-all">
                  <ArrowUpRight
                    size={18}
                    className={`transition-all duration-400 ${
                      isActive
                        ? 'text-gold-300 opacity-100 scale-110'
                        : 'text-ink-400 opacity-60 group-hover:opacity-100 group-hover:text-gold-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                    }`}
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Info inside Mobile Menu */}
        <div className="relative z-10 glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex flex-col gap-2.5 text-xs text-ink-300 font-light">
            <div className="flex items-start gap-2.5">
              <MapPin size={15} className="text-gold-500 shrink-0 mt-0.5" />
              <span className="text-ink-100">2719 Tropical Point, Fort Worth, TX, USA</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock size={15} className="text-gold-500 shrink-0" />
              <span>Tuesday – Saturday 11:00 – 19:00</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-ink-300 hover:text-gold-300 hover:border-gold-500/50 hover:bg-gold-500/10 transition-all"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="mailto:hello@nousart.gallery"
                className="w-9 h-9 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-ink-300 hover:text-gold-300 hover:border-gold-500/50 hover:bg-gold-500/10 transition-all"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>

            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="btn-gold !py-2.5 !px-5 !text-[10px] rounded-full shadow-lg"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
