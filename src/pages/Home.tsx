import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Compass,
  ShieldCheck,
  Search,
  Award,
  Flame,
  Star,
  Layers,
  Palette,
  Box,
  Camera,
  Stamp,
  Feather,
  CheckCircle2,
} from 'lucide-react';
import { supabase, type ArtPiece, type SiteSettings } from '@/lib/supabase';
import { ArtworkCard } from '@/components/ArtworkCard';
import { useStore } from '@/context/StoreContext';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const DEFAULT_HERO = {
  hero_media_url: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=2000',
  hero_media_type: 'image' as const,
};

// Magnific-Style Medium Showcase Data
const MEDIUM_SHOWCASES = [
  {
    id: 'paintings',
    title: 'Paintings',
    medium: 'Painting',
    count: '45+ Original Works',
    tagline: 'Gestural canvases, impasto textures, and expansive color field explorations.',
    image: 'https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?auto=compress&cs=tinysrgb&w=1600',
    featuredArtist: 'Elena Rostova',
    icon: Palette,
  },
  {
    id: 'sculptures',
    title: 'Sculptures',
    medium: 'Sculpture',
    count: '24+ Three-Dimensional Works',
    tagline: 'Patinated bronze castings, carved statuary marble, and spatial installations.',
    image: 'https://images.pexels.com/photos/3004909/pexels-photo-3004909.jpeg?auto=compress&cs=tinysrgb&w=1600',
    featuredArtist: 'Marcus Vance',
    icon: Box,
  },
  {
    id: 'photography',
    title: 'Photography',
    medium: 'Photography',
    count: '32+ Fine Art Prints',
    tagline: 'Architectural geometry, surreal portraiture, and large-format chromogenic prints.',
    image: 'https://images.pexels.com/photos/2123337/pexels-photo-2123337.jpeg?auto=compress&cs=tinysrgb&w=1600',
    featuredArtist: 'Claire Sterling',
    icon: Camera,
  },
  {
    id: 'editions',
    title: 'Limited Editions',
    medium: 'Edition',
    count: '18+ Signed Editions',
    tagline: 'Exclusive serigraphs, etchings, lithographs, and museum-grade archival prints.',
    image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=1600',
    featuredArtist: 'Henri Blanc',
    icon: Stamp,
  },
  {
    id: 'drawings',
    title: 'Drawings & Paper',
    medium: 'Drawing',
    count: '15+ Works on Paper',
    tagline: 'Raw charcoal studies, ink linework, and delicate mixed-media compositions.',
    image: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=1600',
    featuredArtist: 'Aria Thorne',
    icon: Feather,
  },
];

const ARTIST_PROFILES = [
  { title: 'Emerging Voices', icon: Star, desc: 'Fresh perspectives from visionary contemporary talent.', query: 'emerging' },
  { title: 'Established Masters', icon: Award, desc: 'Museum-represented artists with global acclaim.', query: 'master' },
  { title: 'Curator Favorites', icon: Flame, desc: 'Highly coveted works selected by NOUS ART advisors.', query: 'favorite' },
];

export default function Home() {
  const [featured, setFeatured] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState<SiteSettings | null>(null);
  const [heroSearch, setHeroSearch] = useState('');
  
  // Active selected medium state for Magnific-style showcase
  const [activeMediumIndex, setActiveMediumIndex] = useState(0);

  const navigate = useNavigate();
  const { openSearch } = useStore();

  useEffect(() => {
    supabase
      .from('art_pieces')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setFeatured(data ?? []);
        setLoading(false);
      });

    supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => setHero(data));
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/gallery?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      openSearch();
    }
  };

  const heroUrl = hero?.hero_media_url ?? DEFAULT_HERO.hero_media_url;
  const heroType = hero?.hero_media_type ?? DEFAULT_HERO.hero_media_type;

  const currentMedium = MEDIUM_SHOWCASES[activeMediumIndex];

  return (
    <div className="bg-ink-950 text-ink-50 overflow-hidden">
      {/* Full-Bleed Hero Section with Integrated Overlay Navigation */}
      <section className="relative h-screen min-h-[750px] flex items-center justify-center overflow-hidden">
        {/* Hero Background Media */}
        <div className="absolute inset-0 z-0">
          {heroType === 'video' && heroUrl ? (
            <video
              src={heroUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover scale-105 filter brightness-[0.55] contrast-[1.1] image-reveal"
            />
          ) : (
            <img
              src={heroUrl}
              alt="Gallery Interior"
              className="w-full h-full object-cover scale-105 filter brightness-[0.55] contrast-[1.1] image-reveal"
            />
          )}

          {/* Multi-Layered Atmosphere Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/85 via-ink-950/40 to-ink-950" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-ink-950/40 to-ink-950 opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent opacity-70 pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center pt-24 md:pt-32">
          {/* Curatorial Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ink-950/60 border border-gold-500/35 backdrop-blur-xl mb-6 fade-up shadow-2xl">
            <Sparkles size={13} className="text-gold-400" />
            <span className="text-[10px] uppercase tracking-[0.35em] gold-text-gradient font-semibold">
              Contemporary Art Gallery & Marketplace
            </span>
          </div>

          {/* Headline Statement */}
          <h1
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-ink-50 leading-[0.95] fade-up font-light text-balance"
            style={{ animationDelay: '0.2s' }}
          >
            Where vision <br />
            <em className="font-serif italic gold-text-gradient font-normal gold-text-glow">becomes</em> collection
          </h1>

          {/* Sub-headline */}
          <p
            className="mt-6 text-base md:text-lg text-ink-100 max-w-2xl mx-auto leading-relaxed font-light fade-up"
            style={{ animationDelay: '0.4s' }}
          >
            Discover and acquire curated original artworks from premier emerging and established masters worldwide.
          </p>

          {/* Integrated Search Bar (Hero Integration) */}
          <form
            onSubmit={handleHeroSearch}
            className="mt-9 max-w-xl mx-auto relative fade-up"
            style={{ animationDelay: '0.6s' }}
          >
            <div className="relative flex items-center">
              <Search size={20} className="absolute left-5 text-gold-400" />
              <input
                type="text"
                placeholder="Search for an artwork, artist, style..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                onClick={openSearch}
                className="w-full bg-ink-950/80 border border-gold-500/40 focus:border-gold-500 rounded-full py-4 pl-14 pr-32 text-sm text-ink-50 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-gold-500/30 shadow-2xl backdrop-blur-xl transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 btn-gold rounded-full !py-2.5 !px-5 !text-[11px] font-semibold shadow-lg"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Filter Term Chips */}
          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-ink-200 font-mono fade-up"
            style={{ animationDelay: '0.7s' }}
          >
            <span className="text-gold-400">Trending:</span>
            {['Abstract Paintings', 'Bronze Sculptures', 'Fine Art Prints'].map((term) => (
              <Link
                key={term}
                to={`/gallery?search=${encodeURIComponent(term)}`}
                className="hover:text-gold-300 underline underline-offset-4 decoration-gold-500/40 transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none">
          <span className="text-[9px] uppercase tracking-[0.4em] text-ink-300 font-sans">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gold-400 via-gold-500/50 to-transparent animate-pulse-subtle" />
        </div>
      </section>

      {/* Featured by NOUS ART (Product Grid) */}
      <section className="relative mx-auto max-w-7xl px-6 lg:px-10 py-24 md:py-32 z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="text-gold-400 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
              <span>Curatorial Selection</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-ink-50 font-light">
              Featured by NOUS ART
            </h2>
          </div>

          <Link
            to="/gallery"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest2 text-ink-200 hover:text-gold-300 transition-colors"
          >
            <span>Explore Full Collection</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={`aspect-[4/5] bg-ink-900/60 rounded-xl animate-pulse border border-white/5 sm:even:mt-12 lg:even:mt-0 lg:[&:nth-child(3n-1)]:mt-24 lg:[&:nth-child(3n)]:mt-12`} 
              />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 lg:pb-24"
          >
            {featured.map((piece, i) => (
              <div 
                key={piece.id} 
                className="sm:even:mt-16 lg:even:mt-0 lg:[&:nth-child(3n-1)]:mt-24 lg:[&:nth-child(3n)]:mt-12"
              >
                <ArtworkCard piece={piece} index={i} useAdvancedMotion={true} />
              </div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Interactive Magnific-Style "Browse Marketplace — Browse by Medium" Showcase Section */}
      <section className="relative mx-auto max-w-7xl px-6 lg:px-10 py-24 border-t border-white/10">
        {/* Section Header */}
        <div className="mb-14">
          <div className="text-gold-400 text-xs uppercase tracking-[0.35em] font-semibold mb-3">
            <span>Browse Marketplace</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink-50 font-light leading-tight">
            Explore art through its <span className="font-serif italic gold-text-gradient">mediums</span>.
          </h2>
          <p className="mt-4 text-ink-200 max-w-2xl font-light text-base leading-relaxed">
            Navigate our curated catalog by discipline. Click or hover on any category to preview featured works and curatorial details.
          </p>
        </div>

        {/* Magnific Asymmetric Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left / Main Dynamic Featured Banner Showcase */}
          <div className="lg:col-span-7 relative group rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-ink-900 min-h-[480px] lg:min-h-[560px] flex flex-col justify-end transition-all duration-700">
            {/* Background Image with Dynamic Fade Transition */}
            <img
              key={currentMedium.id}
              src={currentMedium.image}
              alt={currentMedium.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-[0.6] contrast-[1.05] fade-in"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-ink-950/30 to-ink-950 opacity-60" />

            {/* Top Badge Overlay */}
            <div className="absolute top-6 left-6 z-10 glass-panel-gold px-4 py-2 rounded-full border border-gold-500/30 backdrop-blur-md">
              <span className="text-xs uppercase tracking-widest text-gold-300 font-mono">
                Featured Roster • {currentMedium.featuredArtist}
              </span>
            </div>

            {/* Bottom Content Area */}
            <div className="relative z-10 p-8 sm:p-10 space-y-4">
              <div className="inline-block text-xs uppercase tracking-widest text-gold-400 font-mono bg-ink-950/80 px-3 py-1 rounded border border-white/10">
                {currentMedium.count}
              </div>

              <h3 className="font-display text-4xl sm:text-5xl text-ink-50 font-light">
                {currentMedium.title}
              </h3>

              <p className="text-sm text-ink-100 max-w-lg font-light leading-relaxed">
                {currentMedium.tagline}
              </p>

              <div className="pt-4">
                <Link
                  to={`/gallery?medium=${currentMedium.medium}`}
                  className="btn-gold rounded-xl group/btn inline-flex items-center gap-3 !py-3.5 !px-6 text-xs uppercase font-semibold shadow-xl"
                >
                  <span>Discover {currentMedium.title}</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right / Interactive Vertical Cards List (Tabs) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3.5">
            {MEDIUM_SHOWCASES.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === activeMediumIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMediumIndex(index)}
                  onMouseEnter={() => setActiveMediumIndex(index)}
                  className={`w-full text-left p-5 sm:p-6 rounded-2xl border transition-all duration-500 relative overflow-hidden flex items-center justify-between group ${
                    isActive
                      ? 'bg-ink-900 border-gold-500/60 shadow-xl shadow-gold-500/10 translate-x-1'
                      : 'glass-panel border-white/10 hover:border-gold-500/30 hover:bg-ink-900/60'
                  }`}
                >
                  {/* Subtle Active Left Indicator Bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gold-gradient transition-all duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                    }`}
                  />

                  <div className="flex items-center gap-4">
                    <div
                      className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-colors shrink-0 ${
                        isActive
                          ? 'bg-gold-500/20 border-gold-500/50 text-gold-300 scale-105'
                          : 'bg-ink-950 border-white/10 text-ink-200 group-hover:text-gold-400 group-hover:border-gold-500/30'
                      }`}
                    >
                      <Icon size={20} />
                    </div>

                    <div>
                      <h4
                        className={`font-display text-2xl transition-colors font-medium ${
                          isActive ? 'gold-text-gradient' : 'text-ink-50 group-hover:text-gold-300'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <p className="text-xs text-ink-300 font-mono mt-0.5">{item.count}</p>
                    </div>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-gold-500 text-ink-950 border-gold-400 scale-105'
                        : 'border-white/10 text-ink-300 opacity-0 group-hover:opacity-100 group-hover:text-gold-300'
                    }`}
                  >
                    {isActive ? <CheckCircle2 size={16} /> : <ArrowRight size={14} />}
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* Artist Profile Blocks */}
      <section className="relative mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTIST_PROFILES.map((prof) => {
            const Icon = prof.icon;
            return (
              <Link
                key={prof.title}
                to="/gallery"
                className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-gold-500/40 transition-all group duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 mb-6 group-hover:scale-110 transition-transform">
                  <Icon size={22} />
                </div>
                <h3 className="font-display text-2xl text-ink-50 group-hover:text-gold-300 transition-colors font-medium">
                  {prof.title}
                </h3>
                <p className="text-xs text-ink-200 leading-relaxed font-light mt-2">
                  {prof.desc}
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-widest gold-text-gradient font-medium">
                  <span>Explore Section</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Editorial Spotlight */}
      <section className="relative mx-auto max-w-7xl px-6 lg:px-10 py-24 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?q=80&w=1600&auto=format&fit=crop"
                alt="Editorial Exhibition"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover bg-ink-900 transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=1600&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-ink-950/60 via-transparent to-transparent" />
            </div>

            <div className="hidden sm:block absolute -bottom-6 -right-6 glass-panel p-6 rounded-xl max-w-xs border border-white/10 shadow-2xl">
              <div className="text-gold-400 text-xs font-semibold uppercase tracking-widest mb-1">
                <span>Authenticity Guaranteed</span>
              </div>
              <p className="text-xs text-ink-100 leading-relaxed font-light">
                Every acquisition includes a signed certificate of authenticity and provenance history.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-gold-400 font-semibold">
              Editorial Spotlight
            </p>
            <h2 className="font-display text-4xl sm:text-5xl text-ink-50 leading-[1.15] font-light text-balance">
              Art is not decoration.<br />
              <em className="font-serif italic gold-text-gradient font-normal">It is a way of seeing.</em>
            </h2>
            <p className="text-ink-100 leading-relaxed font-light text-base">
              NOUS ART curates solo and group exhibitions, uniting classical techniques with radical contemporary expressions.
            </p>
            <div className="pt-4">
              <Link to="/about" className="btn-outline-gold rounded-sm group">
                <span>Discover Gallery History</span>
                <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
