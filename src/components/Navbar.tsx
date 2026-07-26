import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  ArrowUpRight,
  Sparkles,
  ChevronDown,
  Instagram,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react';
import { useStore, type Currency } from '@/context/StoreContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [currencyMenu, setCurrencyMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    wishlist,
    cartCount,
    openCart,
    openWishlist,
    openSearch,
    currency,
    setCurrency,
    searchQuery,
    setSearchQuery,
  } = useStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 25);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setCurrencyMenu(false);
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/gallery?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      openSearch();
    }
  };

  const categories = [
    { label: 'All Artworks', to: '/gallery' },
    { label: 'Paintings', to: '/gallery?medium=Painting' },
    { label: 'Sculptures', to: '/gallery?medium=Sculpture' },
    { label: 'Photography', to: '/gallery?medium=Photography' },
    { label: 'Limited Editions', to: '/gallery?medium=Edition' },
    { label: 'Drawings', to: '/gallery?medium=Drawing' },
    { label: 'Artists', to: '/about' },
    { label: 'New Arrivals', to: '/gallery?sort=newest' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-500">
        {/* Main Upper Header Bar */}
        <div
          className={`transition-all duration-500 ${
            scrolled
              ? 'bg-ink-950/95 backdrop-blur-2xl py-3 border-b border-white/10 shadow-2xl'
              : 'bg-gradient-to-b from-ink-950 via-ink-950/80 to-ink-950/40 py-4 border-b border-white/5'
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4">
            {/* Logo Brand */}
            <Link to="/" className="group flex items-center gap-3 shrink-0 focus:outline-none">
              <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-ink-900 border border-gold-500/40 group-hover:border-gold-500 transition-all duration-500 shadow-md group-hover:shadow-[0_0_20px_rgba(212,173,118,0.4)] overflow-hidden shrink-0">
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

            {/* Central Artsper Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-4">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-400" />
                <input
                  type="text"
                  placeholder="Search for an artwork, artist, style..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={openSearch}
                  className="w-full bg-ink-900/90 border border-gold-500/30 focus:border-gold-500 rounded-full py-2.5 pl-11 pr-10 text-xs text-ink-50 placeholder-ink-400 focus:outline-none focus:ring-1 focus:ring-gold-500/40 transition-all shadow-inner font-light"
                />
                <button
                  type="button"
                  onClick={openSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-gold-300 p-1"
                  aria-label="Open search modal"
                >
                  <Sparkles size={14} className="text-gold-400" />
                </button>
              </form>
            </div>

            {/* Right Action Icons & Controls */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Currency Selector (USD / EUR) */}
              <div className="relative">
                <button
                  onClick={() => setCurrencyMenu(!currencyMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink-900 border border-white/10 text-xs font-mono text-ink-200 hover:border-gold-500/40 hover:text-gold-300 transition-colors"
                >
                  <span className="gold-text-gradient font-bold">{currency === 'USD' ? '$ USD' : '€ EUR'}</span>
                  <ChevronDown size={12} className="text-ink-400" />
                </button>

                {currencyMenu && (
                  <div className="absolute right-0 mt-2 w-28 rounded-xl bg-ink-900 border border-white/10 shadow-2xl p-1.5 z-50 fade-up text-xs font-mono">
                    <button
                      onClick={() => {
                        setCurrency('USD');
                        setCurrencyMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                        currency === 'USD' ? 'bg-gold-500/10 text-gold-300 font-semibold' : 'text-ink-300 hover:bg-white/5'
                      }`}
                    >
                      <span>USD ($)</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrency('EUR');
                        setCurrencyMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                        currency === 'EUR' ? 'bg-gold-500/10 text-gold-300 font-semibold' : 'text-ink-300 hover:bg-white/5'
                      }`}
                    >
                      <span>EUR (€)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Instant Search Icon Button (Mobile / Tablet) */}
              <button
                onClick={openSearch}
                className="lg:hidden w-9 h-9 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-ink-200 hover:text-gold-300 hover:border-gold-500/40 transition-colors"
                aria-label="Search catalogue"
              >
                <Search size={16} />
              </button>

              {/* Wishlist Button with Counter */}
              <button
                onClick={openWishlist}
                className="relative w-9 h-9 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-ink-200 hover:text-gold-300 hover:border-gold-500/40 transition-colors"
                aria-label="Saved Wishlist"
              >
                <Heart size={16} className={wishlist.length > 0 ? 'text-gold-400 fill-gold-400' : ''} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-500 text-ink-950 font-bold text-[9px] flex items-center justify-center shadow-md">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping Cart Button with Counter */}
              <button
                onClick={openCart}
                className="relative w-9 h-9 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-ink-200 hover:text-gold-300 hover:border-gold-500/40 transition-colors"
                aria-label="Collector Bag"
              >
                <ShoppingBag size={16} className={cartCount > 0 ? 'text-gold-400' : ''} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-500 text-ink-950 font-bold text-[9px] flex items-center justify-center shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Account / Admin Portal */}
              <Link
                to="/admin"
                className="hidden sm:flex w-9 h-9 rounded-full bg-ink-900 border border-white/10 items-center justify-center text-ink-200 hover:text-gold-300 hover:border-gold-500/40 transition-colors"
                aria-label="Admin Portal"
              >
                <User size={16} />
              </Link>

              {/* Mobile Hamburger Toggle Button */}
              <button
                className="md:hidden relative z-50 w-9 h-9 flex items-center justify-center rounded-xl bg-ink-900 border border-white/10 text-ink-100 hover:text-gold-300 hover:border-gold-500/50 transition-all focus:outline-none"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
              >
                <div className="w-4 h-3.5 relative flex flex-col justify-between items-center">
                  <span
                    className={`w-full h-[2px] bg-gold-400 rounded-full transition-all duration-300 ${
                      open ? 'rotate-45 translate-y-[6px]' : ''
                    }`}
                  />
                  <span
                    className={`w-full h-[2px] bg-ink-200 rounded-full transition-all duration-300 ${
                      open ? 'opacity-0' : ''
                    }`}
                  />
                  <span
                    className={`w-full h-[2px] bg-gold-400 rounded-full transition-all duration-300 ${
                      open ? '-rotate-45 -translate-y-[6px]' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Navigation Horizontal Bar (Artsper Category Navigation) */}
        <div className="hidden md:block bg-ink-950/90 backdrop-blur-md border-b border-white/10 py-2.5">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between text-xs font-medium uppercase tracking-widest text-ink-300 overflow-x-auto no-scrollbar gap-8">
            <div className="flex items-center gap-7 shrink-0">
              {categories.map((cat) => {
                const isActive =
                  location.pathname + location.search === cat.to ||
                  (cat.to === '/gallery' && location.pathname === '/gallery' && !location.search);
                return (
                  <Link
                    key={cat.label}
                    to={cat.to}
                    className={`hover:text-gold-300 transition-colors py-1 relative whitespace-nowrap ${
                      isActive ? 'gold-text-gradient font-semibold' : ''
                    }`}
                  >
                    {cat.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-gradient rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="shrink-0 flex items-center gap-2 text-[10px] text-gold-400 font-mono">
              <Sparkles size={12} />
              <span>Curated Fine Art Marketplace</span>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-30 md:hidden bg-ink-950/98 backdrop-blur-3xl transition-all duration-500 flex flex-col justify-between p-6 pt-32 ${
          open
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-full'
        }`}
      >
        <div className="space-y-4 my-auto">
          <div className="text-xs uppercase tracking-widest text-gold-400 font-semibold mb-2">
            Categories & Navigation
          </div>
          {categories.map((c) => (
            <Link
              key={c.label}
              to={c.to}
              onClick={() => setOpen(false)}
              className="block font-display text-2xl text-ink-100 hover:text-gold-300 transition-colors border-b border-white/5 pb-2"
            >
              {c.label}
            </Link>
          ))}
        </div>

        <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-3 text-xs text-ink-300">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-gold-500 shrink-0" />
            <span>2719 Tropical Point, Fort Worth, TX, USA</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-gold-500 shrink-0" />
            <span>Tue – Sat 11:00 – 19:00</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-ink-300 hover:text-gold-300">
                <Instagram size={16} />
              </a>
              <a href="mailto:hello@nousart.gallery" className="text-ink-300 hover:text-gold-300">
                <Mail size={16} />
              </a>
            </div>
            <Link to="/contact" onClick={() => setOpen(false)} className="btn-gold !py-2 !px-4 !text-[10px] rounded-sm">
              Contact Gallery
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
