import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Instagram, Mail, MapPin } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
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
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-ink-950/90 backdrop-blur-xl py-4 border-b border-white/10 shadow-2xl shadow-black/80'
            : 'bg-gradient-to-b from-ink-950/90 via-ink-950/40 to-transparent py-6'
        }`}
      >
        <nav className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between">
          {/* Logo with official SVG image */}
          <Link to="/" className="group flex items-center gap-3.5 focus:outline-none">
            <div className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-ink-900 border border-gold-500/30 group-hover:border-gold-500 transition-all duration-500 shadow-md group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <img
                src="/img/logo.svg"
                alt="Nous Art Logo"
                className="w-7 h-7 object-contain transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-title text-xl md:text-2xl tracking-[0.25em] text-ink-50 group-hover:text-gold-300 transition-colors">
                  NOUS
                </span>
                <span className="font-title text-xl md:text-2xl tracking-[0.25em] gold-text-gradient font-bold">
                  ART
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.35em] text-ink-400 font-sans mt-0.5">
                Contemporary Gallery Paris
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-9">
            {links.map((l) => {
              const isActive = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className="relative py-2 text-xs uppercase tracking-widest2 font-medium transition-colors duration-300 group"
                >
                  <span
                    className={
                      isActive
                        ? 'gold-text-gradient font-semibold'
                        : 'text-ink-300 group-hover:text-ink-50'
                    }
                  >
                    {l.label}
                  </span>
                  {/* Glowing active bar */}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gold-gradient rounded-full transition-all duration-300 ${
                      isActive ? 'w-full opacity-100 shadow-[0_0_8px_rgba(212,175,55,0.8)]' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-60'
                    }`}
                  />
                </Link>
              );
            })}

            <Link
              to="/gallery"
              className="ml-4 btn-outline-gold !py-2.5 !px-5 !text-[11px] rounded-sm group"
            >
              <span>Explore</span>
              <ArrowUpRight size={14} className="ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="md:hidden relative z-50 w-11 h-11 flex items-center justify-center rounded-lg bg-ink-900/80 border border-white/10 text-ink-100 hover:text-gold-300 hover:border-gold-500/40 transition-all focus:outline-none"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} className="text-gold-300" /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* Fullscreen Mobile Overlay Menu */}
      <div
        className={`fixed inset-0 z-50 md:hidden bg-ink-950/98 backdrop-blur-2xl transition-all duration-500 flex flex-col justify-between p-8 ${
          open
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-4'
        }`}
      >
        {/* Top Header inside Menu */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <img src="/img/logo.svg" alt="Nous Art Logo" className="w-8 h-8 object-contain" />
            <span className="font-title text-xl tracking-[0.25em] text-ink-50">
              NOUS <span className="gold-text-gradient">ART</span>
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-ink-900 border border-white/10 text-ink-100 hover:text-gold-300 hover:border-gold-500/50"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links Staggered */}
        <div className="my-auto py-8 space-y-6">
          {links.map((l, index) => {
            const isActive = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                style={{ transitionDelay: `${index * 75}ms` }}
                className={`group flex items-baseline justify-between py-2 border-b border-white/5 transition-all duration-500 ${
                  open ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                }`}
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-xs font-mono text-gold-500/70">{l.num}</span>
                  <span
                    className={`font-display text-3xl sm:text-4xl tracking-wider transition-colors ${
                      isActive ? 'gold-text-gradient font-medium' : 'text-ink-100 group-hover:text-gold-300'
                    }`}
                  >
                    {l.label}
                  </span>
                </div>
                <ArrowUpRight
                  size={20}
                  className={`transition-all duration-300 ${
                    isActive ? 'text-gold-300 opacity-100' : 'text-ink-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Footer Info inside Mobile Menu */}
        <div className="border-t border-white/10 pt-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-ink-300">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-gold-500" />
              <span>12 Rue Saint-Honoré, 75001 Paris</span>
            </div>
            <span className="text-gold-500">Tue – Sat 11:00 – 19:00</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-ink-300 hover:text-gold-300 hover:border-gold-500/50 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="mailto:hello@nousart.gallery"
                className="w-9 h-9 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-ink-300 hover:text-gold-300 hover:border-gold-500/50 transition-colors"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>

            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="btn-gold !py-2.5 !px-5 !text-[10px] rounded-sm"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
