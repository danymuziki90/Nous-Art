import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowUpRight } from 'lucide-react';
import type { ArtPiece } from '@/lib/supabase';
import { MediaDisplay } from '@/components/MediaDisplay';
import { useStore } from '@/context/StoreContext';

interface ArtworkCardProps {
  piece: ArtPiece;
  animationDelay?: string;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({ piece, animationDelay }) => {
  const { isInWishlist, toggleWishlist, addToCart, formatPrice } = useStore();
  const liked = isInWishlist(piece.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(piece.id);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(piece);
  };

  return (
    <div
      className="group block fade-up relative perspective-card"
      style={{ animationDelay: animationDelay || '0s' }}
    >
      {/* Artwork Media Card Frame with 3D Tilt & Light Sheen Pass */}
      <Link
        to={`/artwork/${piece.id}`}
        className="block relative overflow-hidden aspect-[4/5] bg-ink-900 rounded-2xl border border-white/10 artwork-card-tilt reflection-pass shadow-2xl"
      >
        {/* Media Image/Video Display */}
        <div className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-108">
          <MediaDisplay piece={piece} autoPlay muted showBadge />
        </div>

        {/* Floating Heart / Wishlist Icon with Micro-Pulse */}
        <button
          onClick={handleWishlistClick}
          aria-label="Save to Wishlist"
          className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full backdrop-blur-md border transition-all duration-300 flex items-center justify-center ${
            liked
              ? 'bg-gold-500 border-gold-400 text-ink-950 shadow-lg shadow-gold-500/40 scale-110'
              : 'bg-ink-950/70 border-white/15 text-ink-200 hover:text-gold-300 hover:border-gold-500/40 hover:scale-110 hover:bg-ink-900'
          }`}
        >
          <Heart size={17} className={liked ? 'fill-ink-950 text-ink-950 animate-pulse' : ''} />
        </button>

        {/* Quick Action Glass Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5 pointer-events-none">
          <div className="flex items-center gap-2.5 pointer-events-auto transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
            <button
              onClick={handleCartClick}
              className="flex-1 btn-gold rounded-xl !py-3 !px-4 !text-[11px] font-semibold flex items-center justify-center gap-2 shadow-xl shimmer-bar"
            >
              <ShoppingBag size={14} />
              <span>Acquire Work</span>
            </button>
            
            <span className="w-10 h-10 rounded-xl bg-ink-900/90 border border-white/20 text-gold-400 flex items-center justify-center shrink-0 group-hover:border-gold-500 group-hover:bg-gold-500/10 transition-colors">
              <ArrowUpRight size={17} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </Link>

      {/* Artwork Metadata with Micro-Interactions */}
      <div className="mt-4 flex flex-col justify-between gap-1.5 px-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/artwork/${piece.id}`} className="block">
              <h3 className="font-display text-2xl text-ink-50 group-hover:text-gold-300 transition-colors duration-300 font-medium truncate">
                {piece.title}
              </h3>
            </Link>
            <p className="text-xs gold-text-gradient font-sans tracking-wide mt-0.5 font-medium transition-all group-hover:translate-x-0.5">
              {piece.artist}{piece.year ? `, ${piece.year}` : ''}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-sm font-display text-gold-400 font-semibold bg-gold-500/10 px-3 py-1 rounded-lg border border-gold-500/25 whitespace-nowrap block shadow-sm group-hover:border-gold-500/50 group-hover:bg-gold-500/15 transition-colors">
              {formatPrice(piece.price)}
            </span>
          </div>
        </div>

        {/* Specifications snippet */}
        <p className="text-[11px] text-ink-400 font-mono tracking-wider truncate">
          {piece.medium || 'Contemporary Work'} {piece.dimensions ? `• ${piece.dimensions}` : ''}
        </p>
      </div>
    </div>
  );
};
