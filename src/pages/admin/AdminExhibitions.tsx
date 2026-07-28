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
  Calendar,
  MapPin,
} from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { uploadToR2, deleteFromR2 } from '@/lib/r2Storage';
import { type Exhibition } from '@/data/exhibitions';
import { SEO } from '@/components/SEO';

const STATUSES: ('Current' | 'Upcoming' | 'Past')[] = ['Current', 'Upcoming', 'Past'];

export default function AdminExhibitions() {
  const { exhibitions, artworks, addExhibition, updateExhibition, deleteExhibition } = useCMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Exhibition>>({
    title: '',
    subtitle: '',
    curator: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    location: 'Main Gallery • Hall A',
    status: 'Current',
    coverImage: '',
    description: '',
    featuredArtworkIds: [],
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const filteredExhibitions = exhibitions.filter(
    (ex) =>
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.curator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingExhibition(null);
    setFormError(null);
    setFormData({
      title: '',
      subtitle: '',
      curator: 'Gallery Curator',
      startDate: '2026-06-01',
      endDate: '2026-09-30',
      location: 'Main Gallery • Hall A',
      status: 'Current',
      coverImage: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=1600',
      description: '',
      featuredArtworkIds: artworks.slice(0, 2).map((a) => a.id),
    });
    setShowModal(true);
  };

  const handleOpenEdit = (ex: Exhibition) => {
    setEditingExhibition(ex);
    setFormError(null);
    setFormData({ ...ex });
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const url = await uploadToR2(file, 'exhibitions');
      setFormData((prev) => ({ ...prev, coverImage: url }));
    } catch (err: any) {
      setUploadError(err.message || 'Exhibition cover upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.curator || !formData.coverImage) {
      setFormError('Veuillez remplir le Titre, le Curateur et l\'image de couverture.');
      return;
    }
    setFormError(null);

    if (editingExhibition) {
      updateExhibition(editingExhibition.id, formData);
    } else {
      addExhibition({
        title: formData.title || 'Untitled Exhibition',
        subtitle: formData.subtitle || '',
        curator: formData.curator || 'Gallery Curator',
        startDate: formData.startDate || '2026-06-01',
        endDate: formData.endDate || '2026-09-30',
        location: formData.location || 'Main Gallery',
        status: formData.status || 'Current',
        coverImage: formData.coverImage || '',
        description: formData.description || '',
        featuredArtworkIds: formData.featuredArtworkIds || [],
      });
    }

    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    const target = exhibitions.find((e) => e.id === id);
    if (target?.coverImage) {
      await deleteFromR2(target.coverImage);
    }
    deleteExhibition(id);
    setDeleteConfirmId(null);
  };

  return (
    <>
      <SEO title="Exhibition Management — NOUS ART CMS" description="Manage Exhibitions & Editorial Content" />

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 block mb-1">
              CMS Programme Management
            </span>
            <h1 className="font-display text-3xl font-light text-ink-50">
              Exhibitions <span className="font-serif italic gold-text-gradient font-normal">Manager</span>
            </h1>
          </div>

          <button
            onClick={handleOpenAdd}
            className="btn-gold flex items-center gap-2 py-2.5 px-5 text-xs rounded-xl font-bold shadow-lg"
          >
            <Plus size={16} />
            <span>Create Exhibition</span>
          </button>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex items-center justify-between gap-4 pb-4">
          <div className="relative min-w-[280px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Search exhibitions by title, curator, status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ink-900 border border-white/10 text-xs text-ink-100 placeholder-ink-400 focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <span className="text-xs font-mono text-ink-400">
            Total: {filteredExhibitions.length} {filteredExhibitions.length === 1 ? 'Exhibition' : 'Exhibitions'}
          </span>
        </div>

        {/* Exhibitions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExhibitions.map((exhibition) => (
            <div
              key={exhibition.id}
              className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between p-6 space-y-4 hover:border-gold-500/40 transition-all"
            >
              <div className="space-y-4">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-ink-900 border border-white/10">
                  <img
                    src={exhibition.coverImage}
                    alt={exhibition.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest border backdrop-blur-md ${
                      exhibition.status === 'Current'
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold'
                        : exhibition.status === 'Upcoming'
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold'
                        : 'bg-white/10 border-white/20 text-ink-300'
                    }`}
                  >
                    {exhibition.status}
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-xl text-ink-50 font-medium">{exhibition.title}</h3>
                  <p className="text-xs font-mono text-ink-400">Curated by {exhibition.curator}</p>
                </div>

                <div className="space-y-1 text-xs font-mono text-ink-300">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-gold-400" />
                    <span>
                      {exhibition.startDate} — {exhibition.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={12} className="text-gold-400" />
                    <span>{exhibition.location}</span>
                  </div>
                </div>

                <p className="text-xs text-ink-300 line-clamp-2 font-light">{exhibition.subtitle}</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-ink-400">
                  {exhibition.featuredArtworkIds?.length || 0} Artworks Mapped
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(exhibition)}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-ink-200 hover:text-gold-300 hover:border-gold-500/40 transition-all"
                    title="Edit Exhibition"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(exhibition.id)}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-ink-400 hover:text-red-400 hover:border-red-500/40 transition-all"
                    title="Delete Exhibition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Exhibition Modal */}
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
                {editingExhibition ? 'Edit Record' : 'Create New Exhibition'}
              </span>
              <h2 className="font-display text-2xl text-ink-50 font-light">
                {editingExhibition ? `Edit: ${editingExhibition.title}` : 'Add New Exhibition'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ink-300 uppercase text-[10px] mb-1">Exhibition Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50 font-sans"
                    placeholder="Exhibition Title"
                  />
                </div>

                <div>
                  <label className="block text-ink-300 uppercase text-[10px] mb-1">Curator *</label>
                  <input
                    type="text"
                    required
                    value={formData.curator || ''}
                    onChange={(e) => setFormData({ ...formData, curator: e.target.value })}
                    className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50"
                    placeholder="Curator Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink-300 uppercase text-[10px] mb-1">Subtitle / Curatorial Summary</label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50 font-sans"
                  placeholder="Short thematic subtitle..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-ink-300 uppercase text-[10px] mb-1">Status</label>
                  <select
                    value={formData.status || 'Current'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-ink-300 uppercase text-[10px] mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50"
                  />
                </div>

                <div>
                  <label className="block text-ink-300 uppercase text-[10px] mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink-300 uppercase text-[10px] mb-1">Gallery Location</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50"
                  placeholder="Main Gallery • Hall A"
                />
              </div>

              {/* Cloudflare R2 Cover Image Upload */}
              <div className="p-4 rounded-xl bg-ink-900/80 border border-white/10 space-y-3">
                <label className="block text-gold-400 uppercase text-[10px] font-bold flex items-center gap-1.5">
                  <Cloud size={14} />
                  <span>Cloudflare R2 Exhibition Cover Upload *</span>
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
                  <label className="block text-ink-400 text-[10px] mb-1">Or direct Cover Image URL:</label>
                  <input
                    type="text"
                    value={formData.coverImage || ''}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="w-full px-3 py-2 bg-ink-950 border border-white/10 rounded-lg text-ink-100 focus:outline-none text-[11px]"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink-300 uppercase text-[10px] mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50 font-sans"
                  placeholder="Full curatorial narrative..."
                />
              </div>

              {formError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                  {formError}
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-gold-outline py-2.5 px-5 rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold py-2.5 px-6 rounded-xl font-bold">
                  {editingExhibition ? 'Save Exhibition' : 'Publish Exhibition'}
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
              Are you sure you want to permanently remove this exhibition and Cloudflare R2 cover image?
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
                Delete Exhibition
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
