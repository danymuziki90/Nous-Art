import { useState } from 'react';
import {
  Settings,
  Cloud,
  Upload,
  Loader2,
  Save,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  Plus,
  Pencil,
  Trash2,
  X,
  Palette,
  Box,
  Camera,
  Stamp,
  Feather,
  Sparkles,
} from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { uploadToR2, deleteFromR2 } from '@/lib/r2Storage';
import { type MediumCategory } from '@/data/mediums';
import { SEO } from '@/components/SEO';

const ICON_OPTIONS = [
  { name: 'Palette', icon: Palette },
  { name: 'Box', icon: Box },
  { name: 'Camera', icon: Camera },
  { name: 'Stamp', icon: Stamp },
  { name: 'Feather', icon: Feather },
  { name: 'Sparkles', icon: Sparkles },
];

export default function AdminSettings() {
  const {
    siteSettings,
    updateSiteSettings,
    mediumCategories,
    addMediumCategory,
    updateMediumCategory,
    deleteMediumCategory,
  } = useCMS();

  // Hero State
  const [heroType, setHeroType] = useState<'image' | 'video'>(siteSettings.hero_media_type || 'image');
  const [heroUrl, setHeroUrl] = useState<string>(siteSettings.hero_media_url || '');
  const [heroUploading, setHeroUploading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Medium Category Modal State
  const [showMediumModal, setShowMediumModal] = useState(false);
  const [editingMedium, setEditingMedium] = useState<MediumCategory | null>(null);
  const [mediumFormData, setMediumFormData] = useState<Partial<MediumCategory>>({
    title: '',
    medium: 'Painting',
    count: '20+ Works',
    tagline: '',
    image: '',
    featuredArtist: '',
    iconName: 'Palette',
  });
  const [mediumUploading, setMediumUploading] = useState(false);

  // Hero File Upload
  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setHeroUploading(true);
    try {
      const url = await uploadToR2(file, 'hero');
      setHeroUrl(url);
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setHeroUploading(false);
    }
  };

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      hero_media_type: heroType,
      hero_media_url: heroUrl,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Medium Category Modal Handlers
  const handleOpenAddMedium = () => {
    setEditingMedium(null);
    setMediumFormData({
      title: '',
      medium: 'Painting',
      count: '25+ Works',
      tagline: '',
      image: 'https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?auto=compress&cs=tinysrgb&w=1600',
      featuredArtist: 'Gallery Master',
      iconName: 'Palette',
    });
    setShowMediumModal(true);
  };

  const handleOpenEditMedium = (med: MediumCategory) => {
    setEditingMedium(med);
    setMediumFormData({ ...med });
    setShowMediumModal(true);
  };

  const handleMediumFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediumUploading(true);
    try {
      const url = await uploadToR2(file, 'mediums');
      setMediumFormData((prev) => ({ ...prev, image: url }));
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setMediumUploading(false);
    }
  };

  const handleSaveMedium = (e: React.FormEvent) => {
    e.preventDefault();

    if (!mediumFormData.title || !mediumFormData.image) {
      alert('Please enter a Category Title and Image URL.');
      return;
    }

    if (editingMedium) {
      updateMediumCategory(editingMedium.id, mediumFormData);
    } else {
      addMediumCategory({
        title: mediumFormData.title || 'New Category',
        medium: mediumFormData.medium || 'Painting',
        count: mediumFormData.count || '10+ Works',
        tagline: mediumFormData.tagline || '',
        image: mediumFormData.image || '',
        featuredArtist: mediumFormData.featuredArtist || 'Gallery Artist',
        iconName: (mediumFormData.iconName as any) || 'Palette',
      });
    }

    setShowMediumModal(false);
  };

  const handleDeleteMedium = async (id: string) => {
    if (confirm('Are you sure you want to delete this medium category?')) {
      const target = mediumCategories.find((m) => m.id === id);
      if (target?.image) {
        await deleteFromR2(target.image);
      }
      deleteMediumCategory(id);
    }
  };

  return (
    <>
      <SEO title="Site Settings & Marketplace Mediums — NOUS ART CMS" description="Configure Hero Banner and Browse Marketplace Medium Categories" />

      <div className="space-y-12 max-w-5xl">
        {/* Header */}
        <div className="pb-6 border-b border-white/10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 block mb-1">
            CMS System & Marketplace Configuration
          </span>
          <h1 className="font-display text-3xl font-light text-ink-50">
            Site Settings & <span className="font-serif italic gold-text-gradient font-normal">Browse Marketplace</span>
          </h1>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Settings successfully updated and synchronized to public website!</span>
          </div>
        )}

        {/* --- SECTION 1: HERO BANNER SETTINGS --- */}
        <form onSubmit={handleSaveHero} className="space-y-6 font-mono text-xs">
          <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6">
            <h2 className="font-display text-2xl text-ink-50 font-light border-b border-white/10 pb-4 flex items-center gap-2">
              <Settings size={20} className="text-gold-400" />
              <span>Public Homepage Hero Media</span>
            </h2>

            <div>
              <label className="block text-ink-300 uppercase text-[10px] mb-2">Select Hero Media Type</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setHeroType('image')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all ${
                    heroType === 'image'
                      ? 'bg-gold-500/20 border-gold-500/50 text-gold-300 font-bold'
                      : 'bg-white/5 border-white/10 text-ink-300'
                  }`}
                >
                  <ImageIcon size={16} />
                  <span>Image Banner</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHeroType('video')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all ${
                    heroType === 'video'
                      ? 'bg-gold-500/20 border-gold-500/50 text-gold-300 font-bold'
                      : 'bg-white/5 border-white/10 text-ink-300'
                  }`}
                >
                  <Film size={16} />
                  <span>Video Background</span>
                </button>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-ink-900/80 border border-white/10 space-y-3">
              <label className="block text-gold-400 uppercase text-[10px] font-bold flex items-center gap-1.5">
                <Cloud size={14} />
                <span>Upload New Hero Media to Cloudflare R2</span>
              </label>

              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept={heroType === 'video' ? 'video/*' : 'image/*'}
                  onChange={handleHeroFileUpload}
                  className="text-xs text-ink-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-gold-500/10 file:text-gold-400 hover:file:bg-gold-500/20"
                />
                {heroUploading && <Loader2 size={16} className="animate-spin text-gold-400" />}
              </div>

              <div>
                <label className="block text-ink-400 text-[10px] mb-1">Direct Media URL:</label>
                <input
                  type="text"
                  value={heroUrl}
                  onChange={(e) => setHeroUrl(e.target.value)}
                  className="w-full px-3 py-2.5 bg-ink-950 border border-white/10 rounded-xl text-ink-100 focus:outline-none text-[11px]"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-ink-400 text-[10px] mb-2 uppercase">Hero Media Preview</label>
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-white/10 bg-ink-900">
                {heroType === 'video' ? (
                  <video src={heroUrl} autoPlay loop muted className="w-full h-full object-cover" />
                ) : (
                  <img src={heroUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" className="btn-gold flex items-center gap-2 py-3 px-8 rounded-xl font-bold">
                <Save size={16} />
                <span>Save Site Settings</span>
              </button>
            </div>
          </div>
        </form>

        {/* --- SECTION 2: BROWSE MARKETPLACE MEDIUM SHOWCASE MANAGER --- */}
        <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="font-display text-2xl text-ink-50 font-light flex items-center gap-2">
                <Sparkles size={20} className="text-gold-400" />
                <span>"Browse Marketplace – Explore Art through its Mediums" Section</span>
              </h2>
              <p className="text-xs font-mono text-ink-400 mt-1">
                Manage the categories displayed in the homepage bento grid section.
              </p>
            </div>

            <button
              onClick={handleOpenAddMedium}
              className="btn-gold flex items-center gap-2 py-2.5 px-4 text-xs rounded-xl font-bold shrink-0"
            >
              <Plus size={16} />
              <span>Add Medium Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mediumCategories.map((med) => {
              const iconObj = ICON_OPTIONS.find((i) => i.name === med.iconName);
              const IconComp = iconObj?.icon || Palette;

              return (
                <div
                  key={med.id}
                  className="glass-panel p-5 rounded-xl border border-white/10 flex flex-col justify-between space-y-4 hover:border-gold-500/40 transition-all"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-ink-900 border border-white/10">
                      <img src={med.image} alt={med.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 p-2 rounded-lg bg-ink-950/80 backdrop-blur-md text-gold-400">
                        <IconComp size={16} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-xl text-ink-50 font-medium">{med.title}</h3>
                        <span className="text-[10px] font-mono text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
                          {med.count}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-ink-400">Medium: {med.medium}</p>
                    </div>

                    <p className="text-xs text-ink-300 font-sans line-clamp-2 leading-relaxed">
                      {med.tagline}
                    </p>

                    <p className="text-[11px] font-mono text-ink-400">
                      Featured Artist: <span className="text-ink-200">{med.featuredArtist}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEditMedium(med)}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-ink-200 hover:text-gold-300 hover:border-gold-500/40 transition-all"
                      title="Edit Category"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteMedium(med.id)}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-ink-400 hover:text-red-400 hover:border-red-500/40 transition-all"
                      title="Delete Category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add / Edit Medium Modal */}
      {showMediumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-xl">
          <div className="glass-panel p-8 rounded-2xl border border-white/20 max-w-xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl animate-fade-in font-mono text-xs">
            <button
              onClick={() => setShowMediumModal(false)}
              className="absolute top-4 right-4 text-ink-400 hover:text-ink-100 p-1"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span className="text-[10px] text-gold-400 uppercase tracking-widest block mb-1">
                {editingMedium ? 'Edit Category' : 'Create New Category'}
              </span>
              <h2 className="font-display text-2xl text-ink-50 font-light">
                {editingMedium ? `Edit: ${editingMedium.title}` : 'Add Medium Category'}
              </h2>
            </div>

            <form onSubmit={handleSaveMedium} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ink-300 uppercase text-[10px] mb-1">Display Title *</label>
                  <input
                    type="text"
                    required
                    value={mediumFormData.title || ''}
                    onChange={(e) => setMediumFormData({ ...mediumFormData, title: e.target.value })}
                    className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50 font-sans"
                    placeholder="Paintings / Sculpture"
                  />
                </div>

                <div>
                  <label className="block text-ink-300 uppercase text-[10px] mb-1">Medium Filter Name *</label>
                  <input
                    type="text"
                    required
                    value={mediumFormData.medium || ''}
                    onChange={(e) => setMediumFormData({ ...mediumFormData, medium: e.target.value })}
                    className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50"
                    placeholder="Painting / Sculpture / Photography"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ink-300 uppercase text-[10px] mb-1">Count Tagline</label>
                  <input
                    type="text"
                    value={mediumFormData.count || ''}
                    onChange={(e) => setMediumFormData({ ...mediumFormData, count: e.target.value })}
                    className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50"
                    placeholder="45+ Original Works"
                  />
                </div>

                <div>
                  <label className="block text-ink-300 uppercase text-[10px] mb-1">Featured Artist</label>
                  <input
                    type="text"
                    value={mediumFormData.featuredArtist || ''}
                    onChange={(e) => setMediumFormData({ ...mediumFormData, featuredArtist: e.target.value })}
                    className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50 font-sans"
                    placeholder="Elena Marchetti"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink-300 uppercase text-[10px] mb-1">Category Icon</label>
                <select
                  value={mediumFormData.iconName || 'Palette'}
                  onChange={(e) => setMediumFormData({ ...mediumFormData, iconName: e.target.value as any })}
                  className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50"
                >
                  {ICON_OPTIONS.map((i) => (
                    <option key={i.name} value={i.name}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cloudflare R2 Cover Image Upload */}
              <div className="p-4 rounded-xl bg-ink-900/80 border border-white/10 space-y-3">
                <label className="block text-gold-400 uppercase text-[10px] font-bold flex items-center gap-1.5">
                  <Cloud size={14} />
                  <span>Cloudflare R2 Category Image Upload *</span>
                </label>

                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMediumFileUpload}
                    className="text-xs text-ink-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-gold-500/10 file:text-gold-400 hover:file:bg-gold-500/20"
                  />
                  {mediumUploading && <Loader2 size={16} className="animate-spin text-gold-400" />}
                </div>

                <div>
                  <label className="block text-ink-400 text-[10px] mb-1">Or direct Image URL:</label>
                  <input
                    type="text"
                    value={mediumFormData.image || ''}
                    onChange={(e) => setMediumFormData({ ...mediumFormData, image: e.target.value })}
                    className="w-full px-3 py-2 bg-ink-950 border border-white/10 rounded-lg text-ink-100 focus:outline-none text-[11px]"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink-300 uppercase text-[10px] mb-1">Tagline / Description</label>
                <textarea
                  rows={3}
                  value={mediumFormData.tagline || ''}
                  onChange={(e) => setMediumFormData({ ...mediumFormData, tagline: e.target.value })}
                  className="w-full px-3 py-2.5 bg-ink-900 border border-white/10 rounded-xl text-ink-100 focus:outline-none focus:border-gold-500/50 font-sans"
                  placeholder="Short description of the medium style..."
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowMediumModal(false)}
                  className="btn-gold-outline py-2.5 px-5 rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold py-2.5 px-6 rounded-xl font-bold">
                  {editingMedium ? 'Save Category' : 'Publish Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
