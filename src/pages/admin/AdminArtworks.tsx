import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Loader2,
  Search,
  CheckCircle2,
  Cloud,
  Eye,
  Star,
} from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { uploadToR2, deleteFromR2 } from '@/lib/r2Storage';
import { type ArtPiece } from '@/data/artworks';
import { SEO } from '@/components/SEO';

const CATEGORIES = ['Painting', 'Sculpture', 'Photography', 'Mixed Media', 'Edition', 'Drawing'];

export default function AdminArtworks() {
  const { artworks, artists, addArtwork, updateArtwork, deleteArtwork } = useCMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPiece, setEditingPiece] = useState<ArtPiece | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ArtPiece>>({
    title: '',
    artist: '',
    description: '',
    year: new Date().getFullYear(),
    medium: '',
    dimensions: '',
    price: 10000,
    category: 'Painting',
    featured: true,
    media_type: 'image',
    image_url: '',
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const filteredArtworks = artworks.filter(
    (piece) =>
      piece.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      piece.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (piece.category && piece.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingPiece(null);
    setFormData({
      title: '',
      artist: artists[0]?.name || 'Elena Marchetti',
      description: '',
      year: new Date().getFullYear(),
      medium: 'Oil on Canvas',
      dimensions: '150 × 120 cm',
      price: 15000,
      category: 'Painting',
      featured: true,
      media_type: 'image',
      image_url: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=1600',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (piece: ArtPiece) => {
    setEditingPiece(piece);
    setFormData({ ...piece });
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const url = await uploadToR2(file, 'artworks');
      setFormData((prev) => ({ ...prev, image_url: url }));
    } catch (err: any) {
      setUploadError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.artist || !formData.image_url) {
      alert('Please fill in Title, Artist, and Image URL.');
      return;
    }

    if (editingPiece) {
      updateArtwork(editingPiece.id, formData);
    } else {
      addArtwork({
        title: formData.title || 'Untitled',
        artist: formData.artist || 'Unknown Artist',
        description: formData.description || '',
        year: Number(formData.year) || new Date().getFullYear(),
        medium: formData.medium || '',
        dimensions: formData.dimensions || '',
        price: Number(formData.price) || 0,
        category: formData.category || 'Painting',
        featured: !!formData.featured,
        media_type: formData.media_type || 'image',
        image_url: formData.image_url || '',
      });
    }

    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    const target = artworks.find((a) => a.id === id);
    if (target?.image_url) {
      await deleteFromR2(target.image_url);
    }
    deleteArtwork(id);
    setDeleteConfirmId(null);
  };

  return (
    <>
      <SEO title="Artwork Catalog Management — NOUS ART CMS" description="Manage Artwork Catalog" />

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 block mb-1">
              CMS Content Management
            </span>
            <h1 className="font-display text-3xl font-light text-ink-50">
              Artwork Catalog <span className="font-serif italic gold-text-gradient font-normal">Manager</span>
            </h1>
          </div>

          <button
            onClick={handleOpenAdd}
            className="btn-gold flex items-center gap-2 py-2.5 px-5 text-xs rounded-xl font-bold shadow-lg"
          >
            <Plus size={16} />
            <span>Add New Artwork</span>
          </button>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex items-center justify-between gap-4 pb-4">
          <div className="relative min-w-[280px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Search catalog by title, artist, medium..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ink-900 border border-white/10 text-xs text-ink-100 placeholder-ink-400 focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <span className="text-xs font-mono text-ink-400">
            Total: {filteredArtworks.length} {filteredArtworks.length === 1 ? 'Artwork' : 'Artworks'}
          </span>
        </div>

        {/* Artworks Table / Grid */}
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-ink-900/80 border-b border-white/10 uppercase tracking-widest text-gold-400">
                <tr>
                  <th className="p-4">Artwork</th>
                  <th className="p-4">Artist</th>
                  <th className="p-4">Medium</th>
                  <th className="p-4">Dimensions</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredArtworks.map((piece) => (
                  <tr key={piece.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={piece.image_url}
                          alt={piece.title}
                          className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                        />
                        <div>
                          <p className="font-display text-sm text-ink-50 font-medium">{piece.title}</p>
                          <p className="text-[10px] text-ink-400">{piece.year || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-ink-200 font-sans font-medium">{piece.artist}</td>
                    <td className="p-4 text-ink-300">{piece.medium || 'N/A'}</td>
                    <td className="p-4 text-ink-300">{piece.dimensions || 'N/A'}</td>
                    <td className="p-4 text-gold-400 font-bold">
                      ${piece.price?.toLocaleString('en-US') || 'P.O.R.'}
                    </td>
                    <td className="p-4">
                      {piece.featured ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[10px]">
                          <Star size={10} /> Featured
                        </span>
                      ) : (
                        <span className="text-[10px] text-ink-400">Standard</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(piece)}
                          className="p-2 rounded-lg bg-white/5 border border-white/10 text-ink-200 hover:text-gold-300 hover:border-gold-500/40 transition-all"
                          title="Edit Artwork"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(piece.id)}
                          className="p-2 rounded-lg bg-white/5 border border-white/10 text-ink-400 hover:text-red-400 hover:border-red-500/40 transition-all"
                          title="Delete Artwork"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Artwork Modal */}
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
                {editingPiece ? 'Edit Record' : 'Create New Record'}
              </span>
              <h2 className="font-display text-2xl text-ink-50 font-light">
                {editingPiece ? `Edit: ${editingPiece.title}` : 'Add Artwork to Catalog'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ink-300 uppercase text-[10px] mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50 font-sans"
                    placeholder="Artwork Title"
                  />
                </div>

                <div>
                  <label className="block text-ink-300 uppercase text-[10px] mb-1">Artist *</label>
                  <select
                    value={formData.artist || ''}
                    onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                    className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50 font-sans"
                  >
                    {artists.map((a) => (
                      <option key={a.id} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-ink-300 uppercase text-[10px] mb-1">Category</label>
                  <select
                    value={formData.category || 'Painting'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-ink-300 uppercase text-[10px] mb-1">Price (USD)</label>
                  <input
                    type="number"
                    value={formData.price ?? ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50"
                    placeholder="15000"
                  />
                </div>

                <div>
                  <label className="block text-ink-300 uppercase text-[10px] mb-1">Year</label>
                  <input
                    type="number"
                    value={formData.year ?? ''}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50"
                    placeholder="2025"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ink-300 uppercase text-[10px] mb-1">Medium</label>
                  <input
                    type="text"
                    value={formData.medium || ''}
                    onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                    className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50"
                    placeholder="Oil & Beeswax on Linen"
                  />
                </div>

                <div>
                  <label className="block text-ink-300 uppercase text-[10px] mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={formData.dimensions || ''}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50"
                    placeholder="180 × 140 cm"
                  />
                </div>
              </div>

              {/* Cloudflare R2 File Upload */}
              <div className="p-4 rounded-xl bg-ink-900/80 border border-white/10 space-y-3">
                <label className="block text-gold-400 uppercase text-[10px] font-bold flex items-center gap-1.5">
                  <Cloud size={14} />
                  <span>Cloudflare R2 Media Storage Upload *</span>
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
                  <label className="block text-ink-400 text-[10px] mb-1">Or direct Image URL:</label>
                  <input
                    type="text"
                    value={formData.image_url || ''}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3 py-2 bg-ink-950 border border-white/10 rounded-lg text-ink-100 focus:outline-none text-[11px]"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink-300 uppercase text-[10px] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50 font-sans"
                  placeholder="Artwork description and provenance details..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={!!formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded bg-ink-900 border-white/20 text-gold-500 focus:ring-0"
                />
                <label htmlFor="featured-check" className="text-ink-200 text-xs font-sans">
                  Feature this artwork on Home & Gallery spotlights
                </label>
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
                  {editingPiece ? 'Save Changes' : 'Publish Artwork'}
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
              Are you sure you want to permanently remove this artwork from the catalog and Cloudflare R2 storage?
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
                Delete Artwork
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
