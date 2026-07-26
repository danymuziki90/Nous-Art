import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { supabase, type ArtPiece } from '@/lib/supabase';
import { MediaDisplay } from '@/components/MediaDisplay';

export default function ArtworkDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [piece, setPiece] = useState<ArtPiece | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from('art_pieces')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error) setPiece(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="pt-36 pb-24 mx-auto max-w-7xl px-6 lg:px-10 bg-ink-950">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="aspect-[4/5] bg-ink-900 rounded-lg animate-pulse border border-white/5" />
          <div className="space-y-6">
            <div className="h-4 bg-ink-900 rounded w-1/4 animate-pulse" />
            <div className="h-12 bg-ink-900 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-ink-900 rounded w-1/2 animate-pulse" />
            <div className="h-48 bg-ink-900 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!piece) {
    return (
      <div className="pt-40 pb-24 mx-auto max-w-7xl px-6 lg:px-10 text-center bg-ink-950">
        <div className="glass-panel p-16 rounded-xl border border-white/10 max-w-lg mx-auto">
          <p className="text-ink-300 mb-6 font-light">This artwork could not be found or is no longer available.</p>
          <Link to="/gallery" className="btn-gold rounded-sm inline-flex">
            Return to Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-28 bg-ink-950 text-ink-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-ink-300 hover:text-gold-300 transition-colors mb-10 focus:outline-none"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Collection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Media Display Container */}
          <div className="lg:col-span-7">
            <div className="sticky top-32">
              <div className="overflow-hidden bg-ink-900 rounded-xl border border-white/10 aspect-[4/5] shadow-2xl relative group">
                <MediaDisplay piece={piece} controls muted={false} />
              </div>
              
              <div className="mt-4 flex items-center justify-between text-xs text-ink-400 px-2 font-mono">
                <span>Ref: #{piece.id.substring(0, 8)}</span>
                <span className="flex items-center gap-1 text-gold-400">
                  <ShieldCheck size={14} /> Certified Original Work
                </span>
              </div>
            </div>
          </div>

          {/* Details & Acquisition Panel */}
          <div className="lg:col-span-5 fade-up space-y-8">
            <div>
              {piece.category && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-[10px] uppercase tracking-widest font-semibold mb-4">
                  <Sparkles size={12} />
                  <span>{piece.category}</span>
                </div>
              )}
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink-50 font-light leading-tight">
                {piece.title}
              </h1>
              
              <p className="text-xl text-ink-200 mt-3 font-light">
                {piece.artist}{piece.year ? `, ${piece.year}` : ''}
              </p>
            </div>

            {/* Price Tag Box */}
            {piece.price != null && (
              <div className="glass-panel-gold p-5 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-ink-400 font-mono block">Acquisition Price</span>
                  <span className="font-display text-3xl gold-text-gradient font-bold">
                    {piece.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                  </span>
                </div>
                <span className="text-xs text-ink-300 font-light">Tax included • Insured Shipping</span>
              </div>
            )}

            {/* Specs List */}
            <div className="border-t border-white/10 pt-6 space-y-4 text-sm">
              <h3 className="font-title text-xs uppercase tracking-widest gold-text-gradient font-semibold">
                Technical Specifications
              </h3>
              
              {piece.medium && (
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-xs uppercase tracking-widest text-ink-400">Medium & Technique</span>
                  <span className="text-ink-100 font-light text-right max-w-[60%]">{piece.medium}</span>
                </div>
              )}
              
              {piece.dimensions && (
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-xs uppercase tracking-widest text-ink-400">Dimensions</span>
                  <span className="text-ink-100 font-light text-right">{piece.dimensions}</span>
                </div>
              )}

              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-xs uppercase tracking-widest text-ink-400">Authenticity</span>
                <span className="text-gold-400 font-light text-right flex items-center gap-1">
                  <CheckCircle2 size={14} /> Certificate Included
                </span>
              </div>
            </div>

            {/* Description */}
            {piece.description && (
              <div className="border-t border-white/10 pt-6 space-y-3">
                <h3 className="font-title text-xs uppercase tracking-widest text-ink-300 font-semibold">
                  About this work
                </h3>
                <p className="text-ink-200 leading-relaxed font-light text-base">
                  {piece.description}
                </p>
              </div>
            )}

            {/* CTA Button */}
            <div className="border-t border-white/10 pt-8 space-y-4">
              <Link
                to={`/contact?artwork=${encodeURIComponent(piece.title)}`}
                className="btn-gold rounded-sm w-full group flex items-center justify-center gap-3 !py-4"
              >
                <Mail size={16} />
                <span>Enquire or Request Info</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-center text-xs text-ink-400 font-light">
                A gallery curator will respond to your inquiry within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
