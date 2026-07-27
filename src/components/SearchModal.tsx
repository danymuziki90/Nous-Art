import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowUpRight, Sparkles, Filter } from 'lucide-react';
import { getAllArtworks, type ArtPiece } from '@/data/artworks';
import { useStore } from '@/context/StoreContext';
import { getAllArtists } from '@/data/artists';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch, formatPrice } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(false);
  const [allPieces, setAllPieces] = useState<ArtPiece[]>([]);

  useEffect(() => {
    if (isSearchOpen) {
      setAllPieces(getAllArtworks());
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(allPieces.slice(0, 4));
      return;
    }

    setLoading(true);
    const q = query.toLowerCase().trim();
    const filtered = allPieces.filter((p) => {
      return (
        p.title.toLowerCase().includes(q) ||
        p.artist.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.medium && p.medium.toLowerCase().includes(q))
      );
    });
    setResults(filtered);
    setLoading(false);
  }, [query, allPieces]);

  const matchingArtists = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return getAllArtists().filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.discipline.toLowerCase().includes(q) ||
        a.mainMediums.some((m) => m.toLowerCase().includes(q))
    );
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink-950/95 backdrop-blur-2xl flex flex-col justify-start p-6 sm:p-10 fade-up">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-4xl w-full relative z-10 pt-8">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="text-gold-400 text-xs uppercase tracking-[0.35em] font-semibold">
            <span>Global Search</span>
          </div>

          <button
            onClick={closeSearch}
            className="w-10 h-10 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-ink-100 hover:text-gold-300 hover:border-gold-500/40 transition-colors"
            aria-label="Close menu search"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="relative mt-8">
          <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-400" />
          <input
            autoFocus
            type="text"
            placeholder="Search for an artwork, artist, style, medium..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-ink-900/90 border border-gold-500/40 focus:border-gold-500 rounded-2xl py-5 pl-14 pr-12 text-ink-50 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-gold-500/30 text-lg shadow-2xl transition-all font-light"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-ink-300 hover:text-gold-300 p-1"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-2 mt-4 text-xs font-mono text-ink-300 overflow-x-auto pb-2 no-scrollbar">
          <span className="shrink-0 flex items-center gap-1 text-gold-400">
            <Filter size={12} /> Popular:
          </span>
          {['Painting', 'Sculpture', 'Photography', 'Abstract', 'Portrait'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-3 py-1 rounded-full bg-ink-900 border border-white/10 hover:border-gold-500/40 hover:text-gold-300 transition-colors shrink-0"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Instant Results Container */}
        <div className="mt-8">
          <div className="flex items-center justify-between text-xs text-ink-300 font-mono mb-4">
            <span>
              {query ? `Results for "${query}" (${results.length})` : 'Curated Suggestions'}
            </span>
            {query && results.length > 0 && (
              <Link
                to={`/gallery?search=${encodeURIComponent(query)}`}
                onClick={closeSearch}
                className="text-gold-400 hover:underline flex items-center gap-1"
              >
                View all results <ArrowUpRight size={14} />
              </Link>
            )}
          </div>

          {matchingArtists.length > 0 && (
            <div className="mb-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 block mb-3">
                Matching Artists ({matchingArtists.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchingArtists.map((artist) => (
                  <Link
                    key={artist.id}
                    to={`/artist/${artist.id}`}
                    onClick={closeSearch}
                    className="flex items-center gap-3 p-3 rounded-xl bg-ink-900/80 border border-white/10 hover:border-gold-500/40 hover:bg-ink-900 transition-all"
                  >
                    <img
                      src={artist.portrait}
                      alt={artist.name}
                      className="w-12 h-12 rounded-full object-cover shrink-0 border border-white/10"
                    />
                    <div className="min-w-0">
                      <h4 className="font-display text-base text-ink-50 font-medium truncate">
                        {artist.name}
                      </h4>
                      <p className="text-[10px] font-mono text-ink-300 truncate">{artist.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-ink-900 rounded-xl animate-pulse border border-white/5" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-2xl border border-white/10">
              <p className="text-ink-200 font-light text-base">No artworks found matching "{query}".</p>
              <p className="text-xs text-ink-300 mt-2">Try searching by artist name, medium, or title.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[55vh] overflow-y-auto pr-2">
              {results.map((piece) => (
                <Link
                  key={piece.id}
                  to={`/artwork/${piece.id}`}
                  onClick={closeSearch}
                  className="group flex items-center gap-4 p-3.5 rounded-xl bg-ink-900/60 border border-white/10 hover:border-gold-500/40 hover:bg-ink-900 transition-all duration-300 shadow-md"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-ink-950">
                    <img
                      src={piece.image_url}
                      alt={piece.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-lg text-ink-50 group-hover:text-gold-300 transition-colors truncate font-medium">
                      {piece.title}
                    </h4>
                    <p className="text-xs gold-text-gradient truncate font-sans">
                      {piece.artist}
                    </p>
                    <p className="text-[10px] text-ink-300 font-mono mt-0.5 truncate">
                      {piece.medium || 'Artwork'} {piece.dimensions ? `• ${piece.dimensions}` : ''}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-display text-gold-400 font-semibold bg-gold-500/10 px-2.5 py-1 rounded border border-gold-500/20 block">
                      {formatPrice(piece.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
