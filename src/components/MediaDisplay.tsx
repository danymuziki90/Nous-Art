import { Film, Image as ImageIcon } from 'lucide-react';
import type { ArtPiece } from '@/lib/supabase';

interface MediaDisplayProps {
  piece: ArtPiece;
  className?: string;
  showBadge?: boolean;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
}

export function MediaDisplay({
  piece,
  className = '',
  showBadge = false,
  autoPlay = false,
  controls = false,
  muted = true,
}: MediaDisplayProps) {
  const isVideo = (piece.media_type ?? 'image') === 'video';

  if (isVideo) {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        <video
          src={piece.image_url}
          autoPlay={autoPlay}
          controls={controls}
          muted={muted}
          loop
          playsInline
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {showBadge && (
          <span className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink-950/80 backdrop-blur-md border border-gold-500/30 text-gold-300 text-[10px] uppercase tracking-widest font-semibold shadow-lg">
            <Film size={12} className="text-gold-400" /> Vidéo
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <img
        src={piece.image_url}
        alt={piece.title}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />
      {showBadge && piece.category && (
        <span className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-ink-950/80 backdrop-blur-md border border-white/10 text-ink-200 text-[10px] uppercase tracking-widest font-medium">
          <ImageIcon size={10} className="text-gold-400 opacity-80" /> {piece.category}
        </span>
      )}
    </div>
  );
}
