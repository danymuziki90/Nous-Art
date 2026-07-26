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
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [currencyMenu, setCurrencyMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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
    setActiveDropdown(null);
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

  // Exactly 5 Primary Navigation Items with Sub-menu Groups
  const primaryNavItems = [
    {
      id: 'collection',
      label: 'Collection',
      to: '/gallery',
      icon: Layers,
      subItems: [
        { label: 'All Artworks', to: '/gallery' },
        { label: 'Paintings', to: '/gallery?medium=Painting' },
        { label: 'Sculptures', to: '/gallery?medium=Sculpture' },
        { label: 'Photography', to: '/gallery?medium=Photography' },
        { label: 'Limited Editions', to: '/gallery?medium=Edition' },
        { label: 'Drawings', to: '/gallery?medium=Drawing' },
        { label: 'New Arrivals', to: '/gallery?sort=newest' },
      ],
    },
    {
      id: 'artists',
      label: 'Artists',
      to: '/about',
      icon: Award,
      subItems: [
        { label: 'Artist Roster', to: '/about' },
        { label: 'Emerging Voices', to: '/gallery?search=emerging' },
        { label: 'Established Masters', to: '/gallery?search=master' },
      ],
    },
    {
      id: 'exhibitions',
      label: 'Exhibitions',
      to: '/about',
      icon: BookOpen,
      subItems: [
        { label: 'Current Shows', to: '/about' },
        { label: 'Editorial & News', to: '/about' },
      ],
    },
    {
      id: 'about',
      label: 'About',
      to: '/about',
      icon: Sparkles,
      subItems: [
        { label: 'Our House & Philosophy', to: '/about' },
        { label: 'Advisory Concierge', to: '/contact' },
      ],
    },
    {
      id: 'contact',
      label: 'Contact',
      to: '/contact',
      icon: MapPin,
      subItems: [
        { label: 'Visit Gallery', to: '/contact' },
        { label: 'Request Consultation', to: '/contact' },
      ],
    },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-500">
        {/* Main Upper Header Bar */}
        <div
          className={`transition-all duration-500 ${
            scrolled
              ? 'bg-ink-950/95 backdrop-blur-2xl py-3 border-b border-white/10 shadow-2xl'
              : 'bg-gradient-to-b from-ink-950 via-ink-950/85 to-ink-950/40 py-4 border-b border-white/5'
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

            {/* Central Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-4">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-400" />
                <input
                  type="text"
                  placeholder="Search for an artwork, artist, style..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={openSearch}
                  className="w-full bg-ink-900/90 border border-gold-500/30 focus:border-gold-500 rounded-full py-2 pl-10 pr-10 text-xs text-ink-50 placeholder-ink-400 focus:outline-none focus:ring-1 focus:ring-gold-500/40 transition-all shadow-inner font-light"
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

            {/* Right Action Controls */}
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
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        currency === 'USD' ? 'bg-gold-500/10 text-gold-300 font-semibold' : 'text-ink-300 hover:bg-white/5'
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
                        currency === 'EUR' ? 'bg-gold-500/10 text-gold-300 font-semibold' : 'text-ink-300 hover:bg-white/5'
                      }`}
                    >
                      EUR (€)
                    </button>
                  </div>
                )}
              </div>

              {/* Instant Search Button (Mobile / Tablet) */}
              <button
                onClick={openSearch}
                className="lg:hidden w-9 h-9 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-ink-200 hover:text-gold-300 hover:border-gold-500/40 transition-colors"
                aria-label="Search catalogue"
              >
                <Search size={16} />
              </button>

              {/* Wishlist Button */}
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

              {/* Shopping Cart Button */}
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

              {/* Account / Admin Portal */}
              <Link
                to="/admin"
                className="hidden sm:flex w-9 h-9 rounded-full bg-ink-900 border border-white/10 items-center justify-center text-ink-200 hover:text-gold-300 hover:border-gold-500/40 transition-colors"
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

        {/* Simplified 5 Primary Items Desktop Navigation Bar */}
        <div className="hidden md:block bg-ink-950/90 backdrop-blur-md border-b border-white/10 py-2.5">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between text-xs font-medium uppercase tracking-widest text-ink-300">
            <div className="flex items-center gap-9">
              {primaryNavItems.map((item) => {
                const isActive = location.pathname.startsWith(item.to);
                const isHovered = activeDropdown === item.id;
                return (
                  <div
                    key={item.id}
                    className="relative group"
                    onMouseEnter={() => setActiveDropdown(item.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      to={item.to}
                      className={`py-1 inline-flex items-center gap-1.5 hover:text-gold-300 transition-colors relative ${
                        isActive ? 'gold-text-gradient font-semibold' : ''
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={13}
                        className={`text-ink-400 group-hover:text-gold-400 transition-transform duration-300 ${
                          isHovered ? 'rotate-180 text-gold-300' : ''
                        }`}
                      />
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-gradient rounded-full" />
                      )}
                    </Link>

                    {/* Luxury Glass Dropdown Menu */}
                    {isHovered && (
                      <div className="absolute left-0 mt-2 w-56 rounded-2xl glass-panel p-2 shadow-2xl border border-gold-500/30 z-50 fade-up">
                        <div className="p-2 border-b border-white/5 mb-1 flex items-center gap-2 text-[10px] text-gold-400 uppercase tracking-widest font-mono">
                          <item.icon size={12} />
                          <span>{item.label} Menu</span>
                        </div>
                        {item.subItems.map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.to}
                            className="group/sub flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-ink-200 hover:text-gold-300 hover:bg-gold-500/10 transition-all font-normal"
                          >
                            <span>{sub.label}</span>
                            <ArrowUpRight size={13} className="opacity-0 group-hover/sub:opacity-100 transition-opacity text-gold-400" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-[10px] text-gold-400 font-mono">
              <Sparkles size={12} />
              <span>Contemporary Art Gallery • Est. 2014</span>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen Responsive Mobile Menu */}
      <div
        className={`fixed inset-0 z-30 md:hidden bg-ink-950/98 backdrop-blur-3xl transition-all duration-500 flex flex-col justify-between p-6 pt-32 ${
          open ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-full'
        }`}
      >
        <div className="space-y-6 my-auto overflow-y-auto max-h-[65vh] pr-1">
          {primaryNavItems.map((item) => (
            <div key={item.id} className="border-b border-white/10 pb-4 space-y-2">
              <Link
                to={item.to}
                onClick={() => setOpen(false)}
                className="font-display text-3xl text-ink-50 gold-text-gradient font-light block"
              >
                {item.label}
              </Link>
              <div className="pl-3 space-y-1.5 pt-1">
                {item.subItems.map((sub) => (
                  <Link
                    key={sub.label}
                    to={sub.to}
                    onClick={() => setOpen(false)}
                    className="block text-xs text-ink-300 hover:text-gold-300 font-mono"
                  >
                    → {sub.label}
                  </Link>
                ))}
              </div>
            </div>
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
