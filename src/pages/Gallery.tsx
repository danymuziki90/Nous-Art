import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, ChevronDown, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { getAllArtworks, type ArtPiece } from '@/data/artworks';
import { ArtworkCard } from '@/components/ArtworkCard';
import { SEO } from '@/components/SEO';

const MEDIUMS = ['All', 'Painting', 'Sculpture', 'Photography', 'Edition', 'Drawing'];
const ORIENTATIONS = ['All', 'Vertical', 'Horizontal', 'Square'];
const COLOR_OPTIONS = [
  { id: 'gold', label: 'Gold & Metallic', bg: 'bg-amber-500' },
  { id: 'monochrome', label: 'Monochrome', bg: 'bg-stone-300' },
  { id: 'crimson', label: 'Crimson', bg: 'bg-red-600' },
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-600' },
  { id: 'cobalt', label: 'Cobalt Blue', bg: 'bg-blue-600' },
];

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchArg = searchParams.get('search') || '';
  const mediumArg = searchParams.get('medium') || 'All';
  const sortArg = searchParams.get('sort') || 'newest';

  const [pieces, setPieces] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedMedium, setSelectedMedium] = useState<string>(mediumArg);
  const [selectedOrientation, setSelectedOrientation] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [sortBy, setSortBy] = useState<string>(sortArg);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    if (mediumArg) setSelectedMedium(mediumArg);
    if (sortArg) setSortBy(sortArg);
  }, [mediumArg, sortArg]);

  useEffect(() => {
    setPieces(getAllArtworks());
    setLoading(false);
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = [...pieces];

    // Search query filter
    if (searchArg.trim()) {
      const q = searchArg.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.artist.toLowerCase().includes(q) ||
          (p.medium && p.medium.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
      );
    }

    // Medium filter
    if (selectedMedium !== 'All') {
      result = result.filter((p) => (p.medium || '').toLowerCase().includes(selectedMedium.toLowerCase()));
    }

    // Price filter
    result = result.filter((p) => (p.price ?? 0) <= maxPrice);

    // Sorting logic
    if (sortBy === 'price_asc') {
      result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    } else if (sortBy === 'favorites') {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else {
      // newest
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [pieces, searchArg, selectedMedium, maxPrice, sortBy]);

  const clearFilters = () => {
    setSelectedMedium('All');
    setSelectedOrientation('All');
    setSelectedColor(null);
    setMaxPrice(20000);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="bg-ink-950 min-h-screen pt-28 pb-16 text-ink-50">
      <SEO title="Collection — NOUS ART" description="Browse our curated collection of contemporary art." url="/gallery" />
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Page Header */}
        <div className="mb-10 fade-up">
          <div className="text-gold-400 text-xs uppercase tracking-[0.35em] font-semibold mb-3">
            <span>Catalogue & Marketplace</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-ink-50 font-light">
            The Complete <span className="font-serif italic gold-text-gradient">Collection</span>
          </h1>
          <p className="mt-3 text-ink-200 max-w-2xl font-light text-base leading-relaxed">
            Acquire certified original artworks directly from world-renowned artists and curators.
          </p>
        </div>

        {/* Search / Active Filter Header Tag */}
        {searchArg && (
          <div className="mb-6 flex items-center gap-3 bg-gold-500/10 border border-gold-500/30 rounded-xl p-4 text-xs font-mono">
            <span className="text-gold-400">Search Filter: "{searchArg}"</span>
            <button
              onClick={() => {
                searchParams.delete('search');
                setSearchParams(searchParams);
              }}
              className="text-ink-300 hover:text-gold-300 ml-auto"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Toolbar Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10 text-xs font-mono">
          <div className="flex items-center gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="lg:hidden btn-outline-gold !py-2 !px-4 !text-xs rounded-lg flex items-center gap-2"
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </button>

            <span className="text-ink-300">
              Showing <strong className="text-gold-400">{filteredAndSorted.length}</strong> works
            </span>
          </div>

          {/* Sort Selector Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-ink-300 hidden sm:inline">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-ink-900 border border-white/15 rounded-lg py-2 px-4 text-xs text-ink-100 focus:outline-none focus:border-gold-500 appearance-none cursor-pointer pr-8 font-mono"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="favorites">Gallery Favorites</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gold-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Advanced Artsper Sidebar Filter */}
          <aside
            className={`lg:col-span-3 space-y-8 glass-panel p-6 rounded-2xl border border-white/10 h-fit ${
              showMobileSidebar ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
                <span>Filters</span>
              </div>
              <button
                onClick={clearFilters}
                className="text-[11px] text-ink-300 hover:text-gold-300 flex items-center gap-1 font-mono"
              >
                <RefreshCw size={12} /> Clear
              </button>
            </div>

            {/* Medium Filter */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-ink-100 font-medium">Medium</h4>
              <div className="space-y-1.5">
                {MEDIUMS.map((med) => (
                  <button
                    key={med}
                    onClick={() => setSelectedMedium(med)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedMedium === med
                        ? 'bg-gold-500/10 border border-gold-500/30 text-gold-300 font-semibold'
                        : 'text-ink-200 hover:bg-white/5'
                    }`}
                  >
                    <span>{med}</span>
                    {selectedMedium === med && <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-3 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-ink-100 font-medium">
                <span>Max Price</span>
                <span className="text-gold-400 font-mono">${maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gold-500 bg-ink-900 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-ink-300 font-mono">
                <span>$500</span>
                <span>$50,000+</span>
              </div>
            </div>

            {/* Orientation */}
            <div className="space-y-3 border-t border-white/10 pt-6">
              <h4 className="text-xs uppercase tracking-widest text-ink-100 font-medium">Orientation</h4>
              <div className="grid grid-cols-2 gap-2">
                {ORIENTATIONS.map((ori) => (
                  <button
                    key={ori}
                    onClick={() => setSelectedOrientation(ori)}
                    className={`px-3 py-2 rounded-lg text-xs font-mono transition-colors text-center border ${
                      selectedOrientation === ori
                        ? 'bg-ink-800 border-gold-500 text-gold-300 font-semibold'
                        : 'border-white/10 text-ink-200 hover:border-gold-500/40'
                    }`}
                  >
                    {ori}
                  </button>
                ))}
              </div>
            </div>

            {/* Dominant Palette Filter */}
            <div className="space-y-3 border-t border-white/10 pt-6">
              <h4 className="text-xs uppercase tracking-widest text-ink-100 font-medium">Dominant Color</h4>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => setSelectedColor(selectedColor === col.id ? null : col.id)}
                    title={col.label}
                    className={`w-7 h-7 rounded-full ${col.bg} transition-all border ${
                      selectedColor === col.id ? 'ring-2 ring-gold-400 scale-110 border-white' : 'border-white/20 opacity-75 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-ink-900 rounded-xl animate-pulse border border-white/5" />
                ))}
              </div>
            ) : filteredAndSorted.length === 0 ? (
              <div className="text-center py-28 glass-panel rounded-2xl border border-white/10">
                <p className="text-ink-200 font-light text-lg">No artworks match your current filter criteria.</p>
                <button
                  onClick={clearFilters}
                  className="mt-6 btn-outline-gold rounded-sm !py-2.5 !px-6 text-xs uppercase"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-14">
                {filteredAndSorted.map((piece, i) => (
                  <ArtworkCard key={piece.id} piece={piece} animationDelay={`${i * 0.04}s`} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
