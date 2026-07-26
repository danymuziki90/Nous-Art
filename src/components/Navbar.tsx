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
  X,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [currencyMenu, setCurrencyMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchExpanded, setSearchExpanded] = useState(false);

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
    setActiveDropdown(null);
    setSearchExpanded(false);
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
        { label: 'Curatorial Editorial', to: '/about' },
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
                <span className="text-[9px] uppercase tracking-[0.35em] text-ink-400 font-sans mt-0.5 font-medium">
                  Contemporary Gallery
                </span>
              </div>
            </Link>

            {/* COLUMN 2: Centered Airy Main Navigation (Center Grid) */}
            <nav className="hidden md:flex items-center justify-center gap-8 lg:gap-10">
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
                      className="relative py-2 text-xs uppercase tracking-[0.18em] font-medium transition-colors duration-300 flex items-center gap-1 group/link"
                    >
                      <span
                        className={
                          isActive
                            ? 'gold-text-gradient font-semibold'
                            : 'text-ink-300 group-hover/link:text-ink-50'
                        }
                      >
                        {item.label}
                      </span>
                      <ChevronDown
                        size={12}
                        className={`text-ink-400 group-hover/link:text-gold-300 transition-transform duration-300 ${
                          isHovered ? 'rotate-180 text-gold-300' : ''
                        }`}
                      />

                      {/* Animated Gold Underline Indicator */}
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gold-gradient rounded-full transition-all duration-300 ${
                          isActive
                            ? 'w-full opacity-100 shadow-[0_0_8px_rgba(212,173,118,0.8)]'
                            : 'w-0 opacity-0 group-hover/link:w-full group-hover/link:opacity-70'
                        }`}
                      />
                    </Link>

                    {/* Luxury Glass Submenu Dropdown */}
                    {isHovered && (
                      <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 rounded-2xl glass-panel p-2 shadow-2xl border border-gold-500/30 z-50 fade-up">
                        <div className="p-2 border-b border-white/5 mb-1 flex items-center gap-2 text-[10px] text-gold-400 uppercase tracking-widest font-mono">
                          <item.icon size={12} />
                          <span>{item.label}</span>
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
                      className="w-48 sm:w-64 bg-ink-900/90 border border-gold-500/40 rounded-full py-1.5 pl-9 pr-8 text-xs text-ink-50 placeholder-ink-400 focus:outline-none focus:ring-1 focus:ring-gold-500/40 transition-all font-light shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setSearchExpanded(false)}
                      className="absolute right-2 text-ink-400 hover:text-gold-300 p-1"
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
                    className="w-9 h-9 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-ink-200 hover:text-gold-300 hover:border-gold-500/40 transition-all shadow-md group"
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink-900 border border-white/10 text-xs font-mono text-ink-200 hover:border-gold-500/40 hover:text-gold-300 transition-colors shadow-md"
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

              {/* Wishlist Button */}
              <button
                onClick={openWishlist}
                className="relative w-9 h-9 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-ink-200 hover:text-gold-300 hover:border-gold-500/40 transition-colors shadow-md"
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
                className="relative w-9 h-9 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-ink-200 hover:text-gold-300 hover:border-gold-500/40 transition-colors shadow-md"
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
                className="hidden sm:flex w-9 h-9 rounded-full bg-ink-900 border border-white/10 items-center justify-center text-ink-200 hover:text-gold-300 hover:border-gold-500/40 transition-colors shadow-md"
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
