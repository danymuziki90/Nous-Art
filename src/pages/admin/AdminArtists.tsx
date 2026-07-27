import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Loader2,
  Search,
  Cloud,
  MapPin,
  Award,
  Sparkles,
} from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { uploadToR2, deleteFromR2 } from '@/lib/r2Storage';
import { type Artist } from '@/data/artists';
import { SEO } from '@/components/SEO';

const DISCIPLINES = ['Painting', 'Sculpture', 'Photography', 'Mixed Media', 'Drawing'];

export default function AdminArtists() {
  const { artists, addArtist, updateArtist, deleteArtist } = useCMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Artist>>({
    name: '',
    portrait: '',
    location: '',
    shortBio: '',
    biography: [''],
    artisticBackground: '',
    styleAndApproach: '',
    mainMediums: ['Oil on Canvas'],
    achievements: [{ year: '2025', title: 'Solo Exhibition', venue: 'NOUS ART Gallery' }],
    quote: '',
    discipline: 'Painting',
    featured: true,
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const filteredArtists = artists.filter(
    (artist) =>
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.discipline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingArtist(null);
    setFormData({
      name: '',
      portrait: '/artists/elena-marchetti.png',
      location: 'Milan, Italy • b. 1985',
      shortBio: 'Exploring atmospheric abstraction through layered pigments and spatial silence.',
      biography: [
        'Born in Milan, Italy. Specialized in fine art painting and mineral pigments at the Accademia di Brera.',
        'Her works evoke ancient architectural ruins and atmospheric weather systems.',
      ],
      artisticBackground: 'MFA in Fine Art Painting.',
      styleAndApproach: 'Lyrical Abstract Expressionism.',
      mainMediums: ['Oil & Mineral Pigments', 'Venetian Plaster'],
      achievements: [{ year: '2025', title: 'Solo Exhibition: Silent Earth', venue: 'Palazzo Reale, Milan' }],
      quote: 'Paint is compressed time and mineral memory speaking to the spirit.',
      discipline: 'Painting',
      featured: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (artist: Artist) => {
    setEditingArtist(artist);
    setFormData({ ...artist });
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const url = await uploadToR2(file, 'artists');
      setFormData((prev) => ({ ...prev, portrait: url }));
    } catch (err: any) {
      setUploadError(err.message || 'Portrait upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.portrait) {
      alert('Please fill in Artist Name and Portrait URL.');
      return;
    }

    if (editingArtist) {
      updateArtist(editingArtist.id, formData);
    } else {
      addArtist({
        name: formData.name || 'New Artist',
        portrait: formData.portrait || '',
        location: formData.location || '',
        shortBio: formData.shortBio || '',
        biography: formData.biography || [''],
        artisticBackground: formData.artisticBackground || '',
        styleAndApproach: formData.styleAndApproach || '',
        mainMediums: formData.mainMediums || ['Oil on Canvas'],
        achievements: formData.achievements || [],
        quote: formData.quote || '',
        discipline: formData.discipline || 'Painting',
        featured: !!formData.featured,
      });
    }

    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    const target = artists.find((a) => a.id === id);
    if (target?.portrait) {
      await deleteFromR2(target.portrait);
    }
    deleteArtist(id);
    setDeleteConfirmId(null);
  };

  return (
    <>
      <SEO title="Artist Roster Management — NOUS ART CMS" description="Manage Artist Roster" />

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 block mb-1">
              CMS Roster Management
            </span>
            <h1 className="font-display text-3xl font-light text-ink-50">
              Artist Roster <span className="font-serif italic gold-text-gradient font-normal">Manager</span>
            </h1>
          </div>

          <button
            onClick={handleOpenAdd}
            className="btn-gold flex items-center gap-2 py-2.5 px-5 text-xs rounded-xl font-bold shadow-lg"
          >
            <Plus size={16} />
            <span>Add New Artist</span>
          </button>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex items-center justify-between gap-4 pb-4">
          <div className="relative min-w-[280px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Search roster by artist name, location, discipline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ink-900 border border-white/10 text-xs text-ink-100 placeholder-ink-400 focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <span className="text-xs font-mono text-ink-400">
            Total: {filteredArtists.length} {filteredArtists.length === 1 ? 'Artist' : 'Artists'}
          </span>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => (
            <div
              key={artist.id}
              className="glass-panel rounded-2xl border border-white/10 overflow-hidden p-6 flex flex-col justify-between space-y-4 hover:border-gold-500/40 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={artist.portrait}
                    alt={artist.name}
                    className="w-16 h-16 rounded-full object-cover border border-white/10 shrink-0"
                  />
                  <div>
                    <h3 className="font-display text-xl text-ink-50 font-medium">{artist.name}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-gold-400 font-mono mt-0.5">
                      <MapPin size={12} className="shrink-0" />
                      <span>{artist.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-ink-300 line-clamp-3 font-light leading-relaxed">
                  {artist.shortBio}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                  {artist.mainMediums.slice(0, 3).map((medium) => (
                    <span
                      key={medium}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-ink-200"
                    >
                      {medium}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest">
                  {artist.discipline}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(artist)}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-ink-200 hover:text-gold-300 hover:border-gold-500/40 transition-all"
                    title="Edit Artist"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(artist.id)}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-ink-400 hover:text-red-400 hover:border-red-500/40 transition-all"
                    title="Delete Artist"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Artist Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-xl">
          <div className="glass-panel p-8 rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl animate-fade-in">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-ink-400 hover:text-ink-100 p-1"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block mb-1">
                {editingArtist ? 'Edit Profile' : 'Create New Profile'}
              </span>
              <h2 className="font-display text-2xl text-ink-50 font-light">
                {editingArtist ? `Edit: ${editingArtist.name}` : 'Add Artist to Roster'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ink-300 uppercase text-[10px] mb-1">Artist Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50 font-sans"
                    placeholder="Artist Full Name"
                  />
                </div>

                <div>
                  <label className="block text-ink-300 uppercase text-[10px] mb-1">Location & Origin</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50"
                    placeholder="Milan, Italy • b. 1985"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ink-300 uppercase text-[10px] mb-1">Discipline</label>
                  <select
                    value={formData.discipline || 'Painting'}
                    onChange={(e) => setFormData({ ...formData, discipline: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50"
                  >
                    {DISCIPLINES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-ink-300 uppercase text-[10px] mb-1">Main Mediums (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.mainMediums?.join(', ') || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mainMediums: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50"
                    placeholder="Oil on Canvas, Venetian Plaster"
                  />
                </div>
              </div>

              {/* Cloudflare R2 Portrait Upload */}
              <div className="p-4 rounded-xl bg-ink-900/80 border border-white/10 space-y-3">
                <label className="block text-gold-400 uppercase text-[10px] font-bold flex items-center gap-1.5">
                  <Cloud size={14} />
                  <span>Cloudflare R2 Studio Portrait Upload *</span>
                </label>

                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="text-xs text-ink-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-gold-500/10 file:text-gold-400 hover:file:bg-gold-500/20"
                  />
                  {uploading && <Loader2 size={16} className="animate-spin text-gold-400" />}
                </div>

                {uploadError && <p className="text-red-400 text-[10px]">{uploadError}</p>}

                <div>
                  <label className="block text-ink-400 text-[10px] mb-1">Or direct Portrait URL:</label>
                  <input
                    type="text"
                    value={formData.portrait || ''}
                    onChange={(e) => setFormData({ ...formData, portrait: e.target.value })}
                    className="w-full px-3 py-2 bg-ink-950 border border-white/10 rounded-lg text-ink-100 focus:outline-none text-[11px]"
                    placeholder="/artists/elena-marchetti.png"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink-300 uppercase text-[10px] mb-1">Short Bio</label>
                <input
                  type="text"
                  value={formData.shortBio || ''}
                  onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
                  className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50 font-sans"
                  placeholder="Summary for artist card..."
                />
              </div>

              <div>
                <label className="block text-ink-300 uppercase text-[10px] mb-1">Artist Quote</label>
                <input
                  type="text"
                  value={formData.quote || ''}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50 font-serif italic"
                  placeholder="Quote by the artist..."
                />
              </div>

              <div>
                <label className="block text-ink-300 uppercase text-[10px] mb-1">Artistic Background & Philosophy</label>
                <textarea
                  rows={3}
                  value={formData.artisticBackground || ''}
                  onChange={(e) => setFormData({ ...formData, artisticBackground: e.target.value })}
                  className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50 font-sans"
                  placeholder="Education, apprenticeships, and philosophy..."
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-gold-outline py-2.5 px-5 rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold py-2.5 px-6 rounded-xl font-bold">
                  {editingArtist ? 'Save Profile' : 'Publish Artist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-xl">
          <div className="glass-panel p-6 rounded-2xl border border-white/20 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <h3 className="font-display text-xl text-ink-50 font-light">Confirm Delete</h3>
            <p className="text-xs text-ink-300 font-sans leading-relaxed">
              Are you sure you want to permanently remove this artist profile and Cloudflare R2 portrait?
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-gold-outline py-2 px-4 text-xs rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 text-xs rounded-lg transition-colors"
              >
                Delete Artist
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
