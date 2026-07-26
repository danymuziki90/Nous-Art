import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Filter, Film, Image as ImageIcon, Sparkles } from 'lucide-react';
import { supabase, type ArtPiece } from '@/lib/supabase';
import { MediaDisplay } from '@/components/MediaDisplay';

export default function Gallery() {
  const [pieces, setPieces] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('All');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video'>('all');

  useEffect(() => {
    supabase
      .from('art_pieces')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setPieces(data ?? []);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const set = new Set(pieces.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set)] as string[];
  }, [pieces]);

  const filtered = useMemo(
    () =>
      pieces.filter((p) => {
        const matchesCategory = category === 'All' || p.category === category;
        const matchesMedia = mediaFilter === 'all' || (p.media_type ?? 'image') === mediaFilter;
        return matchesCategory && matchesMedia;
      }),
    [pieces, category, mediaFilter]
  );

  return (
    <div className="pt-32 pb-24 bg-ink-950 text-ink-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="mb-14 fade-up">
          <div className="flex items-center gap-2 text-gold-400 text-xs uppercase tracking-[0.35em] font-semibold mb-3">
            <Sparkles size={14} />
            <span>Catalogue Officiel</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-ink-50 font-light">
            La Collection <span className="font-serif italic gold-text-gradient">Permanente</span>
          </h1>
          <p className="mt-4 text-ink-300 max-w-2xl font-light text-base leading-relaxed">
            Découvrez l'ensemble de nos œuvres disponibles et présentées à la galerie. Peinture, sculpture, œuvres vidéo et tirages d'art.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="glass-panel p-6 rounded-xl border border-white/10 mb-14 space-y-5 fade-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-ink-300 font-medium">
              <Filter size={14} className="text-gold-400" />
              <span>Filtrer par format</span>
            </div>
            
            {/* Media Type Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Tous les Médias', icon: null },
                { id: 'image', label: 'Images & Toiles', icon: ImageIcon },
                { id: 'video', label: 'Œuvres Vidéo', icon: Film },
              ].map((m) => {
                const Icon = m.icon;
                const active = mediaFilter === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMediaFilter(m.id as any)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs uppercase tracking-widest transition-all duration-300 font-medium ${
                      active
                        ? 'bg-gold-gradient text-ink-950 font-semibold shadow-md shadow-gold-500/20'
                        : 'bg-ink-900/60 border border-white/10 text-ink-300 hover:text-ink-50 hover:border-gold-500/40'
                    }`}
                  >
                    {Icon && <Icon size={12} />}
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Tabs */}
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] uppercase tracking-widest text-ink-400 mr-2 font-mono">
                Catégorie:
              </span>
              {categories.map((c) => {
                const active = category === c;
                return (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 ${
                      active
                        ? 'bg-ink-800 border border-gold-500 text-gold-300 font-medium'
                        : 'bg-transparent text-ink-400 hover:text-ink-200'
                    }`}
                  >
                    {c === 'All' ? 'Toutes' : c}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Count Bar */}
        <div className="flex items-center justify-between text-xs text-ink-400 mb-8 px-2 font-mono">
          <span>{filtered.length} œuvre{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}</span>
          <span>Galerie Paris • 75001</span>
        </div>

        {/* Grid Display */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-ink-900 rounded-lg animate-pulse border border-white/5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 glass-panel rounded-xl border border-white/10">
            <p className="text-ink-300 font-light text-lg">Aucune œuvre ne correspond à vos critères de recherche.</p>
            <button
              onClick={() => {
                setCategory('All');
                setMediaFilter('all');
              }}
              className="mt-6 text-xs uppercase tracking-widest text-gold-400 hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filtered.map((piece, i) => (
              <Link
                key={piece.id}
                to={`/artwork/${piece.id}`}
                className="group block fade-up"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                {/* Media Card */}
                <div className="relative overflow-hidden aspect-[4/5] bg-ink-900 rounded-lg border border-white/10 transition-all duration-500 group-hover:border-gold-500/50 shadow-xl group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
                  <MediaDisplay piece={piece} autoPlay muted showBadge />
                  
                  {/* Floating Action Badge */}
                  <div className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-ink-950/80 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105">
                    <ArrowUpRight size={18} className="text-gold-400" />
                  </div>
                </div>

                {/* Details */}
                <div className="mt-5 flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-display text-2xl text-ink-50 group-hover:text-gold-300 transition-colors font-medium">
                      {piece.title}
                    </h3>
                    <p className="text-xs text-ink-300 mt-1 font-sans tracking-wider">
                      {piece.artist}{piece.year ? `, ${piece.year}` : ''}
                    </p>
                  </div>
                  {piece.price != null && (
                    <span className="text-sm font-display text-gold-400 font-semibold whitespace-nowrap bg-gold-500/10 px-3 py-1 rounded border border-gold-500/20">
                      {piece.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
