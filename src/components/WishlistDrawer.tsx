import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { type ArtPiece } from '@/data/artworks';
import { useStore } from '@/context/StoreContext';

export const WishlistDrawer: React.FC = () => {
  const { isWishlistOpen, closeWishlist, wishlist, toggleWishlist, addToCart, formatPrice } = useStore();
  const { getArtworkById, artworks } = useCMS();
  const [pieces, setPieces] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isWishlistOpen && wishlist.length > 0) {
      setLoading(true);
      const items = wishlist
        .map((id) => getArtworkById(id))
        .filter(Boolean) as ArtPiece[];
      setPieces(items);
      setLoading(false);
    } else {
      setPieces([]);
    }
  }, [isWishlistOpen, wishlist, artworks, getArtworkById]);

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeWishlist}
        className="absolute inset-0 bg-ink-950/80 backdrop-blur-md transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-ink-950 border-l border-white/10 text-ink-50 shadow-2xl flex flex-col justify-between p-6 sm:p-8 relative z-10 fade-up">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <Heart size={18} className="fill-gold-400" />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-ink-50 font-light">Saved Artworks</h3>
                  <p className="text-[10px] uppercase tracking-widest text-ink-300 font-mono">
                    {wishlist.length} saved work{wishlist.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <button
                onClick={closeWishlist}
                className="w-9 h-9 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-ink-200 hover:text-gold-300 hover:border-gold-500/40 transition-colors"
                aria-label="Close wishlist"
              >
                <X size={18} />
              </button>
            </div>

            {/* Wishlist Items List */}
            <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-20 bg-ink-900 rounded-xl animate-pulse border border-white/5" />
                  ))}
                </div>
              ) : wishlist.length === 0 || pieces.length === 0 ? (
                <div className="text-center py-16 glass-panel rounded-xl border border-white/10">
                  <Heart size={32} className="mx-auto text-ink-300 mb-3" />
                  <p className="text-ink-200 font-light">You haven't saved any artworks to your wishlist yet.</p>
                  <Link
                    to="/gallery"
                    onClick={closeWishlist}
                    className="mt-4 inline-block btn-outline-gold !py-2 !px-4 !text-[10px] rounded-sm"
                  >
                    Browse Collection
                  </Link>
                </div>
              ) : (
                pieces.map((piece) => (
                  <div
                    key={piece.id}
                    className="glass-panel p-4 rounded-xl border border-white/10 flex gap-4 items-center justify-between group"
                  >
                    <Link
                      to={`/artwork/${piece.id}`}
                      onClick={closeWishlist}
                      className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 bg-ink-900 shrink-0 block"
                    >
                      <img
                        src={piece.image_url}
                        alt={piece.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/artwork/${piece.id}`}
                        onClick={closeWishlist}
                        className="block"
                      >
                        <h4 className="font-display text-base text-ink-50 font-medium truncate group-hover:text-gold-300 transition-colors">
                          {piece.title}
                        </h4>
                      </Link>
                      <p className="text-xs gold-text-gradient truncate font-sans">
                        {piece.artist}
                      </p>
                      <p className="text-xs font-display text-gold-400 font-semibold mt-1">
                        {formatPrice(piece.price)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => toggleWishlist(piece.id)}
                        className="text-ink-300 hover:text-red-400 transition-colors p-1"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={15} />
                      </button>

                      <button
                        onClick={() => {
                          addToCart(piece);
                          closeWishlist();
                        }}
                        className="btn-gold rounded !py-1.5 !px-3 !text-[9px] flex items-center gap-1"
                      >
                        <ShoppingBag size={12} />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          {wishlist.length > 0 && (
            <div className="border-t border-white/10 pt-6">
              <Link
                to="/gallery"
                onClick={closeWishlist}
                className="btn-outline-gold rounded-sm w-full group flex items-center justify-center gap-2 !py-3"
              >
                <span>Continue Browsing</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
