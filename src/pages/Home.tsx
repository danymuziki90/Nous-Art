import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
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
import { useCMS } from '@/context/CMSContext';
import { ArtworkCard } from '@/components/ArtworkCard';
import { MediumCard } from '@/components/MediumCard';
import { useStore } from '@/context/StoreContext';
import { SEO } from '@/components/SEO';

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
  const { artworks, siteSettings: hero } = useCMS();
  const featured = artworks.filter((p) => p.featured).slice(0, 6);
  const [heroSearch, setHeroSearch] = useState('');

  const navigate = useNavigate();
  const { openSearch } = useStore();

  // 3D Hero Parallax Mouse Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mouseXSpring = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const mouseYSpring = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Scroll Parallax
  const { scrollY } = useScroll();
  const scrollBgY = useTransform(scrollY, [0, 1000], ["0%", "20%"]); 
  const scrollBgScale = useTransform(scrollY, [0, 1000], [1, 1.15]);
  const scrollOpacity = useTransform(scrollY, [0, 600], [1, 0.2]);

  // Map mouse to rotations (Perspective container)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

  // Map mouse to translations (Background Layer - Moves opposite)
  const bgX = useTransform(mouseXSpring, [-0.5, 0.5], ["2%", "-2%"]);
  const bgY = useTransform(mouseYSpring, [-0.5, 0.5], ["2%", "-2%"]);

  // Map mouse to translations (Foreground Layer - Moves with cursor)
  const fgX = useTransform(mouseXSpring, [-0.5, 0.5], ["-20px", "20px"]);
  const fgY = useTransform(mouseYSpring, [-0.5, 0.5], ["-20px", "20px"]);

  // Atmospheric Particles (Moves wildly opposite)
  const particleX = useTransform(mouseXSpring, [-0.5, 0.5], ["5%", "-5%"]);
  const particleY = useTransform(mouseYSpring, [-0.5, 0.5], ["5%", "-5%"]);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x / width - 0.5);
    mouseY.set(y / height - 0.5);
  };

  const handleHeroMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

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

  return (
    <div className="bg-ink-950 text-ink-50 overflow-hidden">
      <SEO 
        title="NOUS ART — Contemporary Art Gallery"
        description="A curated gallery of contemporary art. Discover, collect, and explore exceptional works by emerging and established masters."
        url="/"
      />
      {/* Full-Bleed 3D Hero Section */}
      <section 
        className="relative h-screen min-h-[750px] flex items-center justify-center overflow-hidden perspective-[1500px]"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        <motion.div 
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="absolute inset-0 w-full h-full flex items-center justify-center"
        >
          {/* Scroll Parallax Wrapper */}
          <motion.div
            style={{ y: scrollBgY, scale: scrollBgScale, opacity: scrollOpacity }}
            className="absolute inset-[-20%] z-0"
          >
            {/* Layer 0: Deep Hero Background Media */}
            <motion.div 
              style={{ x: bgX, y: bgY, translateZ: "-50px" }}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1.05, opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute inset-[-5%] z-0"
            >
            {heroType === 'video' && heroUrl ? (
              <video
                src={heroUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover filter brightness-[0.55] contrast-[1.1]"
              />
            ) : (
              <img
                src={heroUrl}
                alt="Gallery Interior"
                className="w-full h-full object-cover filter brightness-[0.55] contrast-[1.1]"
              />
            )}

            {/* Multi-Layered Atmosphere Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-ink-950/90 via-ink-950/40 to-ink-950" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-ink-950/40 to-ink-950 opacity-80" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-500/15 via-transparent to-transparent opacity-70 pointer-events-none" />
          </motion.div>
          </motion.div>

          {/* Layer 1: Atmospheric Floating Particles */}
          <motion.div 
            style={{ x: particleX, y: particleY, translateZ: "20px" }}
            className="absolute inset-0 z-1 pointer-events-none overflow-hidden mix-blend-screen"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: Math.random() * 100 }}
                animate={{ opacity: [0, 0.5, 0], y: [Math.random() * 100, -100] }}
                transition={{ duration: 5 + Math.random() * 10, repeat: Infinity, delay: Math.random() * 5 }}
                className="absolute rounded-full bg-gold-400 blur-[2px]"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 4 + 1}px`,
                  height: `${Math.random() * 4 + 1}px`,
                }}
              />
            ))}
          </motion.div>

          {/* Layer 2: Hero Foreground Content */}
          <motion.div 
            style={{ x: fgX, y: fgY, translateZ: "60px" }}
            className="relative z-10 mx-auto max-w-5xl px-6 text-center pt-24 md:pt-24"
          >
            {/* Curatorial Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ink-950/60 border border-gold-500/35 backdrop-blur-xl mb-6 shadow-2xl"
            >
              <Sparkles size={13} className="text-gold-400" />
              <span className="text-[10px] uppercase tracking-[0.35em] gold-text-gradient font-semibold">
                Contemporary Art Gallery & Marketplace
              </span>
            </motion.div>

            {/* Headline Statement */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-ink-50 leading-[0.95] font-light text-balance drop-shadow-2xl"
            >
              Where vision <br />
              <em className="font-serif italic gold-text-gradient font-normal gold-text-glow">becomes</em> collection
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="mt-6 text-base md:text-lg text-ink-100 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-lg"
            >
              Discover and acquire curated original artworks from premier emerging and established masters worldwide.
            </motion.p>

            {/* Integrated Search Bar (Hero Integration) */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
              onSubmit={handleHeroSearch}
              className="mt-9 max-w-xl mx-auto relative"
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
                  className="absolute right-2 btn-gold rounded-full !py-2.5 !px-5 !text-[11px] font-semibold shadow-lg hover:scale-105 transition-transform"
                >
                  Search
                </button>
              </div>
            </motion.form>

            {/* Quick Filter Term Chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.6 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-ink-200 font-mono"
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
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none">
          <span className="text-[9px] uppercase tracking-[0.4em] text-ink-300 font-sans">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gold-400 via-gold-500/50 to-transparent animate-pulse-subtle" />
        </div>
      </section>

      {/* Featured by NOUS ART (Horizontal Carousel) */}
      <section className="relative py-16 md:py-24 z-10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 border-b border-white/10 pb-8">
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

        <div className="relative w-full group overflow-hidden">
          <div className="flex gap-6 lg:gap-8 w-max animate-marquee group-hover:[animation-play-state:paused] pl-6 lg:pl-10">
              {[...featured, ...featured, ...featured].map((piece, i) => (
                <div 
                  key={`${piece.id}-${i}`} 
                  className="w-[80vw] sm:w-[320px] lg:w-[420px] shrink-0"
                >
                  <ArtworkCard piece={piece} useAdvancedMotion={false} />
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* Interactive Magnific-Style "Browse Marketplace — Browse by Medium" Showcase Section */}
      <section className="relative mx-auto max-w-7xl px-6 lg:px-10 py-16 border-t border-white/10">
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

        {/* Bento Box Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          {MEDIUM_SHOWCASES.map((medium, index) => {
            // Bento logic: 
            // 0: Painting (large left)
            // 1: Sculpture (large right)
            // 2, 3, 4: Photography, Editions, Drawings (bottom row 3-cols)
            let colSpan = "lg:col-span-4 md:col-span-1";
            let minHeight = "min-h-[350px] lg:min-h-[400px]";
            
            if (index === 0) {
              colSpan = "lg:col-span-7 md:col-span-2";
              minHeight = "min-h-[400px] lg:min-h-[500px]";
            } else if (index === 1) {
              colSpan = "lg:col-span-5 md:col-span-1";
              minHeight = "min-h-[400px] lg:min-h-[500px]";
            } else if (index === 2) {
              colSpan = "lg:col-span-4 md:col-span-1";
            }

            return (
              <MediumCard 
                key={medium.id} 
                medium={medium} 
                index={index} 
                className={`${colSpan} ${minHeight}`} 
              />
            );
          })}
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
                to="/artists"
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
      <section className="relative mx-auto max-w-7xl px-6 lg:px-10 py-16 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 relative"
          >
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

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="hidden sm:block absolute -bottom-6 -right-6 glass-panel p-6 rounded-xl max-w-xs border border-white/10 shadow-2xl"
            >
              <div className="text-gold-400 text-xs font-semibold uppercase tracking-widest mb-1">
                <span>Authenticity Guaranteed</span>
              </div>
              <p className="text-xs text-ink-100 leading-relaxed font-light">
                Every acquisition includes a signed certificate of authenticity and provenance history.
              </p>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-6 space-y-6"
          >
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
          </motion.div>
        </div>
      </section>
    </div>
  );
}
