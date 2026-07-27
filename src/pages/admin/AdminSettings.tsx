import { useState } from 'react';
import { Settings, Cloud, Upload, Loader2, Save, Film, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { uploadToR2 } from '@/lib/r2Storage';
import { SEO } from '@/components/SEO';

export default function AdminSettings() {
  const { siteSettings, updateSiteSettings } = useCMS();

  const [heroType, setHeroType] = useState<'image' | 'video'>(siteSettings.hero_media_type || 'image');
  const [heroUrl, setHeroUrl] = useState<string>(siteSettings.hero_media_url || '');
  const [uploading, setUploading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToR2(file, 'hero');
      setHeroUrl(url);
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      hero_media_type: heroType,
      hero_media_url: heroUrl,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <>
      <SEO title="Site Settings & Hero Media — NOUS ART CMS" description="Configure Hero Banner and Site Media" />

      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div className="pb-6 border-b border-white/10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 block mb-1">
            CMS System Configuration
          </span>
          <h1 className="font-display text-3xl font-light text-ink-50">
            Hero Media & <span className="font-serif italic gold-text-gradient font-normal">Site Settings</span>
          </h1>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Settings successfully updated and synchronized to public website!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 font-mono text-xs">
          {/* Hero Banner Box */}
          <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6">
            <h2 className="font-display text-2xl text-ink-50 font-light border-b border-white/10 pb-4 flex items-center gap-2">
              <Settings size={20} className="text-gold-400" />
              <span>Public Homepage Hero Media</span>
            </h2>

            {/* Media Type Selector */}
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

            {/* Cloudflare R2 Upload */}
            <div className="p-5 rounded-xl bg-ink-900/80 border border-white/10 space-y-3">
              <label className="block text-gold-400 uppercase text-[10px] font-bold flex items-center gap-1.5">
                <Cloud size={14} />
                <span>Upload New Hero Media to Cloudflare R2</span>
              </label>

              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept={heroType === 'video' ? 'video/*' : 'image/*'}
                  onChange={handleFileUpload}
                  className="text-xs text-ink-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-gold-500/10 file:text-gold-400 hover:file:bg-gold-500/20"
                />
                {uploading && <Loader2 size={16} className="animate-spin text-gold-400" />}
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

            {/* Preview Box */}
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
      </div>
    </>
  );
}
