import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight, Search, MapPin, Award, Layers } from 'lucide-react';
import { getAllArtists, type Artist } from '@/data/artists';
import { SEO } from '@/components/SEO';

const DISCIPLINES = ['All', 'Painting', 'Sculpture', 'Photography', 'Mixed Media'];

export default function Artists() {
  const allArtists = useMemo(() => getAllArtists(), []);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredArtists = useMemo(() => {
    return allArtists.filter((artist) => {
      const matchesDiscipline =
        selectedDiscipline === 'All' || artist.discipline === selectedDiscipline;
      const matchesSearch =
        searchQuery.trim() === '' ||
        artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.mainMediums.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesDiscipline && matchesSearch;
    });
  }, [allArtists, selectedDiscipline, searchQuery]);

  const spotlightArtist = allArtists[0];

  return (
    <>
      <SEO
        title="Represented Artists — NOUS ART Gallery"
        description="Discover our international roster of visionary contemporary artists, painters, sculptors, and fine art photographers."
      />

      <div className="min-h-screen bg-ink-950 text-ink-50 pt-28 pb-24">
        {/* Header Hero Section */}
        <section className="container mx-auto px-4 md:px-8 mb-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-mono uppercase tracking-widest mb-6">
              <Sparkles size={13} />
              <span>Gallery Roster</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-ink-50 tracking-tight leading-[1.1] mb-6">
              Distinguished Masters <br />
              <span className="font-serif italic gold-text-gradient font-normal">& Contemporary Voices</span>
            </h1>
            <p className="font-serif text-lg md:text-xl text-ink-200 leading-relaxed font-light max-w-2xl">
              NOUS ART represents a curated international roster of artists whose practices redefine material boundaries, spatial harmony, and visual philosophy.
            </p>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10 text-xs font-mono tracking-wider">
            <div>
              <span className="text-ink-400 block uppercase mb-1">Represented Roster</span>
              <span className="text-xl text-gold-400 font-display font-light">120+ International Artists</span>
            </div>
            <div>
              <span className="text-ink-400 block uppercase mb-1">Primary Mediums</span>
              <span className="text-xl text-ink-100 font-display font-light">Fine Oil, Bronze, Film</span>
            </div>
            <div>
              <span className="text-ink-400 block uppercase mb-1">Biennale Features</span>
              <span className="text-xl text-gold-400 font-display font-light">Venice & Dakar</span>
            </div>
            <div>
              <span className="text-ink-400 block uppercase mb-1">Museum Collections</span>
              <span className="text-xl text-ink-100 font-display font-light">Tate, Berardo, Mori</span>
            </div>
          </div>
        </section>

        {/* Spotlight Artist Section */}
        {spotlightArtist && (
          <section className="container mx-auto px-4 md:px-8 mb-24">
            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
              <div className="lg:col-span-5 relative aspect-[4/5] lg:aspect-auto">
                <img
                  src={spotlightArtist.portrait}
                  alt={spotlightArtist.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent lg:hidden" />
              </div>

              <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between bg-ink-900/60">
                <div>
                  <div className="flex items-center gap-3 text-gold-400 text-xs font-mono uppercase tracking-widest mb-4">
                    <Award size={14} />
                    <span>Featured Spotlight</span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl text-ink-50 font-light mb-2">
                    {spotlightArtist.name}
                  </h2>
                  <p className="text-xs text-gold-400/90 font-mono mb-6">{spotlightArtist.location}</p>

                  <p className="font-serif text-lg text-ink-200 font-light italic leading-relaxed mb-6 border-l-2 border-gold-500/40 pl-4">
                    "{spotlightArtist.quote}"
                  </p>

                  <p className="text-sm text-ink-300 leading-relaxed font-light mb-8">
                    {spotlightArtist.shortBio}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {spotlightArtist.mainMediums.map((m) => (
                      <span
                        key={m}
                        className="px-3 py-1 rounded-full text-[11px] font-mono bg-white/5 border border-white/10 text-ink-200"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-ink-400 font-mono">Represented exclusively by NOUS ART</span>
                  <Link
                    to={`/artist/${spotlightArtist.id}`}
                    className="btn-gold group flex items-center gap-2 !py-2.5 !px-5 text-xs rounded-sm"
                  >
                    <span>View Artist Profile</span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Filter & Search Bar */}
        <section className="container mx-auto px-4 md:px-8 mb-12">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            {/* Discipline Tabs */}
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {DISCIPLINES.map((disc) => (
                <button
                  key={disc}
                  onClick={() => setSelectedDiscipline(disc)}
                  className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
                    selectedDiscipline === disc
                      ? 'bg-gold-500 text-ink-950 font-bold shadow-md shadow-gold-500/20'
                      : 'bg-white/5 border border-white/10 text-ink-300 hover:text-ink-50 hover:border-white/20'
                  }`}
                >
                  {disc}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                placeholder="Search by artist or medium..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-ink-900/80 border border-white/10 text-xs text-ink-100 placeholder-ink-400 focus:outline-none focus:border-gold-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-400 hover:text-ink-100"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Artist Grid */}
        <section className="container mx-auto px-4 md:px-8">
          {filteredArtists.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-xl border border-white/10">
              <p className="font-serif text-lg text-ink-300 mb-4">No artists matching your search criteria.</p>
              <button
                onClick={() => {
                  setSelectedDiscipline('All');
                  setSearchQuery('');
                }}
                className="btn-gold-outline text-xs px-6 py-2 rounded-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArtists.map((artist) => (
                <div
                  key={artist.id}
                  className="glass-panel group rounded-xl border border-white/10 overflow-hidden flex flex-col justify-between transition-all duration-500 hover:border-gold-500/40 hover:shadow-xl hover:shadow-gold-500/5"
                >
                  <div>
                    {/* Portrait Frame */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-ink-900">
                      <img
                        src={artist.portrait}
                        alt={artist.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />

                      <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-ink-950/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-gold-400 tracking-wider uppercase">
                        {artist.discipline}
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-display text-2xl text-ink-50 font-light group-hover:text-gold-300 transition-colors">
                          {artist.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-ink-300 font-mono mt-1">
                          <MapPin size={12} className="text-gold-500 shrink-0" />
                          <span>{artist.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio & Details */}
                    <div className="p-6">
                      <p className="text-xs text-ink-300 leading-relaxed font-light line-clamp-3 mb-6">
                        {artist.shortBio}
                      </p>

                      <div className="space-y-2 mb-6">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400 block">
                          Main Mediums
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {artist.mainMediums.slice(0, 3).map((medium) => (
                            <span
                              key={medium}
                              className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-ink-200"
                            >
                              {medium}
                            </span>
                          ))}
                        </div>
                      </div>

                      {artist.achievements.length > 0 && (
                        <div className="pt-4 border-t border-white/5">
                          <div className="flex items-center gap-2 text-[11px] text-gold-400/90 font-mono">
                            <Award size={12} className="shrink-0" />
                            <span className="truncate">{artist.achievements[0].title}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Link Button */}
                  <div className="p-6 pt-0">
                    <Link
                      to={`/artist/${artist.id}`}
                      className="w-full btn-gold-outline group/btn flex items-center justify-center gap-2 py-2.5 text-xs rounded-sm"
                    >
                      <span>Explore Artist Profile</span>
                      <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
