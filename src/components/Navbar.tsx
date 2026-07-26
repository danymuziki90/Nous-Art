import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Sparkles,
  ChevronDown,
  Instagram,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  Layers,
  Award,
  BookOpen,
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [currencyMenu, setCurrencyMenu] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);

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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setCurrencyMenu(false);
    setSearchExpanded(false);
    setShowMegaMenu(false);
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
      setSearchExpanded(false);
    } else {
      openSearch();
    }
  };

  // 5 Primary Navigation Items
  const primaryNavItems = [
    {
      id: 'home',
      label: 'Home',
      to: '/',
    },
    {
      id: 'about',
      label: 'About',
      to: '/about',
    },
    {
      id: 'collection',
      label: 'Collection',
      to: '/gallery',
    },
    {
      id: 'contact',
      label: 'Contact',
      to: '/contact',
    },
  ];

  return (
    <>
      {/* Sticky Glassmorphism Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-500">
        <div
          className={`transition-all duration-500 ${
            scrolled
              ? 'bg-ink-950/90 backdrop-blur-xl py-3.5 border-b border-white/10 shadow-2xl shadow-black/80'
              : 'bg-gradient-to-b from-ink-950/90 via-ink-950/50 to-transparent py-5 border-b border-white/5'
          }`}
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between gap-6">
            
            {/* COLUMN 1: Logo Brand (Left) */}
            <Link to="/" className="group flex items-center gap-3.5 shrink-0 focus:outline-none">
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
                <span className="text-[9px] uppercase tracking-[0.35em] text-ink-300 font-sans mt-0.5 font-medium">
                  Contemporary Gallery
                </span>
              </div>
            </Link>

            {/* COLUMN 2: Centered Airy Main Navigation (Center Grid) */}
            <nav className="hidden md:flex items-center justify-center p-1.5 gap-1 rounded-full border border-white/10 bg-ink-950/60 backdrop-blur-md shadow-2xl">
              {primaryNavItems.map((item) => {
                const isActive = item.to === '/' 
                  ? location.pathname === '/' 
                  : location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.id}
                    to={item.to}
                    className={`relative px-5 lg:px-7 py-2.5 text-[10px] md:text-xs uppercase tracking-[0.18em] font-medium transition-all duration-300 flex items-center justify-center rounded-full ${
                      isActive
                        ? 'bg-gold-500/15 text-gold-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-gold-500/20'
                        : 'text-ink-200 hover:text-ink-50 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span className={isActive ? 'font-semibold' : ''}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* COLUMN 3: Right Secondary Actions & Sleek Expandable Search (Right) */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              
              {/* Sleek Expandable Search Input / Button */}
              <div className="relative flex items-center">
                {searchExpanded ? (
                  <form onSubmit={handleSearchSubmit} className="relative flex items-center fade-up">
                    <Search size={16} className="absolute left-3.5 text-gold-400 pointer-events-none" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search works, artists..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-48 sm:w-64 bg-ink-900/90 border border-gold-500/40 rounded-full py-1.5 pl-9 pr-8 text-xs text-ink-50 placeholder-ink-300 focus:outline-none focus:ring-1 focus:ring-gold-500/40 transition-all font-light shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setSearchExpanded(false)}
                      className="absolute right-2 text-ink-300 hover:text-gold-300 p-1"
                    >
                      <X size={14} />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => {
                      setSearchExpanded(true);
                      openSearch();
                    }}
                    className="w-9 h-9 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-ink-100 hover:text-gold-300 hover:border-gold-500/40 transition-all shadow-md group"
                    aria-label="Expand Search"
                  >
                    <Search size={16} className="group-hover:scale-110 transition-transform" />
                  </button>
                )}
              </div>

              {/* Currency Selector (USD / EUR) */}
              <div className="relative">
                <button
                  onClick={() => setCurrencyMenu(!currencyMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink-900 border border-white/10 text-xs font-mono text-ink-100 hover:border-gold-500/40 hover:text-gold-300 transition-colors shadow-md"
                >
                  <span className="gold-text-gradient font-bold">{currency === 'USD' ? '$ USD' : '€ EUR'}</span>
                  <ChevronDown size={12} className="text-ink-300" />
                </button>

                {currencyMenu && (
                  <div className="absolute right-0 mt-2 w-28 rounded-xl bg-ink-900 border border-white/10 shadow-2xl p-1.5 z-50 fade-up text-xs font-mono">
                    <button
                      onClick={() => {
                        setCurrency('USD');
                        setCurrencyMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        currency === 'USD' ? 'bg-gold-500/10 text-gold-300 font-semibold' : 'text-ink-200 hover:bg-white/5'
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      onClick={() => {
                        setCurrency('EUR');
                        setCurrencyMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        currency === 'EUR' ? 'bg-gold-500/10 text-gold-300 font-semibold' : 'text-ink-200 hover:bg-white/5'
                      }`}
                    >
                      EUR (€)
                    </button>
                  </div>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={openWishlist}
                className="relative w-9 h-9 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-ink-100 hover:text-gold-300 hover:border-gold-500/40 transition-colors shadow-md"
                aria-label="Saved Wishlist"
              >
                <Heart size={16} className={wishlist.length > 0 ? 'text-gold-400 fill-gold-400' : ''} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-500 text-ink-950 font-bold text-[9px] flex items-center justify-center shadow-md">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping Cart Button */}
              <button
                onClick={openCart}
                className="relative w-9 h-9 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-ink-100 hover:text-gold-300 hover:border-gold-500/40 transition-colors shadow-md"
                aria-label="Collector Bag"
              >
                <ShoppingBag size={16} className={cartCount > 0 ? 'text-gold-400' : ''} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-500 text-ink-950 font-bold text-[9px] flex items-center justify-center shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Account / Admin Portal */}
              <Link
                to="/admin"
                className="hidden sm:flex w-9 h-9 rounded-full bg-ink-900 border border-white/10 items-center justify-center text-ink-100 hover:text-gold-300 hover:border-gold-500/40 transition-colors shadow-md"
                aria-label="Admin Portal"
              >
                <User size={16} />
              </Link>

              {/* Mobile Hamburger Button */}
              <button
                className="md:hidden relative z-50 w-9 h-9 flex items-center justify-center rounded-xl bg-ink-900 border border-white/10 text-ink-100 hover:text-gold-300 hover:border-gold-500/50 transition-all focus:outline-none"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
              >
                <div className="w-4 h-3.5 relative flex flex-col justify-between items-center">
                  <span className={`w-full h-[2px] bg-gold-400 rounded-full transition-all duration-300 ${open ? 'rotate-45 translate-y-[6px]' : ''}`} />
                  <span className={`w-full h-[2px] bg-ink-200 rounded-full transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
                  <span className={`w-full h-[2px] bg-gold-400 rounded-full transition-all duration-300 ${open ? '-rotate-45 -translate-y-[6px]' : ''}`} />
                </div>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Curtain Menu */}
      <div
        className={`fixed inset-0 z-30 md:hidden bg-ink-950/98 backdrop-blur-3xl transition-all duration-500 flex flex-col justify-between p-6 pt-32 ${
          open ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-full'
        }`}
      >
        <div className="space-y-6 my-auto overflow-y-auto max-h-[65vh] pr-1">
          {primaryNavItems.map((item) => (
            <div key={item.id} className="border-b border-white/10 pb-4">
              <Link
                to={item.to}
                onClick={() => setOpen(false)}
                className="font-display text-3xl text-ink-50 gold-text-gradient font-light block"
              >
                {item.label}
              </Link>
            </div>
          ))}
        </div>

        <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-3 text-xs text-ink-200">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-gold-500 shrink-0" />
            <span>2719 Tropical Point, Fort Worth, TX, USA</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-gold-500 shrink-0" />
            <span>Tuesday – Saturday: 11:00 AM – 7:00 PM</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-ink-200 hover:text-gold-300">
                <Instagram size={16} />
              </a>
              <a href="mailto:hello@nousart.gallery" className="text-ink-200 hover:text-gold-300">
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
