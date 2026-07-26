import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Compass, ShieldCheck, Search, Award, Flame, Star, Layers } from 'lucide-react';
import { supabase, type ArtPiece, type SiteSettings } from '@/lib/supabase';
import { ArtworkCard } from '@/components/ArtworkCard';
import { useStore } from '@/context/StoreContext';

const DEFAULT_HERO = {
  hero_media_url: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=2000',
  hero_media_type: 'image' as const,
};

const CATEGORY_BLOCKS = [
  {
    title: 'Paintings',
    medium: 'Painting',
    count: '45+ Works',
    image: 'https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Sculptures',
    medium: 'Sculpture',
    count: '24+ Works',
    image: 'https://images.pexels.com/photos/3004909/pexels-photo-3004909.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Photography',
    medium: 'Photography',
    count: '32+ Works',
    image: 'https://images.pexels.com/photos/2123337/pexels-photo-2123337.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Limited Editions',
    medium: 'Edition',
    count: '18+ Works',
    image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800',
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

  return (
    <div className="bg-ink-950 text-ink-50 overflow-hidden pt-28">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[650px] flex items-center justify-center overflow-hidden">
        {/* Background Media */}
        <div className="absolute inset-0 z-0">
          {heroType === 'video' && heroUrl ? (
            <video
              src={heroUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover scale-105 filter brightness-[0.6] contrast-[1.1] image-reveal"
            />
          ) : (
            <img
              src={heroUrl}
              alt="Gallery Interior"
              className="w-full h-full object-cover scale-105 filter brightness-[0.6] contrast-[1.1] image-reveal"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/40 to-ink-950" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-ink-950/40 to-ink-950" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center pt-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ink-900/80 border border-gold-500/30 backdrop-blur-md mb-6 fade-up shadow-xl">
            <Sparkles size={13} className="text-gold-400" />
            <span className="text-[10px] uppercase tracking-[0.35em] gold-text-gradient font-semibold">
              Contemporary Art Marketplace
            </span>
          </div>

          <h1
            className="font-display text-5xl sm:text-7xl md:text-8xl tracking-tight text-ink-50 leading-[0.95] fade-up font-light text-balance"
            style={{ animationDelay: '0.2s' }}
          >
            Where vision <br />
            <em className="font-serif italic gold-text-gradient font-normal">becomes</em> collection
          </h1>

          <p
            className="mt-6 text-base md:text-lg text-ink-200 max-w-2xl mx-auto leading-relaxed font-light fade-up"
            style={{ animationDelay: '0.4s' }}
          >
            Discover and acquire curated original artworks from premier emerging and established masters worldwide.
          </p>

          {/* Integrated Search Bar on Hero (Artsper Style) */}
          <form
            onSubmit={handleHeroSearch}
            className="mt-10 max-w-xl mx-auto relative fade-up"
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
                className="w-full bg-ink-950/90 border border-gold-500/40 focus:border-gold-500 rounded-full py-4 pl-14 pr-32 text-sm text-ink-50 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30 shadow-2xl backdrop-blur-md"
              />
              <button
                type="submit"
                className="absolute right-2 btn-gold rounded-full !py-2.5 !px-5 !text-[11px] font-semibold"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick links */}
          <div
            className="mt-8 flex items-center justify-center gap-6 text-xs text-ink-300 font-mono fade-up"
            style={{ animationDelay: '0.7s' }}
          >
            <span>Trending:</span>
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
      </section>

      {/* Featured by NOUS ART (Product Grid) */}
      <section className="relative mx-auto max-w-7xl px-6 lg:px-10 py-24 md:py-32 z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 text-gold-400 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
              <Compass size={14} />
              <span>Curatorial Selection</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-ink-50 font-light">
              Featured by NOUS ART
            </h2>
          </div>

          <Link
            to="/gallery"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest2 text-ink-300 hover:text-gold-300 transition-colors"
          >
            <span>Explore Full Collection</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-ink-900/60 rounded-xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {featured.map((piece, i) => (
              <ArtworkCard key={piece.id} piece={piece} animationDelay={`${i * 0.08}s`} />
            ))}
          </div>
        )}
      </section>

      {/* Browse by Category Blocks (Artsper Feature) */}
      <section className="relative mx-auto max-w-7xl px-6 lg:px-10 py-20 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-gold-400 text-xs uppercase tracking-[0.3em] font-semibold mb-2">
              <Layers size={14} />
              <span>Browse Marketplace</span>
            </div>
            <h2 className="font-display text-4xl text-ink-50 font-light">
              Browse by Medium
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORY_BLOCKS.map((cat) => (
            <Link
              key={cat.title}
              to={`/gallery?medium=${cat.medium}`}
              className="group relative h-80 rounded-2xl overflow-hidden border border-white/10 shadow-xl block"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-[0.7]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <h3 className="font-display text-2xl text-ink-50 group-hover:text-gold-300 transition-colors font-medium">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-ink-300 font-mono mt-1">{cat.count}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-ink-900/80 border border-white/15 flex items-center justify-center text-gold-400 group-hover:border-gold-500 group-hover:bg-gold-500/20 transition-all">
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
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
                <p className="text-xs text-ink-300 leading-relaxed font-light mt-2">
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

      {/* Artist Spotlight & Editorial Magazine */}
      <section className="relative mx-auto max-w-7xl px-6 lg:px-10 py-24 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              <img
                src="https://images.pexels.com/photos/695409/pexels-photo-695409.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="Editorial Exhibition"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-ink-950/60 via-transparent to-transparent" />
            </div>

            <div className="hidden sm:block absolute -bottom-6 -right-6 glass-panel-gold p-6 rounded-xl max-w-xs border border-gold-500/30 shadow-2xl">
              <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-1">
                <ShieldCheck size={16} />
                <span>Authenticity Guaranteed</span>
              </div>
              <p className="text-xs text-ink-200 leading-relaxed font-light">
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
            <p className="text-ink-200 leading-relaxed font-light text-base">
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
