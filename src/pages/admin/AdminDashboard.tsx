import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Pencil, Trash2, X, Star, Upload, Loader2, Film, ImageIcon, Sparkles, ShieldCheck, Cloud } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase, type ArtPiece, type SiteSettings } from '@/lib/supabase';
import { isR2Configured, uploadToR2 } from '@/lib/r2';

interface FormState {
  title: string;
  artist: string;
  description: string;
  year: string;
  medium: string;
  dimensions: string;
  price: string;
  category: string;
  featured: boolean;
  media_type: 'image' | 'video';
}

const emptyForm: FormState = {
  title: '', artist: '', description: '', year: '', medium: '', dimensions: '', price: '', category: '', featured: false, media_type: 'image',
};

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [pieces, setPieces] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [heroSettings, setHeroSettings] = useState<SiteSettings | null>(null);
  const [heroMediaType, setHeroMediaType] = useState<'image' | 'video'>('image');
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string>('');
  const [heroSaving, setHeroSaving] = useState(false);

  const loadPieces = () => {
    supabase
      .from('art_pieces')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPieces(data ?? []);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPieces();
    supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setHeroSettings(data);
          setHeroMediaType(data.hero_media_type);
          if (data.hero_media_url) setHeroPreview(data.hero_media_url);
        }
      });
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setMediaFile(null);
    setMediaPreview('');
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  const startEdit = (p: ArtPiece) => {
    setForm({
      title: p.title,
      artist: p.artist,
      description: p.description ?? '',
      year: p.year?.toString() ?? '',
      medium: p.medium ?? '',
      dimensions: p.dimensions ?? '',
      price: p.price?.toString() ?? '',
      category: p.category ?? '',
      featured: p.featured,
      media_type: p.media_type ?? 'image',
    });
    setMediaPreview(p.image_url);
    setEditingId(p.id);
    setShowForm(true);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const switchMediaType = (type: 'image' | 'video') => {
    setForm({ ...form, media_type: type });
    setMediaFile(null);
    setMediaPreview('');
  };

  const uploadMedia = async (file: File, type: 'image' | 'video'): Promise<string> => {
    if (isR2Configured()) {
      try {
        const folder = type === 'video' ? 'art-videos' : 'art-images';
        return await uploadToR2(file, folder);
      } catch (r2Err) {
        console.warn('Cloudflare R2 Upload failed, falling back to Supabase storage:', r2Err);
      }
    }
    const bucket = type === 'video' ? 'art-videos' : 'art-images';
    const ext = file.name.split('.').pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: '3600', upsert: false });
    if (upErr) throw new Error(upErr.message);
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let mediaUrl = mediaPreview;

      if (mediaFile) {
        mediaUrl = await uploadMedia(mediaFile, form.media_type);
      } else if (!mediaUrl && !editingId) {
        throw new Error(`Please select a ${form.media_type === 'video' ? 'video' : 'image'} file.`);
      }

      const payload = {
        title: form.title,
        artist: form.artist,
        description: form.description || null,
        year: form.year ? parseInt(form.year, 10) : null,
        medium: form.medium || null,
        dimensions: form.dimensions || null,
        price: form.price ? parseFloat(form.price) : null,
        category: form.category || null,
        featured: form.featured,
        media_type: form.media_type,
        image_url: mediaUrl,
      };

      if (editingId) {
        const { error: err } = await supabase.from('art_pieces').update(payload).eq('id', editingId);
        if (err) throw new Error(err.message);
      } else {
        const { error: err } = await supabase.from('art_pieces').insert(payload);
        if (err) throw new Error(err.message);
      }

      resetForm();
      loadPieces();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) return;
    const { error } = await supabase.from('art_pieces').delete().eq('id', id);
    if (error) { setError(error.message); return; }
    loadPieces();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  const onHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
  };

  const switchHeroMediaType = (type: 'image' | 'video') => {
    setHeroMediaType(type);
    setHeroFile(null);
    setHeroPreview(heroSettings?.hero_media_url ?? '');
  };

  const saveHero = async () => {
    setHeroSaving(true);
    setError(null);
    try {
      let url = heroPreview;
      if (heroFile) {
        url = await uploadMedia(heroFile, heroMediaType);
      }
      const payload = { hero_media_url: url, hero_media_type: heroMediaType, updated_at: new Date().toISOString() };
      const { error: err } = await supabase.from('site_settings').upsert({ id: 1, ...payload }).eq('id', 1);
      if (err) throw new Error(err.message);
      setHeroFile(null);
      setHeroSettings({ id: 1, ...payload });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save Hero media.');
    } finally {
      setHeroSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 bg-ink-950 text-ink-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div>
            <div className="text-gold-400 text-xs uppercase tracking-[0.3em] font-semibold mb-2">
              <span>Dashboard</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-ink-50 font-light">
              Collection <span className="font-serif italic gold-text-gradient">Management</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <p className="text-xs text-ink-300 font-mono">Signed in as: {user?.email}</p>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono ${
                isR2Configured() 
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' 
                  : 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
              }`}>
                <Cloud size={12} />
                {isR2Configured() ? 'Cloudflare R2 (Active)' : 'Supabase Storage'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="btn-gold rounded-sm group flex items-center gap-2 !py-3 !px-5"
            >
              <Plus size={16} />
              <span>Add New Artwork</span>
            </button>
            <button
              onClick={handleSignOut}
              className="btn-outline-gold rounded-sm group flex items-center gap-2 !py-3 !px-5 hover:!border-red-400 hover:!text-red-400"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-4 font-mono">
            {error}
          </div>
        )}

        {/* Hero Media Manager Panel */}
        <div className="mb-14 glass-panel p-6 md:p-8 rounded-xl border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-gold-400 text-xs uppercase tracking-widest font-semibold mb-1">
                <span>Admin Privileges</span>
              </div>
              <h2 className="font-display text-2xl text-ink-50 font-light">Hero Media Header</h2>
              <p className="text-xs text-ink-300 font-light">Choose an HD image or video clip for the home page landing section background.</p>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => switchHeroMediaType('image')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs uppercase tracking-widest font-medium transition-all ${
                heroMediaType === 'image'
                  ? 'bg-gold-gradient text-ink-950 font-semibold'
                  : 'bg-ink-900 border border-white/10 text-ink-200 hover:text-ink-50'
              }`}
            >
              <ImageIcon size={14} /> Image
            </button>
            <button
              type="button"
              onClick={() => switchHeroMediaType('video')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs uppercase tracking-widest font-medium transition-all ${
                heroMediaType === 'video'
                  ? 'bg-gold-gradient text-ink-950 font-semibold'
                  : 'bg-ink-900 border border-white/10 text-ink-200 hover:text-ink-50'
              }`}
            >
              <Film size={14} /> Video Clip
            </button>
          </div>

          <div className="mb-6">
            {heroPreview ? (
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-ink-900 border border-white/10 group">
                {heroMediaType === 'video' ? (
                  <video src={heroPreview} controls muted className="w-full h-full object-cover" />
                ) : (
                  <img src={heroPreview} alt="Hero preview" className="w-full h-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => { setHeroFile(null); setHeroPreview(''); }}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-ink-950/80 border border-white/10 flex items-center justify-center text-ink-100 hover:text-red-400"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-3 aspect-[16/9] rounded-lg border border-dashed border-white/20 hover:border-gold-500/60 bg-ink-900/50 cursor-pointer transition-all">
                {heroMediaType === 'video' ? <Film className="text-gold-400" size={28} /> : <Upload className="text-gold-400" size={28} />}
                <span className="text-xs text-ink-200 uppercase tracking-widest">
                  Click to upload a {heroMediaType === 'video' ? 'video clip (MP4, WebM)' : 'image file'}
                </span>
                <input
                  type="file"
                  accept={heroMediaType === 'video' ? 'video/*' : 'image/*'}
                  onChange={onHeroFileChange}
                  className="hidden"
                />
              </label>
            )}
            {heroPreview && !heroFile && (
              <label className="mt-3 inline-flex items-center gap-2 text-xs text-ink-200 hover:text-gold-300 cursor-pointer">
                <Upload size={14} /> Replace {heroMediaType === 'video' ? 'video' : 'image'} file
                <input
                  type="file"
                  accept={heroMediaType === 'video' ? 'video/*' : 'image/*'}
                  onChange={onHeroFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <button
            onClick={saveHero}
            disabled={heroSaving || !heroPreview}
            className="btn-gold rounded-sm inline-flex items-center gap-2 !py-3 !px-6 disabled:opacity-50"
          >
            {heroSaving ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            <span>Save Hero Media</span>
          </button>
        </div>

        {/* Modal Artwork Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-ink-950/90 backdrop-blur-xl flex items-start justify-center overflow-y-auto py-10 px-4">
            <div className="relative w-full max-w-3xl glass-panel bg-ink-950 border border-white/10 rounded-2xl my-auto shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="font-display text-2xl text-ink-50 font-light">
                  {editingId ? 'Edit Artwork' : 'Add New Artwork to Catalogue'}
                </h2>
                <button onClick={resetForm} className="w-9 h-9 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-ink-200 hover:text-gold-300">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* Format toggle */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-ink-200 mb-3 font-medium">Media Format</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => switchMediaType('image')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-xs uppercase tracking-widest font-medium transition-all ${
                        form.media_type === 'image' ? 'bg-gold-gradient text-ink-950 font-semibold' : 'bg-ink-900 border border-white/10 text-ink-200'
                      }`}
                    >
                      <ImageIcon size={15} /> Image / Painting
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMediaType('video')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-xs uppercase tracking-widest font-medium transition-all ${
                        form.media_type === 'video' ? 'bg-gold-gradient text-ink-950 font-semibold' : 'bg-ink-900 border border-white/10 text-ink-200'
                      }`}
                    >
                      <Film size={15} /> Video Work
                    </button>
                  </div>
                </div>

                {/* Upload Section */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-ink-200 mb-3 font-medium">
                    {form.media_type === 'video' ? 'Artwork Video File' : 'Artwork HD Image'}
                  </label>
                  {mediaPreview ? (
                    <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-ink-900 border border-white/10 group">
                      {form.media_type === 'video' ? (
                        <video src={mediaPreview} controls className="w-full h-full object-cover" />
                      ) : (
                        <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => { setMediaFile(null); setMediaPreview(''); }}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-ink-950/80 border border-white/10 flex items-center justify-center text-ink-100 hover:text-red-400"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-3 aspect-[16/10] rounded-lg border border-dashed border-white/20 hover:border-gold-500/60 bg-ink-900/50 cursor-pointer transition-all">
                      {form.media_type === 'video' ? <Film className="text-gold-400" size={28} /> : <Upload className="text-gold-400" size={28} />}
                      <span className="text-xs text-ink-200 uppercase tracking-widest">
                        Select a {form.media_type === 'video' ? 'video file (MP4, WebM)' : 'image file'}
                      </span>
                      <input
                        type="file"
                        accept={form.media_type === 'video' ? 'video/*' : 'image/*'}
                        onChange={onFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  {mediaPreview && !mediaFile && (
                    <label className="mt-3 inline-flex items-center gap-2 text-xs text-ink-200 hover:text-gold-300 cursor-pointer">
                      <Upload size={14} /> Replace visual element
                      <input
                        type="file"
                        accept={form.media_type === 'video' ? 'video/*' : 'image/*'}
                        onChange={onFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Artwork Title" required value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Ex: Composition No. 7" />
                  <Field label="Artist" required value={form.artist} onChange={(v) => setForm({ ...form, artist: v })} placeholder="Ex: Jean-Luc Moreau" />
                  <Field label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} placeholder="Painting, Sculpture, Print..." />
                  <Field label="Creation Year" value={form.year} onChange={(v) => setForm({ ...form, year: v })} placeholder="2024" />
                  <Field label="Medium & Technique" value={form.medium} onChange={(v) => setForm({ ...form, medium: v })} placeholder="Oil on canvas" />
                  <Field label="Dimensions" value={form.dimensions} onChange={(v) => setForm({ ...form, dimensions: v })} placeholder="120 x 90 cm" />
                  <Field label="Price (USD)" value={form.price} onChange={(v) => setForm({ ...form, price: v })} placeholder="Leave empty if Price on Request" />
                  
                  <div className="flex items-end pt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, featured: !form.featured })}
                        className={`w-12 h-6 rounded-full transition-colors relative ${form.featured ? 'bg-gold-gradient' : 'bg-ink-800 border border-white/10'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-ink-950 transition-transform ${form.featured ? 'translate-x-6' : ''}`} />
                      </button>
                      <span className="text-xs uppercase tracking-widest text-ink-200 flex items-center gap-1.5 font-medium">
                        <Star size={14} className={form.featured ? 'text-gold-400 fill-gold-400' : 'text-ink-400'} /> Feature on Home Page
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-ink-200 mb-2 font-medium">Editorial Description</label>
                  <textarea
                    rows={4}
                    placeholder="Provide artwork details and provenance..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-ink-900 border border-white/10 rounded-md px-4 py-3 text-ink-50 placeholder-ink-300 focus:outline-none focus:border-gold-500 text-sm resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-gold rounded-sm group flex items-center gap-2 !py-3.5 !px-8 disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                    <span>{editingId ? 'Save Changes' : 'Create Artwork'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-outline-gold rounded-sm !py-3.5 !px-8"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Pieces Grid */}
        <div className="mb-6">
          <h2 className="font-display text-2xl text-ink-50 mb-6 font-light">
            Current Catalogue ({pieces.length})
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="aspect-[4/3] bg-ink-900 rounded-lg animate-pulse border border-white/5" />)}
          </div>
        ) : pieces.length === 0 ? (
          <div className="text-center py-24 glass-panel rounded-xl border border-white/10">
            <p className="text-ink-200 mb-4 font-light">No artworks in the catalogue yet.</p>
            <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-gold rounded-sm inline-flex items-center gap-2">
              <Plus size={16} /> Add First Artwork
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pieces.map((p) => {
              const isVideo = (p.media_type ?? 'image') === 'video';
              return (
                <div key={p.id} className="group glass-card rounded-xl overflow-hidden border border-white/10">
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink-900">
                    {isVideo ? (
                      <video src={p.image_url} muted className="w-full h-full object-cover" />
                    ) : (
                      <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      {isVideo && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ink-950/80 backdrop-blur-md border border-gold-500/30 text-gold-300 text-[10px] uppercase tracking-widest font-semibold">
                          <Film size={10} /> Video
                        </span>
                      )}
                      {p.featured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-gradient text-ink-950 text-[10px] uppercase tracking-widest font-semibold">
                          <Star size={10} className="fill-ink-950" /> Featured
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(p)}
                        className="w-9 h-9 rounded-full bg-ink-950/80 border border-white/10 backdrop-blur-md flex items-center justify-center text-ink-100 hover:text-gold-300 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="w-9 h-9 rounded-full bg-ink-950/80 border border-white/10 backdrop-blur-md flex items-center justify-center text-ink-100 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-display text-2xl text-ink-50 font-medium">{p.title}</h3>
                    <p className="text-xs text-ink-200 font-sans mt-1">{p.artist}{p.year ? `, ${p.year}` : ''}</p>
                    {p.price != null && (
                      <p className="text-sm font-display text-gold-400 font-semibold mt-3">
                        {p.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, required, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-ink-200 mb-2 font-medium">
        {label}{required && <span className="text-gold-400 ml-1">*</span>}
      </label>
      <input
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-ink-900 border border-white/10 rounded-md px-4 py-3 text-ink-50 focus:outline-none focus:border-gold-500 text-sm placeholder-ink-300"
      />
    </div>
  );
}
