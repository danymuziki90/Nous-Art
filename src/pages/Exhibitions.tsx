import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Sparkles, ArrowUpRight, Award } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { SEO } from '@/components/SEO';

const STATUS_FILTERS = ['All', 'Current', 'Upcoming', 'Past'];

export default function Exhibitions() {
  const { exhibitions, artworks } = useCMS();
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filteredExhibitions = exhibitions.filter(
    (ex) => selectedStatus === 'All' || ex.status === selectedStatus
  );

  return (
    <>
      <SEO
        title="Exhibitions & Programme — NOUS ART Gallery"
        description="Explore current, upcoming, and past solo and group exhibitions at NOUS ART Gallery."
      />

      <div className="min-h-screen bg-ink-950 text-ink-50 pt-28 pb-24">
        {/* Header Hero Section */}
        <section className="container mx-auto px-4 md:px-8 mb-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-mono uppercase tracking-widest mb-6">
              <Sparkles size={13} />
              <span>Gallery Programme</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-ink-50 tracking-tight leading-[1.1] mb-6">
              Curated Exhibitions <br />
              <span className="font-serif italic gold-text-gradient font-normal">& Monographic Surveys</span>
            </h1>
            <p className="font-serif text-lg md:text-xl text-ink-200 leading-relaxed font-light max-w-2xl">
              NOUS ART presents a year-round programme of solo and thematic group exhibitions, bringing together museum-represented masters and emerging voices.
            </p>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 mt-12 pt-8 border-t border-white/10 overflow-x-auto pb-2">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-5 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
                  selectedStatus === status
                    ? 'bg-gold-500 text-ink-950 font-bold shadow-md shadow-gold-500/20'
                    : 'bg-white/5 border border-white/10 text-ink-300 hover:text-ink-50 hover:border-white/20'
                }`}
              >
                {status} Exhibitions
              </button>
            ))}
          </div>
        </section>

        {/* Exhibitions Grid */}
        <section className="container mx-auto px-4 md:px-8">
          {filteredExhibitions.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-xl border border-white/10">
              <p className="font-serif text-lg text-ink-300 mb-4">No exhibitions matching this filter.</p>
              <button
                onClick={() => setSelectedStatus('All')}
                className="btn-gold-outline text-xs px-6 py-2 rounded-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredExhibitions.map((exhibition) => {
                const featuredPieces = artworks.filter((piece) =>
                  exhibition.featuredArtworkIds?.includes(piece.id)
                );

                return (
                  <div
                    key={exhibition.id}
                    className="glass-panel rounded-2xl border border-white/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 group transition-all duration-500 hover:border-gold-500/40"
                  >
                    {/* Cover Photo */}
                    <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-ink-900">
                      <img
                        src={exhibition.coverImage}
                        alt={exhibition.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent lg:hidden" />

                      <div
                        className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest backdrop-blur-md border ${
                          exhibition.status === 'Current'
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold'
                            : exhibition.status === 'Upcoming'
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold'
                            : 'bg-white/10 border-white/20 text-ink-300'
                        }`}
                      >
                        {exhibition.status} Exhibition
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between bg-ink-900/60">
                      <div>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gold-400 mb-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="shrink-0" />
                            <span>
                              {exhibition.startDate} — {exhibition.endDate}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="shrink-0" />
                            <span>{exhibition.location}</span>
                          </div>
                        </div>

                        <h2 className="font-display text-3xl md:text-4xl text-ink-50 font-light mb-2 group-hover:text-gold-300 transition-colors">
                          {exhibition.title}
                        </h2>
                        <p className="text-xs font-mono text-ink-400 uppercase tracking-widest mb-6">
                          Curated by {exhibition.curator}
                        </p>

                        <p className="font-serif text-lg text-ink-200 font-light leading-relaxed mb-6">
                          {exhibition.subtitle}
                        </p>

                        <p className="text-xs text-ink-300 leading-relaxed font-light mb-8">
                          {exhibition.description}
                        </p>

                        {/* Featured Artworks in Exhibition */}
                        {featuredPieces.length > 0 && (
                          <div className="pt-6 border-t border-white/10">
                            <span className="text-[10px] font-mono text-ink-400 uppercase tracking-widest block mb-3">
                              Featured Exhibition Artworks ({featuredPieces.length})
                            </span>
                            <div className="flex flex-wrap gap-3">
                              {featuredPieces.map((piece) => (
                                <Link
                                  key={piece.id}
                                  to={`/artwork/${piece.id}`}
                                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-gold-500/40 text-xs text-ink-200 transition-all"
                                >
                                  <img
                                    src={piece.image_url}
                                    alt={piece.title}
                                    className="w-6 h-6 rounded object-cover"
                                  />
                                  <span className="font-display truncate max-w-[140px]">{piece.title}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-8 mt-6 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs font-mono text-ink-400">NOUS ART Gallery Exhibition</span>
                        <Link
                          to="/gallery"
                          className="btn-gold-outline group/btn flex items-center gap-2 !py-2.5 !px-5 text-xs rounded-sm"
                        >
                          <span>Explore Collection</span>
                          <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
