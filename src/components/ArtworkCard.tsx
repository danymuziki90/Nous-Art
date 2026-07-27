import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { ArtPiece } from '@/data/artworks';
import { MediaDisplay } from '@/components/MediaDisplay';
import { useStore } from '@/context/StoreContext';
import { slugifyArtistName } from '@/data/artists';

interface ArtworkCardProps {
  piece: ArtPiece;
  // Optional flag to use advanced motion variants if rendered inside a staggered motion grid
  index?: number;
  useAdvancedMotion?: boolean;
  animationDelay?: string; // Fallback for pure CSS delay if motion isn't used
}

// Framer Motion variants for the main card appearance
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  },
};

export const ArtworkCard: React.FC<ArtworkCardProps> = ({ piece, index = 0, useAdvancedMotion = false, animationDelay }) => {
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

  // Base card wrapped in motion.div or standard div depending on useAdvancedMotion
  const Wrapper = useAdvancedMotion ? motion.div : 'div';
  const motionProps = useAdvancedMotion ? { variants: cardVariants } : {};
  const styleProps = !useAdvancedMotion && animationDelay ? { animationDelay } : {};

  // 3D Parallax Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Wrapper 
      className={`group block relative ${!useAdvancedMotion ? 'fade-up' : ''}`}
      style={styleProps}
      {...motionProps}
    >
      {/* 3D Container Wrapper */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative perspective-[1200px]"
      >
        {/* Artwork Media Card Frame with cinematic reveal */}
        <Link
          to={`/artwork/${piece.id}`}
          className="block relative overflow-hidden aspect-[4/5] bg-ink-950 rounded-xl border border-white/5 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-gold-500/10 hover:border-white/10"
        >
        {/* Cinematic Mask Reveal overlay (runs once when parent is in view) */}
        {useAdvancedMotion && (
          <motion.div
            className="absolute inset-0 bg-ink-900 z-10 origin-bottom pointer-events-none"
            variants={{
              hidden: { scaleY: 1 },
              show: {
                scaleY: 0,
                transition: { duration: 1.2, ease: [0.77, 0, 0.175, 1] as any, delay: 0.1 },
              },
            }}
          />
        )}

        {/* Media Container with Slow Premium Zoom */}
        <div className="w-full h-full relative">
          <div className="w-full h-full transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]">
            <MediaDisplay piece={piece} autoPlay muted showBadge />
            {/* Soft Ambient Overlay to ensure text readability if needed */}
            <div className="absolute inset-0 bg-ink-950/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          </div>
        </div>

        {/* Animated Favorite Button (Magnetic-like reveal) */}
        <button
          onClick={handleWishlistClick}
          aria-label="Save to Wishlist"
          className={`absolute top-5 right-5 z-20 w-11 h-11 rounded-full backdrop-blur-md border transition-all duration-500 ease-out flex items-center justify-center opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 ${
            liked
              ? 'bg-gold-500/90 border-gold-400 text-ink-950 shadow-lg shadow-gold-500/30 opacity-100 translate-y-0'
              : 'bg-ink-950/40 border-white/20 text-ink-50 hover:text-gold-300 hover:border-gold-500/50 hover:bg-ink-900/80'
          }`}
        >
          <Heart size={18} className={liked ? 'fill-ink-950 text-ink-950 animate-pulse-subtle' : ''} />
        </button>

        {/* Cinematic Gradient & Info Overlay (Bottom) */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col justify-end pointer-events-none overflow-hidden">
          {/* Metadata slides up gracefully inside the card */}
          <div className="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[0.8s] ease-[cubic-bezier(0.16,1,0.3,1)]">
            <Link
              to={`/artist/${slugifyArtistName(piece.artist)}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs gold-text-gradient font-sans tracking-widest font-semibold uppercase mb-2 hover:underline inline-block pointer-events-auto"
            >
              {piece.artist}
            </Link>
            <h3 className="font-display text-2xl sm:text-3xl text-ink-50 font-light leading-tight mb-4">
              {piece.title} {piece.year && <span className="text-ink-200">({piece.year})</span>}
            </h3>

            <div className="flex items-center gap-3 pointer-events-auto">
              <button
                onClick={handleCartClick}
                className="flex-1 btn-gold rounded-full !py-3 !px-5 !text-[10px] sm:!text-[11px] font-semibold flex items-center justify-center gap-2 shadow-xl"
              >
                <ShoppingBag size={14} />
                <span>Acquire</span>
              </button>
              <div className="w-12 h-12 rounded-full bg-ink-900/80 border border-white/20 text-gold-400 flex items-center justify-center shrink-0 group-hover:border-gold-500 group-hover:bg-gold-500/10 transition-colors">
                <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
        </Link>
      </motion.div>

      {/* External Metadata (visible by default below the image) */}
      <div className="mt-5 flex flex-col gap-1.5 px-1 relative z-10 transition-all duration-500 group-hover:-translate-y-2 group-hover:opacity-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-display text-xl sm:text-2xl text-ink-50 font-medium truncate">
              {piece.title}
            </h3>
            <Link
              to={`/artist/${slugifyArtistName(piece.artist)}`}
              className="text-xs text-ink-200 hover:text-gold-300 transition-colors font-sans tracking-wide mt-1 inline-block"
            >
              {piece.artist}
            </Link>
          </div>
          <div className="text-right shrink-0">
            <span className="text-sm font-sans text-gold-400 font-medium block">
              {formatPrice(piece.price)}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-ink-300 font-mono tracking-wider truncate mt-1">
          {piece.medium || 'Contemporary Work'} {piece.dimensions ? `• ${piece.dimensions}` : ''}
        </p>
      </div>
    </Wrapper>
  );
};
