import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Eye,
  Heart,
  ShoppingBag,
  ArrowLeft,
  Award,
} from 'lucide-react';
import { supabase, type ArtPiece } from '@/lib/supabase';
import { MediaDisplay } from '@/components/MediaDisplay';
import { ArtworkCard } from '@/components/ArtworkCard';
import { InSituPreviewModal } from '@/components/InSituPreviewModal';
import { useStore } from '@/context/StoreContext';
import { SEO } from '@/components/SEO';

export default function ArtworkDetail() {
  const { id } = useParams<{ id: string }>();
  const [piece, setPiece] = useState<ArtPiece | null>(null);
  const [related, setRelated] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [openInSitu, setOpenInSitu] = useState(false);

  // Accordion toggle states
  const [openAccordion, setOpenAccordion] = useState<string | null>('desc');

  const { addToCart, isInWishlist, toggleWishlist, formatPrice } = useStore();

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    supabase
      .from('art_pieces')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        setPiece(data);
        setLoading(false);

        if (data) {
          supabase
            .from('art_pieces')
            .select('*')
            .neq('id', data.id)
            .limit(3)
            .then(({ data: rel }) => setRelated(rel ?? []));
        }
      });
  }, [id]);

  if (loading) {
    return (
      <div className="pt-28 pb-16 bg-ink-950 text-ink-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="h-96 bg-ink-900 rounded-2xl animate-pulse border border-white/5" />
        </div>
      </div>
    );
  }

  if (!piece) {
    return (
      <div className="pt-28 pb-16 bg-ink-950 text-ink-50 min-h-screen text-center">
        <h2 className="font-display text-4xl text-ink-50">Artwork Not Found</h2>
        <p className="text-ink-200 mt-2">The requested work is unavailable.</p>
        <Link to="/gallery" className="mt-6 inline-block btn-gold rounded-sm">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const liked = isInWishlist(piece.id);

  const toggleAcc = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  return (
    <div className="pt-28 pb-20 bg-ink-950 text-ink-50">
      <SEO 
        title={`${piece.title} by ${piece.artist} — NOUS ART`} 
        description={`${piece.medium}, ${piece.dimensions}. ${piece.description?.substring(0, 150) || 'Discover this contemporary artwork at NOUS ART.'}`}
        image={piece.media_url}
        url={`/artwork/${piece.id}`}
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Back Link */}
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-ink-300 hover:text-gold-300 transition-colors mb-8 font-mono"
        >
          <ArrowLeft size={14} />
          <span>Back to Collection</span>
        </Link>

        {/* Main Product Layout: Media + Purchase Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Media Display & In-Situ Visualizer Trigger */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-2xl group">
              <MediaDisplay piece={piece} controls autoPlay muted />

              {/* Floating Wishlist Icon */}
              <button
                onClick={() => toggleWishlist(piece.id)}
                aria-label="Save to Wishlist"
                className={`absolute top-4 right-4 z-20 w-11 h-11 rounded-full backdrop-blur-md border transition-all duration-300 flex items-center justify-center ${
                  liked
                    ? 'bg-gold-500 border-gold-400 text-ink-950 shadow-lg scale-105'
                    : 'bg-ink-950/70 border-white/15 text-ink-100 hover:text-gold-300 hover:border-gold-500/40'
                }`}
              >
                <Heart size={18} className={liked ? 'fill-ink-950 text-ink-950' : ''} />
              </button>
            </div>

            {/* In-Situ Room Visualizer Button */}
            <button
              onClick={() => setOpenInSitu(true)}
              className="w-full btn-outline-gold rounded-xl !py-3.5 !px-6 text-xs uppercase flex items-center justify-center gap-2 shadow-lg"
            >
              <Eye size={18} className="text-gold-400" />
              <span>View Artwork in a Luxury Interior Room</span>
            </button>
          </div>

          {/* Right: Artwork Details & Purchase CTA Box */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-[10px] uppercase tracking-widest font-semibold mb-4">
                <Sparkles size={12} />
                <span>Original Certified Work</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl text-ink-50 font-light leading-tight">
                {piece.title}
              </h1>

              <p className="text-lg gold-text-gradient font-sans font-medium mt-2">
                {piece.artist}{piece.year ? `, ${piece.year}` : ''}
              </p>
            </div>

            {/* Price Box */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
                <span className="text-xs uppercase tracking-widest text-ink-300 font-mono">
                  Acquisition Price
                </span>
                <span className="font-display text-3xl text-gold-400 font-bold">
                  {formatPrice(piece.price)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => addToCart(piece)}
                  className="btn-gold rounded-xl w-full flex items-center justify-center gap-3 !py-4 text-xs font-semibold shadow-xl"
                >
                  <ShoppingBag size={18} />
                  <span>Acquire this Artwork</span>
                </button>

                <Link
                  to={`/contact?artwork=${encodeURIComponent(piece.title)}`}
                  className="btn-outline-gold rounded-xl w-full flex items-center justify-center gap-2 !py-3.5 text-xs font-medium"
                >
                  <span>Request Curator Advice</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 gap-2.5 pt-4 border-t border-white/10 text-xs text-ink-200 font-light">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={16} className="text-gold-400 shrink-0" />
                  <span>Certificate of Authenticity Included</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Truck size={16} className="text-gold-400 shrink-0" />
                  <span>Secure Insured Worldwide Shipping</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <RotateCcw size={16} className="text-gold-400 shrink-0" />
                  <span>14-Day Return Guarantee</span>
                </div>
              </div>
            </div>

            {/* Specifications Summary List */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 text-xs font-mono">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-ink-300">Medium</span>
                <span className="text-ink-100">{piece.medium || 'Contemporary Work'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-ink-300">Dimensions</span>
                <span className="text-ink-100">{piece.dimensions || '120 × 80 cm'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-ink-300">Year</span>
                <span className="text-ink-100">{piece.year || '2024'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-300">Provenance</span>
                <span className="text-gold-400">NOUS ART Gallery</span>
              </div>
            </div>

            {/* Expandable Accordions (Artsper Style) */}
            <div className="space-y-3 pt-4">
              {/* Accordion 1: Description & Technique */}
              <div className="glass-panel rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleAcc('desc')}
                  className="w-full p-4 text-left flex items-center justify-between text-xs uppercase tracking-widest text-ink-100 font-semibold"
                >
                  <span>Description & Technique</span>
                  {openAccordion === 'desc' ? <ChevronUp size={16} className="text-gold-400" /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'desc' && (
                  <div className="p-4 pt-0 text-sm text-ink-200 font-light leading-relaxed border-t border-white/5">
                    {piece.description ||
                      'An extraordinary contemporary work exploring themes of light, structure, and physical form. Created with high-grade pigments and museum-archival materials.'}
                  </div>
                )}
              </div>

              {/* Accordion 2: Artist Biography */}
              <div className="glass-panel rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleAcc('bio')}
                  className="w-full p-4 text-left flex items-center justify-between text-xs uppercase tracking-widest text-ink-100 font-semibold"
                >
                  <span>Artist Biography</span>
                  {openAccordion === 'bio' ? <ChevronUp size={16} className="text-gold-400" /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'bio' && (
                  <div className="p-4 pt-0 text-sm text-ink-200 font-light leading-relaxed border-t border-white/5">
                    {piece.artist} is a featured artist represented by NOUS ART Gallery. Their works are held in premier private collections across Europe, North America, and Asia.
                  </div>
                )}
              </div>

              {/* Accordion 3: Certificate & Authenticity */}
              <div className="glass-panel rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleAcc('auth')}
                  className="w-full p-4 text-left flex items-center justify-between text-xs uppercase tracking-widest text-ink-100 font-semibold"
                >
                  <span>Certificate & Authenticity</span>
                  {openAccordion === 'auth' ? <ChevronUp size={16} className="text-gold-400" /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'auth' && (
                  <div className="p-4 pt-0 text-sm text-ink-200 font-light leading-relaxed border-t border-white/5 space-y-2">
                    <p>
                      This original artwork comes with a physical Certificate of Authenticity signed by the artist and verified by NOUS ART curators.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Artworks Carousel Section */}
        {related.length > 0 && (
          <div className="mt-28 pt-16 border-t border-white/10">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-display text-3xl text-ink-50 font-light">
                More Works You May <span className="font-serif italic gold-text-gradient">Appreciate</span>
              </h3>
              <Link to="/gallery" className="text-xs uppercase tracking-widest text-gold-400 hover:underline font-mono">
                View All Works →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {related.map((relPiece) => (
                <ArtworkCard key={relPiece.id} piece={relPiece} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* In-Situ Interior Room Visualizer Modal */}
      <InSituPreviewModal
        piece={piece}
        isOpen={openInSitu}
        onClose={() => setOpenInSitu(false)}
      />
    </div>
  );
}
