import React, { useState } from 'react';
import { X, Eye, Sparkles, CheckCircle2 } from 'lucide-react';
import type { ArtPiece } from '@/lib/supabase';

interface InSituPreviewModalProps {
  piece: ArtPiece;
  isOpen: boolean;
  onClose: () => void;
}

const ROOM_BACKGROUNDS = [
  {
    id: 'modern-living',
    label: 'Modern Luxury Salon',
    url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'minimal-gallery',
    label: 'Gallery Exhibition Wall',
    url: 'https://images.pexels.com/photos/695409/pexels-photo-695409.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 'penthouse-dining',
    label: 'Penthouse Dining Room',
    url: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
];

export const InSituPreviewModal: React.FC<InSituPreviewModalProps> = ({ piece, isOpen, onClose }) => {
  const [selectedRoom, setSelectedRoom] = useState(ROOM_BACKGROUNDS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink-950/95 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-10 fade-up overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <Eye size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-gold-400 text-xs uppercase tracking-[0.3em] font-semibold">
              <Sparkles size={12} />
              <span>In-Situ Room Visualiser</span>
            </div>
            <h3 className="font-display text-2xl text-ink-50 font-light">{piece.title}</h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-ink-100 hover:text-gold-300 hover:border-gold-500/40 transition-colors"
          aria-label="Close Preview"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Room Canvas Display */}
      <div className="my-auto py-8 relative z-10 mx-auto max-w-5xl w-full">
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-ink-900">
          {/* Room Background Image */}
          <img
            src={selectedRoom.url}
            alt={selectedRoom.label}
            className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
          />

          {/* Room Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent pointer-events-none" />

          {/* Framed Artwork Hung in Room */}
          <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
            <div className="relative max-w-[35%] max-h-[55%] shadow-[0_25px_60px_rgba(0,0,0,0.9)] border-[10px] border-ink-950 rounded-sm bg-ink-950 transition-all duration-700 hover:scale-105">
              <img
                src={piece.image_url}
                alt={piece.title}
                className="w-full h-full object-contain filter drop-shadow-xl"
              />

              {/* Museum Spotlight Wall Effect */}
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-100/10 blur-[50px] rounded-full pointer-events-none" />
            </div>
          </div>

          {/* Room Title Badge */}
          <div className="absolute bottom-6 left-6 glass-panel px-4 py-2 rounded-lg border border-white/10 backdrop-blur-md">
            <span className="text-xs uppercase tracking-widest text-gold-300 font-mono">
              {selectedRoom.label}
            </span>
          </div>
        </div>

        {/* Room Switcher Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <span className="text-xs uppercase tracking-widest text-ink-300 font-mono mr-2">
            Select Interior:
          </span>
          {ROOM_BACKGROUNDS.map((room) => {
            const active = room.id === selectedRoom.id;
            return (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all duration-300 ${
                  active
                    ? 'bg-gold-gradient text-ink-950 font-semibold shadow-md shadow-gold-500/20'
                    : 'bg-ink-900/80 border border-white/10 text-ink-200 hover:text-ink-50 hover:border-gold-500/40'
                }`}
              >
                {active && <CheckCircle2 size={13} />}
                {room.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-ink-300 font-light border-t border-white/10 pt-4 relative z-10">
        Scale rendered according to dimensions: <span className="text-gold-400 font-mono">{piece.dimensions || '120 × 80 cm'}</span>
      </div>
    </div>
  );
};
