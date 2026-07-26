import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { supabase, type ArtPiece, type SiteSettings } from '@/lib/supabase';
import { MediaDisplay } from '@/components/MediaDisplay';

const DEFAULT_HERO = {
  hero_media_url: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=2000',
  hero_media_type: 'image' as const,
};

export default function Home() {
  const [featured, setFeatured] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState<SiteSettings | null>(null);

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

  const heroUrl = hero?.hero_media_url ?? DEFAULT_HERO.hero_media_url;
  const heroType = hero?.hero_media_type ?? DEFAULT_HERO.hero_media_type;

  return (
    <div className="bg-ink-950 text-ink-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Media Container */}
        <div className="absolute inset-0 z-0">
          {heroType === 'video' && heroUrl ? (
            <video
              src={heroUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover scale-105 filter brightness-[0.7] contrast-[1.1] image-reveal"
            />
          ) : (
            <img
              src={heroUrl}
              alt="Interieur de la Galerie Nous Art"
              className="w-full h-full object-cover scale-105 filter brightness-[0.7] contrast-[1.1] image-reveal"
            />
          )}
          {/* Multi-layered Gradients for Deep Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/50 to-ink-950" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-ink-950/30 to-ink-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent opacity-60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center pt-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ink-900/80 border border-gold-500/30 backdrop-blur-md mb-8 fade-up shadow-xl" style={{ animationDelay: '0.1s' }}>
            <Sparkles size={13} className="text-gold-400" />
            <span className="text-[10px] uppercase tracking-[0.35em] gold-text-gradient font-semibold">
              Galerie d'Art Contemporain • Paris
            </span>
          </div>

          {/* Main Title */}
          <h1
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-ink-50 leading-[0.95] fade-up text-balance font-light"
            style={{ animationDelay: '0.3s' }}
          >
            Quand la vision <br />
            <em className="font-serif italic gold-text-gradient font-normal">devient</em> collection
          </h1>

          {/* Subtitle */}
          <p
            className="mt-8 text-base md:text-xl text-ink-200 max-w-2xl mx-auto leading-relaxed font-light fade-up"
            style={{ animationDelay: '0.5s' }}
          >
            NOUS ART sélectionne et présente des œuvres contemporaines d'exception — le point de rencontre entre artistes visionnaires et collectionneurs exigeants.
          </p>

          {/* CTA Buttons */}
          <div
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5 fade-up"
            style={{ animationDelay: '0.7s' }}
          >
            <Link to="/gallery" className="btn-gold rounded-sm group w-full sm:w-auto">
              <span>Explorer la Collection</span>
              <ArrowRight size={16} className="ml-2.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link to="/about" className="btn-outline-gold rounded-sm group w-full sm:w-auto">
              <span>Notre Philosophie</span>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-10 pointer-events-none">
          <span className="text-[9px] uppercase tracking-[0.4em] text-ink-300 font-sans">Découvrir</span>
          <div className="w-[1px] h-14 bg-gradient-to-b from-gold-400 via-gold-500/50 to-transparent animate-pulse-subtle" />
        </div>
      </section>

      {/* Featured Works Section */}
      <section className="relative mx-auto max-w-7xl px-6 lg:px-10 py-28 md:py-36 z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 text-gold-400 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
              <Compass size={14} />
              <span>Sélection Curatoriale</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink-50 font-light">
              Œuvres Majeures
            </h2>
          </div>
          <Link
            to="/gallery"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest2 text-ink-300 hover:text-gold-300 transition-colors"
          >
            <span>Voir toute la collection</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-ink-900/60 rounded-lg animate-pulse border border-white/5" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-24 glass-panel rounded-xl border border-white/10">
            <p className="text-ink-300 font-light">La collection est en cours de sélection. Revenez très bientôt.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {featured.map((piece, i) => (
              <Link
                key={piece.id}
                to={`/artwork/${piece.id}`}
                className="group block fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Artwork Media Card */}
                <div className="relative overflow-hidden aspect-[4/5] bg-ink-900 rounded-lg border border-white/10 transition-all duration-500 group-hover:border-gold-500/50 shadow-xl group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
                  <MediaDisplay piece={piece} autoPlay muted showBadge />
                  
                  {/* Subtle Dark Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest2 gold-text-gradient font-medium translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                      Explorer l'œuvre <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="mt-5 flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-2xl text-ink-50 group-hover:text-gold-300 transition-colors font-medium">
                      {piece.title}
                    </h3>
                    <p className="text-xs text-ink-300 font-sans mt-1.5 tracking-wider">
                      {piece.artist}{piece.year ? `, ${piece.year}` : ''}
                    </p>
                  </div>
                  {piece.price != null && (
                    <span className="text-sm font-display text-gold-400 font-semibold bg-gold-500/10 px-3 py-1 rounded border border-gold-500/20 whitespace-nowrap mt-1">
                      {piece.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Editorial Section */}
      <section className="relative mx-auto max-w-7xl px-6 lg:px-10 py-24 md:py-36 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Gallery Image Container */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 shadow-2xl group">
              <img
                src="https://images.pexels.com/photos/695409/pexels-photo-695409.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="Espace Galerie Nous Art"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-ink-950/60 via-transparent to-transparent" />
            </div>
            
            {/* Accent Glass Card Overlay */}
            <div className="hidden sm:block absolute -bottom-8 -right-6 glass-panel-gold p-6 rounded-xl max-w-xs border border-gold-500/30 shadow-2xl">
              <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-1">
                <ShieldCheck size={16} />
                <span>Authenticité Garantie</span>
              </div>
              <p className="text-xs text-ink-200 leading-relaxed font-light">
                Chaque pièce est accompagnée d'un certificat d'authenticité signé par l'artiste et nos experts.
              </p>
            </div>
          </div>

          {/* Philosophy Text */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-gold-400 font-semibold">
              Notre Manifeste
            </p>
            <h2 className="font-display text-4xl sm:text-5xl text-ink-50 leading-[1.15] font-light text-balance">
              L'art n'est pas une décoration.<br />
              <em className="font-serif italic gold-text-gradient font-normal">C'est un regard.</em>
            </h2>
            <p className="text-ink-200 leading-relaxed font-light text-base">
              Nous croyons au pouvoir intemporel d'une œuvre singulière capable d'élever un espace, une émotion, une vie. Chaque création de notre collection est choisie pour son intégrité conceptuelle et sa puissance esthétique.
            </p>
            <p className="text-ink-300 leading-relaxed font-light text-sm">
              Située au cœur du premier arrondissement de Paris, la Galerie NOUS ART collabore étroitement avec des artistes émergents et des figures établies pour construire des collections pérennes.
            </p>
            <div className="pt-4">
              <Link to="/about" className="btn-outline-gold rounded-sm group">
                <span>Découvrir la Maison</span>
                <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
