import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Award,
  BookOpen,
  Sparkles,
  Mail,
  ChevronRight,
  CheckCircle,
  X,
  Share2,
} from 'lucide-react';
import { getArtistById, getArtistByName, type Artist } from '@/data/artists';
import { getArtworksByArtist, type ArtPiece } from '@/data/artworks';
import { ArtworkCard } from '@/components/ArtworkCard';
import { SEO } from '@/components/SEO';

export default function ArtistDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artworks, setArtworks] = useState<ArtPiece[]>([]);
  const [loadingArtworks, setLoadingArtworks] = useState(true);

  // Inquiry Modal state
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  // Tab selection state
  const [activeTab, setActiveTab] = useState<'bio' | 'style' | 'exhibitions' | 'works'>('bio');

  useEffect(() => {
    if (!id) return;
    const found = getArtistById(id) || getArtistByName(id);
    if (found) {
      setArtist(found);
    } else {
      // Fallback
      setArtist(null);
    }
  }, [id]);

  useEffect(() => {
    if (!artist) return;

    setLoadingArtworks(true);
    const found = getArtworksByArtist(artist.name);
    setArtworks(found);
    setLoadingArtworks(false);
  }, [artist]);

  if (!artist) {
    return (
      <div className="min-h-screen bg-ink-950 text-ink-50 pt-36 pb-24 text-center">
        <div className="container mx-auto px-4 max-w-md">
          <p className="font-serif text-2xl text-ink-200 mb-6">Artist Profile Not Found</p>
          <p className="text-sm text-ink-400 mb-8">
            The artist you are looking for may have been updated or moved.
          </p>
          <Link to="/artists" className="btn-gold px-6 py-2.5 text-xs rounded-sm inline-block">
            Return to Artist Roster
          </Link>
        </div>
      </div>
    );
  }

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setTimeout(() => {
      setShowInquiryModal(false);
      setInquirySubmitted(false);
      setInquiryForm({ name: '', email: '', phone: '', message: '' });
    }, 2500);
  };

  return (
    <>
      <SEO
        title={`${artist.name} — Artist Profile | NOUS ART`}
        description={artist.shortBio}
      />

      <div className="min-h-screen bg-ink-950 text-ink-50 pt-28 pb-24">
        {/* Top Back Navigation Bar */}
        <div className="container mx-auto px-4 md:px-8 mb-8">
          <Link
            to="/artists"
            className="inline-flex items-center gap-2 text-xs font-mono text-ink-300 hover:text-gold-300 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All Artists</span>
          </Link>
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-4 md:px-8 mb-16">
          <div className="glass-panel rounded-2xl border border-white/10 p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Portrait Column */}
            <div className="lg:col-span-5 relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-ink-900">
              <img
                src={artist.portrait}
                alt={artist.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-ink-950/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-gold-400 uppercase tracking-widest">
                {artist.discipline}
              </div>
            </div>

            {/* Profile Info Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-mono uppercase tracking-widest">
                <Sparkles size={13} />
                <span>NOUS ART Represented Artist</span>
              </div>

              <div>
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink-50 font-light tracking-tight leading-none mb-3">
                  {artist.name}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gold-400 font-mono">
                  <MapPin size={15} className="shrink-0" />
                  <span>{artist.location}</span>
                </div>
              </div>

              {/* Artist Quote */}
              <div className="p-5 rounded-xl bg-ink-900/80 border-l-4 border-gold-500/60 font-serif italic text-lg text-ink-200 leading-relaxed font-light">
                "{artist.quote}"
              </div>

              <p className="text-sm text-ink-300 leading-relaxed font-light">
                {artist.shortBio}
              </p>

              {/* Main Mediums Pills */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-ink-400 block">
                  Primary Mediums & Techniques
                </span>
                <div className="flex flex-wrap gap-2">
                  {artist.mainMediums.map((medium) => (
                    <span
                      key={medium}
                      className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-ink-200"
                    >
                      {medium}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="btn-gold flex items-center gap-2 !py-3 !px-6 text-xs rounded-sm"
                >
                  <Mail size={14} />
                  <span>Inquire About Acquisitions</span>
                </button>
                <a
                  href="#available-works"
                  className="btn-gold-outline flex items-center gap-2 !py-3 !px-6 text-xs rounded-sm"
                >
                  <span>View Available Artworks ({artworks.length})</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Tabbed Content Navigation */}
        <section className="container mx-auto px-4 md:px-8 mb-12">
          <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('bio')}
              className={`px-6 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-300 border-b-2 whitespace-nowrap ${
                activeTab === 'bio'
                  ? 'border-gold-500 text-gold-400 font-bold'
                  : 'border-transparent text-ink-400 hover:text-ink-200'
              }`}
            >
              Biography & Background
            </button>
            <button
              onClick={() => setActiveTab('style')}
              className={`px-6 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-300 border-b-2 whitespace-nowrap ${
                activeTab === 'style'
                  ? 'border-gold-500 text-gold-400 font-bold'
                  : 'border-transparent text-ink-400 hover:text-ink-200'
              }`}
            >
              Style & Philosophy
            </button>
            <button
              onClick={() => setActiveTab('exhibitions')}
              className={`px-6 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-300 border-b-2 whitespace-nowrap ${
                activeTab === 'exhibitions'
                  ? 'border-gold-500 text-gold-400 font-bold'
                  : 'border-transparent text-ink-400 hover:text-ink-200'
              }`}
            >
              Exhibitions & Museums ({artist.achievements.length})
            </button>
            <button
              onClick={() => setActiveTab('works')}
              className={`px-6 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-300 border-b-2 whitespace-nowrap ${
                activeTab === 'works'
                  ? 'border-gold-500 text-gold-400 font-bold'
                  : 'border-transparent text-ink-400 hover:text-ink-200'
              }`}
            >
              Catalog Works ({artworks.length})
            </button>
          </div>
        </section>

        {/* Tab 1: Biography & Background */}
        {activeTab === 'bio' && (
          <section className="container mx-auto px-4 md:px-8 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 glass-panel p-8 rounded-xl border border-white/10 space-y-6">
                <h2 className="font-display text-2xl text-ink-50 font-light border-b border-white/10 pb-4">
                  Artist Biography
                </h2>
                {artist.biography.map((paragraph, index) => (
                  <p key={index} className="font-serif text-lg text-ink-200 leading-relaxed font-light">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="glass-panel p-6 rounded-xl border border-white/10">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-gold-400 mb-3 flex items-center gap-2">
                    <BookOpen size={14} />
                    <span>Academic & Artistic Background</span>
                  </h3>
                  <p className="text-xs text-ink-200 leading-relaxed font-light">
                    {artist.artisticBackground}
                  </p>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-white/10">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-gold-400 mb-3 flex items-center gap-2">
                    <Sparkles size={14} />
                    <span>Representation Status</span>
                  </h3>
                  <p className="text-xs text-ink-300 leading-relaxed font-light mb-4">
                    Exclusive primary and secondary market representation by NOUS ART Gallery across global fairs and private placement.
                  </p>
                  <button
                    onClick={() => setShowInquiryModal(true)}
                    className="w-full btn-gold-outline py-2 text-xs rounded-sm"
                  >
                    Request Artist Dossier
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab 2: Style & Philosophy */}
        {activeTab === 'style' && (
          <section className="container mx-auto px-4 md:px-8 mb-16">
            <div className="glass-panel p-8 md:p-12 rounded-xl border border-white/10 max-w-4xl">
              <h2 className="font-display text-2xl text-ink-50 font-light border-b border-white/10 pb-4 mb-6">
                Style, Technique & Materiality
              </h2>

              <p className="font-serif text-xl text-ink-100 leading-relaxed font-light mb-8">
                {artist.styleAndApproach}
              </p>

              <h3 className="font-mono text-xs uppercase tracking-widest text-gold-400 mb-4">
                Signature Mediums
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {artist.mainMediums.map((medium, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3 text-sm text-ink-200"
                  >
                    <div className="w-2 h-2 rounded-full bg-gold-500 shrink-0" />
                    <span>{medium}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Tab 3: Exhibitions & Museum Achievements */}
        {activeTab === 'exhibitions' && (
          <section className="container mx-auto px-4 md:px-8 mb-16 max-w-4xl">
            <div className="glass-panel p-8 md:p-12 rounded-xl border border-white/10">
              <h2 className="font-display text-2xl text-ink-50 font-light border-b border-white/10 pb-6 mb-8 flex items-center gap-3">
                <Award className="text-gold-400 shrink-0" />
                <span>Exhibition Record & Museum Recognitions</span>
              </h2>

              <div className="relative border-l border-gold-500/30 pl-6 space-y-8 ml-3">
                {artist.achievements.map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-gold-500 border-4 border-ink-950" />
                    <span className="text-xs font-mono text-gold-400 tracking-wider font-bold block mb-1">
                      {item.year}
                    </span>
                    <h3 className="font-display text-lg text-ink-100 font-light">
                      {item.title}
                    </h3>
                    <p className="text-xs font-mono text-ink-300">{item.venue}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Tab 4 / Section: Available Artworks Catalog */}
        <section id="available-works" className="container mx-auto px-4 md:px-8 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl text-ink-50 font-light">
                Artworks by {artist.name}
              </h2>
              <p className="text-xs font-mono text-ink-300 mt-1">
                {artworks.length} available original {artworks.length === 1 ? 'piece' : 'pieces'}
              </p>
            </div>
            <Link to="/gallery" className="text-xs font-mono text-gold-400 hover:underline flex items-center gap-1">
              <span>View Full Gallery</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {loadingArtworks ? (
            <div className="text-center py-16">
              <p className="font-mono text-xs text-ink-400 animate-pulse">Loading artwork catalog...</p>
            </div>
          ) : artworks.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-xl border border-white/10">
              <p className="font-serif text-lg text-ink-300 mb-2">No active public listings currently available.</p>
              <p className="text-xs text-ink-400 mb-6 max-w-md mx-auto">
                Works by {artist.name} are often acquired through private placement. Contact our senior art advisors for unlisted acquisitions.
              </p>
              <button
                onClick={() => setShowInquiryModal(true)}
                className="btn-gold text-xs px-6 py-2.5 rounded-sm"
              >
                Inquire For Private Placement
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artworks.map((piece) => (
                <ArtworkCard key={piece.id} piece={piece} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Private Acquisition Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-xl">
          <div className="glass-panel p-8 rounded-2xl border border-white/20 max-w-lg w-full relative shadow-2xl animate-fade-in">
            <button
              onClick={() => setShowInquiryModal(false)}
              className="absolute top-4 right-4 text-ink-400 hover:text-ink-100 p-1"
            >
              <X size={18} />
            </button>

            {inquirySubmitted ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle size={48} className="text-gold-400 mx-auto" />
                <h3 className="font-display text-2xl text-ink-50 font-light">Inquiry Received</h3>
                <p className="text-xs text-ink-300 font-serif leading-relaxed">
                  Thank you for your interest in acquisitions by {artist.name}. A senior NOUS ART advisor will contact you within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block mb-1">
                    Private Advisory
                  </span>
                  <h3 className="font-display text-2xl text-ink-50 font-light">
                    Inquire About {artist.name}
                  </h3>
                  <p className="text-xs text-ink-300 mt-1 font-light">
                    Direct access to primary market releases, private collections, and custom commissions.
                  </p>
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-mono text-ink-300 uppercase text-[10px] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-ink-900 border border-white/10 rounded text-ink-100 focus:outline-none focus:border-gold-500/50"
                      placeholder="Collector Name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-ink-300 uppercase text-[10px] mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                        className="w-full px-3 py-2 bg-ink-900 border border-white/10 rounded text-ink-100 focus:outline-none focus:border-gold-500/50"
                        placeholder="email@domain.com"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-ink-300 uppercase text-[10px] mb-1">Phone (Optional)</label>
                      <input
                        type="tel"
                        value={inquiryForm.phone}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-ink-900 border border-white/10 rounded text-ink-100 focus:outline-none focus:border-gold-500/50"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-ink-300 uppercase text-[10px] mb-1">Inquiry / Request Details</label>
                    <textarea
                      rows={3}
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      className="w-full px-3 py-2 bg-ink-900 border border-white/10 rounded text-ink-100 focus:outline-none focus:border-gold-500/50"
                      placeholder="I am interested in acquiring works by this artist or requesting the private catalog..."
                    />
                  </div>

                  <button type="submit" className="w-full btn-gold py-3 text-xs rounded-sm font-bold">
                    Submit Private Inquiry
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
