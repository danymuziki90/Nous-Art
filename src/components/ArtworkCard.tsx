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
      className="group block fade-up relative"
      style={{ animationDelay: animationDelay || '0s' }}
    >
      {/* Artwork Media Card Frame */}
      <Link to={`/artwork/${piece.id}`} className="block relative overflow-hidden aspect-[4/5] bg-ink-900 rounded-xl border border-white/10 transition-all duration-500 group-hover:border-gold-500/50 shadow-xl group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
        <MediaDisplay piece={piece} autoPlay muted showBadge />

        {/* Floating Heart / Wishlist Icon */}
        <button
          onClick={handleWishlistClick}
          aria-label="Save to Wishlist"
          className={`absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full backdrop-blur-md border transition-all duration-300 flex items-center justify-center ${
            liked
              ? 'bg-gold-500 border-gold-400 text-ink-950 shadow-lg shadow-gold-500/30 scale-105'
              : 'bg-ink-950/70 border-white/15 text-ink-200 hover:text-gold-300 hover:border-gold-500/40 hover:scale-110'
          }`}
        >
          <Heart size={16} className={liked ? 'fill-ink-950 text-ink-950' : ''} />
        </button>

        {/* Quick Action Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={handleCartClick}
              className="flex-1 btn-gold rounded-lg !py-2.5 !px-4 !text-[11px] font-semibold flex items-center justify-center gap-2 shadow-lg"
            >
              <ShoppingBag size={14} />
              <span>Acquire Work</span>
            </button>
            
            <span className="w-9 h-9 rounded-lg bg-ink-900 border border-white/20 text-gold-400 flex items-center justify-center shrink-0">
              <ArrowUpRight size={16} />
            </span>
          </div>
        </div>
      </Link>

      {/* Artwork Metadata */}
      <div className="mt-4 flex flex-col justify-between gap-1.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/artwork/${piece.id}`} className="block">
              <h3 className="font-display text-xl text-ink-50 group-hover:text-gold-300 transition-colors font-medium truncate">
                {piece.title}
              </h3>
            </Link>
            <p className="text-xs gold-text-gradient font-sans tracking-wide mt-0.5 font-medium">
              {piece.artist}{piece.year ? `, ${piece.year}` : ''}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-sm font-display text-gold-400 font-semibold bg-gold-500/10 px-2.5 py-1 rounded border border-gold-500/20 whitespace-nowrap block">
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
